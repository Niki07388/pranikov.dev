package com.pranikov.portfolio.media;

import com.pranikov.portfolio.media.dto.ImageAssetResponse;
import com.pranikov.portfolio.media.dto.ImageUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageAssetController {
	private final ImageAssetService service;

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseStatus(HttpStatus.CREATED)
	public ImageUploadResponse upload(@RequestPart("file") MultipartFile file) {
		return service.upload(file);
	}

	@GetMapping
	public List<ImageAssetResponse> list() {
		return service.list();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Void> download(@PathVariable long id) {
		String url = service.getUrl(id);
		return ResponseEntity.status(HttpStatus.FOUND)
				.header(HttpHeaders.LOCATION, url)
				.build();
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable long id) {
		service.delete(id);
	}
}
