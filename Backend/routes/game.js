const express = require('express');
const router = express.Router();
const GameQuestion = require('../models/Game');
const { requireAuth, requireAdmin, requireMainAdmin } = require('../middleware/auth');

// GET today's question (most recent one)
router.get('/today', async (req, res) => {
  try {
    const question = await GameQuestion.findOne().sort({ date: -1 });
    if (!question) {
      return res.status(404).json({ message: 'No game question set yet' });
    }
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST a new answer to the current question — must be signed in, and
// can only submit as yourself (your token's email must match userId).
router.post('/answer', requireAuth, async (req, res) => {
  try {
    const { questionId, userId, username, answer } = req.body;

    if (userId !== req.user.email) {
      return res.status(403).json({ message: 'You can only submit your own answer' });
    }

    const question = await GameQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    question.answers.push({ userId, username, answer });
    await question.save();
    res.json({ message: 'Answer submitted', question });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// EDIT/update a specific answer — must be signed in, and can only
// edit your own answer (unless you're an admin, e.g. moderating).
router.put('/answer/:questionId/:answerId', requireAuth, async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const { answer } = req.body;
    const question = await GameQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const targetAnswer = question.answers.id(answerId);
    if (!targetAnswer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (targetAnswer.userId !== req.user.email && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You can only edit your own answer' });
    }

    targetAnswer.answer = answer;
    await question.save();
    res.json({ message: 'Answer updated', question });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE a specific answer from a question — your own answer, or an
// admin removing any answer (moderation).
router.delete('/answer/:questionId/:answerId', requireAuth, async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const question = await GameQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const targetAnswer = question.answers.id(answerId);
    if (!targetAnswer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (targetAnswer.userId !== req.user.email && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You can only delete your own answer' });
    }

    question.answers = question.answers.filter(
      (a) => a._id.toString() !== answerId
    );
    await question.save();
    res.json({ message: 'Answer deleted', question });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Simple admin password check — requires the caller to already be
// signed in as the main admin before they can even attempt this
// password.
router.post('/admin-login', requireMainAdmin, (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect password' });
  }
});

// POST a new question (admin use only)
router.post('/create', requireAdmin, async (req, res) => {
  try {
    const { question, category, postedBy } = req.body;
    const newQuestion = new GameQuestion({ question, category, postedBy });
    await newQuestion.save();
    res.json({ message: 'Question created', newQuestion });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all questions (for admin history view)
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const questions = await GameQuestion.find().sort({ date: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// EDIT a question's text/category (admin use only)
router.put('/question/:id', requireAdmin, async (req, res) => {
  try {
    const { question, category } = req.body;
    const updated = await GameQuestion.findByIdAndUpdate(
      req.params.id,
      { question, category },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question updated', updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE a question entirely (admin use only)
router.delete('/question/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await GameQuestion.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;