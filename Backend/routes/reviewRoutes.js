const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET all approved reviews — public, anyone can see these.
// We only populate fullname/username/profilePicture, never email.
router.get('/approved', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .populate('userId', 'fullname username profilePicture')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET the signed-in user's own review (any status) — so the page can
// show them "pending" / "live", and prefill the edit form.
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const review = await Review.findOne({ userId: req.user.userId });
    res.json(review || null);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST a new review — must be signed in, one per account.
router.post('/', requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please choose a rating from 1 to 5' });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Please write a comment' });
    }

    const existing = await Review.findOne({ userId: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: 'You already have a review — edit it instead' });
    }

    const review = new Review({
      userId: req.user.userId,
      rating,
      comment: comment.trim(),
      status: 'pending',
    });
    await review.save();
    res.status(201).json({ message: 'Review submitted and pending approval', review });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT (edit) your own review — editing sends it back to pending, since
// the content changed and needs a fresh look before it's live again.
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only edit your own review' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please choose a rating from 1 to 5' });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Please write a comment' });
    }

    review.rating = rating;
    review.comment = comment.trim();
    review.status = 'pending';
    await review.save();
    res.json({ message: 'Review updated and pending approval', review });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE a review — the user deleting their own, OR an admin removing
// any review (moderation), live or pending.
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.userId.toString() !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You can only delete your own review' });
    }
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all pending reviews — admin moderation queue.
router.get('/pending', requireAdmin, async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'pending' })
      .populate('userId', 'fullname username profilePicture email')
      .sort({ createdAt: 1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all reviews regardless of status — admin view, so they can also
// remove something that's already live.
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'fullname username profilePicture email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT approve a pending review — admin only.
router.put('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review approved', review });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;