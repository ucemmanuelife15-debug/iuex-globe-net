const express = require('express');
const router = express.Router();
const GameQuestion = require('../models/Game');
const { requireMainAdmin } = require('../middleware/auth');

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

// POST a new answer to the current question
router.post('/answer', async (req, res) => {
  try {
    const { questionId, userId, username, answer } = req.body;
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

// EDIT/update a specific answer
router.put('/answer/:questionId/:answerId', async (req, res) => {
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
    targetAnswer.answer = answer;
    await question.save();
    res.json({ message: 'Answer updated', question });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE a specific answer from a question
router.delete('/answer/:questionId/:answerId', async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const question = await GameQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
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

// Simple admin password check — now requires the caller to already be
// signed in as the main admin before they can even attempt this
// password. Closes the loophole where anyone could hit this endpoint
// directly (no sign-in at all) and try to guess the password.
router.post('/admin-login', requireMainAdmin, (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect password' });
  }
});

// POST a new question (admin use)
router.post('/create', async (req, res) => {
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
router.get('/all', async (req, res) => {
  try {
    const questions = await GameQuestion.find().sort({ date: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// EDIT a question's text/category
router.put('/question/:id', async (req, res) => {
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

// DELETE a question entirely
router.delete('/question/:id', async (req, res) => {
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