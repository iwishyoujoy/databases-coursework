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
    public String create(@RequestBody Procedure procedure) {
        String toSend = "";
        try {
            procedureRepo.findAll().stream().filter(user -> user.getName().equals(procedure.getName())).filter(user -> user.getId().equals(procedure.getId())).findFirst().get();
            toSend = "Такая процедура уже существует.";
        } catch (NoSuchElementException e) {
            procedureRepo.save(procedure);
            toSend = "Процедура создана.";
        }
        return toSend;
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
    public String delete(@PathVariable String id) {
        String toSend = "";
        try {
            Procedure procedure = procedureRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            procedureRepo.delete(procedure);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Такая процедура не существует.";
        }
        return toSend;
    }

    @PutMapping("{id}")
    public String update(@RequestBody Procedure procedure, @PathVariable String id) {
        String toSend = "";
        Procedure procedureBefore;
        try {
            procedureBefore = procedureRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            procedure.setId(procedureBefore.getId());
            procedureRepo.save(procedure);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Такая процедура не существует.";
        }
        return toSend;
    }
}
