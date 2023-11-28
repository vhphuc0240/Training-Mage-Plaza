import { useState } from "react";
import { api } from "../../helpers/api";

const useUpdateApi = () => {
  const [updating, setUpdating] = useState(false);
  const handleUpdate = async (url, data) => {
    try {
      setUpdating(true);
      const resp = await api(url, "PUT", { data });
      if (resp.success) {
        return resp.data;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setUpdating(false);
    }
  };
  return { updating, handleUpdate };
};
export default useUpdateApi;
