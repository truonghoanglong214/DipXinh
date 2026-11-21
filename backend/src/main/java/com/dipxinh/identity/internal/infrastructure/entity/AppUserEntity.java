package com.dipxinh.identity.internal.infrastructure.entity;

import com.dipxinh.identity.internal.domain.UserStatus;
import jakarta.persistence.*;
import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties;

import java.util.UUID;

@Entity
@Table(name = "app_users")
public class AppUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "email", nullable = false, length = 320)
    private String email;

    @Column(name = "password_hash", nullable = false, columnDefinition = "text")
    private String passwordHash;

    @Column(name = "display_name", length = 160)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 24)
    private UserStatus status = UserStatus.ACTIVE;

    protected AppUserEntity() {

    }

    public UUID getId() {
        return id;
    }

    public String getEmail()
    {
        return email;
    }

    public AppUserEntity(String email, String passwordHash, String displayName, UserStatus status)
    {
        this.email = email;
        this.passwordHash = passwordHash;
        this.displayName = displayName;
        this.status = status != null ? status : UserStatus.ACTIVE;
    }

    public void update(String displayName, UserStatus status)
    {
        this.displayName = displayName;
        this.status = status;
    }
    public String getDisplayName()
    {
        return displayName;
    }

    public String getPasswordHash()
    {
        return passwordHash;
    }

    public UserStatus getStatus()
    {
        return status;
    }
}
