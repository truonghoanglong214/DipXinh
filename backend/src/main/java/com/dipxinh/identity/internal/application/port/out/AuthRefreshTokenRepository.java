package com.dipxinh.identity.internal.application.port.out;

import com.dipxinh.identity.internal.domain.AuthRefreshToken;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface AuthRefreshTokenRepository {

    AuthRefreshToken save(AuthRefreshToken token);

    Optional<AuthRefreshToken> findByTokenHash(String tokenHash);

    void revokeAllBySessionId(UUID sessionId, Instant revokedAt);
}
