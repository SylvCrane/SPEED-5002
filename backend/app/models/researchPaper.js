const mongoose = require('mongoose');

const ResearchPaperSchema = new mongoose.Schema({
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
  },
  linkedDiscussion: { // Added linkedDiscussion field
    type: String,
    required: false, // Adjust as necessary; if it's optional, you may omit this line or set it to false
  },
});

module.exports = ResearchPaper = mongoose.model('researchPaper', ResearchPaperSchema);

