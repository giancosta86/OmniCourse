import React from "react";
import { TooltipProps } from "recharts";
import { useLearningContext } from "../../LearningContext";

export type SubjectTooltipProps = TooltipProps<number, string> & {
  totalMinutes: number;
};

export const SubjectTooltip = ({
  active,
  payload,
  totalMinutes
}: SubjectTooltipProps) => {
  const { formatMinutes } = useLearningContext();

  if (!(active && payload && payload[0] && totalMinutes)) {
    return null;
  }

  const subjectName = payload[0].name;
  const subjectMinutes = payload[0].value ?? 0;
  const subjectPercentage = (subjectMinutes / totalMinutes) * 100;

  return (
    <div className="tooltip">
      <label>{subjectName}</label>
      <span className="percentage">({subjectPercentage.toFixed(2)}%)</span>
      <p className="duration">{formatMinutes(subjectMinutes)}</p>

      <p className="instructions">(click to explore)</p>
    </div>
  );
};
