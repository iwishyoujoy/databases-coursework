package com.example.server.repo;

import com.example.server.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerRepo extends JpaRepository<Seller, Long> {
    Seller findById(long id);
    Seller findByLogin(String login);
}
