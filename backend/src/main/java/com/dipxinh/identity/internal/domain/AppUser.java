package com.dipxinh.identity.internal.domain;

import java.util.UUID;

public final class AppUser {

    private final UUID id;
    private final String email;
    private final String passwordHash;
    private final String displayName;
    private final UserStatus status;

    public AppUser(
        UUID id,
        String email,
        String passwordHash,
        String displayName,
        UserStatus status
    ) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.displayName = displayName;
        this.status = status;
    }

    public boolean canLogin() {
        return status == UserStatus.ACTIVE;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getDisplayName() {
        return displayName;
    }

    public UserStatus getStatus() {
        return status;
    }
}
