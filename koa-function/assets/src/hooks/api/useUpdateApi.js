import { useState } from "react";
import { api } from "../../helpers/api";
import useToast from "../useToast";

const useUpdateApi = () => {
  const [updating, setUpdating] = useState(false);
  const { setIsActiveToast, setToastContent } = useToast();

  const handleUpdate = async (url, data) => {
    try {
      setUpdating(true);
      const resp = await api(url, "PUT", { data });
      if (resp.success) {
        setToastContent(resp.message);
        return resp.data;
      }
    } catch (e) {
      setToastContent(e.message);
      console.log(e);
    } finally {
      setUpdating(false);
      setIsActiveToast(true);
    }
  };
  return { updating, handleUpdate };
};
export default useUpdateApi;
