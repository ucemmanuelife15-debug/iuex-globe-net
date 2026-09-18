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

// Simple admin password check
router.post('/admin-login', (req, res) => {
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
    const { question, category } = req.body;
    const newQuestion = new GameQuestion({ question, category });
    await newQuestion.save();
    res.json({ message: 'Question created', newQuestion });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;