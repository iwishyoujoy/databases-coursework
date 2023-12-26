package com.example.server.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "item_in_order")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemInOrder {
    @EmbeddedId
    itemInOrderId itemInOrderId;

}

