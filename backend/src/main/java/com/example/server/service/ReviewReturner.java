package com.example.server.service;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewReturner {
    private Long id;
    private String surname;
    private String name;
    private Integer rating;
    private String content;
    private Long item_id;
}
