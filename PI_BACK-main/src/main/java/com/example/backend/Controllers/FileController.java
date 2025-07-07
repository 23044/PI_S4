package com.example.backend.Controllers;

import com.example.backend.Dto.FileInfoDTO;
import com.example.backend.Models.FileEntity;
import com.example.backend.Models.Users;
import com.example.backend.Services.FileStorageService;
import com.example.backend.Repositories.UserRepository;
import com.example.backend.jwtModule.utils.JwtUtil;
import com.example.backend.payload.UploadFileResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromRequest(request);
        if (token == null || !jwtUtil.validateToken(token)) {
            throw new RuntimeException("Token invalide ou expiré");
        }

        String email = jwtUtil.extractUsername(token);
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return user.getId();

    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadFileResponse uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam(value = "notes", required = false) String notes,
            HttpServletRequest request) {

        Long userId = getUserIdFromRequest(request);

        FileEntity savedFile = fileStorageService.storeFile(file, userId, title, type, notes);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/files/download/")
                .path(savedFile.getFileName())
                .toUriString();

        return new UploadFileResponse(savedFile, fileDownloadUri, file.getContentType(), file.getSize());
    }

    @Operation(summary = "Upload multiple files", description = "Uploads multiple files (auth required)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Files uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    // @PostMapping(value = "/uploads", consumes =
    // MediaType.MULTIPART_FORM_DATA_VALUE)
    // public ResponseEntity<?> uploadMultipleFiles(
    // @Parameter(description = "List of files", required = true)
    // @RequestPart("files") MultipartFile[] files,
    // HttpServletRequest request) {

    // Long userId = getUserIdFromRequest(request);
    // List<FileEntity> uploadedFiles = new ArrayList<>();
    // for (MultipartFile file : files) {
    // FileEntity fileEntity = fileStorageService.storeFile(file, userId);
    // uploadedFiles.add(fileEntity);
    // }
    // return ResponseEntity.ok(uploadedFiles);
    // }

    // @GetMapping("/api/files/download/{filename:.+}")
    // public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
    // try {
    // Path filePath = Paths.get("uploads").resolve(filename).normalize(); //
    // dossier où les fichiers sont stockés
    // Resource resource = new UrlResource(filePath.toUri());

    // if (!resource.exists()) {
    // return ResponseEntity.notFound().build();
    // }

    // return ResponseEntity.ok()
    // .contentType(MediaType.APPLICATION_OCTET_STREAM)
    // .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" +
    // resource.getFilename() + "\"")
    // .body(resource);

    // } catch (Exception e) {
    // return ResponseEntity.internalServerError().build();
    // }
    // }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName,
            HttpServletRequest request)
            throws FileNotFoundException {
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Impossible de déterminer le type de fichier.");
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" +
                        resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/my")
    public ResponseEntity<List<FileInfoDTO>> getMyFiles(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<FileEntity> userFiles = fileStorageService.getFilesByUserId(userId);

        List<FileInfoDTO> dtos = userFiles.stream()
                .map(FileInfoDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/list")
    public List<String> listFiles() {
        return fileStorageService.loadAll()
                .map(Path::getFileName)
                .map(Path::toString)
                .collect(Collectors.toList());
    }

    @GetMapping("/view/{fileName:.+}")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName, HttpServletRequest request)
            throws FileNotFoundException {
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Impossible de déterminer le type de fichier.");
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/all")
    public ResponseEntity<List<FileInfoDTO>> getAllFiles() {
        List<FileEntity> files = fileStorageService.getAllFiles();
        List<FileInfoDTO> result = files.stream()
                .map(FileInfoDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

}
