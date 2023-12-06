import { useState } from "react";
import { api } from "../../helpers/api";
import useToast from "../useToast";

const useCreateApi = ({ url }) => {
  const [creating, setCreating] = useState(false);
  const { setIsActiveToast, setToastContent } = useToast();
  const handleCreate = async (data) => {
    try {
      setCreating(true);
      const resp = await api(url, "POST", { data });
      if (resp.success) {
        setToastContent(resp.message);
        return resp.data;
      }
    } catch (e) {
      setToastContent(e.message);
      console.log(e);
    } finally {
      setCreating(false);
      setIsActiveToast(true);
    }
  };
  return { creating, handleCreate };
};

export default useCreateApi;
