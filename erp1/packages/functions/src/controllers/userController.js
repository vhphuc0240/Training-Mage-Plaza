import {
  checkUser,
  createBulkUsers,
  createUser,
  deleteUser,
  getUsers,
  updateUserById
} from '@functions/repositories/userRepository';

export const checkUserController = async ctx => {
  try {
    const {email, avatar} = ctx.req.body;
    const user = await checkUser(email);
    if (user && user.role.length > 0 && user.active) {
      if (user.avatar === '' || !user.avatar) {
        const updatedUser = await updateUserById(user.id, {avatar});
        return (ctx.body = {
          data: updatedUser,
          success: true
        });
      }
      return (ctx.body = {
        data: user,
        success: true
      });
    }
    ctx.status = 403;
    ctx.body = {
      err: {
        message: 'Forbidden'
      },
      success: false
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message
    };
  }
};

export const createUserController = async ctx => {
  try {
    const createField = ctx.req.body;
    const user = await createUser({...createField, createdAt: new Date()});
    return (ctx.body = {
      data: user,
      success: true,
      message: 'User created'
    });
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message
    };
  }
};
export const deleteUserController = async ctx => {
  try {
    const {ids} = ctx.req.body;
    await deleteUser(ids);
    return (ctx.body = {
      success: true,
      message: 'User deleted'
    });
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message
    };
  }
};

export const updateUserController = async ctx => {
  try {
    const {id, updateFields} = ctx.req.body;

    const updatedUser = await updateUserById(id, updateFields);
    return (ctx.body = {
      data: updatedUser,
      success: true
    });
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message
    };
  }
};

export const getUsersController = async ctx => {
  try {
    const {limit, sort} = ctx.req.query;
    const users = await getUsers(Number(limit), sort);
    return (ctx.body = {
      data: users,
      success: true,
      message: 'Users fetched'
    });
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message
    };
  }
};

export const createBulkUserController = async ctx => {
  try {
    const data = ctx.req.body;
    const users = await createBulkUsers(data);
    return (ctx.body = {
      data: users,
      success: true,
      message: 'Users fetched'
    });
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message
    };
  }
};
