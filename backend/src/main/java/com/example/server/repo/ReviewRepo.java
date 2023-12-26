package com.example.server.repo;

import com.example.server.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepo extends JpaRepository<Review, Long> {
    Review findById(long id);
}
