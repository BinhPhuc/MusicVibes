package com.binhphuc.musicapp.services;

import com.binhphuc.musicapp.dtos.PLaylistDTO;
import com.binhphuc.musicapp.exceptions.NotFoundException;
import com.binhphuc.musicapp.models.Playlist;
import com.binhphuc.musicapp.models.Song;
import com.binhphuc.musicapp.repositories.PlaylistRepository;
import com.binhphuc.musicapp.repositories.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaylistService implements IPlaylistService{
    private final PlaylistRepository playlistRepository;
    private final SongRepository songRepository;
    private final ISongService songService;
    @Override
    public Playlist createPlaylist(PLaylistDTO pLaylistDTO) {
        Playlist newPlaylist = Playlist.builder().name(pLaylistDTO.getName()).build();
        return playlistRepository.save(newPlaylist);
    }

    @Override
    public List<Playlist> getAllPlaylists() {
        return playlistRepository.findAll();
    }

    @Override
    public Playlist getPlaylistById(Long id) throws NotFoundException{
        Playlist playlist = playlistRepository.findById(id).orElse(null);
        if (playlist == null) {
            throw new NotFoundException("Cannot find playlist with id = " + id);
        }
        return playlist;
    }

    @Override
    public Playlist addSongToPlaylist(Long playlistId, Long songId) throws NotFoundException {
        Playlist playlist = getPlaylistById(playlistId);
        Song song = songService.getSongById(songId);
        playlist.getSongs().add(song);
        song.getPlaylists().add(playlist);
        return playlistRepository.save(playlist);
    }

    @Override
    public Playlist updatePlaylist(Long id, PLaylistDTO pLaylistDTO) throws NotFoundException{
        Playlist playlist = getPlaylistById(id);
        if (playlist == null) {
            throw new NotFoundException("Cannot find playlist with id = " +id);
        }
        playlist.setName(pLaylistDTO.getName());
        return playlistRepository.save(playlist);
    }

    @Override
    public Playlist removeSongFromPlaylist(Long playlistId, Long songId) throws NotFoundException {
        Playlist playlist = getPlaylistById(playlistId);
        if (playlist == null) {
            throw new NotFoundException("Cannot find playlist with id = " + playlistId);
        }
        Song song = songService.getSongById(songId);
        playlist.getSongs().remove(song);
        song.getPlaylists().remove(playlist);
        return playlistRepository.save(playlist);
    }
}
