import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AnalystForm from '../src/components/AnalystForm';

(global.fetch as any) = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({ msg: 'Paper added to final database successfully' }),
  }));

  describe("Submitting a new article", () => {

    //Used to identify console statements
    const consoleSpy = jest.spyOn(console, "log");

    //declare each form component
    const { getByPlaceholderText, getByRole } = render(<AnalystForm />);
    const title = getByPlaceholderText("Title");
    const authors = getByPlaceholderText("Authors");
    const publicationyear = getByPlaceholderText("Publication Year");
    const doi = getByPlaceholderText("DOI");
    const sePractice = getByPlaceholderText("sePractice");
    const claim = getByPlaceholderText("Claim");
    const evidence = getByPlaceholderText("Evidence");
    const button = getByRole('button', { name: /analystForm/i });

    //Assign a variable to each form component
    fireEvent.change(title, { target: { value: "TestTitle" } });
    fireEvent.change(authors, { target: { value: "TestAuthor" } });
    fireEvent.change(publicationyear, { target: { value: "2023" } });
    fireEvent.change(doi, { target: { value: "TestDOI" } });
    fireEvent.change(sePractice, { traget: { value: "TestSEPractice"}});
    fireEvent.change(claim, { target: { value: "TestClaim" } });
    fireEvent.change(evidence, { target: { value: "TestEvidence" } });

    //Click to initiate the submission
    fireEvent.click(button);

    //If the console reads the successful statement, the test has passed.
    it("performs a form submission", async () => {
        expect(consoleSpy).toHaveBeenCalledWith('Response:', {msg: 'Paper added to final database successfully' });
        consoleSpy.mockRestore();
    });
});