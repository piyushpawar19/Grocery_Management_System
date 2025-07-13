// dto/CartItemResponse.java
package com.example.gros.dto;

import java.math.BigDecimal;

public class CartItemResponse {
    private Integer productId;
    private String productName;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private String imageUrl;

    // Constructors
    public CartItemResponse(Integer productId, String productName, int quantity, BigDecimal unitPrice) {
        this.setProductId(productId);
        this.setProductName(productName);
        this.setQuantity(quantity);
        this.setUnitPrice(unitPrice);
        this.setTotalPrice(unitPrice.multiply(BigDecimal.valueOf(quantity)));
    }

    public CartItemResponse(Integer productId, String productName, int quantity, BigDecimal unitPrice, String imageUrl) {
        this.setProductId(productId);
        this.setProductName(productName);
        this.setQuantity(quantity);
        this.setUnitPrice(unitPrice);
        this.setTotalPrice(unitPrice.multiply(BigDecimal.valueOf(quantity)));
        this.setImageUrl(imageUrl);
    }

	public Integer getProductId() {
		return productId;
	}

	public void setProductId(Integer productId) {
		this.productId = productId;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public BigDecimal getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(BigDecimal unitPrice) {
		this.unitPrice = unitPrice;
	}

	public BigDecimal getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(BigDecimal totalPrice) {
		this.totalPrice = totalPrice;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

    // Getters and setters
    // ...
}

