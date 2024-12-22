import { Tabs } from "antd";
import React from "react";
import useCreateTabItem from "./hooks/useCreateTabItem";
import { useRecoilValue } from "recoil";
import { currentLanguage } from "../../recoil/atom";


function RealProjects({ form }) {
  
  
  const { items, activeKey, onChangeActiveTab, onEdit} = useCreateTabItem(form);

  return (
    <Tabs
      type="editable-card"
      onChange={onChangeActiveTab}
      activeKey={activeKey}
      onEdit={onEdit}
      items={items}
    />
  );
}



export default RealProjects;
