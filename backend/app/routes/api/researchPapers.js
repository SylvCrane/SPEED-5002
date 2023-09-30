const express = require('express');
const router = express.Router();

// Load models
const ModerationQueue = require('../../models/moderationQueue');
const ApprovedPaper = require('../../models/approvedPaper');

router.put("/approved/:id", async (req, res) => {
    const paperId = req.params.id;
    try {
        const paper = await ModerationQueue.findById(paperId);
        if (!paper) {
            return res.status(404).json({ msg: "Paper not found" });
        }
        const approvedPaper = new ApprovedPaper(paper.toObject());
        await approvedPaper.save();
        await ModerationQueue.findByIdAndDelete(paperId);
        res.json({ msg: "Paper approved and moved." });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// router.delete("/moderation/:id", async (req, res) => {
//     try {
//         await ModerationQueue.findByIdAndDelete(req.params.id);
//         res.json({ msg: "Paper denied and removed from moderation queue." });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server Error");
//     }
// });


const getModel = (type) => {
    switch (type) {
        case 'approved':
            return ApprovedPaper;
        case 'moderation':
            return ModerationQueue;
        default:
            throw new Error('Invalid type');
    }
};

router.get('/test', (req, res) => res.send('research paper route testing!'));

router.get('/:type', (req, res) => {
    try {
        const Model = getModel(req.params.type);
        Model.find()
            .then(papers => res.json(papers))
            .catch(err => res.status(404).json({ error: err.message }));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:type/:id', (req, res) => {
    try {
        const Model = getModel(req.params.type);
        Model.findById(req.params.id)
            .then(paper => res.json(paper))
            .catch(err => res.status(404).json({ error: err.message }));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/:type', (req, res) => {
    try {
        const Model = getModel(req.params.type);
        Model.create(req.body)
            .then(paper => res.json({ msg: `Research Paper added to ${req.params.type} successfully` }))
            .catch(err => res.status(400).json({ error: err.message }));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// router.put('/:type/:id', (req, res) => {
//     try {
//         const Model = getModel(req.params.type);
//         Model.findByIdAndUpdate(req.params.id, req.body)
//             .then(paper => res.json({ msg: `Updated successfully in ${req.params.type}` }))
//             .catch(err => res.status(400).json({ error: err.message }));
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

router.delete('/:type/:id', (req, res) => {
    try {
        const Model = getModel(req.params.type);
        Model.findByIdAndRemove(req.params.id)
            .then(paper => {
                let message;
                if (req.params.type === 'moderation') {
                    message = "Paper denied and removed from moderation queue.";
                } else {
                    message = `Research Paper entry deleted from ${req.params.type} successfully`;
                }
                res.json({ msg: message });
            })
            .catch(err => res.status(404).json({ error: err.message }));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.delete('/:type', (req, res) => {
    try {
        const Model = getModel(req.params.type);
        Model.deleteMany({})
            .then(() => res.json({ msg: `All Research Paper entries deleted from ${req.params.type} successfully` }))
            .catch(err => res.status(404).json({ error: err.message }));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




// router.put("/api/researchPapers/moderation/:id", async (req, res) => {
//     console.log("here")
//     const paperId = req.params.id;
//     try {
//         const paper = await ModerationQueue.findById(paperId);
//         if (!paper) {
//             return res.status(404).json({ msg: "Paper not found in moderation queue" });
//         }
//         const approvedPaper = new ApprovedPaper(paper.toObject());
//         await approvedPaper.save();
//         await ModerationQueue.findByIdAndDelete(paperId);
//         res.json({ msg: "Paper approved and moved to the approved collection." });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server Error");
//     }
// });

module.exports = router;
