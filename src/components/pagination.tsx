'use client'

import ReactPaginate from "react-paginate";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import { Dispatch, SetStateAction, useState } from "react";

const itemsPerPage = 6;

interface PaginationRequest {
    data: any,
    page: [number, Dispatch<SetStateAction<number>>]
}

export default function Pagination({ data, page }: PaginationRequest) {
    const [currentPage, setCurrentPage] = page;

    const handlePageClick = (data: { selected: SetStateAction<number>; }) => {
        setCurrentPage(data.selected);
    };

    const currentData = data.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return {
        ContentPagination: (
            <ReactPaginate
                previousLabel={<MdKeyboardArrowLeft />}
                nextLabel={<MdKeyboardArrowRight />}
                pageCount={Math.ceil(data.length / itemsPerPage)}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
        ),
        currentPage,
        itemsPerPage,
        currentData
    }
}