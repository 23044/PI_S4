package com.example.backend.Models;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "reunions")
public class Reunion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le titre de la réunion est requis")
    @Column(nullable = false, length = 255)
    private String titre;
    
    @NotNull(message = "La date de la réunion est requise")
    @Column(nullable = false)
    private LocalDate date;
    
    @NotNull(message = "L'heure de la réunion est requise")
    @Column(nullable = false)
    private LocalTime heure;
    
    @Column(nullable = false)
    private Integer duree = 60; // durée en minutes, par défaut 1 heure
    
    @Column(length = 255)
    private String lieu;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String etudiant;

    
    @Column(length = 255)
    private String etudiantEmail; 

    
    @Column(columnDefinition = "TEXT")
    private String agenda;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeReunion type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutReunion statut = StatutReunion.PLANIFIEE;
    
    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;
    
    @Column(name = "date_modification")
    private LocalDateTime dateModification;
    
    @ManyToOne
    @JoinColumn(name = "id_encadrant")
    private Encadrant encadrant;
    
    
    
    // Notes de réunion (optionnel - pour la documentation post-réunion)
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "lien_reunion")
    private String lienReunion; // Pour les réunions en ligne
    
    @Column(name = "rappel_envoye")
    private Boolean rappelEnvoye = false;
    
    // Enums intégrés
    public enum TypeReunion {
        CONSULTATION("Consultation"),
        SUIVI_PROGRES("Suivi de Progrès"),
        SOUTENANCE_THESE("Soutenance de Thèse"),
        DISCUSSION_RECHERCHE("Discussion de Recherche"),
        REVUE_PROPOSITION("Revue de Proposition"),
        DISCUSSION_METHODOLOGIE("Discussion Méthodologie"),
        REVUE_FINALE("Revue Finale"),
        AUTRE("Autre");
        
        private final String libelle;
        
        TypeReunion(String libelle) {
            this.libelle = libelle;
        }
        
        public String getLibelle() {
            return libelle;
        }
    }
    
    public enum StatutReunion {
        PLANIFIEE("Planifiée"),
        EN_COURS("En Cours"),
        TERMINEE("Terminée"),
        ANNULEE("Annulée"),
        REPORTEE("Reportée"),
        ABSENCE("Absence");
        
        private final String libelle;
        
        StatutReunion(String libelle) {
            this.libelle = libelle;
        }
        
        public String getLibelle() {
            return libelle;
        }
    }
    
    // Constructeurs
    public Reunion() {
    }
    
    public Reunion(String titre, LocalDate date, LocalTime heure, TypeReunion type) {
        this.titre = titre;
        this.date = date;
        this.heure = heure;
        this.type = type;
        
    }
    
    // Callbacks de cycle de vie
    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        dateModification = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public LocalTime getHeure() { return heure; }
    public void setHeure(LocalTime heure) { this.heure = heure; }
    
    public Integer getDuree() { return duree; }
    public void setDuree(Integer duree) { this.duree = duree; }
    
    public String getLieu() { return lieu; }
    public void setLieu(String lieu) { this.lieu = lieu; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getAgenda() { return agenda; }
    public void setAgenda(String agenda) { this.agenda = agenda; }
    
    public TypeReunion getType() { return type; }
    public void setType(TypeReunion type) { this.type = type; }
    
    public StatutReunion getStatut() { return statut; }
    public void setStatut(StatutReunion statut) { this.statut = statut; }
    
    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
    
    public LocalDateTime getDateModification() { return dateModification; }
    public void setDateModification(LocalDateTime dateModification) { this.dateModification = dateModification; }
    
    public String getEtudiant() { return etudiant; }
    public void setEtudiant(String etudiant) { this.etudiant = etudiant; }
    public String getEtudiantEmail() { 
    return etudiantEmail; 
    }

     public void setEtudiantEmail(String etudiantEmail) { 
    this.etudiantEmail = etudiantEmail; 
    }

//     public Encadrant getEncadrant() { 
//     return encadrant; 
// }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getLienReunion() { return lienReunion; }
    public void setLienReunion(String lienReunion) { this.lienReunion = lienReunion; }
    
    public Boolean getRappelEnvoye() { return rappelEnvoye; }
    public void setRappelEnvoye(Boolean rappelEnvoye) { this.rappelEnvoye = rappelEnvoye; }
    
    // Méthodes utilitaires
    public LocalDateTime getDateHeure() {
        return LocalDateTime.of(date, heure);
    }
    
    
    public boolean estAVenir() {
        return getDateHeure().isAfter(LocalDateTime.now()) && statut == StatutReunion.PLANIFIEE;
    }
    
    public boolean estAujourdhui() {
        return date.equals(LocalDate.now());
    }
    
    public boolean estPassee() {
        return getDateHeure().isBefore(LocalDateTime.now());
    }
}
