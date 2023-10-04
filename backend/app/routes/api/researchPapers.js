const express = require("express");
const router = express.Router();
const emailService = require("./emailService");

const TEST_EMAIL = 'gdr7663@autuni.ac.nz';  // Replace with your testing email.

// Load models
const ModerationQueue = require("../../models/moderationQueue");
const ApprovedPaper = require("../../models/approvedPaper");

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
    case "approved":
      return ApprovedPaper;
    case "moderation":
      return ModerationQueue;
    default:
      throw new Error("Invalid type");
  }
};

router.get("/test", (req, res) => res.send("research paper route testing!"));

router.get("/:type", (req, res) => {
  try {
    const Model = getModel(req.params.type);
    Model.find()
      .then((papers) => res.json(papers))
      .catch((err) => res.status(404).json({ error: err.message }));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:type/:id", (req, res) => {
  try {
    const Model = getModel(req.params.type);
    Model.findById(req.params.id)
      .then((paper) => res.json(paper))
      .catch((err) => res.status(404).json({ error: err.message }));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/:type", async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    const paper = await Model.create(req.body);
    // Check if paper is added to moderation, then send email notification
    if (req.params.type === "moderation") {
      try {
          await emailService.sendNotificationEmail(
              TEST_EMAIL,
              "New Paper Added",
              "A paper has been added for moderation."
          );
      } catch (emailError) {
          console.error("Failed to send notification email:", emailError);
      }
  }
  

    res
      .status(200)
      .json({ msg: `Research Paper added to ${req.params.type} successfully ${TEST_EMAIL}` });
  } catch (error) {
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

router.delete("/:type", (req, res) => {
  try {
    const Model = getModel(req.params.type);
    Model.deleteMany({})
      .then(() =>
        res.json({
          msg: `All Research Paper entries deleted from ${req.params.type} successfully`,
        })
      )
      .catch((err) => res.status(404).json({ error: err.message }));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
