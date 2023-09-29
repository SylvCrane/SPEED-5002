const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {

    console.log('Made it to the backend');
    //console.log(req);

})

module.exports = router