package com.dipxinh.identity.internal.web;

import com.dipxinh.identity.internal.application.service.AuthService;
import com.dipxinh.identity.internal.application.service.ShopService;
import com.dipxinh.identity.internal.domain.AppUser;
import com.dipxinh.identity.internal.security.UserPrincipal;
import com.dipxinh.identity.internal.web.dto.ShopResponse;
import com.dipxinh.identity.internal.web.dto.UserProfileResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/me")
public class MeController {
    private final AuthService authService;
    private final ShopService shopService;

    public MeController(AuthService authService, ShopService shopService)
    {
        this.authService = authService;
        this.shopService = shopService;
    }

    @GetMapping
    public ResponseEntity<UserProfileResponse> getMe(@AuthenticationPrincipal UserPrincipal principal)
    {
        AppUser appUser = authService.getProfile(principal.userId());
        return ResponseEntity.ok(new UserProfileResponse(
            appUser.getId(),
            appUser.getEmail(),
            appUser.getDisplayName()
        ));
    }

    @GetMapping("/shops")
    public ResponseEntity<List<ShopResponse>> getMyShops(@AuthenticationPrincipal UserPrincipal principal)
    {
        var shop = shopService.getMyShops(principal.userId());
        var response = shop.stream()
            .map(s -> new ShopResponse(s.id(), s.slug(), s.name(), s.status(), s.ownerUserId(), s.createdAt()))
            .toList();

        return ResponseEntity.ok(response);
    }
}
