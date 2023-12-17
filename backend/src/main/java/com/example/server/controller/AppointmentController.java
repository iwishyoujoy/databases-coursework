package com.example.server.controller;

import com.example.server.model.Appointment;
import com.example.server.repo.AppointmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/appointment")
@CrossOrigin
public class AppointmentController {
    private final AppointmentRepo appointmentRepo;

    @Autowired
    public AppointmentController(AppointmentRepo appointmentRepo) throws NoSuchAlgorithmException {
        this.appointmentRepo = appointmentRepo;
    }

    @PostMapping
    public int create(@RequestBody Appointment appointment) {
        try {
            appointmentRepo.findAll().stream().filter(user -> user.getDate_time().equals(appointment.getDate_time())).filter(user -> user.getItem_id().equals(appointment.getItem_id())).findFirst().get();
            return 500;
        } catch (NoSuchElementException e) {
            appointmentRepo.save(appointment);
            return 200;
        }
    }


    @GetMapping("{item_id}/{timestamp}")
    public Appointment getAppointment(@PathVariable String item_id, @PathVariable String timestamp) {
        String newtimestamp = timestamp.split("\"")[1] + ".0";
        try {
            return appointmentRepo.findAll().stream().filter(user -> user.getDate_time().toString().equals(newtimestamp)).filter(user -> user.getItem_id() == Integer.parseInt(item_id)).findFirst().get();
        } catch (NoSuchElementException e) {
            return null;
        }
    }
    @GetMapping("/all")
    public List<Appointment> getAllAppointment() {
        return appointmentRepo.findAll();
    }

    @DeleteMapping("{item_id}/{timestamp}")
    public int delete(@PathVariable String item_id, @PathVariable String timestamp) {
        try {
            Appointment appointment = appointmentRepo.findAll().stream().filter(user -> user.getDate_time().toString().equals(timestamp)).filter(user -> user.getItem_id() == Integer.parseInt(item_id)).findFirst().get();
            appointmentRepo.delete(appointment);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }

    @PutMapping("{item_id}/{timestamp}")
    public int update(@RequestBody Appointment appointment, @PathVariable String item_id, @PathVariable String timestamp) {
        String newtimestamp = timestamp.split("\"")[1] + ".0";
        Appointment appointmentBefore;
        try {
            appointmentBefore = appointmentRepo.findAll().stream().filter(user -> user.getDate_time().toString().equals(newtimestamp)).filter(user -> user.getItem_id() == Integer.parseInt(item_id)).findFirst().get();
            appointment.setItem_id(appointmentBefore.getItem_id());
            appointmentRepo.save(appointment);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }

}
