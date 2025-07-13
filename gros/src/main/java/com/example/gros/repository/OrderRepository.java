package com.example.gros.repository;

import com.example.gros.model.Order;
import com.example.gros.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUser(User user);
    List<Order> findByUser_CustomerId(Integer customerId);
}
