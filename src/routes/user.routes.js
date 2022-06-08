import express from "express";
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
  editProfile,
} from "../controllers/user.controllers.js";

const router = express.Router();

// SingUp
// api/user
router.post("/", singUp);

// SingIn
// api/user/auth
router.post("/auth", singIn);

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
router.delete("/", checkAuth, deleteUser);

// Profile
router.get("/profile", checkAuth, profile);
router.put("/profile", checkAuth, editProfile);

export default router;
