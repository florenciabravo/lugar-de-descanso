import { useState } from "react";

export const useCounter = (initialPage = 1, totalPages = 1) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const resetPage = () => setCurrentPage(1);

    return { currentPage, nextPage, prevPage, resetPage, setCurrentPage };
}
