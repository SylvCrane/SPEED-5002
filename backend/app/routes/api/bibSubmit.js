const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    res.json({ msg: 'Research Paper added successfully' });
    
    //console.log(req);

});

module.exports = router