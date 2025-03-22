import { Song } from "./song";

export interface Playlist {
	id: number;
	name: string;
	songs: Song[];
}