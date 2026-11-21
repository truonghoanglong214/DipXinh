package com.dipxinh.identity.internal.infrastructure.repository;

import com.dipxinh.identity.internal.application.port.out.AppUserRepository;
import com.dipxinh.identity.internal.domain.AppUser;
import com.dipxinh.identity.internal.infrastructure.entity.AppUserEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaAppUserRepositoryAdapter
    implements AppUserRepository {

    private final SpringDataAppUserRepository jpaRepository;

    public JpaAppUserRepositoryAdapter(SpringDataAppUserRepository jpaRepository)
    {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<AppUser> findByEmail(String email) {
        return jpaRepository.findByEmail(email)
            .map(this::toDomain);
    }

    @Override
    public Optional<AppUser> findById(UUID id) {
        return jpaRepository.findById(id)
            .map(this::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    @Override
    public AppUser save(AppUser user)
    {
        AppUserEntity entity;
        if(user.getId() == null)
        {
            entity = new AppUserEntity(
                user.getEmail(),
                user.getPasswordHash(),
                user.getDisplayName(),
                user.getStatus()
            );
        }
        else {
            entity = jpaRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("User not found: " + user.getId()));
            entity.update(user.getDisplayName(), user.getStatus());
        }

        AppUserEntity saved = jpaRepository.save(entity);
        return toDomain(saved);
    }

    private AppUser toDomain(AppUserEntity entity) {
        return new AppUser(
            entity.getId(),
            entity.getEmail(),
            entity.getPasswordHash(),
            entity.getDisplayName(),
            entity.getStatus()
        );
    }
}
