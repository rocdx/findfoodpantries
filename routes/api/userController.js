const express = require("express");
const router = express.Router();
var ObjectID = require("mongodb").ObjectId;
const UserInquiry = require("../../models/UserInquiry")
const FoodPantry = require("../../models/FoodPantry")
const User = require("../../models/User")
const Busboy = require('busboy');

const nodemailer = require("nodemailer")
require('dotenv').config();
const axios = require("axios")

const AWS = require('aws-sdk');
// AWS S3 configuration

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });



  const uploadFileToS3 = (uploadParams) => {
    return new Promise((resolve, reject) => {
      s3.upload(uploadParams, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  };
  
  router.post('/upload/image', (req, res) => {
    const busboy = Busboy({ headers: req.headers });
    let fileData;
    let fileName;
    let contentType;
    let pantryDetails = {}; // Store pantry details here
  
    // Handle text fields in the form (name, description, etc.)
    busboy.on('field', (fieldname, value) => {
      pantryDetails[fieldname] = value;
      console.log(`Field [${fieldname}]: value: ${value}`);
    });
  
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(JSON.stringify(file))
        console.log(JSON.stringify(filename));
      fileName = `${Date.now()}-${filename.file}`;
      contentType = mimetype;
  
      console.log(`File [${fieldname}]: filename: ${filename.filename}, encoding: ${encoding}, mimetype: ${mimetype}`);
  
      const fileChunks = [];
  
      file.on('data', (data) => {
        fileChunks.push(data);
      });
  
      file.on('end', async () => {
        fileData = Buffer.concat(fileChunks);
  
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileName,
          Body: fileData,
          ContentType: contentType,
        };
  
        try {
          // Upload the file to S3
          const s3Data = await uploadFileToS3(uploadParams);
          pantryDetails.imageURL = s3Data.Location; // Store S3 image URL in pantry details
  
          // Log all pantry details for debugging
          console.log('Pantry Details:', pantryDetails);
  
          // Create the FoodPantry document in MongoDB
          const newPantry = new FoodPantry(pantryDetails);
          await newPantry.save(); // Save the new pantry document
  
          // Return success response
          return res.status(200).json({
            message: 'File uploaded to S3 and pantry created successfully',
            pantry: newPantry,
          });
        } catch (error) {
          console.error('Error uploading to S3 or creating pantry:', error);
          res
            .status(500)
            .json({ error: 'Error uploading the file to S3 or creating the pantry document' });
        }
      });
    });
  
    busboy.on('finish', () => {
      console.log('Busboy finished parsing the form.');
    });
  
    req.pipe(busboy);
  });

  
router.get("/:email", async (req, res) => {
    try {
        const existingUser = await User.findOne({authEmail: req.params.email})
        if (existingUser) {
            return res.status(200).json(existingUser)
        } else {
            console.log("no user exists we shoul return this back")
            return res.status(200).json({message: "no such user exists"})
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Server error"});
    }
})

router.post("/create/user", async (req, res) => {
    try {
        const authEmail = req.body.authEmail
        console.log("authEmail: ", authEmail);
        const existingUser = await User.findOne({authEmail: authEmail})
        console.log("creating new user: ");
        console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({message: "user already exists"})
        }
        const newUser = new User(req.body);
        await newUser.save();
        return res.status(200).json(newUser);

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Server error"});
    }
})

