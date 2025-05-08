import React from "react";

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ref?: React.Ref<HTMLTableCellElement>;
  colSpan?: number;
  onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void;
  disabled?: boolean
}

export const Td: React.FC<TdProps> = ({
  children,
  className,
  style,
  ref,
  onClick,
  colSpan,
  ...rest
}) => (
  <td className={className} onClick={onClick}   ref={ref} style={style} colSpan={colSpan} {...rest}>
    {children}
  </td>
);
