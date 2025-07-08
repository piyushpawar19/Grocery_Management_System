package com.example.gros.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private Integer id;
    private LocalDateTime orderTime;
    private BigDecimal totalAmount;
    private List<OrderItemResponse> items;

    public OrderResponse(Integer id, LocalDateTime orderTime, BigDecimal totalAmount, List<OrderItemResponse> items) {
        this.id = id;
        this.orderTime = orderTime;
        this.totalAmount = totalAmount;
        this.items = items;
    }

    // Getters
    public Integer getId() {
        return id;
    }

    public LocalDateTime getOrderTime() {
        return orderTime;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }
}
