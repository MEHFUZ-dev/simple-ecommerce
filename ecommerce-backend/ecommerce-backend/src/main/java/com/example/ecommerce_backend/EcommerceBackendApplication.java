package com.example.ecommerce_backend;

import com.example.ecommerce_backend.entity.Product;
import com.example.ecommerce_backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EcommerceBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcommerceBackendApplication.class, args);
	}

	@Bean
	CommandLineRunner seedProducts(ProductRepository productRepository) {
		return args -> {
			if (productRepository.count() > 0) {
				return;
			}

			productRepository.saveAll(java.util.List.of(
				product("Wireless Mouse", "Ergonomic wireless mouse", 599.0, "https://images.unsplash.com/photo-1527814050087-3793815479db", "Accessories", 25),
				product("Mechanical Keyboard", "Tactile mechanical keyboard", 2499.0, "https://images.unsplash.com/photo-1587829741301-dc798b83add3", "Accessories", 15),
				product("USB-C Cable", "Durable USB-C charging cable", 299.0, "https://images.unsplash.com/photo-1625842268584-8f3296236761", "Cables", 40),
				product("Laptop Stand", "Adjustable aluminum laptop stand", 999.0, "https://images.unsplash.com/photo-1616353071588-1d2f9e7c8b19", "Workspace", 12)
			));
		};
	}

	private Product product(String name, String description, Double price, String imageUrl, String category, Integer stock) {
		Product product = new Product();
		product.setName(name);
		product.setDescription(description);
		product.setPrice(price);
		product.setImageUrl(imageUrl);
		product.setCategory(category);
		product.setStock(stock);
		return product;
	}

}
