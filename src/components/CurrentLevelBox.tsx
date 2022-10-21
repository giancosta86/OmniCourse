import React from "react";
import { Subject, Work, formatDuration } from "@giancosta86/omnicourse-core";
import { SubjectChart, ChartSettings } from "./SubjectChart";
import { WorksBox } from "./WorksBox";
import { useLearningContext } from "./LearningContext";

export interface Props {
  chartSettings?: Partial<ChartSettings>;
}

export const CurrentLevelBox = ({ chartSettings }: Props) => {
  const { currentLevel } = useLearningContext();

  if (!currentLevel) {
    throw new Error("The current level should be accessible, here!");
  }

  return (
    <div className="currentLevelBox">
      {currentLevel.containsSubjects ? (
        <SubjectChart
          chartSettings={chartSettings}
          subjects={currentLevel.items as Subject[]}
        />
      ) : (
        <WorksBox works={currentLevel.items as Work[]} />
      )}

      <footer>
        <span className="totalDuration">
          <label>{`Total time for «${currentLevel.name}»:`}</label>
          <span>{formatDuration(currentLevel.totalMinutes)}</span>
        </span>
      </footer>
    </div>
  );
};
