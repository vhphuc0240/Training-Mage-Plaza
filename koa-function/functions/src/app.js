const Koa = require("koa");
const { bodyParser } = require("@koa/bodyparser");
const routes = require("./routes/routes");
const app = new Koa();

function hybridBodyParser(opts) {
  const bp = bodyParser(opts);
  return async (ctx, next) => {
    ctx.request.body = ctx.request.body || ctx.req.body;
    return bp(ctx, next);
  };
}
app.use(hybridBodyParser());
app.use(routes.routes());
app.use(routes.allowedMethods());
app.use(async (ctx) => {
  ctx.body = "Hello World";
});

module.exports = app;
