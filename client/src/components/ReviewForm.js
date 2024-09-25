import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./reviewForm.css";
import StarRating from "../components/StarRating";

const ReviewForm = ({ productId, onUpdate }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0); // New state for average rating

  // Fetch reviews and calculate average rating
  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://amazon-product-mockup-server.vercel.app/api/products/${productId}`
      );
      setReviews(response.data.reviews);

      // Calculate average rating from fetched reviews
      const totalRating = response.data.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const avgRating =
        response.data.reviews.length > 0
          ? totalRating / response.data.reviews.length
          : 0;
      setAverageRating(avgRating); // Set the average rating
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://amazon-product-mockup-server.vercel.app/api/products/${productId}/reviews`,
        { rating, comment }
      );
      setRating(0);
      setComment("");
      onUpdate(response.data.averageRating); // Update average rating in parent component
      fetchReviews(); // Refresh reviews after submission
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="review-form-container">
      {/* Display Average Rating at the Top */}
      <div className="rating-section">
        <span className="rating-title">Average Rating : </span>
        <StarRating rating={averageRating} />
        <span className="review-count">[{reviews.length}]</span>
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="review-form">
        <h2>Submit a Review</h2>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`fa fa-star ${
                star <= (hoverRating || rating) ? "star-filled" : "star-empty"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here"
          className="review-input"
          required
        />
        <button type="submit" className="submit-review">
          Submit Review
        </button>
      </form>

      {/* List of Customer Reviews */}
      <div className="reviews-list-container">
        <h3>Customer Reviews</h3>
        <div className="reviews-list">
          {reviews.length > 0 ? (
            // Reverse the order of reviews for display
            [...reviews].reverse().map((review, index) => (
              <div key={index} className="review-item">
                <div className="star-rating">
                  <StarRating rating={review.rating} />
                </div>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
