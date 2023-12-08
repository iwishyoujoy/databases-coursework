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
    public String create(@RequestBody Appointment appointment) {
        String toSend = "";
        try {
            appointmentRepo.findAll().stream().filter(user -> user.getDate_time().equals(appointment.getDate_time())).filter(user -> user.getId().equals(appointment.getId())).findFirst().get();
            toSend = "Запись на эту процедуру в это время уже есть.";
        } catch (NoSuchElementException e) {
            appointmentRepo.save(appointment);
            toSend = "Запись создана.";
        }
        return toSend;
    }


    @GetMapping("{item_id}/{timestamp}")
    public Appointment getAppointment(@PathVariable String item_id, @PathVariable String timestamp) {
        String newtimestamp = timestamp.split("\"")[1] + ".0";
        try {
            return appointmentRepo.findAll().stream().filter(user -> user.getDate_time().toString().equals(newtimestamp)).filter(user -> user.getId() == Integer.parseInt(item_id)).findFirst().get();
        } catch (NoSuchElementException e) {
            return null;
        }
    }
    @GetMapping("/all")
    public List<Appointment> getAllAppointment() {
        return appointmentRepo.findAll();
    }

    @DeleteMapping()
    public String delete(@RequestBody Appointment appointment) {
        String toSend = "";
        try {
            appointmentRepo.delete(appointment);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Такой записи не существует.";
        }
        return toSend;
    }

    @PutMapping("{item_id}/{timestamp}")
    public String update(@RequestBody Appointment appointment, @PathVariable String item_id, @PathVariable String timestamp) {
        String toSend = "";
        String newtimestamp = timestamp.split("\"")[1] + ".0";
        Appointment appointmentBefore;
        try {
            appointmentBefore = appointmentRepo.findAll().stream().filter(user -> user.getDate_time().toString().equals(newtimestamp)).filter(user -> user.getId() == Integer.parseInt(item_id)).findFirst().get();
            appointment.setId(appointmentBefore.getId());
            appointmentRepo.save(appointment);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Такой записи не существует.";
        }
        return toSend;
    }

}
