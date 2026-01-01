package com.pranikov.portfolio.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Slf4j
@Configuration
public class CloudinaryConfig {

	@Bean
	public Cloudinary cloudinary() {
		log.info("Initializing Cloudinary...");
		
		// Read directly from system environment variables
		String cloudinaryUrl = System.getenv("CLOUDINARY_URL");
		String cloudName = System.getenv("CLOUDINARY_CLOUD_NAME");
		String apiKey = System.getenv("CLOUDINARY_API_KEY");
		String apiSecret = System.getenv("CLOUDINARY_API_SECRET");
		
		// Try CLOUDINARY_URL first (contains all credentials in one string)
		if (cloudinaryUrl != null && !cloudinaryUrl.isBlank()) {
			log.info("Found CLOUDINARY_URL environment variable, length: {}", cloudinaryUrl.length());
			try {
				Cloudinary cloudinary = new Cloudinary(cloudinaryUrl);
				log.info("✓ Cloudinary initialized successfully with CLOUDINARY_URL");
				return cloudinary;
			} catch (Exception e) {
				log.error("✗ Failed to initialize Cloudinary with CLOUDINARY_URL: {}", e.getMessage());
				throw new RuntimeException("Invalid CLOUDINARY_URL format: " + e.getMessage());
			}
		}

		// Fallback to individual environment variables
		log.info("CLOUDINARY_URL not found, using individual credentials");
		log.info("  CLOUDINARY_CLOUD_NAME: {}", cloudName == null ? "NOT SET" : "SET");
		log.info("  CLOUDINARY_API_KEY: {}", apiKey == null ? "NOT SET" : "SET (length: " + apiKey.length() + ")");
		log.info("  CLOUDINARY_API_SECRET: {}", apiSecret == null ? "NOT SET" : "SET (length: " + (apiSecret == null ? 0 : apiSecret.length()) + ")");
		
		if (cloudName == null || cloudName.isBlank()) {
			log.error("✗ CLOUDINARY_CLOUD_NAME not set - uploads will fail! Set env vars and restart.");
			throw new RuntimeException("Cloudinary configuration incomplete: CLOUDINARY_CLOUD_NAME not set");
		}
		if (apiKey == null || apiKey.isBlank()) {
			log.error("✗ CLOUDINARY_API_KEY not set - uploads will fail!");
			throw new RuntimeException("Cloudinary configuration incomplete: CLOUDINARY_API_KEY not set");
		}
		if (apiSecret == null || apiSecret.isBlank()) {
			log.error("✗ CLOUDINARY_API_SECRET not set - uploads will fail!");
			throw new RuntimeException("Cloudinary configuration incomplete: CLOUDINARY_API_SECRET not set");
		}
		
		Map<String, Object> config = ObjectUtils.asMap(
				"cloud_name", cloudName,
				"api_key", apiKey,
				"api_secret", apiSecret,
				"secure", true
		);
		Cloudinary cloudinary = new Cloudinary(config);
		log.info("✓ Cloudinary initialized with individual credentials (cloud_name: {})", cloudName);
		return cloudinary;
	}
}
