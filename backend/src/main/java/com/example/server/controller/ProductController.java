package com.example.server.controller;

import com.example.server.model.Product;
import com.example.server.model.Item;
import com.example.server.model.ItemInOrder;
import com.example.server.repo.ItemRepo;
import com.example.server.repo.ProductRepo;
import com.example.server.repo.ItemInOrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/product")
@CrossOrigin
public class ProductController {
    private final ProductRepo productRepo;
    private final ItemRepo itemRepo;
    private final ItemInOrderRepo itemInOrderRepo;

    @Autowired
    public ProductController(ProductRepo productRepo, ItemRepo itemRepo, ItemInOrderRepo itemInOrderRepo) throws NoSuchAlgorithmException {
        this.productRepo = productRepo;
        this.itemRepo = itemRepo;
        this.itemInOrderRepo = itemInOrderRepo;
    }

    @PostMapping("create/")
    public ResponseEntity<Void> create(@RequestBody Product product) {
        try {
            productRepo.findAll().stream().filter(user -> user.getName().equals(product.getName())).filter(user -> user.getId_item().equals(product.getId_item())).findFirst().get();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (NoSuchElementException e) {
            productRepo.save(product);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }


    @GetMapping("{id}")
    public ResponseEntity<Product> getProduct(@PathVariable String id) {
        try {
            Product product = productRepo.findAll().stream().filter(user -> user.getId_item().equals(Long.parseLong(id))).findFirst().get();
            return ResponseEntity.ok().body(product);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("seller/{seller_id}")
    public ResponseEntity<List<Product>> getProductsBySeller(@PathVariable Long seller_id) {
        List<Product> list = productRepo.findAll().stream().filter(user -> user.getSeller_id() == seller_id).toList();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProduct() {
        return ResponseEntity.ok().body(productRepo.findAll());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            Product product = productRepo.findAll().stream().filter(user -> user.getId_item().equals(Long.parseLong(id))).findFirst().get();
            Item item = itemRepo.findAll().stream().filter(user -> user.getId().equals(Long.parseLong(id))).findFirst().get();
            List<ItemInOrder> itemInOrders = itemInOrderRepo.findAll().stream().filter(user -> user.getItemInOrderId().getItem_id().equals(Long.parseLong(id))).toList(); 
            for(ItemInOrder itemInOrder: itemInOrders)
                itemInOrderRepo.delete(itemInOrder);
            productRepo.delete(product);
            itemRepo.delete(item);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping("{id}")
    public ResponseEntity<Void> update(@RequestBody Product product, @PathVariable String id) {
        Product productBefore;
        try {
            productBefore = productRepo.findAll().stream().filter(user -> user.getId_item().equals(Long.parseLong(id))).findFirst().get();
            product.setId_item(productBefore.getId_item());
            productRepo.save(product);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
