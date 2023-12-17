package com.example.server.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "appointment")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @Column(name = "item_id ", nullable = false)
    private Long item_id ;
    @Column(name = "date_time", nullable = false)
    private Timestamp date_time;
    @Column(name = "procedure_id", nullable = false)
    private Long procedure_id;

}
