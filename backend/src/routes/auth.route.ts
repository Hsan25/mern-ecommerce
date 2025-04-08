import AuthController from "@controller/auth.controller";
import express from "express";
import { verifyUser } from "middlewares/verifyUser";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "@model/user.model";
const router = express.Router();
router.post("/login", AuthController.login);
router.post("/signup", AuthController.signup);
router.delete("/logout", verifyUser, AuthController.logout);
router.get("/token", AuthController.refreshToken);
router.get("/me", verifyUser, AuthController.me);

//  google auth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID || "",
      clientSecret: process.env.CLIENT_SECRET || "",
      callbackURL: process.env.CALLBACK_URL || "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let userExist = await User.findOne(
          {
            email: profile._json.email,
          },
          "username provider",
        );

        // Jika user sudah ada tapi dibuat dengan metode lain, berikan error
        if (userExist && userExist.provider !== "google") {
          return done(null, false, {
            messages: "This email is already registered with another method",
          });
        }

        if (!userExist) {
          // const upload = uploadI
          const newUser = new User({
            email: profile._json.email,
            username: profile._json.name,
            avatar: {
              url: profile._json.picture,
            },
            provider: "google",
          });
          userExist = await newUser.save();
        }

        const accessToken = jwt.sign(
          { _id: userExist._id },
          process.env.ACCESS_TOKEN_SECRET || "",
          {
            expiresIn: "5m",
          },
        );
        const refreshToken = jwt.sign(
          { _id: userExist._id },
          process.env.REFRESH_TOKEN_SECRET || "",
          {
            expiresIn: "30d",
          },
        );
        await User.updateOne(
          { _id: userExist._id },
          {
            refreshToken,
          },
        );

        return done(null, { accessToken, refreshToken });
      } catch (error) {
        return done(error, undefined);
      }
    },
  ),
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    failureMessage: true,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureMessage: true,
    failureRedirect: process.env.CLIENT_URL + "/auth/login",
  }),
  AuthController.googleCallback,
);
export default router;
