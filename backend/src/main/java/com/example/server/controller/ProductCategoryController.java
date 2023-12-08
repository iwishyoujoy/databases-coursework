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
    public String create(@RequestBody ProductCategory productCategory) {
        String toSend = "";
        try {
            productCategoryRepo.findAll().stream().filter(user -> user.getName().equals(productCategory.getName())).filter(user -> user.getId().equals(productCategory.getId())).findFirst().get();
            toSend = "Такая категория продуктов уже существует.";
        } catch (NoSuchElementException e) {
            productCategoryRepo.save(productCategory);
            toSend = "Категория создана.";
        }
        return toSend;
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
    public String delete(@PathVariable String id) {
        String toSend = "";
        try {
            ProductCategory productCategory = productCategoryRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            productCategoryRepo.delete(productCategory);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Такого продукта не существует.";
        }
        return toSend;
    }

    @PutMapping("{id}")
    public String update(@RequestBody ProductCategory productCategory, @PathVariable String id) {
        String toSend = "";
        ProductCategory categoryBefore;
        try {
            categoryBefore = productCategoryRepo.findAll().stream().filter(user -> user.getId() == Long.parseLong(id)).findFirst().get();
            productCategory.setId(categoryBefore.getId());
            productCategoryRepo.save(productCategory);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Такого продукта не существует.";
        }
        return toSend;
    }

}
