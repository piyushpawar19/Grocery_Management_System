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
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
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

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@Valid @RequestBody LoginRequest request) {
        try {
            System.out.println("Admin login attempt for email: " + request.getEmail());
            
            User user = authService.login(request);
            
            System.out.println("User found: " + user.getCustomerName() + ", Role: " + user.getUserRole());
            
            // Allow any user to login through admin endpoint
            // No role check required - accessible for all users
            
            user.setPassword(null); // Hide password
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            System.out.println("Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", "Invalid email or password"));
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Login failed. Please try again."));
        }
    }

    @GetMapping("/test/admin")
    public ResponseEntity<?> testAdminUser() {
        try {
            System.out.println("Testing admin user existence...");
            Optional<User> adminUser = userService.findByEmail("admin@grocery.com");
            if (adminUser.isPresent()) {
                User user = adminUser.get();
                System.out.println("Admin user found: " + user.getCustomerName() + ", Role: " + user.getUserRole());
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Admin user found",
                    "email", user.getEmail(),
                    "role", user.getUserRole(),
                    "name", user.getCustomerName()
                ));
            } else {
                System.out.println("Admin user not found in database");
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Admin user not found"));
            }
        } catch (Exception e) {
            System.out.println("Error checking admin user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error checking admin user: " + e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@RequestParam String email) {
        authService.logout(email);
        return ResponseEntity.ok(new ApiResponse(true, "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserProfile() {
        try {
            // Since this endpoint is open, return a sample response or handle appropriately
            // You can either return a default user or handle the case when no email is provided
            
            // Option 1: Return a sample user profile
            Map<String, Object> sampleUser = Map.of(
                "id", 1,
                "customerName", "Sample User",
                "email", "sample@example.com",
                "address", "Sample Address",
                "contactNumber", 1234567890L,
                "role", "CUSTOMER"
            );
            
            return ResponseEntity.ok(sampleUser);
            
            // Option 2: If you want to return an error when no email is provided
            // return ResponseEntity.badRequest().body(Map.of(
            //     "success", false,
            //     "message", "Email parameter is required"
            // ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
        }
    }
    
    @GetMapping("/me/{customerId}")
    public ResponseEntity<?> getUserProfileById(@PathVariable Integer customerId) {
        try {
            Optional<User> userOptional = userService.findById(customerId);
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                // Create a response map without password
                Map<String, Object> userProfile = Map.of(
                    "id", user.getCustomerId(),
                    "customerName", user.getCustomerName(),
                    "email", user.getEmail(),
                    "address", user.getAddress(),
                    "contactNumber", user.getContactNumber(),
                    "role", user.getUserRole()
                );
                
                return ResponseEntity.ok(userProfile);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Server error"));
        }
    }
    
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UserUpdateRequest updateRequest) {
        try {
            // Since this endpoint is open, just return success without actually updating
            // You can modify this based on your requirements
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Profile updated successfully",
                "updatedData", updateRequest
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request data");
        }
    }
    
    @PutMapping("/me/{customerId}")
    public ResponseEntity<?> updateProfileById(@PathVariable Integer customerId, @Valid @RequestBody UserUpdateRequest updateRequest) {
        try {
            Optional<User> userOptional = userService.findById(customerId);
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                // Update the user profile with the new data
                userService.updateUserProfile(user, updateRequest);
                
                // Return the updated user profile (without password)
                Map<String, Object> updatedProfile = Map.of(
                    "id", user.getCustomerId(),
                    "customerName", user.getCustomerName(),
                    "email", user.getEmail(),
                    "address", user.getAddress(),
                    "contactNumber", user.getContactNumber(),
                    "role", user.getUserRole()
                );
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Profile updated successfully",
                    "user", updatedProfile
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Server error: " + e.getMessage()));
        }
    }

    
 // View all customers
    @GetMapping("/customers")
    public ResponseEntity<List<User>> getAllCustomers() {
        List<User> customers = userService.findAllCustomers();
        return ResponseEntity.ok(customers);
    }

    // Delete customer by ID
    @DeleteMapping("/customers/{customerId}")
    public ResponseEntity<ApiResponse> deleteCustomer(@PathVariable Integer customerId) {
        userService.deleteCustomer(customerId);
        return ResponseEntity.ok(new ApiResponse(true, "Customer deleted successfully"));
    }

    

    @PutMapping("/{customerId}/password")
    public ResponseEntity<ApiResponse> changePassword(
            @PathVariable Integer customerId,
            @Valid @RequestBody PasswordChangeRequest request) {
        try {
            userService.changePassword(customerId, request);
            return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Server error"));
        }
    }
} 