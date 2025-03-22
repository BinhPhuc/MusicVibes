import './polyfills.server.mjs';
import"./chunk-LBREWN6D.mjs";import{b as f}from"./chunk-KNFSIVWC.mjs";import{a as V}from"./chunk-ZRBCXS6J.mjs";import{c as v,d as P,h as E,k as H,l as _}from"./chunk-X7WAPDBZ.mjs";import{C as M,D as W,c as Z,e as p,i as w,p as d,w as y}from"./chunk-BMAIRAQG.mjs";import{g as Y,i as g}from"./chunk-QYG7H2UI.mjs";var X=Y(Z(),1);var t=class a{static fromBin(e,r=0){return new a(a.decode(e,r))}static decode(e,r=0){let n=new DataView(e.buffer,r);return`${n.getUint32(0,!0).toString(16)}-${n.getUint16(4,!0).toString(16)}-${n.getUint16(6,!0).toString(16)}-${n.getUint16(8).toString(16)}-${v(e.slice(r+10,r+16))}`.toUpperCase()}static decodeMediaType(e){switch(e.str){case a.AudioMedia.str:return"audio";case a.VideoMedia.str:return"video";case a.CommandMedia.str:return"command";case a.Degradable_JPEG_Media.str:return"degradable-jpeg";case a.FileTransferMedia.str:return"file-transfer";case a.BinaryMedia.str:return"binary"}}static encode(e){let r=new Uint8Array(16),n=new DataView(r.buffer);return n.setUint32(0,Number.parseInt(e.slice(0,8),16),!0),n.setUint16(4,Number.parseInt(e.slice(9,13),16),!0),n.setUint16(6,Number.parseInt(e.slice(14,18),16),!0),r.set(P(e.slice(19,23)),8),r.set(P(e.slice(24)),10),r}constructor(e){this.str=e}equals(e){return this.str===e.str}toBin(){return a.encode(this.str)}};t.HeaderObject=new t("75B22630-668E-11CF-A6D9-00AA0062CE6C");t.DataObject=new t("75B22636-668E-11CF-A6D9-00AA0062CE6C");t.SimpleIndexObject=new t("33000890-E5B1-11CF-89F4-00A0C90349CB");t.IndexObject=new t("D6E229D3-35DA-11D1-9034-00A0C90349BE");t.MediaObjectIndexObject=new t("FEB103F8-12AD-4C64-840F-2A1D2F7AD48C");t.TimecodeIndexObject=new t("3CB73FD0-0C4A-4803-953D-EDF7B6228F0C");t.FilePropertiesObject=new t("8CABDCA1-A947-11CF-8EE4-00C00C205365");t.StreamPropertiesObject=new t("B7DC0791-A9B7-11CF-8EE6-00C00C205365");t.HeaderExtensionObject=new t("5FBF03B5-A92E-11CF-8EE3-00C00C205365");t.CodecListObject=new t("86D15240-311D-11D0-A3A4-00A0C90348F6");t.ScriptCommandObject=new t("1EFB1A30-0B62-11D0-A39B-00A0C90348F6");t.MarkerObject=new t("F487CD01-A951-11CF-8EE6-00C00C205365");t.BitrateMutualExclusionObject=new t("D6E229DC-35DA-11D1-9034-00A0C90349BE");t.ErrorCorrectionObject=new t("75B22635-668E-11CF-A6D9-00AA0062CE6C");t.ContentDescriptionObject=new t("75B22633-668E-11CF-A6D9-00AA0062CE6C");t.ExtendedContentDescriptionObject=new t("D2D0A440-E307-11D2-97F0-00A0C95EA850");t.ContentBrandingObject=new t("2211B3FA-BD23-11D2-B4B7-00A0C955FC6E");t.StreamBitratePropertiesObject=new t("7BF875CE-468D-11D1-8D82-006097C9A2B2");t.ContentEncryptionObject=new t("2211B3FB-BD23-11D2-B4B7-00A0C955FC6E");t.ExtendedContentEncryptionObject=new t("298AE614-2622-4C17-B935-DAE07EE9289C");t.DigitalSignatureObject=new t("2211B3FC-BD23-11D2-B4B7-00A0C955FC6E");t.PaddingObject=new t("1806D474-CADF-4509-A4BA-9AABCB96AAE8");t.ExtendedStreamPropertiesObject=new t("14E6A5CB-C672-4332-8399-A96952065B5A");t.AdvancedMutualExclusionObject=new t("A08649CF-4775-4670-8A16-6E35357566CD");t.GroupMutualExclusionObject=new t("D1465A40-5A79-4338-B71B-E36B8FD6C249");t.StreamPrioritizationObject=new t("D4FED15B-88D3-454F-81F0-ED5C45999E24");t.BandwidthSharingObject=new t("A69609E6-517B-11D2-B6AF-00C04FD908E9");t.LanguageListObject=new t("7C4346A9-EFE0-4BFC-B229-393EDE415C85");t.MetadataObject=new t("C5F8CBEA-5BAF-4877-8467-AA8C44FA4CCA");t.MetadataLibraryObject=new t("44231C94-9498-49D1-A141-1D134E457054");t.IndexParametersObject=new t("D6E229DF-35DA-11D1-9034-00A0C90349BE");t.MediaObjectIndexParametersObject=new t("6B203BAD-3F11-48E4-ACA8-D7613DE2CFA7");t.TimecodeIndexParametersObject=new t("F55E496D-9797-4B5D-8C8B-604DFE9BFB24");t.CompatibilityObject=new t("26F18B5D-4584-47EC-9F5F-0E651F0452C9");t.AdvancedContentEncryptionObject=new t("43058533-6981-49E6-9B74-AD12CB86D58C");t.AudioMedia=new t("F8699E40-5B4D-11CF-A8FD-00805F5C442B");t.VideoMedia=new t("BC19EFC0-5B4D-11CF-A8FD-00805F5C442B");t.CommandMedia=new t("59DACFC0-59E6-11D0-A3AC-00A0C90348F6");t.JFIF_Media=new t("B61BE100-5B4E-11CF-A8FD-00805F5C442B");t.Degradable_JPEG_Media=new t("35907DE0-E415-11CF-A917-00805F5C442B");t.FileTransferMedia=new t("91BD222C-F21C-497A-8B6D-5AA86BFC0185");t.BinaryMedia=new t("3AFB65E2-47EF-40F2-AC2C-70A90D71D343");t.ASF_Index_Placeholder_Object=new t("D9AADE20-7C17-4F9C-BC28-8555DD98E2A2");var o=t;function G(a){return re[a]}function h(a){return _(H(a,"utf-16le"))}var re=[h,$,ne,ae,ie,J,$];function $(a){return new Uint8Array(a)}function ne(a,e=0){return J(a,e)===1}function ae(a,e=0){return w.get(a,e)}function ie(a,e=0){return d.get(a,e)}function J(a,e=0){return p.get(a,e)}var x=class extends M("ASF"){};var q={len:30,get:(a,e)=>({objectId:o.fromBin(a,e),objectSize:Number(d.get(a,e+16)),numberOfHeaderObjects:w.get(a,e+24)})},A={len:24,get:(a,e)=>({objectId:o.fromBin(a,e),objectSize:Number(d.get(a,e+16))})},l=class{constructor(e){this.len=Number(e.objectSize)-A.len}postProcessTag(e,r,n,s){if(r==="WM/Picture")e.push({id:r,value:z.fromBuffer(s)});else{let c=G(n);if(!c)throw new x(`unexpected value headerType: ${n}`);e.push({id:r,value:c(s)})}}},I=class extends l{get(e,r){return null}},B=class extends l{get(e,r){return{fileId:o.fromBin(e,r),fileSize:d.get(e,r+16),creationDate:d.get(e,r+24),dataPacketsCount:d.get(e,r+32),playDuration:d.get(e,r+40),sendDuration:d.get(e,r+48),preroll:d.get(e,r+56),flags:{broadcast:E(e,r+64,24),seekable:E(e,r+64,25)},minimumDataPacketSize:w.get(e,r+68),maximumDataPacketSize:w.get(e,r+72),maximumBitrate:w.get(e,r+76)}}};B.guid=o.FilePropertiesObject;var O=class extends l{get(e,r){return{streamType:o.decodeMediaType(o.fromBin(e,r)),errorCorrectionType:o.fromBin(e,r+8)}}};O.guid=o.StreamPropertiesObject;var D=class{constructor(){this.len=22}get(e,r){let n=new DataView(e.buffer,r);return{reserved1:o.fromBin(e,r),reserved2:n.getUint16(16,!0),extensionDataSize:n.getUint16(18,!0)}}};D.guid=o.HeaderExtensionObject;var se={len:20,get:(a,e)=>({entryCount:new DataView(a.buffer,e).getUint16(16,!0)})};function Q(a){return g(this,null,function*(){let e=yield a.readNumber(p);return(yield a.readToken(new y(e*2,"utf-16le"))).replace("\0","")})}function R(a){return g(this,null,function*(){let e=yield a.readToken(se),r=[];for(let n=0;n<e.entryCount;++n)r.push(yield ce(a));return r})}function oe(a){return g(this,null,function*(){let e=yield a.readNumber(p),r=new Uint8Array(e);return yield a.readBuffer(r),r})}function ce(a){return g(this,null,function*(){let e=yield a.readNumber(p);return{type:{videoCodec:(e&1)===1,audioCodec:(e&2)===2},codecName:yield Q(a),description:yield Q(a),information:yield oe(a)}})}var C=class a extends l{get(e,r){let n=[],s=new DataView(e.buffer,r),c=10;for(let i=0;i<a.contentDescTags.length;++i){let u=s.getUint16(i*2,!0);if(u>0){let b=a.contentDescTags[i],j=c+u;n.push({id:b,value:h(e.slice(r+c,r+j))}),c=j}}return n}};C.guid=o.ContentDescriptionObject;C.contentDescTags=["Title","Author","Copyright","Description","Rating"];var F=class extends l{get(e,r){let n=[],s=new DataView(e.buffer,r),c=s.getUint16(0,!0),i=2;for(let u=0;u<c;u+=1){let b=s.getUint16(i,!0);i+=2;let j=h(e.slice(r+i,r+i+b));i+=b;let U=s.getUint16(i,!0);i+=2;let S=s.getUint16(i,!0);i+=2;let L=e.slice(r+i,r+i+S);i+=S,this.postProcessTag(n,j,U,L)}return n}};F.guid=o.ExtendedContentDescriptionObject;var T=class extends l{get(e,r){let n=new DataView(e.buffer,r);return{startTime:d.get(e,r),endTime:d.get(e,r+8),dataBitrate:n.getInt32(12,!0),bufferSize:n.getInt32(16,!0),initialBufferFullness:n.getInt32(20,!0),alternateDataBitrate:n.getInt32(24,!0),alternateBufferSize:n.getInt32(28,!0),alternateInitialBufferFullness:n.getInt32(32,!0),maximumObjectSize:n.getInt32(36,!0),flags:{reliableFlag:E(e,r+40,0),seekableFlag:E(e,r+40,1),resendLiveCleanpointsFlag:E(e,r+40,2)},streamNumber:n.getInt16(42,!0),streamLanguageId:n.getInt16(44,!0),averageTimePerFrame:n.getInt32(52,!0),streamNameCount:n.getInt32(54,!0),payloadExtensionSystems:n.getInt32(56,!0),streamNames:[],streamPropertiesObject:null}}};T.guid=o.ExtendedStreamPropertiesObject;var m=class extends l{get(e,r){let n=[],s=new DataView(e.buffer,r),c=s.getUint16(0,!0),i=2;for(let u=0;u<c;u+=1){i+=4;let b=s.getUint16(i,!0);i+=2;let j=s.getUint16(i,!0);i+=2;let U=s.getUint32(i,!0);i+=4;let S=h(e.slice(r+i,r+i+b));i+=b;let L=e.slice(r+i,r+i+U);i+=U,this.postProcessTag(n,S,j,L)}return n}};m.guid=o.MetadataObject;var k=class extends m{};k.guid=o.MetadataLibraryObject;var z=class a{static fromBuffer(e){return new a(e.length).get(e,0)}constructor(e){this.len=e}get(e,r){let n=new DataView(e.buffer,r),s=n.getUint8(0),c=n.getInt32(1,!0),i=5;for(;n.getUint16(i)!==0;)i+=2;let u=new y(i-5,"utf-16le").get(e,5);for(;n.getUint16(i)!==0;)i+=2;let b=new y(i-5,"utf-16le").get(e,5);return{type:V[s],format:u,description:b,size:c,data:e.slice(i+4)}}};var N=(0,X.default)("music-metadata:parser:ASF"),ue="asf",K=class extends W{parse(){return g(this,null,function*(){let e=yield this.tokenizer.readToken(q);if(!e.objectId.equals(o.HeaderObject))throw new x(`expected asf header; but was not found; got: ${e.objectId.str}`);try{yield this.parseObjectHeader(e.numberOfHeaderObjects)}catch(r){N("Error while parsing ASF: %s",r)}})}parseObjectHeader(e){return g(this,null,function*(){let r;do{let n=yield this.tokenizer.readToken(A);switch(N("header GUID=%s",n.objectId.str),n.objectId.str){case B.guid.str:{let s=yield this.tokenizer.readToken(new B(n));this.metadata.setFormat("duration",Number(s.playDuration/BigInt(1e3))/1e4-Number(s.preroll)/1e3),this.metadata.setFormat("bitrate",s.maximumBitrate);break}case O.guid.str:{let s=yield this.tokenizer.readToken(new O(n));this.metadata.setFormat("container",`ASF/${s.streamType}`);break}case D.guid.str:{let s=yield this.tokenizer.readToken(new D);yield this.parseExtensionObject(s.extensionDataSize);break}case C.guid.str:r=yield this.tokenizer.readToken(new C(n)),yield this.addTags(r);break;case F.guid.str:r=yield this.tokenizer.readToken(new F(n)),yield this.addTags(r);break;case o.CodecListObject.str:{let s=yield R(this.tokenizer);s.forEach(i=>{this.metadata.addStreamInfo({type:i.type.videoCodec?f.video:f.audio,codecName:i.codecName})});let c=s.filter(i=>i.type.audioCodec).map(i=>i.codecName).join("/");this.metadata.setFormat("codec",c);break}case o.StreamBitratePropertiesObject.str:yield this.tokenizer.ignore(n.objectSize-A.len);break;case o.PaddingObject.str:N("Padding: %s bytes",n.objectSize-A.len),yield this.tokenizer.ignore(n.objectSize-A.len);break;default:this.metadata.addWarning(`Ignore ASF-Object-GUID: ${n.objectId.str}`),N("Ignore ASF-Object-GUID: %s",n.objectId.str),yield this.tokenizer.readToken(new I(n))}}while(--e)})}addTags(e){return g(this,null,function*(){yield Promise.all(e.map(({id:r,value:n})=>this.metadata.addTag(ue,r,n)))})}parseExtensionObject(e){return g(this,null,function*(){do{let r=yield this.tokenizer.readToken(A),n=r.objectSize-A.len;switch(r.objectId.str){case T.guid.str:yield this.tokenizer.readToken(new T(r));break;case m.guid.str:{let s=yield this.tokenizer.readToken(new m(r));yield this.addTags(s);break}case k.guid.str:{let s=yield this.tokenizer.readToken(new k(r));yield this.addTags(s);break}case o.PaddingObject.str:yield this.tokenizer.ignore(n);break;case o.CompatibilityObject.str:yield this.tokenizer.ignore(n);break;case o.ASF_Index_Placeholder_Object.str:yield this.tokenizer.ignore(n);break;default:this.metadata.addWarning(`Ignore ASF-Object-GUID: ${r.objectId.str}`),yield this.tokenizer.readToken(new I(r));break}e-=r.objectSize}while(e>0)})}};export{K as AsfParser};
