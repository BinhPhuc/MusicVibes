import './polyfills.server.mjs';
import{b as x}from"./chunk-MNUGV5G3.mjs";import{a as p}from"./chunk-5UP6YO5R.mjs";import"./chunk-SOGTJI5B.mjs";import{c as b}from"./chunk-X7WAPDBZ.mjs";import{C as D,D as z,c as N,d as k,e as f,g as S,i as r,v as u}from"./chunk-BMAIRAQG.mjs";import{g as U,i as d}from"./chunk-QYG7H2UI.mjs";var y=[6e3,8e3,9600,11025,12e3,16e3,22050,24e3,32e3,44100,48e3,64e3,88200,96e3,192e3,-1],c={len:32,get:(a,t)=>{let e=r.get(a,t+24),i={BlockID:p.get(a,t),blockSize:r.get(a,t+4),version:f.get(a,t+8),totalSamples:r.get(a,t+12),blockIndex:r.get(a,t+16),blockSamples:r.get(a,t+20),flags:{bitsPerSample:(1+g(e,0,2))*8,isMono:o(e,2),isHybrid:o(e,3),isJointStereo:o(e,4),crossChannel:o(e,5),hybridNoiseShaping:o(e,6),floatingPoint:o(e,7),samplingRate:y[g(e,23,4)],isDSD:o(e,31)},crc:new u(4).get(a,t+28)};return i.flags.isDSD&&(i.totalSamples*=8),i}},h={len:1,get:(a,t)=>({functionId:g(a[t],0,6),isOptional:o(a[t],5),isOddSize:o(a[t],6),largeBlock:o(a[t],7)})};function o(a,t){return g(a,t,1)===1}function g(a,t,e){return a>>>t&4294967295>>>32-e}var w=U(N(),1);var n=(0,w.default)("music-metadata:parser:WavPack"),m=class extends D("WavPack"){},B=class extends z{constructor(){super(...arguments),this.audioDataSize=0}parse(){return d(this,null,function*(){return this.audioDataSize=0,yield this.parseWavPackBlocks(),x.tryParseApeHeader(this.metadata,this.tokenizer,this.options)})}parseWavPackBlocks(){return d(this,null,function*(){do{if((yield this.tokenizer.peekToken(p))!=="wvpk")break;let e=yield this.tokenizer.readToken(c);if(e.BlockID!=="wvpk")throw new m("Invalid WavPack Block-ID");n(`WavPack header blockIndex=${e.blockIndex}, len=${c.len}`),e.blockIndex===0&&!this.metadata.format.container&&(this.metadata.setFormat("container","WavPack"),this.metadata.setFormat("lossless",!e.flags.isHybrid),this.metadata.setFormat("bitsPerSample",e.flags.bitsPerSample),e.flags.isDSD||(this.metadata.setFormat("sampleRate",e.flags.samplingRate),this.metadata.setFormat("duration",e.totalSamples/e.flags.samplingRate)),this.metadata.setFormat("numberOfChannels",e.flags.isMono?1:2),this.metadata.setFormat("numberOfSamples",e.totalSamples),this.metadata.setFormat("codec",e.flags.isDSD?"DSD":"PCM"));let i=e.blockSize-(c.len-8);yield e.blockIndex===0?this.parseMetadataSubBlock(e,i):this.tokenizer.ignore(i),e.blockSamples>0&&(this.audioDataSize+=e.blockSize)}while(!this.tokenizer.fileInfo.size||this.tokenizer.fileInfo.size-this.tokenizer.position>=c.len);this.metadata.format.duration&&this.metadata.setFormat("bitrate",this.audioDataSize*8/this.metadata.format.duration)})}parseMetadataSubBlock(t,e){return d(this,null,function*(){let i=e;for(;i>h.len;){let s=yield this.tokenizer.readToken(h),I=yield this.tokenizer.readNumber(s.largeBlock?S:k),l=new Uint8Array(I*2-(s.isOddSize?1:0));switch(yield this.tokenizer.readBuffer(l),n(`Metadata Sub-Blocks functionId=0x${s.functionId.toString(16)}, id.largeBlock=${s.largeBlock},data-size=${l.length}`),s.functionId){case 0:break;case 14:{n("ID_DSD_BLOCK");let F=1<<k.get(l,0),T=t.flags.samplingRate*F*8;if(!t.flags.isDSD)throw new m("Only expect DSD block if DSD-flag is set");this.metadata.setFormat("sampleRate",T),this.metadata.setFormat("duration",t.totalSamples/T);break}case 36:n("ID_ALT_TRAILER: trailer for non-wav files");break;case 38:this.metadata.setFormat("audioMD5",l);break;case 47:n(`ID_BLOCK_CHECKSUM: checksum=${b(l)}`);break;default:n(`Ignore unsupported meta-sub-block-id functionId=0x${s.functionId.toString(16)}`);break}i-=h.len+(s.largeBlock?S.len:k.len)+I*2,n(`remainingLength=${i}`),s.isOddSize&&this.tokenizer.ignore(1)}if(i!==0)throw new m("metadata-sub-block should fit it remaining length")})}};export{m as WavPackContentError,B as WavPackParser};
