"use client";
import { useState, useEffect } from "react";
import {
  Pagination as PaginationWrapper,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Props {
  totalPages: number;
}

const Pagination = ({ totalPages }: Props) => {
  const router = useRouter();
  const query = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(Number(query.get("page")) || 1);
  const path = usePathname();

  useEffect(() => {
    setCurrentPage(Number(query.get("page")) || 1);
  }, [query]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      router.push(`${path}?page=${page}`, { scroll: false });
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(currentPage + 2, totalPages);

    if (startPage > 1) {
      items.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={`${path}?page=${i}`}
            isActive={currentPage === i}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      items.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <PaginationWrapper className="my-5">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`${path}?page=${currentPage - 1}`}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
            />
          </PaginationItem>
        )}
        {renderPaginationItems()}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={`${path}?page=${currentPage + 1}`}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationWrapper>
  );
};

export default Pagination;
