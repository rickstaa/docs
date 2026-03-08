export const Subtitle = ({ style = {}, text, children }) => {
  return (
    <>
      <span
        style={{
          fontSize: style.fontSize ? style.fontSize : "1rem",
          fontStyle: style.fontStyle ? style.fontStyle : "italic",
          color: style.color ? style.color : "var(--accent)",
          marginBottom: style.marginBottom ? style.marginBottom : 0,
          ...style,
        }}
      >
        {text}
        {children}
      </span>
    </>
  );
};

/**
 * CopyText - Inline code with copy button
 * @param {string} text - The text to display and copy
 * @param {string} [label] - Optional label before the text
 */
export const CopyText = ({ text, label }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
    >
      {label && <strong>{label}</strong>}
      <code
        style={{
          padding: "0.2rem 0.4rem",
          borderRadius: "4px",
          fontSize: "0.85rem",
          fontFamily: "monospace",
          backgroundColor: "var(--card-background)",
          border: "1px solid var(--border)",
        }}
      >
        {text}
      </code>
      <button
        onClick={handleCopy}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0.25rem",
          display: "inline-flex",
          alignItems: "center",
          color: "var(--text)",
        }}
        title="Copy to clipboard"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
    </span>
  );
};

export const CardTitleTextWithArrow = ({ children, ...cardProps }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "fit-content",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "-1rem",
      }}
    >
      <Card
        arrow={false}
        title={
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            {children}{" "}
            <span style={{ margin: "0 -1rem 0.2rem 0.75rem" }}>
              <Icon icon="arrow-up-right" size={16} color="var(--text)" />
            </span>
          </span>
        }
        {...cardProps}
      />
    </div>
  );
  // return (
  //   <span
  //     style={{
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "center",
  //     }}
  //   >
  //     {" "}
  //     {children}{" "}
  //     <span style={{ margin: "0 -1rem 0.2rem 0.75rem" }}>
  //       <Icon icon="arrow-up-right" size={16} color="var(--text)" />
  //     </span>
  //   </span>
  // );
};

export const AccordionTitleWithArrow = ({
  text,
  children,
  color = "var(--text)",
}) => {
  const label = text ?? children;
  return (
    <span
      style={{
        justifyContent: "center",
        alignContent: "center",
        color: color,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.25rem 0",
        minHeight: 44,
      }}
    >
      {label}
      <span style={{ alignSelf: "flex-end" }}>
        <Icon icon="arrow-up-right" size={14} color="var(--text)" />
      </span>
    </span>
  );
};
