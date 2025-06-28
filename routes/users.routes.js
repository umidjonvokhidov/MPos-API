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

const usersRouter = Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getUser);
usersRouter.post(
  "/",
  uploadUserProfilePhoto.single("profilePicture"),
  createUser
);
usersRouter.put(
  "/:id",
  uploadUserProfilePhoto.single("profilePicture"),
  updateUser
);
usersRouter.delete("/:id", deleteUser);
usersRouter.get("/settings/user/:id", getUserSettings);
usersRouter.put("/settings/user/:id", updateUserSettings);

export default usersRouter;
