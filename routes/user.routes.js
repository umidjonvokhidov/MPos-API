import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  getUserSettings,
  updateUser,
  updateUserSettings,
} from "../controllers/users.controller.js";
import { uploadUserProfilePhoto } from "../utils/multer.js";
import { authorize, requireAdmin, authorizeOwnResource } from "../middlewares/auth.middleware.js";

const usersRouter = Router();

// Public routes (no auth required)
usersRouter.post(
  "/",
  uploadUserProfilePhoto.single("profilePicture"),
  createUser
);

// Protected routes (auth required)
usersRouter.use(authorize); 

// Admin only routes
usersRouter.get("/", requireAdmin, getAllUsers);
usersRouter.delete("/:id", requireAdmin, deleteUser);

// User can access their own data or admin can access any
usersRouter.get("/:id", authorizeOwnResource("id"), getUser);
usersRouter.put(
  "/:id",
  authorizeOwnResource("id"),
  uploadUserProfilePhoto.single("profilePicture"),
  updateUser
);
usersRouter.get("/settings/user/:id", authorizeOwnResource("id"), getUserSettings);
usersRouter.put("/settings/user/:id", authorizeOwnResource("id"), updateUserSettings);

export default usersRouter;
