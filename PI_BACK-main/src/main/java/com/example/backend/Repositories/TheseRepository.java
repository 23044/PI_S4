package com.example.backend.Repositories;

import com.example.backend.Models.These;
import com.example.backend.Models.These.Statut;

import java.lang.classfile.ClassFile.Option;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TheseRepository extends JpaRepository<These, Long> {
    These findByDoctorantId(Long doctorantId);

    // Optional<These> findById(Long id);
    List<These> findByStatut(These.Statut statut);

    List<These> findByChercheurId(Long chercheurId);

    @Query("SELECT DISTINCT t.statut FROM These t WHERE t.statut IS NOT NULL")
    List<String> findDistinctStatuts();

    @Query("SELECT DISTINCT t.langue FROM These t WHERE t.langue IS NOT NULL")
    List<String> findDistinctLangues();

    @Query("SELECT DISTINCT e.nom FROM These t JOIN t.etablissement e WHERE e.nom IS NOT NULL")
    List<String> findDistinctEtablissements();

    @Query("SELECT DISTINCT t.motClesString FROM These t WHERE t.motClesString IS NOT NULL")
    List<String> findDistinctMotCles();

    @Query("SELECT DISTINCT EXTRACT(YEAR FROM t.dateSoutenance) FROM These t WHERE t.dateSoutenance IS NOT NULL")
    List<Integer> findDistinctAnneesSoutenance();

    long countByStatut(Statut statut);

    // @Query("SELECT t FROM These t WHERE t.motCles LIKE %:keyword%")
    // List<These> findByMotClesContaining(@Param("keyword") String keyword);
}