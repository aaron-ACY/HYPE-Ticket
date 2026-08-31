package com.huudan.hypeapi.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huudan.hypeapi.dto.ArticleDto;
import com.huudan.hypeapi.dto.CreateArticleRequest;
import com.huudan.hypeapi.model.Article;
import com.huudan.hypeapi.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final ObjectMapper objectMapper;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Autowired
    public ArticleService(ArticleRepository articleRepository, ObjectMapper objectMapper) {
        this.articleRepository = articleRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public List<ArticleDto> getAllArticles(String category) {
        List<Article> list;
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("all")) {
            list = articleRepository.findByCategory(category.trim());
        } else {
            list = articleRepository.findAllByOrderByCreatedAtDesc();
        }
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ArticleDto> getFeaturedArticles() {
        return articleRepository.findByFeaturedTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ArticleDto getArticleBySlug(String slug) {
        Article article = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));
        return mapToDto(article);
    }

    @Transactional
    public ArticleDto createArticle(CreateArticleRequest req) {
        String baseSlug = toSlug(req.getTitle());
        String slug = baseSlug;
        int count = 1;
        while (articleRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + count++;
        }

        String contentJson = null;
        if (req.getContent() != null) {
            try {
                contentJson = objectMapper.writeValueAsString(req.getContent());
            } catch (Exception ignored) {}
        }

        Article article = Article.builder()
                .slug(slug)
                .title(req.getTitle())
                .subtitle(req.getSubtitle())
                .excerpt(req.getExcerpt())
                .category(req.getCategory())
                .categoryName(req.getCategoryName() != null ? req.getCategoryName() : req.getCategory())
                .coverImage(req.getCoverImage())
                .publishedDate(LocalDateTime.now().format(DATE_FORMATTER))
                .readTime(req.getReadTime() != null ? req.getReadTime() : "5 phút đọc")
                .authorName(req.getAuthorName() != null ? req.getAuthorName() : "Hype Editorial Team")
                .authorRole(req.getAuthorRole() != null ? req.getAuthorRole() : "Music Journalist")
                .authorAvatar(req.getAuthorAvatar())
                .featured(req.getFeatured() != null ? req.getFeatured() : false)
                .relatedEventSlug(req.getRelatedEventSlug())
                .relatedEventTitle(req.getRelatedEventTitle())
                .contentJson(contentJson)
                .build();

        return mapToDto(articleRepository.save(article));
    }

    @Transactional
    public ArticleDto updateArticle(Long id, CreateArticleRequest req) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        if (req.getTitle() != null) article.setTitle(req.getTitle());
        if (req.getSubtitle() != null) article.setSubtitle(req.getSubtitle());
        if (req.getExcerpt() != null) article.setExcerpt(req.getExcerpt());
        if (req.getCategory() != null) article.setCategory(req.getCategory());
        if (req.getCategoryName() != null) article.setCategoryName(req.getCategoryName());
        if (req.getCoverImage() != null) article.setCoverImage(req.getCoverImage());
        if (req.getReadTime() != null) article.setReadTime(req.getReadTime());
        if (req.getAuthorName() != null) article.setAuthorName(req.getAuthorName());
        if (req.getAuthorRole() != null) article.setAuthorRole(req.getAuthorRole());
        if (req.getAuthorAvatar() != null) article.setAuthorAvatar(req.getAuthorAvatar());
        if (req.getFeatured() != null) article.setFeatured(req.getFeatured());
        if (req.getRelatedEventSlug() != null) article.setRelatedEventSlug(req.getRelatedEventSlug());
        if (req.getRelatedEventTitle() != null) article.setRelatedEventTitle(req.getRelatedEventTitle());

        if (req.getContent() != null) {
            try {
                article.setContentJson(objectMapper.writeValueAsString(req.getContent()));
            } catch (Exception ignored) {}
        }

        return mapToDto(articleRepository.save(article));
    }

    @Transactional
    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }

    public ArticleDto mapToDto(Article a) {
        List<Map<String, String>> contentList = new ArrayList<>();
        if (a.getContentJson() != null && !a.getContentJson().trim().isEmpty()) {
            try {
                contentList = objectMapper.readValue(a.getContentJson(), new TypeReference<List<Map<String, String>>>() {});
            } catch (Exception ignored) {}
        }

        return ArticleDto.builder()
                .id(a.getId())
                .slug(a.getSlug())
                .title(a.getTitle())
                .subtitle(a.getSubtitle())
                .excerpt(a.getExcerpt())
                .category(a.getCategory())
                .categoryName(a.getCategoryName())
                .coverImage(a.getCoverImage())
                .publishedDate(a.getPublishedDate())
                .readTime(a.getReadTime())
                .author(ArticleDto.AuthorDto.builder()
                        .name(a.getAuthorName())
                        .role(a.getAuthorRole())
                        .avatar(a.getAuthorAvatar())
                        .build())
                .featured(a.getFeatured())
                .relatedEventSlug(a.getRelatedEventSlug())
                .relatedEventTitle(a.getRelatedEventTitle())
                .content(contentList)
                .build();
    }

    private String toSlug(String input) {
        if (input == null) return "";
        String nfdNormalizedString = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(nfdNormalizedString).replaceAll("");
        slug = slug.toLowerCase().replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-").replaceAll("-+", "-");
        if (slug.startsWith("-")) slug = slug.substring(1);
        if (slug.endsWith("-")) slug = slug.substring(0, slug.length() - 1);
        return slug;
    }
}
