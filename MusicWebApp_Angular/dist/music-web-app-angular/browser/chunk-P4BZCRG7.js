import{a as B}from"./chunk-OEW7T7QN.js";import{c as y}from"./chunk-K776FSIA.js";import{a as U,i as z}from"./chunk-7GI4CMUR.js";import{A as k,C as $,H as A,I as x,e as f,f as d,i as m,m as a,z as F}from"./chunk-DNMECVE7.js";var H=f($(),1);var g=function(t){return t[t.text_utf8=0]="text_utf8",t[t.binary=1]="binary",t[t.external_info=2]="external_info",t[t.reserved=3]="reserved",t}(g||{}),P={len:52,get:(t,e)=>({ID:B.get(t,e),version:a.get(t,e+4)/1e3,descriptorBytes:a.get(t,e+8),headerBytes:a.get(t,e+12),seekTableBytes:a.get(t,e+16),headerDataBytes:a.get(t,e+20),apeFrameDataBytes:a.get(t,e+24),apeFrameDataBytesHigh:a.get(t,e+28),terminatingDataBytes:a.get(t,e+32),fileMD5:new F(16).get(t,e+36)})},_={len:24,get:(t,e)=>({compressionLevel:m.get(t,e),formatFlags:m.get(t,e+2),blocksPerFrame:a.get(t,e+4),finalFrameBlocks:a.get(t,e+8),totalFrames:a.get(t,e+12),bitsPerSample:m.get(t,e+16),channel:m.get(t,e+18),sampleRate:a.get(t,e+20)})},n={len:32,get:(t,e)=>({ID:new k(8,"ascii").get(t,e),version:a.get(t,e+8),size:a.get(t,e+12),fields:a.get(t,e+16),flags:L(a.get(t,e+20))})},w={len:8,get:(t,e)=>({size:a.get(t,e),flags:L(a.get(t,e+4))})};function L(t){return{containsHeader:E(t,31),containsFooter:E(t,30),isHeader:E(t,29),readOnly:E(t,0),dataType:(t&6)>>1}}function E(t,e){return(t&1<<e)!==0}var p=(0,H.default)("music-metadata:parser:APEv2"),N="APEv2",v="APETAGEX",T=class extends A("APEv2"){},D=class t extends x{constructor(){super(...arguments),this.ape={}}static tryParseApeHeader(e,r,i){return new t(e,r,i).tryParseApeHeader()}static calculateDuration(e){let r=e.totalFrames>1?e.blocksPerFrame*(e.totalFrames-1):0;return r+=e.finalFrameBlocks,r/e.sampleRate}static findApeFooterOffset(e,r){return d(this,null,function*(){let i=new Uint8Array(n.len),o=e.position;yield e.readBuffer(i,{position:r-n.len}),e.setPosition(o);let s=n.get(i,0);if(s.ID==="APETAGEX")return s.flags.isHeader?p(`APE Header found at offset=${r-n.len}`):(p(`APE Footer found at offset=${r-n.len}`),r-=s.size),{footer:s,offset:r}})}static parseTagFooter(e,r,i){let o=n.get(r,r.length-n.len);if(o.ID!==v)throw new T("Unexpected APEv2 Footer ID preamble value");return y(r),new t(e,y(r),i).parseTags(o)}tryParseApeHeader(){return d(this,null,function*(){if(this.tokenizer.fileInfo.size&&this.tokenizer.fileInfo.size-this.tokenizer.position<n.len){p("No APEv2 header found, end-of-file reached");return}let e=yield this.tokenizer.peekToken(n);if(e.ID===v)return yield this.tokenizer.ignore(n.len),this.parseTags(e);if(p(`APEv2 header not found at offset=${this.tokenizer.position}`),this.tokenizer.fileInfo.size){let r=this.tokenizer.fileInfo.size-this.tokenizer.position,i=new Uint8Array(r);return yield this.tokenizer.readBuffer(i),t.parseTagFooter(this.metadata,i,this.options)}})}parse(){return d(this,null,function*(){let e=yield this.tokenizer.readToken(P);if(e.ID!=="MAC ")throw new T("Unexpected descriptor ID");this.ape.descriptor=e;let r=e.descriptorBytes-P.len,i=yield r>0?this.parseDescriptorExpansion(r):this.parseHeader();return yield this.tokenizer.ignore(i.forwardBytes),this.tryParseApeHeader()})}parseTags(e){return d(this,null,function*(){let r=new Uint8Array(256),i=e.size-n.len;p(`Parse APE tags at offset=${this.tokenizer.position}, size=${i}`);for(let o=0;o<e.fields;o++){if(i<w.len){this.metadata.addWarning(`APEv2 Tag-header: ${e.fields-o} items remaining, but no more tag data to read.`);break}let s=yield this.tokenizer.readToken(w);i-=w.len+s.size,yield this.tokenizer.peekBuffer(r,{length:Math.min(r.length,i)});let h=z(r,0,r.length),c=yield this.tokenizer.readToken(new k(h,"ascii"));switch(yield this.tokenizer.ignore(1),i-=c.length+1,s.flags.dataType){case g.text_utf8:{let I=(yield this.tokenizer.readToken(new k(s.size,"utf8"))).split(/\x00/g);yield Promise.all(I.map(u=>this.metadata.addTag(N,c,u)));break}case g.binary:if(this.options.skipCovers)yield this.tokenizer.ignore(s.size);else{let l=new Uint8Array(s.size);yield this.tokenizer.readBuffer(l),h=z(l,0,l.length);let I=U(l.slice(0,h)),u=l.slice(h+1);yield this.metadata.addTag(N,c,{description:I,data:u})}break;case g.external_info:p(`Ignore external info ${c}`),yield this.tokenizer.ignore(s.size);break;case g.reserved:p(`Ignore external info ${c}`),this.metadata.addWarning(`APEv2 header declares a reserved datatype for "${c}"`),yield this.tokenizer.ignore(s.size);break}}})}parseDescriptorExpansion(e){return d(this,null,function*(){return yield this.tokenizer.ignore(e),this.parseHeader()})}parseHeader(){return d(this,null,function*(){let e=yield this.tokenizer.readToken(_);if(this.metadata.setFormat("lossless",!0),this.metadata.setFormat("container","Monkey's Audio"),this.metadata.setFormat("bitsPerSample",e.bitsPerSample),this.metadata.setFormat("sampleRate",e.sampleRate),this.metadata.setFormat("numberOfChannels",e.channel),this.metadata.setFormat("duration",t.calculateDuration(e)),!this.ape.descriptor)throw new T("Missing APE descriptor");return{forwardBytes:this.ape.descriptor.seekTableBytes+this.ape.descriptor.headerDataBytes+this.ape.descriptor.apeFrameDataBytes+this.ape.descriptor.terminatingDataBytes}})}};export{T as a,D as b};
