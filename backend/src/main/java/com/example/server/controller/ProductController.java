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
    public String create(@RequestBody Product product) {
        String toSend = "";
        try {
            productRepo.findAll().stream().filter(user -> user.getName().equals(product.getName())).filter(user -> user.getId().equals(product.getId())).findFirst().get();
            toSend = "Такой продукт уже существует.";
        } catch (NoSuchElementException e) {
            productRepo.save(product);
            toSend = "Запись создана.";
        }
        return toSend;
    }


    @GetMapping("{id}")
    public Product getProduct(@PathVariable String id) {
        try {
            return productRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
        } catch (NoSuchElementException e) {
            return null;
        }
    }
    @GetMapping("/all")
    public List<Product> getAllProduct() {
        return productRepo.findAll();
    }

    @DeleteMapping("{id}")
    public String delete(@PathVariable String id) {
        String toSend = "";
        try {
            Product product = productRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            productRepo.delete(product);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Такого продукта не существует.";
        }
        return toSend;
    }

    @PutMapping("{id}")
    public String update(@RequestBody Product product, @PathVariable String id) {
        String toSend = "";
        Product productBefore;
        try {
            productBefore = productRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            product.setId(productBefore.getId());
            productRepo.save(product);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Такого продукта не существует.";
        }
        return toSend;
    }

}
