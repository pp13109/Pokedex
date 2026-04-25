import {
  getDarkBorderColor,
  getTextTypeColor,
  getTypeColor,
} from "@/features/pokemon/utils/pokemon-colors";

type PokemonTypeBadgeProps = {
  type: string;
};

export function PokemonTypeBadge({ type }: PokemonTypeBadgeProps) {
  const normalizedType = type.toLowerCase();

  let typeColorBg = getTypeColor(normalizedType, 0.15);
  let typeColorBorder = getTypeColor(normalizedType, 0.3);
  let typeColorText = getTextTypeColor(normalizedType);

  if (normalizedType === "dark") {
    typeColorBg = getTypeColor(normalizedType, 0.60);
    typeColorBorder = getDarkBorderColor();
  }

  const style = `bg-(--type-color-bg) border-(--type-color-border) text-(--type-color-text)`;

  return (
    <span
      style={
        {
          "--type-color-bg": typeColorBg,
          "--type-color-border": typeColorBorder,
          "--type-color-text": typeColorText,
        } as React.CSSProperties
      }
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${style}`}
    >
      {type}
    </span>
  );
}
