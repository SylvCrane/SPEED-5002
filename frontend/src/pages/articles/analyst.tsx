import { NextPage } from "next";
import ModerationSortableTable from "../../components/table/ModerationSortableTable";
import { useEffect, useState } from "react";

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
  papers: PaperInterface[];
};

const Analyst: NextPage<AnalystProps> = ({ papers: initialPapers }) => {
  const headers = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "journalName", label: "Journal Name" },
    { key: "publicationYear", label: "Publication Year" },
    { key: "volume", label: "Volume" },
    { key: "number", label: "Number" },
    { key: "pages", label: "Pages" },
    { key: "doi", label: "DOI" },
    { key: "action", label: "Analyze" },
  ];

  const [papers, setPapers] = useState(initialPapers);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState<PaperInterface | null>(null); // Paper selected for analysis

  useEffect(() => {
    fetchApprovedPapers();
  }, []);

  const fetchApprovedPapers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8082/api/researchPapers/approved"
      );
      const data = await response.json();
      setPapers(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching approved papers:", error);
      setIsLoading(false);
    }
  };

  const handleAnalyze = (paper: PaperInterface) => {
    setSelectedPaper(paper);
  };

  return (
    <div className="container">
      <h1>Analyst Queue</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {selectedPaper ? (
            // Display a form for analysis
            <AnalysisForm paper={selectedPaper} onAnalysisComplete={() => {
              fetchApprovedPapers();
              setSelectedPaper(null);
            }} />
          ) : (
            <ModerationSortableTable
              headers={headers}
              data={papers.map((paper) => ({
                ...paper,
                authors: paper.authors.join(", "),
                action: (
                  <div>
                    <button onClick={() => handleAnalyze(paper)}>
                      Analyze
                    </button>
                  </div>
                ),
              }))}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Analyst;
