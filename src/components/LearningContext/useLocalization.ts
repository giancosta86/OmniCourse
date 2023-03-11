import { useCallback, useMemo } from "react";
import {
  LocaleLike,
  IsoDateFormat,
  MeasureUnit,
  Dictionary
} from "@giancosta86/hermes";
import { Minutes, IsoDate } from "@giancosta86/time-utils";

const dateTimeFormatOptions: Readonly<Intl.DateTimeFormatOptions> = {
  day: "2-digit",
  month: "short",
  year: "2-digit"
};

export const useLocalization = (locale: LocaleLike, dictionary: Dictionary) => {
  const hourUnit = useMemo(
    () =>
      new MeasureUnit({
        singular: dictionary.translate("hour"),
        plural: dictionary.translate("hours")
      }),
    [dictionary]
  );

  const minuteUnit = useMemo(
    () =>
      new MeasureUnit({
        singular: dictionary.translate("minute"),
        plural: dictionary.translate("minutes")
      }),
    [dictionary]
  );

  const formatMinutes = useCallback(
    (minutes: Minutes) => {
      const hours = Math.round(minutes / 60);
      const actualMinutes = minutes % 60;
      return `${hours} ${hourUnit.declineFor(
        hours
      )}, ${actualMinutes} ${minuteUnit.declineFor(actualMinutes)}`;
    },
    [hourUnit, minuteUnit]
  );

  const formatIsoDate = useCallback(
    (isoDate: IsoDate) => {
      const isoDateFormat = new IsoDateFormat(locale, dateTimeFormatOptions);
      return isoDateFormat.format(isoDate);
    },
    [locale]
  );

  return {
    formatMinutes,
    formatIsoDate
  };
};
