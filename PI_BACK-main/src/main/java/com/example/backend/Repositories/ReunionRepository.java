package com.example.backend.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.Models.Reunion;

public interface ReunionRepository extends JpaRepository<Reunion,Long>{
 List<Reunion> findByEncadrantId(Long id);
}


