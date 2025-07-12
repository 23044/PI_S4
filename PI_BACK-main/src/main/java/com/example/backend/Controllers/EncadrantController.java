package com.example.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.Dto.EncadrantDTO;
import com.example.backend.Models.Encadrant;
import com.example.backend.Models.Reunion;
import com.example.backend.Services.EncadrantService;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/encadrants")
public class EncadrantController {

    @Autowired
    private EncadrantService encadrantService;

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
    
}