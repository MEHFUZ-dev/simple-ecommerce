package com.example.ecommerce_backend.service;

import com.example.ecommerce_backend.entity.CartItem;
import com.example.ecommerce_backend.entity.Order;
import com.example.ecommerce_backend.entity.OrderItem;
import com.example.ecommerce_backend.entity.Product;
import com.example.ecommerce_backend.repository.CartRepository;
import com.example.ecommerce_backend.repository.OrderItemRepository;
import com.example.ecommerce_backend.repository.OrderRepository;
import com.example.ecommerce_backend.repository.ProductRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository,
            ProductRepository productRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Order placeOrder(Long userId) {

        List<CartItem> cartItems =
                cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double totalAmount = 0;

        List<Product> products = new ArrayList<>();

        // Check products and stock first
        for (CartItem cartItem : cartItems) {

            Product product = productRepository
                    .findById(cartItem.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            if (cartItem.getQuantity() > product.getStock()) {
                throw new RuntimeException(
                        "Not enough stock for " + product.getName()
                );
            }

            totalAmount +=
                    product.getPrice() * cartItem.getQuantity();

            products.add(product);
        }

        // Create order
        Order order = new Order();

        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setStatus(Order.Status.PLACED);

        order = orderRepository.save(order);

        // Create order items and reduce stock
        for (int i = 0; i < cartItems.size(); i++) {

            CartItem cartItem = cartItems.get(i);
            Product product = products.get(i);

            OrderItem orderItem = new OrderItem();

            orderItem.setOrderId(order.getId());
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setPrice(product.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());

            orderItemRepository.save(orderItem);

            product.setStock(
                    product.getStock() - cartItem.getQuantity()
            );

            productRepository.save(product);
        }

        // Clear cart
        cartRepository.deleteAll(cartItems);

        return order;
    }

    public List<Order> getOrders(Long userId) {

        return orderRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrder(Long userId, Long orderId) {

        return orderRepository
                .findByIdAndUserId(orderId, userId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));
    }

    public List<OrderItem> getOrderItems(Long orderId) {

        return orderItemRepository.findByOrderId(orderId);
    }
}