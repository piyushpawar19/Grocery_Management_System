package com.example.gros.service;

import com.example.gros.dto.CartItemRequest;
import com.example.gros.model.*;
import com.example.gros.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CartService {
    private final CartItemRepository cartItemRepo;
    private final ProductRepository productRepo;
    //private final UserRepository userRepo;

    public CartService(CartItemRepository cartItemRepo, ProductRepository productRepo, UserRepository userRepo) {
        this.cartItemRepo = cartItemRepo;
        this.productRepo = productRepo;
       // this.userRepo = userRepo;
    }

    public List<CartItem> getCartItems(User user) {
        return cartItemRepo.findByUser(user);
    }

    @Transactional
    public void addToCart(User user, CartItemRequest request) {
        Product product = productRepo.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        CartItem item = cartItemRepo.findByUserAndProduct_ProductId(user, product.getProductId())
                .orElse(new CartItem());
        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(request.getQuantity());
        cartItemRepo.save(item);
    }

    @Transactional
    public void updateCartItem(User user, CartItemRequest request) {
        CartItem item = cartItemRepo.findByUserAndProduct_ProductId(user, request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Item not found in cart"));
        item.setQuantity(request.getQuantity());
        cartItemRepo.save(item);
    }

    @Transactional
    public void removeCartItem(User user, Integer productId) {
        CartItem item = cartItemRepo.findByUserAndProduct_ProductId(user, productId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found in cart"));
        cartItemRepo.delete(item);
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepo.deleteByUser(user);
    }
}
