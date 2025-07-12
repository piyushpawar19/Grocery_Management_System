package com.example.gros.controller;

import com.example.gros.dto.OrderItemResponse;
import com.example.gros.dto.OrderResponse;
import com.example.gros.model.Order;
import com.example.gros.model.User;
import com.example.gros.service.OrderService;
import com.example.gros.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestParam(required = false) String email) {
        try {
            // For now, create a sample user or handle the case when no user is provided
            // You can modify this based on your requirements
            User user = new User();
            user.setCustomerId(1); // Sample user ID
            user.setCustomerName("Sample User");
            user.setEmail(email != null ? email : "sample@example.com");
            
            Order savedOrder = orderService.placeOrder(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)  // 201
                    .body(Map.of(
                        "success", true,
                        "message", "Order placed successfully",
                        "orderId", savedOrder.getId()
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Error placing order: " + e.getMessage()));
        }
    }

    @PostMapping("/place-order")
    public ResponseEntity<?> placeOrderWithCustomerId(@RequestParam Integer customerId, @RequestBody Map<String, Object> paymentDetails) {
        // Find user by customerId
        User user = userService.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("User with customerId " + customerId + " not found"));
        
        // Place the order
        Order savedOrder = orderService.placeOrder(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                    "success", true,
                    "message", "Order placed successfully",
                    "orderId", savedOrder.getId(),
                    "paymentDetails", paymentDetails
                ));
    }

    @GetMapping
    public ResponseEntity<?> getOrders(@RequestParam(required = false) String email) {
        try {
            // For now, return sample orders or handle the case when no user is provided
            // You can modify this based on your requirements
            List<Order> orders = orderService.getAllOrders();

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
                    order.getUser().getCustomerName(),
                    order.getUser().getEmail(),
                    itemResponses
                );
            }).toList();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Error retrieving orders: " + e.getMessage()));
        }
    }
}
