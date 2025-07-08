package com.example.gros.controller;

import com.example.gros.dto.RegisterRequest;
import com.example.gros.dto.UserUpdateRequest;
import com.example.gros.dto.LoginRequest;
import com.example.gros.dto.PasswordChangeRequest;
import com.example.gros.dto.ApiResponse;
import com.example.gros.model.User;
import com.example.gros.service.UserService;
import com.example.gros.service.AuthService;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
    private final UserService userService;
    private final AuthService authService;

    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.registerUser(request);
        user.setPassword(null); // Hide password
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        User user = authService.login(request);
        user.setPassword(null); // Hide password
        return ResponseEntity.ok(user);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@RequestParam String email) {
        authService.logout(email);
        return ResponseEntity.ok(new ApiResponse(true, "Logged out successfully"));
    }
    
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetails details,
            @Valid @RequestBody UserUpdateRequest updateRequest) {
        
        User user = userService.findByEmail(details.getUsername()).orElseThrow();
        userService.updateUserProfile(user, updateRequest);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Profile updated successfully"
        ));
    }

    
 // View all customers
    @GetMapping("/customers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllCustomers() {
        List<User> customers = userService.findAllCustomers();
        return ResponseEntity.ok(customers);
    }

    // Delete customer by ID
    @DeleteMapping("/customers/{customerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteCustomer(@PathVariable Integer customerId) {
        userService.deleteCustomer(customerId);
        return ResponseEntity.ok(new ApiResponse(true, "Customer deleted successfully"));
    }

    

    @PutMapping("/{customerId}/password")
    public ResponseEntity<ApiResponse> changePassword(
            @PathVariable Integer customerId,
            @Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(customerId, request);
        return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully"));
    }
} 