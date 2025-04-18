import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import "./lib/cron";
dotenv.config();
import router from "./routes";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";


const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
  message: "request is limit!!! ",
});

// Apply the rate limiting middleware to all requests.
app.use(
  cors({
    origin: [process.env.CLIENT_URL || ""],
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
  }),
);
app.use(helmet());

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// app.use(limiter);
// logger use morgan
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => res.send("SERVER IS RUNNING"));
app.use("/public", express.static("public/"));
app.use("/api", router);

export default app;
