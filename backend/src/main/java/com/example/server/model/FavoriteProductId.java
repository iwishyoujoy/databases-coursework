package com.example.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Data
@Embeddable
public class FavoriteProductId implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "customer_id", nullable = false)
    private Long customer_id;

    @Column(name = "item_id ", nullable = false)
    private Long item_id;
}
