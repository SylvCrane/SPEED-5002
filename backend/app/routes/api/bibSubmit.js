const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {

    console.log(req);

    // ResearchPaper.create(req.body)
    //     .then((paper) => res.json({ msg: 'Research Paper added successfully' }))
    //     .catch((err) => {
    //         console.log(err);
    //             res.status(400).json({ error: 'Unable to add this research paper' })
    //         }
    //     )
})

module.exports = router