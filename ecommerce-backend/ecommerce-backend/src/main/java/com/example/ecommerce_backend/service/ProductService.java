package com.example.ecommerce_backend.service;

import com.example.ecommerce_backend.entity.Product;
import com.example.ecommerce_backend.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(
            ProductRepository productRepository
    ) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }

    public Product getProductById(Long id) {

        return productRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Product not found"
                        )
                );
    }

    public Product createProduct(Product product) {

        return productRepository.save(product);
    }

    public Product updateProduct(
            Long id,
            Product updatedProduct
    ) {

        Product product = getProductById(id);

        product.setName(updatedProduct.getName());
        product.setDescription(
                updatedProduct.getDescription()
        );
        product.setPrice(
                updatedProduct.getPrice()
        );
        product.setImageUrl(
                updatedProduct.getImageUrl()
        );
        product.setCategory(
                updatedProduct.getCategory()
        );
        product.setStock(
                updatedProduct.getStock()
        );

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {

        Product product = getProductById(id);

        productRepository.delete(product);
    }
}