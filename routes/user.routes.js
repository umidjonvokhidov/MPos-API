import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  getUserSettings,
  updateUser,
  updateUserSettings,
  getCurrentUser
} from "../controllers/users.controller.js";
import { uploadUserProfilePhoto } from "../utils/multer.js";
import { authorize, requireAdmin, authorizeOwnResource } from "../middlewares/auth.middleware.js";

const usersRouter = Router();

usersRouter.post(
  "/",
  uploadUserProfilePhoto.single("profilePicture"),
  createUser
);


usersRouter.use(authorize); 
usersRouter.get("/me",getCurrentUser); 
usersRouter.get("/", requireAdmin, getAllUsers);
usersRouter.delete("/:id", requireAdmin, deleteUser);
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
