import { IReviewProps } from "./types";

export const getAverageReviewRating = (reviews: IReviewProps[]): number => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    return totalRating / reviews.length;
};

export const displayRatingAsStars = (rating) => {
    const fullStar = '★';
    const emptyStar = '☆';
    const roundedRating = Math.round(rating);
    const fullStarsCount = roundedRating;
    const emptyStarsCount = 5 - fullStarsCount;

    return fullStar.repeat(fullStarsCount) + emptyStar.repeat(emptyStarsCount);     
};