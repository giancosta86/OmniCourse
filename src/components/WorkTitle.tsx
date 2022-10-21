import React from "react";
import { Work } from "@giancosta86/omnicourse-core";

export interface Props {
  work: Work;
}

export const WorkTitle = ({ work }: Props) => (
  <>{work.url ? <a href={work.url}>{work.title}</a> : <>{work.title}</>}</>
);
