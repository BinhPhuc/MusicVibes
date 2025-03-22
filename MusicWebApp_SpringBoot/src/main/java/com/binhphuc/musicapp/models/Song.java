package com.binhphuc.musicapp.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "songs")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    private String artist;
    private String album;
    private String genre;
    private String duration;
    @Column(name = "file_name", nullable = false, unique = true)
    private String fileName;
    @Column(name = "is_favorite", nullable = false)
    private boolean isFavorite;
    @ManyToMany(mappedBy = "songs")
    private List<Playlist> playlists = new ArrayList<>();
}
