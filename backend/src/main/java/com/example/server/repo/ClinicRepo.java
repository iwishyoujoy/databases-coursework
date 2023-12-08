package com.example.server.repo;

import com.example.server.model.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicRepo extends JpaRepository<Clinic, Long> {
}


