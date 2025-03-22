import{a as A,b as C,c as S}from"./chunk-APL5VXGX.js";import{a as I}from"./chunk-472C3MNF.js";import"./chunk-6JDSCIYQ.js";import"./chunk-NESCWZJB.js";import"./chunk-P4BZCRG7.js";import{a as E}from"./chunk-OEW7T7QN.js";import"./chunk-K776FSIA.js";import"./chunk-VYVOHQNH.js";import{h as u,m}from"./chunk-7GI4CMUR.js";import{C as F,H as p,e as k,f as s,j as h,l as o,z as d}from"./chunk-DNMECVE7.js";var T=k(F(),1);var N=(0,T.default)("music-metadata:parser:FLAC"),l=class extends p("FLAC"){},i=function(t){return t[t.STREAMINFO=0]="STREAMINFO",t[t.PADDING=1]="PADDING",t[t.APPLICATION=2]="APPLICATION",t[t.SEEKTABLE=3]="SEEKTABLE",t[t.VORBIS_COMMENT=4]="VORBIS_COMMENT",t[t.CUESHEET=5]="CUESHEET",t[t.PICTURE=6]="PICTURE",t}(i||{}),P=class extends I{constructor(){super(...arguments),this.vorbisParser=new S(this.metadata,this.options),this.padding=0}postId3v2Parse(){return s(this,null,function*(){if((yield this.tokenizer.readToken(E)).toString()!=="fLaC")throw new l("Invalid FLAC preamble");let a;do a=yield this.tokenizer.readToken(z),yield this.parseDataBlock(a);while(!a.lastBlock);if(this.tokenizer.fileInfo.size&&this.metadata.format.duration){let n=this.tokenizer.fileInfo.size-this.tokenizer.position;this.metadata.setFormat("bitrate",8*n/this.metadata.format.duration)}})}parseDataBlock(e){return s(this,null,function*(){switch(N(`blockHeader type=${e.type}, length=${e.length}`),e.type){case i.STREAMINFO:return this.parseBlockStreamInfo(e.length);case i.PADDING:this.padding+=e.length;break;case i.APPLICATION:break;case i.SEEKTABLE:break;case i.VORBIS_COMMENT:return this.parseComment(e.length);case i.CUESHEET:break;case i.PICTURE:yield this.parsePicture(e.length);return;default:this.metadata.addWarning(`Unknown block type: ${e.type}`)}return this.tokenizer.ignore(e.length).then()})}parseBlockStreamInfo(e){return s(this,null,function*(){if(e!==w.len)throw new l("Unexpected block-stream-info length");let a=yield this.tokenizer.readToken(w);this.metadata.setFormat("container","FLAC"),this.metadata.setFormat("codec","FLAC"),this.metadata.setFormat("lossless",!0),this.metadata.setFormat("numberOfChannels",a.channels),this.metadata.setFormat("bitsPerSample",a.bitsPerSample),this.metadata.setFormat("sampleRate",a.sampleRate),a.totalSamples>0&&this.metadata.setFormat("duration",a.totalSamples/a.sampleRate)})}parseComment(e){return s(this,null,function*(){let a=yield this.tokenizer.readToken(new d(e)),n=new C(a,0);n.readStringUtf8();let g=n.readInt32(),c=new Array(g);for(let r=0;r<g;r++)c[r]=n.parseUserComment();yield Promise.all(c.map(r=>this.vorbisParser.addTag(r.key,r.value)))})}parsePicture(e){return s(this,null,function*(){if(this.options.skipCovers)return this.tokenizer.ignore(e);let a=yield this.tokenizer.readToken(new A(e));this.vorbisParser.addTag("METADATA_BLOCK_PICTURE",a)})}},z={len:4,get:(t,e)=>({lastBlock:u(t,e,7),type:m(t,e,1,7),length:o.get(t,e+1)})},w={len:34,get:(t,e)=>({minimumBlockSize:h.get(t,e),maximumBlockSize:h.get(t,e+2)/1e3,minimumFrameSize:o.get(t,e+4),maximumFrameSize:o.get(t,e+7),sampleRate:o.get(t,e+10)>>4,channels:m(t,e+12,4,3)+1,bitsPerSample:m(t,e+12,7,5)+1,totalSamples:m(t,e+13,4,36),fileMD5:new d(16).get(t,e+18)})};export{P as FlacParser};
