package com.example.server.controller;

import com.example.server.model.BimboOrder;
import com.example.server.repo.BimboOrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/order")
@CrossOrigin
public class BimboOrderController {
    private final BimboOrderRepo bimboOrderRepo;

    @Autowired
    public BimboOrderController(BimboOrderRepo bimboOrderRepo) throws NoSuchAlgorithmException {
        this.bimboOrderRepo = bimboOrderRepo;
    }

    @PostMapping
    public int create(@RequestBody BimboOrder bimboOrder) {
        try {
            bimboOrderRepo.findAll().stream().filter(user -> user.getTimestamp().equals(bimboOrder.getTimestamp())).filter(user -> user.getCustomer_id().equals(bimboOrder.getCustomer_id())).findFirst().get();
            return 500;
        } catch (NoSuchElementException e) {
            bimboOrderRepo.save(bimboOrder);
            return 200;
        }
    }


    @GetMapping("/one/{id}")
    public BimboOrder getOrder(@PathVariable String id) {
        try {
            return bimboOrderRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    @GetMapping("/customer/{customer_id}")
    public List<BimboOrder> getOrderOfCustomer(@PathVariable Long customer_id) {
        try {
            List<BimboOrder> list = bimboOrderRepo.findAll();
            List<BimboOrder> to_ret = new ArrayList<>();
            for (BimboOrder fp : list) {
                if (fp.getCustomer_id().equals(customer_id)) {
                    to_ret.add(fp);
                }
            }
            return to_ret;
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    @GetMapping("/all")
    public List<BimboOrder> getAllOrder() {
        return bimboOrderRepo.findAll();
    }

    @DeleteMapping("{id}")
    public int delete(@PathVariable String id) {
        try {
            BimboOrder bimboOrder = bimboOrderRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            bimboOrderRepo.delete(bimboOrder);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }

    @PutMapping("{id}")
    public int update(@RequestBody BimboOrder bimboOrder, @PathVariable String id) {
        BimboOrder productBefore;
        try {
            productBefore = bimboOrderRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            bimboOrder.setId(productBefore.getId());
            bimboOrderRepo.save(bimboOrder);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }

}
