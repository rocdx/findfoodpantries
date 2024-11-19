'use client'
import Card from "@/components/HouseCard/Card";
import React, { useState, useEffect } from 'react'
import IconSlider from '@/components/HouseCard/IconSlider'
import FeatureSection from '@/components/HouseCard/FeatureSection'
import StatisticsSection from "@/components/HouseCard/StatisticSection";
import { getFoodBanksByLocation, withTimeout} from "./api";
import { useQuery } from "@tanstack/react-query";
import Loading from "./loading";
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation' // Correct the import
import Error from "@/components/Error";

export default function Landing() {
  const { data: session, status } = useSession()
  const [userCreated, setUserCreated] = useState(false);
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const errorMessages = {
    UserCheckFailed: 'An error occurred while checking user information. Please refresh the page or click the retry button to try again later.',
    UserCreationFailed: 'We encountered an error while creating your account. Please try again.',
    // Add more error mappings here as needed
  }

  const router = useRouter()

  const {
    data: foodBankData,
    isLoading: foodBankLoading,
    isError: foodBankError,
    error: foodBankErrorMessage,
  } = useQuery(['foodBank'], () => withTimeout(3000, getFoodBanksByLocation(session)), {
    retry: 2,
    retryDelay: 0,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(errorParam)
      const mappedMessage = errorMessages[errorParam] || 'An unknown error occurred. Please try again.'
      setMessage(mappedMessage)
      router.replace('/', { shallow: true }) // Clear the error parameter from the URL
    }
  }, [searchParams, router])

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  const resetError = () => {
    setError('')
    setMessage('')
  }


  const featuresList = [
    {
      title: "Effortless Search", 
      description: "Locate food banks quickly by area or through user contributions, enhancing community awareness and access to resources."
    },
    {
      title: "Personalized Updates",
      description: "Easy subscription to food bank news, ensuring users are always informed and connected to the services they need."
    },
    {
      title: "Pantry Profiles",
      description: "Create profiles for underrepresented food pantries, improving visibility and fostering stronger community connections."
    }
  ]

  if (error || foodBankErrorMessage) {
    return <Error error={error} message={message} doNotRefresh={true} onRetry={resetError} />
  }

  if (status === 'loading') {
    console.log('Displaying loading state')
    return (
      <Loading loadingDescription="Loading............." />
    )
  }

console.log("meow")
console.log(foodBankData)
  return (
    <div className='pb-16'>
      <IconSlider/>
      <FeatureSection
        imagesource="https://static.wixstatic.com/media/f47796_c167434287ca4bfda7afed3ecce6999e~mv2.jpeg"
        featuresList={featuresList}
      />
      <StatisticsSection/>
      <h1 className="text-2xl font-bold mb-6 text-center mt-8">We connect individuals with local food banks, ensuring easy access to essential nourishment and fostering a supportive community network. Explore nearby food banks in Orange County</h1>
      <div className="relative py-3 sm:max-w-6xl sm:mx-auto bg-white bg-opacity-100 rounded-lg p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {foodBankData && foodBankData.slice(0,8).map((foodPantry, index) => (
                <Card
                  key={index}
                  imageUrl={foodPantry.imageURL}
                  title={foodPantry.name}
                  description={foodPantry.description}
                  foodPantryURL={foodPantry.externalURL}
                />
              ))}
            </div>
          </div>
    </div>
  )
}
