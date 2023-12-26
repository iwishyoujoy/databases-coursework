package com.example.server.controller;

import com.example.server.model.Appointment;
import com.example.server.model.Item;
import com.example.server.repo.AppointmentRepo;
import com.example.server.repo.ItemRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/appointment")
@CrossOrigin
public class AppointmentController {
    private final AppointmentRepo appointmentRepo;
    private final ItemRepo itemRepo;

    @Autowired
    public AppointmentController(AppointmentRepo appointmentRepo, ItemRepo itemRepo) throws NoSuchAlgorithmException {
        this.appointmentRepo = appointmentRepo;
        this.itemRepo = itemRepo;
    }

    @PostMapping("create/")
    public ResponseEntity<Void> create(@RequestBody Appointment appointment) {
        try {
            appointmentRepo.findAll().stream().filter(user -> user.getDate_time().equals(appointment.getDate_time())).filter(user -> user.getItem_id().equals(appointment.getItem_id())).findFirst().get();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (NoSuchElementException e) {
            appointmentRepo.save(appointment);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }


    @GetMapping("{item_id}/{timestamp}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable String item_id, @PathVariable String timestamp) {
        String newtimestamp = timestamp.split("\"")[1] + ".0";
        try {
            Appointment appointment = appointmentRepo.findAll().stream().filter(user -> user.getDate_time().toString().equals(newtimestamp)).filter(user -> user.getItem_id() == Integer.parseInt(item_id)).findFirst().get();
            return ResponseEntity.ok().body(appointment);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointment() {
        List<Appointment> appointments = appointmentRepo.findAll();
        return ResponseEntity.ok().body(appointments);    
        
    }

    @DeleteMapping("{item_id}")
    public ResponseEntity<Void> delete(@PathVariable String item_id) {
        try {
            Appointment appointment = appointmentRepo.findById(Long.parseLong(item_id));
            Item item = itemRepo.findById((Long.parseLong(item_id)));
            appointmentRepo.delete(appointment);
            itemRepo.delete(item);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("{item_id}")
    public ResponseEntity<Void> update(@RequestBody Appointment appointment, @PathVariable String item_id) {
        Appointment appointmentBefore;
        try {
            appointmentBefore = appointmentRepo.findById(Long.parseLong(item_id));
            appointment.setItem_id(appointmentBefore.getItem_id());
            appointmentRepo.save(appointment);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



}
