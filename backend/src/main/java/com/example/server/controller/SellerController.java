package com.example.server.controller;

import com.example.server.model.Seller;
import com.example.server.repo.SellerRepo;
import com.example.server.service.AuthRequest;
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

    @PostMapping("signin/")
    public int signIn(@RequestBody AuthRequest reqSeller) {
        Seller realSeller;
        try {
            realSeller = sellerRepo.findAll().stream().filter(user -> user.getLogin().equals(reqSeller.getUsername())).findFirst().get();
            String reqPass = encryptPassword(reqSeller.getPassword());
            if (realSeller.getPassword().equals(reqPass)) return 200;
            else return 501;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }

    @PostMapping("signup/")
    public int signUp(@RequestBody Seller seller) {
        try {
            sellerRepo.findAll().stream().filter(user -> user.getLogin().equals(seller.getLogin())).findFirst().get();
            return 500;
        } catch (NoSuchElementException e) {
            seller.setPassword(encryptPassword(seller.getPassword()));
            sellerRepo.save(seller);
            return 200;
        }
    }

    @GetMapping("{id}")
    public Seller getSeller(@PathVariable String id) {
        return sellerRepo.findAll().stream().filter(user -> user.getId() == Integer.parseInt(id)).findFirst().get();
    }

    @DeleteMapping("{login}")
    public int delete(@PathVariable String login) {
        Seller seller;
        try {
            seller = sellerRepo.findAll().stream().filter(c -> c.getLogin().equals(login)).findFirst().get();
            sellerRepo.delete(seller);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }

    @PutMapping("{login}")
    public int update(@RequestBody Seller seller, @PathVariable String login) {
        Seller sellerBefore;
        try {
            sellerBefore = sellerRepo.findAll().stream().filter(c -> c.getLogin().equals(login)).findFirst().get();
            seller.setId(sellerBefore.getId());
            sellerRepo.save(seller);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
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
