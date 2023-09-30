import { NextPage } from "next";
import ModerationSortableTable from "../../components/table/ModerationSortableTable";
import { useEffect, useState } from "react";
import { data } from "autoprefixer";

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
      { key: "source", label: "Source" },
      { key: "publicationYear", label: "Publication Year" },
      { key: "doi", label: "DOI" },
      { key: "description", label: "Description" },
      { key: "action", label: "Action" }
    ];

  const [papers, setPapers] = useState(initialPapers);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/researchPapers/moderation");
      const data = await response.json();
      setPapers(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching papers:", error);
      setIsLoading(false);
    }
  };

  const handleApprove = async (_id: string) => {
    try {
        const response = await fetch(`http://localhost:8082/api/researchPapers/approved/${_id}`, {
    method: "PUT"
});

        console.log(response);
        // const result = await response.json();
        // console.log(result);
        fetchPapers(); // Refresh the list after approval
    } catch (error) {
        console.error("Error approving paper:", error);
    }
};


  const handleDeny = async (id: string) => {
    console.log("Denying ID:", id);
    try {
      const response = await fetch(`http://localhost:8082/api/researchPapers/moderation/${id}`, {
        method: "DELETE"
      });
      const result = await response.json();
      console.log(result);
      fetchPapers(); // Refresh the list after denial
    } catch (error) {
      console.error("Error denying paper:", error);
    }
  };

  return (
    <div className="container">
      <h1>Moderation Page</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ModerationSortableTable 
          headers={headers} 
          data={papers.map(paper => ({
            ...paper,
            authors: paper.authors.join(', '),
            action: (
              <div>
                {/* <button onClick={() => console.log(paper._id)}>Approve</button> */}

                <button onClick={() => handleApprove((paper._id))}>Approve</button>
                <button onClick={() => handleDeny(paper._id)}>Deny</button>
              </div>
            )
          }))}
        />
      )}
    </div>
  );
};

export default Moderation;
