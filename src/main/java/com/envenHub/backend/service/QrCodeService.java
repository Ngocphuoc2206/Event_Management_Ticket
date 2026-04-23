package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.service.S3_storage.StorageService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class QrCodeService {
    @Autowired
    private StorageService storageService;

    public String generateAndUploadTicketQr(String ticketCode) {
        log.info("generateAndUploadTicketQr called: ticketCode={}", ticketCode);

        try {
            String qrContent = buildQrContent(ticketCode);
            byte[] pngBytes = generateQrPng(qrContent);

            String uploadedUrl = storageService.uploadBytes(
                    pngBytes,
                    ticketCode + ".png",
                    "image/png",
                    "tickets/qr"
            );

            log.info(
                    "generateAndUploadTicketQr success: ticketCode={}, fileName={}, uploadedUrl={}",
                    ticketCode, ticketCode + ".png", uploadedUrl
            );

            return uploadedUrl;
        } catch (Exception e) {
            log.error("generateAndUploadTicketQr failed: ticketCode={}", ticketCode, e);
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    private String buildQrContent(String ticketCode) {
        String qrContent = "ticket_code:" + ticketCode;
        log.info("buildQrContent success: ticketCode={}, qrContent={}", ticketCode, qrContent);
        return qrContent;
    }

    private byte[] generateQrPng(String content) throws Exception {
        log.info("generateQrPng called: content={}", content);

        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.MARGIN, 1);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

        BitMatrix bitMatrix = new MultiFormatWriter()
                .encode(content, BarcodeFormat.QR_CODE, 300, 300, hints);

        BufferedImage image = toBufferedImage(bitMatrix);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(image, "png", outputStream);

        byte[] pngBytes = outputStream.toByteArray();
        log.info("generateQrPng success: content={}, byteSize={}", content, pngBytes.length);

        return pngBytes;
    }

    private BufferedImage toBufferedImage(BitMatrix matrix) {
        int width = matrix.getWidth();
        int height = matrix.getHeight();

        log.info("toBufferedImage called: width={}, height={}", width, height);

        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

        Graphics2D graphics = image.createGraphics();
        graphics.setColor(Color.WHITE);
        graphics.fillRect(0, 0, width, height);
        graphics.setColor(Color.BLACK);

        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                if (matrix.get(x, y)) {
                    image.setRGB(x, y, Color.BLACK.getRGB());
                }
            }
        }

        graphics.dispose();

        log.info("toBufferedImage success: width={}, height={}", width, height);
        return image;
    }
}