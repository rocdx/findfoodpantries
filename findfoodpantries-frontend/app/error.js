'use client'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'

export default function Error({ 
  error, 
  message,
  onRetry,
  redirectPath = '/', 
  retryMessage = 'Please click the sign out button on the right upper corner and sign back in.', 
  clickHereMessage = 'click here',
  redirectMessage=" to get re-directed back to the login page"
}) {
  const router = useRouter()

  const handleRedirect = () => {
    if (onRetry) {
      console.log("this will reset the error state")
      onRetry();
    }
    router.push(redirectPath)
  }

  return (
    <div className="bg-[url('./images/landingPageImage.png')] bg-cover bg-center h-[calc(100vh-56px)] flex items-center justify-center">
      <div className="p-8 bg-white rounded-lg shadow-lg w-[600px] flex flex-col items-center justify-between">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-2">
            {error ? `${error}` : ''} {message ? `| ${message}` : ''}
          </h2>
          <p className="text-md mt-4">
            There was a problem with your request
          </p>
          <Separator
            orientation="horizontal"
            className="mt-4 bg-[#979797] border-1"
          />
          <div className="text-left text-sm mt-4">
            <p>What you can try:</p>
            <ul className="list-disc text-left ml-8 mt-2">
              <li>Try refreshing the page</li>
              <li>{retryMessage}</li>
              <li>
                Please{' '}
                <span 
                  onClick={handleRedirect}
                  className="underline font-bold text-blue-800 cursor-pointer"
                >
                  {clickHereMessage}
                </span>{redirectMessage}.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
