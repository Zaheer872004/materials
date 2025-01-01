import React from 'react'

// onPageChange mean setCurrentPage
const Pagination = ({ onPageChange, blogs, currentPage, pageSize }) => {
    const totalPage = Math.ceil(blogs.length / pageSize);

    const renderPaginationLinks = () => {
        return Array.from({ length: totalPage }, (_, i) => i + 1).map((pageNumber) => (
            <li 
                className={`inline-block mx-1 ${pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-full`}
                key={pageNumber}>
                <a 
                    href="#"
                    className="block px-3 py-1 cursor-pointer"
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </a>
            </li>
        ));
    };

    return (
        <ul className='flex justify-center items-center space-x-2 my-8'>
            <li>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border rounded-full ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Previous
                </button>
            </li>
            <div>
                {renderPaginationLinks()}
            </div>
            <li>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPage}
                    className={`px-4 py-2 border rounded-full ${currentPage === totalPage ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Next
                </button>
            </li>
        </ul>
    );
}

export default Pagination;
