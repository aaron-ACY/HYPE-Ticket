package com.huudan.hypeapi.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "BIGINT UNSIGNED")
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 255)
    private String subtitle;

    @Column(length = 500)
    private String excerpt;

    @Column(nullable = false, length = 50)
    private String category; // behind-the-stage, artist-spotlight, festival-guide, culture-trends

    @Column(name = "category_name", length = 100)
    private String categoryName;

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @Column(name = "published_date", length = 50)
    private String publishedDate;

    @Column(name = "read_time", length = 50)
    private String readTime;

    @Column(name = "author_name", length = 100)
    private String authorName;

    @Column(name = "author_role", length = 100)
    private String authorRole;

    @Column(name = "author_avatar", length = 500)
    private String authorAvatar;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean featured = false;

    @Column(name = "related_event_slug", length = 255)
    private String relatedEventSlug;

    @Column(name = "related_event_title", length = 255)
    private String relatedEventTitle;

    @Column(name = "content_json", columnDefinition = "LONGTEXT")
    private String contentJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
