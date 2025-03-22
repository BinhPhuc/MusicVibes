package com.binhphuc.musicapp.controllers;

import com.binhphuc.musicapp.dtos.SongDTO;
import com.binhphuc.musicapp.exceptions.NotFoundException;
import com.binhphuc.musicapp.models.Song;
import com.binhphuc.musicapp.responses.PlaylistResponse;
import com.binhphuc.musicapp.responses.SongResponse;
import com.binhphuc.musicapp.services.ISongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/songs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SongController {
    private final ISongService songService;
    @GetMapping()
    public ResponseEntity<?> getAllSongs() {
        return ResponseEntity.ok(songService.getAllSongs().stream().map(song -> SongResponse.builder()
                .id(song.getId())
                .title(song.getTitle())
                .artist(song.getArtist())
                .album(song.getAlbum())
                .genre(song.getGenre())
                .duration(song.getDuration())
                .fileName(song.getFileName())
                .isFavorite(song.isFavorite())
                .build()));
    }
    @PutMapping("/update/{id}")
    @Transactional
    public ResponseEntity<?> updateSongById(@PathVariable Long id, @RequestBody SongDTO songDTO) throws NotFoundException {
        Song songUpdated = songService.updateSong(id, songDTO);
        return ResponseEntity.ok(SongResponse
                    .builder()
                    .id(songUpdated.getId())
                    .title(songUpdated.getTitle())
                    .artist(songUpdated.getArtist())
                    .album(songUpdated.getAlbum())
                    .genre(songUpdated.getGenre())
                    .duration(songUpdated.getDuration())
                    .fileName(songUpdated.getFileName())
                    .isFavorite(songUpdated.isFavorite())
                    .build());
    }
    @GetMapping("/{songId}")
    public ResponseEntity<?> getSongById(@PathVariable Long songId) throws NotFoundException {
        Song song = songService.getSongById(songId);
        return ResponseEntity.ok(song.getPlaylists().stream().map(PlaylistResponse::fromPlaylist));
    }
}
