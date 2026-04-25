export const ALPHA_BG = 0.25;

const rawTypeColors: Record<string, string> = {
  normal: "180 175 175", //#b4afaf - 400
  fire: "255 100 0", //#ff6400 - 600
  water: "0 188 255", //#00bcfe - 500
  electric: "250 200 0", //#fac800 - 500
  grass: "0 210 148", //#00d294 - 500
  ice: "110 245 255", //#6ef5ff - 300
  fighting: "240 80 80", //#f05050 - 500
  poison: "236 108 255", //#ec6cff - 400
  ground: "188 118 52", //#bc7652 - 500
  flying: "160 160 240", //#a0a0f0 - 300
  psychic: "255 80 182", //#ff50b6 - 400
  bug: "150 230 50", //#96e632 - 400
  rock: "162 155 112", //#a29b70 - 400
  ghost: "138 85 238", //#8a55ee - 500
  dragon: "77 77 200", //#4d4dc8 - 700
  dark: "20 30 40", //#141e28 - 950
  steel: "150 171 196", //#96abc4 - 400
  fairy: "255 162 174", //#ffa2ae - 300
};

const textTypeColors: Record<string, string> = {
  normal: "rgb(230 229 229)", //#e6e5e5 - 200
  fire: "rgb(255 218 165)", //#ffdaa5 - 200
  water: "rgb(182 234 255)", //#b6eaff - 200
  electric: "rgb(255 246 134)", //#fff686 - 200
  grass: "rgb(160 250 212)", //#a0fad4 - 200
  ice: "rgb(161 250 255)", //#a1faff - 200
  fighting: "rgb(254 202 202)", //#fecaca - 200
  poison: "rgb(246 206 255)", //#f6ceff - 200
  ground: "rgb(232 211 192)", //#e8d3c0 - 200
  flying: "rgb(205 206 248)", //#cdcef8 - 200
  psychic: "rgb(255 203 236)", //#ffcbec - 200
  bug: "rgb(211 249 157)", //#d3f99d - 200
  rock: "rgb(210 208 185)", //#d2d0b9 - 200
  ghost: "rgb(224 216 252)", //#e0d8fc - 200
  dragon: "rgb(201 215 252)", //#c9d7fc - 200
  dark: "rgb(206 221 233)", //#cedde9 - 200
  steel: "rgb(202 213 226)", //#cad5e2 - 200
  fairy: "rgb(255 204 211)", //#ffccd3 - 200
};

export function getTypeColor(type: string, alpha = ALPHA_BG): string {
  const raw = rawTypeColors[type] ?? "255 255 255";
  return `rgb(${raw} / ${alpha})`;
}

export function getPokemonTypeColors(types: string[], alpha = ALPHA_BG) {
  const primary = types[0].toLowerCase();
  const secondary = (types[1] ?? types[0]).toLowerCase();
  return {
    typeColor: getTypeColor(primary, alpha),
    typeColor2: getTypeColor(secondary, alpha),
  };
}

export function getTextTypeColor(type: string): string {
  return textTypeColors[type] ?? "rgb(255 255 255)";
}

export function getDarkBorderColor() {
  return "rgb(75 75 75 / 0.75)"; //#293e51 - 900;
}
