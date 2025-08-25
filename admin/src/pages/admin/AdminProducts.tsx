import Papa from 'papaparse';
import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowDown, FaArrowUp, FaEdit, FaFileCsv, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Cell, Column, Row, useSortBy, useTable } from 'react-table';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useAllProductsQuery } from '../../redux/api/product.api';
import { CustomError, Product } from '../../types/api-types';
import { notify } from '../../utils/util';

// Professional Pagination Component
const ProfessionalPagination: React.FC<{
  totalPages?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
}> = ({ totalPages = 1, currentPage = 1, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];
    const showPages = 5; // Number of page buttons to show
    
    if (totalPages <= showPages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range around current page
      let start = Math.max(1, currentPage - Math.floor(showPages / 2));
      let end = Math.min(totalPages, start + showPages - 1);
      
      // Adjust start if we're near the end
      if (end - start + 1 < showPages) {
        start = Math.max(1, end - showPages + 1);
      }
      
      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis and last page if needed
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Page Info */}
      <div className="text-sm text-gray-600 order-2 sm:order-1">
        Showing page {currentPage} of {totalPages} ({totalPages * 20} total items)
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <FaChevronLeft size={14} />
        </button>
        
        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {visiblePages.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`
                flex items-center justify-center min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200
                ${page === currentPage 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : page === '...' 
                    ? 'text-gray-400 cursor-default' 
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }
              `}
            >
              {page}
            </button>
          ))}
        </div>
        
        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <FaChevronRight size={14} />
        </button>
      </div>
      
      {/* Quick Jump (Desktop Only) */}
      <div className="hidden lg:flex items-center gap-2 text-sm order-3">
        <span className="text-gray-600">Go to:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const value = parseInt((e.target as HTMLInputElement).value);
              if (value >= 1 && value <= totalPages) {
                onPageChange(value);
              }
            }
          }}
        />
      </div>
    </div>
  );
};

const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(20); // Changed to 20 products per page
  const [sortBy, setSortBy] = useState<{ id: string; desc: boolean }>({ id: '', desc: false });
  const { data: productsData, isLoading, isError, error, refetch } = useAllProductsQuery({ page, limit, sortBy });
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    if (productsData?.products) {
      setData(productsData.products);
    }
  }, [productsData]);

  useEffect(() => {
    if (isError && error) {
      const err = error as CustomError;
      notify(err.data.message, 'error');
    }
  }, [isError, error]);

  const columns = useMemo<Column<Product>[]>(
    () => [
      {
        Header: 'Images',
        accessor: 'photos',
        Cell: ({ value, row }: { value: string[]; row: Row<Product> }) => (
          <div className="flex space-x-1">
            {value && value.length > 0 ? (
              <>
                <img 
                  src={value[0]} 
                  alt={`${row.original.name} - Main`} 
                  className="w-12 h-12 object-cover rounded border"
                />
                {value.length > 1 && (
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded border text-xs font-medium text-gray-600">
                    +{value.length - 1}
                  </div>
                )}
              </>
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center text-gray-500 text-xs">
                No Image
              </div>
            )}
          </div>
        ),
        disableSortBy: true,
      },
      { Header: 'Product', accessor: 'name' },
      { Header: 'Category', accessor: 'category' },
      { Header: 'Stock', accessor: 'stock' },
      { Header: 'Price', accessor: 'price' },
      {
        Header: 'Actions',
        Cell: ({ row }: { row: Row<Product> }) => (
          <button
            onClick={() => navigate(`/admin/products/${row.original._id}`)}
            className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200"
          >
            <FaEdit className="mr-2" /> 
            <span className="hidden sm:inline">Manage</span>
          </button>
        ),
        disableSortBy: true,
      },
    ],
    [navigate]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Product>({ columns, data }, useSortBy);

  const handleSort = (columnId: string) => {
    setSortBy((prevSortBy) => {
      if (prevSortBy.id === columnId) {
        return { id: columnId, desc: !prevSortBy.desc };
      } else {
        return { id: columnId, desc: false };
      }
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Smooth scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    refetch();
  };

  const exportToCSV = () => {
    const csvData = data.map(product => ({
      ...product,
      photos: product.photos?.join('; ') || '',
      mainPhoto: product.photos?.[0] || '',
      totalPhotos: product.photos?.length || 0
    }));
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products.csv';
    link.click();
  };

  if (isLoading) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <SkeletonLoader rows={5} columns={10} height={40} className="mb-4" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm text-center">
        <p className="text-red-500 mb-4">Failed to load products. Please try again.</p>
        <button
          onClick={handleRetry}
          className="flex items-center justify-center text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 mx-auto"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your product inventory ({productsData?.totalPages ? productsData.totalPages * 20 : 0} total products)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center justify-center text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <FaPlus className="mr-2" /> Add Product
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center justify-center text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
          >
            <FaFileCsv className="mr-2" /> Export CSV
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <div className="text-4xl mb-4">📦</div>
          <p>No products available.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table {...getTableProps()} className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                {headerGroups.map((headerGroup, headerGroupIndex) => {
                  const headerGroupProps = headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={headerGroupIndex} {...headerGroupProps}>
                      {headerGroup.headers.map((column, columnIndex) => {
                        const headerProps = column.getHeaderProps(
                          (column as any).getSortByToggleProps ? (column as any).getSortByToggleProps() : {}
                        );
                        return (
                          <th
                            key={columnIndex}
                            {...headerProps}
                            className={`p-4 border-b border-gray-200 cursor-pointer font-semibold text-gray-900 ${
                              (column as any).isSorted ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => 
                              !(column as any).disableSortBy && handleSort(column.id)
                            }
                          >
                            <div className="flex items-center">
                              {column.render('Header')}
                              {(column as any).isSorted ? (
                                (column as any).isSortedDesc ? (
                                  <FaArrowDown className="ml-2 text-blue-600" />
                                ) : (
                                  <FaArrowUp className="ml-2 text-blue-600" />
                                )
                              ) : null}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>

              <tbody {...getTableBodyProps()}>
                {rows.map((row: Row<Product>, rowIndex) => {
                  prepareRow(row);
                  const rowProps = row.getRowProps();
                  return (
                    <tr key={rowIndex} {...rowProps} className="hover:bg-gray-50 transition-colors duration-150">
                      {row.cells.map((cell: Cell<Product>, cellIndex) => {
                        const cellProps = cell.getCellProps();
                        return (
                          <td key={cellIndex} {...cellProps} className="p-4 border-b border-gray-100">
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {rows.map((row: Row<Product>, rowIndex) => {
              prepareRow(row);
              const product = row.original;
              return (
                <div key={rowIndex} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {product.photos && product.photos.length > 0 ? (
                        <div className="relative">
                          <img 
                            src={product.photos[0]} 
                            alt={product.name} 
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                          {product.photos.length > 1 && (
                            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {product.photos.length}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg border flex items-center justify-center text-gray-500 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Category: {product.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex space-x-4 text-sm">
                          <span className="text-gray-600">Stock: <span className="font-medium">{product.stock}</span></span>
                          <span className="text-gray-600">Price: <span className="font-medium">${product.price}</span></span>
                        </div>
                        <button
                          onClick={() => navigate(`/admin/products/${product._id}`)}
                          className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                        >
                          <FaEdit className="mr-1" /> Manage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Professional Pagination */}
          <ProfessionalPagination
            totalPages={productsData?.totalPages}
            currentPage={productsData?.currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default AdminProducts;