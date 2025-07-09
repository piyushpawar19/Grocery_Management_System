package com.example.gros.controller;

import com.example.gros.dto.CartItemRequest;
import com.example.gros.dto.CartItemResponse;
import com.example.gros.dto.CartItemUpdateRequest;
import com.example.gros.model.CartItem;
import com.example.gros.model.Product;
import com.example.gros.model.User;
import com.example.gros.service.CartService;
import com.example.gros.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // Get cart by customerId (as query param)
    @GetMapping
    public ResponseEntity<?> getCart(@RequestParam Integer customerId) {
        try {
            User user = userService.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("User with customerId " + customerId + " not found"));
            
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
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                        "success", false,
                        "message", e.getMessage()
                    ));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "An error occurred: " + e.getMessage()
                    ));
        }
    }

    // Add item to cart (customerId in request body)
    @PostMapping
    public ResponseEntity<?> addItem(@RequestBody @Valid CartItemRequest req) {
        try {
            User user = userService.findById(req.getCustomerId())
                    .orElseThrow(() -> new IllegalArgumentException("User with customerId " + req.getCustomerId() + " not found"));
            
            cartService.addToCart(user, req);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                        "success", true,
                        "message", "Item added to cart successfully"
                    ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                        "success", false,
                        "message", e.getMessage()
                    ));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "An error occurred: " + e.getMessage()
                    ));
        }
    }

@PutMapping
public ResponseEntity<?> updateItem(
        @RequestParam Integer customerId,
        @RequestBody @Valid CartItemUpdateRequest req) {
    try {
        User user = userService.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("User with customerId " + customerId + " not found"));

        cartService.updateCartItem(user, req);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Cart item updated successfully"
        ));
    } catch (IllegalArgumentException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                    "success", false,
                    "message", e.getMessage()
                ));
    } catch (Exception e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "An error occurred: " + e.getMessage()
                ));
    }
}


    // Remove item from cart (customerId as query param)
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeItem(@RequestParam Integer customerId,
                                        @PathVariable Integer productId) {
        try {
            User user = userService.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("User with customerId " + customerId + " not found"));
            
            cartService.removeCartItem(user, productId);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Item removed from cart successfully"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                        "success", false,
                        "message", e.getMessage()
                    ));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "An error occurred: " + e.getMessage()
                    ));
        }
    }
}
