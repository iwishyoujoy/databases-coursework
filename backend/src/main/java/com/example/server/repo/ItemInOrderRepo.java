package com.example.server.repo;

import com.example.server.model.ItemInOrder;
import com.example.server.model.itemInOrderId;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemInOrderRepo extends JpaRepository<ItemInOrder, itemInOrderId> {
}
