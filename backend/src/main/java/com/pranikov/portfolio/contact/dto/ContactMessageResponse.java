package com.pranikov.portfolio.contact.dto;

import lombok.Builder;

import java.time.Instant;

@Builder
public record ContactMessageResponse(
		Long id,
		String name,
		String email,
		String subject,
		String message,
		Instant createdAt
) {
}
