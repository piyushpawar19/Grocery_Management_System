package com.example.gros.service;

import com.example.gros.model.Product;
import com.example.gros.model.CartItem;
import com.example.gros.repository.ProductRepository;
import com.example.gros.repository.CartItemRepository;
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
    private final CartItemRepository cartItemRepository;

    public ProductService(ProductRepository productRepository, CartItemRepository cartItemRepository) {
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
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
        product.setImageUrl(updatedProduct.getImageUrl());
        product.setReserved(updatedProduct.getReserved());
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Integer productId) {
        try {
            // Check if product exists
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));
            
            // First, delete all cart items for this product
            deleteCartItemsForProduct(productId);
            
            // Delete the product (this will fail if there are foreign key constraints from orders)
            productRepository.deleteById(productId);
            logger.info("Product deleted successfully: {}", productId);
            
        } catch (Exception e) {
            logger.error("Error deleting product with ID: {}", productId, e);
            
            // Check if it's a foreign key constraint violation
            if (e.getMessage() != null && e.getMessage().contains("FK551LOSX9J75SS5D6BFSQVIJNA")) {
                throw new RuntimeException("Cannot delete product because it is referenced in orders. Please remove all order items containing this product first.");
            } else if (e.getMessage() != null && e.getMessage().contains("FKJCYD5WV4IGQNW413RGXBFU4NV")) {
                throw new RuntimeException("Cannot delete product because it is in shopping carts. Please remove all cart items containing this product first.");
            } else if (e.getMessage() != null && e.getMessage().contains("FKJ")) {
                throw new RuntimeException("Cannot delete product because it is in shopping carts. Please remove all cart items containing this product first.");
            } else {
                throw new RuntimeException("Failed to delete product: " + e.getMessage());
            }
        }
    }

    private void deleteCartItemsForProduct(Integer productId) {
        try {
            // Find all cart items for this product
            List<CartItem> cartItems = cartItemRepository.findByProduct_ProductId(productId);
            if (!cartItems.isEmpty()) {
                logger.info("Deleting {} cart items for product ID: {}", cartItems.size(), productId);
                cartItemRepository.deleteAll(cartItems);
            }
        } catch (Exception e) {
            logger.error("Error deleting cart items for product ID: {}", productId, e);
            // Don't throw here, let the main delete operation handle it
        }
    }

    public boolean canDeleteProduct(Integer productId) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));
            
            // For now, we'll just check if the product exists
            // In a more sophisticated implementation, you could check for related records
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}