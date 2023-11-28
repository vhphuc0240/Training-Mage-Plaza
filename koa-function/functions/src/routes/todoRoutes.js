const Router = require("koa-router");
const {
  getTodosHandler,
  saveTodoHandler,
  getTodoByIdHandler,
  updateTodoByIdHandler,
  deleteTodoByIdHandler,
  deleteTodosHandler,
  updateTodosHandler,
} = require("../handlers/todo/todoHandlers");

const router = new Router({
  prefix: "/api",
});

router.get("/todos", getTodosHandler);
router.get("/todo/:id", getTodoByIdHandler);
router.post("/todo", saveTodoHandler);
router.put("/todo/:id", updateTodoByIdHandler);
router.delete("/todo/:id", deleteTodoByIdHandler);
router.put("/todos", updateTodosHandler);
router.delete("/todos", deleteTodosHandler);

module.exports = router;
