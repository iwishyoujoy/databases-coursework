package com.example.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "review")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "customer_id", nullable = false)
    private Long customer_id;
    @Column(name = "rating", nullable = false)
    private Integer rating;
    @Column(name = "content", nullable = false)
    private String content;
    @Column(name = "item_id", nullable = false)
    private Long item_id;
}
