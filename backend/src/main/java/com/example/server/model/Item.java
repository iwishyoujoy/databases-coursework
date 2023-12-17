package com.example.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.io.Serializable;
@Entity
@Table(name = "item")
@Data
@NoArgsConstructor
@AllArgsConstructor
//TODO: нужна ли этот класс??????
public class Item implements Serializable {

    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "type")
    private String type;
}
