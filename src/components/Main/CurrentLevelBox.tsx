import React from "react";
import { Subject, Work } from "@giancosta86/omnicourse-core";
import { SubjectChart, ChartSettings } from "./SubjectChart";
import { useLearningContext } from "../LearningContext";
import { WorksBox } from "./WorksBox";
import { RSet } from "@rimbu/collection-types";

export interface CurrentLevelBoxProps {
  chartSettings?: Partial<ChartSettings>;
}

export const CurrentLevelBox = ({ chartSettings }: CurrentLevelBoxProps) => {
  const { currentLevel, formatMinutes } = useLearningContext();

  if (!currentLevel) {
    throw new Error("The current level should be accessible, here!");
  }

  return (
    <div className="currentLevelBox">
      {currentLevel.hasSubjects ? (
        <SubjectChart
          chartSettings={chartSettings}
          subjects={currentLevel.items as RSet<Subject>}
        />
      ) : (
        <WorksBox works={currentLevel.items as RSet<Work>} />
      )}

      <footer>
        <span className="totalDuration">
          <label>{`Total time for «${currentLevel.name}»:`}</label>
          <span>{formatMinutes(currentLevel.minutes)}</span>
        </span>
      </footer>
    </div>
  );
};
