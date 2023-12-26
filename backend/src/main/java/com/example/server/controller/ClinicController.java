package com.example.server.controller;

import com.example.server.model.Clinic;
import com.example.server.repo.ClinicRepo;
import com.example.server.service.AuthRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/clinic")
@CrossOrigin
public class ClinicController {
    private final ClinicRepo clinicRepo;
    private final MessageDigest md = MessageDigest.getInstance("SHA-512");

    @Autowired
    public ClinicController(ClinicRepo clinicRepo) throws NoSuchAlgorithmException {
        this.clinicRepo = clinicRepo;
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

    @GetMapping("{id}")
    public ResponseEntity<Clinic> getClinic(@PathVariable String id) {
        try{
            Clinic clinic = clinicRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            return ResponseEntity.ok().body(clinic);
        } catch (NoSuchElementException e){
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("{login}")
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
