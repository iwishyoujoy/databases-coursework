package com.example.server.repo;

import com.example.server.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepo extends JpaRepository<Customer, Long> {
    Customer findById(long id);
    Customer findByLogin(String login);
}
