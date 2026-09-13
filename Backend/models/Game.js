const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const gameQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Tech'
  },
  date: {
    type: Date,
    default: Date.now
  },
  answers: [answerSchema]
});

module.exports = mongoose.model('GameQuestion', gameQuestionSchema);