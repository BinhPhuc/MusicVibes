import './polyfills.server.mjs';
import{a as D}from"./chunk-RVUKZ57B.mjs";import"./chunk-B6TGWD6U.mjs";import"./chunk-MNUGV5G3.mjs";import{a as f}from"./chunk-5UP6YO5R.mjs";import{a as z,c as A}from"./chunk-SOGTJI5B.mjs";import"./chunk-ZRBCXS6J.mjs";import{l as h}from"./chunk-X7WAPDBZ.mjs";import{C as E,D as R,c as x,e as s,i as o,v as g,w as r}from"./chunk-BMAIRAQG.mjs";import{g as C,i as d}from"./chunk-QYG7H2UI.mjs";var _=C(x(),1);var m={len:8,get:(t,e)=>({chunkID:new r(4,"latin1").get(t,e),chunkSize:o.get(t,e+4)})},l=class{constructor(e){this.tagHeader=e,this.len=e.chunkSize,this.len+=this.len&1}get(e,n){return new r(this.tagHeader.chunkSize,"ascii").get(e,n)}};var k=class extends E("Wave"){},S=function(t){return t[t.PCM=1]="PCM",t[t.ADPCM=2]="ADPCM",t[t.IEEE_FLOAT=3]="IEEE_FLOAT",t[t.MPEG_ADTS_AAC=5632]="MPEG_ADTS_AAC",t[t.MPEG_LOAS=5634]="MPEG_LOAS",t[t.RAW_AAC1=255]="RAW_AAC1",t[t.DOLBY_AC3_SPDIF=146]="DOLBY_AC3_SPDIF",t[t.DVM=8192]="DVM",t[t.RAW_SPORT=576]="RAW_SPORT",t[t.ESST_AC3=577]="ESST_AC3",t[t.DRM=9]="DRM",t[t.DTS2=8193]="DTS2",t[t.MPEG=80]="MPEG",t}(S||{}),u=class{constructor(e){if(e.chunkSize<16)throw new k("Invalid chunk size");this.len=e.chunkSize}get(e,n){return{wFormatTag:s.get(e,n),nChannels:s.get(e,n+2),nSamplesPerSec:o.get(e,n+4),nAvgBytesPerSec:o.get(e,n+8),nBlockAlign:s.get(e,n+12),wBitsPerSample:s.get(e,n+14)}}},p=class{constructor(e){if(e.chunkSize<4)throw new k("Invalid fact chunk size.");this.len=e.chunkSize}get(e,n){return{dwSampleLength:o.get(e,n)}}};var w={len:420,get:(t,e)=>({description:h(new r(256,"ascii").get(t,e)).trim(),originator:h(new r(32,"ascii").get(t,e+256)).trim(),originatorReference:h(new r(32,"ascii").get(t,e+288)).trim(),originationDate:h(new r(10,"ascii").get(t,e+320)).trim(),originationTime:h(new r(8,"ascii").get(t,e+330)).trim(),timeReferenceLow:o.get(t,e+338),timeReferenceHigh:o.get(t,e+342),version:s.get(t,e+346),umid:new g(64).get(t,e+348),loudnessValue:s.get(t,e+412),maxTruePeakLevel:s.get(t,e+414),maxMomentaryLoudness:s.get(t,e+416),maxShortTermLoudness:s.get(t,e+418)})};var c=(0,_.default)("music-metadata:parser:RIFF"),L=class extends R{constructor(){super(...arguments),this.blockAlign=0}parse(){return d(this,null,function*(){let e=yield this.tokenizer.readToken(m);if(c(`pos=${this.tokenizer.position}, parse: chunkID=${e.chunkID}`),e.chunkID==="RIFF")return this.parseRiffChunk(e.chunkSize).catch(n=>{if(!(n instanceof z))throw n})})}parseRiffChunk(e){return d(this,null,function*(){let n=yield this.tokenizer.readToken(f);switch(this.metadata.setFormat("container",n),n){case"WAVE":return this.readWaveChunk(e-f.len);default:throw new k(`Unsupported RIFF format: RIFF/${n}`)}})}readWaveChunk(e){return d(this,null,function*(){for(;e>=m.len;){let n=yield this.tokenizer.readToken(m);switch(e-=m.len+n.chunkSize,n.chunkSize>e&&this.metadata.addWarning("Data chunk size exceeds file size"),this.header=n,c(`pos=${this.tokenizer.position}, readChunk: chunkID=RIFF/WAVE/${n.chunkID}`),n.chunkID){case"LIST":yield this.parseListTag(n);break;case"fact":this.metadata.setFormat("lossless",!1),this.fact=yield this.tokenizer.readToken(new p(n));break;case"fmt ":{let i=yield this.tokenizer.readToken(new u(n)),a=S[i.wFormatTag];a||(c(`WAVE/non-PCM format=${i.wFormatTag}`),a=`non-PCM (${i.wFormatTag})`),this.metadata.setFormat("codec",a),this.metadata.setFormat("bitsPerSample",i.wBitsPerSample),this.metadata.setFormat("sampleRate",i.nSamplesPerSec),this.metadata.setFormat("numberOfChannels",i.nChannels),this.metadata.setFormat("bitrate",i.nBlockAlign*i.nSamplesPerSec*8),this.blockAlign=i.nBlockAlign;break}case"id3 ":case"ID3 ":{let i=yield this.tokenizer.readToken(new g(n.chunkSize)),a=A(i);yield new D().parse(this.metadata,a,this.options);break}case"data":{this.metadata.format.lossless!==!1&&this.metadata.setFormat("lossless",!0);let i=n.chunkSize;if(this.tokenizer.fileInfo.size){let T=this.tokenizer.fileInfo.size-this.tokenizer.position;T<i&&(this.metadata.addWarning("data chunk length exceeding file length"),i=T)}let a=this.fact?this.fact.dwSampleLength:i===4294967295?void 0:i/this.blockAlign;a&&(this.metadata.setFormat("numberOfSamples",a),this.metadata.format.sampleRate&&this.metadata.setFormat("duration",a/this.metadata.format.sampleRate)),this.metadata.format.codec==="ADPCM"?this.metadata.setFormat("bitrate",352e3):this.metadata.format.sampleRate&&this.metadata.setFormat("bitrate",this.blockAlign*this.metadata.format.sampleRate*8),yield this.tokenizer.ignore(n.chunkSize);break}case"bext":{let i=yield this.tokenizer.readToken(w);Object.keys(i).forEach(T=>{this.metadata.addTag("exif",`bext.${T}`,i[T])});let a=n.chunkSize-w.len;yield this.tokenizer.ignore(a);break}case"\0\0\0\0":c(`Ignore padding chunk: RIFF/${n.chunkID} of ${n.chunkSize} bytes`),this.metadata.addWarning(`Ignore chunk: RIFF/${n.chunkID}`),yield this.tokenizer.ignore(n.chunkSize);break;default:c(`Ignore chunk: RIFF/${n.chunkID} of ${n.chunkSize} bytes`),this.metadata.addWarning(`Ignore chunk: RIFF/${n.chunkID}`),yield this.tokenizer.ignore(n.chunkSize)}this.header.chunkSize%2===1&&(c("Read odd padding byte"),yield this.tokenizer.ignore(1))}})}parseListTag(e){return d(this,null,function*(){let n=yield this.tokenizer.readToken(new r(4,"latin1"));switch(c("pos=%s, parseListTag: chunkID=RIFF/WAVE/LIST/%s",this.tokenizer.position,n),n){case"INFO":return this.parseRiffInfoTags(e.chunkSize-4);default:return this.metadata.addWarning(`Ignore chunk: RIFF/WAVE/LIST/${n}`),c(`Ignoring chunkID=RIFF/WAVE/LIST/${n}`),this.tokenizer.ignore(e.chunkSize-4).then()}})}parseRiffInfoTags(e){return d(this,null,function*(){for(;e>=8;){let n=yield this.tokenizer.readToken(m),i=new l(n),a=yield this.tokenizer.readToken(i);this.addTag(n.chunkID,h(a)),e-=8+i.len}if(e!==0)throw new k(`Illegal remaining size: ${e}`)})}addTag(e,n){this.metadata.addTag("exif",e,n)}};export{L as WaveParser};
