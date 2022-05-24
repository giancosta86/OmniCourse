import React from "react";
import { Work } from "../Work";

export interface Props {
  work: Work;
}

export const WorkTitle = ({ work }: Props) => (
  <>{work.url ? <a href={work.url}>{work.title}</a> : <>{work.title}</>}</>
);
