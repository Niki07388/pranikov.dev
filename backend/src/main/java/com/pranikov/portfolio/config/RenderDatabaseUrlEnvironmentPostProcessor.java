package com.pranikov.portfolio.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * Render typically provides DATABASE_URL in the form:
 *   postgres://user:pass@host:port/dbname
 * Spring expects a JDBC URL. This post-processor converts it at startup.
 */
public class RenderDatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {
	@Override
	public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
		// If the user explicitly configured the datasource URL (via env/props), do not override it.
		// Note: application.yml provides a default, so we cannot rely on spring.datasource.url being blank.
		String explicitUrl = environment.getProperty("SPRING_DATASOURCE_URL");
		String explicitDbUrl = environment.getProperty("DB_URL");
		if ((explicitUrl != null && !explicitUrl.isBlank()) || (explicitDbUrl != null && !explicitDbUrl.isBlank())) {
			return;
		}

		String databaseUrl = environment.getProperty("DATABASE_URL");
		if (databaseUrl == null || databaseUrl.isBlank()) {
			return;
		}

		try {
			URI uri = URI.create(databaseUrl);

			String scheme = uri.getScheme();
			if (scheme == null) return;
			// Accept postgres:// and postgresql://
			if (!scheme.equalsIgnoreCase("postgres") && !scheme.equalsIgnoreCase("postgresql")) {
				return;
			}

			String userInfo = uri.getUserInfo();
			String username = null;
			String password = null;
			if (userInfo != null && !userInfo.isBlank()) {
				String decodedUserInfo = java.net.URLDecoder.decode(userInfo, java.nio.charset.StandardCharsets.UTF_8);
				if (decodedUserInfo.contains(":")) {
					String[] parts = decodedUserInfo.split(":", 2);
					username = parts[0];
					password = parts[1];
				} else {
					username = decodedUserInfo;
				}
			}

			String host = uri.getHost();
			if (host == null || host.isBlank()) {
				return;
			}
			int port = uri.getPort();
			String path = uri.getPath();
			if (path == null || path.isBlank() || path.equals("/")) {
				return;
			}
			String query = uri.getQuery();

			StringBuilder jdbc = new StringBuilder();
			jdbc.append("jdbc:postgresql://");
			jdbc.append(host);
			if (port > 0) {
				jdbc.append(":").append(port);
			}
			jdbc.append(path);
			if (query != null && !query.isBlank()) {
				jdbc.append("?").append(query);
			}

			Map<String, Object> props = new HashMap<>();
			props.put("spring.datasource.url", jdbc.toString());
			if (username != null && !username.isBlank()) props.put("spring.datasource.username", username);
			if (password != null && !password.isBlank()) props.put("spring.datasource.password", password);

			environment.getPropertySources().addFirst(new MapPropertySource("renderDatabaseUrl", props));
		} catch (Exception ignored) {
			// If parsing fails, let Spring fail with a clear datasource error.
		}
	}

	@Override
	public int getOrder() {
		// Run early
		return Ordered.HIGHEST_PRECEDENCE;
	}
}
