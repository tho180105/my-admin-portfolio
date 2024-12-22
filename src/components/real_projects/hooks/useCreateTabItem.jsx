import React, { useState, useRef, useEffect } from "react";
import TabContent from "../TabContent";
import { database } from "../../../firebaseConfig";
import { getData } from "../../../firebaseFunctions";
import { useRecoilValue } from "recoil";
import { currentLanguage } from "../../../recoil/atom";
import { uniqueId } from "lodash";

function useCreateTabItem(form) {
  const [activeKey, setActiveKey] = useState(0);
  const language = useRecoilValue(currentLanguage);
  const [items, setItems] = useState([]);
  const firstRender = useRef(false);


  useEffect(() => {
    if(firstRender.current) return;
    getRealProjects();
    firstRender.current = true;
  },[])

  async function getRealProjects() {
    const data = await getData(database, 'realProjects');

    if(!data) return
    
    Object.keys(data).forEach((key) => {
      const item = {
        key: key,
        label: data[key][language] ? data[key][language]['projectInfo']['title'] : 'New Project',
        children: <TabContent key={key} tabName={key}  />,
      };
      setItems((prevItems) => [...prevItems, item]);  
    })

    form.setFieldsValue({ realProjects:  data });
    setActiveKey(Object.keys(data)[0]);
  }


  
 
  function onChangeActiveTab(key) {
    setActiveKey(key);
  }

  function onEdit(targetKey, action) {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  }

  function remove(targetKey) {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  }


  function add() {
    const newActiveKey = uniqueId('project_') + Date.now().toString(36) + Math.random().toString(36).substr(2, 9); ;
    const newPanes = [...items];
    newPanes.push({
      label: 'New Project',
      children: (
        <TabContent key={newActiveKey} tabName={newActiveKey} />
      ),
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  }

  return { activeKey, items, onChangeActiveTab, onEdit, remove, add };
}

export default useCreateTabItem;
