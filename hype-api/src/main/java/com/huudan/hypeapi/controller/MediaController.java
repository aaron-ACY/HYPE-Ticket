package com.huudan.hypeapi.controller;

import com.huudan.hypeapi.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/media")
public class MediaController {

    private final CloudinaryService cloudinaryService;

    @Autowired
    public MediaController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                        @RequestParam(value = "folder", defaultValue = "hype_ticket") String folder) {
        if (file.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "File upload không được để trống");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            String url = cloudinaryService.uploadFile(file, folder);
            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Lỗi tải ảnh lên Cloudinary: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
