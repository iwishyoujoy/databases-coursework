package com.example.server.controller;

import com.example.server.model.*;
import com.example.server.repo.*;
import com.example.server.service.ItemInOrderWithAmount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/item_in_order")
@CrossOrigin
public class ItemInOrderController {
    private final ItemInOrderRepo itemInOrderRepo;
    private final ItemRepo itemRepo;
    private final ProductRepo productRepo;
    private final AppointmentRepo appointmentRepo;

    @Autowired
    public ItemInOrderController(ItemInOrderRepo itemInOrderRepo, ItemRepo itemRepo, ProductRepo productRepo, AppointmentRepo appointmentRepo) throws NoSuchAlgorithmException {
        this.itemInOrderRepo = itemInOrderRepo;
        this.itemRepo = itemRepo;
        this.appointmentRepo = appointmentRepo;
        this.productRepo = productRepo;
    }

    @PostMapping("create/")
    public ResponseEntity<Void> create(@RequestBody itemInOrderId itemInOrderId) throws NoSuchAlgorithmException {
        try {
            itemInOrderRepo.findAll().stream().filter(user -> user.getItemInOrderId().getOrder_id().equals(itemInOrderId.getOrder_id())).filter(user -> user.getItemInOrderId().getItem_id().equals(itemInOrderId.getItem_id())).findFirst().get();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (NoSuchElementException e) {
            Item item = itemRepo.findAll().stream().filter(user -> user.getId().equals(itemInOrderId.getItem_id())).findFirst().get();
            if(item.getType().equals("product")){
                Product product = productRepo.findAll().stream().filter(user -> user.getId_item().equals(item.getId())).findFirst().get();
                int new_amount = product.getAmount_available();
                if(new_amount == 0) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
                new_amount-=itemInOrderId.getCurrent_amount();
                product.setAmount_available(new_amount);
                productRepo.save(product);
            } else {
                Appointment appointment = appointmentRepo.findAll().stream().filter(user -> user.getItem_id().equals(item.getId())).findFirst().get();
                appointment.setStatus(true);
                appointmentRepo.save(appointment);
            }
            ItemInOrder itemInOrder = new ItemInOrder(itemInOrderId);
            itemInOrderRepo.save(itemInOrder);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }


    //TODO: добавить статус
    @GetMapping("/all/{order_id}")
    public ResponseEntity<List<ItemInOrderWithAmount>> getItemOfOrder(@PathVariable Long order_id) {
        try {
            List<ItemInOrder> list = itemInOrderRepo.findAll();
            List<ItemInOrderWithAmount> to_ret = new ArrayList<>();
            for (ItemInOrder itemInOrder : list)
                if (itemInOrder.getItemInOrderId().getOrder_id().equals(order_id)){
                    Item item = itemRepo.findAll().stream().filter(user -> user.getId() == itemInOrder.getItemInOrderId().getItem_id()).findFirst().get();
                    ItemInOrderWithAmount itemInOrderWithAmount = new ItemInOrderWithAmount(itemInOrder.getItemInOrderId().getOrder_id(), itemInOrder.getItemInOrderId().getItem_id(), item.getType(), itemInOrder.getItemInOrderId().getCurrent_amount(), itemInOrder.getItemInOrderId().getStatus());
                    to_ret.add(itemInOrderWithAmount);
                }
            return ResponseEntity.ok().body(to_ret);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("{order_id}/{item_id}")
    public ResponseEntity<Void> delete(@PathVariable Long order_id, @PathVariable Long item_id) {
        try {
            ItemInOrder itemInOrder = itemInOrderRepo.findAll().stream().filter(user -> user.getItemInOrderId().getOrder_id().equals(order_id)).filter(user -> user.getItemInOrderId().getItem_id().equals(item_id)).findFirst().get();

            Item item = itemRepo.findAll().stream().filter(user -> user.getId().equals(item_id)).findFirst().get();
            if(item.getType().equals("product")){
                Product product = productRepo.findAll().stream().filter(user -> user.getId_item().equals(item_id)).findFirst().get();
                int new_amount = product.getAmount_available();
                new_amount+=itemInOrder.getItemInOrderId().getCurrent_amount();
                product.setAmount_available(new_amount);
                productRepo.save(product);
            }else{
                Appointment appointment = appointmentRepo.findAll().stream().filter(user -> user.getItem_id().equals(item.getId())).findFirst().get();
                appointment.setStatus(false);
                appointmentRepo.save(appointment);
            }
            itemInOrderRepo.delete(itemInOrder);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping("update/")
    public ResponseEntity<Void> update_amount(@RequestBody itemInOrderId itemInOrderId) throws NoSuchAlgorithmException {
        try {
            itemInOrderRepo.findAll().stream().filter(user -> user.getItemInOrderId().getOrder_id().equals(itemInOrderId.getOrder_id())).filter(user -> user.getItemInOrderId().getItem_id().equals(itemInOrderId.getItem_id())).findFirst().get();
            delete(itemInOrderId.getOrder_id(), itemInOrderId.getItem_id());
            create(itemInOrderId);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
