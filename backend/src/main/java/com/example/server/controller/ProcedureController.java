package com.example.server.controller;

import com.example.server.model.Procedure;
import com.example.server.repo.ProcedureRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/procedure")
@CrossOrigin
public class ProcedureController {
    private final ProcedureRepo procedureRepo;

    @Autowired
    public ProcedureController(ProcedureRepo procedureRepo) throws NoSuchAlgorithmException {
        this.procedureRepo = procedureRepo;
    }

    @PostMapping
    public int create(@RequestBody Procedure procedure) {
        try {
            procedureRepo.findAll().stream().filter(user -> user.getName().equals(procedure.getName())).filter(user -> user.getId().equals(procedure.getId())).findFirst().get();
            return 500;
        } catch (NoSuchElementException e) {
            procedureRepo.save(procedure);
            return 200;
        }
    }


    @GetMapping("{id}")
    public Procedure getProcedure(@PathVariable String id) {
        try {
            return procedureRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    @GetMapping("/all")
    public List<Procedure> getAllProcedure() {
        return procedureRepo.findAll();
    }

    @DeleteMapping("{id}")
    public int delete(@PathVariable String id) {
        try {
            Procedure procedure = procedureRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            procedureRepo.delete(procedure);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }

    @PutMapping("{id}")
    public int update(@RequestBody Procedure procedure, @PathVariable String id) {
        Procedure procedureBefore;
        try {
            procedureBefore = procedureRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            procedure.setId(procedureBefore.getId());
            procedureRepo.save(procedure);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }
}
