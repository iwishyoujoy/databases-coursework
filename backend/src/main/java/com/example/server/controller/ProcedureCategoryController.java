package com.example.server.controller;

import com.example.server.model.ProcedureCategory;
import com.example.server.repo.ProcedureCategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/procedure_category")
@CrossOrigin
public class ProcedureCategoryController {
    private final ProcedureCategoryRepo procedureCategoryRepo;

    @Autowired
    public ProcedureCategoryController(ProcedureCategoryRepo procedureCategoryRepo) throws NoSuchAlgorithmException {
        this.procedureCategoryRepo = procedureCategoryRepo;
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody ProcedureCategory procedureCategory) {
        try {
            procedureCategoryRepo.findAll().stream().filter(user -> user.getName().equals(procedureCategory.getName())).filter(user -> user.getId().equals(procedureCategory.getId())).findFirst().get();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (NoSuchElementException e) {
            procedureCategoryRepo.save(procedureCategory);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }


    @GetMapping("{id}")
    public ResponseEntity<ProcedureCategory> getProduct(@PathVariable String id) {
        try {
            ProcedureCategory procedureCategory = procedureCategoryRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            return ResponseEntity.ok().body(procedureCategory);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProcedureCategory>> getAllProduct() {
        return ResponseEntity.ok().body(procedureCategoryRepo.findAll());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            ProcedureCategory procedureCategory = procedureCategoryRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            procedureCategoryRepo.delete(procedureCategory);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(@RequestBody ProcedureCategory procedureCategory, @PathVariable String id) {
        ProcedureCategory productBefore;
        try {
            productBefore = procedureCategoryRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            procedureCategory.setId(productBefore.getId());
            procedureCategoryRepo.save(procedureCategory);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
