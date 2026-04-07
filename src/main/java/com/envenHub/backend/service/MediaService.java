package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.response.UploadFileResponse;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.service.S3_storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Service
public class MediaService {
    @Autowired
    private StorageService storageService;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/png",
            "image/jpeg",
            "image/webp"
    );
    private static final long MAX_SIZE = 5 * 1024 * 1024;

    public UploadFileResponse uploadImage(MultipartFile file){
        validate(file);

        String url = storageService.uploadFile(file, "event-banners");

        return UploadFileResponse.builder()
                .fileName(file.getOriginalFilename())
                .url(url)
                .contentType(file.getContentType())
                .size(file.getSize())
                .build();
    }

    private void validate(MultipartFile file){
        if (file == null || file.isEmpty()){
            throw new AppException(ErrorCode.INVALID_FILE);
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);
        }

        if (file.getSize() > MAX_SIZE) {
            throw new AppException(ErrorCode.FILE_TOO_LARGE);
        }
    }
}
