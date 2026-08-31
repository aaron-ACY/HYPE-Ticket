package com.huudan.hypeapi.dto;

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
public class ArticleDto {
    private Long id;
    private String slug;
    private String title;
    private String subtitle;
    private String excerpt;
    private String category;
    private String categoryName;
    private String coverImage;
    private String publishedDate;
    private String readTime;
    private AuthorDto author;
    private Boolean featured;
    private String relatedEventSlug;
    private String relatedEventTitle;
    private List<Map<String, String>> content;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorDto {
        private String name;
        private String role;
        private String avatar;
    }
}
