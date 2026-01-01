package com.pranikov.portfolio.media;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageAssetRepository extends JpaRepository<ImageAsset, Long> {
	List<ImageAsset> findAllByOrderByCreatedAtDesc();
}
