package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.entity.Order;
import com.example.ecommerce_backend.entity.OrderItem;
import com.example.ecommerce_backend.entity.User;
import com.example.ecommerce_backend.repository.UserRepository;
import com.example.ecommerce_backend.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    public OrderController(
            OrderService orderService,
            UserRepository userRepository
    ) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(
            Authentication authentication
    ) {

        Long userId = getUserId(authentication);

        return ResponseEntity.ok(
                orderService.placeOrder(userId)
        );
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(
            Authentication authentication
    ) {

        Long userId = getUserId(authentication);

        return ResponseEntity.ok(
                orderService.getOrders(userId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(
            @PathVariable Long id,
            Authentication authentication
    ) {

        Long userId = getUserId(authentication);

        Order order =
                orderService.getOrder(userId, id);

        List<OrderItem> items =
                orderService.getOrderItems(id);

        return ResponseEntity.ok(
                Map.of(
                        "order", order,
                        "items", items
                )
        );
    }

    private Long getUserId(Authentication authentication) {

        String username = authentication.getName();

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return user.getId();
    }
}