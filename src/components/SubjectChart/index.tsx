import React, { useCallback, useMemo, useState } from "react";
import { Subject } from "../../Subject";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer
} from "recharts";
import { SubjectTooltip } from "./SubjectTooltip";
import { ChartSettings, createActualChartSettings } from "./ChartSettings";
import { useLearningContext } from "../LearningContext";

export interface Props {
  subjects: readonly Subject[];
  chartSettings?: Partial<ChartSettings>;
}

export const SubjectChart = ({ subjects, chartSettings }: Props) => {
  const {
    selectedTaxonomyKey,
    taxonomyPath,
    currentLevel,
    onMobile,
    pushToTaxonomyPath
  } = useLearningContext();

  const data = useMemo(
    () =>
      subjects.map(subject => {
        return {
          name: subject.name,
          value: subject.totalMinutes
        };
      }),
    [subjects]
  );

  const actualChartSettings = useMemo(
    () => createActualChartSettings(chartSettings),
    [chartSettings]
  );

  const colorPalette = actualChartSettings.colorPalette;

  const [subjectUnderMouse, setSubjectUnderMouse] = useState<
    Subject | undefined
  >(undefined);

  const performDrillDown = useCallback(
    (subject: Subject) => {
      setSubjectUnderMouse(undefined);
      pushToTaxonomyPath(subject);
    },
    [pushToTaxonomyPath]
  );

  const createCells = useCallback(() => {
    if (!taxonomyPath) {
      throw new Error("Missing taxonomy path!");
    }

    return subjects.map((subject, index) => (
      <Cell
        cursor="pointer"
        key={subject.name}
        fill={
          colorPalette[
            (taxonomyPath.subjectsInPreviousLevels + index) %
              colorPalette.length
          ]
        }
        onClick={() => performDrillDown(subject)}
        onMouseEnter={() => setSubjectUnderMouse(subject)}
        onMouseLeave={() => setSubjectUnderMouse(undefined)}
      />
    ));
  }, [colorPalette, subjects, performDrillDown, taxonomyPath]);

  type LegendLabel = { value: string };

  const onLegendLabelClicked = useCallback(
    (legendLabel: LegendLabel) => {
      const subjectName = legendLabel.value;
      const subject = subjects.find(subject => subject.name == subjectName);

      if (!subject) {
        throw new Error("Legend labels out of sync!");
      }

      pushToTaxonomyPath(subject);
    },
    [subjects, pushToTaxonomyPath]
  );

  if (!selectedTaxonomyKey) {
    throw new Error("There should be a taxonomy key here!");
  }

  if (!currentLevel) {
    throw new Error("There should be a taxonomy level here!");
  }

  return (
    <ResponsiveContainer
      className="chartBox"
      width="100%"
      height={actualChartSettings.chartHeight}
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          isAnimationActive={actualChartSettings.isAnimationActive}
          animationDuration={actualChartSettings.animationDuration}
          label={item =>
            actualChartSettings.canShowLabel({
              taxonomyKey: selectedTaxonomyKey,
              taxonomyLevel: currentLevel,
              item,
              onMobile
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
          content={
            <SubjectTooltip
              subject={subjectUnderMouse}
              totalMinutes={currentLevel?.totalMinutes ?? 0}
            />
          }
        />

        <Legend iconType="star" onClick={onLegendLabelClicked} />
      </PieChart>
    </ResponsiveContainer>
  );
};
