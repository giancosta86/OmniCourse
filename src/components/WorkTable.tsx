import React from "react";
import { Work, formatDate, formatDuration } from "@giancosta86/omnicourse-core";
import { WorkTitle } from "./WorkTitle";

export interface Props {
  works: readonly Work[];
}

export const WorkTable = ({ works }: Props) => {
  return (
    <table className="worksTable">
      <thead>
        <tr>
          <td className="title">Title</td>
          <td className="duration">Duration</td>
          <td className="kind">Kind</td>
          <td className="completionDate">Completion date</td>
          <td className="certificateUrl">Certificate</td>
        </tr>
      </thead>
      <tbody>
        {works.map(work => (
          <tr key={work.key}>
            <td className="title">
              <WorkTitle work={work} />
            </td>
            <td className="duration">{formatDuration(work.totalMinutes)}</td>
            <td className="kind">{work.kind}</td>
            <td className="completionDate">
              {work.completionDate && formatDate(work.completionDate)}
            </td>
            <td className="certificateUrl">
              {work.certificateUrl && (
                <a href={work.certificateUrl}>View certificate</a>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
