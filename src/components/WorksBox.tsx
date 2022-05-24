import React from "react";
import { Work } from "../Work";
import { useLearningContext } from "./LearningContext";
import { WorkList } from "./WorkList";
import { WorkTable } from "./WorkTable";

export interface Props {
  works: readonly Work[];
}

export const WorksBox = ({ works }: Props) => {
  const { onMobile } = useLearningContext();

  return (
    <div className="worksBox">
      {onMobile ? <WorkList works={works} /> : <WorkTable works={works} />}
    </div>
  );
};
