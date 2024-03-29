import React, { ReactNode, useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import { downloadDataUrl, downloadJson } from "./downloads";
import { useLearningContext } from "./LearningContext";
import { LoadingBox } from "./LoadingBox";
import { PathBar } from "./PathBar";
import { ChartSettings } from "./SubjectChart";
import { CurrentLevelBox } from "./CurrentLevelBox";

export interface Props {
  loadingNode: ReactNode;
  taxonomySelectLabel: string;
  chartSettings?: Partial<ChartSettings>;
}

export const Main = ({
  loadingNode,
  taxonomySelectLabel,
  chartSettings
}: Props) => {
  const { taxonomyKeys, currentLevel } = useLearningContext();

  const screenshotBoxElement = useRef<HTMLDivElement>(null);

  const downloadAsPng = useCallback(async () => {
    if (!screenshotBoxElement.current || !currentLevel) {
      return;
    }

    const screenshotCanvas = await html2canvas(screenshotBoxElement.current, {
      ignoreElements: element => element.className == "taxonomySelectionBox"
    });

    const screenshotDataUrl = screenshotCanvas.toDataURL("image/png");

    downloadDataUrl(screenshotDataUrl, `${currentLevel.name}.png`);
  }, [currentLevel]);

  const downloadAsJson = useCallback(() => {
    if (!currentLevel) {
      return;
    }

    downloadJson(currentLevel.items, `${currentLevel.name}.json`);
  }, [currentLevel]);

  const download = currentLevel
    ? currentLevel.containsSubjects
      ? downloadAsPng
      : downloadAsJson
    : undefined;

  return (
    <LoadingBox isLoading={!taxonomyKeys} loadingNode={loadingNode}>
      <div ref={screenshotBoxElement} className="screenshotBox">
        <PathBar taxonomySelectLabel={taxonomySelectLabel} />

        <LoadingBox isLoading={!currentLevel} loadingNode={loadingNode}>
          <CurrentLevelBox chartSettings={chartSettings} />
        </LoadingBox>
      </div>

      {download && (
        <div className="downloadBox">
          <button className="download" onClick={download}>
            ⬇️ Download
          </button>
        </div>
      )}
    </LoadingBox>
  );
};
