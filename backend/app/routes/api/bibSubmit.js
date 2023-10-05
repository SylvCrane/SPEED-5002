const express = require('express');
const router = express.Router();
const fsPromise = require('fs/promises');
const ResearchPaper = require('../../models/researchPaper');
const multer = require('multer');

const memoryBuff = multer.memoryStorage()
const upload = multer({ storage: memoryBuff });

router.post('/', upload.single('bibtex'), async (req, res) => {
    
 //Read file, split into lines to read one by one
    const bibFile = req.file.buffer;
    const bibFileTotal = bibFile.toString('utf-8');
    const bibFileLines = bibFileTotal.split('\n');

    //Pre-setting the data to save to Mongo
    let data = {
        title: '',
        authors: [],
        source: '',
        publicationYear: null,
        doi: '',
        description: ''
    }

    //Looping through file string
    for (let numLines = 0; numLines < bibFileLines.length; numLines++)
    {
        let str = bibFileLines[numLines];
        let i = 0;

        while(str.charAt(i) === ' ')
        {
            i++;
        }
            
        //Checking if the string's initial character is the beginning of the researchPaper schema
        if ((str.charAt(i) == 't') || (str.charAt(i) == 'a') || (str.charAt(i) == 's') || (str.charAt(i) == 'p') || (str.charAt(i) == 'd') || (str.charAt(i) == '@'))
        {

            //doiIndicator required as two schema begin with d
            let schemaIndicator = str.charAt(i);
            let doiIndicator = str.charAt(i + 1);

            while (str.charAt(i) != '{')
            {
                i++;
            }

            i++;

            //This switch case assigns values to each of the keys in the data variable.
            switch (schemaIndicator)
            {
                case '@':
                    break;
                case 't':
                    while (str.charAt(i) != '}')
                    {
                        data.title += str.charAt(i);
                        i++;
                    }
                    break;

                case 'a':
                    let authorsCombined = '';

                    while (str.charAt(i) != '}')
                    {
                        authorsCombined += str.charAt(i);
                        i++;
                    }

                    //Accounting for multiple authors, split and add to array value
                    const separateAuthors = authorsCombined.split(",");
                    data.authors = separateAuthors;
                    break;

                case 's':
                    while (str.charAt(i) != '}')
                    {
                        data.source += str.charAt(i);
                        i++;
                    }
                    break;

                case 'p':
                    let pubYearstr = '';

                    while (str.charAt(i) != '}')
                    {
                        pubYearstr += str.charAt(i);
                        i++;
                    }
                    data.publicationYear = parseInt(pubYearstr);
                    break;

                case 'd':
                    if (doiIndicator != 'o')
                    {
                        while (str.charAt(i) != '}')
                        {
                            data.description += str.charAt(i);
                            i++;
                         }
                        break;
                    }
                    else
                    {
                        while (str.charAt(i) != '}')
                        {
                            data.doi += str.charAt(i);
                            i++;
                        }
                        break;
                    }
            }
        } 
    }
    
    ResearchPaper.create(data)
        .then((paper) => res.json({ msg: 'Research Paper added successfully' }))
        .catch((err) => {
            console.log(err);
                res.status(400).json({ error: 'Unable to add this research paper' })
            }
        )
})

module.exports = router