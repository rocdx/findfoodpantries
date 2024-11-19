// components/Card.js

export default function HouseCard({ imageUrl, title, description, foodPantryURL }) {
    return (
        <div className="block rounded-lg p-4 border border-gray-300 hover:opacity-90 transition-opacity duration-300">
            <a href = {foodPantryURL}>
                <img src = {imageUrl} alt = {description} className="w-full rounded-lg"/>
            </a>
            <div className="mt-4">
                <h2 className="text-lg font-bold group-hover:opacity-90">{title}</h2>
                <div className="mt-2 flex justify-between items-center">
                </div>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2 group-hover:opacity-90">
                    {description}
                    {/* You might need to add some custom logic here to show "view more" if the text is too long */}
                </p>
            </div>
        </div>
    );
  }

