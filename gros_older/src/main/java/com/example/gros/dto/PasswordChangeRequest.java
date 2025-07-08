package com.example.gros.dto;

import jakarta.validation.constraints.*;

public class PasswordChangeRequest {
    @NotBlank
    private String oldPassword;
    @NotBlank
    @Size(min = 8, max = 100)
    private String newPassword;
    @NotBlank
    private String confirmPassword;

    // Getters and setters
    public String getOldPassword() { return oldPassword; }
    public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
} 