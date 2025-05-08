import React from "react";

export const Tbody = ({
  children,
  className,
}: {
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}) => {
  return <tbody className={className}>{children}</tbody>;
};
