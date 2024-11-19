'use client'
import React from 'react';

export default function StatisticsSection() {
    const cardBgColor = 'bg-blue-100'; // This is a light blue color, you can choose any light color from the Tailwind palette

    return (
        <div className="bg-white py-8">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-6">Impact of Food Insecurity</h2>
                <div className="flex flex-wrap -mx-4 text-center">
                    <div className={`w-full md:w-1/2 px-4 mb-6 md:mb-0 ${cardBgColor} shadow-md rounded-lg pt-8`}> {/* Adjusted padding-top here */}
                        <img src="https://palace-images.s3.us-east-2.amazonaws.com/hunger1.png" alt="Food Insecurity" className="mx-auto mb-4" style={{ height: '200px', width: '350px' }} />
                        <div className="p-4">
                            <h3 className="text-xl font-bold mb-2">Food Insecurity Among Children</h3>
                            <p className="text-gray-600 font-bold"> &quot;As of 2021, more than 12 million children in the United States live in &apos;food insecure&apos; homes, meaning those households don&apos;t have enough food for every family member to lead a healthy life.&quot; — No Kid Hungry</p>
                        </div>
                    </div>
                    <div className={`w-full md:w-1/2 px-4 ${cardBgColor} shadow-md rounded-lg pt-8`}> {/* Adjusted padding-top here */}
                        <img src="https://palace-images.s3.us-east-2.amazonaws.com/hunger2.jpg" alt="Child Hunger" className="mx-auto mb-4" style={{ height: '200px', width: '350px' }} />
                        <div className="p-4">
                            <h3 className="text-xl font-bold mb-2">    Impact of Food Insecurity on Education</h3>
                            <p className="text-gray-600 font-bold">        &quot;Students who come from food-insecure families are more likely to repeat a grade, experience developmental impairments in areas like language and motor skills, and have more social and behavioral problems.&quot; — Feeding America</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}