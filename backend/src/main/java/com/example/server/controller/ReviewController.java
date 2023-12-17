package com.example.server.controller;

import com.example.server.model.Review;
import com.example.server.repo.ReviewRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/review")
@CrossOrigin
public class ReviewController {
    private final ReviewRepo reviewRepo;

    @Autowired
    public ReviewController(ReviewRepo reviewRepo) throws NoSuchAlgorithmException {
        this.reviewRepo = reviewRepo;
    }

    @PostMapping
    public int create(@RequestBody Review review) {
        try {
            reviewRepo.findAll().stream().filter(user -> user.getItem_id().equals(review.getItem_id())).filter(user -> user.getCustomer_id().equals(review.getCustomer_id())).findFirst().get();
            return 500;
        } catch (NoSuchElementException e) {
            reviewRepo.save(review);
            return 200;
        }
    }


    @GetMapping("/one/{id}")
    public Review getReview(@PathVariable Long id) {
        try {
            return reviewRepo.findAll().stream().filter(user -> user.getId().equals(id)).findFirst().get();
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    @GetMapping("/all")
    public List<Review> getAllReview() {
        return reviewRepo.findAll();
    }

    @GetMapping("/customer/{customer_id}")
    public List<Review> getReviewOfCustomer(@PathVariable Long customer_id) {
        try {
            List<Review> list = reviewRepo.findAll();
            List<Review> to_ret = new ArrayList<>();
            for (Review review : list) {
                if (review.getCustomer_id().equals(customer_id)) {
                    to_ret.add(review);
                }
            }
            return to_ret;
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    @DeleteMapping("{id}")
    public int delete(@PathVariable String id) {
        try {
            Review review = reviewRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            reviewRepo.delete(review);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }

    @PutMapping("{id}")
    public int update(@RequestBody Review review, @PathVariable String id) {
        Review procedureBefore;
        try {
            procedureBefore = reviewRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            review.setId(procedureBefore.getId());
            reviewRepo.save(review);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }
}
