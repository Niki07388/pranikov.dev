package com.pranikov.portfolio.contact;

import com.pranikov.portfolio.contact.dto.ContactMessageResponse;
import com.pranikov.portfolio.contact.dto.CreateContactMessageRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {
	private final ContactMessageService service;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ContactMessageResponse create(@Valid @RequestBody CreateContactMessageRequest request) {
		return service.create(request);
	}

	@GetMapping
	public List<ContactMessageResponse> list() {
		return service.list();
	}

	@GetMapping("/{id}")
	public ContactMessageResponse get(@PathVariable long id) {
		return service.get(id);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable long id) {
		service.delete(id);
	}
}
