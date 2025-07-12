import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // The hash from data.sql
        String storedHash = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa";
        
        System.out.println("=== TESTING STORED HASH ===");
        System.out.println("Stored hash: " + storedHash);
        
        // Test different passwords
        String[] testPasswords = {
            "Admin@123",
            "admin@123", 
            "Admin123",
            "admin123",
            "password",
            "admin",
            "123456",
            "Password123",
            "password123"
        };
        
        for (String password : testPasswords) {
            boolean matches = encoder.matches(password, storedHash);
            System.out.println("Password: '" + password + "' -> " + (matches ? "MATCHES" : "NO MATCH"));
        }
        
        // Generate BCrypt hash for Admin@123
        String adminPassword = "Admin@123";
        String hashedPassword = encoder.encode(adminPassword);
        System.out.println("\n=== NEW ADMIN PASSWORD HASH ===");
        System.out.println("Password: " + adminPassword);
        System.out.println("Hash: " + hashedPassword);
        System.out.println("===========================");
        
        // Test the hash
        boolean matches = encoder.matches(adminPassword, hashedPassword);
        System.out.println("Hash verification: " + matches);
    }
} 