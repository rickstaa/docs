/**
 * DynamicTable - A reusable table component with site-consistent styling
 *
 * Props:
 *   - headerList: Array of strings for column headers
 *   - itemsList: Array of objects where keys match headerList values
 *   - monospaceColumns: Optional array of column indices (0-based) to render in monospace
 *   - margin: Optional CSS margin override (e.g. "0", "1rem 0")
 */
export const DynamicTable = ({
  tableTitle = null,
  headerList = [],
  itemsList = [],
  monospaceColumns = [],
  margin,
}) => {
  if (!headerList.length) {
    return <div>No headers provided</div>;
  }

  return (
    <>
      {tableTitle && (
        <div style={{ fontStyle: "italic", margin: 0 }}>
          <strong>{tableTitle}</strong>
        </div>
      )}
      <div
        style={{ overflowX: "auto", ...(margin != null && { margin }) }}
        role="region"
        tabIndex={0}
        aria-label={tableTitle ? `Scrollable table: ${tableTitle}` : "Scrollable table"}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.9rem",
            marginTop: 0,
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "var(--accent)",
                color: "#fff", //DO NOT CHANGE
              }}
            >
              {headerList.map((header, index) => (
                <th
                  key={index}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: "600",
                    borderBottom: "2px solid var(--accent)",
                    color: "#fff",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {itemsList.map((item, rowIndex) => (
              item?.__separator ? (
                <tr
                  key={rowIndex}
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "#fff",
                    borderBottom: "1px solid var(--accent)",
                  }}
                >
                  <td
                    colSpan={headerList.length}
                    style={{
                      padding: "8px 16px",
                      fontWeight: "700",
                      color: "#fff",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {item[headerList[0]] ?? item.Category ?? "Category"}
                  </td>
                </tr>
              ) : (
                <tr
                  key={rowIndex}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  {headerList.map((header, colIndex) => {
                    const value =
                      item[header] ?? item[header.toLowerCase()] ?? "-";
                    const isMonospace = monospaceColumns.includes(colIndex);

                    return (
                      <td
                        key={colIndex}
                        style={{
                          padding: "10px 16px",
                          fontFamily: isMonospace ? "monospace" : "inherit",
                        }}
                      >
                        {isMonospace ? <code>{value}</code> : value}
                      </td>
                    );
                  })}
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
