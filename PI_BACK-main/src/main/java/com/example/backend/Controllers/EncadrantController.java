package com.example.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.Dto.EncadrantDTO;
import com.example.backend.Models.Encadrant;

import com.example.backend.Models.Reunion;

import com.example.backend.Models.Ressource;
import com.example.backend.Models.These;
import com.example.backend.Models.Users;
import com.example.backend.Repositories.EncadrantRepository;
import com.example.backend.Repositories.RessourceRepository;
import com.example.backend.Repositories.TheseRepository;
import com.example.backend.Repositories.UserRepository;

import com.example.backend.Services.EncadrantService;
import com.example.backend.jwtModule.utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/encadrants")
public class EncadrantController {

    @Autowired
    private EncadrantService encadrantService;

    @Autowired
    private RessourceRepository ressourceRepository;

    @Autowired
    private EncadrantRepository encadrantRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TheseRepository theseRepository;

    @GetMapping
    public ResponseEntity<List<EncadrantDTO>> getAllEncadrants() {
        return ResponseEntity.ok(encadrantService.getAllEncadrantsDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Encadrant> getEncadrantById(@PathVariable Long id) {
        Optional<Encadrant> encadrant = encadrantService.getEncadrantById(id);
        return encadrant.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Encadrant createEncadrant(@RequestBody Encadrant encadrant) {
        return encadrantService.saveEncadrant(encadrant);
    }

    // @PutMapping("/{id}")
    // public ResponseEntity<Encadrant> updateEncadrant(@PathVariable Long id,
    // @RequestBody Encadrant encadrantDetails) {
    // Optional<Encadrant> updatedEncadrant = encadrantService.updateEncadrant(id,
    // encadrantDetails);
    // return updatedEncadrant.map(ResponseEntity::ok)
    // .orElseGet(() -> ResponseEntity.notFound().build());
    // }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEncadrant(@PathVariable Long id) {
        if (encadrantService.deleteEncadrant(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/meetings/{id}")
    public ResponseEntity<List<Reunion>> GetMeetingsByEncadrantId(@PathVariable Long id){

        List<Reunion> reunions = encadrantService.getReunionByEncadrantId(id);
        if(!reunions.isEmpty()){
              return ResponseEntity.ok(reunions);
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/etudiants/")
    public ResponseEntity<List<Map<String,Object>>> getMethodName(@PathVariable Long id) {
        List<Map<String,Object>> etudiants = encadrantService.getStudentsUserNamesByEncadrantId(id);
        // return etudiants;

        if(!etudiants.isEmpty()){
            return ResponseEntity.ok(etudiants);
        }
        else{
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping("/meetings")
public ResponseEntity<Reunion> createReunion(@RequestBody Reunion reunion) {
    try {
        Reunion savedReunion = encadrantService.createReunion(reunion);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReunion);
    } catch (Exception e) {
        return ResponseEntity.badRequest().build();
    }
}

@PutMapping("/meeting/update/{id}")
public ResponseEntity<Reunion> updateReeunion(@PathVariable Long id, @RequestBody Reunion reunion){
    try {
        Optional<Reunion> updatedReunion = encadrantService.updateReunion(id, reunion);
        return updatedReunion.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    } catch (Exception e) {
        return ResponseEntity.badRequest().build();
    }
}

@DeleteMapping("/meeting/delete/{id}")
 public ResponseEntity<Void> deleteReunion(@PathVariable Long id){
    try {
        encadrantService.deleteReunion(id);
        return ResponseEntity.noContent().build();
    }catch(Exception e){
        return ResponseEntity.notFound().build();
    }
 }
    

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData(HttpServletRequest request) {
        // Étape 1 : extraire et valider le token depuis le cookie
        String token = jwtUtil.extractTokenFromRequest(request);
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "Token invalide"));
        }

        // Étape 2 : extraire l'email et vérifier l'utilisateur
        String email = jwtUtil.extractUsername(token);
        Optional<Users> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Utilisateur introuvable"));
        }

        Users user = userOptional.get();

        // Étape 3 : retrouver l'encadrant lié à cet utilisateur
        Optional<Encadrant> encadrantOptional = encadrantRepository.findByUtilisateurId(user.getId());
        if (encadrantOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Encadrant introuvable"));
        }

        Encadrant encadrant = encadrantOptional.get();

        // Étape 4 : Récupérer les thèses encadrées
        List<These> thesesEncadrees = theseRepository.findByEncadrant_Id(encadrant.getId());

        // Total
        int totalTheses = thesesEncadrees.size();

        // Statistiques par statut
        Map<String, Long> statsParStatut = thesesEncadrees.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getStatut() != null ? t.getStatut().name() : "Inconnu",
                        Collectors.counting()));

        // Détails des thèses
        List<Map<String, Object>> thesesDetails = thesesEncadrees.stream().map(these -> {
            Map<String, Object> map = new HashMap<>();
            map.put("titre", these.getTitre());
            map.put("statut", these.getStatut() != null ? these.getStatut().name() : "Non défini");
            map.put("etat", these.getEtatThese());
            map.put("langue", these.getLangue());
            map.put("progression", estimerProgression(these.getDateInscription(), these.getDateFinVisee()));
            return map;
        }).collect(Collectors.toList());

        // Ressources
        List<Ressource> ressources = ressourceRepository.findAll();

        // Réponse
        Map<String, Object> response = new HashMap<>();
        response.put("totalTheses", totalTheses);
        response.put("statsParStatut", statsParStatut);
        response.put("theses", thesesDetails);
        response.put("ressources", ressources);

        return ResponseEntity.ok(response);
    }

    // @GetMapping("/dashboard")
    // public ResponseEntity<Map<String, Object>>
    // getDashboardData(HttpServletRequest request) {
    // // Étape 1 : extraire l'email depuis le cookie JWT
    // String email = jwtUtil.extractTokenFromRequest(request);

    // // Étape 2 : récupérer l'utilisateur via email
    // Users user = userRepository.findByEmail(email)
    // .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

    // Long userId = user.getId();

    // // Étape 3 : retrouver l'encadrant lié à cet utilisateur
    // Encadrant encadrant = encadrantRepository.findByUserId(userId)
    // .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));

    // // ... suite du code (inchangé) ...

    // // Récupère les thèses encadrées par cet encadrant
    // List<These> thesesEncadrees =
    // theseRepository.findByEncadrant_Id(encadrant.getId());

    // // Total des thèses encadrées
    // int totalTheses = thesesEncadrees.size();

    // // Statistiques par statut (Soumise, EnCours, etc.)
    // Map<String, Long> statsParStatut = thesesEncadrees.stream()
    // .collect(Collectors.groupingBy(
    // t -> t.getStatut() != null ? t.getStatut().name() : "Inconnu",
    // Collectors.counting()));

    // // Détails des thèses (titre, statut, état, langue, progression)
    // List<Map<String, Object>> thesesDetails = thesesEncadrees.stream().map(these
    // -> {
    // Map<String, Object> map = new HashMap<>();
    // map.put("titre", these.getTitre());
    // map.put("statut", these.getStatut() != null ? these.getStatut().name() : "Non
    // défini");
    // map.put("etat", these.getEtatThese());
    // map.put("langue", these.getLangue());
    // map.put("progression", estimerProgression(these.getDateInscription(),
    // these.getDateFinVisee()));
    // return map;
    // }).collect(Collectors.toList());

    // // Liste des ressources disponibles
    // List<Ressource> ressources = ressourceRepository.findAll();

    // // Réponse finale
    // Map<String, Object> response = new HashMap<>();
    // response.put("totalTheses", totalTheses);
    // response.put("statsParStatut", statsParStatut);
    // response.put("theses", thesesDetails);
    // response.put("ressources", ressources);

    // return ResponseEntity.ok(response);
    // }

    private int estimerProgression(LocalDate dateDebut, LocalDate dateFin) {
        if (dateDebut == null || dateFin == null)
            return 0;
        long totalDays = ChronoUnit.DAYS.between(dateDebut, dateFin);
        long elapsedDays = ChronoUnit.DAYS.between(dateDebut, LocalDate.now());
        if (totalDays <= 0)
            return 0;
        return (int) Math.min(100, (elapsedDays * 100) / totalDays);
    }


}