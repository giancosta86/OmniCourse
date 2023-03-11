import React from "react";
import { Work } from "@giancosta86/omnicourse-core";

export interface WorkTitleProps {
  work: Work;
}

export const WorkTitle = ({ work }: WorkTitleProps) => (
  <>
    {work.url ? (
      <a href={work.url.toString()}>{work.title}</a>
    ) : (
      <>{work.title}</>
    )}
  </>
);
