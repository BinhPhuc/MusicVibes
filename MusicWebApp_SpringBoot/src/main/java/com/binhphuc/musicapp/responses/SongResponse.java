package com.binhphuc.musicapp.responses;

import com.binhphuc.musicapp.models.Playlist;
import com.binhphuc.musicapp.models.Song;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SongResponse {
    private Long id;
    private String title;
    private String artist;
    private String album;
    private String genre;
    private String duration;
    @JsonProperty("file_name")
    private String fileName;
    @JsonProperty("is_favorite")
    private boolean isFavorite;
    public static SongResponse fromSong(Song song) {
        SongResponse response = SongResponse
                .builder()
                .id(song.getId())
                .title(song.getTitle())
                .artist(song.getArtist())
                .album(song.getAlbum())
                .genre(song.getGenre())
                .duration(song.getDuration())
                .fileName(song.getFileName())
                .isFavorite(song.isFavorite())
                .build();
        return response;
    }
}
