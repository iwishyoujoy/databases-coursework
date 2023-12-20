package com.example.server.controller;

import com.example.server.model.FavoriteProduct;
import com.example.server.repo.FavoriteProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("api/favorite")
@CrossOrigin
public class FavoriteProductController {

    private final FavoriteProductRepo favoriteProductRepo;

    @Autowired
    public FavoriteProductController(FavoriteProductRepo favoriteProductRepo) throws NoSuchAlgorithmException {
        this.favoriteProductRepo = favoriteProductRepo;
    }

    @PostMapping()
    public ResponseEntity<Void> create(@RequestBody FavoriteProduct favoriteProduct) {
        try {
            favoriteProductRepo.findAll().stream()
                    .filter(user -> user.getFavoriteProductId().getCustomer_id()
                            .equals(favoriteProduct.getFavoriteProductId().getCustomer_id()))
                    .filter(user -> user.getFavoriteProductId().getItem_id()
                            .equals(favoriteProduct.getFavoriteProductId().getItem_id()))
                    .findFirst()
                    .get();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (NoSuchElementException e) {
            favoriteProductRepo.save(favoriteProduct);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }


    @GetMapping("/all/{customer_id}")
    public ResponseEntity<List<FavoriteProduct>> getFavoriteOfCustomer(@PathVariable Long customer_id) {
        try {
            List<FavoriteProduct> list = favoriteProductRepo.findAll();
            List<FavoriteProduct> to_ret = new ArrayList<>();
            for(FavoriteProduct fp : list){
                if(fp.getFavoriteProductId().getCustomer_id().equals(customer_id)){
                    to_ret.add(fp);
                }
            }
            return ResponseEntity.ok().body(to_ret);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("{customer_id}/{item_id}")
    public ResponseEntity<Void> delete(@PathVariable Long customer_id, @PathVariable Long item_id) {
        try {
            FavoriteProduct favoriteProduct = favoriteProductRepo.findAll().stream().filter(user -> user.getFavoriteProductId().getCustomer_id().equals(customer_id)).filter(user -> user.getFavoriteProductId().getItem_id().equals(item_id)).findFirst().get();
            favoriteProductRepo.delete(favoriteProduct);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
