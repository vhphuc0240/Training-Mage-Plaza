const Router = require("koa-router");
const {
  getProductsHandler,
  saveProductHandler,
  getProductByIdHandler,
  updateProductByIdHandler,
  deleteProductByIdHandler,
} = require("../handlers/product/productHandlers.js");

const router = new Router({
  prefix: "/api",
});

router.get("/products", getProductsHandler);
router.get("/product/:id", getProductByIdHandler);
router.post("/products", saveProductHandler);
router.put("/product/:id", updateProductByIdHandler);
router.delete("/product/:id", deleteProductByIdHandler);

module.exports = router;
