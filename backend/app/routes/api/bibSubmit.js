const express = require('express');
const router = express.Router();
const fsPromise = require('fs/promises');

router.route('/').post( upload.single('bibtex'), (req, res) => {
    
    const file = fsPromise.readFile(req.file.path, 'r');
    console.log(file);
    
    //console.log(req);

});

module.exports = router