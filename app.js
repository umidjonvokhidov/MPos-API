import express from "express";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import errorMiddleware from "./middlewares/error.middleware.js";
import usersRouter from "./routes/users.routes.js";
import productsRouter from "./routes/products.routes.js";
import transactionsRouter from "./routes/transactions.routes.js";
import notificationsRouter from "./routes/notifications.routes.js";
import connectDB from "./config/mongodb.js";

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

app.use(limiter);

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/users/", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/transactions", transactionsRouter);
app.use("/api/v1/notifications", notificationsRouter);


app.use(errorMiddleware);
app.get("/", (req, res) => {
  res.json({ title: "MPos Restaurant API" });
});

app.listen(PORT, () => {
  console.log(`MPos API is running on http://localhost:${PORT}`);
  console.log(process.env.NODE_ENV);
});
