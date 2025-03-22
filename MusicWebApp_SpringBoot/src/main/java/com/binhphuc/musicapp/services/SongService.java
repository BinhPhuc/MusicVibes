package com.binhphuc.musicapp.services;

import com.binhphuc.musicapp.dtos.SongDTO;
import com.binhphuc.musicapp.exceptions.NotFoundException;
import com.binhphuc.musicapp.models.Playlist;
import com.binhphuc.musicapp.models.Song;
import com.binhphuc.musicapp.repositories.PlaylistRepository;
import com.binhphuc.musicapp.repositories.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SongService implements ISongService {
    private final SongRepository songRepository;
    private final PlaylistRepository playlistRepository;
    @Override
    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    @Override
    public void saveSong(SongDTO songDTO) {
        Song newSong = Song
                .builder()
                .title(songDTO.getTitle())
                .artist(songDTO.getArtist())
                .album(songDTO.getAlbum())
                .genre(songDTO.getGenre())
                .fileName(songDTO.getFileName())
                .isFavorite(songDTO.isFavorite())
                .build();
        String duration = songDTO.getDuration();
        duration = duration.substring(0, duration.length() - 11);
        int durationInt = Integer.parseInt(duration);
        int minutes = durationInt / 60;
        int seconds = durationInt % 60;
        duration = minutes + ":" + seconds;
        newSong.setDuration(duration);
        songRepository.save(newSong);
    }

    @Override
    public Song updateSong(Long id, SongDTO songDTO) throws NotFoundException {
        Optional<Song> song = songRepository.findById(id);
        if (song.isEmpty()) {
            throw new NotFoundException("Cannot find song with id = " + id);
        }
        Song currentSong = song.get();
        currentSong.setTitle(songDTO.getTitle());
        currentSong.setArtist(songDTO.getArtist());
        currentSong.setAlbum(songDTO.getAlbum());
        currentSong.setGenre(songDTO.getGenre());
        currentSong.setFileName(songDTO.getFileName());
        currentSong.setDuration(songDTO.getDuration());
        currentSong.setFavorite(songDTO.isFavorite());
        for (Playlist playlist : currentSong.getPlaylists()) {
            List<Song> songs = playlist.getSongs();
            for (int i = 0; i < playlist.getSongs().size(); i++) {
                if (playlist.getSongs().get(i).getId().equals(id)) {
                    songs.set(i, currentSong);
                }
            }
            playlist.setSongs(songs);
        }
        return songRepository.save(currentSong);
    }

    @Override
    public Song getSongById(Long id) throws NotFoundException {
        Song song = songRepository.findById(id).orElse(null);
        if (song == null) {
            throw new NotFoundException("Cannot find song with id = " + id);
        }
        return song;
    }
}
