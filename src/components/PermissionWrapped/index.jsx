import { cloneElement, useEffect, useState } from "react";
import { getLocalRolePermission } from "~/utils/storage";

export default function PermissionWrapped(props) {
  const { children, moduleCode, tabCode, componentCode, listCodeComponent } = props;
  //list code component ['parent1', 'parent2', 'parent3', 'parent4', ..., 'componentCode']
  const [canView, setCanView] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const checkPermission = (arr, listCode) => {
    const code = listCode?.shift();
    const foundComp = arr.find((item) => item.code === code);
    if (foundComp && listCode.length === 0) {
      setCanView(foundComp.canView);
      setCanEdit(foundComp.canEdit);
    } else if (foundComp && listCode.length > 0) checkPermission(foundComp.children, listCode);
  };

  useEffect(() => {
    const listModule = getLocalRolePermission();
    checkPermission(listModule, listCodeComponent);
  }, []);

  return <>{canView && cloneElement(children, { disabled: canEdit ? false : true })}</>;
}
