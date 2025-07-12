package com.example.gros;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class GrosApplication {

	public static void main(String[] args) {
		SpringApplication.run(GrosApplication.class, args);
		
		// Generate BCrypt hash for Admin@123 (for testing purposes)
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String adminPassword = "Admin@123";
		String hashedPassword = encoder.encode(adminPassword);
		System.out.println("=== ADMIN PASSWORD HASH ===");
		System.out.println("Password: " + adminPassword);
		System.out.println("Hash: " + hashedPassword);
		System.out.println("===========================");
		
		// Test the hash
		boolean matches = encoder.matches(adminPassword, hashedPassword);
		System.out.println("Hash verification: " + matches);
	}

}
