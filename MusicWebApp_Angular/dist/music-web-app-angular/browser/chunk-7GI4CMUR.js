import{A as s,F as l}from"./chunk-DNMECVE7.js";var U=Object.prototype.toString,y="[object Uint8Array]",T="[object ArrayBuffer]";function a(t,e,r){return t?t.constructor===e?!0:U.call(t)===r:!1}function h(t){return a(t,Uint8Array,y)}function A(t){return a(t,ArrayBuffer,T)}function B(t){return h(t)||A(t)}function w(t){if(!h(t))throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof t}\``)}function m(t){if(!B(t))throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof t}\``)}var p={utf8:new globalThis.TextDecoder("utf8")};function N(t,e="utf8"){return m(t),p[e]??=new globalThis.TextDecoder(e),p[e].decode(t)}function x(t){if(typeof t!="string")throw new TypeError(`Expected \`string\`, got \`${typeof t}\``)}var E=new globalThis.TextEncoder;function O(t){return x(t),E.encode(t)}var S=Array.from({length:256},(t,e)=>e.toString(16).padStart(2,"0"));function C(t){w(t);let e="";for(let r=0;r<t.length;r++)e+=S[t[r]];return e}var g={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,a:10,b:11,c:12,d:13,e:14,f:15,A:10,B:11,C:12,D:13,E:14,F:15};function M(t){if(x(t),t.length%2!==0)throw new Error("Invalid Hex string length.");let e=t.length/2,r=new Uint8Array(e);for(let n=0;n<e;n++){let o=g[t[n*2]],i=g[t[n*2+1]];if(o===void 0||i===void 0)throw new Error(`Invalid Hex character encountered at position ${n*2}`);r[n]=o<<4|i}return r}function _(t){let{byteLength:e}=t;if(e===6)return t.getUint16(0)*2**32+t.getUint32(2);if(e===5)return t.getUint8(0)*2**32+t.getUint32(1);if(e===4)return t.getUint32(0);if(e===3)return t.getUint8(0)*2**16+t.getUint16(1);if(e===2)return t.getUint16(0);if(e===1)return t.getUint8(0)}function L(t,e){let r=t.length,n=e.length;if(n===0||n>r)return-1;let o=r-n;for(let i=0;i<=o;i++){let f=!0;for(let u=0;u<n;u++)if(t[i+u]!==e[u]){f=!1;break}if(f)return i}return-1}function j(t,e){return L(t,e)!==-1}function I(t,e,r){return(t[e]&1<<r)!==0}function P(t,e,r,n){let o=e;if(n==="utf-16le"){for(;t[o]!==0||t[o+1]!==0;){if(o>=r)return r;o+=2}return o}for(;t[o]!==0;){if(o>=r)return r;o++}return o}function V(t){let e=t.indexOf("\0");return e===-1?t:t.substr(0,e)}function F(t){let e=t.length;if(e&1)throw new l("Buffer length must be even");for(let r=0;r<e;r+=2){let n=t[r];t[r]=t[r+1],t[r+1]=n}return t}function d(t,e){if(t[0]===255&&t[1]===254)return d(t.subarray(2),e);if(e==="utf-16le"&&t[0]===254&&t[1]===255){if(t.length&1)throw new l("Expected even number of octets for 16-bit unicode string");return d(F(t),e)}return new s(t.length,e).get(t,0)}function Z(t){return t=t.replace(/^\x00+/g,""),t=t.replace(/\x00+$/g,""),t}function b(t,e,r,n){let o=e+~~(r/8),i=r%8,f=t[o];f&=255>>i;let u=8-i,c=n-u;return c<0?f>>=8-i-n:c>0&&(f<<=c,f|=b(t,e,r+u,c)),f}function q(t,e,r){return b(t,e,r,1)===1}function K(t){let e=[];for(let r=0,n=t.length;r<n;r++){let o=Number(t.charCodeAt(r)).toString(16);e.push(o.length===1?`0${o}`:o)}return e.join(" ")}function $(t){return 10*Math.log10(t)}function D(t){return 10**(t/10)}function X(t){let e=t.split(" ").map(r=>r.trim().toLowerCase());if(e.length>=1){let r=Number.parseFloat(e[0]);return e.length===2&&e[1]==="db"?{dB:r,ratio:D(r)}:{dB:$(r),ratio:r}}}export{N as a,O as b,C as c,M as d,_ as e,L as f,j as g,I as h,P as i,V as j,d as k,Z as l,b as m,q as n,K as o,X as p};
