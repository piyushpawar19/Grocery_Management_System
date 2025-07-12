import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.time.Duration;

public class AdminLoginTest {
    public static void main(String[] args) {
        testAdminLogin();
    }
    
    public static void testAdminLogin() {
        HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
            
        // Test different password combinations
        String[] passwords = {
            "Admin@123",
            "admin@123", 
            "Admin123",
            "admin123",
            "password",
            "admin",
            "123456"
        };
        
        for (String password : passwords) {
            testLogin(client, password);
        }
    }
    
    private static void testLogin(HttpClient client, String password) {
        try {
            String jsonBody = String.format(
                "{\"email\":\"admin@grocery.com\",\"password\":\"%s\"}", 
                password
            );
            
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:9090/api/users/admin/login"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .timeout(Duration.ofSeconds(10))
                .build();
                
            HttpResponse<String> response = client.send(request, 
                HttpResponse.BodyHandlers.ofString());
                
            System.out.println("=== Testing password: '" + password + "' ===");
            System.out.println("Status Code: " + response.statusCode());
            System.out.println("Response Body: " + response.body());
            System.out.println();
            
        } catch (Exception e) {
            System.out.println("=== Testing password: '" + password + "' ===");
            System.out.println("Error: " + e.getMessage());
            System.out.println();
        }
    }
} 