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
    public String create(@RequestBody ProcedureCategory procedureCategory) {
        String toSend = "";
        try {
            procedureCategoryRepo.findAll().stream().filter(user -> user.getName().equals(procedureCategory.getName())).filter(user -> user.getId().equals(procedureCategory.getId())).findFirst().get();
            toSend = "Такая категория процедур уже существует.";
        } catch (NoSuchElementException e) {
            procedureCategoryRepo.save(procedureCategory);
            toSend = "Категория создана.";
        }
        return toSend;
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
    public String delete(@PathVariable String id) {
        String toSend = "";
        try {
            ProcedureCategory procedureCategory = procedureCategoryRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            procedureCategoryRepo.delete(procedureCategory);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Такой категории не существует.";
        }
        return toSend;
    }

    @PutMapping("{id}")
    public String update(@RequestBody ProcedureCategory procedureCategory, @PathVariable String id) {
        String toSend = "";
        ProcedureCategory productBefore;
        try {
            productBefore = procedureCategoryRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            procedureCategory.setId(productBefore.getId());
            procedureCategoryRepo.save(procedureCategory);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Такой категории не существует.";
        }
        return toSend;
    }

}
