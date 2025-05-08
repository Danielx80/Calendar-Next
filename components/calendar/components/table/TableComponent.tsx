import React from "react";

export const TableComponent = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <table className={className} style={style}>
      {children}
    </table>
  );
};
