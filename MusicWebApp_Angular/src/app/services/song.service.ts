import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Song } from "../models/song";
import { Injectable } from "@angular/core";
import { SongDTO } from "../dtos/song.dto";
@Injectable({
    providedIn: "root",
})
export class SongService {
    private songAPI = "http://localhost:8088/api/v1/songs";

    constructor(private http: HttpClient) {}

    getAllSongs(): Observable<Song[]> {
        return this.http.get<Song[]>(this.songAPI);
    }
    updateSongById(id: number, songDTO: SongDTO) {
        return this.http.put(`${this.songAPI}/update/${id}`, songDTO);
    }
}
