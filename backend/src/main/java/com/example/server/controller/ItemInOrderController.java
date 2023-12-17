package com.example.server.controller;

import com.example.server.model.*;
import com.example.server.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping
    public int create(@RequestBody ItemInOrder itemInOrder) throws NoSuchAlgorithmException {
        try {
            itemInOrderRepo.findAll().stream().filter(user -> user.getItemId().equals(itemInOrder.getItemId())).filter(user -> user.getCurrent_amount().equals(itemInOrder.getCurrent_amount())).findFirst().get();
            return 500;
        } catch (NoSuchElementException e) {
            itemInOrderRepo.save(itemInOrder);
            Item item = itemRepo.findAll().stream().filter(user -> user.getId().equals(itemInOrder.getItemId().getItem_id())).findFirst().get();
            if(item.getType().equals("Appointment")){
                Product product = productRepo.findAll().stream().filter(user -> user.getId_item().equals(item.getId())).findFirst().get();
                int new_amount = product.getAmount_available();
                new_amount--;
                product.setAmount_available(new_amount);
                productRepo.save(product);
            }else{
                Appointment appointment = appointmentRepo.findAll().stream().filter(user -> user.getItem_id().equals(item.getId())).findFirst().get();
                AppointmentController appointmentController = new AppointmentController(appointmentRepo);
                appointmentController.create(appointment);
            }
            return 200;
        }
    }

    @GetMapping("/all/{order_id}")
    public List<ItemInOrder> getItemOfOrder(@PathVariable Long order_id) {
        try {
            List<ItemInOrder> list = itemInOrderRepo.findAll();
            List<ItemInOrder> to_ret = new ArrayList<>();
            for (ItemInOrder itemInOrder : list)
                if (itemInOrder.getItemId().getOrder_id().equals(order_id))
                    to_ret.add(itemInOrder);
            return to_ret;
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    @DeleteMapping("{order_id}/{item_id}")
    public int delete(@PathVariable Long order_id, @PathVariable Long item_id) {
        try {
            ItemInOrder itemInOrder = itemInOrderRepo
                    .findAll()
                    .stream()
                    .filter(user -> user.getItemId().getOrder_id()
                            .equals(order_id))
                    .filter(user -> user.getItemId().getItem_id().
                            equals(item_id))
                    .findFirst()
                    .get();

            Item item = itemRepo.findAll().stream().filter(user -> user.getId().equals(itemInOrder.getItemId().getItem_id())).findFirst().get();
            if(item.getType().equals("Appointment")){
                Product product = productRepo.findAll().stream().filter(user -> user.getId_item().equals(item.getId())).findFirst().get();
                int new_amount = product.getAmount_available();
                new_amount++;
                product.setAmount_available(new_amount);
                productRepo.save(product);
            }else{
                Appointment appointment = appointmentRepo.findAll().stream().filter(user -> user.getItem_id().equals(item.getId())).findFirst().get();
                AppointmentController appointmentController = new AppointmentController(appointmentRepo);
                appointmentController.delete(appointment.getItem_id().toString(), appointment.getDate_time().toString());
            }
            itemInOrderRepo.delete(itemInOrder);
            return 200;
        } catch (NoSuchElementException | NoSuchAlgorithmException e) {
            return 500;
        }
    }


}
