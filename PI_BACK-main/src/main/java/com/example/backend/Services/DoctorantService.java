package com.example.backend.Services;

import com.example.backend.Dto.MembreDirectionDTO;
import com.example.backend.Models.Doctorants;
import com.example.backend.Repositories.DoctorantRepository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DoctorantService {

    @Autowired
    private DoctorantRepository doctorantRepository;

    public List<MembreDirectionDTO> getEquipeDeDirection(Long userId) {
        List<MembreDirectionDTO> equipe = new ArrayList<>();
        equipe.addAll(doctorantRepository.findDirecteurByDoctorantUserId(userId));
        equipe.addAll(doctorantRepository.findEncadrantsByDoctorantUserId(userId));
        return equipe;
    }

    public Doctorants getDoctorantByUserId(Long userId) {
        return doctorantRepository.findByUserId(userId);
    }
}