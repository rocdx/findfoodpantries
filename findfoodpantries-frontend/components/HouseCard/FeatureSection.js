import FeatureBox from '@/components/HouseCard/FeatureBox'

export default function FeatureSection({ imagesource, featuresList }) {
    return (
        <div className="relative mt-8">
            <img src={imagesource} alt="background" className="w-full object-cover" style={{ height: '650px' }} />
            <div className="absolute inset-0 bg-black opacity-25"></div>
            <div className="absolute inset-0 p-6 flex flex-col items-center justify-start">
                <h2 className="text-4xl text-white mb-8 text-center">
                    Our Mission
                </h2>
                <div className="w-full overflow-x-auto scrollbar-hide">
                    <div className="flex flex-col md:grid md:grid-cols-3 gap-4 items-center justify-center md:max-w-5xl mx-auto px-4">
                        {featuresList.map((feature, index) => (
                            <FeatureBox
                                key={index}
                                number={index + 1}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </div>
                <div className="mt-8"></div> {/* Padding below the last box */}
            </div>
        </div>
    );
}