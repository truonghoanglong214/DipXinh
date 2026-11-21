package com.dipxinh.identity.internal.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record CreateProductRequest(
    UUID categoryId,

    @NotBlank(message = "Mã SKU sản phẩm không được để trống")
    @Size(max = 80, message = "Mã SKU không được quá 80 ký tự")
    String sku,

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 220, message = "Tên sản phẩm không được quá 220 ký tự")
    String title,

    String description,
    boolean supportsRental,
    boolean supportsSale,
    boolean isPublished,
    List<CreateVariantDto> variants
) {
    public record CreateVariantDto(
        @NotBlank(message = "Mã SKU biến thể không được để trống")
        String variantSku,
        String sizeLabel,
        String colorLabel,
        String garmentMeasurements
    ) {}
}
