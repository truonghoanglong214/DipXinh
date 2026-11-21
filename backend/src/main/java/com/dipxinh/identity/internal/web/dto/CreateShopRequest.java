package com.dipxinh.identity.internal.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateShopRequest(
    @NotBlank(message = "Tên cửa hàng không được để trống")
    @Size(max = 200, message = "Tên cửa hàng không được vượt quá 200 ký tự")
    String name,

    @NotBlank(message = "Slug không được để trống")
    @Size(max = 90, message = "Slug không được vượt quá 90 ký tự")
    @Pattern(
        regexp = "^[a-z0-9]+(-[a-z0-9]+)*$",
        message = "Slug chỉ chứa chữ thường không dấu, số và dấu gạch nối (ví dụ: aurora-boutique)"
    )
    String slug
) {
}
