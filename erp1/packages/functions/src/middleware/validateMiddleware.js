import {object, string} from 'yup';

export const validateMiddleware = async (ctx, next) => {
  const schema = object().shape({
    fullName: string().required()
  });
  try {
    await schema.validate(ctx.req.body);
    await next();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      error: e.message
    };
  }
};
