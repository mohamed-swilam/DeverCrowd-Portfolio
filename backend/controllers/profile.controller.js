const errorHandler = require("../utils/errorHandler");
const sortTasks = require("../utils/SortingTasks");
const httpResponse = require("../utils/httpResponse");
const asyncWrapper = require("../middlewares/asyncWrapper");
const Admin = require("../models/admin.schema");

const getAllProfiles = asyncWrapper(async (req, res, next) => {
  const limit = req.query.limit || 100;
  const page = req.query.page || 1;
  const skip = limit * (page - 1);
  const admins = await Admin.find()
    .limit(limit)
    .skip(skip)
    .select("-password -token -_v")
    .populate([
      {
        path: "tasks",
        select: "title deadline priority",
      },
      {
        path: "comments",
        select: "username userId commentText",
      },
    ]);
  const sortedAdmins = sortTasks(admins);
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.getAllUsers,
    data: { admins: sortedAdmins },
  });
});

const getSingleProfile = asyncWrapper(async (req, res, next) => {
  const id = req.params.id || req.user.id;
  const user = await Admin.findById(id)
    .select("-password -token -_v")
    .populate([
      {
        path: "tasks",
        select: "title description type deadline status references priority",
      },
      {
        path: "comments",
        select: "username userId commentText",
      },
    ]);

  if (!user) {
    return next(
      errorHandler.create(
        httpResponse.status.notfound,
        httpResponse.message.userNotFound,
      ),
    );
  }
  const sortedTasks = sortTasks(user);
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.getSingleUser,
    data: {
      user: sortedTasks,
    },
  });
});

const editProfile = asyncWrapper(async (req, res, next) => {
  const { username, email, nickname, password, confirm_password } = req.body
})

const deleteProfile = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  console.log(id);

  const profile = await Admin.findByIdAndDelete(id);

  if (!profile) {
    return next(
      errorHandler.create(
        "Profile not found",
        httpResponse.status.deleteProfile,
      ),
    );
  }
  res.json({
    status: httpResponse.status.ok,
    message: "Profile deleted",
    data: null,
  });
});

module.exports = {
  getAllProfiles,
  getSingleProfile,
  deleteProfile
};
