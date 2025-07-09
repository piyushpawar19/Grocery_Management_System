package com.example.gros.dto;

import jakarta.validation.constraints.*;

public class UserUpdateRequest {

    @NotBlank
    private String customerName;

    @NotBlank
    private String address;

    @NotNull
    private String contactNumber;

    @NotBlank
    @Email
    private String email;

    // Getters and Setters
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
