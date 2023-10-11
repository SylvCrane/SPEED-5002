import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function SubmissionForm() {
  const { register, handleSubmit } = useForm();

  // The following function is used to process the submission of a Bib form.
  const handleBibSubmit = (e: any) => {
    e.preventDefault();

    //Used in the console of the browser to verify the frontend is working as intended
    debugger;
    const url = "http://localhost:8082/api/bibtex";

    //Data transferring itself is in a try-catch statement to catch errors separate to the post command itself
    try {
      //FormData used to process file
      const bibData = new FormData();
      bibData.append("bibtex", e.target[0].files[0]);

      //Axois post used as it allows for the use of multipart data, such as text files
      axios
        .post(url, bibData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log("The axios post is failing");
          console.log(err);
        });
    } catch (err) {
      console.log("Issue everywhere");
    }
  };

  const onSubmit = (data: any) => {
    const url = "http://localhost:8082/api/researchPapers/moderation";

    const realAuthors = data.authors.split(",");
    data.authors = realAuthors;

    data.description = "";
    if (data.claim) {
      // changed from data.claims to data.claim
      data.description += "Claim: " + data.claim;
    }

    if (data.evidence) {
      data.description +=
        (data.description ? " | " : "") + "Evidence: " + data.evidence;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Response:", responseData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("title")} placeholder="Title" />

          <p>
            <input
              {...register("authors")}
              placeholder="Authors (comma separated)"
            />
          </p>

          <p>
            <input {...register("journalName")} placeholder="Journal Name" />
          </p>

          <p>
            <input
              {...register("publicationYear", { valueAsNumber: true })}
              placeholder="Publication Year"
            />
          </p>

          <p>
            <input
              {...register("volume", { valueAsNumber: true })}
              placeholder="Volume"
            />
          </p>

          <p>
            <input
              {...register("number", { valueAsNumber: true })}
              placeholder="Number"
            />
          </p>

          <p>
            <input {...register("pages")} placeholder="Pages" />
          </p>

          <p>
            <input {...register("doi")} placeholder="DOI" />
          </p>

          <input type="submit" value="Submit Paper" />
        </form>
        <br />
        <label>Submit using bibtex</label>
        <form onSubmit={handleBibSubmit} encType="multipart/form-data">
          <input type="file" name="bibtex" accept=".txt" />
          <input type="submit" value="bibForm" />
        </form>
      </>
    </>
  );
}
