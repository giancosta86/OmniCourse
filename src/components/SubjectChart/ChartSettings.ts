import { TaxonomyKey, TaxonomyLevel } from "@giancosta86/omnicourse-core";
import { ChartItem } from "./ChartItem";
import { defaultColorPalette } from "./colors";

export type LabelVisibilityParams = {
  taxonomyKey: TaxonomyKey;
  taxonomyLevel: TaxonomyLevel;
  item: ChartItem;
  onMobile: boolean;
};

export type LabelVisibilityPredicate = (
  input: LabelVisibilityParams
) => boolean;

export interface ChartSettings {
  colorPalette: readonly string[];
  isAnimationActive: boolean;
  animationDuration: number;
  outerRadius: number | string;
  innerRadius?: number | string;
  chartHeight: number;
  canShowLabel: LabelVisibilityPredicate;
}

function defaultCanShowLabel({ onMobile, item }: LabelVisibilityParams) {
  return !onMobile && item.percent > 0.01;
}

export function createActualChartSettings(
  inputChartSettings?: Partial<ChartSettings>
): ChartSettings {
  return {
    isAnimationActive: inputChartSettings?.isAnimationActive ?? true,
    animationDuration: inputChartSettings?.animationDuration ?? 500,
    colorPalette: inputChartSettings?.colorPalette ?? defaultColorPalette,
    outerRadius: inputChartSettings?.outerRadius ?? "75%",
    innerRadius: inputChartSettings?.innerRadius,
    chartHeight: inputChartSettings?.chartHeight ?? 450,
    canShowLabel: inputChartSettings?.canShowLabel ?? defaultCanShowLabel
  };
}
