import { HttpClient } from "@angular/common/http";
import { PlaylistDTO } from "../dtos/playlist.dto";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Playlist } from "../models/playlist";
import { Song } from "../models/song";

@Injectable({
    providedIn: "root",
})
export class PlaylistService {
    public currentPlaylist = new BehaviorSubject<Playlist | null>(null);
    public currentSong = new BehaviorSubject<Song | null>(null);
    private playlistApi = "http://localhost:8088/api/v1/playlists";
    public fromHome: boolean = false;
    constructor(private http: HttpClient) {}
    getAllPlaylists() {
        return this.http.get(this.playlistApi);
    }
    createPlaylist(playlistDTO: PlaylistDTO) {
        return this.http.post(`${this.playlistApi}/create`, playlistDTO);
    }
    updatePlaylist(playListId: number, playlistDTO: PlaylistDTO) {
        return this.http.put(
            `${this.playlistApi}/update/${playListId}`,
            playlistDTO
        );
    }
    setNewPlaylistSong(song: any) {
        this.currentSong.next(song);
    }
    setNewPlaylist(playlist: any) {
        this.currentPlaylist.next(playlist);
    }
    addSongToPlaylist(playlistId: number, songId: number) {
        return this.http.post(
            `${this.playlistApi}/${playlistId}/addSong/${songId}`,
            {}
        );
    }
    removeSongFromPlaylist(playlistId: number, songId: number) {
        return this.http.delete(
            `${this.playlistApi}/${playlistId}/removeSong/${songId}`
        );
    }
}
