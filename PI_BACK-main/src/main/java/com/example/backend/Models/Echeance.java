package com.example.backend.Models;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "echeance")
public class Echeance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;

    private LocalDate dateLimite;

    @Enumerated(EnumType.STRING)
    private StatutEcheance statut; // URGENT, A_VENIR, PLANIFIE

    @ManyToOne
    @JoinColumn(name = "userId")
    @JsonIgnore
    private Users user;
}
