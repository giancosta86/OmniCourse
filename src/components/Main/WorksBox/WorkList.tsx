import React from "react";
import { RSet } from "@rimbu/collection-types";
import { Work } from "@giancosta86/omnicourse-core";
import { useLearningContext } from "../../LearningContext";
import { WorkTitle } from "./WorkTitle";

export interface WorkListProps {
  works: RSet<Work>;
}

export const WorkList = ({ works }: WorkListProps) => {
  const { formatMinutes, formatIsoDate } = useLearningContext();

  return (
    <ul className="worksList">
      {works.stream().map((work, index) => (
        <li key={index}>
          <p className="title">
            <WorkTitle work={work} />
            {work.kind ? ` (${work.kind})` : null}
          </p>

          <p className="timeInfo">
            {formatMinutes(work.minutes)}
            {work.completionDate
              ? ` - ${formatIsoDate(work.completionDate)}`
              : null}
          </p>

          {work.certificateUrl && (
            <p className="certificate">
              <a href={work.certificateUrl.toString()}>View certificate</a>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
};
