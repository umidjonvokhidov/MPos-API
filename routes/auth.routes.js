import { Router } from "express";
import {
  SignIn,
  SignOut,
  SignUp,
  forgotPassword,
  refreshTokenRoute,
  resetPassword,
  OAuthCallback,
} from "../controllers/auth.controller.js";
import passport from "../config/passport.js";

const authRouter = Router();

authRouter.post("/sign-up", SignUp);
authRouter.post("/sign-in", SignIn);
authRouter.post("/sign-out", SignOut);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/", resetPassword);
authRouter.post("/refresh-token", refreshTokenRoute);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/v1/sign-in" }),
  OAuthCallback
);

// authRouter.get("/apple", passport.authenticate("apple"));
// authRouter.post(
//   "/apple/callback",
//   passport.authenticate("apple", { failureRedirect: "/api/v1/sign-in" }),
//   OAuthCallback
// );

export default authRouter;
