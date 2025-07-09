package com.example.gros.service;

import com.example.gros.model.Product;
import com.example.gros.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
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

    public List<Product> searchProductsByName(String name) {
        return productRepository.findByProductNameContainingIgnoreCase(name);
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