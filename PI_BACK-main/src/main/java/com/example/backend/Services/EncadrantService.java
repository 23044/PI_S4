package com.example.backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import com.example.backend.Dto.EncadrantDTO;
import com.example.backend.Models.Encadrant;
import com.example.backend.Models.Reunion;
import com.example.backend.Models.These;
import com.example.backend.Models.Users;
import com.example.backend.Repositories.EncadrantRepository;
import com.example.backend.Repositories.ReunionRepository;
import com.example.backend.Repositories.TheseRepository;
import com.example.backend.Repositories.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EncadrantService {

    @Autowired
    private EncadrantRepository encadrantRepository;

    @Autowired
    private ReunionRepository reunionRepository;

    @Autowired
    private TheseRepository theseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailsender;

    public List<EncadrantDTO> getAllEncadrantsDTO() {
        return encadrantRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Optional<Encadrant> getEncadrantById(Long id) {
        return encadrantRepository.findById(id);
    }

    public Optional<Encadrant> getEncadrantByUserId(Long userId) {
        return encadrantRepository.findByUtilisateurId(userId);
    }

    public Encadrant saveEncadrant(Encadrant encadrant) {
        return encadrantRepository.save(encadrant);
    }

    // public Optional<Encadrant> updateEncadrant(Long id, Encadrant
    // encadrantDetails) {
    // return encadrantRepository.findById(id)
    // .map(encadrant -> {
    // encadrant.setGrade(encadrantDetails.getGrade());
    // encadrant.setSpecialite(encadrantDetails.getSpecialite());
    // encadrant.setUser(encadrantDetails.getUser());
    // return encadrantRepository.save(encadrant);
    // });
    // }

    public boolean deleteEncadrant(Long id) {
        return encadrantRepository.findById(id)
                .map(encadrant -> {
                    encadrantRepository.delete(encadrant);
                    return true;
                }).orElse(false);
    }

    public EncadrantDTO mapToDTO(Encadrant encadrant) {
        EncadrantDTO dto = new EncadrantDTO();
        dto.setId(encadrant.getId());
        dto.setGrade(encadrant.getGrade());
        dto.setSpecialite(encadrant.getSpecialite());

        if (encadrant.getUtilisateur() != null) {
            dto.setNomUtilisateur(encadrant.getUtilisateur().getFirstName());
            dto.setEmailUtilisateur(encadrant.getUtilisateur().getEmail());

            if (encadrant.getUtilisateur().getEtablissement() != null) {
                dto.setEtablissementNom(encadrant.getUtilisateur().getEtablissement().getNom());
            }
        }

        return dto;
    }


    public List<Reunion> getReunionByEncadrantId(Long id){
        return reunionRepository.findByEncadrantId(id);
    }

    public Optional<Reunion> getReunionById(Long id){
        return reunionRepository.findById(id);
    }
    

    public List<Map<String,Object>> getStudentsUserNamesByEncadrantId(Long encadrantId){
        List<These> theses = theseRepository.findByEncadrantId(encadrantId);

        return theses.stream()
               .filter(these -> these.getDoctorant() != null && these.getDoctorant().getUser() != null)
               .map( these -> {
                Users user = these.getDoctorant().getUser();
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id",user.getId());
                userInfo.put("email", user.getEmail());
                userInfo.put("username",user.getUsername());

                return userInfo;
               })
               .distinct()
               .collect(Collectors.toList());
    }

//     public Reunion createReunion(Reunion reunion) {
//     return reunionRepository.save(reunion);
// }

public Reunion createReunion(Reunion reunion) {
    
    if (reunion.getEtudiant() != null && !reunion.getEtudiant().trim().isEmpty()) {
        Optional<Users> userOptional = userRepository.findByUsername(reunion.getEtudiant().trim());
        
        if (userOptional.isPresent()) {
            reunion.setEtudiantEmail(userOptional.get().getEmail());
        }
    }
    
    // return reunionRepository.save(reunion);

    Reunion savedReunion = reunionRepository.save(reunion);

    sendMeetingNotificationEmail(savedReunion);
    
    return savedReunion;


}

public Optional<Reunion> updateReunion(Long id, Reunion reunionDetails) {
    return reunionRepository.findById(id)
            .map(reunion -> {
               
                reunion.setTitre(reunionDetails.getTitre());
                reunion.setDate(reunionDetails.getDate());
                reunion.setHeure(reunionDetails.getHeure());
                reunion.setDuree(reunionDetails.getDuree());
                reunion.setLieu(reunionDetails.getLieu());
                reunion.setDescription(reunionDetails.getDescription());
                reunion.setAgenda(reunionDetails.getAgenda());
                reunion.setType(reunionDetails.getType());
                reunion.setStatut(reunionDetails.getStatut());
                reunion.setNotes(reunionDetails.getNotes());
                reunion.setLienReunion(reunionDetails.getLienReunion());
                reunion.setRappelEnvoye(reunionDetails.getRappelEnvoye());
                reunion.setEtudiant(reunionDetails.getEtudiant());
                
                
                if (reunionDetails.getEtudiant() != null && !reunionDetails.getEtudiant().trim().isEmpty()) {
                    Optional<Users> userOptional = userRepository.findByUsername(reunionDetails.getEtudiant().trim());
                    if (userOptional.isPresent()) {
                        reunion.setEtudiantEmail(userOptional.get().getEmail());
                    }
                } else {
                    reunion.setEtudiantEmail(reunionDetails.getEtudiantEmail());
                }
                
                return reunionRepository.save(reunion);
            });
}

public void deleteReunion(Long id){
    reunionRepository.deleteById(id);
}



private void sendMeetingNotificationEmail(Reunion reunion) {
    if (reunion.getEtudiantEmail() == null || reunion.getEtudiantEmail().trim().isEmpty()) {
        return; // Skip if no email
    }
    
    String subject = "Nouvelle réunion programmée - " + reunion.getTitre();
    String htmlContent = "<div style='font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 0;'>" +
        "<div style='max-width: 600px; margin: auto; background: #fff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden;'>" +
        
        // Header
        "<div style='background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center;'>" +
        "<h1 style='color: white; margin: 0; font-size: 28px; font-weight: bold;'>📅 Nouvelle Réunion</h1>" +
        "</div>" +
        
        // Content
        "<div style='padding: 40px 30px;'>" +
        "<h2 style='color: #2d3748; margin-bottom: 20px; font-size: 24px;'>Bonjour " + reunion.getEtudiant() + " !</h2>" +
        
        "<p style='color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;'>" +
        "Une nouvelle réunion a été programmée. Voici les détails :" +
        "</p>" +
        
        // Meeting Details Card
        "<div style='background: #f8fafc; border-left: 4px solid #4facfe; padding: 25px; margin: 25px 0; border-radius: 8px;'>" +
        "<h3 style='color: #2d3748; margin: 0 0 15px 0; font-size: 20px;'>📋 " + reunion.getTitre() + "</h3>" +
        
        "<div style='display: grid; gap: 12px;'>" +
        "<p style='margin: 0; color: #4a5568;'><strong>📅 Date:</strong> " + reunion.getDate() + "</p>" +
        "<p style='margin: 0; color: #4a5568;'><strong>🕐 Heure:</strong> " + reunion.getHeure() + "</p>" +
        "<p style='margin: 0; color: #4a5568;'><strong>⏱️ Durée:</strong> " + reunion.getDuree() + " minutes</p>" +
        
        (reunion.getLieu() != null ? 
        "<p style='margin: 0; color: #4a5568;'><strong>📍 Lieu:</strong> " + reunion.getLieu() + "</p>" : "") +
        
        (reunion.getLienReunion() != null ? 
        "<p style='margin: 0; color: #4a5568;'><strong>🔗 Lien:</strong> <a href='" + reunion.getLienReunion() + "' style='color: #4facfe;'>" + reunion.getLienReunion() + "</a></p>" : "") +
        
        "<p style='margin: 0; color: #4a5568;'><strong>📝 Type:</strong> " + reunion.getType().getLibelle() + "</p>" +
        "</div>" +
        "</div>" +
        
        // Description
        (reunion.getDescription() != null ? 
        "<div style='background: #fff5f5; border-left: 4px solid #fed7d7; padding: 20px; margin: 20px 0; border-radius: 8px;'>" +
        "<h4 style='color: #2d3748; margin: 0 0 10px 0;'>📝 Description:</h4>" +
        "<p style='color: #4a5568; margin: 0; line-height: 1.6;'>" + reunion.getDescription() + "</p>" +
        "</div>" : "") +
        
        // Agenda
        (reunion.getAgenda() != null ? 
        "<div style='background: #f0fff4; border-left: 4px solid #9ae6b4; padding: 20px; margin: 20px 0; border-radius: 8px;'>" +
        "<h4 style='color: #2d3748; margin: 0 0 10px 0;'>📋 Agenda:</h4>" +
        "<p style='color: #4a5568; margin: 0; line-height: 1.6;'>" + reunion.getAgenda() + "</p>" +
        "</div>" : "") +
        
        // Call to Action
        "<div style='text-align: center; margin: 30px 0;'>" +
        "<div style='display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 50px; box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);'>" +
        "<span style='color: white; font-weight: bold; font-size: 16px;'>✅ Réunion confirmée</span>" +
        "</div>" +
        "</div>" +
        
        // Tips
        "<div style='background: #fffbeb; border: 1px solid #fed7aa; padding: 20px; border-radius: 8px; margin: 20px 0;'>" +
        "<h4 style='color: #92400e; margin: 0 0 10px 0;'>💡 Conseils de préparation:</h4>" +
        "<ul style='color: #92400e; margin: 0; padding-left: 20px;'>" +
        "<li>Préparez vos questions à l'avance</li>" +
        "<li>Rassemblez vos documents de travail</li>" +
        "<li>Testez votre connexion si c'est en ligne</li>" +
        "</ul>" +
        "</div>" +
        
        "</div>" +
        
        // Footer
        "<div style='background: #f7fafc; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;'>" +
        "<p style='color: #718096; margin: 0; font-size: 14px;'>Cet email a été envoyé automatiquement par le système de gestion des thèses</p>" +
        "<p style='color: #a0aec0; margin: 5px 0 0 0; font-size: 12px;'>© 2025 theses.mr - Plateforme de gestion des thèses</p>" +
        "</div>" +
        
        "</div></div>";

    try {
        MimeMessage message = mailsender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("smtpverif793@gmail.com");
        helper.setTo(reunion.getEtudiantEmail());
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailsender.send(message);
    } catch (MessagingException e) {
        e.printStackTrace();
    }
}





}