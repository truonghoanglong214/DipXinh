package com.dipxinh.identity.internal.infrastructure.repository;

import com.dipxinh.identity.internal.infrastructure.entity.AuthSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpringDataAuthSessionRepository
    extends JpaRepository<AuthSessionEntity, UUID> {
}
