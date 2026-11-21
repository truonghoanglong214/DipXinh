package com.dipxinh.identity.internal.application.port.out;

import com.dipxinh.identity.internal.domain.AppUser;

import java.util.Optional;
import java.util.UUID;

public interface AppUserRepository {
    Optional<AppUser> findByEmail(String email);
    Optional<AppUser> findById(UUID id);
    boolean existsByEmail(String email);
    AppUser save(AppUser user);
}
