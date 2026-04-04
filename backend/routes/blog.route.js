const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const auth = require("../middlewares/auth");
const roles = require("../utils/roles");
const validateInputs = require("../middlewares/validateInputs");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const validator = require("../utils/validator");
const upload = require("../middlewares/upload");

router
  .route("/")
  .get(auth.isauth, blogController.getAllBlogs)
  .post(
    upload.single("featured_image"),
    auth.verifyToken,
    auth.allowedTo(roles.ceo, roles.cto),
    blogController.createBlog
  );
router
  .route("/:slug/like")
  .post(auth.isauth, blogController.addLike)

router
  .route("/:slug")
  .get(auth.isauth, blogController.getSingleBlog)
  .patch(
    upload.single("featured_image"),
    auth.verifyToken,
    validator.blogValidation,
    validateInputs,
    blogController.modifyBlog
  )
  .delete(auth.verifyToken, blogController.deleteBlog);

module.exports = router;
