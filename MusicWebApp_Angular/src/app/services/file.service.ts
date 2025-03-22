import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Song } from "../models/song";
import { Observable } from "rxjs";
import { SongDTO } from "../dtos/song.dto";

@Injectable({ providedIn: "root" })
export class FileService {
    private fileAPI = "http://localhost:8088/api/v1/files";
    constructor(private http: HttpClient) {}
    getFile(fileName: string) {
        return `${this.fileAPI}/${encodeURIComponent(fileName)}`;
    }
    upLoad(file: File, songDTO: SongDTO): Observable<any> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
            "dto",
            new Blob([JSON.stringify(songDTO)], { type: "application/json" })
        );
        return this.http.post<any>(`${this.fileAPI}/uploads`, formData, {
            reportProgress: true,
            responseType: "json",
        });
    }
    downloadSong(song: Song) {
        debugger;
        const url = `${this.fileAPI}/download?url=${`${
            this.fileAPI
        }/${encodeURIComponent(song.file_name)}`}`;
        return this.http.get(url, { responseType: "blob" as "json" });
    }
}
