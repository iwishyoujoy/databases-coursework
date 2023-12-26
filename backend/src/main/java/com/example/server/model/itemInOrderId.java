package com.example.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public
class itemInOrderId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "order_id", nullable = false)
    private Long order_id;

    @Column(name = "item_id ", nullable = false)
    private Long item_id;

    @Column(name = "current_amount", nullable = false)
    private Integer current_amount;

}
