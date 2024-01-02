package com.example.server.controller;

import com.example.server.model.Review;
import com.example.server.model.Customer;
import com.example.server.repo.ReviewRepo;
import com.example.server.repo.CustomerRepo;
import com.example.server.service.ReviewReturner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private final CustomerRepo customerRepo;

    @Autowired
    public ReviewController(ReviewRepo reviewRepo, CustomerRepo customerRepo) throws NoSuchAlgorithmException {
        this.reviewRepo = reviewRepo;
        this.customerRepo = customerRepo;
    }

    @PostMapping("create/")
    public ResponseEntity<Void> create(@RequestBody Review review) {
        try {
            reviewRepo.findAll().stream().filter(user -> user.getItem_id().equals(review.getItem_id())).filter(user -> user.getCustomer_id().equals(review.getCustomer_id())).findFirst().get();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (NoSuchElementException e) {
            reviewRepo.save(review);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }


    @GetMapping("/one/{id}")
    public ResponseEntity<Review> getReview(@PathVariable Long id) {
        try {
            Review review = reviewRepo.findAll().stream().filter(user -> user.getId().equals(id)).findFirst().get();
            return ResponseEntity.ok().body(review);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/item-id/{itemid}")
    public ResponseEntity<List<ReviewReturner>> getReviewByItem(@PathVariable Long itemid) {
        try {
            List<Review> list = reviewRepo.findAll();
            List<ReviewReturner> to_ret = new ArrayList<>();
            for (Review review : list) {
                if (review.getItem_id().equals(itemid)) {
                    Customer customer = customerRepo.findAll().stream().filter(user -> user.getId().equals(review.getCustomer_id())).findFirst().get();
                    ReviewReturner returner = new ReviewReturner(review.getId(), review.getCustomer_id(), customer.getSurname(), customer.getName(), review.getRating(), review.getContent(), review.getItem_id());
                    to_ret.add(returner);
                }
            }
            return ResponseEntity.ok().body(to_ret);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Review>> getAllReview() {
        return ResponseEntity.ok().body(reviewRepo.findAll());
    }

    @GetMapping("/customer/{customer_id}")
    public ResponseEntity<List<Review>> getReviewOfCustomer(@PathVariable Long customer_id) {
        try {
            List<Review> list = reviewRepo.findAll();
            List<Review> to_ret = new ArrayList<>();
            for (Review review : list) {
                if (review.getCustomer_id().equals(customer_id)) {
                    to_ret.add(review);
                }
            }
            return ResponseEntity.ok().body(to_ret);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            Review review = reviewRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            reviewRepo.delete(review);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(@RequestBody Review review, @PathVariable String id) {
        Review procedureBefore;
        try {
            procedureBefore = reviewRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            review.setId(procedureBefore.getId());
            reviewRepo.save(review);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
