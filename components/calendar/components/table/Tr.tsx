import React from "react";

export const Tr = ({
  children,
  className,
  style
}: {
  children: React.ReactElement | React.ReactElement[];
  className?: string;
  style?: React.CSSProperties;
}) => {
  return <tr className={className} style={style}>{children}</tr>;
};
