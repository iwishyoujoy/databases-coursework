package com.example.server.repo;

import com.example.server.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepo extends JpaRepository<Product, Long> {
    Product  findById(long id);
}
