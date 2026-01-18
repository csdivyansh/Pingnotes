import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import Teacher from "../models/teacher.model.js";
import jwt from "jsonwebtoken";

// Google OAuth Strategy for Users
passport.use(
  "google-user",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_USER_CALLBACK_URL ||
        "http://localhost:5000/api/auth/google/user/callback",
      // Do NOT set 'scope', 'accessType', or 'prompt' here. These are set in the route for flexibility.
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists with Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Check if user exists with email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Update existing user with Google ID
            user.googleId = profile.id;
            user.googleAccessToken = accessToken;
            // Only save refresh token if provided (Google only provides it on first auth)
            if (refreshToken) {
              user.googleRefreshToken = refreshToken;
            }
            user.profilePicture = profile.photos[0]?.value;
            await user.save();
          } else {
            // Create new user
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              googleAccessToken: accessToken,
              googleRefreshToken: refreshToken,
              profilePicture: profile.photos[0]?.value,
            });
          }
        } else {
          // Update tokens for existing Google user
          user.googleAccessToken = accessToken;
          // Only save refresh token if provided (Google only provides it on first auth)
          if (refreshToken) {
            user.googleRefreshToken = refreshToken;
          }
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

// Google OAuth Strategy for Teachers
passport.use(
  "google-teacher",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_TEACHER_CALLBACK_URL ||
        "http://localhost:5000/api/auth/google/teacher/callback",
      // Do NOT set 'scope', 'accessType', or 'prompt' here. These are set in the route for flexibility.
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if teacher exists with Google ID
        let teacher = await Teacher.findOne({ googleId: profile.id });

        if (!teacher) {
          // Check if teacher exists with email
          teacher = await Teacher.findOne({ email: profile.emails[0].value });

          if (teacher) {
            // Update existing teacher with Google ID
            teacher.googleId = profile.id;
            teacher.googleAccessToken = accessToken;
            // Only save refresh token if provided (Google only provides it on first auth)
            if (refreshToken) {
              teacher.googleRefreshToken = refreshToken;
            }
            teacher.profilePicture = profile.photos[0]?.value;
            await teacher.save();
          } else {
            // Create new teacher (you might want to add department field)
            teacher = await Teacher.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              department: "General", // Default department, can be updated later
              googleAccessToken: accessToken,
              googleRefreshToken: refreshToken,
              profilePicture: profile.photos[0]?.value,
            });
          }
        } else {
          // Update tokens for existing Google teacher
          teacher.googleAccessToken = accessToken;
          // Only save refresh token if provided (Google only provides it on first auth)
          if (refreshToken) {
            teacher.googleRefreshToken = refreshToken;
          }
          await teacher.save();
        }

        return done(null, teacher);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

// Generate JWT token
export const generateToken = (user, role) => {
  const jwtSecret =
    process.env.JWT_SECRET || "fallback-jwt-secret-for-development";
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: role,
      name: user.name,
    },
    jwtSecret,
    { expiresIn: "30d" }, // Changed from '7d' to '30d'
  );
};

// Refresh Google access token
export const refreshGoogleToken = async (refreshToken) => {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing Google token:", error);
    throw error;
  }
};

export default passport;
