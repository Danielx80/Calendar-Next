import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { USER_COL_WIDTH } from "../../constants";
import { Row } from "../../types";
import { Td } from "../table";

export function UserColumn(onTaskClick?: (id: string) => void) {
  return {
    field: "userName" as const,
    headerName: "Usuario",
    width: USER_COL_WIDTH,
    headerClassName: "sticky left-0 bg-white z-30",
    cellClassName: "sticky left-0 bg-white z-20",
    renderCell: (row: Row) => {
      const { userId, userName, avatarUrl, sectionColor, userRole } = row;
      return (
        <Td
          key={`user-${userId}`}
          className="sticky left-0 bg-white z-20 h-16 border border-slate-300 flex items-center gap-2 px-2 select-none"
          style={{ minWidth: USER_COL_WIDTH }}
        >
          <Avatar
            className="cursor-pointer"
            onClick={() => onTaskClick?.(userId)}
          >
            {avatarUrl ? (
              <AvatarImage width={32} src={avatarUrl} alt={userName} />
            ) : (
              <AvatarFallback color={sectionColor}>
                {userName.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col ">
            <p className="text-sm text-slate-700 font-semibold tracking-tight">
              {userName}
            </p>
            <p className="text-sm text-slate-500 font-medium tracking-tight">
              {userRole}
            </p>
          </div>
        </Td>
      );
    },
  };
}
