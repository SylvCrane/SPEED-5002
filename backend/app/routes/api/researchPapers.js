const express = require('express');
const router = express.Router();
const emailService = require('./emailService');

TEST_EMAIL = 'gdr7663@autuni.ac.nz'

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

router.post('/:type', async (req, res) => {
  try {
      const Model = getModel(req.params.type);
      const paper = await Model.create(req.body);
      console.log("debug");
      // Check if the paper is added to the moderation queue, then send email notification
      if (req.params.type === "moderation") {
          console.log("Attempting to send notification email..."); // Log before attempting to send the email

          try {
              await emailService.sendNotificationEmail(
                  TEST_EMAIL,     // The email address of the moderator or whoever should be notified
                  'New Paper Added',    
                  'A paper has been added for moderation.'  
              );

              console.log("Notification email sent."); // Log after email is sent
          } catch (emailError) {
              console.error("Failed to send notification email:", emailError);
              // Just logging the email error for now. You could handle this more gracefully if needed.
          }
      }

      res.status(200)
        .json({ msg: `Research Paper added to ${req.params.type} successfully` });
  } catch (error) {
      console.error("Error in the POST /:type route:", error); // Additional log to catch other errors
      res.status(400).json({ error: error.message });
  }
});



router.delete("/:type/:id", (req, res) => {
  try {
    const Model = getModel(req.params.type);
    Model.findByIdAndRemove(req.params.id)
      .then((paper) => {
        let message;
        if (req.params.type === "moderation") {
          message = "Paper denied and removed from moderation queue.";
        } else {
          message = `Research Paper entry deleted from ${req.params.type} successfully`;
        }
        res.json({ msg: message });
      })
      .catch((err) => res.status(404).json({ error: err.message }));
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

module.exports = router;
