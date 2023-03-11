import { List } from "@rimbu/list";
import {
  Subject,
  TaxonomyId,
  TaxonomyLevel,
  TaxonomyPath
} from "@giancosta86/omnicourse-core";
import { Minutes, IsoDate } from "@giancosta86/time-utils";
import { TaxonomyPreview } from "./TaxonomyPreview";

export interface LearningContext {
  taxonomyPreviews: List.NonEmpty<TaxonomyPreview>;
  selectedTaxonomyPreview: TaxonomyPreview;
  taxonomyPath?: TaxonomyPath;
  currentLevel?: TaxonomyLevel;
  onMobile: boolean;

  setSelectedTaxonomyId: (taxonomyId: TaxonomyId) => void;
  pushToTaxonomyPath: (subject: Subject) => void;
  revertTaxonomyPathTo: (taxonomyLevel: TaxonomyLevel) => void;
  formatMinutes: (minutes: Minutes) => string;
  formatIsoDate: (date: IsoDate) => string;
}
