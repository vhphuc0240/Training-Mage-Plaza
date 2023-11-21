import { v4 as uuidv4 } from "uuid";
import {
  getProducts,
  saveProducts,
  getProductById,
  deleteProductById,
  updateProductById,
} from "../../database/productRepository.js";

export const getProductsHandler = (ctx) => {
  try {
    const { limit, sort } = ctx.request.query;
    const products = getProducts(limit, sort);
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

export const saveProductHandler = (ctx) => {
  try {
    const product = ctx.request.body;
    product.id = uuidv4();
    saveProducts(product);
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

export const getProductByIdHandler = (ctx) => {
  try {
    const { id } = ctx.params;
    const { fields } = ctx.request.query;
    const product = getProductById(id, fields);
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

export const deleteProductByIdHandler = (ctx) => {
  try {
    const { id } = ctx.params;
    deleteProductById(id);
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

export const updateProductByIdHandler = (ctx) => {
  try {
    const updateProduct = ctx.request.body;
    const { id } = ctx.params;
    const res = updateProductById(id, updateProduct);
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
