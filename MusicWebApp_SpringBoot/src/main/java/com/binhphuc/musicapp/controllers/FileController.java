package com.binhphuc.musicapp.controllers;

import com.binhphuc.musicapp.dtos.SongDTO;
import com.binhphuc.musicapp.exceptions.DataExistException;
import com.binhphuc.musicapp.responses.MessageResponse;
import com.binhphuc.musicapp.services.FileStorageService;
import com.binhphuc.musicapp.services.IFileStorageService;
import com.binhphuc.musicapp.services.ISongService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("api/v1/files")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class FileController {
    private static final String MUSIC_DIRECTORY = "uploads/";
    private final IFileStorageService fileStorageService;
    private final ISongService songService;
    @GetMapping("/{fileName}")
    public ResponseEntity<?> getFile(@PathVariable String fileName) throws IOException {
        Path path = Paths.get(MUSIC_DIRECTORY, fileName);
        UrlResource resource = new UrlResource(path.toUri());
        if (resource.exists() || resource.isReadable()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("audio/mpeg"))
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/uploads")
    public ResponseEntity<?> uploadFile(@Valid @RequestPart("file") MultipartFile file, @RequestPart("dto") String dtoJson) throws DataExistException {
        fileStorageService.save(file);
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            SongDTO songDTO = objectMapper.readValue(dtoJson, SongDTO.class);
            String fileName = file.getOriginalFilename();
            songService.saveSong(songDTO);
            return ResponseEntity.ok(MessageResponse.builder()
                    .message("Uploaded files successfully: " + fileName)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/download")
    public ResponseEntity<?> downloadFile(@RequestParam String url) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            byte[] songData = restTemplate.getForObject(url, byte[].class);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDisposition(ContentDisposition.builder("attachment").filename("song.mp3").build());

            return new ResponseEntity<>(songData, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
