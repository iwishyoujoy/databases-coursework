package com.example.server.repo;

import com.example.server.model.ItemId;
import com.example.server.model.ItemInOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemInOrderRepo extends JpaRepository<ItemInOrder, ItemId> {
}
