package com.example.server.controller;

import com.example.server.model.ProductCategory;
import com.example.server.repo.ProductCategoryRepo;
import com.example.server.repo.ProductRepo;
import com.example.server.model.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/productCategory")
@CrossOrigin
public class ProductCategoryController {
    private final ProductCategoryRepo productCategoryRepo;
    private final ProductRepo productRepo;


    @Autowired
    public ProductCategoryController(ProductCategoryRepo productCategoryRepo,  ProductRepo productRepo) throws NoSuchAlgorithmException {
        this.productCategoryRepo = productCategoryRepo;
        this.productRepo = productRepo;
    }

    @PostMapping("create/")
    public ResponseEntity<Void> create(@RequestBody ProductCategory productCategory) {
        try {
            productCategoryRepo.findAll().stream().filter(user -> user.getName().equals(productCategory.getName())).filter(user -> user.getId().equals(productCategory.getId())).findFirst().get();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();        } catch (NoSuchElementException e) {
            productCategoryRepo.save(productCategory);
            return ResponseEntity.status(HttpStatus.OK).build();        }
    }


    @GetMapping("{id}")
    public ResponseEntity<ProductCategory> getProductCategory(@PathVariable String id) {
        try {
            ProductCategory productCategory = productCategoryRepo.findAll().stream().filter(user -> user.getId().equals(Long.parseLong(id))).findFirst().get();
            return ResponseEntity.ok().body(productCategory);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @GetMapping("/all")
    public ResponseEntity<List<ProductCategory>> getAllProductCategory() {
        return ResponseEntity.ok().body(productCategoryRepo.findAll());
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<List<Product>> getAllProductsByCategory(@PathVariable Long id) {
        List<Product> list = productRepo.findAll().stream().filter(user -> user.getProduct_category_id() == id).toList();
        return ResponseEntity.ok().body(list);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            ProductCategory productCategory = productCategoryRepo.findAll().stream().filter(user -> user.getId().equals(Long.parseLong(id))).findFirst().get();
            productCategoryRepo.delete(productCategory);
            return ResponseEntity.status(HttpStatus.OK).build();        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();        }
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(@RequestBody ProductCategory productCategory, @PathVariable String id) {
        ProductCategory categoryBefore;
        try {
            categoryBefore = productCategoryRepo.findAll().stream().filter(user -> user.getId().equals(Long.parseLong(id))).findFirst().get();
            productCategory.setId(categoryBefore.getId());
            productCategoryRepo.save(productCategory);
            return ResponseEntity.status(HttpStatus.OK).build();        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();        }
    }

}
