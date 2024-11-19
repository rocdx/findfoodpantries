import React from 'react'
import { Citrus, Star, Palmtree, TreeDeciduous, Waves, Carrot, Ship, Tally3, Fish, Leaf, Gem, Sprout, Droplets, Computer} from 'lucide-react';
import Link from 'next/link';


export default function IconCounty({ countyName, countyPath}) {
    let Icon;
    let path;
    switch(countyName) {
        case "Orange County":
            Icon = Citrus
            path = 'Orange County'
            break;
        case "Los Angeles County":
            Icon = Star
            path = 'Los Angeles County'
            break;
        case "San Diego County":
            Icon = Palmtree
            path = 'San Diego County'
            break;
        case "San Bernadino County":
            Icon = TreeDeciduous
            path = 'San Bernadino County'
            break;
        case "Riverside County":
            Icon = Waves
            path = 'Riverside County'
            break;
        case "Kern County":
            Icon = Carrot
            path = 'Kern County'
            break;
        case "San Francisco County":
            Icon = Ship
            path = 'San Francisco County'
            break;
        case "Alameda County":
            Icon = Tally3
            path = 'Alameda County'
            break;
        case "San Mateo County":
            Icon = Fish
            path = 'San Mateo County'
            break;
        case "Contra Costa County":
            Icon = Leaf
            path = 'Contra Costa County'
            break;
        case "Sacramento County":
            Icon = Gem
            path = 'Sacramento County'
            break; 
        case "Fresno County":
            Icon = Sprout
            path = 'Fresno County'
            break; 
        case "San Joaquin County":
            Icon = Droplets
            path = 'San Joaquin County'
            break; 
        case "Santa Clara County":
            Icon = Computer
            path = 'Santa Clara County'
            break; 
        default:
            Icon = null
            path = "#"
    }

    return (
        <Link href = {`/food/${encodeURIComponent(path)}`} passHref>
            <div className='flex flex-col items-center cursor-pointer'>
                {Icon && <Icon size = {40} className='text-6xl'/>}
                <p className='font-bold mt-1 text-sm'>{countyName}</p>
            </div>
        </Link>
    )
}