package com.example.server.controller;

import com.example.server.model.FavoriteProduct;
import com.example.server.repo.FavoriteProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
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
    public String create(@RequestBody FavoriteProduct favoriteProduct) {
        String toSend = "";
        try {
            favoriteProductRepo.findAll().stream()
                    .filter(user -> user.getFavoriteProductId().getCustomer_id()
                            .equals(favoriteProduct.getFavoriteProductId().getCustomer_id()))
                    .filter(user -> user.getFavoriteProductId().getItem_id()
                            .equals(favoriteProduct.getFavoriteProductId().getItem_id()))
                    .findFirst()
                    .get();

            toSend = "Такой продукт уже существует в любимом этого клиента.";
        } catch (NoSuchElementException e) {
            favoriteProductRepo.save(favoriteProduct);
            toSend = "Теперь в избранном.";
        }
        return toSend;
    }


    @GetMapping("/all/{customer_id}")
    public List<FavoriteProduct> getFavoriteOfCustomer(@PathVariable Long customer_id) {
        try {
            List<FavoriteProduct> list = favoriteProductRepo.findAll();
            List<FavoriteProduct> to_ret = new ArrayList<>();
            for(FavoriteProduct fp : list){
                if(fp.getFavoriteProductId().getCustomer_id().equals(customer_id)){
                    to_ret.add(fp);
                }
            }
            return to_ret;
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    @DeleteMapping("{customer_id}/{item_id}")
    public String delete(@PathVariable Long customer_id, @PathVariable Long item_id) {
        String toSend = "";
        try {
            FavoriteProduct favoriteProduct = favoriteProductRepo.findAll().stream().filter(user -> user.getFavoriteProductId().getCustomer_id().equals(customer_id)).filter(user -> user.getFavoriteProductId().getItem_id().equals(item_id)).findFirst().get();
            favoriteProductRepo.delete(favoriteProduct);
            toSend = "done";
        } catch (NoSuchElementException e) {
            toSend = "Такого айтема нет в избранном этого клиента.";
        }
        return toSend;
    }

}
