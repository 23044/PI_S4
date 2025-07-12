package com.example.backend.Controllers;

import com.example.backend.Dto.MembreDirectionDTO;
import com.example.backend.Models.Doctorants;
import com.example.backend.Models.Echeance;
import com.example.backend.Models.StatutEcheance;
import com.example.backend.Models.Users;
import com.example.backend.Repositories.DoctorantRepository;
import com.example.backend.Repositories.EcheanceRepository;
import com.example.backend.Repositories.MessageRepository;
import com.example.backend.Repositories.UserRepository;
import com.example.backend.Services.DoctorantService;
import com.example.backend.jwtModule.utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctorant")
public class DoctorantController {

    @Autowired
    private DoctorantService doctorantService;

    @Autowired 
    private MessageRepository messageRepository;

    @Autowired
    private DoctorantRepository doctorantRepository;

    @Autowired
    private EcheanceRepository echeanceRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository usersRepository;

    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<Doctorants> getDoctorantDashboard(@PathVariable Long userId) {
        try {
            Doctorants doctorant = doctorantService.getDoctorantByUserId(userId);
            return ResponseEntity.ok(doctorant);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/echeances")
    public ResponseEntity<?> getEcheances(HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromRequest(request);
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "Token invalide"));
        }

        String email = jwtUtil.extractUsername(token);
        Users doctorant = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Échéances personnelles OU globales
        List<Echeance> liste = echeanceRepository.findByUserId_Id(doctorant.getId());

        List<Map<String, Object>> data = liste.stream().map(ech -> {
            Map<String, Object> map = new HashMap<>();
            LocalDate date = ech.getDateLimite();

            map.put("titre", ech.getTitre());
            map.put("description", ech.getDescription());
            map.put("mois", date.getMonth().getDisplayName(TextStyle.SHORT, Locale.FRENCH));
            map.put("jour", date.getDayOfMonth());
            map.put("statut", calculerStatut(date));
            return map;
        }).toList();

        return ResponseEntity.ok(data);
    }

    private String calculerStatut(LocalDate date) {
        LocalDate today = LocalDate.now();
        if (date.isEqual(today))
            return "Urgent";
        if (date.isAfter(today) && date.isBefore(today.plusDays(7)))
            return "À venir";
        if (date.isAfter(today.plusDays(7)))
            return "Planifié";
        return "Passé";
    }

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")

    @GetMapping("/equipe-direction")
    public ResponseEntity<?> getEquipe(HttpServletRequest request) {
        // 1. Extraire le token depuis les cookies
        String token = jwtUtil.extractTokenFromRequest(request);
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "Token invalide"));
        }

        // 2. Extraire l'email depuis le token
        String email = jwtUtil.extractUsername(token);
        Users utilisateur = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Long userId = utilisateur.getId();

        // 3. Chercher les membres de la direction
        List<MembreDirectionDTO> equipe = new ArrayList<>();
        equipe.addAll(doctorantRepository.findDirecteurByDoctorantUserId(userId));
        equipe.addAll(doctorantRepository.findEncadrantsByDoctorantUserId(userId));

        return ResponseEntity.ok(equipe);
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(HttpServletRequest request) {
        // Récupération du userId à partir du token (ta méthode actuelle)
        String token = jwtUtil.extractTokenFromRequest(request);
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "Token invalide"));
        }

        String email = jwtUtil.extractUsername(token);
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        Long userId = user.getId();

        // Récupérer les échéances urgentes ou proches
        LocalDate now = LocalDate.now();
        LocalDate threshold = now.plusDays(10); // échéances dans les 10 jours

        StatutEcheance statut = StatutEcheance.URGENT;
        List<Echeance> echeances = echeanceRepository.findByUserIdAndStatutOrDateLimiteBefore(
                userId, statut, threshold);

        // Compter les messages non lus
        long unreadMessages = messageRepository.countByReceiverIdAndIsReadFalse(userId);

        Map<String, Object> result = new HashMap<>();
        result.put("nbEcheancesUrgentes", echeances.size());
        result.put("nbMessagesNonLus", unreadMessages);

        return ResponseEntity.ok(result);
    }

}