package com.huudan.hypeapi.controller;

import com.huudan.hypeapi.dto.ArticleDto;
import com.huudan.hypeapi.dto.CreateArticleRequest;
import com.huudan.hypeapi.service.ArticleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class ArticleController {

    private final ArticleService articleService;

    @Autowired
    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping("/articles")
    public ResponseEntity<List<ArticleDto>> getAllArticles(
            @RequestParam(value = "category", required = false) String category) {
        return ResponseEntity.ok(articleService.getAllArticles(category));
    }

    @GetMapping("/articles/featured")
    public ResponseEntity<List<ArticleDto>> getFeaturedArticles() {
        return ResponseEntity.ok(articleService.getFeaturedArticles());
    }

    @GetMapping("/articles/{slug}")
    public ResponseEntity<?> getArticleBySlug(@PathVariable String slug) {
        try {
            return ResponseEntity.ok(articleService.getArticleBySlug(slug));
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PostMapping("/admin/articles")
    public ResponseEntity<?> createArticle(
            @Valid @RequestBody CreateArticleRequest req,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        try {
            ArticleDto created = articleService.createArticle(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/admin/articles/{id}")
    public ResponseEntity<?> updateArticle(
            @PathVariable Long id,
            @RequestBody CreateArticleRequest req) {
        try {
            ArticleDto updated = articleService.updateArticle(id, req);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/admin/articles/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        try {
            articleService.deleteArticle(id);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Xóa bài viết thành công");
            return ResponseEntity.ok(res);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
