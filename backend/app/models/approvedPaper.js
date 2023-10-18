const mongoose = require('mongoose');

const ApprovedPaperSchema = new mongoose.Schema({
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
});


module.exports = ApprovedPaper = mongoose.model('ApprovedPaper', ApprovedPaperSchema);