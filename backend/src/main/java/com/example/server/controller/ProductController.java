package com.example.server.controller;

import com.example.server.model.Product;
import com.example.server.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/product")
@CrossOrigin
public class ProductController {
    private final ProductRepo productRepo;

    @Autowired
    public ProductController(ProductRepo productRepo) throws NoSuchAlgorithmException {
        this.productRepo = productRepo;
    }

    @PostMapping
    public int create(@RequestBody Product product) {
        try {
            productRepo.findAll().stream().filter(user -> user.getName().equals(product.getName())).filter(user -> user.getId_item().equals(product.getId_item())).findFirst().get();
            return 500;
        } catch (NoSuchElementException e) {
            productRepo.save(product);
            return 200;
        }
    }


    @GetMapping("{id}")
    public Product getProduct(@PathVariable String id) {
        try {
            return productRepo.findAll().stream().filter(user -> user.getId_item() == Long.parseLong(id)).findFirst().get();
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    @GetMapping("/all")
    public List<Product> getAllProduct() {
        return productRepo.findAll();
    }

    @DeleteMapping("{id}")
    public int delete(@PathVariable String id) {
        try {
            Product product = productRepo.findAll().stream().filter(user -> user.getId_item() == Long.parseLong(id)).findFirst().get();
            productRepo.delete(product);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }

    @PutMapping("{id}")
    public int update(@RequestBody Product product, @PathVariable String id) {
        Product productBefore;
        try {
            productBefore = productRepo.findAll().stream().filter(user -> user.getId_item() == Long.parseLong(id)).findFirst().get();
            product.setId_item(productBefore.getId_item());
            productRepo.save(product);
            return 200;
        } catch (NoSuchElementException e) {
            return 500;
        }
    }

}
