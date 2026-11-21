package com.dipxinh.identity.internal.web;

import com.dipxinh.identity.internal.application.exception.SlugAlreadyExistsException;
import com.dipxinh.identity.internal.application.service.ShopService;
import com.dipxinh.identity.internal.domain.Shop;
import com.dipxinh.identity.internal.security.UserPrincipal;
import com.dipxinh.identity.internal.web.dto.CreateShopRequest;
import com.dipxinh.identity.internal.web.dto.ShopResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
public class ShopController {
    private final ShopService shopService;

    public ShopController(ShopService shopService)
    {
        this.shopService = shopService;
    }

    @PostMapping("/v1/shops")
    public ResponseEntity<ShopResponse> createShop(
        @AuthenticationPrincipal UserPrincipal principal,
        @Valid @RequestBody CreateShopRequest request
        )
    {
        Shop shop = shopService.createShop(principal.userId(), request.name(), request.slug());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(shop));
    }

    @GetMapping("/v1/storefront/shops/{slug}")
    public ResponseEntity<ShopResponse> getBySlug(
        @PathVariable String slug
    )
    {
        return shopService.getBySlug(slug)
            .map(shop -> ResponseEntity.ok(toResponse(shop)))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @ExceptionHandler(SlugAlreadyExistsException.class)
    public ResponseEntity<ProblemDetail> handleSlugExists(SlugAlreadyExistsException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setTitle("Shop Slug Already Exists");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problem);
    }

    private ShopResponse toResponse(Shop shop) {
        return new ShopResponse(
            shop.id(),
            shop.slug(),
            shop.name(),
            shop.status(),
            shop.ownerUserId(),
            shop.createdAt()
        );
    }
}
