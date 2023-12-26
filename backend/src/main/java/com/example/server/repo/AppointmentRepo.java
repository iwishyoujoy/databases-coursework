package com.example.server.repo;

import com.example.server.model.Appointment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepo extends JpaRepository<Appointment, Long> {
    Appointment findById(long id);
}
