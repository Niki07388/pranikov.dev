package com.pranikov.portfolio.contact;

import com.pranikov.portfolio.contact.dto.ContactMessageResponse;
import com.pranikov.portfolio.contact.dto.CreateContactMessageRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactMessageService {
	private final ContactMessageRepository repository;

	public ContactMessageResponse create(CreateContactMessageRequest request) {
		ContactMessage entity = new ContactMessage();
		entity.setName(request.getName());
		entity.setEmail(request.getEmail());
		entity.setSubject(request.getSubject());
		entity.setMessage(request.getMessage());
		ContactMessage saved = repository.save(entity);
		return toResponse(saved);
	}

	public List<ContactMessageResponse> list() {
		return repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
				.stream()
				.map(this::toResponse)
				.toList();
	}

	public ContactMessageResponse get(long id) {
		return repository.findById(id)
				.map(this::toResponse)
				.orElseThrow(() -> new IllegalArgumentException("Contact message not found"));
	}

	public void delete(long id) {
		repository.deleteById(id);
	}

	private ContactMessageResponse toResponse(ContactMessage entity) {
		return ContactMessageResponse.builder()
				.id(entity.getId())
				.name(entity.getName())
				.email(entity.getEmail())
				.subject(entity.getSubject())
				.message(entity.getMessage())
				.createdAt(entity.getCreatedAt())
				.build();
	}
}
