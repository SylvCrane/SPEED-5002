// routes/api/researchPapers.js

const express = require('express')
const router = express.Router()

// Load ResearchPaper model
const ResearchPaper = require('../../model/researchPaper')

// @route GET api/researchPapers/test
// @description tests researchPapers route
// @access Public
router.get('/test', (req, res) => res.send('research paper route testing!'))

// @route GET api/researchPapers
// @description Get all research papers
// @access Public
router.get('/', (req, res) => {
    ResearchPaper.find()
        .then((papers) => res.json(papers))
        .catch((err) =>
            res.status(404).json({ nopapersfound: 'No Approved Papers found' })
        )
})

// @route GET api/researchPapers/:id
// @description Get single research paper by id
// @access Public
router.get('/:id', (req, res) => {
    ResearchPaper.findById(req.params.id)
        .then((paper) => res.json(paper))
        .catch((err) => res.status(404).json({ nopaperfound: 'No Approved Paper found' }))
})

// @route POST api/researchPapers
// @description add/save research paper
// @access Public
router.post('/', (req, res) => {
    ResearchPaper.create(req.body)
        .then((paper) => res.json({ msg: 'Analyst Paper added successfully' }))
        .catch((err) => {
            console.log(err);
                res.status(400).json({ error: 'Unable to add this analyst paper' })
            }
        )
})

// @route PUT api/researchPapers/:id
// @description Update research paper
// @access Public
router.put('/:id', (req, res) => {
    ResearchPaper.findByIdAndUpdate(req.params.id, req.body)
        .then((paper) => res.json({ msg: 'Updated successfully' }))
        .catch((err) =>
            res.status(400).json({ error: 'Unable to update the Database' })
        )
})

// @route DELETE api/researchPapers/:id
// @description Delete research paper by id
// @access Public
router.delete('/:id', (req, res) => {
    ResearchPaper.findByIdAndRemove(req.params.id, req.body)
        .then((paper) => res.json({ msg: 'Research Paper entry deleted successfully' }))
        .catch((err) => res.status(404).json({ error: 'No such a research paper' }))
})

// @route DELETE api/researchPapers
// @description Delete all research papers
// @access Public
router.delete('/', (req, res) => {
    ResearchPaper.deleteMany({})
      .then(() => res.json({ msg: 'All Research Paper entries deleted successfully' }))
      .catch((err) => res.status(404).json({ error: 'An error occurred while deleting research papers' }));
  })

module.exports = router