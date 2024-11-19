'use client';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { SnackBar } from '@/components/Snackbar';
import { v4 as uuidv4 } from 'uuid';
import Loading from '../loading';
import { fetchCitiesByZipCode, uploadImageAndCreatePantry } from '../api/index'; // Import utility functions

// State options with abbreviations
const states = [
  { value: 'CA', label: 'California' },
  { value: 'IL', label: 'Illinois' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' }

  // ... other states
];

export default function Pantry() {
  const [selectedState, setSelectedState] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [county, setCounty] = useState('');
  const [file, setFile] = useState(null);
  const [pantryData, setPantryData] = useState({
    // ... pantry data fields
    name: '',
    description: '',
    address: '',
    phoneNumber: '',
    email: '',
    externalURL: '',
    city: '',
    state: '',
    zipCode: '',
    county: '',
  });

  // Initialize the geocoder
  const [geocoder, setGeocoder] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Snackbar and loading states
  const snackbarGap = 10;
  const [snackbars, setSnackbars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to dynamically load the Google Maps script
  const loadGoogleMapsScript = () => {
    return new Promise((resolve, reject) => {
      if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
        resolve();
      } else {
        const existingScript = document.getElementById('googleMaps');

        if (!existingScript) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDGLn8aVx7RLPS9qlbTtcgLqBYzj_nJB2k&libraries=places`;
          script.id = 'googleMaps';
          document.body.appendChild(script);

          script.onload = () => {
            resolve();
          };

          script.onerror = () => {
            reject(new Error('Google Maps script failed to load'));
          };
        } else {
          existingScript.onload = () => {
            resolve();
          };
        }
      }
    });
  };

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        setGeocoder(new window.google.maps.Geocoder());
        setIsScriptLoaded(true);
        console.log('Google Maps script loaded and geocoder initialized');
      })
      .catch((error) => {
        console.error('Error loading Google Maps script:', error);
      });
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleStateChange = (selected) => {
    setSelectedState(selected);
    setPantryData((prevData) => ({ ...prevData, state: selected.value, city: '', zipCode: '' }));
    setSelectedCity(null); // Reset city when state changes
    setCounty(''); // Reset county when state changes
    setCityOptions([]); // Clear city options
    setZipCode(''); // Reset ZIP code
  };

  const handleZipCodeChange = (event) => {
    const zip = event.target.value;
    setZipCode(zip);
    setPantryData((prevData) => ({ ...prevData, zipCode: zip }));
  };

  const handleFetchCitiesByZipCode = async (zip) => {
    try {
      const data = await fetchCitiesByZipCode(zip);
      const cities = data.cities.map((city) => ({
        label: city,
        value: city,
      }));
      setCityOptions(cities);
    } catch (error) {
      console.error('Error fetching cities by ZIP code:', error);
      setCityOptions([]);
    }
  };

  const handleZipCodeBlur = () => {
    if (zipCode) {
      handleFetchCitiesByZipCode(zipCode);
    }
  };

  const handleCityChange = (selected) => {
    setSelectedCity(selected);
    setPantryData((prevData) => ({ ...prevData, city: selected.value }));
    if (selected.value) {
      if (geocoder) {
        fetchCounty(selected.value);
      } else {
        console.error('Geocoder not initialized yet');
      }
    }
  };

  // Fetch county based on city and state using Google Geocoding API
  const fetchCounty = (city) => {
    if (!geocoder) {
      console.error('Geocoder not initialized');
      return;
    }

    geocoder.geocode({ address: `${city}, ${selectedState.label}` }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const addressComponents = results[0].address_components;
        const countyComponent = addressComponents.find((component) =>
          component.types.includes('administrative_area_level_2')
        );
        if (countyComponent) {
          setCounty(countyComponent.long_name);
          setPantryData((prevData) => ({ ...prevData, county: countyComponent.long_name }));
        } else {
          setCounty('County not found');
          setPantryData((prevData) => ({ ...prevData, county: 'County not found' }));
        }
      } else {
        console.error('Error fetching county:', status);
        setCounty('County not found');
        setPantryData((prevData) => ({ ...prevData, county: 'County not found' }));
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPantryData((prevData) => ({ ...prevData, [name]: value }));
  };

  const showSnackbar = (message, backgroundColor) => {
    const newSnackbar = { id: uuidv4(), message, backgroundColor };
    setSnackbars((snackbars) => [...snackbars, newSnackbar]);
  };

  const closeSnackbar = (id) =>
    setSnackbars((snackbars) => snackbars.filter((snack) => snack.id !== id));

    const handleUpload = async (event) => {
        event.preventDefault();
    
        if (!file) {
          showSnackbar('Please select an image file to upload.', '#f87171');
          return;
        }
    
        setIsLoading(true);
        setSnackbars([]); // Clear previous snackbars
    
        try {
          const formData = new FormData();
          formData.append('file', file);
    
          // Append all pantry data fields to FormData
          Object.keys(pantryData).forEach((key) => {
            formData.append(key, pantryData[key]);
          });
    
          // Use the utility function to upload image and create pantry
          const response = await uploadImageAndCreatePantry(formData);
    
          console.log('File uploaded and pantry created successfully:', response.pantry);
    
          // Show success snackbar
          showSnackbar('Pantry created successfully!', '#4ade80');
    
          // Clear the form and file input after success
          setPantryData({
            name: '',
            description: '',
            address: '',
            phoneNumber: '',
            email: '',
            externalURL: '',
            city: '',
            state: '',
            zipCode: '',
            county: '',
          });
          setFile(null);
          setCounty('');
          setSelectedCity(null);
          setSelectedState(null);
          setZipCode('');
          setCityOptions([]);
        } catch (error) {
          console.error('Error uploading file or creating pantry:', error);
          // Show error snackbar
          showSnackbar('Error uploading file or creating pantry. Please try again later.', '#f87171');
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <div className="max-w-md mx-auto mt-10 relative">
      {/* Snackbars */}
      {snackbars.map((snackbar, index) => (
        <SnackBar
          key={snackbar.id}
          backgroundColor={snackbar.backgroundColor}
          message={snackbar.message}
          bottom={20 + index * (60 + snackbarGap)}
          handleClose={() => closeSnackbar(snackbar.id)}
        />
      ))}

      <h2 className="text-2xl font-bold mb-4">Create Food Pantry</h2>

      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <Loading />
        </div>
      )}

      <form onSubmit={handleUpload}>
        {/* State Selection */}
        <Select
          options={states}
          value={selectedState}
          onChange={handleStateChange}
          placeholder="Select a State"
          className="block w-full mb-4 p-2 border"
        />

        {/* ZIP Code Input */}
        <input
          type="text"
          name="zipCode"
          value={zipCode}
          onChange={handleZipCodeChange}
          onBlur={handleZipCodeBlur}
          placeholder="Enter ZIP Code"
          className="block w-full mb-4 p-2 border"
        />

        {/* City Selection */}
        <Select
          options={cityOptions}
          value={selectedCity}
          onChange={handleCityChange}
          placeholder="Select a City"
          isDisabled={cityOptions.length === 0}
          className="block w-full mb-4 p-2 border"
        />

        {/* County */}
        <input
          type="text"
          name="county"
          value={county}
          readOnly
          placeholder="County (auto-filled)"
          className="block w-full mb-4 p-2 border"
        />

        {/* Other fields */}
        <input
          type="text"
          name="name"
          value={pantryData.name}
          onChange={handleInputChange}
          placeholder="Food Pantry Name"
          className="block w-full mb-4 p-2 border"
        />
        <textarea
          name="description"
          value={pantryData.description}
          onChange={handleInputChange}
          placeholder="Provide 2-4 sentences about the food bank or its mission statement"
          className="block w-full mb-4 p-2 border"
        />
        <input
          type="text"
          name="address"
          value={pantryData.address}
          onChange={handleInputChange}
          placeholder="Address"
          className="block w-full mb-4 p-2 border"
        />
        <input
          type="text"
          name="phoneNumber"
          value={pantryData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Phone Number"
          className="block w-full mb-4 p-2 border"
        />
        <input
          type="email"
          name="email"
          value={pantryData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="block w-full mb-4 p-2 border"
        />
        <input
          type="text"
          name="externalURL"
          value={pantryData.externalURL}
          onChange={handleInputChange}
          placeholder="Food Bank Website URL"
          className="block w-full mb-4 p-2 border"
        />

        {/* Image Upload Section */}
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Upload Image of Food Bank
        </label>
        <input
          type="file"
          accept=".png, .jpg, .jpeg, .svg"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none mb-4"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload and Create Pantry'}
        </button>
      </form>
    </div>
  );
}
