package com.example.server.controller;

import com.example.server.model.Seller;
import com.example.server.repo.SellerRepo;
import com.example.server.service.AuthRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    //TODO: не работает
    @PostMapping("signin/")
    public ResponseEntity<Void> signIn(@RequestBody AuthRequest reqSeller) {
        Seller realSeller;
        try {
            realSeller = sellerRepo.findAll().stream().filter(user -> user.getLogin().equals(reqSeller.getLogin())).findFirst().get();
            String reqPass = encryptPassword(reqSeller.getPassword());
            if (realSeller.getPassword().equals(reqPass)) return ResponseEntity.status(HttpStatus.OK).build();
            else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("signup/")
    public ResponseEntity<Void> signUp(@RequestBody Seller seller) {
        try {
            sellerRepo.findAll().stream().filter(user -> user.getLogin().equals(seller.getLogin())).findFirst().get();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (NoSuchElementException e) {
            seller.setPassword(encryptPassword(seller.getPassword()));
            sellerRepo.save(seller);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }

    @GetMapping("{id}")
    public ResponseEntity<Seller> getSeller(@PathVariable String id) {
        try{
            Seller seller = sellerRepo.findAll().stream().filter(user -> user.getId().equals(Long.parseLong(id))).findFirst().get();
            return ResponseEntity.ok().body(seller);
        } catch(NoSuchElementException e){
            return ResponseEntity.badRequest().body(null);
        }

    }

    @DeleteMapping("{login}")
    public ResponseEntity<Void> delete(@PathVariable String login) {
        Seller seller;
        try {
            seller = sellerRepo.findAll().stream().filter(user -> user.getLogin().equals(login)).findFirst().get();
            sellerRepo.delete(seller);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("{login}")
    public ResponseEntity<Void> update(@RequestBody Seller seller, @PathVariable String login) {
        Seller sellerBefore;
        try {
            sellerBefore = sellerRepo.findAll().stream().filter(user -> user.getLogin().equals(login)).findFirst().get();
            seller.setId(sellerBefore.getId());
            seller.setPassword(encryptPassword(seller.getPassword()));
            sellerRepo.save(seller);
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
