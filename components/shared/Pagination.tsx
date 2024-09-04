'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button'; // Adjust the import path as needed
import { formUrlQuery } from '@/utils/utils';

type PaginationProps = {
  page: number | string;
  totalPages: number;
  limit: number // Optional parameter for custom URL parameter name
};

const Pagination = ({ page, totalPages, limit }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paramPage, setParamPage] = useState(Number(searchParams.get('page') || 1));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 400);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (totalPages > 0 && (paramPage < 1 || paramPage > totalPages || limit == 1 && paramPage > totalPages)) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'page',
        value: '1',
      });
      setParamPage(1);
      router.push(newUrl, { scroll: false });
    }
  }, [totalPages, paramPage]);

  const visiblePages = [];
  const midPoint = 1; 
  let startPage = Math.max(1, paramPage - midPoint);
  let endPage = startPage + (isMobile ? 1 : 2);

  if (startPage === 1 && totalPages > 3) { 
    // No adjustment needed
  } else if (endPage > totalPages) {
    if (totalPages == 2) {
      startPage = totalPages - 1;
    } else if(totalPages == 1) {
      startPage = totalPages;
    } else {
      startPage = totalPages - (isMobile ? 1 : 2);
    }
    endPage = totalPages;
  }

  for (let i = startPage; i <= endPage && i <= totalPages; i++) {
    visiblePages.push(i);
  }

  const handlePageClick = (newPage: number) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: newPage.toString(),
    });
    setParamPage(newPage);
    router.push(newUrl, { scroll: false }); 
  };

  return (
    <div className="flex items-center gap-5 mb-10">
      <div className='bg-green-200'>
      </div>
      {/* Previous Button */}
      <Button
        size="lg"
        variant="outline"
        className="sm:w-28 w-20"
        onClick={() => handlePageClick(paramPage - 1)}
        disabled={paramPage <= 1}
      >
        Previous
      </Button>

      {/* Page Number Buttons */}
      {visiblePages.map((item) => (
        <Button
          key={item}
          variant={item === paramPage ? "default" : "outline"}
          onClick={() => handlePageClick(item)}
          className="transition-colors duration-300 ease-in-out hover:bg-coral"
        >
          {item}
        </Button>
      ))}

      {/* Next Button */}
      <Button
        size="lg"
        variant="outline"
        className="sm:w-28 w-20"
        onClick={() => handlePageClick(paramPage + 1)}
        disabled={paramPage >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;