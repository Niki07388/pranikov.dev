package com.pranikov.portfolio.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AdminApiKeyFilter extends OncePerRequestFilter {
	private static final String HEADER = "X-Admin-Key";

	@Value("${app.admin.api-key:}")
	private String adminApiKey;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
			filterChain.doFilter(request, response);
			return;
		}

		String uri = request.getRequestURI();
		boolean protectImages = uri != null && uri.startsWith("/api/images")
				&& ("POST".equalsIgnoreCase(request.getMethod()) || "DELETE".equalsIgnoreCase(request.getMethod()));
		boolean protectContact = uri != null && uri.startsWith("/api/contact")
				&& "DELETE".equalsIgnoreCase(request.getMethod());

		if (!(protectImages || protectContact)) {
			filterChain.doFilter(request, response);
			return;
		}

		// If not configured, keep behavior open (useful for local dev).
		if (adminApiKey == null || adminApiKey.isBlank()) {
			filterChain.doFilter(request, response);
			return;
		}

		String provided = request.getHeader(HEADER);
		if (provided == null || !provided.equals(adminApiKey)) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.getWriter().write("{\"error\":\"Unauthorized\"}");
			return;
		}

		filterChain.doFilter(request, response);
	}
}
