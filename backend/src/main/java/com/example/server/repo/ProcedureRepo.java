package com.example.server.repo;

import com.example.server.model.Procedure;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcedureRepo extends JpaRepository<Procedure, Long> {
    Procedure findById(long id);
}
