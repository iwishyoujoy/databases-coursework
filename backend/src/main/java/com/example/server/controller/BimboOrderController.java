package com.example.server.controller;

import com.example.server.model.*;
import com.example.server.repo.*;
import com.example.server.service.BimboIdentifier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/order")
@CrossOrigin
public class BimboOrderController {
    private final BimboOrderRepo bimboOrderRepo;
    private final CustomerRepo customerRepo;
    private final ProductRepo productRepo;
    private final ProcedureRepo procedureRepo;
    private final AppointmentRepo appointmentRepo;
    private final ItemInOrderRepo itemInOrderRepo;
    private final ItemRepo itemRepo;

    @Autowired
    public BimboOrderController(BimboOrderRepo bimboOrderRepo, 
                                CustomerRepo customerRepo, 
                                ItemInOrderRepo itemInOrderRepo, 
                                ItemRepo itemRepo, 
                                ProductRepo productRepo,
                                ProcedureRepo procedureRepo,
                                AppointmentRepo appointmentRepo) throws NoSuchAlgorithmException {
        this.bimboOrderRepo = bimboOrderRepo;
        this.customerRepo = customerRepo;
        this.itemInOrderRepo = itemInOrderRepo;
        this.itemRepo = itemRepo;
        this.productRepo = productRepo;
        this.appointmentRepo = appointmentRepo;
        this.procedureRepo = procedureRepo;
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


    @GetMapping("login")
    public ResponseEntity<BimboOrder> getOrderByLoginAndTime(@RequestBody BimboIdentifier bimboIdentifier) throws ParseException {
        try {
            BimboOrder order = bimboOrderRepo.findAll().stream().filter(user -> user.getTimestamp().equals(bimboIdentifier.getTimestamp())).filter(user -> user.getCustomer_login().equals(bimboIdentifier.getLogin())).findFirst().get();
            return ResponseEntity.ok().body(order);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }




    @GetMapping("/check/{id}")
    public ResponseEntity<Double> getOrderCheck(@PathVariable Long id) {
        try {
            Double check = Double.valueOf(0);
            for (ItemInOrder itemInOrder : itemInOrderRepo.findAll())
                if (itemInOrder.getItemInOrderId().getOrder_id().equals(id)){
                    Item item = itemRepo.findAll().stream().filter(user -> user.getId() == itemInOrder.getItemInOrderId().getItem_id()).findFirst().get();
                    if(item.getType().equals("product")) 
                        check += productRepo.findAll().stream().filter(user -> user.getId_item().equals(item.getId())).findFirst().get().getPrice() * itemInOrder.getItemInOrderId().getCurrent_amount();
                    else {
                        Long procedure_id = appointmentRepo.findAll().stream().filter(user->user.getItem_id() == item.getId()).findFirst().get().getProcedure_id();
                        check += procedureRepo.findAll().stream().filter(user -> user.getId().equals(procedure_id)).findFirst().get().getPrice();
                    }
                }
            return ResponseEntity.ok().body(check);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/customer/{customer_login}")
    public ResponseEntity<List<BimboOrder>> getOrderOfCustomer(@PathVariable String customer_login) {
        try {
            Long customer_id = customerRepo.findAll().stream().filter(user -> user.getLogin().equals(customer_login)).findFirst().get().getId();
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
