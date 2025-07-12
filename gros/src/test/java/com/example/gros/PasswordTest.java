package com.example.gros;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // The hash from data.sql
        String storedHash = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa";
        
        // Test different passwords
        String[] testPasswords = {
            "Admin@123",
            "admin@123", 
            "Admin123",
            "admin123",
            "password",
            "admin",
            "123456"
        };
        
        System.out.println("Testing password hash verification:");
        System.out.println("Stored hash: " + storedHash);
        System.out.println();
        
        for (String password : testPasswords) {
            boolean matches = encoder.matches(password, storedHash);
            System.out.println("Password: '" + password + "' -> " + (matches ? "MATCHES" : "NO MATCH"));
        }
        
        // Also test generating a new hash for Admin@123
        System.out.println("\nGenerating new hash for 'Admin@123':");
        String newHash = encoder.encode("Admin@123");
        System.out.println("New hash: " + newHash);
        System.out.println("Verification: " + encoder.matches("Admin@123", newHash));
    }
} 