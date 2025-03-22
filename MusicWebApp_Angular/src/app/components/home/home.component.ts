import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Song } from "../../models/song";
import { SongService } from "../../services/song.service";
import { Mp3MetadataService } from "../../services/mp3-metadata.service";
import { FileService } from "../../services/file.service";
import { HttpEventType } from "@angular/common/http";
import { SongDTO } from "../../dtos/song.dto";
import { ActivatedRoute, Router } from "@angular/router";
import { Playlist } from "../../models/playlist";
import { PlaylistService } from "../../services/playlist.service";
import { PlaylistDTO } from "../../dtos/playlist.dto";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit, AfterViewInit {
    public queue: Song[] = [];
    public recentlyPlayed: Song[] = [];
    public playlists: Playlist[] = [];
    public hoveredIndex: number = -1;
    public songs: Song[] = [];
    public isShuffle: boolean = false;
    public timesPlayed: number = 0;
    public prevSongId: number = -1;
    public currentPlay: Map<number, boolean> = new Map();
    public currentSong: Song = {
        id: 0,
        title: "",
        artist: "",
        album: "",
        genre: "",
        duration: "",
        file_name: "",
        is_favorite: false,
    };
    public currentFile?: File;
    public selectedFiles?: FileList;
    public metadata: any = null;
    public progress: number = 0;
    public isQueueOpen: boolean = false;
    public isRecentOpen: boolean = false;
    public isToastVisible: boolean = false;
    public toastMessage: string = "";
    public toastType: "success" | "error" = "success";
    public isReplay: boolean = false;
    public isFavoritePage: boolean = false;

    constructor(
        private songService: SongService,
        private mp3MetadataService: Mp3MetadataService,
        private fileService: FileService,
        private route: ActivatedRoute,
        private playlistService: PlaylistService,
        private router: Router
    ) {}
    ngOnInit(): void {
        this.songService.getAllSongs().subscribe({
            next: (data: any) => {
                debugger;
                data.map((song: Song) => {
                    const mappedSong: Song = {
                        id: song.id,
                        title: song.title,
                        artist: song.artist,
                        album: song.album,
                        genre: song.genre,
                        duration: song.duration,
                        file_name: song.file_name,
                        is_favorite: song.is_favorite,
                    }
                    this.songs.push(mappedSong);
                });
                if (this.isFavoritePage) {
                    this.songs = this.songs.filter((song) => song.is_favorite);
                }
            },
            complete: () => {
                debugger;
                console.log("complete");
            },
            error: (err: any) => {
                debugger;
                console.log(err);
            },
        });
        this.playlistService.getAllPlaylists().subscribe({
            next: (data: any) => {
                debugger;
                data.map((playlist: Playlist) => {
                    const mappedPlaylist: Playlist = {
                        id: playlist.id,
                        name: playlist.name,
                        songs: playlist.songs,
                    }
                    this.playlists.push(mappedPlaylist);
                });
            },
            complete: () => {
                debugger;
                console.log("complete");
            },
            error: (err: any) => {
                debugger;
                console.log(err);
            },
        });
        this.route.url.subscribe((url) => {
            debugger
            this.isFavoritePage = url.some(
                (segment) => segment.path === "favorite"
            );
            if (this.isFavoritePage) {
                this.songs = this.songs.filter((song) => song.is_favorite);
            }
        });
        this.currentSong = this.songs[0];
        const savedQueue = localStorage.getItem("musicQueue");
        if (savedQueue) {
            this.queue = JSON.parse(savedQueue);
        }
    }
    ngAfterViewInit(): void {
        debugger;
        const audio = document.querySelector("audio") as HTMLAudioElement;
        audio.addEventListener("ended", () => {
            if (this.isReplay) {
                audio.play();
            } else {
                this.showToast(
                    "Chưa hết nhạc đâu nghe tiếp nè",
                    "success",
                    2500
                );
                this.playNextSong();
            }
        });
    }
    addToQueue(song: Song) {
        this.queue.push(song);
        this.showToast("Added to queue", "success", 2000);
        localStorage.setItem("musicQueue", JSON.stringify(this.queue));
        if (!this.currentSong) {
            this.playNextSong();
        }
    }
    playNextSong() {
        if (this.queue.length > 0) {
            this.recentlyPlayed.push(this.currentSong);
            if (this.isShuffle) {
                this.shuffleQueue();
            }
            const nextSong = this.queue.shift();
            if (this.queue.length === 0) {
                this.showToast(
                    "Đừng để quá trình nghe nhạc bị gián đoạn, thêm bài hát vào hàng chờ ngay",
                    "success",
                    4000
                );
            }
            if (nextSong) {
                this.playSong(nextSong);
            }
            localStorage.setItem("musicQueue", JSON.stringify(this.queue));
        } else {
            console.log("Queue trống, không có bài hát tiếp theo.");
        }
    }
    deleteFromQueue(index: number) {
        this.queue.splice(index, 1);
        localStorage.setItem("musicQueue", JSON.stringify(this.queue));
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

    openQueueModal() {
        if (!this.isQueueOpen) {
            this.isQueueOpen = true;
        }
    }
    closeQueueModal() {
        this.isQueueOpen = false;
    }
    openRecentModal() {
        if (!this.isRecentOpen) {
            this.isRecentOpen = true;
        }
    }
    closeRecentModal() {
        this.isRecentOpen = false;
    }
    nextSong() {
        const index = this.songs.indexOf(this.currentSong);
        if (this.queue.length > 0) {
            this.recentlyPlayed.push(this.currentSong);
            this.currentSong = this.queue[0];
            this.playSong(this.currentSong);
        } else {
            if (index < this.songs.length - 1) {
                this.recentlyPlayed.push(this.currentSong);
                this.currentSong = this.songs[index + 1];
                this.playSong(this.currentSong);
            }
        }
    }
    prevSong() {
        const index = this.songs.indexOf(this.currentSong);
        if (this.recentlyPlayed.length > 0) {
            this.currentSong = this.recentlyPlayed[0];
            this.playSong(this.currentSong);
        } else {
            if (index >= 1) {
                this.currentSong = this.songs[index - 1];
                this.playSong(this.currentSong);
            }
        }
    }
    getNextSong(song: Song): Song {
        const index = this.songs.indexOf(song);
        let nextSong: Song = {
            id: 0,
            title: "",
            artist: "",
            album: "",
            genre: "",
            duration: "",
            file_name: "",
            is_favorite: false,
        };
        if (index < this.songs.length - 1) {
            nextSong = this.songs[index + 1];
        }
        return nextSong;
    }
    toggleFavorite(song: Song) {
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
    selectPlaylist(playlist: Playlist, song: Song) {
        debugger;
        this.playlistService.setNewPlaylistSong(song);
        this.playlistService.setNewPlaylist(playlist);
        this.router.navigate(["/playlist"]);
    }
    playSong(song: Song) {
        debugger;
        this.currentPlay.set(song.id, true);
        this.timesPlayed++;
        if (this.prevSongId == -1) {
            this.prevSongId = song.id;
            this.currentSong = song;
        }
        if (this.prevSongId != song.id) {
            this.timesPlayed = 1;
            this.currentPlay.set(this.prevSongId, false);
            this.prevSongId = song.id;
            this.currentSong = song;
        }
        const audio = document.querySelector("audio") as HTMLAudioElement;
        if (this.timesPlayed == 1) {
            audio.src = this.fileService.getFile(song.file_name);
        }
        audio.play();
        if (this.queue.length === 0) {
            this.queue = this.songs.filter((s) => s.id !== song.id);
            localStorage.setItem("musicQueue", JSON.stringify(this.queue));
        }
    }
    pauseSong(id: number) {
        debugger;
        this.timesPlayed++;
        this.currentPlay.set(id, false);
        const audio = document.querySelector("audio") as HTMLAudioElement;
        audio.pause();
    }
    chkPlaying(id: number) {
        return this.currentPlay.get(id);
    }
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        if (this.isShuffle) {
            this.shuffleQueue();
        } else {
            this.queue = this.songs.filter((s) => s.id !== this.currentSong.id);
        }
        localStorage.setItem("musicQueue", JSON.stringify(this.queue));
    }
    shuffleQueue() {
        for (let i = this.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }
    }
    toggleReplay() {
        this.isReplay = !this.isReplay;
    }
    isPlaying(song: Song) {
        if (song === null || song === undefined) return false;
        return this.currentPlay.get(song.id) == true;
    }
    async onUpload(event: any) {
        debugger;
        this.selectedFiles = event.target.files;
        if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);
            if (file) {
                this.currentFile = file;
                this.metadata = await this.mp3MetadataService.extractMetadata(
                    file
                );
                const songDTO: SongDTO = {
                    title: this.metadata.title,
                    artist: this.metadata.artist,
                    album: this.metadata.album,
                    genre: this.metadata.genre,
                    duration: this.metadata.duration,
                    file_name: this.currentFile.name,
                    is_favorite: false,
                };
                this.fileService.upLoad(file, songDTO).subscribe({
                    next: (event: any) => {
                        debugger;
                        if (event.type === HttpEventType.UploadProgress) {
                            this.progress = Math.round(
                                (100 * event.loaded) / event.total
                            );
                        }
                        let lastIndex = this.songs[this.songs.length - 1].id;
                        let duration = songDTO.duration;
                        duration = songDTO.duration.substring(
                            0,
                            duration.length - 11
                        );
                        let durationInt = parseInt(duration);
                        let minutes = Math.floor(durationInt / 60);
                        let seconds = durationInt % 60;
                        duration = minutes + ":" + seconds;
                        const newSong: Song = {
                            id: lastIndex + 1,
                            title: songDTO.title,
                            artist: songDTO.artist,
                            album: songDTO.album,
                            genre: songDTO.genre,
                            duration: duration,
                            file_name: songDTO.file_name,
                            is_favorite: songDTO.is_favorite,
                        };
                        this.songs.push(newSong);
                    },
                    complete: () => {
                        debugger;
                        console.log("complete");
                        this.showToast(
                            "Upload successfully, enjoy the music",
                            "success",
                            4000
                        );
                    },
                    error: (err: any) => {
                        debugger;
                        console.log(err);
                        this.showToast(
                            "Your file already exists in the system",
                            "error",
                            4000
                        );
                    },
                });
            }
        }
    }
    toggleQueue() {
        this.isQueueOpen = !this.isQueueOpen;
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
    createPlaylistFromSong(song: Song) {
        debugger;
        this.playlistService.setNewPlaylistSong(song);
        this.router.navigate(["/playlist"]);
    }
}
