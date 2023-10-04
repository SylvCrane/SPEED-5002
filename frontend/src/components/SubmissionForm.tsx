import React from "react";
import { useForm } from "react-hook-form";

export default function SubmissionForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data:any) => {
    const url = 'http://localhost:8082/api/researchPapers/moderation';

    const realAuthors = data.authors.split(",");
    data.authors = realAuthors;
    
    data.description = "";
    if (data.claim) { // changed from data.claims to data.claim
      data.description += "Claim: " + data.claim;
    }

    if (data.evidence) {
      data.description += (data.description ? " | " : "") + "Evidence: " + data.evidence;
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
    <form onSubmit={handleSubmit(onSubmit)}>
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
  );
}
