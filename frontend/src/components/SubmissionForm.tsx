import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';

export default function SubmissionForm() {
  const { register, handleSubmit } = useForm();

  const handleBibSubmit = (e: any) => {
    e.preventDefault();
    debugger;
    const url = 'https://speed-5002-backend.vercel.app/api/bibSubmit';
    const urlLocal = 'http://localhost:8082/api/bibSubmit'
    try{
        console.log("Made it here");

        const bibData = new FormData();
        bibData.append('bibtex', e.target[0].files[0]);
    
        axios.post(urlLocal, bibData, { headers: {'Content-Type': 'multipart/form-data'}})
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log('The axios post is failing');
          console.log(err);
        })
    }
    catch (err)
    {
        console.log('Issue everywhere');
    }
  };

  const onSubmit = (data:any) => {
    const url = 'https://speed-5002-backend.vercel.app/api/researchPapers';

    const realAuthors = data.authors.split(",")
    data.authors = realAuthors;
    
    data.description = ""
    if (data.claim) {
      data.description += "Claim: " + data.claim;
    }

    if (data.evidence) {
      data.description += "Evidence: " + data.evidence;
    }

    const requestOptions = {
      method: 'POST',
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
  };

  return (
    <><><form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")} placeholder="Title" />

      <p>
        <input {...register("authors")} placeholder="Authors" />
      </p>

      <p>
        <input {...register("source")} placeholder="Source" />
      </p>

      <p>
        <input {...register("publicationYear")} placeholder="Publication Year" />
      </p>

      <p>
        <input {...register("doi")} placeholder="DOI" />
      </p>

      <p>
        <input {...register("claim")} placeholder="Claim" />
      </p>

      <p>
        <input {...register("evidence")} placeholder="Evidence" />
      </p>

      <input type="submit" />
    </form>
    <br />
    <label>Submit using bibtex</label>
    <form onSubmit={handleBibSubmit} encType='multipart/form-data'>
        <input type="file" name="bibtex" accept=".txt" />
        <input type="submit" />
    </form></></>
  );
}
