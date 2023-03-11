import React, { ReactNode } from "react";

export interface LoadingBoxProps {
  isLoading: boolean;
  loadingNode: ReactNode;
  children: ReactNode;
}

export const LoadingBox = ({
  isLoading,
  loadingNode,
  children
}: LoadingBoxProps) =>
  isLoading ? (
    <div className="loadingBox">{loadingNode}</div>
  ) : (
    <> {children} </>
  );
