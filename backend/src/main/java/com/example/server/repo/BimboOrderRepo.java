package com.example.server.repo;

import com.example.server.model.BimboOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BimboOrderRepo extends JpaRepository<BimboOrder, Long> {
}
