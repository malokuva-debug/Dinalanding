import type { CSSProperties } from "react";
import type { ThemeColors } from "@/lib/blocks/types";

export function themeToCssVars(theme: ThemeColors): CSSProperties {
  return {
    "--color-ink": theme.ink,
    "--color-ink-2": theme.ink2,
    "--color-cream": theme.cream,
    "--color-rose": theme.rose,
    "--color-gold": theme.gold,
    "--color-mist": theme.mist,
  } as CSSProperties;
}
