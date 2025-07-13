package com.example.gros.service;

import com.example.gros.model.*;
import com.example.gros.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final CartItemRepository cartRepo;
    private final ProductRepository productRepo;

    public OrderService(OrderRepository orderRepo, CartItemRepository cartRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
    }

    @Transactional
    public Order placeOrder(User user) {
        List<CartItem> cartItems = cartRepo.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderTime(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for: " + product.getProductName());
            }

            // Update product stock
            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepo.save(product);

            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice()); // Set snapshot price

            // Calculate item total: price * quantity
            BigDecimal itemTotal = product.getPrice()
            	    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            	totalAmount = totalAmount.add(itemTotal);


            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount); // 💡 this must be set correctly

        Order savedOrder = orderRepo.save(order);

        // Clear cart
        cartRepo.deleteByUser(user);

        return savedOrder;
    }

    public List<Order> getUserOrders(User user) {
        return orderRepo.findByUser(user);
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public List<Order> getOrdersForUser(Integer customerId) {
        return orderRepo.findByUser_CustomerId(customerId);
    }

    public Order getOrderById(Integer orderId) {
        return orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
    }
}
