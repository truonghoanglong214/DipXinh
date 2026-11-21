package com.dipxinh.identity.internal.infrastructure.repository;

import com.dipxinh.identity.internal.application.port.out.AuthSessionRepository;
import com.dipxinh.identity.internal.domain.AuthSession;
import com.dipxinh.identity.internal.infrastructure.entity.AuthSessionEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaAuthSessionRepositoryAdapter
    implements AuthSessionRepository
{
    private final SpringDataAuthSessionRepository authSessionRepository;

    public JpaAuthSessionRepositoryAdapter(SpringDataAuthSessionRepository authSessionRepository)
    {
        this.authSessionRepository = authSessionRepository;
    }

    @Override
    public AuthSession save(AuthSession authSession) {
        AuthSessionEntity entity;
        if (authSession.id() == null) {
             entity = new AuthSessionEntity(
                authSession.userId(),
                authSession.clientLabel(),
                authSession.createdAt(),
                authSession.lastUsedAt(),
                authSession.absoluteExpiresAt());

        } else {
            entity = authSessionRepository.findById(authSession.id()).orElseThrow(
                () -> new IllegalStateException("Auth session not found: " + authSession.id()));
            entity.updateState(
                authSession.lastUsedAt(),
                authSession.revokedAt(),
                authSession.revocationReason());
        }



        AuthSessionEntity savedEntity = authSessionRepository.save(entity);

        return toDomain(savedEntity);
    }

    @Override
    public Optional<AuthSession> findById(UUID id)
    {
        return authSessionRepository.findById(id)
            .map(this::toDomain);
    }

    private AuthSession toDomain(AuthSessionEntity authSessionEntity)
    {
        return new AuthSession(
            authSessionEntity.getId(),
            authSessionEntity.getUserId(),
            authSessionEntity.getClientLabel(),
            authSessionEntity.getCreatedAt(),
            authSessionEntity.getLastUsedAt(),
            authSessionEntity.getAbsoluteExpiresAt(),
            authSessionEntity.getRevokedAt(),
            authSessionEntity.getRevocationReason()
        );
    }
}
