import type { PokemonEvolutionChain } from "@/features/pokemon/types/pokemon-detail";
import type {
  EvolutionChainResponse,
  EvolutionChainEvolvesToResponse,
  EvolutionChainDetailsResponse,
  PokemonResponse,
} from "@/features/pokemon/types/pokemon-api";
import { toTitleCase } from "@/shared/utils/format";
import { pokeApiFetch } from "@/features/pokemon/server/pokemon-api";
import { normalizePokemonName } from "@/features/pokemon/utils/format";

const REGIONAL_SUFFIXES = ["alola", "galar", "hisui", "paldea"];

const REGIONAL_LOCATIONS: Record<string, string> = {
  "ula-ula-island": "alola",
};

function getRegionalSuffix(name: string): string | null {
  return REGIONAL_SUFFIXES.find((r) => name.endsWith(`-${r}`)) ?? null;
}

function getDetailSourceSuffix(d: EvolutionChainDetailsResponse): string | null {
  return d.base_form ? getRegionalSuffix(d.base_form.name) : null;
}

function getDetailResultSuffix(
  d: EvolutionChainDetailsResponse,
  speciesName: string,
  speciesVarieties: string[],
): string | null {
  const candidate =
    (d.location && REGIONAL_LOCATIONS[d.location.name]) ??
    (d.region && REGIONAL_SUFFIXES.includes(d.region.name) ? d.region.name : null) ??
    (d.base_form && getRegionalSuffix(d.base_form.name));
  if (!candidate) return null;
  return speciesVarieties.includes(`${speciesName}-${candidate}`) ? candidate : null;
}

function findPathToSpecies(
  node: EvolutionChainEvolvesToResponse,
  target: string,
): EvolutionChainEvolvesToResponse[] | null {
  if (node.species.name === target) return [node];
  for (const child of node.evolves_to) {
    const sub = findPathToSpecies(child, target);
    if (sub) return [node, ...sub];
  }
  return null;
}

function findRegionalSuffixInChain(
  node: EvolutionChainEvolvesToResponse,
  speciesName: string,
): string | null {
  if (node.species.name === speciesName) {
    if (node.evolution_details.some((d) => d.base_form === null)) return null;
    for (const detail of node.evolution_details) {
      const suffix = detail.base_form && getRegionalSuffix(detail.base_form.name);
      if (suffix) return suffix;
    }
    return null;
  }
  for (const child of node.evolves_to) {
    const result = findRegionalSuffixInChain(child, speciesName);
    if (result) return result;
  }
  return null;
}

function chainHasRegionalForm(
  node: EvolutionChainEvolvesToResponse,
  suffix: string,
): boolean {
  if (
    node.evolution_details.some(
      (d) => d.base_form && getRegionalSuffix(d.base_form.name) === suffix,
    )
  )
    return true;
  return node.evolves_to.some((child) => chainHasRegionalForm(child, suffix));
}

export function getEvolutionChain(
  evolutionChain: EvolutionChainResponse,
  currentName: string,
  currentSpeciesName: string,
  chainSpeciesVarieties: Map<string, string[]>,
): PokemonEvolutionChain[] {
  const regionalSuffix =
    getRegionalSuffix(currentName) ??
    findRegionalSuffixInChain(evolutionChain.chain, currentSpeciesName);
  const hasRegionalForm =
    regionalSuffix !== null && chainHasRegionalForm(evolutionChain.chain, regionalSuffix);
  const pathToCurrent = findPathToSpecies(evolutionChain.chain, currentSpeciesName);
  const pathSpeciesSet = new Set(
    (pathToCurrent ?? [evolutionChain.chain]).map((n) => n.species.name),
  );
  const currentHasRegionalVariety = (chainSpeciesVarieties.get(currentSpeciesName) ?? []).some(
    (v) => getRegionalSuffix(v) !== null,
  );
  return collectEvolutions(
    evolutionChain.chain,
    null,
    1,
    currentName,
    currentSpeciesName,
    regionalSuffix,
    hasRegionalForm,
    chainSpeciesVarieties,
    pathSpeciesSet,
    false,
    currentHasRegionalVariety,
  );
}

