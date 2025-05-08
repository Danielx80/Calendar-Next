import React from "react";

export const Th = ({
  className,
  children,
  style,
}: {
  children: React.ReactElement | React.ReactElement[];
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <th style={style} className={className}>
      {children}
    </th>
  );
};
