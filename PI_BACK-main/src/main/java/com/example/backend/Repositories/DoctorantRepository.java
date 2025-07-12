package com.example.backend.Repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.Dto.MembreDirectionDTO;
import com.example.backend.Models.Doctorants;
import com.example.backend.Models.Echeance;

@Repository
public interface DoctorantRepository extends JpaRepository<Doctorants, Long> {

    @Query("""
                SELECT new com.example.backend.Dto.MembreDirectionDTO(
                    u.lastname, u.firstName, 'Directeur', u.email
                )
                FROM Doctorants d
                JOIN d.directeur dir
                JOIN dir.user u
                WHERE d.user.id = :userId
            """)
    List<MembreDirectionDTO> findDirecteurByDoctorantUserId(Long userId);

    @Query("""
                SELECT new com.example.backend.Dto.MembreDirectionDTO(
                    u.lastname, u.firstName, 'Encadrant', u.email
                )
                FROM Doctorants d
                JOIN d.encadrants e
                JOIN e.user u
                WHERE d.user.id = :userId
            """)
    List<MembreDirectionDTO> findEncadrantsByDoctorantUserId(Long userId);

    Optional<Doctorants> findById(Long id);

    Doctorants findByUserId(Long userId);

    // Dans EcheanceRepository
 

    // Dans MessageRepository

}
