package com.binhphuc.musicapp.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileResponse {
    @JsonProperty("file_name")
    private String fileName;
    private String title;
    private String artist;
    private String album;
    private String genre;
    private String duration;
    @JsonProperty("is_favorite")
    private boolean isFavorite;
}
