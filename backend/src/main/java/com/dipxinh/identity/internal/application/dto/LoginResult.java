package com.dipxinh.identity.internal.application.dto;

import com.dipxinh.identity.internal.domain.AppUser;
import com.dipxinh.identity.internal.domain.AuthSession;

import java.time.Instant;

public record LoginResult(
    AppUser user,
    AuthSession session,
    String accessToken,
    String rawRefreshToken,
    Instant refreshTokenExpiresAt
) {
}
