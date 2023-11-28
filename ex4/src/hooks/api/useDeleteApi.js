import {useState} from "react";
import {api} from "../../helpers/api";

const useDeleteApi = () => {
    const [deleting, setDeleting] = useState(false);
    const handleDelete = async (url, data = {}) => {
        try {
            setDeleting(true);
            const resp = await api(url, "DELETE", {data});
            if (resp.success) {
                return resp.data;
            }
        } catch (e) {
            console.log(e);
        } finally {
            setDeleting(false);
        }
    };
    return {deleting, handleDelete};
};
export default useDeleteApi;
