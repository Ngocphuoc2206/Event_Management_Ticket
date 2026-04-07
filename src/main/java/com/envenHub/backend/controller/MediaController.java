package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.response.UploadFileResponse;
import com.envenHub.backend.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @PostMapping(value = "/upload")
    public ApiResponse<UploadFileResponse> upload(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<UploadFileResponse>builder()
                .results(mediaService.uploadImage(file))
                .build();
    }
}
