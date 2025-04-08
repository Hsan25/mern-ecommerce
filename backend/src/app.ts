import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import "lib/cron";
dotenv.config();
import router from "./routes";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
  message: "your request is limit!!! ",
});

// Apply the rate limiting middleware to all requests.
app.use(
  cors({
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "POST", "DELETE"],
    origin: [process.env.CLIENT_URL || ""],
  }),
);
app.use(helmet());
app.use(limiter);
// logger use morgan
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/public", express.static("public/"));
app.use("/api", router);

export default app;
