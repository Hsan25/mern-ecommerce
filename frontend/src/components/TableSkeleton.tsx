import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "../components/ui/table";

const TableSkeleton = ({ row }: { row: number }) => {
  return (
    <TableRow>
      {Array.from({ length: row }).map((_, idx) => (
        <TableCell key={idx}>
          <Skeleton className="w-14 rounded-sm h-8" />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableSkeleton;
