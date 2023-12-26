package com.example.server.repo;

import com.example.server.model.ProcedureCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcedureCategoryRepo extends JpaRepository<ProcedureCategory, Long> {
    ProcedureCategory findById(long id);
}
