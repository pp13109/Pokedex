export function normalizePokemonName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}
