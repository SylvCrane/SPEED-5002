const mongoose = require('mongoose');

const AnalyzedPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],  // An array of strings
    required: true,
  },
  journalName: {
    type: String,
    required: true,
  },
  publicationYear: {
    type: Number,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  pages: {
    type: String,
    required: true,
  },
  doi: {
    type: String,
    required: true,
  },
  practice: {
    type: String,
    required: true,
  },
  claim: {
    type: String,
    required: true,
  },
  rating: {
    type: Decimal128,
    required: true
  }
});


module.exports = AnalyzedPaper = mongoose.model('AnalyzedPaper', AnalyzedPaperSchema);