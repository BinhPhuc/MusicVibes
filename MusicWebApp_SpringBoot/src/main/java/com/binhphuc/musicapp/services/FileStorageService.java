package com.binhphuc.musicapp.services;

import com.binhphuc.musicapp.exceptions.DataExistException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileStorageService implements IFileStorageService {
    @Override
    public void save(MultipartFile file) throws DataExistException {
        try {
            String rootLocation = "uploads";
            Path storagePath = Paths.get(rootLocation);
            if (!Files.exists(storagePath)) {
                Files.createDirectories(storagePath);
            }
            Files.copy(file.getInputStream(), storagePath.resolve(Objects.requireNonNull(file.getOriginalFilename())));
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new DataExistException("A file of that name already exists.");
            }

            throw new RuntimeException(e.getMessage());
        }
    }
}
