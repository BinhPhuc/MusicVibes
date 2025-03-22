import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class AudioService {
    private audioContext: AudioContext | null = null;
    private source: AudioBufferSourceNode | null = null;
    private audioBuffer: AudioBuffer | null = null;
    private startTime: number = 0;
    private pauseTime: number = 0;
    private isPlaying: boolean = false;
    private currentUrl: string = "";

    constructor() {
        this.audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
    }
    private isNewSong(url: string): boolean {
        return this.currentUrl !== url;
    }
    async playAudio(url: string) {
        if (!this.audioContext) return;
        if (this.isNewSong(url)) {
            this.currentUrl = url;
            await this.fetchAudio(url);
        }
        if (!this.isPlaying && this.audioBuffer) {
            this.resumeAudio();
        }
    }
    private async fetchAudio(url: string) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.audioContext!.decodeAudioData(
                arrayBuffer
            );
            this.startTime = this.audioContext!.currentTime;
            this.pauseTime = 0;
            this.playBuffer();
        } catch (error) {
            console.error("Lỗi khi tải file:", error);
        }
    }
    private playBuffer() {
        if (!this.audioContext || !this.audioBuffer) return;
        this.stopAudio();
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.audioContext.destination);
        this.startTime = this.audioContext.currentTime - this.pauseTime;
        this.source.start(0, this.pauseTime);
        this.isPlaying = true;
        this.source.onended = () => {
            this.isPlaying = false;
            this.pauseTime = 0;
        };
    }
    pauseAudio() {
        if (this.source && this.isPlaying) {
            this.source.stop();
            this.pauseTime = this.audioContext!.currentTime - this.startTime;
            this.isPlaying = false;
        }
    }
    stopAudio() {
        if (this.source) {
            this.source.stop();
            this.source = null;
            this.isPlaying = false;
            this.pauseTime = 0;
        }
    }
    resumeAudio() {
        if (!this.isPlaying && this.audioBuffer) {
            this.playBuffer();
        }
    }
}
