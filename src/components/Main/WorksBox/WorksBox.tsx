import React from "react";
import { RSet } from "@rimbu/collection-types";
import { Work } from "@giancosta86/omnicourse-core";
import { useLearningContext } from "../../LearningContext";
import { WorkList } from "./WorkList";
import { WorkTable } from "./WorkTable";

export interface WorksBoxProps {
  works: RSet<Work>;
}

export const WorksBox = ({ works }: WorksBoxProps) => {
  const { onMobile } = useLearningContext();

  return (
    <div className="worksBox">
      {onMobile ? <WorkList works={works} /> : <WorkTable works={works} />}
    </div>
  );
};
