import { GetStaticProps, NextPage } from "next";
import SortableTable from "../../components/table/SortableTable";
import { useEffect, useState } from "react";

interface ArticlesInterface {
  _id: string;
  title: string;
  authors: string;
  journalName: string;
  publicationYear: number;
  volume: number;
  pages: string;
  doi: string;
  practice: string;
  claim: string;
}

type ArticlesProps = {
  articles: ArticlesInterface[];
};

const Articles: NextPage<ArticlesProps> = ({ articles: initialArticles }) => {
  const headers: { key: keyof ArticlesInterface; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "journalName", label: "Journal Name"},
    { key: "publicationYear", label: "Publication Year" },
    { key: "volume", label: "Volume" },
    { key: "pages", label: "Pages" },
    { key: "doi", label: "DOI" },
    { key: "practice", label: "SE Practice" },
    { key: "claim", label: "Claim" },
  ];

  const [articles, setArticles] = useState(initialArticles);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch articles from the API
    fetch("https://speed-5002-backend.vercel.app/api/researchPapers/analyzed")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const fetchedArticles: ArticlesInterface[] = data.map((article: any) => ({
          id: article.id ?? article._id,
          title: article.title,
          authors: article.authors,
          journalName: article.journalName,
          publicationYear: article.publicationYear,
          volume: article.volume,
          pages: article.pages,
          doi: article.doi,
          practice: article.practice,
          claim: article.claim          
        }));
        setArticles(fetchedArticles);
        setIsLoading(false); // Data has been fetched
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        setIsLoading(false); // An error occurred while fetching
      });
  }, []);

  return (
    <div className="container">
      <h1>Articles Index Page</h1>
      <p>Page containing a table of articles:</p>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <SortableTable headers={headers} data={articles} />
      )}
    </div>
  );
};

export default Articles;
