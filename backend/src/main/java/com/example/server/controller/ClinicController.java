package com.example.server.controller;

import com.example.server.model.Clinic;
import com.example.server.repo.ClinicRepo;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("{login}")
    public String signIn(@RequestBody Clinic reqClinic, @PathVariable String login) {
        Clinic realClinic;
        String toSend = "";
        try {
            realClinic = clinicRepo.findAll().stream().filter(user -> user.getLogin().equals(login)).findFirst().get();
            String reqPass = encryptPassword(reqClinic.getPassword());
            if (realClinic.getPassword().equals(reqPass)) toSend = "pass";
            else toSend = "Неправильный пароль.";
        } catch (NoSuchElementException e) {
            toSend = "Пользователя с таким логином не существует.";
        }
        return toSend;

    }
    @PostMapping
    public String signUp(@RequestBody Clinic clinic) {
        String toSend = "";
        try {
            clinicRepo.findAll().stream().filter(user -> user.getLogin().equals(clinic.getLogin())).findFirst().get();
            toSend = "Пользователь с таким логином уже существует.";
        } catch (NoSuchElementException e) {
            clinic.setPassword(encryptPassword(clinic.getPassword()));
            clinicRepo.save(clinic);
            toSend = "Вы успешно зарегистрированы. Войдите в свой аккаунт.";
        }
        return toSend;
    }

    //проверила работу сервера
    @GetMapping("{id}")
    public Clinic getClinic(@PathVariable String id) {
        return clinicRepo.findAll().stream().filter(user -> user.getId() == Integer.parseInt(id)).findFirst().get();
    }

    @DeleteMapping("{login}")
    public String delete(@PathVariable String login){
        String toSend = "";
        Clinic clinic;
        try {
            clinic = clinicRepo.findAll().stream().filter(c -> c.getLogin().equals(login)).findFirst().get();
            clinicRepo.delete(clinic);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Клиники с таким логином не существует.";
        }
        return toSend;
    }

    @GetMapping("/all")
    public List<Clinic> getAllClinic() {
        return clinicRepo.findAll();
    }

    @PutMapping("{login}")
    public String update(@RequestBody Clinic clinic, @PathVariable String login) {
        String toSend = "";
        Clinic clinicBefore;
        try {
            clinicBefore = clinicRepo.findAll().stream().filter(c -> c.getLogin().equals(login)).findFirst().get();
            clinic.setId(clinicBefore.getId());
            clinicRepo.save(clinic);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Клиники с таким логином не существует.";
        }
        return toSend;
    }
    private String encryptPassword(final String password){
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
