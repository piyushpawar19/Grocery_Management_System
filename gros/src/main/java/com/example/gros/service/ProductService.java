package com.example.gros.service;

import com.example.gros.model.Product;
import com.example.gros.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Integer id) {
        return productRepository.findById(id);
    }

    public List<Product> searchProducts(String query) {
        try {
            logger.info("Searching products with query: {}", query);
            if (query == null || query.trim().isEmpty()) {
                logger.warn("Empty search query provided");
                return List.of();
            }
            
            List<Product> results = productRepository.findByProductNameContainingIgnoreCase(query.trim());
            logger.info("Found {} products matching query: {}", results.size(), query);
            return results;
        } catch (Exception e) {
            logger.error("Error searching products with query: {}", query, e);
            throw new RuntimeException("Failed to search products", e);
        }
    }

    public List<Product> searchProductsByName(String name) {
        try {
            logger.info("Searching products by name: {}", name);
            if (name == null || name.trim().isEmpty()) {
                logger.warn("Empty name query provided");
                return List.of();
            }
            
            List<Product> results = productRepository.findByProductNameContainingIgnoreCase(name.trim());
            logger.info("Found {} products matching name: {}", results.size(), name);
            return results;
        } catch (Exception e) {
            logger.error("Error searching products by name: {}", name, e);
            throw new RuntimeException("Failed to search products by name", e);
        }
    }

    @Transactional
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Integer productId, Product updatedProduct) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        product.setProductName(updatedProduct.getProductName());
        product.setPrice(updatedProduct.getPrice());
        product.setQuantity(updatedProduct.getQuantity());
        product.setProductDescription(updatedProduct.getProductDescription());
        product.setReserved(updatedProduct.getReserved());
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Integer productId) {
        productRepository.deleteById(productId);
    }
}