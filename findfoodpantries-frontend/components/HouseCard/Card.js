'use client'
import React, { useState, useEffect } from 'react'

export default function Card({ imageUrl, title, description, foodPantryURL }) {
    const [isExpanded, setExpanded] = useState(false);

    const toggleDescription = () => {
        setExpanded(!isExpanded)
    }

    // const redactDescription = (description, maxWordCount = 55) => {
    //     // return mutated string cuts off at 55 words 
    //     // substring 
    //     // indexOf
    //     const wordList = description.split(/\s+/);
    //     //console.log(wordList);
    //     var redactedString = "";
    //     var i = 0;
    //     var completeSentence = true;
    //     if (wordList.length < 55) {
    //         return description;
    //     } else {
    //         while (i < maxWordCount || completeSentence) {
    //             redactedString += wordList[i] + " ";
    //             completeSentence = !(/[.?!]/.test(wordList[i]));
    //             i++;
    //         }
    //         return redactedString;
    //     }
    // }
    const redactDescription = (text, maxWordCount, isExpanded) => {
        const wordList = text.split(/\s+/);
        if (wordList.length <= maxWordCount) {
            return text; // The full text is shorter than maxWordCount, return all of it.
        } else {
            let previewText = wordList.slice(0, maxWordCount).join(" ");
    
            if (!isExpanded) {
                return previewText.trim() + '...'; // Not expanded, return preview with ellipsis.
            }
    
            // Expanded, try to find the next punctuation to complete the sentence.
            const punctuationRegex = /[.!?]/;
            let remainingText = text.substring(previewText.length);
            let match = punctuationRegex.exec(remainingText);
    
            if (match) {
                // If there's punctuation after the 40-word mark, include up to that punctuation.
                return text.substring(0, previewText.length + match.index + 1);
            } else {
                // No punctuation after the 40-word mark, find the last punctuation before the mark.
                let lastPunctuationIndex = previewText.split("").reverse().join("").search(punctuationRegex);
                if (lastPunctuationIndex !== -1) {
                    // If there's punctuation before the 40-word mark, include up to that punctuation.
                    return previewText.substring(0, previewText.length - lastPunctuationIndex);
                } else {
                    // No punctuation at all, return the first 40 words.
                    return wordList.slice(0, maxWordCount).join(" ");
                }
            }
        }
    };

    return (
        <div className="border-2 border-gray-400 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <a href={foodPantryURL} target="_blank" rel="noopener noreferrer">
                <img src={imageUrl} alt={description} className="w-full h-52 object-cover"/>
            </a>
            <div className="p-4">
                <h2 className="text-lg font-bold mb-2">{title}</h2>
                <p className={`text-sm text-gray-500 mb-2 ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {redactDescription(description, isExpanded ? 30 : 10, isExpanded)}
                </p>
                <div onClick ={toggleDescription} className="text-blue-500 hover:underline" >
                    {isExpanded ? 'View less' : 'View more'}
                </div>
            </div>
        </div>
    );
}
