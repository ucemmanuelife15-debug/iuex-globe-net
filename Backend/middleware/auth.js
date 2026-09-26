const jwt = require("jsonwebtoken");

// Confirms the request has a valid, signed-in token. Attaches the
// decoded info (userId, isAdmin, isMainAdmin) to req.user for the
// next function to use.
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

// For routes only an admin (or the main admin) should reach.
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  });
}

// For routes only the chairman/main admin should reach.
function requireMainAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.user.isMainAdmin) {
      return res.status(403).json({ message: "Main admin access required" });
    }
    next();
  });
}

// For routes where a user should only be able to act on their own
// account (profile updates, password changes) — admins are also let
// through, in case that's ever needed.
function requireSelfOrAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.userId === req.params.id || req.user.isAdmin) {
      return next();
    }
    return res.status(403).json({ message: "Not authorized" });
  });
}

module.exports = { requireAuth, requireAdmin, requireMainAdmin, requireSelfOrAdmin };