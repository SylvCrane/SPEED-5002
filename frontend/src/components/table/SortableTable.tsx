import React, { useState, useMemo } from "react";
import styles from './SortableTable.module.scss'; 

interface SortableTableProps {
  headers: { key: string; label: string }[];
  data: any[];
}

const SortableTable: React.FC<SortableTableProps> = ({ headers, data = [] }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "ascending" | "descending";
  }>({
    key: "title",
    direction: "ascending",
  })
  const [filterValues, setFilterValues] = useState({})
;


  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
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

  const handleFilterChange = (key, value) => {
    // Create a copy of the current filter values and update the specific filter value
    const newFilterValues = { ...filterValues, [key]: value };
    setFilterValues(newFilterValues);
  };
{/*}
  const filteredData = data.filter((row) => {
    return headers.every((header) => {
      const filterValue = filterValues[header.key];
      if (filterValue) {
        return row[header.key].toString().toLowerCase().includes(filterValue.toLowerCase());
      }
      return true;
    });
  });
*/}
  const applyFilterAndSort = (data, filterValues, sortConfig) => {
    // Apply filtering to the data
    const filteredData = data.filter((row) => {
      return headers.every((header) => {
        const filterValue = filterValues[header.key];
        if (filterValue) {
          return row[header.key].toString().toLowerCase().includes(filterValue.toLowerCase());
        }
        return true;
      });
    });
  
    // Apply sorting to the filtered data
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
  
    return filteredData;
  };

  const sortedAndFilteredData = applyFilterAndSort(data, filterValues, sortConfig);
  

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th className={styles.th} key={header.key}>
              <div className={styles.filterContainer}></div>
                <span 
                  className={styles.sortableLabel} 
                  onClick={() => handleSort(header.key)}
                >
                  {header.label}
                  {sortConfig.key === header.key && (sortConfig.direction === "ascending" ? ' 🔺' : ' 🔻')}
                </span>
                <input
                type="text"
            value={filterValues[header.key] || 'Search By'}
            onChange={(e) => handleFilterChange(header.key, e.target.value)}
            className={styles.filterInput}
            placeholder={`Filter ${header.label}`}
          />
          
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedAndFilteredData.map((row, i) => (
          <tr key={i}>
            {headers.map((header) => (
              <td className={styles.td} key={header.key}>{row[header.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SortableTable;
