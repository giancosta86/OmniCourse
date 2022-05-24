import React from "react";
import { Work } from "../Work";
import { formatDate, formatDuration } from "../formatting";
import { WorkTitle } from "./WorkTitle";

export interface Props {
  works: readonly Work[];
}

export const WorkList = ({ works }: Props) => (
  <ul className="worksList">
    {works.map(work => (
      <li key={work.key}>
        <p className="title">
          <WorkTitle work={work} />
          {work.kind ? ` (${work.kind})` : null}
        </p>

        <p className="timeInfo">
          {formatDuration(work.totalMinutes)}
          {work.completionDate ? ` - ${formatDate(work.completionDate)}` : null}
        </p>

        {work.certificateUrl && (
          <p className="certificate">
            <a href={work.certificateUrl}>View certificate</a>
          </p>
        )}
      </li>
    ))}
  </ul>
);
