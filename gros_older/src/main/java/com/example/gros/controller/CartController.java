package com.example.gros.controller;

import com.example.gros.dto.CartItemRequest;
import com.example.gros.dto.CartItemResponse;
import com.example.gros.model.CartItem;
import com.example.gros.model.Product;
import com.example.gros.model.User;
import com.example.gros.service.CartService;
import com.example.gros.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;
    private final UserService userService;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> getCart(@AuthenticationPrincipal UserDetails details) {
        User user = userService.findByEmail(details.getUsername()).orElseThrow();
        List<CartItem> cartItems = cartService.getCartItems(user);

        List<CartItemResponse> response = cartItems.stream()
            .map((CartItem item) -> {
                Product product = item.getProduct();
                return new CartItemResponse(
                    product.getProductId(),
                    product.getProductName(),
                    item.getQuantity(),
                    product.getPrice()
                );
            })
            .collect(Collectors.toList());
        BigDecimal cartTotal = response.stream()
                .map(CartItemResponse::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResponseEntity.ok(Map.of(
                "items", response,
                "cartTotal", cartTotal
            ));
    }





    @PostMapping
    public ResponseEntity<?> addItem(@AuthenticationPrincipal UserDetails details,
                                     @RequestBody @Valid CartItemRequest req) {
        User user = userService.findByEmail(details.getUsername()).orElseThrow();
        cartService.addToCart(user, req);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                    "success", true,
                    "message", "Item added to cart successfully"
                ));
    }

    @PutMapping
    public ResponseEntity<?> updateItem(@AuthenticationPrincipal UserDetails details,
                                        @RequestBody @Valid CartItemRequest req) {
        User user = userService.findByEmail(details.getUsername()).orElseThrow();
        cartService.updateCartItem(user, req);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Cart item updated successfully"
        ));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeItem(@AuthenticationPrincipal UserDetails details,
                                        @PathVariable Integer productId) {
        User user = userService.findByEmail(details.getUsername()).orElseThrow();
        cartService.removeCartItem(user, productId);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Item removed from cart successfully"
        ));
    }

}
