import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage <= 3) {
      pages.push(2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push("...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={`flex items-center justify-center py-5 border-t border-gray-100 dark:border-white/[0.05] bg-orange-50/30 dark:bg-orange-950/10 ${className}`}>
      {/* Mobile View */}
      <div className="flex sm:hidden items-center justify-between w-full px-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center px-4 py-2 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-full disabled:opacity-30 transition-all dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400"
        >
          Prev
        </button>
        <span className="text-xs font-bold text-gray-900 dark:text-white">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center px-4 py-2 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-full disabled:opacity-30 transition-all dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400"
        >
          Next
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex items-center gap-4 sm:gap-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center p-2 text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Previous Page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <ul className="flex items-center gap-1 sm:gap-2" aria-label="Pagination">
          {getPageNumbers().map((page, index) => (
            <li key={index} className="flex items-center justify-center min-w-[28px]">
              {typeof page === "number" ? (
                <button
                  onClick={() => onPageChange(page)}
                  className={`flex items-center justify-center h-8 w-8 text-xs font-bold transition-all duration-200 rounded-full ${
                    page === currentPage
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-100/50 dark:hover:bg-orange-900/20"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span className="text-xs font-bold text-gray-300 dark:text-gray-600 px-1">
                  {page}
                </span>
              )}
            </li>
          ))}
        </ul>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center p-2 text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next Page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
