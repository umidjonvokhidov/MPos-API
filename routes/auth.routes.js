import { Router } from "express";
import {
  AppleAuth,
  GoogleAuth,
  GoogleAuthCallback,
  SignIn,
  SignOut,
  SignUp,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", SignUp);
authRouter.post("/sign-in", SignIn);
authRouter.post("/sign-out", SignOut);
authRouter.post("/google", GoogleAuth);
authRouter.post("/google/callback", GoogleAuthCallback);
authRouter.post("/apple", AppleAuth);

export default authRouter;
