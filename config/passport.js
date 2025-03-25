// passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/userSchema");
const env = require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      prompt: "select_account", // This forces Google to ask for email selection
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in DB by email
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Update the user's profile picture if they logged in via Google
          user.profilePicture = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : user.profilePicture;
          await user.save();
          return done(null, user);
        } else {
          // Create new user
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePicture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '', // Save the Google profile picture
          });
          await user.save();
          return done(null, user);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

module.exports = passport;