const express = require("express");
const validateBody = require("../../middlewares/validateBody");
const ctrlWrapper = require("../../helpers/ctrlWrapper");

const userRegSchema = require("../../schemas/userRegSchema");
const userLogSchema = require("../../schemas/userLogSchema");
const ctrl = require("../../controllers/auth/index");

const router = express.Router();

router.post(
  "/registration",
  validateBody(userRegSchema),
  ctrlWrapper(ctrl.registration)
);
router.post(
  "/login",
  validateBody(userLogSchema),
  ctrlWrapper(ctrl.login)
);

module.exports = router;
