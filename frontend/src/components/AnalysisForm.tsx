import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';

type PaperInterface = {
    _id: string;
    title: string;
    authors: string[];
    source: string;
    publicationYear: number;
    doi: string;
    description: string;
    // Add any additional fields for analysis
  }

type AnalystProps = {
    paper: PaperInterface;
    onAnalysisComplete?: () => void;
     
}

export default function AnalysisForm( paper: AnalystProps) {

    

    const { register, handleSubmit } = useForm();
    const [ content, setContent ] = useState("");

    const onSubmit = (data:any) => {
        debugger;
        const url = `https://speed-5002-backend.vercel.app/api/researchPapers/analyzedPaper/${paper.paper._id}`;
        const testURL = `http://localhost:8082/api/researchPapers/analyzedPaper/${paper.paper._id}`;


        const arrayAuthors = data.authors.split(",");
        data.authors = arrayAuthors;

        data.rating = 0.0;

        const requestOptions = {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          };
        
          fetch(url, requestOptions)
            .then(response => response.json())
            .then(responseData => {
              console.log('Response:', responseData);
              setContent(content + "The article has been analyzed and submitted successfully!");

            })
            .catch(error => {
              console.error('Error:', error);
              setContent(content + "The article has failed to be analyzed. Ensure that each field is filled and that the Publication Year and Volume are numbers.");
            });
        
        
    };

    return (
        <><form onSubmit={handleSubmit(onSubmit)}>
            <table>
                <tbody>
                    <tr>
                        <td align="left"><label htmlFor="auth">Authors:</label></td>
                        <td><input id="auth" {...register("authors")} defaultValue={paper.paper.authors} /></td>
                    </tr>
                    <tr>
                    <td align="left"><label htmlFor="titl">Title:</label></td>
                        <td><input id="titl" {...register("title")} defaultValue={paper.paper.title} /></td>
                    </tr>
                    <tr>
                    <td align="left"><label htmlFor="journ">Journal:</label></td>
                        <td><input id="journ" {...register("journalName")} /></td>
                    </tr>
                    <tr>
                    <td align="left"><label htmlFor="pubyear">Publication Year:</label></td>
                        <td><input id="pubyear" {...register("publicationYear")} defaultValue={paper.paper.publicationYear} /></td>
                    </tr>
                    <tr>
                    <td align="left"><label htmlFor="vol">Volume:</label></td>
                        <td><input id="vol" {...register("volume")} /></td>
                    </tr>
                    <tr>
                    <td align="left"><label htmlFor="pages">Pages:</label></td>
                        <td><input id="pages" {...register("pages")} /></td>
                    </tr>
                    <tr>
                    <td align="left"><label htmlFor="doi">DOI:</label></td>
                        <td><input id="doi" {...register("doi")} defaultValue={paper.paper.doi} /></td>
                    </tr>
                    <tr>
                    <td align="left"><label htmlFor="prac">SE Practice:</label></td>
                        <td><input id="prac" {...register("practice")} /></td>
                    </tr>
                    <tr>
                    <td align="left"><label htmlFor="claim">Claim:</label></td>
                        <td><textarea id="claim" {...register("claim")} rows={5} cols={30} style={{ width: '200px', height: '60px' }} /></td>
                    </tr>
                    <tr>
                        <td align="left">Submit</td>
                        <td><button type="submit">Submit</button></td>
                    </tr>
                </tbody>
            </table>
        </form>
        <div>
            {content}
        </div></>
    )
}