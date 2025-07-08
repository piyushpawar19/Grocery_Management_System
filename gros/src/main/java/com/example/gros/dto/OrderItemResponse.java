package com.example.gros.dto;

import java.math.BigDecimal;

public class OrderItemResponse {
    private String productName;
    private BigDecimal price;
    private int quantity;

    public OrderItemResponse(String productName, BigDecimal price, int quantity) {
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }

    // Getters
    public String getProductName() {
        return productName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }
}
