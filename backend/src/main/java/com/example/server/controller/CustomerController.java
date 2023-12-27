package com.example.server.controller;

import com.example.server.model.Customer;
import com.example.server.repo.CustomerRepo;
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
@RequestMapping("api/customer")
@CrossOrigin
public class CustomerController {
    private final CustomerRepo customerRepo;
    private final MessageDigest md = MessageDigest.getInstance("SHA-512");

    @Autowired
    public CustomerController(CustomerRepo customerRepo) throws NoSuchAlgorithmException {
        this.customerRepo = customerRepo;
    }

    @PostMapping("signin/")
    public ResponseEntity<Void> signIn(@RequestBody AuthRequest reqCustomer) {
        Customer realCustomer;
        try {
            realCustomer = customerRepo.findAll().stream().filter(user -> user.getLogin().equals(reqCustomer.getLogin())).findFirst().get();
            String reqPass = encryptPassword(reqCustomer.getPassword());
            if (realCustomer.getPassword().equals(reqPass)) return ResponseEntity.status(HttpStatus.OK).build();
            else return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @PostMapping("signup/")
    public ResponseEntity<Void> signUp(@RequestBody Customer customer) {
        try {
            customerRepo.findAll().stream().filter(user -> user.getLogin().equals(customer.getLogin())).findFirst().get();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (NoSuchElementException e) {
            customer.setPassword(encryptPassword(customer.getPassword()));
            customerRepo.save(customer);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }

    @GetMapping("{login}")
    public ResponseEntity<Customer> getCustomer(@PathVariable String login) {
        try{
            Customer customer = customerRepo.findAll().stream().filter(user -> user.getLogin().equals(login)).findFirst().get();
            return ResponseEntity.ok().body(customer);
        } catch(NoSuchElementException e){
            return ResponseEntity.badRequest().body(null);
        }
    }
    @DeleteMapping("{login}")
    public ResponseEntity<Void> delete(@PathVariable String login){
        Customer customer;
        try {
            customer = customerRepo.findAll().stream().filter(user -> user.getLogin().equals(login)).findFirst().get();
            customerRepo.delete(customer);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("{login}")
    public ResponseEntity<Void> update(@RequestBody Customer customer, @PathVariable String login) {
        Customer customerBefore;
        try {
            customerBefore = customerRepo.findAll().stream().filter(user -> user.getLogin().equals(login)).findFirst().get();
            customer.setId(customerBefore.getId());
            customer.setPassword(encryptPassword(customer.getPassword()));
            customerRepo.save(customer);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Customer>> getAllCustomer() {
        return ResponseEntity.ok().body(customerRepo.findAll());
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
