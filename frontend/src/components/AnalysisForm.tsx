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

    const onSubmit = (data:any) => {
        debugger;
        const url = `https://speed-5002-backend.vercel.app/api/researchPapers/analyzedPaper/${paper.paper._id}`;

        const arrayAuthors = data.authors.split(",");
        data.authors = arrayAuthors;

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
            })
            .catch(error => {
              console.error('Error:', error);
            });
        
        location.reload();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <table>
                <tbody>
                    <tr>
                        <td align="left">Authors:</td>
                        <td><input{...register("authors")} defaultValue={paper.paper.authors} /></td>
                    </tr>
                    <tr>
                        <td align="left">Title:</td>
                        <td><input {...register("title")} defaultValue={paper.paper.title} /></td>
                    </tr>
                    <tr>
                        <td align="left">Journal:</td>
                        <td><input {...register("journalName")} /></td>
                    </tr>
                    <tr>
                        <td align="left">Publication Year:</td>
                        <td><input {...register("publicationYear")} defaultValue={paper.paper.publicationYear}/></td>
                    </tr>
                    <tr>
                        <td align="left">Volume:</td>
                        <td><input {...register("volume")}/></td>
                    </tr>
                    <tr>
                        <td align="left">Pages:</td>
                        <td><input {...register("pages")}/></td>
                    </tr>
                    <tr>
                        <td align="left">DOI:</td>
                        <td><input {...register("doi")} defaultValue={paper.paper.doi}/></td>
                    </tr>
                    <tr>
                        <td align="left">SE Practice:</td>
                        <td><input {...register("practice")}/></td>
                    </tr>
                    <tr>
                        <td align="left">Claim:</td>
                        <td><textarea {...register("claim")} rows={5} cols={30} style={{ width: '200px', height: '60px' }}/></td>
                    </tr>
                    <tr>
                        <td align="left">Submit</td>
                        <td><button type="submit">Submit</button></td>
                    </tr>
                </tbody>
            </table>
        </form>
    )
}