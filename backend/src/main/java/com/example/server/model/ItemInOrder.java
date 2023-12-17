package com.example.server.model;

import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.io.Serializable;

@Entity
@Table(name = "item_in_order")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemInOrder {
    @EmbeddedId
    ItemId itemId;
    @Column(name = "current_amount", nullable = false)
    private Integer current_amount;

}

