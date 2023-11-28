const Koa = require("koa");
const { bodyParser } = require("@koa/bodyparser");
const cors = require("@koa/cors");
const productsRoutes = require("./routes/productRoutes");
const todosRoutes = require("./routes/todoRoutes");

const app = new Koa();

function hybridBodyParser(opts) {
  const bp = bodyParser(opts);
  return async (ctx, next) => {
    ctx.request.body = ctx.request.body || ctx.req.body;
    return bp(ctx, next);
  };
}

app.use(cors());
app.use(hybridBodyParser());
app.use(productsRoutes.routes());
app.use(productsRoutes.allowedMethods());

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());
app.use(async (ctx) => {
  ctx.body = "Hello World";
});

module.exports = app;
