package com.binhphuc.musicapp.services;

import com.binhphuc.musicapp.exceptions.DataExistException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IFileStorageService {
    void save(MultipartFile file) throws DataExistException;
}
