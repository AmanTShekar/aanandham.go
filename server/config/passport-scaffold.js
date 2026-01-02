const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// TO ENABLE SOCIAL AUTH:
// 1. Install dependencies: npm install passport passport-google-oauth20 passport-facebook
// 2. Create apps in Google Cloud Console & Meta for Developers
// 3. Add keys to .env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.
// 4. Import this file in server/index.js: require('./config/passport-setup');

/*
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        return done(null, user);
      }
      // Create new user
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        password: 'social-login-placeholder', // Handle this securely
        role: 'user'
      });
      await user.save();
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    // Similar logic to Google...
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});
*/
