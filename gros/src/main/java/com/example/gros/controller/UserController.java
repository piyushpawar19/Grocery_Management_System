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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

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
        try {
            User user = userService.registerUser(request);
            user.setPassword(null); // Hide password
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (IllegalArgumentException ex) {
            // For duplicate email or other business logic errors
            return ResponseEntity.badRequest().body(Map.of("field", "email", "message", ex.getMessage()));
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new java.util.HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        // If only one error, return single field/message for frontend compatibility
        if (errors.size() == 1) {
            String field = errors.keySet().iterator().next();
            return ResponseEntity.badRequest().body(Map.of("field", field, "message", errors.get(field)));
        }
        return ResponseEntity.badRequest().body(errors);
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
    
    @GetMapping("/me")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract username from Basic Auth header
            String credentials = new String(java.util.Base64.getDecoder().decode(authHeader.substring(6)));
            String username = credentials.split(":")[0];
            
            User user = userService.findByEmail(username)
                                   .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(Map.of(
                "id", user.getCustomerId(),
                "customerName", user.getCustomerName(),
                "email", user.getEmail(),
                "address", user.getAddress(),
                "contactNumber", user.getContactNumber(),
                "role", user.getUserRole()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
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
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody UserUpdateRequest updateRequest) {
        try {
            // Extract username from Basic Auth header
            String credentials = new String(java.util.Base64.getDecoder().decode(authHeader.substring(6)));
            String username = credentials.split(":")[0];
            
            User user = userService.findByEmail(username).orElseThrow();
            userService.updateUserProfile(user, updateRequest);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Profile updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
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

    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        Optional<User> userOpt = userService.findByEmail(userDetails.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        User user = userOpt.get();
        user.setPassword(null); // Never expose password
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateCurrentUserProfile(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Map<String, Object> updates) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        Optional<User> userOpt = userService.findByEmail(userDetails.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        User user = userOpt.get();
        if (updates.containsKey("customerName")) {
            user.setCustomerName((String) updates.get("customerName"));
        }
        if (updates.containsKey("email")) {
            user.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("address")) {
            user.setAddress((String) updates.get("address"));
        }
        if (updates.containsKey("contactNumber")) {
            Object contact = updates.get("contactNumber");
            if (contact instanceof String) {
                user.setContactNumber(Long.parseLong((String) contact));
            } else if (contact instanceof Number) {
                user.setContactNumber(((Number) contact).longValue());
            }
        }
        userService.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    
 // View all customers
    @GetMapping("/customers")
    // @PreAuthorize("hasRole('ADMIN')")
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
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody PasswordChangeRequest request) {
        try {
            // Extract username from Basic Auth header
            String credentials = new String(java.util.Base64.getDecoder().decode(authHeader.substring(6)));
            String username = credentials.split(":")[0];
            
            // Verify the customerId matches the authenticated user
            User user = userService.findByEmail(username).orElseThrow();
            if (!user.getCustomerId().equals(customerId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse(false, "Access denied"));
            }
            
            userService.changePassword(customerId, request);
            return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Invalid credentials"));
        }
    }
} 