router.put("/update/user/profile/:authEmail", async (req, res) => {
    try {
        const authEmail = req.params.authEmail;
        const existingUser = await User.findOne({authEmail : authEmail});
    
        if (existingUser) {
            const updatedUserProfile = await User.findByIdAndUpdate(
                existingUser._id,
                req.body,
                {new: true}
            )
            if (!updatedUserProfile) {
                return res.status(404).json({message: "user update failed. Please try again"})
            }
            return res.status(200).json(updatedUserProfile);
        } else {
            return res.status(404).json({message: "User is not found. An update to user profile cannot be made."})
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Server error"});
    }
})

router.get("/fetch/pantries/:zipcode", async (req, res) => {
    try {
        const zipcode = parseInt(req.params.zipcode, 10);
        console.log(zipcode);
        const googleAPIUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=AIzaSyDGLn8aVx7RLPS9qlbTtcgLqBYzj_nJB2k`
        const countyResult = await axios.get(googleAPIUrl)
        console.log(countyResult)
        console.log(JSON.stringify(countyResult.data.results))
        const temp = countyResult.data.results
        const components = temp[0].address_components
        var foundCounty = ""
        for (var i = 0; i < components.length; i++) {
            var locationObject = components[i]
            if (locationObject.types.includes("administrative_area_level_2")) {
                foundCounty = locationObject.long_name
                break;
            }
        }
        console.log("County is " + foundCounty)
        //const foodPantryCounty = req.params.county
        const foodPantries = await FoodPantry.find({county: foundCounty})
        const sortedFoodPantries = foodPantries.sort((a, b) => {
            if (a.name === "Church of Southland Food Pantry") {
                return -1;
            }
            if (b.name === "Church of Southland Food Pantry") {
                return 1;
            }
            return 0;
        });
        // if (sortedFoodPantries.length === 0 || sortedFoodPantries === null || sortedFoodPantries === undefined) {
        //     return res.status(404).send({message: "food pantries by county not found "});
        // }
        return res.status(200).json(sortedFoodPantries)
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Server error"});
    }
})

router.post("/create/food/bank", async (req, res) => {
    try {
        const existingAddress = req.body.address 
        const existingFoodPantry = await FoodPantry.findOne({address: existingAddress});
    
        if (existingFoodPantry) {
            return res.status(400).json({messaage: "Food pantry exists. Please try another one"})
        } else {
            const newFoodPantry = new FoodPantry(req.body);
            await newFoodPantry.save();
            return res.status(200).json(newFoodPantry);
        }
    } catch(error) {
        console.log(error);
        return res.status(400).json({message: "Server error"});
    }
})

router.post("/subscribe/foodbank", async (req, res) => {
    const {foodBankEmail, firstName, lastName, userEmail, userPhoneNumber, message } = req.body
    const timestamp = new Date()
    const timestampFormatted = timestamp.toUTCString()
    const newInquiry = new UserInquiry({
        foodBankEmail: foodBankEmail,
        firstName: firstName,
        lastName: lastName,
        userEmail: userEmail,
        userPhoneNumber: userPhoneNumber,
        message: message,
        timestamp: timestamp
    })

    try {
        await newInquiry.save()
        console.log(process.env.OAUTH_CLIENTID)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: userEmail,
                clientId: "28930876920-cqdk4q1cu8o2cfojqlgc2ammvfddfqhb.apps.googleusercontent.com",
                clientSecret: "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",
                refreshToken: "1//042LAnYC_urVLCgYIARAAGAQSNwF-L9Ir-kHvnL0Wfjnahib-2-4rgmtsHjsEvcQlNvDUqtdP1plIoeysA2qz0cfqNfps11WBYJs"
            }
        }) 
        const mailOptions = {
            from: userEmail,
            to: foodBankEmail,
            subject: `${firstName} ${lastName} has subscribed to your food bank`,
            html: `<strong>First Name:</strong> ${firstName}<br>` +
                  `<strong>Last Name:</strong> ${lastName}<br>` +
                  `<strong>Email:</strong> ${userEmail}<br>` +
                  `<strong>Phone Number:</strong> ${userPhoneNumber}<br>` +
                  `<strong>message:</strong> ${message}<br><br>` +
                  `<strong>Time Submitted:</strong> ${timestampFormatted}`
        };
        await transporter.sendMail(mailOptions)
        return res.status(200).send("You have successfully subscribed to this food bank")
    } catch(error) {
        console.log(error)
        return res.status(500).send("Subscription to food bank has failed")
    }
})

router.get('/fetch/cities/:zip', async (req, res) => {
    const zipCode = req.params.zip;
  
    if (!zipCode) {
      return res.status(400).json({ error: 'ZIP code is required' });
    }
  
    try {
      // Fetch data from Zippopotam.us API
      const response = await axios.get(`http://api.zippopotam.us/us/${zipCode}`);
  
      const places = response.data.places;
  
      if (!places || places.length === 0) {
        return res.status(404).json({ error: 'No cities found for this ZIP code' });
      }
  
      // Map the places to extract city names
      const cities = places.map((place) => place['place name']);
      console.log(cities)
      // Remove duplicates
      const uniqueCities = [...new Set(cities)];
  
      // Limit the results to 25 cities
      const limitedCities = uniqueCities.slice(0, 25);
  
      return res.status(200).json({ cities: limitedCities });
    } catch (error) {
      console.error('Error fetching cities:', error.message);
  
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: 'Invalid ZIP code' });
      } else {
        return res.status(500).json({ error: 'Error fetching cities' });
      }
    }
  });



module.exports = router;