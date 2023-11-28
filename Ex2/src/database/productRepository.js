import fs from "fs";
import { URL } from "url";
import _ from "lodash";

const __dirname = new URL(".", import.meta.url).pathname;

const getProductsFromFile = () => {
  const products = fs.readFileSync(__dirname + "/product.json", "utf-8");
  return JSON.parse(products);
};

const writeFile = (products) => {
  fs.writeFileSync(__dirname + "/product.json", JSON.stringify(products));
};

const convertDateToTimestamp = (time) => {
  return new Date(time).getTime();
};
export const saveProducts = (product) => {
  try {
    const products = getProductsFromFile();
    products.push(product);
    writeFile(products);
  } catch (e) {
    console.log(e);
  }
};

export const getProducts = (limit, sort) => {
  try {
    const products = getProductsFromFile();
    let requestData = products;
    if (limit) {
      requestData = products.slice(0, limit);
    }
    if (sort) {
      requestData = requestData.sort((a, b) => {
        if (sort === "desc") {
          return convertDateToTimestamp(a.createdAt) <
            convertDateToTimestamp(b.createdAt)
            ? 1
            : -1;
        }
        return convertDateToTimestamp(a.createdAt) >
          convertDateToTimestamp(b.createdAt)
          ? 1
          : -1;
      });
    }
    return requestData;
  } catch (e) {
    console.log(e);
  }
};

export const getProductById = (id, fields) => {
  try {
    const products = getProductsFromFile();
    const fieldsArray = fields.split(",");
    const product = products.find((product) => product.id === id);
    if (!product) return "Product not found";
    return _.pick(product, fieldsArray);
  } catch (e) {
    console.log(e);
  }
};

export const updateProductById = (id, updateFields) => {
  try {
    const products = getProductsFromFile();
    const tmpProduct = products.find((product) => product.id === id);
    if (!tmpProduct) return "Product not found";
    const updatedProduct = { ...tmpProduct, ...updateFields };
    const updatedProducts = products.map((product) =>
      product.id === id ? updatedProduct : product,
    );
    writeFile(updatedProducts);
    return "Product updated";
  } catch (e) {
    console.log(e);
  }
};

export const deleteProductById = (id) => {
  try {
    const products = getProductsFromFile();
    const updatedProducts = products.filter((product) => product.id !== id);
    writeFile(updatedProducts);
  } catch (e) {
    console.log(e);
  }
};
