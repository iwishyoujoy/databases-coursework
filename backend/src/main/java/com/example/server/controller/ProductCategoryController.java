package com.example.server.controller;

import com.example.server.model.ProductCategory;
import com.example.server.repo.ProductCategoryRepo;
import com.example.server.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/product_category")
@CrossOrigin
public class ProductCategoryController {
    private final ProductCategoryRepo productCategoryRepo;

    @Autowired
    public ProductCategoryController(ProductCategoryRepo productCategoryRepo) throws NoSuchAlgorithmException {
        this.productCategoryRepo = productCategoryRepo;
    }

    @PostMapping
    public int create(@RequestBody ProductCategory productCategory) {
        try {
            productCategoryRepo.findAll().stream().filter(user -> user.getName().equals(productCategory.getName())).filter(user -> user.getId().equals(productCategory.getId())).findFirst().get();
            return 500;        } catch (NoSuchElementException e) {
            productCategoryRepo.save(productCategory);
            return 200;        }
    }


    @GetMapping("{id}")
    public ProductCategory getProductCategory(@PathVariable String id) {
        try {
            return productCategoryRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
        } catch (NoSuchElementException e) {
            return null;
        }
    }
    @GetMapping("/all")
    public List<ProductCategory> getAllProductCategory() {
        return productCategoryRepo.findAll();
    }

    @DeleteMapping("{id}")
    public int delete(@PathVariable String id) {
        try {
            ProductCategory productCategory = productCategoryRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            productCategoryRepo.delete(productCategory);
            return 200;        } catch (NoSuchElementException e) {
            return 500;        }
    }

    @PutMapping("{id}")
    public int update(@RequestBody ProductCategory productCategory, @PathVariable String id) {
        ProductCategory categoryBefore;
        try {
            categoryBefore = productCategoryRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            productCategory.setId(categoryBefore.getId());
            productCategoryRepo.save(productCategory);
            return 200;        } catch (NoSuchElementException e) {
            return 500;        }
    }

}
