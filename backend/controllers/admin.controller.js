const JWThandler = require("../utils/JWThandler");
const errorHandler = require("../utils/errorHandler");
const Admin = require("../models/admin.schema");
const Log = require("../models/log.schema");
const bcrypt = require("bcryptjs");
const httpResponse = require("../utils/httpResponse");
const asyncWrapper = require("../middlewares/asyncWrapper");

const Login = asyncWrapper(async (req, res, next) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    const error = errorHandler.create(
      httpResponse.message.invalidCredentials,
      httpResponse.status.unauthorized
    );
    return next(error);
  }
  const user = await Admin.findOne({ username });
  if (!user) {
    const error = errorHandler.create(
      httpResponse.message.invalidCredentials,
      httpResponse.status.unauthorized
    );
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    const error = errorHandler.create(
      httpResponse.message.invalidCredentials,
      httpResponse.status.unauthorized
    );
    return next(error);
  }
  const token = await JWThandler.generateJWT({
    username: user.username,
    role: user.role,
    id: user._id,
    pic: user.pic,
  });
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.loginSuccess,
    data: { token, username:user.username },
  });
});

const register = asyncWrapper(async (req, res, next) => {
  const { username, password, role, nickname, email } = req.body;
  const pic = req.file ? req.file.path : null;
  const admin = await Admin.findOne({ username: username });
  if (admin) {
    const error = errorHandler.create(
      httpResponse.message.userExist,
      httpResponse.status.Conflict
    );
    return next(error);
  }
  const passwordHashing = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({
    username,
    nickname,
    password: passwordHashing,
    role,
    email,
    pic,
  });
  const token = await JWThandler.generateJWT({
    username: newAdmin.username,
    role: newAdmin.role,
    pic: newAdmin.pic,
  });
  newAdmin.token = token;
  await newAdmin.save();
  res.json({
    status: httpResponse.status.created,
    message: httpResponse.message.accountCreated,
  });
});

const Logout = asyncWrapper(async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    const error = errorHandler.create(
      httpResponse.message.invalidToken,
      httpResponse.status.badrequest
    );
  }
  await JWThandler.blacklistJWT(token);
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.logoutSuccess,
  });
});

const GetLogs = asyncWrapper(async (req, res, next) => {
  const logs = await Log.find().sort({ createdAt: -1 })
  res.json({
    status: httpResponse.status.ok,
    message: "Logs fetched successfully",
    data: { logs },
  });
});

const DelLogs = asyncWrapper(async (req, res, next) => {
  const logs = await Log.deleteMany({})
  res.json({
    status: httpResponse.status.ok,
    message: "Logs deleted successfully",
  });
});


const authtest = asyncWrapper(async (req, res, next) => {
  const token = req.headers.authorization;
  res.json({ message: "USER AUTHERIZED", token });
});


module.exports = {
  Login,
  Logout,
  register,
  authtest,
  GetLogs,
  DelLogs
};
