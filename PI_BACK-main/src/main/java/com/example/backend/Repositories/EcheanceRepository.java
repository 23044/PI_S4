package com.example.backend.Repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.Models.Echeance;
import com.example.backend.Models.StatutEcheance;

public interface EcheanceRepository extends JpaRepository<Echeance, Long> {
    List<Echeance> findByUserId_Id(Long id);

    @Query("SELECT e FROM Echeance e WHERE e.user.id = :userId AND (e.statut = :statut OR e.dateLimite <= :limit)")
    List<Echeance> findByUserIdAndStatutOrDateLimiteBefore(
            @Param("userId") Long userId,
            @Param("statut") StatutEcheance statut,
            @Param("limit") LocalDate limit);
}
