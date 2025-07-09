package com.example.gros.controller;

import com.example.gros.dto.OrderItemResponse;
import com.example.gros.dto.OrderRequest;
import com.example.gros.dto.OrderResponse;
import com.example.gros.model.Order;
import com.example.gros.model.User;
import com.example.gros.service.OrderService;
import com.example.gros.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    // New comprehensive POST endpoint with payment details
    @PostMapping("/place-order")
    public ResponseEntity<?> placeOrderWithPayment(
            @RequestParam Integer customerId,
            @RequestBody @Valid OrderRequest request) {
        try {
            User user = userService.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("User with customerId " + customerId + " not found"));
            
            // Validate payment details (basic validation)
            if (!isValidCardNumber(request.getCardNumber())) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                            "success", false,
                            "message", "Invalid card number"
                        ));
            }
            
            if (!isValidExpiryDate(request.getExpiryDate())) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                            "success", false,
                            "message", "Invalid expiry date"
                        ));
            }
            
            // Place the order
            Order savedOrder = orderService.placeOrder(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                        "success", true,
                        "message", "Order placed successfully with payment",
                        "orderId", savedOrder.getId(),
                        "totalItems", request.getTotalItems(),
                        "totalAmount", request.getTotalAmount(),
                        "cardHolderName", maskCardHolderName(request.getCardHolderName()),
                        "cardNumber", maskCardNumber(request.getCardNumber())
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

    // Original simple POST endpoint (kept for backward compatibility)
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestParam Integer customerId) {
        try {
            User user = userService.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("User with customerId " + customerId + " not found"));
            
            Order savedOrder = orderService.placeOrder(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                        "success", true,
                        "message", "Order placed successfully",
                        "orderId", savedOrder.getId()
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

    @GetMapping
    public ResponseEntity<?> getOrders(@RequestParam Integer customerId) {
        try {
            User user = userService.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("User with customerId " + customerId + " not found"));
            
            List<Order> orders = "ADMIN".equalsIgnoreCase(user.getUserRole())
                    ? orderService.getAllOrders()
                    : orderService.getUserOrders(user);

            List<OrderResponse> response = orders.stream().map(order -> {
                List<OrderItemResponse> itemResponses = order.getItems().stream().map(item ->
                    new OrderItemResponse(
                        item.getProduct().getProductName(),
                        item.getPrice(),
                        item.getQuantity()
                    )
                ).toList();

                return new OrderResponse(
                    order.getId(),
                    order.getOrderTime(),
                    order.getTotalAmount(),
                    itemResponses
                );
            }).toList();

            return ResponseEntity.ok(response);
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

    // Helper methods for validation and masking
    private boolean isValidCardNumber(String cardNumber) {
        // Basic validation - for testing purposes, accept any 16-digit number
        if (cardNumber == null || cardNumber.length() != 16) {
            return false;
        }
        
        // Check if it's all digits
        if (!cardNumber.matches("^[0-9]{16}$")) {
            return false;
        }
        
        // For testing, accept any 16-digit number
        // In production, you would use the Luhn algorithm
        return true;
        
        // Uncomment below for strict Luhn algorithm validation
        /*
        int sum = 0;
        boolean alternate = false;
        
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(cardNumber.substring(i, i + 1));
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            sum += n;
            alternate = !alternate;
        }
        
        return (sum % 10 == 0);
        */
    }

    private boolean isValidExpiryDate(String expiryDate) {
        if (expiryDate == null || !expiryDate.matches("^(0[1-9]|1[0-2])/([0-9]{2})$")) {
            return false;
        }
        
        String[] parts = expiryDate.split("/");
        int month = Integer.parseInt(parts[0]);
        int year = Integer.parseInt(parts[1]);
        
        // Basic validation - month should be 1-12, year should be reasonable
        return month >= 1 && month <= 12 && year >= 0 && year <= 99;
    }

    private String maskCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) {
            return "****";
        }
        return "*".repeat(cardNumber.length() - 4) + cardNumber.substring(cardNumber.length() - 4);
    }

    private String maskCardHolderName(String name) {
        if (name == null || name.length() < 2) {
            return "*";
        }
        return name.charAt(0) + "*".repeat(name.length() - 1);
    }
}
