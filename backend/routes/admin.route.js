const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const rateLimit = require("../middlewares/rateLimit");
const validateInputs = require("../middlewares/validateInputs");
const upload = require("../middlewares/upload");
const { check } = require("express-validator");
const roles = require("../utils/roles");
const validator = require("../utils/validator");
const adminController = require("../controllers/admin.controller");
const profileController = require("../controllers/profile.controller");
const taskController = require("../controllers/task.controller");
const commentController = require("../controllers/comment.controller");
const messageController = require("../controllers/message.controller");

router.route("/authtest").get(auth.verifyToken, adminController.authtest);

router
  .route("/login")
  .post(
    rateLimit.formRateLimiter,
    validator.loginValidator(),
    validateInputs,
    adminController.Login
  );

router
  .route("/register")
  .post(
    auth.verifyToken,
    auth.allowedTo(roles.ceo, roles.cto),
    upload.single("pic"),
    validator.registerValidator(),
    validateInputs,
    adminController.register
  );

router.route("/logout").post(auth.verifyToken, adminController.Logout);

router
  .route("/logs")
  .get(
    auth.verifyToken,
    auth.allowedTo(roles.ceo, roles.cto),
    adminController.GetLogs
  )
  .delete(
    auth.verifyToken,
    auth.allowedTo(roles.ceo, roles.cto),
    adminController.DelLogs
  )




router
  .route("/message")
  .get(
    auth.verifyToken,
    auth.allowedTo(roles.ceo, roles.cto),
    messageController.GetMessages
  );

router
  .route("/message/:id")
  .delete(
    auth.verifyToken,
    validatorMiddleware.validateMongoId("id"),
    auth.allowedTo(roles.ceo, roles.cto),
    messageController.DelMessages
  );

router
  .route("/profiles")
  .get(
    profileController.getAllProfiles 
  );

router
  .route("/profiles/:id")
  .get(
    auth.verifyToken,
    validatorMiddleware.validateMongoId("id"),
    auth.allowedTo(roles.ceo, roles.cto),
    profileController.getSingleProfile
  )
  .delete(
    auth.verifyToken,
    validatorMiddleware.validateMongoId("id"),
    auth.allowedTo(roles.ceo, roles.cto),
    profileController.deleteProfile
  )

router
  .route("/tasks")
  .get(
    auth.verifyToken,
    auth.allowedTo(roles.ceo, roles.cto),
    taskController.getAllTasks
  )
  .post(
    auth.verifyToken,
    auth.allowedTo(roles.ceo, roles.cto),
    validator.taskValidtor(),
    validateInputs,
    taskController.createTask
  );

router
  .route("/tasks/:id")
  .put(
    auth.verifyToken,
    validatorMiddleware.validateMongoId("id"),
    auth.allowedTo(roles.ceo, roles.cto),
    taskController.updateTask
  )
  .delete(
    auth.verifyToken,
    validatorMiddleware.validateMongoId("id"),
    auth.allowedTo(roles.ceo, roles.cto),
    taskController.deleteTask
  );

router
  .route("/comments")
  .get(auth.verifyToken, commentController.getAllComments)
  .post(
    auth.verifyToken,
    validator.commentValidtor(),
    validateInputs,
    commentController.postComment
  );
router
  .route("/comments/:id")
  .delete(
    auth.verifyToken,
    validatorMiddleware.validateMongoId("id"),
    commentController.deleteComment
  );

module.exports = router;
