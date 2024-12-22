import { DatePicker } from "antd";
import React from "react";
import dayjs from "dayjs";

function DatePickerCustom({ onChange, formatValue, value }) {
  function onChangeValue(value) {
    const dayString = dayjs(value).format("DD/MM/YYYY");
    onChange(dayString);
  }

  const dateValue = value ? dayjs(value, formatValue || "DD/MM/YYYY") : null;

  return (
    <DatePicker
      allowClear={false}
      value={dateValue}
      format={formatValue || "DD/MM/YYYY"}
      onChange={onChangeValue}
    />
  );
}

export default DatePickerCustom;
