const express = require('express');
const router = express.Router();
const GameQuestion = require('../models/Game');

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

// POST a new question (admin use)
router.post('/create', async (req, res) => {
  try {
    const { question, category } = req.body;
    const newQuestion = new GameQuestion({ question, category });
    await newQuestion.save();
    res.json({ message: 'Question created', newQuestion });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;