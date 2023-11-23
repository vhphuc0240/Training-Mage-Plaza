const {
  getProducts,
  saveProducts,
  getProductById,
  deleteProductById,
  updateProductById,
} = require("../../database/productRepository.js");

const getProductsHandler = async (ctx) => {
  try {
    const { limit, sort } = ctx.request.query;
    const products = await getProducts(limit, sort);
    ctx.body = {
      success: true,
      data: products,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
};

const saveProductHandler = async (ctx) => {
  try {
    const product = ctx.request.body;
    await saveProducts({
      ...product,
      createdAt: new Date(),
    });
    ctx.body = {
      success: true,
      message: "Product saved",
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
};

const getProductByIdHandler = async (ctx) => {
  try {
    const { id } = ctx.params;
    const { fields } = ctx.request.query;
    const product = await getProductById(id, fields);
    ctx.body = {
      success: true,
      data: product,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
};

const deleteProductByIdHandler = async (ctx) => {
  try {
    const { id } = ctx.params;
    await deleteProductById(id);
    ctx.body = {
      success: true,
      data: "Product deleted",
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
};

const updateProductByIdHandler = async (ctx) => {
  try {
    const updateProduct = ctx.request.body;
    const { id } = ctx.params;
    const res = await updateProductById(id, updateProduct);
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
  getProductsHandler,
  getProductByIdHandler,
  saveProductHandler,
  updateProductByIdHandler,
  deleteProductByIdHandler,
};
