import { List } from "@rimbu/list";
import { TaxonomyLevel } from "@giancosta86/omnicourse-core";
import { TaxonomyPreview } from "../../LearningContext";

export type ChartItem = Readonly<{
  [key: string]: unknown;
  name: string;
  percent: number;
}>;

export type LabelVisibilityParams = Readonly<{
  taxonomyPreview: TaxonomyPreview;
  taxonomyLevel: TaxonomyLevel;
  item: ChartItem;
  onMobile: boolean;
}>;

export type LabelVisibilityPredicate = (
  input: LabelVisibilityParams
) => boolean;

export interface ChartSettings {
  colorPalette: List<string>;
  isAnimationActive: boolean;
  animationDuration: number;
  outerRadius: number | string;
  innerRadius?: number | string;
  chartHeight: number;
  canShowLabel: LabelVisibilityPredicate;
}
