import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import blogRoutes from "./routes/blog.routes";
import userRoutes from "./routes/user.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { env } from "./config/env.config";

const app = express();

app.use(cors(
  {
    origin: env.CLIENT_URL,
    credentials: true,
  }
));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser(env.COOKIE_SECRET));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);


app.use(errorMiddleware);

const PORT = env.PORT;
app.listen(PORT, () =>
  console.log(`Server running on https://localhost:${PORT}`)
);
