import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer
} from "recharts";
import { RSet } from "@rimbu/collection-types";
import { Subject } from "@giancosta86/omnicourse-core";
import { useLearningContext } from "../../LearningContext";
import { SubjectTooltip } from "./SubjectTooltip";
import { ChartSettings, LabelVisibilityParams } from "./ChartSettings";
import { defaultColorPalette } from "./colors";

export interface SubjectChartProps {
  subjects: RSet<Subject>;
  chartSettings?: Partial<ChartSettings>;
}

function defaultCanShowLabel({ onMobile, item }: LabelVisibilityParams) {
  return !onMobile && item.percent > 0.01;
}

export function createActualChartSettings(
  inputChartSettings?: Partial<ChartSettings>
): ChartSettings {
  return {
    isAnimationActive: inputChartSettings?.isAnimationActive ?? true,
    animationDuration: inputChartSettings?.animationDuration ?? 500,
    colorPalette: inputChartSettings?.colorPalette ?? defaultColorPalette,
    outerRadius: inputChartSettings?.outerRadius ?? "75%",
    innerRadius: inputChartSettings?.innerRadius,
    chartHeight: inputChartSettings?.chartHeight ?? 450,
    canShowLabel: inputChartSettings?.canShowLabel ?? defaultCanShowLabel
  };
}

export const SubjectChart = ({
  subjects,
  chartSettings
}: SubjectChartProps) => {
  const {
    selectedTaxonomyPreview,
    taxonomyPath,
    currentLevel,
    onMobile,
    pushToTaxonomyPath
  } = useLearningContext();

  const [repaintNeeded, setRepaintNeeded] = useState(false);

  useLayoutEffect(() => {
    if (repaintNeeded) {
      setRepaintNeeded(false);
    }
  }, [repaintNeeded]);

  const data = useMemo(
    () =>
      subjects.stream().map(subject => {
        return {
          name: subject.name,
          value: subject.minutes
        };
      }),
    [subjects]
  );

  const { actualChartSettings, colorPalette } = useMemo(() => {
    const actualChartSettings = createActualChartSettings(chartSettings);
    return {
      actualChartSettings,
      colorPalette: actualChartSettings.colorPalette
    };
  }, [chartSettings]);

  const performDrillDown = useCallback(
    (subject: Subject) => {
      pushToTaxonomyPath(subject);
      setRepaintNeeded(true);
    },
    [pushToTaxonomyPath]
  );

  const createCells = useCallback(() => {
    if (!taxonomyPath) {
      throw new Error("Missing taxonomy path!");
    }

    return subjects
      .stream()
      .map((subject, index) => (
        <Cell
          cursor="pointer"
          key={subject.name}
          fill={colorPalette.get(
            (taxonomyPath.topSubjectsInPreviousLevels + index) %
              colorPalette.length
          )}
          onClick={() => performDrillDown(subject)}
        />
      ));
  }, [colorPalette, subjects, performDrillDown, taxonomyPath]);

  type LegendLabel = { value: string };

  const onLegendLabelClicked = useCallback(
    (legendLabel: LegendLabel) => {
      const subjectName = legendLabel.value;
      const subject = subjects
        .stream()
        .find(subject => subject.name == subjectName);

      if (!subject) {
        throw new Error("Legend labels out of sync!");
      }

      performDrillDown(subject);
    },
    [subjects, performDrillDown]
  );

  if (!selectedTaxonomyPreview) {
    throw new Error("There should be a taxonomy preview here!");
  }

  if (!currentLevel) {
    throw new Error("There should be a taxonomy level here!");
  }

  if (repaintNeeded) {
    return (
      <div
        style={{
          width: "100%",
          height: actualChartSettings.chartHeight
        }}
      />
    );
  }

  return (
    <ResponsiveContainer
      className="chartBox"
      width="100%"
      height={actualChartSettings.chartHeight}
    >
      <PieChart>
        <Pie
          data={data.toArray()}
          dataKey="value"
          isAnimationActive={actualChartSettings.isAnimationActive}
          animationDuration={actualChartSettings.animationDuration}
          label={item =>
            actualChartSettings.canShowLabel({
              taxonomyPreview: selectedTaxonomyPreview,
              taxonomyLevel: currentLevel,
              item,
              onMobile: onMobile ?? false
            })
              ? item.name
              : null
          }
          labelLine={!onMobile}
          cx="50%"
          cy="50%"
          outerRadius={actualChartSettings.outerRadius}
          innerRadius={actualChartSettings.innerRadius}
        >
          {createCells()}
        </Pie>

        <Tooltip
          content={<SubjectTooltip totalMinutes={currentLevel?.minutes ?? 0} />}
        />

        <Legend iconType="star" onClick={onLegendLabelClicked} />
      </PieChart>
    </ResponsiveContainer>
  );
};
