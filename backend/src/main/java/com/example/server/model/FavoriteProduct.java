package com.example.server.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "favorite_product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteProduct {
    @EmbeddedId
    FavoriteProductId favoriteProductId;
}
