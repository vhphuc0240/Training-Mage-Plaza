const {
  getTodos,
  saveTodos,
  getTodoById,
  deleteTodoById,
  updateTodoById,
  deleteTodos,
  updateTodos,
} = require("../../database/todoRepository");

const getTodosHandler = async (ctx) => {
  try {
    const { limit, sort } = ctx.request.query;
    const todos = await getTodos(limit, sort);
    ctx.body = {
      success: true,
      data: todos,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
};

const saveTodoHandler = async (ctx) => {
  try {
    const todo = ctx.request.body.data;
    const newTodo = await saveTodos({
      ...todo,
      createdAt: new Date(),
    });
    ctx.body = {
      success: true,
      message: "Todo saved",
      data: newTodo,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
};

const getTodoByIdHandler = async (ctx) => {
  try {
    const { id } = ctx.params;
    const { fields } = ctx.request.query;
    const todo = await getTodoById(id, fields);
    ctx.body = {
      success: true,
      data: todo,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
};

const deleteTodoByIdHandler = async (ctx) => {
  try {
    const { id } = ctx.params;
    await deleteTodoById(id);
    ctx.body = {
      success: true,
      data: "Todo deleted",
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
};

const updateTodoByIdHandler = async (ctx) => {
  try {
    const updateTodo = ctx.request.body.data;
    const { id } = ctx.params;
    const res = await updateTodoById(id, updateTodo);
    ctx.body = {
      success: true,
      data: res,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
};
const deleteTodosHandler = async (ctx) => {
  try {
    const { ids } = ctx.request.body.data;
    await deleteTodos(ids);
    ctx.body = {
      success: true,
      data: "Todo deleted",
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
};
const updateTodosHandler = async (ctx) => {
  try {
    const { data } = ctx.request.body;
    const res = await updateTodos(data);
    ctx.body = {
      success: true,
      data: res,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
};
module.exports = {
  getTodosHandler,
  getTodoByIdHandler,
  saveTodoHandler,
  updateTodoByIdHandler,
  updateTodosHandler,
  deleteTodoByIdHandler,
  deleteTodosHandler,
};
