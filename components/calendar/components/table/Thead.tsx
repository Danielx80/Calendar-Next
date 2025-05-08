import React from "react";

export const Thead = ({
  children,
  className,
}: {
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}) => {
  return <thead className={className}>{children}</thead>;
};
