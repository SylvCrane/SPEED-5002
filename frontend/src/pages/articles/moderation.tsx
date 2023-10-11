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
}

type ModerationProps = {
  papers: PaperInterface[];
};

const Moderation: NextPage<ModerationProps> = ({ papers: initialPapers }) => {
  const headers = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "journalName", label: "Journal Name" },
    { key: "publicationYear", label: "Publication Year" },
    { key: "volume", label: "Volume" },
    { key: "number", label: "Number" },
    { key: "pages", label: "Pages" },
    { key: "doi", label: "DOI" },
    { key: "action", label: "Action" },
  ];

  const [papers, setPapers] = useState(initialPapers);
  const [approvedPapers, setApprovedPapers] = useState<PaperInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPapers();
    fetchApprovedPapers(); // New fetch function for approved papers
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8082/api/researchPapers/moderation"
      );
      const data = await response.json();
      setPapers(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching papers:", error);
      setIsLoading(false);
    }
  };

  // New handler to clear all approved papers
  const handleClearAllApproved = async () => {
    try {
      const response = await fetch(
        `http://localhost:8082/api/researchPapers/approved`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      console.log(result);
      fetchPapers(); // Refresh the moderation queue list after clearing all papers
      fetchApprovedPapers(); // Refresh the list after clearing all approved papers
    } catch (error) {
      console.error("Error clearing all approved papers:", error);
    }
  };
  const handleClearAllModeration = async () => {
    try {
      const response = await fetch(
        `http://localhost:8082/api/researchPapers/moderation`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      console.log(result);
      fetchPapers(); // Refresh the moderation queue list after clearing all papers
      fetchApprovedPapers(); // Refresh the list after clearing all approved papers
    } catch (error) {
      console.error("Error clearing all papers from moderation queue:", error);
    }
  };
  const handleApprove = async (_id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8082/api/researchPapers/approved/${_id}`,
        {
          method: "PUT",
        }
      );
      const result = await response.json();
      console.log(result);
      fetchPapers(); // Refresh the moderation queue list after clearing all papers
      fetchApprovedPapers(); // Refresh the list after clearing all approved papers
    } catch (error) {
      console.error("Error approving paper:", error);
    }
  };

  const handleDeny = async (id: string) => {
    console.log("Denying ID:", id);
    try {
      const response = await fetch(
        `http://localhost:8082/api/researchPapers/moderation/${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      console.log(result);
      fetchPapers(); // Refresh the moderation queue list after clearing all papers
      fetchApprovedPapers(); // Refresh the list after clearing all approved papers
    } catch (error) {
      console.error("Error denying paper:", error);
    }
  };

  // New fetch function for approved papers
  const fetchApprovedPapers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8082/api/researchPapers/approved"
      );
      const data = await response.json();
      setApprovedPapers(data);
    } catch (error) {
      console.error("Error fetching approved papers:", error);
    }
  };

  // New handler to remove an approved paper
  const handleRemoveApproved = async (_id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8082/api/researchPapers/approved/${_id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      console.log(result);
      fetchPapers(); // Refresh the moderation queue list after clearing all papers
      fetchApprovedPapers(); // Refresh the list after clearing all approved papers
    } catch (error) {
      console.error("Error removing approved paper:", error);
    }
  };

  return (
    <div className="container">
      <h1>Moderation Queue</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ModerationSortableTable
            headers={headers}
            data={papers.map((paper) => ({
              ...paper,
              authors: paper.authors.join(", "),
              action: (
                <div>
                  <button onClick={() => handleApprove(paper._id)}>
                    Approve
                  </button>
                  <button onClick={() => handleDeny(paper._id)}>Deny</button>
                </div>
              ),
            }))}
          />
          <button onClick={handleClearAllModeration}>
            Clear All from Moderation Queue
          </button>
          <h2>Approved Papers</h2>
          <ModerationSortableTable
            headers={headers}
            data={approvedPapers.map((paper) => ({
              ...paper,
              authors: paper.authors.join(", "),
              action: (
                <div>
                  <button onClick={() => handleRemoveApproved(paper._id)}>
                    Remove
                  </button>
                </div>
              ),
            }))}
          />
          <button onClick={handleClearAllApproved}>
            Clear All Approved Papers
          </button>
        </>
      )}
    </div>
  );
};

export default Moderation;
