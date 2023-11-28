import React from "react";
import {Page} from "@shopify/polaris";
import ListTodo from "../ListTodo";
import useModal from "../../hooks/useModal";
import useFetchApi from "../../hooks/api/useFetchApi";
import useCreateApi from "../../hooks/api/useCreateApi";

const BodyComponent = () => {
    const {handleCreate, creating} = useCreateApi({
        url: "/todo",
    });
    const {setIsOpen, CustomModal} = useModal({
        title: "Create Todo",
        onConfirm: (value) => handleSaveTodo(value),
        onClose: () => setIsOpen(false),
        loading: creating,
    });
    const {data, setData} = useFetchApi({url: "/todos"});
    const handleSaveTodo = async (value) => {
        const res = await handleCreate({
            title: value, status: "pending",
        });
        setData((prev) => [...prev, res]);
        setIsOpen(false);
    };

    const handleOpenModalCreateTodo = () => {
        setIsOpen(true);
    };

    return (<Page
            title={"Todoes"}
            primaryAction={{content: "Create", onClick: handleOpenModalCreateTodo}}
        >
            <ListTodo todoList={data} setTodoList={setData}/>
            <CustomModal/>
        </Page>);
};

export default BodyComponent;
