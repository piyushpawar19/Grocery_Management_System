package com.example.gros.controller;

import com.example.gros.dto.OrderResponse;
import com.example.gros.dto.OrderItemResponse;
import com.example.gros.model.Order;
import com.example.gros.service.OrderService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class UserOrderController {
    
    private final OrderService orderService;

    public UserOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<?> getUserOrders(@RequestParam Integer customerId) {
        try {
            List<Order> orders = orderService.getOrdersForUser(customerId);

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

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer orderId) {
        try {
            Order order = orderService.getOrderById(orderId);

            List<OrderItemResponse> itemResponses = order.getItems().stream().map(item ->
                new OrderItemResponse(
                    item.getProduct().getProductName(),
                    item.getPrice(),
                    item.getQuantity()
                )
            ).toList();

            OrderResponse response = new OrderResponse(
                order.getId(),
                order.getOrderTime(),
                order.getTotalAmount(),
                order.getUser().getCustomerName(),
                order.getUser().getEmail(),
                itemResponses
            );

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Error retrieving order: " + e.getMessage()));
        }
    }
} 