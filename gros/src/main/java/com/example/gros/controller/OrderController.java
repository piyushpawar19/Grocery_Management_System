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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
    public ResponseEntity<?> placeOrder(@AuthenticationPrincipal UserDetails details) {
        User user = userService.findByEmail(details.getUsername()).orElseThrow();
        Order savedOrder = orderService.placeOrder(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)  // 201
                .body(Map.of(
                    "success", true,
                    "message", "Order placed successfully",
                    "orderId", savedOrder.getId()
                ));
    }


    @GetMapping
    public ResponseEntity<?> getOrders(@AuthenticationPrincipal UserDetails details) {
        User user = userService.findByEmail(details.getUsername()).orElseThrow();
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
    }
}
