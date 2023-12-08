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
    private Long customer_id;
    private Integer rating;
    private String content;
    private Long item_id;
}
