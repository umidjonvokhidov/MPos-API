export const SignUp = async (req, res, next) => {
  res.json({ success: true, message: "Sign Up" });
};

export const SignIn = (req, res, next) => {
  res.json({ success: true, message: "Sign In" });
};

export const SignOut = (req, res, next) => {
  res.json({ success: true, message: "Sign Out" });
};

export const GoogleAuth = (req, res, next) => {
  res.json({ success: true, message: "Google Auth" });
};

export const GoogleAuthCallback = (req, res, next) => {
  res.json({ success: true, message: "Google Auth Callback" });
};

export const AppleAuth = (req, res, next) => {
  res.json({ success: true, message: "Apple Auth" });
};
