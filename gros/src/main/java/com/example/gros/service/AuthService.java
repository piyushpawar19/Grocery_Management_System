package com.example.gros.service;

import com.example.gros.dto.LoginRequest;
import com.example.gros.model.User;
import com.example.gros.model.LoginTracking;
import com.example.gros.repository.UserRepository;
import com.example.gros.repository.LoginTrackingRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final LoginTrackingRepository loginTrackingRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, LoginTrackingRepository loginTrackingRepository) {
        this.userRepository = userRepository;
        this.loginTrackingRepository = loginTrackingRepository;
    }

    @Transactional
    public User login(LoginRequest request) {
        System.out.println("AuthService: Attempting login for email: " + request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.out.println("AuthService: User not found for email: " + request.getEmail());
                    return new IllegalArgumentException("Invalid email or password");
                });
        
        System.out.println("AuthService: User found: " + user.getCustomerName());
        System.out.println("AuthService: Stored password hash: " + user.getPassword());
        System.out.println("AuthService: Provided password: " + request.getPassword());
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            System.out.println("AuthService: Password mismatch");
            throw new IllegalArgumentException("Invalid email or password");
        }
        
        System.out.println("AuthService: Password verified successfully");
        
        // Update login tracking
        LoginTracking tracking = new LoginTracking();
        tracking.setUser(user);
        tracking.setLastLogin(LocalDateTime.now());
        tracking.setIsNowLoggedIn("Y");
        loginTrackingRepository.save(tracking);
        return user;
    }
    
    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Find latest tracking record (optional enhancement: track per session)
        LoginTracking tracking = new LoginTracking();
        tracking.setUser(user);
        tracking.setIsNowLoggedIn("N");
        tracking.setLastLogin(LocalDateTime.now()); // or create setLastLogout
        loginTrackingRepository.save(tracking);
    }

}