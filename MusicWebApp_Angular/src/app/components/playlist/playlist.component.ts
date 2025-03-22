import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Song } from "../../models/song";
import { Playlist } from "../../models/playlist";
import { PlaylistDTO } from "../../dtos/playlist.dto";
import { PlaylistService } from "../../services/playlist.service";
import { AudioService } from "../../services/audio.service";
import { FileService } from "../../services/file.service";
import { SongDTO } from "../../dtos/song.dto";
import { SongService } from "../../services/song.service";
import { combineLatest, of } from "rxjs";
import { filter, switchMap, tap, catchError, take } from "rxjs/operators";

@Component({
    selector: "app-playlist",
    templateUrl: "./playlist.component.html",
    styleUrl: "./playlist.component.scss",
})
export class PlaylistComponent implements OnInit, AfterViewInit {
    public playlists: Playlist[] = [];
    public selectedPlaylist: Playlist | null = null;
    public isEditing: boolean = false;
    public editablePlaylistName: string = "";
    public isEditModalOpen = false;
    public toastMessage: string = "";
    public isToastVisible: boolean = false;
    public toastType: "success" | "error" = "success";
    public currentPlayingSong: Song | null = null;
    public currentPlay: Map<number, boolean> = new Map();
    public hoveredIndex: number = -1;
    constructor(
        private playlistService: PlaylistService,
        private audioService: AudioService,
        private fileService: FileService,
        private songService: SongService
    ) {}
    ngOnInit(): void {
        debugger;
        let tmt: number = 3;
        combineLatest([
            this.playlistService.currentPlaylist,
            this.playlistService.currentSong,
        ])
            .pipe(
                take(1),
                filter(([_, song]) => !!song),
                switchMap(([playlist, song]) => {
                    const validSong = song!;
                    if (playlist) {
                        return this.playlistService
                            .addSongToPlaylist(playlist.id, validSong.id)
                            .pipe(
                                tap(() => {
                                    playlist.songs.push(validSong);
                                    this.selectedPlaylist = playlist;
                                    this.showToast(
                                        "Song added to playlist successfully",
                                        "success",
                                        3000
                                    );
                                    this.playlistService.currentPlaylist.next(
                                        null
                                    );
                                    this.playlistService.currentSong.next(null);
                                })
                            );
                    } else {
                        const playlistDTO: PlaylistDTO = {
                            name: validSong.title,
                        };
                        return this.playlistService
                            .createPlaylist(playlistDTO)
                            .pipe(
                                tap((data: any) => {
                                    const newPlaylist: Playlist = {
                                        id: data.id,
                                        name: data.name,
                                        songs: [validSong],
                                    };
                                    this.selectedPlaylist = newPlaylist;
                                    this.playlists.push(newPlaylist);
                                    this.showToast(
                                        "Playlist created successfully",
                                        "success",
                                        3000
                                    );
                                }),
                                switchMap((data: any) =>
                                    this.playlistService
                                        .addSongToPlaylist(
                                            data.id,
                                            validSong.id
                                        )
                                        .pipe(
                                            tap(() => {
                                                this.showToast(
                                                    "Song added to playlist successfully",
                                                    "success",
                                                    3000
                                                );
                                                this.playlistService.currentPlaylist.next(
                                                    null
                                                );
                                                this.playlistService.currentSong.next(
                                                    null
                                                );
                                            })
                                        )
                                )
                            );
                    }
                }),
                catchError((error) => {
                    console.error(error);
                    this.showToast("Something went wrong", "error", 3000);
                    return of(null);
                })
            )
            .subscribe();
        if (tmt == 3) {
            this.playlistService.getAllPlaylists().subscribe({
                next: (data: any) => {
                    data.map((playlist: Playlist) => {
                        const mappedPlaylist: Playlist = {
                            id: playlist.id,
                            name: playlist.name,
                            songs: playlist.songs,
                        };
                        this.playlists.push(mappedPlaylist);
                    });
                    this.selectedPlaylist = this.playlists[0];
                },
                complete: () => {
                    console.log("Playlists loaded successfully");
                },
                error: (error: any) => {
                    console.error(error);
                },
            });
        }
    }
    ngAfterViewInit(): void {}
    closeEditModal() {
        this.isEditModalOpen = false;
    }
    hideToast() {
        this.isToastVisible = false;
    }
    showToast(message: string, type: "success" | "error", length: number) {
        this.toastMessage = message;
        this.toastType = type;
        this.isToastVisible = true;

        setTimeout(() => {
            this.hideToast();
        }, length);
    }
    selectPlaylist(playlist: Playlist) {
        this.selectedPlaylist = playlist;
        this.isEditing = false;
    }
    openEditModal() {
        this.isEditModalOpen = true;
        if (this.selectedPlaylist) {
            this.isEditing = true;
            this.editablePlaylistName = this.selectedPlaylist.name;
        }
    }
    savePlaylistName(playList: Playlist) {
        debugger;
        if (this.selectedPlaylist) {
            const playlistDTO: PlaylistDTO = {
                name: this.selectedPlaylist.name,
            };
            // this.selectedPlaylist.name = this.editablePlaylistName;
            this.isEditing = false;
            this.playlistService
                .updatePlaylist(playList.id, playlistDTO)
                .subscribe({
                    next: (data: any) => {
                        const playlistResponse: Playlist = {
                            id: data.id,
                            name: data.name,
                            songs: data.songs,
                        };
                        const index = this.playlists.findIndex(
                            (p) => p.id === playlistResponse.id
                        );
                        this.playlists[index] = playlistResponse;
                        this.closeEditModal();
                        this.showToast(
                            "Playlist rename successfully",
                            "success",
                            3000
                        );
                    },
                    complete: () => {
                        console.log("Playlist updated successfully");
                    },
                    error: (error: any) => {
                        console.error(error);
                        this.showToast(
                            "Error renaming playlist",
                            "error",
                            3000
                        );
                    },
                });
        }
    }
    cancelEditing() {
        this.isEditing = false;
    }
    playSong(song: Song) {
        debugger;
        console.log(song);
        this.currentPlay.set(song.id, true);
        this.currentPlayingSong = song;
        this.audioService.playAudio(this.fileService.getFile(song.file_name));
    }
    stopSong(id: number) {
        debugger;
        this.currentPlay.set(id, false);
        this.audioService.pauseAudio();
    }
    removeFromPlaylist(playlist: Playlist, song: Song) {
        debugger;
        this.playlistService
            .removeSongFromPlaylist(playlist.id, song.id)
            .subscribe({
                next: (data: any) => {
                    debugger;
                    console.log(data);
                    const index = playlist.songs.findIndex(
                        (s) => s.id === song.id
                    );
                    playlist.songs.splice(index, 1);
                    this.showToast(
                        "Song removed from playlist",
                        "success",
                        3000
                    );
                },
                complete: () => {
                    debugger;
                    console.log("Song removed from playlist successfully");
                },
                error: (error: any) => {
                    console.error(error);
                    this.showToast(
                        "Error removing song from playlist",
                        "error",
                        3000
                    );
                },
            });
    }
    createPlaylist() {
        debugger;
        const playlistDTO: PlaylistDTO = {
            name: `New Playlist #${this.playlists.length + 1}`,
        };
        this.playlistService.createPlaylist(playlistDTO).subscribe({
            next: (data: any) => {
                debugger;
                console.log(data);
                const newPlaylist: Playlist = {
                    id: data.id,
                    name: data.name,
                    songs: [],
                };
                this.selectedPlaylist = newPlaylist;
                this.playlists.push(newPlaylist);
                this.showToast(
                    "Playlist created successfully",
                    "success",
                    3000
                );
            },
            complete: () => {
                debugger;
                console.log("Playlist created successfully");
            },
            error: (error: any) => {
                console.error(error);
                this.showToast("Error creating playlist", "error", 3000);
            },
        });
    }
    prevSong() {}
    togglePlayPause(song: Song) {
        console.log(song);
        this.audioService.playAudio(this.fileService.getFile(song.file_name));
    }
    nextSong() {}
    chkPlaying(id: number) {
        return this.currentPlay.get(id);
    }
    isPlaying(song: Song) {
        if (song === null || song === undefined) return false;
        return this.currentPlay.get(song.id) == true;
    }
    moveToAnotherPlaylist(playlist: Playlist, song: Song) {}
    closeMiniPlayer() {
        this.currentPlayingSong = null;
        this.audioService.stopAudio();
    }
    downloadSong(song: Song) {
        this.fileService.downloadSong(song).subscribe({
            next: (data: any) => {
                debugger;
                const url = window.URL.createObjectURL(data);
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = song.file_name;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            },
            complete: () => {
                debugger;
                console.log("complete");
                this.showToast(
                    "Download successfully, enjoy the music",
                    "success",
                    4000
                );
            },
            error: (err: any) => {
                debugger;
                console.log(err);
                this.showToast("Download failed", "error", 4000);
            },
        });
    }
    createPlaylistFromSong(song: Song) {}
    toggleFavorite(song: Song) {
        debugger;
        song.is_favorite = !song.is_favorite;
        const songDTO: SongDTO = {
            title: song.title,
            artist: song.artist,
            album: song.album,
            genre: song.genre,
            duration: song.duration,
            file_name: song.file_name,
            is_favorite: song.is_favorite,
        };
        this.songService.updateSongById(song.id, songDTO).subscribe({
            next: (data: any) => {
                debugger;
                console.log(data);
            },
            complete: () => {
                debugger;
                if (song.is_favorite) {
                    this.showToast(
                        "Song was added to favorite",
                        "success",
                        2000
                    );
                } else {
                    this.showToast(
                        "Song was removed from favorite",
                        "success",
                        2000
                    );
                }
            },
            error: (err: any) => {
                debugger;
                console.log(err);
            },
        });
    }
}
