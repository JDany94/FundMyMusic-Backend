import express from "express";
import { check } from "express-validator";
import checkAuth from "../middleware/checkAuth.js";
import {
  singUp,
  singIn,
  authenticatedUser,
  confirmIdToken,
  resetPasswordResetToken,
  resetPasswordCheckToken,
  resetPasswordNewPass,
  deleteUser,
  profile,
} from "../controllers/user.controllers.js";

const router = express.Router();

// SingUp
// api/user
router.post("/",
  [
    check("email", "Invalid format for email").isEmail(),
    check("name", "Name is required").not().isEmpty(),
    check("surname", "Surname is required").not().isEmpty(),
    check("phone", "Phone is required").not().isEmpty(),
    check("password", "The password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  singUp
);

// SingIn
// api/user/auth
router.post("/auth",
  [
    check("email", "Invalid format for email").isEmail(),
    check("password", "The password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  singIn
);

// Get the authenticated user
router.get("/auth", checkAuth, authenticatedUser);

// Confirm account
router.get("/confirm/:token", confirmIdToken);

// Reset password
router.post("/reset-password", resetPasswordResetToken);
router
  .route("/reset-password/:token")
  .get(resetPasswordCheckToken)
  .post(resetPasswordNewPass);

// Delete User
// api/user
router.delete("/",
  checkAuth,
  [
    check("email", "Invalid format for email").isEmail(),
    check("password", "The password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  deleteUser
);

// Profile
router.get("/profile", checkAuth, profile);

export default router;
