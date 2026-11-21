package com.dipxinh.identity.internal.application.service;

import com.dipxinh.catalog.internal.application.port.out.ProductRepository;
import com.dipxinh.catalog.internal.application.port.out.ProductVariantRepository;
import com.dipxinh.catalog.internal.domain.Product;
import com.dipxinh.catalog.internal.domain.ProductVariant;
import com.dipxinh.identity.internal.web.dto.CreateProductRequest;
import com.dipxinh.identity.internal.web.dto.ProductResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    public ProductService(ProductRepository productRepository, ProductVariantRepository variantRepository)
    {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
    }

    @Transactional
    public ProductResponse createProduct(UUID shopId, CreateProductRequest request) {
        if (productRepository.existsByShopIdAndSku(shopId, request.sku())) {
            throw new IllegalArgumentException("Mã SKU " + request.sku() + " đã tồn tại trong cửa hàng");
        }

        Product newProduct = new Product(
            null,
            shopId,
            request.categoryId(),
            request.sku().trim(),
            request.title().trim(),
            request.description(),
            request.supportsRental(),
            request.supportsSale(),
            request.isPublished(),
            Instant.now()
        );

        Product savedProduct = productRepository.save(newProduct);

        List<ProductVariant> savedVariants = Collections.emptyList();
        if (request.variants() != null && !request.variants().isEmpty()) {
            savedVariants = request.variants().stream()
                .map(v -> {
                    ProductVariant variant = new ProductVariant(
                        null,
                        shopId,
                        savedProduct.id(),
                        v.variantSku().trim(),
                        v.sizeLabel(),
                        v.colorLabel(),
                        v.garmentMeasurements() != null ? v.garmentMeasurements() : "{}"
                    );
                    return variantRepository.save(variant);
                })
                .toList();
        }

        return toResponse(savedProduct, savedVariants);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByShop(UUID shopId)
    {
        List<Product> products = productRepository.findAllByShopId(shopId);
        return products.stream()
            .map(p -> {
                List<ProductVariant> variants = variantRepository.findAllByShopIdAndProductId(shopId, p.id());
                return toResponse(p , variants);
            })
            .toList();
    }

    private ProductResponse toResponse(Product product, List<ProductVariant> variants) {
        List<ProductResponse.VariantResponse> variantDtos = variants.stream()
            .map(v -> new ProductResponse.VariantResponse(
                v.id(),
                v.variantSku(),
                v.sizeLabel(),
                v.colorLabel(),
                v.garmentMeasurements()
            ))
            .toList();

        return new ProductResponse(
            product.id(),
            product.shopId(),
            product.categoryId(),
            product.sku(),
            product.title(),
            product.description(),
            product.supportsRental(),
            product.supportsSale(),
            product.isPublished(),
            product.createdAt(),
            variantDtos
        );
    }
}
