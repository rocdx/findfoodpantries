import React, { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import IconCounty from '@/components/HouseCard/IconCounty';

export default function IconSlider() {
    const countyIcons = [
        "Orange County"
    ];

    const sliderRef = useRef(null);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const { scrollLeft, clientWidth } = sliderRef.current;
            const scrollTo =
                direction === 'left'
                    ? scrollLeft - clientWidth
                    : scrollLeft + clientWidth;
            sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className='pt-16 flex items-center justify-center w-full relative'>
            <button
                aria-label="Scroll left"
                className='absolute left-0 z-10 ml-8 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100'
                onClick={() => scroll('left')}
            >
                <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <div ref={sliderRef} className='flex overflow-hidden whitespace-nowrap space-x-4 justify-start w-full pl-16'>
                {countyIcons.map((county, index) => (
                    <div key={index} className="inline-block px-2">
                        <IconCounty countyName={county} />
                    </div>
                ))}
            </div>
            <button
                aria-label="Scroll right"
                className='absolute right-0 z-10 mr-8 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100'
                onClick={() => scroll('right')}
            >
                <ChevronRightIcon className="h-6 w-6" />
            </button>
        </div>
    );
}