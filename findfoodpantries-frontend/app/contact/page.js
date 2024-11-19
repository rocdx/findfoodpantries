'use client';
import React, { useState } from 'react';
import { SnackBar } from '@/components/Snackbar';
import { v4 as uuidv4 } from 'uuid';
const axios = require('axios')
import { signIn, useSession } from 'next-auth/react'

const validateEmail = (email) => {
  return email.match(
    // Simple regex for demonstration purposes
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const validatePhone = (phoneNumber) => {
  // Simple phone validation for demonstration purposes
  return phoneNumber.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
};

export default function Contact() {
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    prefEmail: '',
    phoneNumber: '',
    zipcode: ''
  });
  const snackbarGap = 10; // gap in pixels
  const [snackbars, setSnackbars] = useState([]);

  const closeSnackbar = (id) => setSnackbars(snackbars => snackbars.filter(snack => snack.id !== id)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showSnackbar = (message, backgroundColor) => {
    const newSnackbar = { id: uuidv4(), message, backgroundColor };
    setSnackbars(snackbars => [...snackbars, newSnackbar]);
  };

  const validateForm = () => {
    const { firstName, lastName, prefEmail, phoneNumber, zipcode } = formData;
    console.log("hi ", prefEmail)
    let errors = []
    if (!firstName.trim()) {
      errors.push("First name cannot be blank.");
    }
    if (!lastName.trim()) {
      errors.push("Last name cannot be blank.");
    }
    if (!prefEmail.trim()) {
      errors.push("Email cannot be blank.");
    }
    if (!phoneNumber.trim()) {
      errors.push("Phone number cannot be blank.");
    }
    if (!zipcode.trim()) {
      errors.push("Zipcode cannot be blank.");
    }
    if (firstName.length > 50 || lastName.length > 50) {
      errors.push("Names must be less than 50 characters.");
    }
    if (!validateEmail(prefEmail)) {
      errors.push("Please enter a valid email address.");
    }
    if (!validatePhone(phoneNumber)) {
      errors.push("Please enter a valid phone number in the format: XXX-XXX-XXXX.");
    }
    if (!zipcode.match(/^\d+$/)) {
      errors.push("Zipcode must be numeric.");
    }

    setSnackbars([]);

    errors.forEach(error => showSnackbar(error, '#f87171'));
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSnackbars([])

    if (!validateForm()) {
      return;
    }

    try {
      // Replace with your API call
      console.log("form data: ", JSON.stringify(formData))
      const userEmail = session.user.email;

      // api
      // const productionMode = process.env.NODE_ENV === 'development';
      const productionMode = process.env.NODE_ENV === 'production';
      const FOOD_API = 'https://d9m68ewxdg.execute-api.us-east-1.amazonaws.com/prod/foodPantryRouter';

      let response;
      if (productionMode) {
        const config = {
          url: FOOD_API,
          method: 'post',
          data: {
            apiType: "user",
            apiOperation: "put",
            config: {
              pathTemplate: "/update/user/profile/{authEmail}",
              parameters: {
                "authEmail": userEmail,
                "body": formData
              }
            }
          }
        };
        response = await axios(config);
      } else {
        response = await axios.put(`http://localhost:4000/api/v1/user/update/user/profile/${userEmail}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.data) {
        showSnackbar('You successfully subscribed with foodpantryfinder!', '#4ade80');
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      showSnackbar('There is an unexpected error. Please try again later.', '#f87171');
    }
  };

  return (
    <div className="container mx-auto p-8">
      {snackbars.map((snackbar, index) => (
        <SnackBar
          key={snackbar.id}
          backgroundColor={snackbar.backgroundColor}
          message={snackbar.message}
          bottom={20 + (index * (60 + snackbarGap))} // Add the gap to the bottom position for each snackbar          
          handleClose={() => closeSnackbar(snackbar.id)}
        />
      ))}
      <h1 className="text-2xl mt-8 font-medium text-center">Subscribe to Food Pantries</h1>
      <p className="text-center text-md font-medium mx-auto mt-2 mb-6 max-w-4xl px-4 py-2 text-gray-700 bg-white rounded-lg shadow-lg">
          Enhance your experience with our app and stay connected to the community. Update your profile with your personal contact information, and with just a single click, you can subscribe to various local food banks that you wish to support or visit in the future. Just save your profile once, and let our app take care of your subscriptions with ease. Join us in a seamless journey to giving and receiving support through our network of food banks.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* First Name Input */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            required
            maxLength="50"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleChange}
          />
        </div>

        {/* Last Name Input */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            required
            maxLength="50"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleChange}
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Preferred Contact Email
          </label>
          <input
            type="email"
            name="prefEmail"
            id="prefEmail"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleChange}
          />
        </div>

        {/* Phone Number Input */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            value={formData.phoneNumber}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleChange}
            maxLength="17"
            placeholder="(XXX) - XXX - XXXX"
          />
        </div>

        {/* Zipcode Input */}
        <div>
          <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">
            Zipcode
          </label>
          <input
            type="text"
            name="zipcode"
            id="zipcode"
            required
            pattern="^\d{5}$"
            title="Zipcode must be a 5-digit number."
            maxLength="5"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Subscribe
          </button>
        </div>
      </form>
    </div>
  );
}
