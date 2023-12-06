import { api } from "../../helpers/api";
import { useEffect, useState } from "react";

const useFetchApi = ({ url, limit = 20, sort = "asc" }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const fetchApi = async (limit, sort) => {
    try {
      setLoading(true);
      const limitQuery = limit ? "?limit=" + limit : "";
      const sortQuery = sort ? "&sort=" + sort : "";
      return await api(url + limitQuery + sortQuery);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApi(limit, sort).then((resp) => {
      if (resp.success) {
        setData(resp.data);
      }
    });
  }, []);
  return { loading, fetchApi, data, setData };
};

export default useFetchApi;
