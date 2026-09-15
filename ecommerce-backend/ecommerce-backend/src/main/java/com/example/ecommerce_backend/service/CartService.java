package com.example.ecommerce_backend.service;

import com.example.ecommerce_backend.entity.CartItem;
import com.example.ecommerce_backend.entity.Product;
import com.example.ecommerce_backend.repository.CartRepository;
import com.example.ecommerce_backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(
            CartRepository cartRepository,
            ProductRepository productRepository
    ) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public List<CartItem> getCart(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public CartItem addToCart(
            Long userId,
            Long productId,
            Integer quantity
    ) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        if (quantity > product.getStock()) {
            throw new RuntimeException("Not enough stock");
        }

        CartItem existingItem =
                cartRepository.findByUserIdAndProductId(userId, productId)
                        .orElse(null);

        if (existingItem != null) {

            int newQuantity =
                    existingItem.getQuantity() + quantity;

            if (newQuantity > product.getStock()) {
                throw new RuntimeException("Not enough stock");
            }

            existingItem.setQuantity(newQuantity);

            return cartRepository.save(existingItem);
        }

        CartItem cartItem = new CartItem();

        cartItem.setUserId(userId);
        cartItem.setProductId(productId);
        cartItem.setQuantity(quantity);

        return cartRepository.save(cartItem);
    }

    public CartItem updateQuantity(
            Long userId,
            Long cartItemId,
            Integer quantity
    ) {

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        CartItem cartItem =
                cartRepository.findByIdAndUserId(cartItemId, userId)
                        .orElseThrow(() -> new RuntimeException("Cart item not found"));

        Product product = productRepository.findById(cartItem.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (quantity > product.getStock()) {
            throw new RuntimeException("Not enough stock");
        }

        cartItem.setQuantity(quantity);

        return cartRepository.save(cartItem);
    }

    public void removeFromCart(Long userId, Long cartItemId) {

        CartItem cartItem =
                cartRepository.findByIdAndUserId(cartItemId, userId)
                        .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartRepository.delete(cartItem);
    }
}