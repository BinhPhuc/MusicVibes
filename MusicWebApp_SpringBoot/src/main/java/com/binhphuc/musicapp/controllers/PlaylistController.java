package com.binhphuc.musicapp.controllers;

import com.binhphuc.musicapp.dtos.PLaylistDTO;
import com.binhphuc.musicapp.exceptions.NotFoundException;
import com.binhphuc.musicapp.models.Playlist;
import com.binhphuc.musicapp.responses.PlaylistResponse;
import com.binhphuc.musicapp.services.IPlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/playlists")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PlaylistController {
    private final IPlaylistService playlistService;
    @GetMapping("")
    public ResponseEntity<?> getAllPlaylists() {
        return ResponseEntity.ok(playlistService.getAllPlaylists().stream().map(PlaylistResponse::fromPlaylist));
    }
    @GetMapping("/{playlistId}")
    public ResponseEntity<?> getPlaylistById(@PathVariable Long playlistId) throws NotFoundException {
        Playlist playlist = playlistService.getPlaylistById(playlistId);
        return ResponseEntity.ok(PlaylistResponse.fromPlaylist(playlist));
    }
    @PostMapping("/create")
    public ResponseEntity<?> createPlaylist(@RequestBody PLaylistDTO pLaylistDTO) {
        Playlist newPlaylist = playlistService.createPlaylist(pLaylistDTO);
        return ResponseEntity.ok(PlaylistResponse.fromPlaylist(newPlaylist));
    }
    @PostMapping("/{playlistId}/addSong/{songId}")
    public ResponseEntity<?> addSongToPlaylist(@PathVariable Long playlistId, @PathVariable Long songId) throws NotFoundException {
        Playlist playlistAfterAdd = playlistService.addSongToPlaylist(playlistId, songId);
        return ResponseEntity.ok(PlaylistResponse.fromPlaylist(playlistAfterAdd));
    }
    @DeleteMapping("/{playlistId}/removeSong/{songId}")
    public ResponseEntity<?> removeSongFromPlaylist(@PathVariable Long playlistId, @PathVariable Long songId) throws NotFoundException {
        Playlist playlistAfterRemove = playlistService.removeSongFromPlaylist(playlistId, songId);
        return ResponseEntity.ok(PlaylistResponse.fromPlaylist(playlistAfterRemove));
    }
    @PutMapping("/update/{playlistId}")
    @Transactional
    public ResponseEntity<?> updatePlaylist(@PathVariable Long playlistId, @RequestBody PLaylistDTO pLaylistDTO) throws NotFoundException {
        Playlist playlistUpdated = playlistService.updatePlaylist(playlistId, pLaylistDTO);
        return ResponseEntity.ok(PlaylistResponse.fromPlaylist(playlistUpdated));
    }
}
