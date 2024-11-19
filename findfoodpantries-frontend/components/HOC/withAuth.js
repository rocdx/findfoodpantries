// hoc/withAuth.js
"use client"
import _ from 'lodash';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'; // Corrected import path
import Loading from '@/app/loading';

const withAuth = (Component) => {
  const WithAuth = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      const handleRedirect = async () => {
        const sessionToken = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('sessionToken')) : null;

        if (status === 'loading') {
          // Optionally handle loading state
          console.log("Loading session...");
          return;
        }
        
        if (status === 'authenticated' && session) {
          // Update localStorage if session token is different
          if (JSON.stringify(sessionToken) !== JSON.stringify(session)) {
            console.log("Updating session token...");
            localStorage.setItem('sessionToken', JSON.stringify(session));
          }
          return;
        }

        // Redirect to login if session is unauthenticated and no session token in localStorage
        if (status === 'unauthenticated' && !sessionToken) {
          console.log("Redirecting to login...");
          router.push('/');
        }
      };

      handleRedirect();
    }, [session, status, router]);

    if (status === 'loading') return <Loading loadingDescription="Loading.........." />;
    
    return <Component {...props} />;
  };

  // Set displayName for the WithAuth component
  WithAuth.displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`;

  return WithAuth;
};

export default withAuth;