import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const FOOD_API = 'https://d9m68ewxdg.execute-api.us-east-1.amazonaws.com/prod/foodPantryRouter';

const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = isProduction ? FOOD_API : API_URL;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("User attempting to sign in:", user);

      const authToken = {
        user: {
          name: user.name,
          email: user.email,
          image: user.image,
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      };

      console.log("Generated authToken:", authToken);

      try {
        let response;
        const fetchUserConfig = {
          method: 'post',
          url: BASE_URL,
          data: {
            apiType: "user",
            apiOperation: "get",
            config: {
              pathTemplate: "/{email}",
              parameters: {
                email: user.email,
              },
            },
          },
        };

        if (isProduction) {
          response = await axios(fetchUserConfig);
        } else {
          console.log("Fetching user in development mode");
          response = await axios.get(`${BASE_URL}/${user.email}`, {
            withCredentials: true,
          });
        }

        // Check if user exists or not based on the response
        if (response.status === 200) {
          if (response.data.message === "no such user exists") {
            console.log("User not found, creating a new user");

            const spaceIndex = user.name.indexOf(' ');
            const firstName = spaceIndex !== -1 ? user.name.substring(0, spaceIndex) : user.name;
            const lastName = spaceIndex !== -1 ? user.name.substring(spaceIndex + 1) : '';

            const userData = {
              firstName: firstName,
              lastName: lastName,
              authEmail: user.email,
              prefEmail: "",
              phoneNumber: "",
              zipcode: 92805,
            };

            const createUserConfig = {
              method: 'post',
              url: BASE_URL,
              data: {
                apiType: "user",
                apiOperation: "post",
                config: {
                  pathTemplate: "/create/user",
                  parameters: {
                    body: userData,
                  },
                },
              },
            };

            console.log("Payload for creating user:", userData);
            let createResponse;
            if (isProduction) {
              createResponse = await axios(createUserConfig);
            } else {
              createResponse = await axios.post(
                `${BASE_URL}/create/user`,
                userData,
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );
            }

            console.log("Create user response status:", createResponse.status);
            if (createResponse.status === 200) {
              console.log("User successfully created");
              return true;
            } else {
              console.error("User creation failed:", createResponse.status);
              return '/?error=We encountered an error while creating your account. Please refresh the page or click the retry button to try again later';
            }
          } else {
            console.log("User found:", response.data);
            return true;
          }
        }

        throw new Error("Unexpected response format");
      } catch (error) {
        console.log("Error encountered:", error);
        return '/?error=An error occurred while checking user information. Please refresh the page or click the retry button to try again later';
      }
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect URL:", url);
      console.log("Redirect baseUrl:", baseUrl);
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
