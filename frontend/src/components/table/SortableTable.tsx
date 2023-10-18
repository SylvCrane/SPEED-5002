import React, { useState, useMemo } from "react";
import styles from "./SortableTable.module.scss";

interface SortableTableProps {
  headers: { key: string; label: string }[];
  data: any[];
}

const SortableTable: React.FC<SortableTableProps> = ({
  headers,
  data = [],
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "ascending" | "descending";
  }>({
    key: "title",
    direction: "ascending",
  });
  const [filterValues, setFilterValues] = useState({});

  const [columnVisibility, setColumnVisibility] = useState(
    headers.reduce<{ [key: string]: boolean }>((acc, header) => {
      acc[header.key] = true;
      return acc;
    }, {})
  );

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
    const newDirection =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction: newDirection });
  };

  const handleFilterChange = (key: any, value: any) => {
    // Create a copy of the current filter values and update the specific filter value
    const newFilterValues = { ...filterValues, [key]: value };
    setFilterValues(newFilterValues);
  };
  {
    /*}
  const filteredData = data.filter((row) => {
    return headers.every((header) => {
      const filterValue = filterValues[header.key];
      if (filterValue) {
        return row[header.key].toString().toLowerCase().includes(filterValue.toLowerCase());
      }
      return true;
    });
  });
*/
  }
  const applyFilterAndSort = (
    data: any,
    filterValues: any,
    sortConfig: any
  ) => {
    // Apply filtering to the data
    const filteredData = data.filter((row: any) => {
      return headers.every((header) => {
        const filterValue = filterValues[header.key];
        if (filterValue) {
          return row[header.key]
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
        return true;
      });
    });

    // Apply sorting to the filtered data
    if (sortConfig.key) {
      filteredData.sort((a: any, b: any) => {
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

  const sortedAndFilteredData = applyFilterAndSort(
    data,
    filterValues,
    sortConfig
  );

  const toggleColumnVisibility = (columnKey: any) => {
    setColumnVisibility({
      ...columnVisibility,
      [columnKey]: !columnVisibility[columnKey],
    });
  };

  const showAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const key in updatedVisibility) {
      updatedVisibility[key] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  return (
    <table className={styles.table}>
      <thead>
        <button onClick={showAllColumns}>Show All Columns</button>
        <tr>
          {headers.map((header) => {
            if (columnVisibility[header.key]) {
              return (
                <th className={styles.th} key={header.key}>
                  <div className={styles.filterContainer}></div>
                  <span
                    className={styles.sortableLabel}
                    onClick={() => handleSort(header.key)}
                  >
                    {header.label}
                    {sortConfig.key === header.key &&
                      (sortConfig.direction === "ascending" ? " 🔺" : " 🔻")}
                  </span>
                  <input
                    type="text"
                    value={(filterValues as any)[header.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(header.key, e.target.value)
                    }
                    className={styles.filterInput}
                    placeholder={`Filter ${header.label}`}
                  />
                  <button onClick={() => toggleColumnVisibility(header.key)}>
                    {columnVisibility[header.key] ? "Hide" : "Show"}{" "}
                    {header.label}
                  </button>
                </th>
              );
            }
            return null;
          })}
        </tr>
      </thead>
      <tbody>
        {sortedAndFilteredData.map((row: any, i: any) => (
          <tr key={i}>
            {headers.map((header) => {
              if (columnVisibility[header.key]) {
                return (
                  <td className={styles.td} key={header.key}>
                    {row[header.key]}
                  </td>
                );
              }
              return null;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SortableTable;
