package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.entity.CartItem;
import com.example.ecommerce_backend.service.CartService;
import com.example.ecommerce_backend.repository.UserRepository;
import com.example.ecommerce_backend.entity.User;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(
            CartService cartService,
            UserRepository userRepository
    ) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(
            Authentication authentication
    ) {

        Long userId = getUserId(authentication);

        return ResponseEntity.ok(
                cartService.getCart(userId)
        );
    }

    @PostMapping
    public ResponseEntity<CartItem> addToCart(
            @RequestBody CartRequest request,
            Authentication authentication
    ) {

        Long userId = getUserId(authentication);

        return ResponseEntity.ok(
                cartService.addToCart(
                        userId,
                        request.productId(),
                        request.quantity()
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItem> updateCart(
            @PathVariable Long id,
            @RequestBody CartRequest request,
            Authentication authentication
    ) {

        Long userId = getUserId(authentication);

        return ResponseEntity.ok(
                cartService.updateQuantity(
                        userId,
                        id,
                        request.quantity()
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Long id,
            Authentication authentication
    ) {

        Long userId = getUserId(authentication);

        cartService.removeFromCart(userId, id);

        return ResponseEntity.noContent().build();
    }

    private Long getUserId(Authentication authentication) {

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
    }

    public record CartRequest(
            Long productId,
            Integer quantity
    ) {
    }
}