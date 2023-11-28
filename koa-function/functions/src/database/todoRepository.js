const _ = require("lodash");
const admin = require("../config/db");
const todoRef = admin.firestore().collection("todos");
const saveTodos = async (todo) => {
  try {
    const res = await todoRef.add(todo);
    console.log("Added document with ID: ", res.id);
    const newTodo = await getTodoById(res.id, "");
    return {
      id: res.id,
      ...newTodo,
    };
  } catch (e) {
    console.log(e);
  }
};

const getTodos = async (limit, sort) => {
  try {
    const todosSnapshot = await todoRef
      .limit(limit | 20)
      .orderBy("createdAt", sort)
      .get();
    return todosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.log(e);
  }
};

const getTodoById = async (id, fields) => {
  try {
    const fieldsArray = fields ? fields.split(",") : [];
    const todoSnapshot = await todoRef.doc(id).get();
    const todo = todoSnapshot.data();
    if (!todo) return "Todo not found";
    return fieldsArray.length > 0 ? _.pick(todo, fieldsArray) : todo;
  } catch (e) {
    console.log(e);
  }
};

const updateTodoById = async (id, updateFields) => {
  try {
    await todoRef.doc(id).set(updateFields, { merge: true });
    return await getTodoById(id, "");
  } catch (e) {
    console.log(e);
  }
};

const deleteTodoById = async (id) => {
  try {
    const todoSnapshot = await todoRef.doc(id).delete();
    if (todoSnapshot.id) return "Todo deleted";
  } catch (e) {
    console.log(e);
  }
};

const deleteTodos = async (ids) => {
  try {
    const batch = admin.firestore().batch();
    ids.map((id) => {
      const docRef = todoRef.doc(id);
      return batch.delete(docRef);
    });
    await batch.commit();
    return "Todos deleted";
  } catch (e) {
    console.log(e);
    throw e;
  }
};
const updateTodos = async (data) => {
  try {
    const batch = admin.firestore().batch();

    data.forEach(({ id, updateField }) => {
      const docRef = todoRef.doc(id);
      batch.update(docRef, updateField);
    });
    await batch.commit();
    return "Todos updated";
  } catch (e) {
    console.log(e);
  }
};
module.exports = {
  getTodos,
  getTodoById,
  saveTodos,
  updateTodoById,
  updateTodos,
  deleteTodoById,
  deleteTodos,
};
