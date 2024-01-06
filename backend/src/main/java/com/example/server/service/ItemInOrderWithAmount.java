package com.example.server.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemInOrderWithAmount implements Serializable {

    private Long order_id;
    private Long item_id;
    private String type;
    private Integer current_amount;
    private String status;

}
