/* eslint-disable */
import { useEffect, useState } from "react";
import { getListProvince, getListDistrict, getListWard } from "~/api/common";

export default function useAdminDivision(
  province,
  district,
  ward,
  setCountry,
  setDistrict,
  setWard
) {
  const [listCountry] = useState([
    {
      value: "Việt Nam",
      label: "Việt Nam",
    },
  ]);
  const [listProvince, setListProvince] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listWard, setListWard] = useState([]);

  useEffect(() => {
    setCountry(listCountry[0].value);
    getListProvince().then((result) => {
      if (result.success) {
        const list = formatList(result.message.data.data);
        setListProvince(list);
      }
    });
  }, []);

  useEffect(() => {
    if (listProvince.length > 0 && province) {
      const provinceIndex = listProvince.findIndex(
        (item) => item.value == province || item.value == province.areaCode
      );
      if (provinceIndex > -1) {
        getListDistrict(listProvince[provinceIndex].value).then((result) => {
          if (result.success) {
            const list = formatList(result.message.data.data);
            setListDistrict(list);
            const checkOldDistrict = findDistrict(list, district);
            if (checkOldDistrict === -1) {
              setDistrict("");
            }
          }
        });
      }
    }
  }, [province, listProvince]);

  useEffect(() => {
    if (!district) {
      setListWard([]);
      setWard("");
    }

    if (listDistrict.length > 0 && district) {
      const districtIndex = listDistrict.findIndex(
        (item) => item.value == district || item.value == district.areaCode
      );
      if (districtIndex > -1) {
        getListWard(listDistrict[districtIndex].value).then((result) => {
          if (result.success) {
            const list = formatList(result.message.data.data);
            setListWard(list);
            const checkOldWard = findWard(list, ward);
            if (checkOldWard === -1) setWard("");
          }
        });
      }
    }
  }, [district, listDistrict]);

  function formatList(list) {
    return list.map((item) => {
      let result = item.name;
      let value = item.areaCode;
      // const listRemove = ["Tỉnh ", "Thành phố ", "Thị xã ", "Quận ", "Huyện ", "Phường ", "Xã "];
      // listRemove.map((element) => {
      //   result = result.replace(element, "");
      // });

      return {
        value: value,
        label: result,
        item: item,
      };
    });
  }

  function findDistrict(listDistrict, currentDistrict) {
    return listDistrict.findIndex(
      (item) => item.value == currentDistrict.areaCode || item.value == currentDistrict
    );
  }

  function findWard(listWard, currentWard) {
    return listWard.findIndex(
      (item) => item.value == currentWard.areaCode || item.value == currentWard
    );
  }

  return {
    listCountry,
    listProvince,
    listDistrict,
    listWard,
  };
}
