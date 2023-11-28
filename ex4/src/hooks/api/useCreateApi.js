import { useState } from "react";
import { api } from "../../helpers/api";

const useCreateApi = ({ url }) => {
  const [creating, setCreating] = useState(false);
  const handleCreate = async (data) => {
    try {
      setCreating(true);
      const resp = await api(url, "POST", { data });
      if (resp.success) {
        return resp.data;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setCreating(false);
    }
  };
  return { creating, handleCreate };
};

export default useCreateApi;
