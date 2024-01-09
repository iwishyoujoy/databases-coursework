package com.example.server.controller;

import com.example.server.model.*;
import com.example.server.repo.*;
import com.example.server.service.AuthRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/clinic")
@CrossOrigin
public class ClinicController {
    private final ClinicRepo clinicRepo;
    private final AppointmentRepo appointmentRepo;
    private final ProcedureRepo procedureRepo;
    private final ItemInOrderRepo itemInOrderRepo;
    private final MessageDigest md = MessageDigest.getInstance("SHA-512");

    @Autowired
    public ClinicController(ClinicRepo clinicRepo, AppointmentRepo appointmentRepo, ItemInOrderRepo itemInOrderRepo, ProcedureRepo procedureRepo) throws NoSuchAlgorithmException {
        this.clinicRepo = clinicRepo;
        this.appointmentRepo = appointmentRepo;
        this.itemInOrderRepo = itemInOrderRepo;
        this.procedureRepo = procedureRepo;
    }

    @PostMapping("signin/")
    public ResponseEntity<Void> signIn(@RequestBody AuthRequest reqClinic) {
        Clinic realClinic;
        try {
            realClinic = clinicRepo.findAll().stream().filter(user -> user.getLogin().equals(reqClinic.getLogin())).findFirst().get();
            String reqPass = encryptPassword(reqClinic.getPassword());
            if (realClinic.getPassword().equals(reqPass)) return ResponseEntity.status(HttpStatus.OK).build();
            else return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    @PostMapping("signup/")
    public ResponseEntity<Void> signUp(@RequestBody Clinic clinic) {
        try {
            clinicRepo.findAll().stream().filter(user -> user.getLogin().equals(clinic.getLogin())).findFirst().get();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (NoSuchElementException e) {
            clinic.setPassword(encryptPassword(clinic.getPassword()));
            clinicRepo.save(clinic);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }

    @GetMapping("{login}")
    public ResponseEntity<Clinic> getClinicBuLogin(@PathVariable String login) {
        try{
            Clinic clinic = clinicRepo.findAll().stream().filter(user -> user.getLogin().equals(login)).findFirst().get();
            return ResponseEntity.ok().body(clinic);
        } catch (NoSuchElementException e){
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("id/{id}")
    public ResponseEntity<Clinic> getClinicById(@PathVariable Long id) {
        try{
            Clinic clinic = clinicRepo.findAll().stream().filter(user -> user.getId().equals(id)).findFirst().get();
            return ResponseEntity.ok().body(clinic);
        } catch (NoSuchElementException e){
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("order/{id}")
    public ResponseEntity<Map<Long, List<ItemInOrder>>> getOrders(@PathVariable Long id) {
        try{
            List<Procedure> procedures = procedureRepo.findAll().stream().filter(user -> user.getClinic_id() == id).toList();
            List<Long> procedure_ids = new ArrayList<>();
            for(Procedure products : procedures){
                procedure_ids.add(products.getId());
            }
            
            List<Long> app_ids = new ArrayList<>();
            List<Appointment> appointments = appointmentRepo.findAll().stream().filter(user -> procedure_ids.contains(user.getProcedure_id())).toList();
            for(Appointment appointment : appointments)
                app_ids.add(appointment.getItem_id());
            List<ItemInOrder> itemInOrders = itemInOrderRepo.findAll().stream().filter(user -> app_ids.contains(user.getItemInOrderId().getItem_id())).toList();
            Map<Long, List<ItemInOrder>> groupedOrders = itemInOrders.stream().collect(Collectors.groupingBy(item -> item.getItemInOrderId().getOrder_id()));
            return ResponseEntity.ok().body(groupedOrders);
        } catch(NoSuchElementException e){
            return ResponseEntity.badRequest().body(null);
        }
    }


    @DeleteMapping("login/{login}")
    public ResponseEntity<Void> delete(@PathVariable String login) {
        Clinic clinic;
        try {
            clinic = clinicRepo.findAll().stream().filter(user -> user.getLogin().equals(login)).findFirst().get();
            clinicRepo.delete(clinic);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Clinic>> getAllClinic() {
        List<Clinic> clinics = clinicRepo.findAll();
        return ResponseEntity.ok().body(clinics);
    }

    @PutMapping("{login}")
    public ResponseEntity<Void> update(@RequestBody Clinic clinic, @PathVariable String login) {
        Clinic clinicBefore;
        try {
            clinicBefore = clinicRepo.findAll().stream().filter(user -> user.getLogin().equals(login)).findFirst().get();
            clinic.setId(clinicBefore.getId());
            clinic.setPassword(encryptPassword(clinic.getPassword()));
            clinicRepo.save(clinic);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String encryptPassword(final String password) {
        md.update(password.getBytes());
        byte[] byteBuffer = md.digest();
        StringBuilder strHexString = new StringBuilder();

        for (int i = 0; i < byteBuffer.length; i++) {
            String hex = Integer.toHexString(0xff & byteBuffer[i]);
            if (hex.length() == 1) {
                strHexString.append('0');
            }
            strHexString.append(hex);
        }
        return strHexString.toString();
    }
}
