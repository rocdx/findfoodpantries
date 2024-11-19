"use client"
import Card from "@/components/HouseCard/Card";
import React, { useState } from 'react';
import { getFoodBanksByLocation, withTimeout } from "../../api";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../loading";
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Error from "@/components/Error";

export default function FoodCounty() {
  const { data: session, status } = useSession();
  const { county } = useParams();
  const decodedCounty = county.replace(/%20/g, ' ');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const countyImages = {
    "Orange County": "https://drupal8-prod.visitcalifornia.com/sites/drupal8-prod.visitcalifornia.com/files/VC_California101_OrangeCounty_Stock_RF_EHT85D_1280x640.jpg",
    "Los Angeles County": "https://example.com/images/la-county-banner.jpg",
    "San Diego County": "https://example.com/images/san-diego-county-banner.jpg",
    "Riverside County": "https://example.com/images/riverside-county-banner.jpg",
    "San Bernardino County": "https://example.com/images/san-bernardino-county-banner.jpg",
    "Ventura County": "https://example.com/images/ventura-county-banner.jpg",
    "Santa Barbara County": "https://example.com/images/santa-barbara-county-banner.jpg",
    "Imperial County": "https://example.com/images/imperial-county-banner.jpg"
  };

  const router = useRouter();

  const {
    data: foodBankData,
    isLoading: foodBankLoading,
    isError: foodBankError,
    error: foodBankErrorMessage,
  } = useQuery(['foodBank'], () => withTimeout(3000, getFoodBanksByLocation(session)), {
    retry: 2,
    retryDelay: 0,
    refetchOnWindowFocus: false,
  });

  const resetError = () => {
    setError('');
    setMessage('');
  };

  if (error || foodBankErrorMessage) {
    return <Error error={error} message={message} doNotRefresh={true} onRetry={resetError} />;
  }

  if (status === 'loading') {
    return (
      <Loading loadingDescription="Loading..." />
    );
  }

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foodBankData ? foodBankData.slice(indexOfFirstItem, indexOfLastItem) : [];

  const totalPages = Math.ceil((foodBankData ? foodBankData.length : 0) / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const bannerImageUrl = countyImages[decodedCounty] || "https://www.oneeducation.org.uk/wp-content/uploads/2021/01/Healthy-Foods-to-Eat-Everyday.png";

  return (
    <div className="pb-16">
      {/* Header Banner */}
      <div className="w-full h-80 bg-cover bg-center relative" style={{ backgroundImage: `url(${bannerImageUrl})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
        <div className="absolute inset-0 flex justify-center items-center">
          <h1 className="text-white text-4xl font-bold">{decodedCounty} Food Pantries</h1>
        </div>
      </div>
      {/* Food Pantries */}
      <div className="relative py-3 sm:max-w-6xl sm:mx-auto bg-white bg-opacity-100 rounded-lg p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {currentItems.map((foodPantry, index) => (
            <Card
              key={index}
              imageUrl={foodPantry.imageURL}
              title={foodPantry.name}
              description={foodPantry.description}
              foodPantryURL={foodPantry.externalURL}
            />
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            {/* First Button */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
            >
              First
            </button>
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
            >
              Prev
            </button>
            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`mx-1 px-3 py-1 border rounded-lg ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
              >
                {i + 1}
              </button>
            ))}
            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
            >
              Next
            </button>
            {/* Last Button */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
            >
              Last
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
