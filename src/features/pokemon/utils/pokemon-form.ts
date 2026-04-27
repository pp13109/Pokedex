import type {
  PokemonFormType,
  PokemonVariety,
} from "@/features/pokemon/types/pokemon-api";

const POKEMON_REGIONAL_FORMS = ["alola", "galar", "hisui", "paldea"];

const POKEMON_OTHER_FORMS = {
  extra: [
    "pikachu-rock-star",
    "pikachu-belle",
    "pikachu-pop-star",
    "pikachu-phd",
    "pikachu-libre",
    "pikachu-cosplay",
    "pikachu-original-cap",
    "pikachu-hoenn-cap",
    "pikachu-sinnoh-cap",
    "pikachu-unova-cap",
    "pikachu-kalos-cap",
    "pikachu-alola-cap",
    "pikachu-partner-cap",
    "pikachu-starter",
    "pikachu-world-cap",
    "eevee-starter",
    "basculin-blue-striped",
    "basculin-white-striped",
    "greninja-battle-bond",
    "pumpkaboo-small",
    "pumpkaboo-large",
    "pumpkaboo-super",
    "gourgeist-small",
    "gourgeist-large",
    "gourgeist-super",
    "zygarde-10-power-construct",
    "zygarde-50-power-construct",
    "rockruff-own-tempo",
    "minior-orange-meteor",
    "minior-yellow-meteor",
    "minior-green-meteor",
    "minior-blue-meteor",
    "minior-indigo-meteor",
    "minior-violet-meteor",
    "minior-orange",
    "minior-yellow",
    "minior-green",
    "minior-blue",
    "minior-indigo",
    "minior-violet",
    "magearna-original-mega",
    "cramorant-gulping",
    "cramorant-gorging",
    "zarude-dada",
    "tatsugiri-droopy",
    "tatsugiri-stretchy",
    "tatsugiri-droopy-mega",
    "tatsugiri-stretchy-mega",
    "koraidon-limited-build",
    "koraidon-sprinting-build",
    "koraidon-swimming-build",
    "koraidon-gliding-build",
    "miraidon-low-power-mode",
    "miraidon-drive-mode",
    "miraidon-aquatic-mode",
    "miraidon-glide-mode",
  ],
  female: "-female",
  totem: "-totem",
};

const regionalFormsRegex = new RegExp(`-(${POKEMON_REGIONAL_FORMS.join("|")})`);
const otherFormsRegex = new RegExp(
  `^(${POKEMON_OTHER_FORMS.extra.join("|")})$`,
);
const otherFormsFemaleRegex = new RegExp(`(${POKEMON_OTHER_FORMS.female})$`);
const otherFormsTotemRegex = new RegExp(`(${POKEMON_OTHER_FORMS.totem})`);

export function classifyVariety(
  name: string,
  isDefault: boolean,
): PokemonFormType[] {
  if (isDefault) return ["default"];
  if (otherFormsRegex.test(name) || otherFormsTotemRegex.test(name))
    return ["other"];

  const types: PokemonFormType[] = [];
  if (name.includes("-mega") || name.includes("-primal")) types.push("mega");
  if (name.includes("-gmax")) types.push("gmax");
  if (regionalFormsRegex.test(name)) types.push("regional");
  if (types.length === 0) types.push("altered");

  return types;
}

export function filterPokemonVarieties(
  filters: {
    filterMega: boolean;
    filterGmax: boolean;
    filterRegional: boolean;
    filterAltered: boolean;
  },
  allVarietiesList: PokemonVariety[],
) {
  const anyFilterActive =
    filters.filterMega ||
    filters.filterGmax ||
    filters.filterRegional ||
    filters.filterAltered;

  return allVarietiesList.filter((v) => {
    if (!anyFilterActive) return v.formType.includes("default");
    if (v.formType.includes("other")) return false;
    return (
      v.formType.includes("default") ||
      (filters.filterMega && v.formType.includes("mega")) ||
      (filters.filterGmax && v.formType.includes("gmax")) ||
      (filters.filterRegional && v.formType.includes("regional")) ||
      (filters.filterAltered && v.formType.includes("altered"))
    );
  });
}
