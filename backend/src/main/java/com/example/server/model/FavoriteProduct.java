package com.example.server.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "favorite_product")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteProduct {
    @EmbeddedId
    FavoriteProductId favoriteProductId;
}
