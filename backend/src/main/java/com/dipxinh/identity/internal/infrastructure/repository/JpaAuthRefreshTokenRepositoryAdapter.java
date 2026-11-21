package com.dipxinh.identity.internal.infrastructure.repository;

import com.dipxinh.identity.internal.application.port.out.AuthRefreshTokenRepository;
import com.dipxinh.identity.internal.domain.AuthRefreshToken;
import com.dipxinh.identity.internal.infrastructure.entity.AuthRefreshTokenEntity;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaAuthRefreshTokenRepositoryAdapter implements AuthRefreshTokenRepository {

    private final SpringDataAuthRefreshTokenRepository springDataRepo;

    public JpaAuthRefreshTokenRepositoryAdapter(SpringDataAuthRefreshTokenRepository springDataRepo) {
        this.springDataRepo = springDataRepo;
    }

    @Override
    public AuthRefreshToken save(AuthRefreshToken token) {
        AuthRefreshTokenEntity entity;
        if (token.id() == null) {
            entity = new AuthRefreshTokenEntity(
                token.sessionId(),
                token.tokenHash(),
                token.parentTokenId(),
                token.createdAt(),
                token.expiresAt()
            );
        } else {
            entity = springDataRepo.findById(token.id())
                .orElseThrow(() -> new IllegalStateException("Refresh token not found: " + token.id()));
            if (token.usedAt() != null) entity.markAsUsed(token.usedAt());
            if (token.revokedAt() != null) entity.markAsRevoked(token.revokedAt());
            if (token.reuseDetectedAt() != null) entity.markAsReuseDetected(token.reuseDetectedAt());
        }

        AuthRefreshTokenEntity saved = springDataRepo.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<AuthRefreshToken> findByTokenHash(String tokenHash) {
        return springDataRepo.findByTokenHash(tokenHash).map(this::toDomain);
    }

    @Override
    public void revokeAllBySessionId(UUID sessionId, Instant revokedAt) {
        springDataRepo.revokeAllBySessionId(sessionId, revokedAt);
    }

    private AuthRefreshToken toDomain(AuthRefreshTokenEntity entity) {
        return new AuthRefreshToken(
            entity.getId(),
            entity.getSessionId(),
            entity.getTokenHash(),
            entity.getParentTokenId(),
            entity.getCreatedAt(),
            entity.getExpiresAt(),
            entity.getUsedAt(),
            entity.getRevokedAt(),
            entity.getReuseDetectedAt()
        );
    }
}
