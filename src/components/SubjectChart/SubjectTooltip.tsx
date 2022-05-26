import React from "react";
import { TooltipProps } from "recharts/types/component/Tooltip";
import { formatDuration } from "../../formatting";
import { Subject } from "../../Subject";

export type Props = TooltipProps<number, string> & {
  subject?: Subject;
  totalMinutes: number;
};

export const SubjectTooltip = ({ subject, totalMinutes }: Props) => {
  if (!(subject && totalMinutes)) {
    return null;
  }

  const subjectPercentage = (subject.totalMinutes / totalMinutes) * 100;

  return (
    <div className="tooltip">
      <label>{subject.name}</label>
      <span className="percentage">({subjectPercentage.toFixed(2)}%)</span>
      <p className="duration">{formatDuration(subject.totalMinutes)}</p>

      <p className="instructions">(click to explore)</p>
    </div>
  );
};
