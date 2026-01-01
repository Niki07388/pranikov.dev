package com.pranikov.portfolio.contact.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateContactMessageRequest {
	@NotBlank
	@Size(max = 120)
	private String name;

	@NotBlank
	@Email
	@Size(max = 180)
	private String email;

	@Size(max = 200)
	private String subject;

	@NotBlank
	@Size(max = 4000)
	private String message;
}
