package com.example.gros.controller;

import com.example.gros.model.Product;
import com.example.gros.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // 1. Specific paths first - search endpoint
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("q") String query) {
        try {
            List<Product> results = productService.searchProducts(query);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(List.of()); // Return empty list on error
        }
    }

    // 2. General products endpoint
    @GetMapping
    public ResponseEntity<?> getProducts(@RequestParam(required = false) Integer id,
                                         @RequestParam(required = false) String name) {
        if (id != null) {
            Optional<Product> product = productService.getProductById(id);
            return product.<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found"));
        } else if (name != null) {
            List<Product> products = productService.searchProductsByName(name);
            return ResponseEntity.ok(products);
        } else {
            List<Product> products = productService.getAllProducts();
            return ResponseEntity.ok(products);
        }
    }
    
    // 3. Numeric ID only - prevents "search" from matching
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<?> getProductByIdPath(@PathVariable Integer id) {
        Optional<Product> product = productService.getProductById(id);
        return product.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found"));
    }

    @PostMapping
    public ResponseEntity<?> addProduct(@Valid @RequestBody Product product) {
        Product created = productService.addProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer productId,
                                           @Valid @RequestBody Product product) {
        Product updated = productService.updateProduct(productId, product);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer productId) {
        try {
            productService.deleteProduct(productId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Product deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "An error occurred while deleting the product"));
        }
    }
} 