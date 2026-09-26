const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const resend = require("../emailConfig");
const { requireAdmin, requireMainAdmin, requireSelfOrAdmin } = require("../middleware/auth");

// Sign Up route
router.post("/signup", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ fullname, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Sign In route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        isAdmin: user.isAdmin || false,
        isMainAdmin: user.isMainAdmin || false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

   res.status(200).json({
  message: "Signed in successfully",
  token,
  userId: user._id,
  fullname: user.fullname,
  isAdmin: user.isAdmin || false,
  isMainAdmin: user.isMainAdmin || false,
  username: user.username || "",
  profilePicture: user.profilePicture || "",
});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Forgot Password route
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account found with that email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

       const resetLink = `https://iuexglobe.netlify.app/reset-password.html?token=${resetToken}`;
    await resend.emails.send({
      from: "IUEX Globe.Net <onboarding@resend.dev>",
      to: user.email,
      subject: "Reset Your IUEX Globe.Net Password",
      html: `
        <p>Hi ${user.fullname},</p>
        <p>You requested to reset your password. Click the link below to set a new one:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Reset Password route
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Join product waitlist (for already-registered users)
router.post("/join-waitlist", async (req, res) => {
  try {
    const { email, product } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Account not found" });
    }

    if (!user.interestedProducts.includes(product)) {
      user.interestedProducts.push(product);
      await user.save();
    }

    res.status(200).json({ message: `You're on the ${product} waitlist!` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET all users who joined a product waitlist (admin use)
router.get("/waitlist-users", requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ interestedProducts: { $exists: true, $ne: [] } })
      .select("fullname email interestedProducts");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET all users (for admin management)
router.get("/all-users", requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("fullname email isAdmin isMainAdmin");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PROMOTE a user to admin (main admin only)
router.put("/make-admin/:id", requireMainAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User promoted to admin", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// REMOVE a user's admin status (main admin only; cannot remove the main admin)
router.put("/remove-admin/:id", requireMainAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isMainAdmin) {
      return res.status(403).json({ message: "Cannot remove the main admin" });
    }
    user.isAdmin = false;
    await user.save();
    res.json({ message: "Admin status removed", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// UPDATE username and/or profile picture (only your own account, or an admin)
router.put("/update-profile/:id", requireSelfOrAdmin, async (req, res) => {
  try {
    const { username, profilePicture } = req.body;
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Profile updated",
      username: user.username,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// CHANGE password (requires old password, and only your own account)
router.put("/change-password/:id", requireSelfOrAdmin, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;