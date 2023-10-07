const mongoose = require('mongoose');

const ApprovedPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: [String], // An array of strings
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  publicationYear: {
    type: Number,
    required: true,
  },
  doi: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});


module.exports = ApprovedPaper = mongoose.model('ApprovedPaper', ApprovedPaperSchema);