import { useEffect, useState } from "react";
import { getAllSubListGroupCategory, getSubListCategory } from "~/api/common";

export default function useRelationIndices(parentIds, resetChildIds, blockChild) {
  const [parentList, setParentList] = useState([]);
  const [childrenListFull, setChildrenListFull] = useState([]);
  const [childrenList, setChildrenList] = useState([]);

  function handleGetListChild(arr) {
    if (arr?.length === 0) {
      setChildrenList(childrenListFull);
      return;
    }
    const newList = childrenListFull.filter((indice) => {
      const res = arr?.find((item) => item.id === indice.group.id || item === indice.group.id);
      if (res) {
        return indice;
      }
    });
    setChildrenList(newList);
  }

  const formatData = (arr) => {
    return arr?.map((item) => {
      item.value = item.id;
      item.label = item.name;
      return item;
    });
  };
  useEffect(() => {
    getAllSubListGroupCategory().then((res) => {
      if (res.success && res.message.status === 200) {
        const arr = formatData(res.message.data.data);
        setParentList(arr);
      }
    });

    getSubListCategory(0, 1000, undefined, undefined, undefined, undefined).then((res) => {
      if (res.success && res.message.status === 200) {
        const arr = formatData(res.message.data.data.rows);
        setChildrenListFull(arr);
        setChildrenList(arr);
      }
    });
  }, []);

  useEffect(() => {
    handleGetListChild(parentIds);
    if (resetChildIds && !blockChild) resetChildIds();
  }, [parentIds, blockChild]);

  return {
    parentList,
    childrenList,
  };
}
