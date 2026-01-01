package com.pranikov.portfolio.media.dto;

import java.time.Instant;

public record ImageAssetResponse(
		Long id,
		String filename,
		String contentType,
		Long sizeBytes,
		Instant createdAt,
		String url
) {
}
