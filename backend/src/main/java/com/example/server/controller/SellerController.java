package com.example.server.controller;

import com.example.server.model.Seller;
import com.example.server.repo.SellerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/seller")
@CrossOrigin
public class SellerController {

    private final SellerRepo sellerRepo;
    private final MessageDigest md = MessageDigest.getInstance("SHA-512");

    @Autowired
    public SellerController(SellerRepo sellerRepo) throws NoSuchAlgorithmException {
        this.sellerRepo = sellerRepo;
    }

    @PostMapping("{login}")
    public String signIn(@RequestBody Seller reqSeller, @PathVariable String login) {
        Seller realSeller;
        String toSend = "";
        try {
            realSeller = sellerRepo.findAll().stream().filter(user -> user.getLogin().equals(login)).findFirst().get();
            String reqPass = encryptPassword(reqSeller.getPassword());
            if (realSeller.getPassword().equals(reqPass)) toSend = "pass";
            else toSend = "Неправильный пароль.";
        } catch (NoSuchElementException e) {
            toSend = "Пользователя с таким логином не существует.";
        }
        return toSend;
    }
    @PostMapping
    public String signUp(@RequestBody Seller seller) {
        String toSend = "";
        try {
            sellerRepo.findAll().stream().filter(user -> user.getLogin().equals(seller.getLogin())).findFirst().get();
            toSend = "Пользователь с таким логином уже существует.";
        } catch (NoSuchElementException e) {
            seller.setPassword(encryptPassword(seller.getPassword()));
            sellerRepo.save(seller);
            toSend = "Вы успешно зарегистрированы. Войдите в свой аккаунт.";
        }
        return toSend;
    }

    @GetMapping("{id}")
    public Seller getSeller(@PathVariable String id) {
        return sellerRepo.findAll().stream().filter(user -> user.getId() == Integer.parseInt(id)).findFirst().get();
    }
    @DeleteMapping("{login}")
    public String delete(@PathVariable String login){
        String toSend = "";
        Seller seller;
        try {
            seller = sellerRepo.findAll().stream().filter(c -> c.getLogin().equals(login)).findFirst().get();
            sellerRepo.delete(seller);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Продавца с таким логином не существует.";
        }
        return toSend;
    }

    @PutMapping("{login}")
    public String update(@RequestBody Seller seller, @PathVariable String login) {
        String toSend = "";
        Seller sellerBefore;
        try {
            sellerBefore = sellerRepo.findAll().stream().filter(c -> c.getLogin().equals(login)).findFirst().get();
            seller.setId(sellerBefore.getId());
            sellerRepo.save(seller);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Пользователя с таким логином не существует.";
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
