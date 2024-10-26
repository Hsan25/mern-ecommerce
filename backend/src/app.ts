import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import "lib/cron";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
dotenv.config();
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
    methods: ["GET","HEAD","PUT","POST","DELETE"],
    origin: ["http://localhost:3000", "http://192.168.252.148:3000"],
  }),
);
app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/images", express.static("public/uploads"));
app.use("/api", router);

export default app;
