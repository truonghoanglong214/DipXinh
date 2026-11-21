package com.dipxinh.identity.internal.application.port.out;

import com.dipxinh.identity.internal.domain.AuthSession;

import java.util.Optional;
import java.util.UUID;

public interface AuthSessionRepository {
    AuthSession save(AuthSession authSession);
    Optional<AuthSession> findById(UUID id);
}
