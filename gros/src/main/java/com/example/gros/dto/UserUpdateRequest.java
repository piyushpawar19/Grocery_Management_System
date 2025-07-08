package com.example.gros.dto;

import jakarta.validation.constraints.*;

public class UserUpdateRequest {

    @NotBlank
    private String customerName;

    @NotBlank
    private String address;

    @NotNull
    private Long contactNumber;

    // Getters and Setters
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Long getContactNumber() { return contactNumber; }
    public void setContactNumber(Long contactNumber) { this.contactNumber = contactNumber; }
}
