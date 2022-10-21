import React, { ReactNode } from "react";
import classNames from "classnames";
import { TaxonomyRepository } from "@giancosta86/omnicourse-core";
import {
  LearningContextProvider,
  TaxonomyKeysFetcher
} from "./LearningContext";
import { Main } from "./Main";
import { ChartSettings } from "./SubjectChart";

export interface Props {
  onMobile: boolean;
  customClassName?: string;
  taxonomySelectLabel: string;
  taxonomyKeysFetcher: TaxonomyKeysFetcher;
  taxonomyRepository: TaxonomyRepository;
  loadingNode: ReactNode;
  chartSettings?: Partial<ChartSettings>;
}

export const OmniCourse = ({
  onMobile,
  customClassName,
  taxonomySelectLabel,
  taxonomyKeysFetcher,
  taxonomyRepository,
  loadingNode,
  chartSettings
}: Props) => {
  return (
    <div className={classNames("omniCourse", customClassName)}>
      <LearningContextProvider
        taxonomyKeysFetcher={taxonomyKeysFetcher}
        taxonomyRepository={taxonomyRepository}
        onMobile={onMobile}
      >
        <Main
          loadingNode={loadingNode}
          taxonomySelectLabel={taxonomySelectLabel}
          chartSettings={chartSettings}
        />
      </LearningContextProvider>
    </div>
  );
};
