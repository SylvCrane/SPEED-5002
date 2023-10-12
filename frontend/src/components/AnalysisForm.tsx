import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';

interface PaperInterface {
    _id: string;
    title: string;
    authors: string[];
    source: string;
    pubyear: number;
    doi: string;
    description: string;
    // Add any additional fields for analysis
  }

type AnalystProps = {
    paperToAnalyze: PaperInterface;
     
}

export default function AnalysisForm({ paperToAnalyze }: AnalystProps) {

    return (
        <form>
            <label>Authors:</label>
            <input type="text" defaultValue={paperToAnalyze.authors} />

            <label>title</label>
            <input type="text" defaultValue={paperToAnalyze.title} />

            <button type="submit">Submit</button>
        </form>
    )
}