function collectEvolutions(
  node: EvolutionChainEvolvesToResponse,
  parentChildren: EvolutionChainEvolvesToResponse[] | null,
  stage: number,
  currentName: string,
  currentSpeciesName: string,
  regionalSuffix: string | null,
  hasRegionalForm: boolean,
  chainSpeciesVarieties: Map<string, string[]>,
  pathSpeciesSet: Set<string>,
  pastCurrent: boolean,
  currentHasRegionalVariety: boolean,
): PokemonEvolutionChain[] {
  const isRoot = node.evolution_details.length === 0;
  const isCurrentSpecies = node.species.name === currentSpeciesName;
  const isAncestor = !isCurrentSpecies && !pastCurrent && pathSpeciesSet.has(node.species.name);
  const isOnPathOrDescendant = isCurrentSpecies || isAncestor || pastCurrent;

  if (!isOnPathOrDescendant) return [];

  const newPastCurrent = pastCurrent || isCurrentSpecies;
  const nodeVarieties = chainSpeciesVarieties.get(node.species.name) ?? [];

  const recurse = () =>
    node.evolves_to.flatMap((evolve) =>
      collectEvolutions(
        evolve,
        node.evolves_to,
        stage + 1,
        currentName,
        currentSpeciesName,
        regionalSuffix,
        hasRegionalForm,
        chainSpeciesVarieties,
        pathSpeciesSet,
        newPastCurrent,
        currentHasRegionalVariety,
      ),
    );

  const speciesHasRegionalSuffix =
    !!regionalSuffix && nodeVarieties.includes(`${node.species.name}-${regionalSuffix}`);

  if (isRoot) {
    const name = isCurrentSpecies
      ? currentName
      : regionalSuffix && hasRegionalForm && speciesHasRegionalSuffix
        ? `${node.species.name}-${regionalSuffix}`
        : node.species.name;
    return [{ name, stage, condition: null, imageUrl: null }, ...recurse()];
  }

  const hasRegionalAlternative = node.evolution_details.some(
    (d) => d.base_form && getRegionalSuffix(d.base_form.name),
  );
  const siblingHasOurRegionalForm =
    regionalSuffix !== null &&
    !!parentChildren &&
    parentChildren.some(
      (sib) =>
        sib !== node &&
        sib.evolution_details.some(
          (d) => d.base_form && getRegionalSuffix(d.base_form.name) === regionalSuffix,
        ),
    );

  const sourceApplicable = node.evolution_details.filter((d) => {
    const source = getDetailSourceSuffix(d);
    if (source === null) {
      if (siblingHasOurRegionalForm) return false;
      return regionalSuffix === null || !hasRegionalAlternative;
    }
    if (source === regionalSuffix) return true;
    if (regionalSuffix === null && !currentHasRegionalVariety) return true;
    return false;
  });

  if (sourceApplicable.length === 0) return [];

  const hasMultipleForms = sourceApplicable.length < node.evolution_details.length;

  if (isCurrentSpecies) {
    const matchingResult = sourceApplicable.filter(
      (d) => getDetailResultSuffix(d, node.species.name, nodeVarieties) === regionalSuffix,
    );
    const details = matchingResult.length > 0 ? matchingResult : sourceApplicable;
    return [
      { name: currentName, stage, condition: formatEvolutionCondition(details), imageUrl: null },
      ...recurse(),
    ];
  }

  const groups = new Map<string | null, EvolutionChainDetailsResponse[]>();
  for (const d of sourceApplicable) {
    const s = getDetailResultSuffix(d, node.species.name, nodeVarieties);
    if (!groups.has(s)) groups.set(s, []);
    groups.get(s)!.push(d);
  }

  let entries = Array.from(groups.entries()).map(([resultSuffix, details]) => {
    let name = node.species.name;
    if (resultSuffix) {
      name = `${node.species.name}-${resultSuffix}`;
    } else if (
      regionalSuffix &&
      hasRegionalForm &&
      hasMultipleForms &&
      speciesHasRegionalSuffix
    ) {
      name = `${node.species.name}-${regionalSuffix}`;
    }
    return { name, stage, condition: formatEvolutionCondition(details), imageUrl: null };
  });

  if (isAncestor) {
    const exact = entries.filter((e) => getRegionalSuffix(e.name) === regionalSuffix);
    entries = exact.length > 0 ? exact : entries.filter((e) => getRegionalSuffix(e.name) === null);
    return [...entries, ...recurse()];
  }

  const emittedNames = new Set(entries.map((e) => e.name));
  const extraVarietyEntries = nodeVarieties
    .filter((v) => {
      const suffix = getRegionalSuffix(v);
      if (!suffix) return false;
      if (v === currentName) return false;
      if (emittedNames.has(v)) return false;
      return !node.evolution_details.some(
        (d) =>
          d.base_form &&
          getRegionalSuffix(d.base_form.name) === suffix &&
          d.base_form.name.slice(0, -suffix.length - 1) === currentSpeciesName,
      );
    })
    .map((v) => {
      const suffix = getRegionalSuffix(v)!;
      const matchingDetail = node.evolution_details.find(
        (d) =>
          (d.base_form && getRegionalSuffix(d.base_form.name) === suffix) ||
          (d.region && d.region.name === suffix) ||
          (d.location && REGIONAL_LOCATIONS[d.location.name] === suffix),
      );
      const conditionDetails = matchingDetail ? [matchingDetail] : sourceApplicable;
      return {
        name: v,
        stage,
        condition: formatEvolutionCondition(conditionDetails),
        imageUrl: null,
      };
    });

  return [...entries, ...extraVarietyEntries, ...recurse()];
}

