export const AccordionLayout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        marginTop: "0.25rem",
      }}
    >
      {children}
    </div>
  );
};
