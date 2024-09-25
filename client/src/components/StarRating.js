// src/components/StarRating.js
import React from 'react';
import './starRating.css';

const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const hasHalfStar = rating % 1 >= 0.5; // Display half star if rating is 0.5 or more
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars after full and half stars

    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(<span key={`full-${i}`} className="fa fa-star star-filled" />);
    }

    // Add half star if applicable
    if (hasHalfStar) {
        stars.push(<span key="half" className="fa fa-star-half-alt star-filled" />);
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<span key={`empty-${i}`} className="fa fa-star star-empty" />);
    }

    return <div className="star-rating">{stars}</div>;
};

export default StarRating;
