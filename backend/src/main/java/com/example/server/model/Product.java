package com.example.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @Column(name = "id_item", nullable = false)
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_item;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "price", nullable = false)
    private Float price;
    @Column(name = "description", nullable = false)
    private String description;
    @Column(name = "photo_url", nullable = false)
    private String photo_url;
    @Column(name = "amount_available", nullable = false)
    private Integer amount_available;
    @Column(name = "seller_id", nullable = false)
    private Long seller_id;
    @Column(name = "product_category_id", nullable = false)
    private Long product_category_id;
}
