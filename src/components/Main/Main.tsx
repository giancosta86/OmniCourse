import React, { ReactNode, useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import { Download } from "@giancosta86/marinero";
import { useLearningContext } from "../LearningContext";
import { LoadingBox } from "./LoadingBox";
import { ChartSettings } from "./SubjectChart";
import { PathBar } from "./PathBar";
import { CurrentLevelBox } from "./CurrentLevelBox";

export interface MainProps {
  loadingNode: ReactNode;
  taxonomySelectLabel: string;
  chartSettings?: Partial<ChartSettings>;
}

export const Main = ({
  loadingNode,
  taxonomySelectLabel,
  chartSettings
}: MainProps) => {
  const { currentLevel } = useLearningContext();

  const screenshotBoxElement = useRef<HTMLDivElement>(null);

  const downloadAsPng = useCallback(async () => {
    if (!screenshotBoxElement.current || !currentLevel) {
      return;
    }

    const screenshotCanvas = await html2canvas(screenshotBoxElement.current, {
      ignoreElements: element => element.className == "taxonomySelectionBox"
    });

    const screenshotDataUrl = screenshotCanvas.toDataURL("image/png");

    Download.fromDataUrl({
      dataUrl: screenshotDataUrl,
      suggestedFileName: `${currentLevel.name}.png`
    });
  }, [currentLevel]);

  const downloadAsJson = useCallback(() => {
    if (!currentLevel) {
      return;
    }

    Download.objectAsJson({
      sourceObject: currentLevel.items,
      suggestedFileName: `${currentLevel.name}.json`
    });
  }, [currentLevel]);

  const download = currentLevel
    ? currentLevel.hasSubjects
      ? downloadAsPng
      : downloadAsJson
    : undefined;

  return (
    <>
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
    </>
  );
};
