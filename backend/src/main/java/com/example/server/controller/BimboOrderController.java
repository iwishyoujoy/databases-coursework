package com.example.server.controller;

import com.example.server.model.BimboOrder;
import com.example.server.repo.BimboOrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("create/")
    public ResponseEntity<Void> create(@RequestBody BimboOrder bimboOrder) {
        try {
            bimboOrderRepo.findAll().stream().filter(user -> user.getTimestamp().equals(bimboOrder.getTimestamp())).filter(user -> user.getCustomer_id().equals(bimboOrder.getCustomer_id())).findFirst().get();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (NoSuchElementException e) {
            bimboOrderRepo.save(bimboOrder);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }


    @GetMapping("/one/{id}")
    public ResponseEntity<BimboOrder> getOrder(@PathVariable String id) {
        try {
            BimboOrder order = bimboOrderRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            return ResponseEntity.ok().body(order);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/customer/{customer_id}")
    public ResponseEntity<List<BimboOrder>> getOrderOfCustomer(@PathVariable Long customer_id) {
        try {
            List<BimboOrder> list = bimboOrderRepo.findAll();
            List<BimboOrder> to_ret = new ArrayList<>();
            for (BimboOrder fp : list) {
                if (fp.getCustomer_id().equals(customer_id)) {
                    to_ret.add(fp);
                }
            }
            return ResponseEntity.ok().body(to_ret);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<BimboOrder>> getAllOrder() {
        List<BimboOrder> bimboOrders = bimboOrderRepo.findAll();
        return ResponseEntity.ok().body(bimboOrders);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            BimboOrder bimboOrder = bimboOrderRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            bimboOrderRepo.delete(bimboOrder);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(@RequestBody BimboOrder bimboOrder, @PathVariable String id) {
        BimboOrder productBefore;
        try {
            productBefore = bimboOrderRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            bimboOrder.setId(productBefore.getId());
            bimboOrderRepo.save(bimboOrder);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
