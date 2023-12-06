import { useState } from "react";
import { api } from "../../helpers/api";
import useToast from "../useToast";

const useDeleteApi = () => {
  const [deleting, setDeleting] = useState(false);
  const { setIsActiveToast, setToastContent } = useToast();

  const handleDelete = async (url, data = {}) => {
    try {
      setDeleting(true);
      const resp = await api(url, "DELETE", { data });
      if (resp.success) {
        setToastContent(resp.message);
        return resp.data;
      }
    } catch (e) {
      setToastContent(e.message);
      console.log(e);
    } finally {
      setIsActiveToast(true);
      setDeleting(false);
    }
  };
  return { deleting, handleDelete };
};
export default useDeleteApi;
