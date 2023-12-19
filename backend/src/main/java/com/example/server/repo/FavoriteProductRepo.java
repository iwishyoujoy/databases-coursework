package com.example.server.repo;

import com.example.server.model.FavoriteProduct;
import com.example.server.model.FavoriteProductId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteProductRepo  extends JpaRepository<FavoriteProduct, FavoriteProductId> {
}
