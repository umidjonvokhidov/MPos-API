import express from "express";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import errorMiddleware from "./middlewares/error.middleware.js";
import usersRouter from "./routes/user.routes.js";
import productsRouter from "./routes/product.routes.js";
import transactionsRouter from "./routes/transaction.routes.js";
import notificationsRouter from "./routes/notification.routes.js";
import cartRouter from "./routes/cart.routes.js";
import connectDB from "./config/mongodb.js";
import session from "express-session";
import passport from "./config/passport.js";
import stripeRouter from "./routes/stripe.routes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { Webhook } from "./controllers/stripe.controller.js";

const app = express();
connectDB();

app.post("/api/v1/stripe/webhook", express.raw({ type: "application/json" }), Webhook);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://mpos-restaurant.vercel.app"],
    credentials: true,
  })
);
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production"
        ? {
            directives: {
              defaultSrc: ["'self'"],
            },
          }
        : false,
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: process.env.NODE_ENV === "production" ? 50 : 100,
// });

// app.use(limiter);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/users/", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/transactions", transactionsRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/stripe", stripeRouter);

app.get("/api/v1/", (req, res) => {
  res.json({
    api: "MPos Restaurant Management System",
    version: "1.0.0",
    description:
      "A comprehensive API for restaurant management including authentication, user management, products, transactions, and notifications.",
    baseUrl: `${req.protocol}://${req.get("host")}/api/v1`,
    endpoints: {
      authentication: {
        base: "/auth/",
        description: "User authentication and authorization",
        methods: ["POST", "GET"],
      },
      users: {
        base: "/users/",
        description: "User profile and management",
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
      products: {
        base: "/products",
        description: "Product catalog and inventory",
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
      transactions: {
        base: "/transactions",
        description: "Payment and order processing",
        methods: ["GET", "POST"],
      },
      notifications: {
        base: "/notifications",
        description: "System notifications and alerts",
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
    },
    contact:
      "For support, check the documentation or contact the development team.",
  });
});

app.use(errorMiddleware);
app.get("/", (req, res) => {
  res.json({ title: "MPos Restaurant API" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`MPos API is running on http://localhost:${PORT}`);
  console.log(process.env.NODE_ENV);
});
