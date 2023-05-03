import React, { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import * as locales from 'date-fns/locale';
import { useIntl } from 'react-intl';

import { messageToString } from '@utils/message';
import { messageIdConcat } from '@utils/message-id-concat';

import classes from './date-time-input.module.scss';
import 'react-datepicker/dist/react-datepicker.css';

const m = messageIdConcat('date_time_picker');

type Props = {
  defaultDate?: Date;
  overrideDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (date: Date | undefined) => void;
  filterDate?: (date: Date) => boolean;
  filterTime?: (date: Date) => boolean;
};

export const DateTimeInput = ({
  defaultDate,
  overrideDate,
  disabled,
  placeholder,
  onChange,
  filterDate,
  filterTime,
}: Props) => {
  const intl = useIntl();

  const [dateOverridden, setDateOverridden] = useState<boolean>(
    Boolean(overrideDate),
  );
  const [dateTime, setDateTime] = useState<Date | undefined>(defaultDate);

  const setDateTimeWrapper = useCallback(
    (date: Date | undefined) => {
      setDateTime(date);

      if (onChange) {
        onChange(date);
      }
    },
    [onChange, setDateTime],
  );

  useEffect(() => {
    if (overrideDate) {
      setDateOverridden(true);
      setDateTime(overrideDate);
    }
  }, [overrideDate]);

  return (
    <DatePicker
      className={clsx(classes.datePicker, disabled && classes.disabled)}
      onChange={(date) => setDateTimeWrapper(date ?? undefined)}
      locale={locales[intl.locale as keyof typeof locales]}
      // input options
      selected={dateOverridden ? overrideDate : dateTime}
      placeholderText={
        placeholder ?? messageToString({ id: m('input.placeholder') }, intl)
      }
      // time selector
      showTimeSelect
      timeFormat="p"
      timeIntervals={15}
      dateFormat="Pp"
      timeCaption={messageToString({ id: m('input.time.label') }, intl)}
      // popper
      popperPlacement="right-end"
      showPopperArrow
      disabled={disabled}
      popperModifiers={[
        {
          name: 'offset',
          options: {
            offset: [5, 0],
          },
        },
        {
          name: 'preventOverflow',
          options: {
            rootBoundary: 'viewport',
            tether: false,
            altAxis: true,
          },
        },
      ]}
      // filters
      filterDate={filterDate}
      filterTime={filterTime}
    />
  );
};
