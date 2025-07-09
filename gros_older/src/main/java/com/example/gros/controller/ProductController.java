package com.example.gros.controller;

import com.example.gros.model.Product;
import com.example.gros.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

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
    
    @GetMapping("/{id}")
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
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Product deleted successfully");
    }
} 