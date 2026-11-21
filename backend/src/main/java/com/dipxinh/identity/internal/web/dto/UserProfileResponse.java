package com.dipxinh.identity.internal.web.dto;

import java.util.UUID;

public record UserProfileResponse(
    UUID id,
    String email,
    String displayName
) {
}
