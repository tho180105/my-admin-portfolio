import { Select } from "antd";
import React from "react";

const options = [
  {
    label: "React",
    value: "react",
  },
  {
    label: "Java",
    value: "java",
  },

  {
    label: "Flutter",
    value: "flutter",
  },

  {
    label: "Hibernate",
    value: "hibernate",
  },

  {
    label: "Spring",
    value: "spring",
  },

  {
    label: "Postgresql",
    value: "postgresql",
  },

  {
    label: "Oracle",
    value: "oracle",
  },

  {
    label: "Ant Design",
    value: "antdesign",
  },
];

function TechsComponent({ onChange, value }) {
  function onChangeValue(value) {
    onChange(value);
  }

  return (
    <Select
      onChange={onChangeValue}
      allowClear
      placeholder={"Please select"}
      mode="multiple"
      style={{ width: "100%" }}
      value={value}
      options={options}
    />
  );
}

export default TechsComponent;
