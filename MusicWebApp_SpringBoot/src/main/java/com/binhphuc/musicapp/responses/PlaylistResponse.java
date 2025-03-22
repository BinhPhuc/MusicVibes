package com.binhphuc.musicapp.responses;

import com.binhphuc.musicapp.models.Playlist;
import com.binhphuc.musicapp.models.Song;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistResponse {
    private Long id;
    private String name;
    private List<SongResponse> songs;
    public static PlaylistResponse fromPlaylist(Playlist playlist) {
        PlaylistResponse response = PlaylistResponse
                .builder()
                .id(playlist.getId())
                .name(playlist.getName())
                .build();
        List<Song> songs = playlist.getSongs();
        if (songs == null) {
            return response;
        }
        List<SongResponse> songResponses = songs.stream().map(SongResponse::fromSong).toList();
        response.setSongs(songResponses);
        return response;
    }
}
