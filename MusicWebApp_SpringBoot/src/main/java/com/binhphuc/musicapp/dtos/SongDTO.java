package com.binhphuc.musicapp.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SongDTO {
    private String title;
    private String artist;
    private String album;
    private String genre;
    private String duration;
    @JsonProperty("file_name")
    private String fileName;
    @JsonProperty("is_favorite")
    private boolean isFavorite;
}
