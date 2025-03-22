package com.binhphuc.musicapp.services;

import com.binhphuc.musicapp.dtos.PLaylistDTO;
import com.binhphuc.musicapp.exceptions.NotFoundException;
import com.binhphuc.musicapp.models.Playlist;

import java.util.List;

public interface IPlaylistService {
    Playlist createPlaylist(PLaylistDTO pLaylistDTO);
    List<Playlist> getAllPlaylists();
    Playlist getPlaylistById(Long id) throws NotFoundException;
    Playlist addSongToPlaylist(Long playlistId, Long songId) throws NotFoundException;
    Playlist updatePlaylist(Long id, PLaylistDTO pLaylistDTO) throws NotFoundException;
    Playlist removeSongFromPlaylist(Long playlistId, Long songId) throws NotFoundException;
}
