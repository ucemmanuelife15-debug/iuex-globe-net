const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const resend = require("../emailConfig");

// Sign Up route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

   // Check password against hashed version
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Signed in successfully",
      fullname: user.fullname,
      isAdmin: user.isAdmin || false,
      isMainAdmin: user.isMainAdmin || false,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Sign In route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

   // Check password against hashed version
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Signed in successfully", fullname: user.fullname });
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

    const resetLink = `http://127.0.0.1:5500/reset-password.html?token=${resetToken}`;

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
router.get("/waitlist-users", async (req, res) => {
  try {
    const users = await User.find({ interestedProducts: { $exists: true, $ne: [] } })
      .select("fullname email interestedProducts");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;
// GET all users (for admin management)
router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find().select("fullname email isAdmin isMainAdmin");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PROMOTE a user to admin
router.put("/make-admin/:id", async (req, res) => {
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

// REMOVE a user's admin status (cannot remove the main admin)
router.put("/remove-admin/:id", async (req, res) => {
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

module.exports = router;