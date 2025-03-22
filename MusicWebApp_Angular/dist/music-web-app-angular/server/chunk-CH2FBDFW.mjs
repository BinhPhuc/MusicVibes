import './polyfills.server.mjs';
import{a as w}from"./chunk-ZRBCXS6J.mjs";import{C as I,c as B,d as y,i as o,j as i,w as h}from"./chunk-BMAIRAQG.mjs";import{g as x,i as r}from"./chunk-QYG7H2UI.mjs";var d=class s{static fromBase64(e){return s.fromBuffer(Uint8Array.from(atob(e),t=>t.charCodeAt(0)))}static fromBuffer(e){return new s(e.length).get(e,0)}constructor(e){this.len=e}get(e,t){let n=w[i.get(e,t)];t+=4;let a=i.get(e,t);t+=4;let m=new h(a,"utf-8").get(e,t);t+=a;let l=i.get(e,t);t+=4;let u=new h(l,"utf-8").get(e,t);t+=l;let k=i.get(e,t);t+=4;let U=i.get(e,t);t+=4;let C=i.get(e,t);t+=4;let _=i.get(e,t);t+=4;let b=i.get(e,t);t+=4;let S=Uint8Array.from(e.slice(t,t+b));return{type:n,format:m,description:u,width:k,height:U,colour_depth:C,indexed_color:_,data:S}}},g={len:7,get:(s,e)=>({packetType:y.get(s,e),vorbis:new h(6,"ascii").get(s,e+1)})},E={len:23,get:(s,e)=>({version:o.get(s,e+0),channelMode:y.get(s,e+4),sampleRate:o.get(s,e+5),bitrateMax:o.get(s,e+9),bitrateNominal:o.get(s,e+13),bitrateMin:o.get(s,e+17)})};var T=class{constructor(e,t){this.data=e,this.offset=t}readInt32(){let e=o.get(this.data,this.offset);return this.offset+=4,e}readStringUtf8(){let e=this.readInt32(),t=new TextDecoder("utf-8").decode(this.data.subarray(this.offset,this.offset+e));return this.offset+=e,t}parseUserComment(){let e=this.offset,t=this.readStringUtf8(),n=t.indexOf("=");return{key:t.slice(0,n).toUpperCase(),value:t.slice(n+1),len:this.offset-e}}};var P=x(B(),1);var c=(0,P.default)("music-metadata:parser:ogg:vorbis1"),p=class extends I("Vorbis"){},L=class s{constructor(e,t){this.metadata=e,this.options=t,this.pageSegments=[]}parsePage(e,t){return r(this,null,function*(){if(e.headerType.firstPage)this.parseFirstPage(e,t);else{if(e.headerType.continued){if(this.pageSegments.length===0)throw new p("Cannot continue on previous page");this.pageSegments.push(t)}if(e.headerType.lastPage||!e.headerType.continued){if(this.pageSegments.length>0){let n=s.mergeUint8Arrays(this.pageSegments);yield this.parseFullPage(n)}this.pageSegments=e.headerType.lastPage?[]:[t]}}e.headerType.lastPage&&this.calculateDuration(e)})}static mergeUint8Arrays(e){let t=e.reduce((a,m)=>a+m.length,0),n=new Uint8Array(t);return e.forEach((a,m,l)=>{let u=l.slice(0,m).reduce((k,U)=>k+U.length,0);n.set(a,u)}),n}flush(){return r(this,null,function*(){yield this.parseFullPage(s.mergeUint8Arrays(this.pageSegments))})}parseUserComment(e,t){return r(this,null,function*(){let a=new T(e,t).parseUserComment();return yield this.addTag(a.key,a.value),a.len})}addTag(e,t){return r(this,null,function*(){if(e==="METADATA_BLOCK_PICTURE"&&typeof t=="string"){if(this.options.skipCovers){c("Ignore picture");return}t=d.fromBase64(t),c(`Push picture: id=${e}, format=${t.format}`)}else c(`Push tag: id=${e}, value=${t}`);yield this.metadata.addTag("vorbis",e,t)})}calculateDuration(e){this.metadata.format.sampleRate&&e.absoluteGranulePosition>=0&&(this.metadata.setFormat("numberOfSamples",e.absoluteGranulePosition),this.metadata.setFormat("duration",e.absoluteGranulePosition/this.metadata.format.sampleRate))}parseFirstPage(e,t){this.metadata.setFormat("codec","Vorbis I"),c("Parse first page");let n=g.get(t,0);if(n.vorbis!=="vorbis")throw new p("Metadata does not look like Vorbis");if(n.packetType===1){let a=E.get(t,g.len);this.metadata.setFormat("sampleRate",a.sampleRate),this.metadata.setFormat("bitrate",a.bitrateNominal),this.metadata.setFormat("numberOfChannels",a.channelMode),c("sample-rate=%s[hz], bitrate=%s[b/s], channel-mode=%s",a.sampleRate,a.bitrateNominal,a.channelMode)}else throw new p("First Ogg page should be type 1: the identification header")}parseFullPage(e){return r(this,null,function*(){let t=g.get(e,0);switch(c("Parse full page: type=%s, byteLength=%s",t.packetType,e.byteLength),t.packetType){case 3:return this.parseUserCommentList(e,g.len);case 1:case 5:break}})}parseUserCommentList(e,t){return r(this,null,function*(){let n=o.get(e,t);t+=4,t+=n;let a=o.get(e,t);for(t+=4;a-- >0;)t+=yield this.parseUserComment(e,t)})}};export{d as a,T as b,L as c};
