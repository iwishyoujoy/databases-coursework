package com.example.server.controller;

import com.example.server.model.Procedure;
import com.example.server.model.Appointment;
import com.example.server.model.ItemInOrder;
import com.example.server.model.Item;
import com.example.server.repo.ProcedureRepo;
import com.example.server.repo.AppointmentRepo;
import com.example.server.repo.ItemInOrderRepo;
import com.example.server.repo.ItemRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.ArrayList;

@RestController
@RequestMapping("api/procedure")
@CrossOrigin
public class ProcedureController {
    private final ProcedureRepo procedureRepo;
    private final AppointmentRepo appointmentRepo;
    private final ItemInOrderRepo itemInOrderRepo;
    private final ItemRepo itemRepo;

    @Autowired
    public ProcedureController(ProcedureRepo procedureRepo, AppointmentRepo appointmentRepo, ItemInOrderRepo itemInOrderRepo, ItemRepo itemRepo) throws NoSuchAlgorithmException {
        this.procedureRepo = procedureRepo;
        this.appointmentRepo = appointmentRepo;
        this.itemInOrderRepo = itemInOrderRepo;
        this.itemRepo = itemRepo;
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

    @GetMapping("/{id}/appointments")
    public ResponseEntity<List<Appointment>> getAllProductsByCategory(@PathVariable Long id) {
        List<Appointment> list = appointmentRepo.findAll().stream().filter(user -> user.getProcedure_id() == id).toList();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("clinic/{seller_id}")
    public ResponseEntity<List<Procedure>> getProductsBySeller(@PathVariable Long seller_id) {
        List<Procedure> list = procedureRepo.findAll().stream().filter(user -> user.getClinic_id() == seller_id).toList();
        return ResponseEntity.ok().body(list);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            Procedure procedure = procedureRepo.findAll().stream().filter(user -> user.getId() == id).findFirst().get();
            List<Appointment> appointments = appointmentRepo.findAll().stream().filter(user -> user.getProcedure_id().equals(id)).toList();
            List<Long> appointmentsIds = new ArrayList<>();
            for(Appointment appointment : appointments)
                appointmentsIds.add(appointment.getItem_id());
            List<ItemInOrder> itemInOrders = itemInOrderRepo.findAll().stream().filter(user -> appointmentsIds.contains(user.getItemInOrderId().getItem_id())).toList(); 
            List<Item> items = itemRepo.findAll().stream().filter(user -> appointmentsIds.contains(user.getId())).toList();
            for(ItemInOrder itemInOrder: itemInOrders)
                itemInOrderRepo.delete(itemInOrder);
            for(int i = 0; i<appointments.size(); i++){
                appointmentRepo.delete(appointments.get(i));
                itemRepo.delete(items.get(i));
            }
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
