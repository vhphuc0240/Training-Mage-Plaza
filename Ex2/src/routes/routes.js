import Router from "koa-router";
import {
  deleteProductByIdHandler,
  getProductByIdHandler,
  getProductsHandler,
  saveProductHandler,
  updateProductByIdHandler,
} from "../handlers/products/productHandlers.js";
import { validateProductMiddleware } from "../middleware/productMiddleware.js";

const router = new Router({
  prefix: "/api",
});

router.get("/products", getProductsHandler);
router.get("/product/:id", getProductByIdHandler);
router.post("/products", validateProductMiddleware, saveProductHandler);
router.put("/product/:id", validateProductMiddleware, updateProductByIdHandler);
router.delete("/product/:id", deleteProductByIdHandler);

export const routes = router;
