package com.huudan.hypeapi.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Autowired
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        Map<?, ?> options = ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "auto"
        );
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
        return (String) uploadResult.get("secure_url");
    }

    public void deleteFile(String url) {
        String publicId = extractPublicId(url);
        if (publicId != null) {
            try {
                cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("invalidate", true));
            } catch (IOException e) {
                System.err.println("Lỗi xoá ảnh trên Cloudinary: " + e.getMessage());
            }
        }
    }

    public String extractPublicId(String url) {
        if (url == null || !url.contains("res.cloudinary.com")) {
            return null;
        }
        try {
            int uploadIndex = url.indexOf("/upload/");
            if (uploadIndex == -1) return null;

            String pathAfterUpload = url.substring(uploadIndex + 8);
            
            if (pathAfterUpload.startsWith("v")) {
                int firstSlash = pathAfterUpload.indexOf('/');
                if (firstSlash != -1) {
                    pathAfterUpload = pathAfterUpload.substring(firstSlash + 1);
                }
            }

            int dotIndex = pathAfterUpload.lastIndexOf('.');
            if (dotIndex != -1) {
                pathAfterUpload = pathAfterUpload.substring(0, dotIndex);
            }

            return pathAfterUpload;
        } catch (Exception e) {
            return null;
        }
    }
}
