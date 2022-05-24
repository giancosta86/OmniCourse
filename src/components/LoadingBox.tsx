import React, { ReactNode } from "react";

export interface Props {
  isLoading: boolean;
  loadingNode: ReactNode;
  children: ReactNode;
}

export const LoadingBox = ({ isLoading, loadingNode, children }: Props) =>
  isLoading ? <div className="loadingBox">{loadingNode}</div> : <>{children}</>;
