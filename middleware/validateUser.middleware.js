const validateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }

  if (!email || email.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  next();
};

export default validateUser;