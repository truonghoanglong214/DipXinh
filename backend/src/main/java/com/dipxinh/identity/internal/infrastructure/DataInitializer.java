package com.dipxinh.identity.internal.infrastructure;


import com.dipxinh.identity.internal.application.port.out.AppUserRepository;
import com.dipxinh.identity.internal.application.port.out.ShopRepository;
import com.dipxinh.identity.internal.application.service.AuthService;
import com.dipxinh.identity.internal.application.service.ShopService;
import com.dipxinh.identity.internal.domain.AppUser;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final AuthService authService;
    private final AppUserRepository appUserRepository;
    private final ShopService shopService;
    private final ShopRepository shopRepository;

    public DataInitializer(
        AuthService authService,
        AppUserRepository appUserRepository,
        ShopService shopService,
        ShopRepository shopRepository
    ) {
        this.authService = authService;
        this.appUserRepository = appUserRepository;
        this.shopService = shopService;
        this.shopRepository = shopRepository;
    }

    @Override
    public void run(String... args) {
        if (!appUserRepository.existsByEmail("admin@dipxinh.vn")) {
            authService.register("admin@dipxinh.vn", "123456", "Quản Trị Viên Sàn");
        }

        AppUser owner = appUserRepository.findByEmail("owner@dipxinh.vn").orElseGet(() ->
            authService.register("owner@dipxinh.vn", "123456", "Bà Lê Thu Thảo (Chủ Shop)")
        );

        // Tạo shop mặc định aurora-boutique cho Chủ shop nếu chưa có
        if (!shopRepository.existsBySlug("aurora-boutique")) {
            shopService.createShop(owner.getId(), "Aurora Boutique", "aurora-boutique");
        }
    }
}
