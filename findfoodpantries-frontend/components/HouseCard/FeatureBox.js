export default function FeatureBox({ number, title, description }) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-md overflow-hidden m-4 w-64">
        <div className="p-6 text-center">
          <div className="flex justify-center">
            <span className="flex items-center justify-center h-10 w-10 bg-gray-200 rounded-full text-lg font-semibold">
              {number}
            </span>
          </div>
          <h3 className="text-lg font-semibold my-2">{title}</h3>
          <p className="text-gray-700">{description}</p>
        </div>
      </div>
    );
  }