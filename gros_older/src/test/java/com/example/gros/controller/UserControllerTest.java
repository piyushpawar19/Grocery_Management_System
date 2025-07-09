package com.example.gros.controller;

import com.example.gros.dto.PasswordChangeRequest;
import com.example.gros.dto.UserUpdateRequest;
import com.example.gros.model.User;
import com.example.gros.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetUserProfileWithoutAuth_ShouldReturn200() throws Exception {
        // Given
        User mockUser = new User();
        mockUser.setCustomerId(1);
        mockUser.setCustomerName("John Doe");
        mockUser.setEmail("john@example.com");
        mockUser.setAddress("123 Main St");
        mockUser.setContactNumber(1234567890L);
        mockUser.setUserRole("CUSTOMER");
        
        when(userService.findById(1)).thenReturn(Optional.of(mockUser));

        // When & Then
        mockMvc.perform(get("/api/users/me/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.customerName").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john@example.com"));
    }

    @Test
    void testUpdateUserProfileWithoutAuth_ShouldReturn200() throws Exception {
        // Given
        User mockUser = new User();
        mockUser.setCustomerId(1);
        mockUser.setEmail("john@example.com");
        
        when(userService.findById(1)).thenReturn(Optional.of(mockUser));
        // updateUserProfile returns void, so no need to mock return value

        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setCustomerName("John Updated");
        updateRequest.setAddress("456 New St");
        updateRequest.setContactNumber("9876543210");
        updateRequest.setEmail("john@example.com");

        // When & Then
        mockMvc.perform(put("/api/users/me/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Profile updated successfully"));
    }

    @Test
    void testChangePasswordWithoutAuth_ShouldReturn200() throws Exception {
        // Given
        PasswordChangeRequest passwordRequest = new PasswordChangeRequest();
        passwordRequest.setOldPassword("oldpass");
        passwordRequest.setNewPassword("newpass");
        passwordRequest.setConfirmPassword("newpass");

        // When & Then
        mockMvc.perform(put("/api/users/1/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(passwordRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Password changed successfully"));
    }

    @Test
    void testProtectedEndpoint_ShouldReturn401() throws Exception {
        // When & Then - This endpoint should still require authentication
        mockMvc.perform(get("/api/users/customers"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testGetUserProfileWithInvalidId_ShouldReturn404() throws Exception {
        // Given
        when(userService.findById(999)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/users/me/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("User not found"));
    }

    @Test
    void testUpdateUserProfileWithInvalidId_ShouldReturn404() throws Exception {
        // Given
        when(userService.findById(999)).thenReturn(Optional.empty());

        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setCustomerName("John Updated");
        updateRequest.setEmail("john@example.com");

        // When & Then
        mockMvc.perform(put("/api/users/me/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("User not found"));
    }
} 