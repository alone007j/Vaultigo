import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { compare, hash } from "bcrypt";
import { storage } from "./storage";
import { User as SelectUser, authProviderEnum } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const SALT_ROUNDS = 10;

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "vaultigo-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      secure: process.env.NODE_ENV === "production",
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy for email/password authentication
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }
          
          // Make sure password exists (for users created via Google login)
          if (!user.password) {
            return done(null, false, { message: "Please log in with Google" });
          }
          
          const isValidPassword = await compare(password, user.password);
          if (!isValidPassword) {
            return done(null, false, { message: "Invalid email or password" });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      
      // Check if user with email already exists
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Check if user with username already exists
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Hash the password
      const hashedPassword = await hash(password, SALT_ROUNDS);
      
      // Create the user
      const user = await storage.createUser({
        email,
        username,
        password: hashedPassword,
      });
      
      // Log the user in
      req.login(user, (err: any) => {
        if (err) return next(err);
        
        // Don't send the password hash to the client
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: Express.User | false, info: { message: string }) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info.message });
      
      req.login(user, (err: any) => {
        if (err) return next(err);
        
        // Don't send the password hash to the client
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Google login endpoint
  app.post("/api/google-login", async (req, res, next) => {
    try {
      const { googleId, email, username, avatarUrl } = req.body;
      
      // Check if user with Google ID already exists
      let user = await storage.getUserByGoogleId(googleId);
      
      if (!user) {
        // Check if user with this email exists
        const existingUserByEmail = await storage.getUserByEmail(email);
        
        if (existingUserByEmail) {
          // Link the Google account to the existing user
          user = await storage.updateUser(existingUserByEmail.id, {
            googleId,
            authProvider: "google",
            avatarUrl: avatarUrl || existingUserByEmail.avatarUrl,
            lastLogin: new Date()
          });
        } else {
          // Create a new user
          user = await storage.createUser({
            email,
            username,
            googleId,
            authProvider: "google",
            avatarUrl
          });
        }
      } else {
        // Update last login time
        user = await storage.updateUser(user.id, { lastLogin: new Date() });
      }
      
      // Log the user in
      req.login(user, (err: any) => {
        if (err) return next(err);
        
        // Don't send the password hash to the client
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  // Get current user endpoint
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Don't send the password hash to the client
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
  
  // Update user settings endpoint
  app.patch("/api/user", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const userId = req.user.id;
      const { username, email, aiProvider, ...otherFields } = req.body;
      
      // Only allow updating certain fields
      const updateData: any = {};
      
      if (username) {
        // Check if username is taken
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Username already taken" });
        }
        updateData.username = username;
      }
      
      if (email) {
        // Check if email is taken
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Email already in use" });
        }
        updateData.email = email;
      }
      
      if (aiProvider) {
        updateData.aiProvider = aiProvider;
      }
      
      // Update the user
      const updatedUser = await storage.updateUser(userId, updateData);
      
      // Don't send the password hash to the client
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
  
  // Change password endpoint
  app.post("/api/change-password", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      
      // Get the user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      if (user.password) {
        const isValid = await compare(currentPassword, user.password);
        if (!isValid) {
          return res.status(401).json({ message: "Current password is incorrect" });
        }
      } else {
        // User doesn't have a password (e.g., Google sign-in)
        return res.status(400).json({ 
          message: "You don't have a password set. Please set one instead of changing it." 
        });
      }
      
      // Hash the new password
      const hashedPassword = await hash(newPassword, SALT_ROUNDS);
      
      // Update the password
      await storage.updateUser(userId, { password: hashedPassword });
      
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  });
}
