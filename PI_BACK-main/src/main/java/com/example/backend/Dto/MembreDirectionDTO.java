package com.example.backend.Dto;

public class MembreDirectionDTO {
    private String nom;
    private String prenom;
    private String role; // Directeur ou Encadrant
    private String email;
    public MembreDirectionDTO(String nom, String prenom, String role, String email) {
        this.nom = nom;
        this.prenom = prenom;
        this.role = role;
        this.email = email;
    }
    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getPrenom() {
        return prenom;
    }
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    // Constructeurs, Getters, Setters
}
