package com.binhphuc.musicapp.repositories;

import com.binhphuc.musicapp.models.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    Optional<Song> getSongById(Long id);
}
