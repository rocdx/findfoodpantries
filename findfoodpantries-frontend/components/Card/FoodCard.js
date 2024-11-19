import Image from 'next/image';
import Link from 'next/link';

export default function FoodCard({foodPantryURL, imageURL, description, title}) {
  return (
    <div className="w-72 h-96 bg-white shadow-md rounded-lg overflow-hidden">
      <Link href={foodPantryURL} passHref>
        <div className="block h-2/3 relative cursor-pointer">
          <Image
            src={imageURL}
            alt={description}
            layout="fixed"
            width={288}  // width of w-72 in pixels
            height={192} // height for 2/3 of h-96 in pixels
            objectFit="cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-2">{title}</h1>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}