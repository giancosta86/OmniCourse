import React from "react";
import { TooltipProps } from "recharts/types/component/Tooltip";
import { formatDuration } from "../../formatting";

export type Props = TooltipProps<number, string> & {
  totalMinutes: number;
};

export const SubjectTooltip = ({ active, payload, totalMinutes }: Props) => {
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
      <p className="duration">{formatDuration(subjectMinutes)}</p>

      <p className="instructions">(click to explore)</p>
    </div>
  );
};
