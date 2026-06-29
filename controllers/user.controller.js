import User from "../models/user.model.js";

export const createUser = async (req, res, next) => {
  const { name, email } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User with this email already exists"
    })
  }

  const user = await User.create({ name, email });
  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user
  });
};

export const getAllUsers = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const offset = (page - 1) * limit;

    
    const { count, rows: users } = await User.findAndCountAll({
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      totalUsers: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      users,
    });

};

export const getUserById = async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({
    success: false,
    message: "User not found",
   })
  }

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
};

export const updateUser = async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const { name, email } = req.body;
  if (name) {
    user.name = name;
  }
  if (email) {
    user.email = email;
  }

  await user.save();
  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
};

export const deleteUser = async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  await user.destroy();
  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};