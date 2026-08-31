package com.huudan.hypeapi.service;

import com.huudan.hypeapi.dto.CategoryDto;
import com.huudan.hypeapi.mapper.CategoryMapper;
import com.huudan.hypeapi.model.Category;
import com.huudan.hypeapi.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryMapper.toDtoList(categoryRepository.findAll());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thể loại với slug: " + slug));
        return categoryMapper.toDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsBySlug(dto.getSlug())) {
            throw new RuntimeException("Slug danh mục đã tồn tại");
        }
        Category category = categoryMapper.toEntity(dto);
        return categoryMapper.toDto(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));
        category.setName(dto.getName());
        if (dto.getSlug() != null && !dto.getSlug().equals(category.getSlug())) {
            if (categoryRepository.existsBySlug(dto.getSlug())) {
                throw new RuntimeException("Slug danh mục đã tồn tại");
            }
            category.setSlug(dto.getSlug());
        }
        category.setIconName(dto.getIconName());
        category.setImageUrl(dto.getImageUrl());
        return categoryMapper.toDto(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
