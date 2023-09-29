const express = require('express');
const router = express.Router();
const fsPromise = require('fs/promises');

router.post('/', (req, res) => {
    
    const file = fsPromise.readFile(req.file, 'r');
    console.log(file);
    
    //console.log(req);

});

module.exports = router