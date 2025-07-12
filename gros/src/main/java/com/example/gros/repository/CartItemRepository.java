package com.example.gros.repository;

import com.example.gros.model.CartItem;
import com.example.gros.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct_ProductId(User user, Integer productId);
    void deleteByUser(User user);
    List<CartItem> findByProduct_ProductId(Integer productId);
}
