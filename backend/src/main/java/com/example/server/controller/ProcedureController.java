package com.example.server.controller;

import com.example.server.model.Procedure;
import com.example.server.repo.ProcedureRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("create/")
    public ResponseEntity<Void> create(@RequestBody Procedure procedure) {
        try {
            procedureRepo.findAll().stream().filter(user -> user.getName().equals(procedure.getName())).filter(user -> user.getId().equals(procedure.getId())).findFirst().get();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (NoSuchElementException e) {
            procedureRepo.save(procedure);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }


    @GetMapping("{id}")
    public ResponseEntity<Procedure> getProcedure(@PathVariable String id) {
        try {
            Procedure procedure = procedureRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            return ResponseEntity.ok().body(procedure);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Procedure>> getAllProcedure() {
        return ResponseEntity.ok().body(procedureRepo.findAll());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            Procedure procedure = procedureRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            procedureRepo.delete(procedure);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(@RequestBody Procedure procedure, @PathVariable String id) {
        Procedure procedureBefore;
        try {
            procedureBefore = procedureRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            procedure.setId(procedureBefore.getId());
            procedureRepo.save(procedure);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
