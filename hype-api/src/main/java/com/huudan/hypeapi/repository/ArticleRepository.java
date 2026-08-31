package com.huudan.hypeapi.repository;

import com.huudan.hypeapi.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    Optional<Article> findBySlug(String slug);
    List<Article> findByFeaturedTrue();
    List<Article> findByCategory(String category);
    List<Article> findAllByOrderByCreatedAtDesc();
}
