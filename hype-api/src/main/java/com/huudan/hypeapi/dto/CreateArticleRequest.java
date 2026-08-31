package com.huudan.hypeapi.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateArticleRequest {
    @NotBlank(message = "Tiêu đề bài viết không được để trống")
    private String title;

    private String subtitle;
    private String excerpt;

    @NotBlank(message = "Chuyên mục không được để trống")
    private String category;

    private String categoryName;
    private String coverImage;
    private String readTime;
    private String authorName;
    private String authorRole;
    private String authorAvatar;
    private Boolean featured;
    private String relatedEventSlug;
    private String relatedEventTitle;
    private List<Map<String, String>> content;
}
