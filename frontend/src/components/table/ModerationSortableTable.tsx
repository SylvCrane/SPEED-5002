import React, { useState, useMemo } from "react";
import styles from './SortableTable.module.scss'; 

export type RowData = {
    [key: string]: string | number | JSX.Element | string[];
  };

  interface ModerationTableSorterProps {
    headers: { key: string; label: string }[];
    data: RowData[];
  }

const ModerationTableSorter: React.FC<ModerationTableSorterProps> = ({ headers, data = [] }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "ascending" | "descending";
  }>({
    key: "title",
    direction: "ascending",
  });

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (typeof a[sortConfig.key!] === 'string' && typeof b[sortConfig.key!] === 'string') {
          if (a[sortConfig.key!] < b[sortConfig.key!]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key!] > b[sortConfig.key!]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    const newDirection = sortConfig.key === key && sortConfig.direction === "ascending"
      ? "descending"
      : "ascending";
    setSortConfig({ key, direction: newDirection });
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th className={styles.th} key={header.key}>
              <span className={styles.sortableLabel}>
                {header.label}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {headers.map((header) => (
              <td className={styles.td} key={header.key}>
                {Array.isArray(row[header.key]) 
                  ? (row[header.key] as string[]).join(', ')
                  : row[header.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ModerationTableSorter;
