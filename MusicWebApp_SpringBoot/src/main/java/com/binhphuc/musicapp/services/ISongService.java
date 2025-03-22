package com.binhphuc.musicapp.services;

import com.binhphuc.musicapp.dtos.SongDTO;
import com.binhphuc.musicapp.exceptions.NotFoundException;
import com.binhphuc.musicapp.models.Song;

import java.util.List;

public interface ISongService {
    List<Song> getAllSongs();
    void saveSong(SongDTO songDTO);
    Song updateSong(Long id, SongDTO songDTO) throws NotFoundException;
    Song getSongById(Long id) throws NotFoundException;
}
