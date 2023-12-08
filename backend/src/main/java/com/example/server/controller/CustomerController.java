package com.example.server.controller;

import com.example.server.model.Customer;
import com.example.server.repo.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("{login}")
    public String signIn(@RequestBody Customer reqCustomer, @PathVariable String login) {
        Customer realCustomer;
        String toSend = "";
        try {
            realCustomer = customerRepo.findAll().stream().filter(customer -> customer.getLogin().equals(login)).findFirst().get();
            String reqPass = encryptPassword(reqCustomer.getPassword());
            if (realCustomer.getPassword().equals(reqPass)) toSend = "pass";
            else toSend = "Неправильный пароль.";
        } catch (NoSuchElementException e) {
            toSend = "Пользователя с таким логином не существует.";
        }
        return toSend;
    }
    @PostMapping
    public String signUp(@RequestBody Customer customer) {
        String toSend = "";
        try {
            customerRepo.findAll().stream().filter(user -> user.getLogin().equals(customer.getLogin())).findFirst().get();
            toSend = "Пользователь с таким логином уже существует.";
        } catch (NoSuchElementException e) {
            customer.setPassword(encryptPassword(customer.getPassword()));
            customerRepo.save(customer);
            toSend = "Вы успешно зарегистрированы. Войдите в свой аккаунт.";
        }
        return toSend;
    }

    @GetMapping("{id}")
    public Customer getCustomer(@PathVariable String id) {
        return customerRepo.findAll().stream().filter(user -> user.getId() == Integer.parseInt(id)).findFirst().get();
    }
    @DeleteMapping("{login}")
    public String delete(@PathVariable String login){
        String toSend = "";
        Customer customer;
        try {
            customer = customerRepo.findAll().stream().filter(c -> c.getLogin().equals(login)).findFirst().get();
            customerRepo.delete(customer);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Пользователя с таким логином не существует.";
        }
        return toSend;
    }

    @PutMapping("{login}")
    public String update(@RequestBody Customer customer, @PathVariable String login) {
        String toSend = "";
        Customer customerBefore;
        try {
            customerBefore = customerRepo.findAll().stream().filter(c -> c.getLogin().equals(login)).findFirst().get();
            customer.setId(customerBefore.getId());
            customerRepo.save(customer);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Пользователя с таким логином не существует.";
        }
        return toSend;
    }

    @GetMapping("/all")
    public List<Customer> getAllCustomer() {
        return customerRepo.findAll();
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
