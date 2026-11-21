package com.dipxinh.identity.internal.web.dto;

public record LoginResponse(
    String accessToken,
    UserProfileResponse user
) {
}
