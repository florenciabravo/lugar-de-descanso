import { useState } from "react";
import { useFetch } from "../hook/admin/useFetch";
import "../styles/ReviewFormComponent.css";

export const ReviewFormComponent = ({ productId, userId, onReviewAdded }) => {
  const { fetchData, isLoading, error } = useFetch();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Por favor selecciona una puntuación.");
      return;
    }

    const params = new URLSearchParams({
      productId: productId,
      userId: userId,
      rating: rating,
      comment: comment
    });

    const result = await fetchData(`http://localhost:8080/reviews?${params}`, "POST");

    if (!result.error) {
      setRating(0);
      setComment("");
      if (onReviewAdded) onReviewAdded(result); // refresca lista padre
    }
  };

  return (
    <form className="review-form product-policy-block" onSubmit={handleSubmit}>
      <h3>Deja tu valoración</h3>

      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "filled-star" : "empty-star"}
            onClick={() => handleStarClick(star)}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        className="review-textarea"
        placeholder="Escribe tu comentario (opcional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <button type="submit" className="review-submit-button" disabled={isLoading}>
        {isLoading ? "Enviando..." : "Enviar Reseña"}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
};
