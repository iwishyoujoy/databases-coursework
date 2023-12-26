package com.example.server.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "appointment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @Column(name = "item_id ", nullable = false)
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long item_id ;

    @Column(name = "date_time", nullable = false)
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd' 'HH:mm:ss", timezone="Europe/Moscow")
    private Timestamp date_time;

    @Column(name = "procedure_id", nullable = false)
    private Long procedure_id;
    
    @Column(name = "status", nullable = false)
    private Boolean status;

}
