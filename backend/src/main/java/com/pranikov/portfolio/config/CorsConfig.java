package com.pranikov.portfolio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
	@Value("${app.cors.allowed-origins:}")
	private String allowedOrigins;

	@Value("${app.cors.allowed-origin-patterns:http://localhost:*,http://127.0.0.1:*}")
	private String allowedOriginPatterns;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		var reg = registry
				.addMapping("/api/**")
				.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
				.allowedHeaders("*")
				.allowCredentials(false);

		String[] patterns = splitCsv(allowedOriginPatterns);
		if (patterns.length > 0) {
			reg.allowedOriginPatterns(patterns);
		} else {
			reg.allowedOrigins(splitCsv(allowedOrigins));
		}
	}

	private String[] splitCsv(String csv) {
		return csv == null || csv.isBlank()
				? new String[0]
				: csv.split("\\s*,\\s*");
	}
}
