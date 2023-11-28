const _ = require("lodash");
const admin = require("../config/db");

const productRef = admin.firestore().collection("products");

const saveProducts = async (product) => {
  try {
    const res = await productRef.add(product);
    console.log("Added document with ID: ", res.id);
    return res;
  } catch (e) {
    console.log(e);
  }
};

const getProducts = async (limit, sort) => {
  try {
    const productsSnapshot = await productRef
      .limit(limit | 20)
      .orderBy("createdAt", sort)
      .get();
    return productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.log(e);
  }
};

const getProductById = async (id, fields) => {
  try {
    const fieldsArray = fields ? fields.split(",") : [];
    const productSnapshot = await productRef.doc(id).get();
    const product = productSnapshot.data();
    if (!product) return "Product not found";
    return fieldsArray.length > 0 ? _.pick(product, fieldsArray) : product;
  } catch (e) {
    console.log(e);
  }
};

const updateProductById = async (id, updateFields) => {
  try {
    const productSnapshot = await productRef
      .doc(id)
      .set(updateFields, { merge: true });
    if (productSnapshot.id) return "Product updated";
  } catch (e) {
    console.log(e);
  }
};

const deleteProductById = async (id) => {
  try {
    const productSnapshot = await productRef.doc(id).delete();
    if (productSnapshot.id) return "Product deleted";
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getProducts,
  getProductById,
  saveProducts,
  updateProductById,
  deleteProductById,
};
