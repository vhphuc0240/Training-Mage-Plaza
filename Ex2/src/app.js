import Koa from "koa";
import { koaBody } from "koa-body";
import { routes } from "./routes/routes.js";

const app = new Koa();

app.use(koaBody());
app.use(routes.routes());
app.use(routes.allowedMethods());

app.listen(5000);
