import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SubmissionForm from '../src/components/SubmissionForm';

(global.fetch as any) = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({ msg: 'Research Paper added successfully' }),
  }));

describe("Submitting a new article", () => {

    const consoleSpy = jest.spyOn(console, "log");

    const { getByPlaceholderText, getByRole } = render(<SubmissionForm />);
    const title = getByPlaceholderText("Title");
    const authors = getByPlaceholderText("Authors");
    const publicationyear = getByPlaceholderText("Publication Year");
    const doi = getByPlaceholderText("DOI");
    const claim = getByPlaceholderText("Claim");
    const evidence = getByPlaceholderText("Evidence");
    const button = getByRole('button', { name: /manualForm/i });

    fireEvent.change(title, { target: { value: "TestTitle" } });
    fireEvent.change(authors, { target: { value: "TestAuthor" } });
    fireEvent.change(publicationyear, { target: { value: "2023" } });
    fireEvent.change(doi, { target: { value: "TestDOI" } });
    fireEvent.change(claim, { target: { value: "TestClaim" } });
    fireEvent.change(evidence, { target: { value: "TestEvidence" } });

    fireEvent.click(button);

    it("performs a form submission", async () => {
        expect(consoleSpy).toHaveBeenCalledWith('Response:', {msg: 'Research Paper added successfully' });
        consoleSpy.mockRestore();
    });
});

describe("Submitting bibtex", () => {

    const coneolseSpy = jest.spyOn(console, "log");

    const {  getByRole } = render(<SubmissionForm />);
    const bibFileSubmit = getByRole('textbox');
    const bibSubmission = getByRole('button', { name: /bibForm/i });
    
    
})


