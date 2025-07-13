package com.example.gros.repository;

import com.example.gros.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByProduct_ProductId(Integer productId);
    void deleteByProduct_ProductId(Integer productId);
} 