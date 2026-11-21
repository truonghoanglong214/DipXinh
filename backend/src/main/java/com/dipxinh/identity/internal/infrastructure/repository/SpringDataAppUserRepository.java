package com.dipxinh.identity.internal.infrastructure.repository;

import com.dipxinh.identity.internal.infrastructure.entity.AppUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SpringDataAppUserRepository
    extends JpaRepository<AppUserEntity, UUID> {
    Optional<AppUserEntity> findByEmail(String email);
    boolean existsByEmail(String email);
}
