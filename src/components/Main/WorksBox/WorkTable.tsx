import React from "react";
import { RSet } from "@rimbu/collection-types";
import { Work } from "@giancosta86/omnicourse-core";
import { useLearningContext } from "../../LearningContext";
import { WorkTitle } from "./WorkTitle";

export interface WorkTableProps {
  works: RSet<Work>;
}

export const WorkTable = ({ works }: WorkTableProps) => {
  const { formatMinutes, formatIsoDate } = useLearningContext();

  const showKind = works.stream().some(work => !!work.kind);
  const showCompletionDate = works.stream().some(work => !!work.completionDate);
  const showCertificateUrl = works.stream().some(work => !!work.certificateUrl);

  return (
    <table className="worksTable">
      <thead>
        <tr>
          <td className="title">Title</td>
          <td className="duration">Duration</td>
          {showKind && <td className="kind">Kind</td>}
          {showCompletionDate && (
            <td className="completionDate">Completion date</td>
          )}
          {showCertificateUrl && (
            <td className="certificateUrl">Certificate</td>
          )}
        </tr>
      </thead>
      <tbody>
        {works.stream().map((work, index) => (
          <tr key={index}>
            <td className="title">
              <WorkTitle work={work} />
            </td>
            <td className="duration">{formatMinutes(work.minutes)}</td>
            {showKind && <td className="kind">{work.kind}</td>}
            {showCompletionDate && (
              <td className="completionDate">
                {work.completionDate && formatIsoDate(work.completionDate)}
              </td>
            )}
            {showCertificateUrl && (
              <td className="certificateUrl">
                {work.certificateUrl && (
                  <a href={work.certificateUrl.toString()}>View certificate</a>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
