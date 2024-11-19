const axios = require('axios')
const CryptoJS = require('crypto-js')
const API_URL = process.env.NEXT_PUBLIC_API_URL
let ASYMMETRIC_PUBLIC_KEY
const PROD_TYPE_ENDPOINT = process.env.NEXT_PUBLIC_PROD_API_URL
const FOOD_API = 'https://d9m68ewxdg.execute-api.us-east-1.amazonaws.com/prod/foodPantryRouter';
const API_URL_V2 = 'http://localhost:4000/api/v1/user';

export const decryptData = async (encryptedData) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/controller/decrypt`,
      {
        encryptedData: encryptedData,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    )

    if (response.status === 200) {
      return response.data.decryptedData
    }
  } catch (error) {
    console.error('Error:', error)
  }
}


// getFoodBanksByLocation("Orange County")
export const getFoodBanksByLocation = async (session) => {
  try {
    let foodBankResponse;
    if (!session) {
      console.log("no such session")
      const defaultCounty = 92805;
      console.log("API URL: ", `${API_URL}/fetch/pantries/${defaultCounty}`)
      // const productionMode = process.env.NODE_ENV === 'development';
      const productionMode = process.env.NODE_ENV === 'production';
      const FOOD_API = 'https://d9m68ewxdg.execute-api.us-east-1.amazonaws.com/prod/foodPantryRouter';
      console.log(productionMode)
      if (productionMode) {
        const config = {
          url: FOOD_API,
          method: 'post',
          data: {
              apiType: "user",
              apiOperation: "get",
              config: {
                      pathTemplate: "/fetch/pantries/{zipcode}",
                      parameters: {
                          "zipcode": defaultCounty
                      }
              }
          }
        };
        foodBankResponse = await axios(config);
      } else {
        foodBankResponse = await axios.get(
          `${API_URL}/fetch/pantries/${defaultCounty}`
        )
      }
    } else {
      const FOOD_API = 'https://d9m68ewxdg.execute-api.us-east-1.amazonaws.com/prod/foodPantryRouter';
      // const productionMode = process.env.NODE_ENV === 'development';
      const productionMode = process.env.NODE_ENV === 'production';
      const BASE_URL = productionMode
              ? 'https://d9m68ewxdg.execute-api.us-east-1.amazonaws.com/prod/foodPantryRouter'
              : `${API_URL}/${session.user.email}`;
      console.log(BASE_URL);
      let userObj;
  
      if (productionMode) {
        console.log("its prodution mode for getting user")
          const config = {
              url: FOOD_API,
              method: 'post',
              data: {
                  apiType: "user",
                  apiOperation: "get",
                  config: {
                          pathTemplate: "/{email}",
                          parameters: {
                              "email": session.user.email
                          }
                  }
              }
          };
          userObj = await axios(config);
      } else {
              console.log("fetching user")
              userObj = await axios.get(`${BASE_URL}`, {
                        withCredentials: true,
              });
      }
      const user = userObj.data;
      console.log(user);
      const userZipcode = user.zipcode;
      console.log("API URL: ", `${API_URL}/fetch/pantries/${userZipcode}`)


      if (productionMode) {
        const config = {
          url: FOOD_API,
          method: 'post',
          data: {
              apiType: "user",
              apiOperation: "get",
              config: {
                      pathTemplate: "/fetch/pantries/{zipcode}",
                      parameters: {
                          "zipcode": userZipcode
                      }
              }
          }
        };
        foodBankResponse = await axios(config);
      } else {
        foodBankResponse = await axios.get(
          `${API_URL}/fetch/pantries/${userZipcode}`
        )
      }
    }
    return foodBankResponse.data
  } catch (error) {
    console.log("Food bank by county error: ", error);
    throw error 
  }
}

export function getGlobalAsymmetricPublicKey() {
  // If the key is null or undefined, reset it to the default value.
  if (!ASYMMETRIC_PUBLIC_KEY) {
    ASYMMETRIC_PUBLIC_KEY =
      '3e5b9a66a52c91b14a4e2a73613d7b14f7e1987c124e5f76a5c03e942b3c0118'
  }

  return ASYMMETRIC_PUBLIC_KEY
}


export const withTimeout = async (timeout, promise) => {
  return new Promise(async (resolve, reject) => {
    // Set up timeout
    const timer = setTimeout(() => {
      reject(new Error('API Timeout'))
    }, timeout)

    try {
      const response = await promise
      clearTimeout(timer)
      resolve(response)
    } catch (error) {
      clearTimeout(timer)
      reject(error)
    }
  })
}

// Function to fetch cities by ZIP code
export const fetchCitiesByZipCode = async (zipCode) => {
  const productionMode = process.env.NODE_ENV === 'production';
  try {
    if (productionMode) {
      const config = {
        url: FOOD_API,
        method: 'post',
        data: {
          apiType: 'user',
          apiOperation: 'get',
          config: {
            pathTemplate: '/fetch/cities/{zipCode}',
            parameters: {
              zipCode: zipCode,
            },
          },
        },
      };
      const response = await axios(config);
      return response.data;
    } else {
      const response = await axios.get(`${API_URL_V2}/fetch/cities/${zipCode}`);
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching cities by ZIP code:', error);
    throw error;
  }
};

// Function to upload image and create pantry
export const uploadImageAndCreatePantry = async (formData) => {
  const productionMode = process.env.NODE_ENV === 'production';
  try {
    if (productionMode) {
      // Convert formData to a plain object
      const data = {};
      for (let [key, value] of formData.entries()) {
        if (key === 'file') {
          // Convert file to base64 and include fileName and fileType
          const file = value;
          const base64File = await fileToBase64(file);
          data['file'] = base64File;
          data['fileName'] = file.name;
          data['fileType'] = file.type;
        } else {
          data[key] = value;
        }
      }

      const config = {
        url: FOOD_API,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          apiType: 'user',
          apiOperation: 'post',
          config: {
            pathTemplate: '/upload/image',
            parameters: {
              body: data,
            },
          },
        },
      };
      console.log(config);
      console.log("i am going to upload a photo globally");
      const response = await axios(config);
      return response.data;
    } else {
      console.log("we are going to upload an image locally");
      const response = await axios.post(`${API_URL_V2}/upload/image`, formData);
      return response.data;
    }
  } catch (error) {
    console.error('Error uploading image or creating pantry:', error);
    throw error;
  }
};

// Helper function to convert file to Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data URL prefix
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


export const decryptDocumentData = (data) => {
  try {
    const secretKey = getGlobalAsymmetricPublicKey()
    const decryptedData = CryptoJS.AES.decrypt(data, secretKey).toString(
      CryptoJS.enc.Utf8,
    )
    return JSON.parse(decryptedData)
  } catch (error) {
    console.log(error)
  }
}
