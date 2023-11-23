import * as yup from "yup";

export const validateProductMiddleware = async (ctx, next) => {
  const schema = yup.object().shape({
    name: yup.string().required(),
    price: yup.number().required(),
    description: yup.string().required(),
    image: yup.string().required(),
    color: yup.string().required(),
    product: yup.string().required(),
    createdAt: yup
      .date()
      .default(() => new Date())
      .required(),
  });
  try {
    await schema.validate(ctx.request.body);
    next();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
};