function formatEvolutionCondition(details: EvolutionChainDetailsResponse[]): string | null {
  if (details.length === 0) return null;
  return details.map(formatSingleCondition).join(" or ");
}

function formatSingleCondition(d: EvolutionChainDetailsResponse): string {
  const parts: string[] = [];

  switch (d.trigger.name) {
    case "level-up": {
      if (d.min_level) parts.push(`Level ${d.min_level}`);
      else if (d.min_happiness) parts.push("High Friendship");
      else if (d.min_beauty) parts.push("High Beauty");
      else if (d.min_affection) parts.push("High Affection");
      else if (d.known_move) parts.push(`Knowing ${toTitleCase(d.known_move.name)}`);
      else if (d.known_move_type)
        parts.push(`Knowing a ${toTitleCase(d.known_move_type.name)}-type move`);
      else parts.push("Level up");

      if (d.relative_physical_stats === 1) parts.push("(Attack > Defense)");
      else if (d.relative_physical_stats === -1) parts.push("(Defense > Attack)");
      else if (d.relative_physical_stats === 0) parts.push("(Attack = Defense)");

      if (d.time_of_day === "day") parts.push("during the day");
      else if (d.time_of_day === "night") parts.push("at night");
      else if (d.time_of_day === "dusk") parts.push("at dusk");

      if (d.location) parts.push(`at ${toTitleCase(d.location.name)}`);
      if (d.region) parts.push(`in ${toTitleCase(d.region.name)}`);
      if (d.held_item) parts.push(`holding ${toTitleCase(d.held_item.name)}`);
      if (d.party_species) parts.push(`with ${toTitleCase(d.party_species.name)} in party`);
      if (d.party_type) parts.push(`with a ${toTitleCase(d.party_type.name)}-type in party`);
      if (d.min_steps) parts.push(`after walking ${d.min_steps} steps with it`);
      if (d.needs_overworld_rain) parts.push("while raining");
      if (d.turn_upside_down) parts.push("(turn console upside down)");
      if (d.gender === 1) parts.push("(Female only)");
      else if (d.gender === 2) parts.push("(Male only)");
      break;
    }
    case "use-item": {
      parts.push(`Use ${toTitleCase(d.item!.name)}`);
      if (d.time_of_day === "day") parts.push("during the day");
      else if (d.time_of_day === "night") parts.push("at night");
      if (d.gender === 1) parts.push("(Female only)");
      else if (d.gender === 2) parts.push("(Male only)");
      break;
    }
    case "trade": {
      if (d.held_item) parts.push(`Trade holding ${toTitleCase(d.held_item.name)}`);
      else if (d.trade_species) parts.push(`Trade for ${toTitleCase(d.trade_species.name)}`);
      else parts.push("Trade");
      break;
    }
    case "shed":
      parts.push("Level 20 with empty party slot and Poké Ball in bag");
      break;
    case "spin":
      parts.push("Spin holding a Sweet");
      break;
    case "three-critical-hits":
      parts.push("Land 3 critical hits in one battle");
      break;
    case "take-damage": {
      const damage = d.min_damage_taken ?? 49;
      parts.push(`Lose ${damage}+ HP without fainting, then walk under the stone arch`);
      break;
    }
    case "tower-of-darkness":
      parts.push("Train at the Tower of Darkness");
      break;
    case "tower-of-waters":
      parts.push("Train at the Tower of Waters");
      break;
    case "agile-style-move": {
      const move = d.used_move ? toTitleCase(d.used_move.name) : "the move";
      const count = d.min_move_count ?? 20;
      parts.push(`Use ${move} in Agile Style ${count} times`);
      break;
    }
    case "strong-style-move": {
      const move = d.used_move ? toTitleCase(d.used_move.name) : "the move";
      const count = d.min_move_count ?? 20;
      parts.push(`Use ${move} in Strong Style ${count} times`);
      break;
    }
    case "use-move":
    case "recoil-damage": {
      const move = d.used_move ? toTitleCase(d.used_move.name) : "the move";
      const count = d.min_move_count ?? 20;
      parts.push(`Use ${move} ${count} times`);
      break;
    }
    default:
      parts.push(toTitleCase(d.trigger.name));
  }

  if (d.needs_multiplayer) parts.push("(requires multiplayer)");

  return parts.join(" ");
}

export async function enrichChainWithImages(
  chain: PokemonEvolutionChain[],
): Promise<PokemonEvolutionChain[]> {
  return Promise.all(
    chain.map(async (entry) => {
      try {
        const safeName = encodeURIComponent(normalizePokemonName(entry.name));
        const pokemon = await pokeApiFetch<PokemonResponse>(`/pokemon/${safeName}`);
        return { ...entry, imageUrl: getEvolutionImageUrl(pokemon) };
      } catch {
        return entry;
      }
    }),
  );
}

function getEvolutionImageUrl(pokemon: PokemonResponse): string | null {
  return (
    pokemon.sprites.other?.["home"]?.front_default ??
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default
  );
}
