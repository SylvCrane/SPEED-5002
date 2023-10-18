import React from 'react';
import { render, fireEvent, waitFor, getByLabelText } from '@testing-library/react';
import AnalysisForm from '../src/components/AnalysisForm';

(global.fetch as any) = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({ msg: 'Paper added to final database successfully' }),
  }));

  describe("Analyzing an article", () => {

    //Used to identify console statements
    const consoleSpy = jest.spyOn(console, "log");

    //declare each form component
    const { getByLabelText, getByRole } = render(<AnalysisForm paper={{
      _id: '',
      title: '',
      authors: [],
      source: '',
      publicationYear: 0,
      doi: '',
      description: ''
    }} />);
    const title = getByLabelText("Title:");
    const authors = getByLabelText("Authors:");
    const journal = getByLabelText("Journal:");
    const publicationyear = getByLabelText("Publication Year:");
    const doi = getByLabelText("DOI:");
    const sePractice = getByLabelText("SE Practice:");
    const claim = getByLabelText("Claim:");
    const volume = getByLabelText("Volume:");
    const pages = getByLabelText("Pages:");
    const button = getByRole('button');

    //Assign a variable to each form component
    fireEvent.change(title, { target: { value: "jestTitle" } });
    fireEvent.change(authors, { target: { value: "jestAuthor" } });
    fireEvent.change(publicationyear, { target: { value: "2023" } });
    fireEvent.change(journal, { target: { value: "jestJournal"}});
    fireEvent.change(doi, { target: { value: "jestDOI" } });
    fireEvent.change(sePractice, { traget: { value: "jestSEPractice"}});
    fireEvent.change(claim, { target: { value: "jestClaim" } });
    fireEvent.change(volume, { target: { value: "0"}});
    fireEvent.change(pages, { target: { value: "1-2"}});
    
    //Click to initiate the submission
    fireEvent.click(button);

    //If the console reads the successful statement, the test has passed.
    it("performs a form submission", async () => {
        expect(consoleSpy).toHaveBeenCalledWith('Response:', {msg: 'Paper added to final database successfully' });
        consoleSpy.mockRestore();
    });
});


