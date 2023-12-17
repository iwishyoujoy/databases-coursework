package com.example.server.controller;

import com.example.server.model.ProcedureCategory;
import com.example.server.repo.ProcedureCategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
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
    public int create(@RequestBody ProcedureCategory procedureCategory) {
        try {
            procedureCategoryRepo.findAll().stream().filter(user -> user.getName().equals(procedureCategory.getName())).filter(user -> user.getId().equals(procedureCategory.getId())).findFirst().get();
            return 500;
        } catch (NoSuchElementException e) {
            procedureCategoryRepo.save(procedureCategory);
            return 200;
        }
    }


    @GetMapping("{id}")
    public ProcedureCategory getProduct(@PathVariable String id) {
        try {
            return procedureCategoryRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    @GetMapping("/all")
    public List<ProcedureCategory> getAllProduct() {
        return procedureCategoryRepo.findAll();
    }

    @DeleteMapping("{id}")
    public int delete(@PathVariable String id) {
        try {
            ProcedureCategory procedureCategory = procedureCategoryRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            procedureCategoryRepo.delete(procedureCategory);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }

    @PutMapping("{id}")
    public int update(@RequestBody ProcedureCategory procedureCategory, @PathVariable String id) {
        ProcedureCategory productBefore;
        try {
            productBefore = procedureCategoryRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            procedureCategory.setId(productBefore.getId());
            procedureCategoryRepo.save(procedureCategory);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }

}
