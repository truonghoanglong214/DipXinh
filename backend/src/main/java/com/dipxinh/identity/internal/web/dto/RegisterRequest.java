package com.dipxinh.identity.internal.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Email can not be empty.")
    @Email(message = "Email is invalid.")
    @Size(max = 320, message = "Email can not exceed 320 characters.")
    String email,

    @NotBlank(message = "Password can not be empty.")
    @Size(min = 5, max = 100, message = "Password can not exceed 50 characters.")
    String password,

    @NotBlank(message = "Display name can not be empty.")
    @Size(max = 150, message = "Display name can not exceed 150 characters.")
    String displayName
) {
}
