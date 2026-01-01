package com.pranikov.portfolio.media;

import com.pranikov.portfolio.media.dto.ImageAssetResponse;
import com.pranikov.portfolio.media.dto.ImageUploadResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageAssetService {
	private final ImageAssetRepository repository;
	private final Cloudinary cloudinary;

	@Value("${app.images.max-bytes:5242880}")
	private long maxBytes;

	@Value("${app.cloudinary.folder:portfolio}")
	private String cloudinaryFolder;

	public ImageUploadResponse upload(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("File is required");
		}
		String originalFilename = file.getOriginalFilename();
		if (originalFilename == null || originalFilename.isBlank()) {
			throw new IllegalArgumentException("Filename is required");
		}
		String contentType = file.getContentType();
		if (contentType == null || contentType.isBlank()) {
			throw new IllegalArgumentException("Content-Type is required");
		}
		if (!contentType.toLowerCase().startsWith("image/")) {
			throw new IllegalArgumentException("Only image uploads are supported");
		}
		if (file.getSize() > maxBytes) {
			throw new IllegalArgumentException("Image too large. Max bytes: " + maxBytes);
		}

		log.info("Uploading image: {} ({})", originalFilename, contentType);
		
		Map<?, ?> uploadResult;
		try {
			log.debug("Cloudinary folder: {}", cloudinaryFolder);
			uploadResult = cloudinary.uploader().upload(
					file.getBytes(),
					ObjectUtils.asMap(
							"resource_type", "image",
							"folder", cloudinaryFolder,
							"use_filename", true,
							"unique_filename", true
					)
			);
			log.info("Cloudinary upload success for: {}", originalFilename);
		} catch (Exception e) {
			log.error("Cloudinary upload failed", e);
			String msg = e.getMessage() != null ? e.getMessage() : "Cloudinary upload error";
			throw new IllegalStateException("Cloudinary upload failed: " + msg);
		}

		String secureUrl = uploadResult.get("secure_url") instanceof String s ? s : null;
		String publicId = uploadResult.get("public_id") instanceof String s ? s : null;
		if (secureUrl == null || secureUrl.isBlank() || publicId == null || publicId.isBlank()) {
			log.error("Cloudinary response missing secure_url or public_id");
			throw new IllegalStateException("Failed to upload image");
		}

		ImageAsset saved;
		try {
			ImageAsset entity = new ImageAsset();
			entity.setFilename(sanitizeFilename(originalFilename));
			entity.setContentType(contentType);
			entity.setSizeBytes(file.getSize());
			entity.setUrl(secureUrl);
			entity.setPublicId(publicId);
			saved = repository.save(entity);
			log.info("Image saved to database with ID: {}", saved.getId());
		} catch (DataAccessException e) {
			log.error("Failed to save image to database", e);
			// Avoid leaving orphaned Cloudinary assets
			try {
				cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("invalidate", true));
			} catch (Exception ignored) {
			}
			throw e;
		}

		return new ImageUploadResponse(saved.getId(), saved.getUrl());
	}

	public String getUrl(long id) {
		return repository.findById(id)
				.map(ImageAsset::getUrl)
				.orElseThrow(() -> new IllegalArgumentException("Image not found"));
	}

	public List<ImageAssetResponse> list() {
		return repository.findAllByOrderByCreatedAtDesc().stream()
				.map(a -> new ImageAssetResponse(
						a.getId(),
						a.getFilename(),
						a.getContentType(),
						a.getSizeBytes(),
						a.getCreatedAt(),
						a.getUrl()
				))
				.toList();
	}

	public void delete(long id) {
		ImageAsset existing = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Image not found"));

		try {
			cloudinary.uploader().destroy(existing.getPublicId(), ObjectUtils.asMap("invalidate", true));
		} catch (Exception e) {
			throw new IllegalStateException("Failed to delete image");
		}

		repository.delete(existing);
	}

	private String sanitizeFilename(String original) {
		String trimmed = original.trim();
		return trimmed.replaceAll("[\\r\\n]", "_");
	}
}
