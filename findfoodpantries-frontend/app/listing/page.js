'use client'
import Card from "@/components/HouseCard/Card";


const foodPantryJSONList = [
    {
        imageUrl : "https://global-uploads.webflow.com/606e86ff2351800a9dcfa8db/60e5f2b70692c47f6c4ae9a8_Second%20Harvest%20Food%20Bank%20OC.jpg",
        title : "Second Harvest Food Bank",
        description : "At Second Harvest Food Bank of Orange County we envision an Orange County with food and nutritional security for all. In collaboration with our partners, we provide dignified, equitable and consistent access to nutritious food, creating a foundation for community health",
        foodPantryURL: "https://feedoc.org/"
    },
    {
        imageUrl:"https://stunewslaguna.com/images/stories/editorial/apr14G/Laguna-Food-outside.jpg",
        title:"Laguna Food Pantry",
        description:"We Believe No One Should Go Hungry. Our mission is to collect and distribute free, fresh, and nutritious groceries to people in need. We are open five days a week and everyone is welcome.",
        foodPantryURL:"https://www.lagunafoodpantry.org/",
    },
    {
        imageUrl:"https://capoc.org/wp-content/uploads/2020/09/cap-oc-food-bank_banner.jpg",
        title:"CAP OC Food Bank",
        description:"The OC Food Bank, a program of Community Action Partnership of Orange County, unites communities to end hunger and malnutrition by partnering with more than 300 local charities, soup kitchens and community organizations. Through donated food, United States Department of Agriculture (USDA) commodities and purchased food, and the generous support of individuals we are able to support nonprofit agencies in Orange County serving low-income families and individuals. In a typical year, the food bank distributes more than 23 million pounds of food. In June 2020, we have increased the pounds of food distributed by 59% compared to this time last year. The OC Food Bank partnered with Power of One Foundation to set up weekly mass drive-thru distributions. In August 2020 we acknowledged serving 1 million people affected by the economic downturn caused by COVID-19 and we anticipate the need will continue to grow.",
        foodPantryURL:"https://capoc.org/oc-food-bank/",
    },
    {
        imageUrl:"https://www.families-forward.org/wp-content/uploads/2015/08/food-pantry-volunteers-Families-Forward-before-after.jpg",
        title:"Families Forward Food Pantry",
        description:"Families Forward holds strong to our commitment to the values of dignity, empowerment, accountability, community spirit, and hope.",
        foodPantryURL:"https://www.families-forward.org/",
    },
    {
        imageUrl:"https://images.squarespace-cdn.com/content/v1/5cf2f1e65fc9cf00018d65d4/1583801010203-3H1619VVCCPBSDDR1DM9/Picture1.jpg",
        title:"St. Killian Church - Food Distribution",
        description:"Our Outreach Ministry is most active because of our onsite Food Pantry. We provide assistance to local families through weekly food distributions. Because of our parishioner donations and our partnership with Second Harvest, we are able to provide some basic groceries and items from local stores provided through the Grocery Rescue program.",
        foodPantryURL:"https://www.stkilianmissionviejo.org/outreachfood-pantry",
    },
    {
        imageUrl:"https://s3.amazonaws.com/files.galaxydigital.com/4447/agency/8078.jpg?20230808203348?area=agency",
        title:"South County Outreach",
        description:"For more than three decades, South County Outreach (formerly Saddleback Community Outreach) has been a leader in the fight to end hunger and homelessness in Orange County. We believe that helping people help themselves is the most effective way to build a self-sustaining community. Through the implementation of programs like our homeless prevention program, along with our food program, which distributes over 700,000 pounds of food and keeps nearly 2,000 children fed each year, South County Outreach continues to do what we do best—housing hope and ending hunger.",
        foodPantryURL:"https://www.sco-oc.org/",
    }
 
]

export default function Listing() {
    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12"
             style={{
                backgroundImage: "url('https://st5.depositphotos.com/76020840/65858/i/1600/depositphotos_658583198-stock-photo-color-illustration-vegetables-white-background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat"
             }}>
          <div className="relative py-3 sm:max-w-4xl sm:mx-auto bg-white bg-opacity-100 rounded-lg p-5">
            <h1 className="text-2xl font-bold mb-6 text-center">Orange County Food Banks</h1>
            <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
              {foodPantryJSONList.map((foodPantry, index) => (
                <Card
                  key={index}
                  imageUrl={foodPantry.imageUrl}
                  title={foodPantry.title}
                  description={foodPantry.description}
                  foodPantryURL={foodPantry.foodPantryURL}
                />
              ))}
            </div>
          </div>
        </div>
    );
  }
