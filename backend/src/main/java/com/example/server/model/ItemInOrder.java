package com.example.server.model;

import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.io.Serializable;

@Entity
@Table(name = "item_in_order")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ItemInOrder {
    @EmbeddedId
    ItemId itemId;

    private Integer current_amount;

}

