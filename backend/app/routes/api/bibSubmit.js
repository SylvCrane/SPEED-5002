const express = require('express');
const router = express.Router();
const fsPromise = require('fs/promises');
const ResearchPaper = require('../../model/researchPaper');
const multer = require('multer');

const memoryBuff = multer.memoryStorage()
const upload = multer({ storage: memoryBuff });

router.post('/', upload.single('bibtex'), async (req, res) => {
    
    debugger;

    const bibFile = req.file.buffer;
    const bibFileTotal = bibFile.toString('utf-8');
    const bibFileLines = bibFileTotal.split('\n');

    let title =  '';
    let authors = [];
    let source = '';
    let publicationYear = null;
    let doi = '';
    let description = '';

    for (const bibFileLine of bibFileLines)
    {
        while (bibFileLine !== null)
        {
            let str = bibFileLine;
            
            for (let i = 0; i < str.length; i++)
            {
                if ((str.charAt(i) == 't') || (str.charAt(i) == 'a') || (str.charAt(i) == 's') || (str.charAt(i) == 'p') || (str.charAt(i) == 'd') || (str.charAt(i) == '@'))
                {
                    let schemaIndicator = str.charAt(i);
                    let doiIndicator = str.charAt(i + 1);

                    while (str.charAt(i) != '{')
                    {
                        i++;
                    }

                    i++;

                    switch (schemaIndicator)
                    {
                        case '@':
                            break;
                        case 't':
                            while (str.charAt(i) != '}')
                            {
                                title += str.charAt(i);
                            }
                            break;

                        case 'a':
                            let authorsCombined = '';

                            while (str.charAt(i) != '}')
                            {
                                authorsCombined += str.charAt(i);
                            }

                            const separateAuthors = authorsCombined.split(",");
                            authors = separateAuthors;
                            break;

                        case 's':
                            while (str.charAt(i) != '}')
                            {
                                source += str.charAt(i);
                            }
                            break;

                        case 'p':
                            let pubYearstr = '';

                            while (str.charAt(i) != '}')
                            {
                                pubYearstr += str.charAt(i);
                            }
                            publicationYear = parseInt(pubYearstr);
                            break;

                        case 'd':
                            if (doiIndicator != 'o')
                            {
                                while (str.charAt(i) != '}')
                                {
                                    description += str.charAt(i);
                                }
                                break;
                            }
                            else
                            {
                                while (str.charAt(i) != '}')
                                {
                                    doi += str.charAt(i);
                                }
                                break;
                            }
                    }
                }
            }
        }
    }

    let bibData = null;
    bibData.title = title;
    bibData.authors = authors;
    bibData.source = source;
    bibData.publicationYear = publicationYear;
    bibData.doi = doi;
    bibData.description = description;

    ResearchPaper.create(bibData)
        .then((paper) => res.json({ msg: 'Research Paper added successfully' }))
        .catch((err) => {
            console.log(err);
                res.status(400).json({ error: 'Unable to add this research paper' })
            }
        )
})

module.exports = router