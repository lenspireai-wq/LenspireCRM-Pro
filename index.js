var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/pwa-bundle.js
var PWA_APP_HTML = `\uFEFF<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover">
  <meta name="theme-color" content="#7367f0">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="description" content="LenspireCRM Pro \u2014 Sales Lead Tracker & CRM">
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" href="/icons/icon-192.png" sizes="192x192">
  <link rel="apple-touch-icon" href="/icons/icon-512.png">
  <title>LenspireCRM Pro</title>
  <link rel="stylesheet" href="/app.css?v=5">
  <script>/*!
 * Chart.js v4.5.1
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).Chart=e()}(this,(function(){"use strict";var t=Object.freeze({__proto__:null,get Colors(){return Jo},get Decimation(){return ta},get Filler(){return ba},get Legend(){return Ma},get SubTitle(){return Pa},get Title(){return ka},get Tooltip(){return Na}});function e(){}const i=(()=>{let t=0;return()=>t++})();function s(t){return null==t}function n(t){if(Array.isArray&&Array.isArray(t))return!0;const e=Object.prototype.toString.call(t);return"[object"===e.slice(0,7)&&"Array]"===e.slice(-6)}function o(t){return null!==t&&"[object Object]"===Object.prototype.toString.call(t)}function a(t){return("number"==typeof t||t instanceof Number)&&isFinite(+t)}function r(t,e){return a(t)?t:e}function l(t,e){return void 0===t?e:t}const h=(t,e)=>"string"==typeof t&&t.endsWith("%")?parseFloat(t)/100:+t/e,c=(t,e)=>"string"==typeof t&&t.endsWith("%")?parseFloat(t)/100*e:+t;function d(t,e,i){if(t&&"function"==typeof t.call)return t.apply(i,e)}function u(t,e,i,s){let a,r,l;if(n(t))if(r=t.length,s)for(a=r-1;a>=0;a--)e.call(i,t[a],a);else for(a=0;a<r;a++)e.call(i,t[a],a);else if(o(t))for(l=Object.keys(t),r=l.length,a=0;a<r;a++)e.call(i,t[l[a]],l[a])}function f(t,e){let i,s,n,o;if(!t||!e||t.length!==e.length)return!1;for(i=0,s=t.length;i<s;++i)if(n=t[i],o=e[i],n.datasetIndex!==o.datasetIndex||n.index!==o.index)return!1;return!0}function g(t){if(n(t))return t.map(g);if(o(t)){const e=Object.create(null),i=Object.keys(t),s=i.length;let n=0;for(;n<s;++n)e[i[n]]=g(t[i[n]]);return e}return t}function p(t){return-1===["__proto__","prototype","constructor"].indexOf(t)}function m(t,e,i,s){if(!p(t))return;const n=e[t],a=i[t];o(n)&&o(a)?x(n,a,s):e[t]=g(a)}function x(t,e,i){const s=n(e)?e:[e],a=s.length;if(!o(t))return t;const r=(i=i||{}).merger||m;let l;for(let e=0;e<a;++e){if(l=s[e],!o(l))continue;const n=Object.keys(l);for(let e=0,s=n.length;e<s;++e)r(n[e],t,l,i)}return t}function b(t,e){return x(t,e,{merger:_})}function _(t,e,i){if(!p(t))return;const s=e[t],n=i[t];o(s)&&o(n)?b(s,n):Object.prototype.hasOwnProperty.call(e,t)||(e[t]=g(n))}const y={"":t=>t,x:t=>t.x,y:t=>t.y};function v(t){const e=t.split("."),i=[];let s="";for(const t of e)s+=t,s.endsWith("\\\\")?s=s.slice(0,-1)+".":(i.push(s),s="");return i}function M(t,e){const i=y[e]||(y[e]=function(t){const e=v(t);return t=>{for(const i of e){if(""===i)break;t=t&&t[i]}return t}}(e));return i(t)}function w(t){return t.charAt(0).toUpperCase()+t.slice(1)}const k=t=>void 0!==t,S=t=>"function"==typeof t,P=(t,e)=>{if(t.size!==e.size)return!1;for(const i of t)if(!e.has(i))return!1;return!0};function D(t){return"mouseup"===t.type||"click"===t.type||"contextmenu"===t.type}const C=Math.PI,O=2*C,A=O+C,T=Number.POSITIVE_INFINITY,L=C/180,E=C/2,R=C/4,I=2*C/3,z=Math.log10,F=Math.sign;function V(t,e,i){return Math.abs(t-e)<i}function B(t){const e=Math.round(t);t=V(t,e,t/1e3)?e:t;const i=Math.pow(10,Math.floor(z(t))),s=t/i;return(s<=1?1:s<=2?2:s<=5?5:10)*i}function W(t){const e=[],i=Math.sqrt(t);let s;for(s=1;s<i;s++)t%s==0&&(e.push(s),e.push(t/s));return i===(0|i)&&e.push(i),e.sort(((t,e)=>t-e)).pop(),e}function N(t){return!function(t){return"symbol"==typeof t||"object"==typeof t&&null!==t&&!(Symbol.toPrimitive in t||"toString"in t||"valueOf"in t)}(t)&&!isNaN(parseFloat(t))&&isFinite(t)}function H(t,e){const i=Math.round(t);return i-e<=t&&i+e>=t}function j(t,e,i){let s,n,o;for(s=0,n=t.length;s<n;s++)o=t[s][i],isNaN(o)||(e.min=Math.min(e.min,o),e.max=Math.max(e.max,o))}function $(t){return t*(C/180)}function Y(t){return t*(180/C)}function U(t){if(!a(t))return;let e=1,i=0;for(;Math.round(t*e)/e!==t;)e*=10,i++;return i}function X(t,e){const i=e.x-t.x,s=e.y-t.y,n=Math.sqrt(i*i+s*s);let o=Math.atan2(s,i);return o<-.5*C&&(o+=O),{angle:o,distance:n}}function q(t,e){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function K(t,e){return(t-e+A)%O-C}function G(t){return(t%O+O)%O}function J(t,e,i,s){const n=G(t),o=G(e),a=G(i),r=G(o-n),l=G(a-n),h=G(n-o),c=G(n-a);return n===o||n===a||s&&o===a||r>l&&h<c}function Z(t,e,i){return Math.max(e,Math.min(i,t))}function Q(t){return Z(t,-32768,32767)}function tt(t,e,i,s=1e-6){return t>=Math.min(e,i)-s&&t<=Math.max(e,i)+s}function et(t,e,i){i=i||(i=>t[i]<e);let s,n=t.length-1,o=0;for(;n-o>1;)s=o+n>>1,i(s)?o=s:n=s;return{lo:o,hi:n}}const it=(t,e,i,s)=>et(t,i,s?s=>{const n=t[s][e];return n<i||n===i&&t[s+1][e]===i}:s=>t[s][e]<i),st=(t,e,i)=>et(t,i,(s=>t[s][e]>=i));function nt(t,e,i){let s=0,n=t.length;for(;s<n&&t[s]<e;)s++;for(;n>s&&t[n-1]>i;)n--;return s>0||n<t.length?t.slice(s,n):t}const ot=["push","pop","shift","splice","unshift"];function at(t,e){t._chartjs?t._chartjs.listeners.push(e):(Object.defineProperty(t,"_chartjs",{configurable:!0,enumerable:!1,value:{listeners:[e]}}),ot.forEach((e=>{const i="_onData"+w(e),s=t[e];Object.defineProperty(t,e,{configurable:!0,enumerable:!1,value(...e){const n=s.apply(this,e);return t._chartjs.listeners.forEach((t=>{"function"==typeof t[i]&&t[i](...e)})),n}})})))}function rt(t,e){const i=t._chartjs;if(!i)return;const s=i.listeners,n=s.indexOf(e);-1!==n&&s.splice(n,1),s.length>0||(ot.forEach((e=>{delete t[e]})),delete t._chartjs)}function lt(t){const e=new Set(t);return e.size===t.length?t:Array.from(e)}const ht="undefined"==typeof window?function(t){return t()}:window.requestAnimationFrame;function ct(t,e){let i=[],s=!1;return function(...n){i=n,s||(s=!0,ht.call(window,(()=>{s=!1,t.apply(e,i)})))}}function dt(t,e){let i;return function(...s){return e?(clearTimeout(i),i=setTimeout(t,e,s)):t.apply(this,s),e}}const ut=t=>"start"===t?"left":"end"===t?"right":"center",ft=(t,e,i)=>"start"===t?e:"end"===t?i:(e+i)/2,gt=(t,e,i,s)=>t===(s?"left":"right")?i:"center"===t?(e+i)/2:e;function pt(t,e,i){const n=e.length;let o=0,a=n;if(t._sorted){const{iScale:r,vScale:l,_parsed:h}=t,c=t.dataset&&t.dataset.options?t.dataset.options.spanGaps:null,d=r.axis,{min:u,max:f,minDefined:g,maxDefined:p}=r.getUserBounds();if(g){if(o=Math.min(it(h,d,u).lo,i?n:it(e,d,r.getPixelForValue(u)).lo),c){const t=h.slice(0,o+1).reverse().findIndex((t=>!s(t[l.axis])));o-=Math.max(0,t)}o=Z(o,0,n-1)}if(p){let t=Math.max(it(h,r.axis,f,!0).hi+1,i?0:it(e,d,r.getPixelForValue(f),!0).hi+1);if(c){const e=h.slice(t-1).findIndex((t=>!s(t[l.axis])));t+=Math.max(0,e)}a=Z(t,o,n)-o}else a=n-o}return{start:o,count:a}}function mt(t){const{xScale:e,yScale:i,_scaleRanges:s}=t,n={xmin:e.min,xmax:e.max,ymin:i.min,ymax:i.max};if(!s)return t._scaleRanges=n,!0;const o=s.xmin!==e.min||s.xmax!==e.max||s.ymin!==i.min||s.ymax!==i.max;return Object.assign(s,n),o}class xt{constructor(){this._request=null,this._charts=new Map,this._running=!1,this._lastDate=void 0}_notify(t,e,i,s){const n=e.listeners[s],o=e.duration;n.forEach((s=>s({chart:t,initial:e.initial,numSteps:o,currentStep:Math.min(i-e.start,o)})))}_refresh(){this._request||(this._running=!0,this._request=ht.call(window,(()=>{this._update(),this._request=null,this._running&&this._refresh()})))}_update(t=Date.now()){let e=0;this._charts.forEach(((i,s)=>{if(!i.running||!i.items.length)return;const n=i.items;let o,a=n.length-1,r=!1;for(;a>=0;--a)o=n[a],o._active?(o._total>i.duration&&(i.duration=o._total),o.tick(t),r=!0):(n[a]=n[n.length-1],n.pop());r&&(s.draw(),this._notify(s,i,t,"progress")),n.length||(i.running=!1,this._notify(s,i,t,"complete"),i.initial=!1),e+=n.length})),this._lastDate=t,0===e&&(this._running=!1)}_getAnims(t){const e=this._charts;let i=e.get(t);return i||(i={running:!1,initial:!0,items:[],listeners:{complete:[],progress:[]}},e.set(t,i)),i}listen(t,e,i){this._getAnims(t).listeners[e].push(i)}add(t,e){e&&e.length&&this._getAnims(t).items.push(...e)}has(t){return this._getAnims(t).items.length>0}start(t){const e=this._charts.get(t);e&&(e.running=!0,e.start=Date.now(),e.duration=e.items.reduce(((t,e)=>Math.max(t,e._duration)),0),this._refresh())}running(t){if(!this._running)return!1;const e=this._charts.get(t);return!!(e&&e.running&&e.items.length)}stop(t){const e=this._charts.get(t);if(!e||!e.items.length)return;const i=e.items;let s=i.length-1;for(;s>=0;--s)i[s].cancel();e.items=[],this._notify(t,e,Date.now(),"complete")}remove(t){return this._charts.delete(t)}}var bt=new xt;
/*!
 * @kurkle/color v0.3.2
 * https://github.com/kurkle/color#readme
 * (c) 2023 Jukka Kurkela
 * Released under the MIT License
 */function _t(t){return t+.5|0}const yt=(t,e,i)=>Math.max(Math.min(t,i),e);function vt(t){return yt(_t(2.55*t),0,255)}function Mt(t){return yt(_t(255*t),0,255)}function wt(t){return yt(_t(t/2.55)/100,0,1)}function kt(t){return yt(_t(100*t),0,100)}const St={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,A:10,B:11,C:12,D:13,E:14,F:15,a:10,b:11,c:12,d:13,e:14,f:15},Pt=[..."0123456789ABCDEF"],Dt=t=>Pt[15&t],Ct=t=>Pt[(240&t)>>4]+Pt[15&t],Ot=t=>(240&t)>>4==(15&t);function At(t){var e=(t=>Ot(t.r)&&Ot(t.g)&&Ot(t.b)&&Ot(t.a))(t)?Dt:Ct;return t?"#"+e(t.r)+e(t.g)+e(t.b)+((t,e)=>t<255?e(t):"")(t.a,e):void 0}const Tt=/^(hsla?|hwb|hsv)\\(\\s*([-+.e\\d]+)(?:deg)?[\\s,]+([-+.e\\d]+)%[\\s,]+([-+.e\\d]+)%(?:[\\s,]+([-+.e\\d]+)(%)?)?\\s*\\)$/;function Lt(t,e,i){const s=e*Math.min(i,1-i),n=(e,n=(e+t/30)%12)=>i-s*Math.max(Math.min(n-3,9-n,1),-1);return[n(0),n(8),n(4)]}function Et(t,e,i){const s=(s,n=(s+t/60)%6)=>i-i*e*Math.max(Math.min(n,4-n,1),0);return[s(5),s(3),s(1)]}function Rt(t,e,i){const s=Lt(t,1,.5);let n;for(e+i>1&&(n=1/(e+i),e*=n,i*=n),n=0;n<3;n++)s[n]*=1-e-i,s[n]+=e;return s}function It(t){const e=t.r/255,i=t.g/255,s=t.b/255,n=Math.max(e,i,s),o=Math.min(e,i,s),a=(n+o)/2;let r,l,h;return n!==o&&(h=n-o,l=a>.5?h/(2-n-o):h/(n+o),r=function(t,e,i,s,n){return t===n?(e-i)/s+(e<i?6:0):e===n?(i-t)/s+2:(t-e)/s+4}(e,i,s,h,n),r=60*r+.5),[0|r,l||0,a]}function zt(t,e,i,s){return(Array.isArray(e)?t(e[0],e[1],e[2]):t(e,i,s)).map(Mt)}function Ft(t,e,i){return zt(Lt,t,e,i)}function Vt(t){return(t%360+360)%360}function Bt(t){const e=Tt.exec(t);let i,s=255;if(!e)return;e[5]!==i&&(s=e[6]?vt(+e[5]):Mt(+e[5]));const n=Vt(+e[2]),o=+e[3]/100,a=+e[4]/100;return i="hwb"===e[1]?function(t,e,i){return zt(Rt,t,e,i)}(n,o,a):"hsv"===e[1]?function(t,e,i){return zt(Et,t,e,i)}(n,o,a):Ft(n,o,a),{r:i[0],g:i[1],b:i[2],a:s}}const Wt={x:"dark",Z:"light",Y:"re",X:"blu",W:"gr",V:"medium",U:"slate",A:"ee",T:"ol",S:"or",B:"ra",C:"lateg",D:"ights",R:"in",Q:"turquois",E:"hi",P:"ro",O:"al",N:"le",M:"de",L:"yello",F:"en",K:"ch",G:"arks",H:"ea",I:"ightg",J:"wh"},Nt={OiceXe:"f0f8ff",antiquewEte:"faebd7",aqua:"ffff",aquamarRe:"7fffd4",azuY:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"0",blanKedOmond:"ffebcd",Xe:"ff",XeviTet:"8a2be2",bPwn:"a52a2a",burlywood:"deb887",caMtXe:"5f9ea0",KartYuse:"7fff00",KocTate:"d2691e",cSO:"ff7f50",cSnflowerXe:"6495ed",cSnsilk:"fff8dc",crimson:"dc143c",cyan:"ffff",xXe:"8b",xcyan:"8b8b",xgTMnPd:"b8860b",xWay:"a9a9a9",xgYF:"6400",xgYy:"a9a9a9",xkhaki:"bdb76b",xmagFta:"8b008b",xTivegYF:"556b2f",xSange:"ff8c00",xScEd:"9932cc",xYd:"8b0000",xsOmon:"e9967a",xsHgYF:"8fbc8f",xUXe:"483d8b",xUWay:"2f4f4f",xUgYy:"2f4f4f",xQe:"ced1",xviTet:"9400d3",dAppRk:"ff1493",dApskyXe:"bfff",dimWay:"696969",dimgYy:"696969",dodgerXe:"1e90ff",fiYbrick:"b22222",flSOwEte:"fffaf0",foYstWAn:"228b22",fuKsia:"ff00ff",gaRsbSo:"dcdcdc",ghostwEte:"f8f8ff",gTd:"ffd700",gTMnPd:"daa520",Way:"808080",gYF:"8000",gYFLw:"adff2f",gYy:"808080",honeyMw:"f0fff0",hotpRk:"ff69b4",RdianYd:"cd5c5c",Rdigo:"4b0082",ivSy:"fffff0",khaki:"f0e68c",lavFMr:"e6e6fa",lavFMrXsh:"fff0f5",lawngYF:"7cfc00",NmoncEffon:"fffacd",ZXe:"add8e6",ZcSO:"f08080",Zcyan:"e0ffff",ZgTMnPdLw:"fafad2",ZWay:"d3d3d3",ZgYF:"90ee90",ZgYy:"d3d3d3",ZpRk:"ffb6c1",ZsOmon:"ffa07a",ZsHgYF:"20b2aa",ZskyXe:"87cefa",ZUWay:"778899",ZUgYy:"778899",ZstAlXe:"b0c4de",ZLw:"ffffe0",lime:"ff00",limegYF:"32cd32",lRF:"faf0e6",magFta:"ff00ff",maPon:"800000",VaquamarRe:"66cdaa",VXe:"cd",VScEd:"ba55d3",VpurpN:"9370db",VsHgYF:"3cb371",VUXe:"7b68ee",VsprRggYF:"fa9a",VQe:"48d1cc",VviTetYd:"c71585",midnightXe:"191970",mRtcYam:"f5fffa",mistyPse:"ffe4e1",moccasR:"ffe4b5",navajowEte:"ffdead",navy:"80",Tdlace:"fdf5e6",Tive:"808000",TivedBb:"6b8e23",Sange:"ffa500",SangeYd:"ff4500",ScEd:"da70d6",pOegTMnPd:"eee8aa",pOegYF:"98fb98",pOeQe:"afeeee",pOeviTetYd:"db7093",papayawEp:"ffefd5",pHKpuff:"ffdab9",peru:"cd853f",pRk:"ffc0cb",plum:"dda0dd",powMrXe:"b0e0e6",purpN:"800080",YbeccapurpN:"663399",Yd:"ff0000",Psybrown:"bc8f8f",PyOXe:"4169e1",saddNbPwn:"8b4513",sOmon:"fa8072",sandybPwn:"f4a460",sHgYF:"2e8b57",sHshell:"fff5ee",siFna:"a0522d",silver:"c0c0c0",skyXe:"87ceeb",UXe:"6a5acd",UWay:"708090",UgYy:"708090",snow:"fffafa",sprRggYF:"ff7f",stAlXe:"4682b4",tan:"d2b48c",teO:"8080",tEstN:"d8bfd8",tomato:"ff6347",Qe:"40e0d0",viTet:"ee82ee",JHt:"f5deb3",wEte:"ffffff",wEtesmoke:"f5f5f5",Lw:"ffff00",LwgYF:"9acd32"};let Ht;function jt(t){Ht||(Ht=function(){const t={},e=Object.keys(Nt),i=Object.keys(Wt);let s,n,o,a,r;for(s=0;s<e.length;s++){for(a=r=e[s],n=0;n<i.length;n++)o=i[n],r=r.replace(o,Wt[o]);o=parseInt(Nt[a],16),t[r]=[o>>16&255,o>>8&255,255&o]}return t}(),Ht.transparent=[0,0,0,0]);const e=Ht[t.toLowerCase()];return e&&{r:e[0],g:e[1],b:e[2],a:4===e.length?e[3]:255}}const $t=/^rgba?\\(\\s*([-+.\\d]+)(%)?[\\s,]+([-+.e\\d]+)(%)?[\\s,]+([-+.e\\d]+)(%)?(?:[\\s,/]+([-+.e\\d]+)(%)?)?\\s*\\)$/;const Yt=t=>t<=.0031308?12.92*t:1.055*Math.pow(t,1/2.4)-.055,Ut=t=>t<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4);function Xt(t,e,i){if(t){let s=It(t);s[e]=Math.max(0,Math.min(s[e]+s[e]*i,0===e?360:1)),s=Ft(s),t.r=s[0],t.g=s[1],t.b=s[2]}}function qt(t,e){return t?Object.assign(e||{},t):t}function Kt(t){var e={r:0,g:0,b:0,a:255};return Array.isArray(t)?t.length>=3&&(e={r:t[0],g:t[1],b:t[2],a:255},t.length>3&&(e.a=Mt(t[3]))):(e=qt(t,{r:0,g:0,b:0,a:1})).a=Mt(e.a),e}function Gt(t){return"r"===t.charAt(0)?function(t){const e=$t.exec(t);let i,s,n,o=255;if(e){if(e[7]!==i){const t=+e[7];o=e[8]?vt(t):yt(255*t,0,255)}return i=+e[1],s=+e[3],n=+e[5],i=255&(e[2]?vt(i):yt(i,0,255)),s=255&(e[4]?vt(s):yt(s,0,255)),n=255&(e[6]?vt(n):yt(n,0,255)),{r:i,g:s,b:n,a:o}}}(t):Bt(t)}class Jt{constructor(t){if(t instanceof Jt)return t;const e=typeof t;let i;var s,n,o;"object"===e?i=Kt(t):"string"===e&&(o=(s=t).length,"#"===s[0]&&(4===o||5===o?n={r:255&17*St[s[1]],g:255&17*St[s[2]],b:255&17*St[s[3]],a:5===o?17*St[s[4]]:255}:7!==o&&9!==o||(n={r:St[s[1]]<<4|St[s[2]],g:St[s[3]]<<4|St[s[4]],b:St[s[5]]<<4|St[s[6]],a:9===o?St[s[7]]<<4|St[s[8]]:255})),i=n||jt(t)||Gt(t)),this._rgb=i,this._valid=!!i}get valid(){return this._valid}get rgb(){var t=qt(this._rgb);return t&&(t.a=wt(t.a)),t}set rgb(t){this._rgb=Kt(t)}rgbString(){return this._valid?(t=this._rgb)&&(t.a<255?\`rgba(\${t.r}, \${t.g}, \${t.b}, \${wt(t.a)})\`:\`rgb(\${t.r}, \${t.g}, \${t.b})\`):void 0;var t}hexString(){return this._valid?At(this._rgb):void 0}hslString(){return this._valid?function(t){if(!t)return;const e=It(t),i=e[0],s=kt(e[1]),n=kt(e[2]);return t.a<255?\`hsla(\${i}, \${s}%, \${n}%, \${wt(t.a)})\`:\`hsl(\${i}, \${s}%, \${n}%)\`}(this._rgb):void 0}mix(t,e){if(t){const i=this.rgb,s=t.rgb;let n;const o=e===n?.5:e,a=2*o-1,r=i.a-s.a,l=((a*r==-1?a:(a+r)/(1+a*r))+1)/2;n=1-l,i.r=255&l*i.r+n*s.r+.5,i.g=255&l*i.g+n*s.g+.5,i.b=255&l*i.b+n*s.b+.5,i.a=o*i.a+(1-o)*s.a,this.rgb=i}return this}interpolate(t,e){return t&&(this._rgb=function(t,e,i){const s=Ut(wt(t.r)),n=Ut(wt(t.g)),o=Ut(wt(t.b));return{r:Mt(Yt(s+i*(Ut(wt(e.r))-s))),g:Mt(Yt(n+i*(Ut(wt(e.g))-n))),b:Mt(Yt(o+i*(Ut(wt(e.b))-o))),a:t.a+i*(e.a-t.a)}}(this._rgb,t._rgb,e)),this}clone(){return new Jt(this.rgb)}alpha(t){return this._rgb.a=Mt(t),this}clearer(t){return this._rgb.a*=1-t,this}greyscale(){const t=this._rgb,e=_t(.3*t.r+.59*t.g+.11*t.b);return t.r=t.g=t.b=e,this}opaquer(t){return this._rgb.a*=1+t,this}negate(){const t=this._rgb;return t.r=255-t.r,t.g=255-t.g,t.b=255-t.b,this}lighten(t){return Xt(this._rgb,2,t),this}darken(t){return Xt(this._rgb,2,-t),this}saturate(t){return Xt(this._rgb,1,t),this}desaturate(t){return Xt(this._rgb,1,-t),this}rotate(t){return function(t,e){var i=It(t);i[0]=Vt(i[0]+e),i=Ft(i),t.r=i[0],t.g=i[1],t.b=i[2]}(this._rgb,t),this}}function Zt(t){if(t&&"object"==typeof t){const e=t.toString();return"[object CanvasPattern]"===e||"[object CanvasGradient]"===e}return!1}function Qt(t){return Zt(t)?t:new Jt(t)}function te(t){return Zt(t)?t:new Jt(t).saturate(.5).darken(.1).hexString()}const ee=["x","y","borderWidth","radius","tension"],ie=["color","borderColor","backgroundColor"];const se=new Map;function ne(t,e,i){return function(t,e){e=e||{};const i=t+JSON.stringify(e);let s=se.get(i);return s||(s=new Intl.NumberFormat(t,e),se.set(i,s)),s}(e,i).format(t)}const oe={values:t=>n(t)?t:""+t,numeric(t,e,i){if(0===t)return"0";const s=this.chart.options.locale;let n,o=t;if(i.length>1){const e=Math.max(Math.abs(i[0].value),Math.abs(i[i.length-1].value));(e<1e-4||e>1e15)&&(n="scientific"),o=function(t,e){let i=e.length>3?e[2].value-e[1].value:e[1].value-e[0].value;Math.abs(i)>=1&&t!==Math.floor(t)&&(i=t-Math.floor(t));return i}(t,i)}const a=z(Math.abs(o)),r=isNaN(a)?1:Math.max(Math.min(-1*Math.floor(a),20),0),l={notation:n,minimumFractionDigits:r,maximumFractionDigits:r};return Object.assign(l,this.options.ticks.format),ne(t,s,l)},logarithmic(t,e,i){if(0===t)return"0";const s=i[e].significand||t/Math.pow(10,Math.floor(z(t)));return[1,2,3,5,10,15].includes(s)||e>.8*i.length?oe.numeric.call(this,t,e,i):""}};var ae={formatters:oe};const re=Object.create(null),le=Object.create(null);function he(t,e){if(!e)return t;const i=e.split(".");for(let e=0,s=i.length;e<s;++e){const s=i[e];t=t[s]||(t[s]=Object.create(null))}return t}function ce(t,e,i){return"string"==typeof e?x(he(t,e),i):x(he(t,""),e)}class de{constructor(t,e){this.animation=void 0,this.backgroundColor="rgba(0,0,0,0.1)",this.borderColor="rgba(0,0,0,0.1)",this.color="#666",this.datasets={},this.devicePixelRatio=t=>t.chart.platform.getDevicePixelRatio(),this.elements={},this.events=["mousemove","mouseout","click","touchstart","touchmove"],this.font={family:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",size:12,style:"normal",lineHeight:1.2,weight:null},this.hover={},this.hoverBackgroundColor=(t,e)=>te(e.backgroundColor),this.hoverBorderColor=(t,e)=>te(e.borderColor),this.hoverColor=(t,e)=>te(e.color),this.indexAxis="x",this.interaction={mode:"nearest",intersect:!0,includeInvisible:!1},this.maintainAspectRatio=!0,this.onHover=null,this.onClick=null,this.parsing=!0,this.plugins={},this.responsive=!0,this.scale=void 0,this.scales={},this.showLine=!0,this.drawActiveElementsOnTop=!0,this.describe(t),this.apply(e)}set(t,e){return ce(this,t,e)}get(t){return he(this,t)}describe(t,e){return ce(le,t,e)}override(t,e){return ce(re,t,e)}route(t,e,i,s){const n=he(this,t),a=he(this,i),r="_"+e;Object.defineProperties(n,{[r]:{value:n[e],writable:!0},[e]:{enumerable:!0,get(){const t=this[r],e=a[s];return o(t)?Object.assign({},e,t):l(t,e)},set(t){this[r]=t}}})}apply(t){t.forEach((t=>t(this)))}}var ue=new de({_scriptable:t=>!t.startsWith("on"),_indexable:t=>"events"!==t,hover:{_fallback:"interaction"},interaction:{_scriptable:!1,_indexable:!1}},[function(t){t.set("animation",{delay:void 0,duration:1e3,easing:"easeOutQuart",fn:void 0,from:void 0,loop:void 0,to:void 0,type:void 0}),t.describe("animation",{_fallback:!1,_indexable:!1,_scriptable:t=>"onProgress"!==t&&"onComplete"!==t&&"fn"!==t}),t.set("animations",{colors:{type:"color",properties:ie},numbers:{type:"number",properties:ee}}),t.describe("animations",{_fallback:"animation"}),t.set("transitions",{active:{animation:{duration:400}},resize:{animation:{duration:0}},show:{animations:{colors:{from:"transparent"},visible:{type:"boolean",duration:0}}},hide:{animations:{colors:{to:"transparent"},visible:{type:"boolean",easing:"linear",fn:t=>0|t}}}})},function(t){t.set("layout",{autoPadding:!0,padding:{top:0,right:0,bottom:0,left:0}})},function(t){t.set("scale",{display:!0,offset:!1,reverse:!1,beginAtZero:!1,bounds:"ticks",clip:!0,grace:0,grid:{display:!0,lineWidth:1,drawOnChartArea:!0,drawTicks:!0,tickLength:8,tickWidth:(t,e)=>e.lineWidth,tickColor:(t,e)=>e.color,offset:!1},border:{display:!0,dash:[],dashOffset:0,width:1},title:{display:!1,text:"",padding:{top:4,bottom:4}},ticks:{minRotation:0,maxRotation:50,mirror:!1,textStrokeWidth:0,textStrokeColor:"",padding:3,display:!0,autoSkip:!0,autoSkipPadding:3,labelOffset:0,callback:ae.formatters.values,minor:{},major:{},align:"center",crossAlign:"near",showLabelBackdrop:!1,backdropColor:"rgba(255, 255, 255, 0.75)",backdropPadding:2}}),t.route("scale.ticks","color","","color"),t.route("scale.grid","color","","borderColor"),t.route("scale.border","color","","borderColor"),t.route("scale.title","color","","color"),t.describe("scale",{_fallback:!1,_scriptable:t=>!t.startsWith("before")&&!t.startsWith("after")&&"callback"!==t&&"parser"!==t,_indexable:t=>"borderDash"!==t&&"tickBorderDash"!==t&&"dash"!==t}),t.describe("scales",{_fallback:"scale"}),t.describe("scale.ticks",{_scriptable:t=>"backdropPadding"!==t&&"callback"!==t,_indexable:t=>"backdropPadding"!==t})}]);function fe(){return"undefined"!=typeof window&&"undefined"!=typeof document}function ge(t){let e=t.parentNode;return e&&"[object ShadowRoot]"===e.toString()&&(e=e.host),e}function pe(t,e,i){let s;return"string"==typeof t?(s=parseInt(t,10),-1!==t.indexOf("%")&&(s=s/100*e.parentNode[i])):s=t,s}const me=t=>t.ownerDocument.defaultView.getComputedStyle(t,null);function xe(t,e){return me(t).getPropertyValue(e)}const be=["top","right","bottom","left"];function _e(t,e,i){const s={};i=i?"-"+i:"";for(let n=0;n<4;n++){const o=be[n];s[o]=parseFloat(t[e+"-"+o+i])||0}return s.width=s.left+s.right,s.height=s.top+s.bottom,s}const ye=(t,e,i)=>(t>0||e>0)&&(!i||!i.shadowRoot);function ve(t,e){if("native"in t)return t;const{canvas:i,currentDevicePixelRatio:s}=e,n=me(i),o="border-box"===n.boxSizing,a=_e(n,"padding"),r=_e(n,"border","width"),{x:l,y:h,box:c}=function(t,e){const i=t.touches,s=i&&i.length?i[0]:t,{offsetX:n,offsetY:o}=s;let a,r,l=!1;if(ye(n,o,t.target))a=n,r=o;else{const t=e.getBoundingClientRect();a=s.clientX-t.left,r=s.clientY-t.top,l=!0}return{x:a,y:r,box:l}}(t,i),d=a.left+(c&&r.left),u=a.top+(c&&r.top);let{width:f,height:g}=e;return o&&(f-=a.width+r.width,g-=a.height+r.height),{x:Math.round((l-d)/f*i.width/s),y:Math.round((h-u)/g*i.height/s)}}const Me=t=>Math.round(10*t)/10;function we(t,e,i,s){const n=me(t),o=_e(n,"margin"),a=pe(n.maxWidth,t,"clientWidth")||T,r=pe(n.maxHeight,t,"clientHeight")||T,l=function(t,e,i){let s,n;if(void 0===e||void 0===i){const o=t&&ge(t);if(o){const t=o.getBoundingClientRect(),a=me(o),r=_e(a,"border","width"),l=_e(a,"padding");e=t.width-l.width-r.width,i=t.height-l.height-r.height,s=pe(a.maxWidth,o,"clientWidth"),n=pe(a.maxHeight,o,"clientHeight")}else e=t.clientWidth,i=t.clientHeight}return{width:e,height:i,maxWidth:s||T,maxHeight:n||T}}(t,e,i);let{width:h,height:c}=l;if("content-box"===n.boxSizing){const t=_e(n,"border","width"),e=_e(n,"padding");h-=e.width+t.width,c-=e.height+t.height}h=Math.max(0,h-o.width),c=Math.max(0,s?h/s:c-o.height),h=Me(Math.min(h,a,l.maxWidth)),c=Me(Math.min(c,r,l.maxHeight)),h&&!c&&(c=Me(h/2));return(void 0!==e||void 0!==i)&&s&&l.height&&c>l.height&&(c=l.height,h=Me(Math.floor(c*s))),{width:h,height:c}}function ke(t,e,i){const s=e||1,n=Me(t.height*s),o=Me(t.width*s);t.height=Me(t.height),t.width=Me(t.width);const a=t.canvas;return a.style&&(i||!a.style.height&&!a.style.width)&&(a.style.height=\`\${t.height}px\`,a.style.width=\`\${t.width}px\`),(t.currentDevicePixelRatio!==s||a.height!==n||a.width!==o)&&(t.currentDevicePixelRatio=s,a.height=n,a.width=o,t.ctx.setTransform(s,0,0,s,0,0),!0)}const Se=function(){let t=!1;try{const e={get passive(){return t=!0,!1}};fe()&&(window.addEventListener("test",null,e),window.removeEventListener("test",null,e))}catch(t){}return t}();function Pe(t,e){const i=xe(t,e),s=i&&i.match(/^(\\d+)(\\.\\d+)?px$/);return s?+s[1]:void 0}function De(t){return!t||s(t.size)||s(t.family)?null:(t.style?t.style+" ":"")+(t.weight?t.weight+" ":"")+t.size+"px "+t.family}function Ce(t,e,i,s,n){let o=e[n];return o||(o=e[n]=t.measureText(n).width,i.push(n)),o>s&&(s=o),s}function Oe(t,e,i,s){let o=(s=s||{}).data=s.data||{},a=s.garbageCollect=s.garbageCollect||[];s.font!==e&&(o=s.data={},a=s.garbageCollect=[],s.font=e),t.save(),t.font=e;let r=0;const l=i.length;let h,c,d,u,f;for(h=0;h<l;h++)if(u=i[h],null==u||n(u)){if(n(u))for(c=0,d=u.length;c<d;c++)f=u[c],null==f||n(f)||(r=Ce(t,o,a,r,f))}else r=Ce(t,o,a,r,u);t.restore();const g=a.length/2;if(g>i.length){for(h=0;h<g;h++)delete o[a[h]];a.splice(0,g)}return r}function Ae(t,e,i){const s=t.currentDevicePixelRatio,n=0!==i?Math.max(i/2,.5):0;return Math.round((e-n)*s)/s+n}function Te(t,e){(e||t)&&((e=e||t.getContext("2d")).save(),e.resetTransform(),e.clearRect(0,0,t.width,t.height),e.restore())}function Le(t,e,i,s){Ee(t,e,i,s,null)}function Ee(t,e,i,s,n){let o,a,r,l,h,c,d,u;const f=e.pointStyle,g=e.rotation,p=e.radius;let m=(g||0)*L;if(f&&"object"==typeof f&&(o=f.toString(),"[object HTMLImageElement]"===o||"[object HTMLCanvasElement]"===o))return t.save(),t.translate(i,s),t.rotate(m),t.drawImage(f,-f.width/2,-f.height/2,f.width,f.height),void t.restore();if(!(isNaN(p)||p<=0)){switch(t.beginPath(),f){default:n?t.ellipse(i,s,n/2,p,0,0,O):t.arc(i,s,p,0,O),t.closePath();break;case"triangle":c=n?n/2:p,t.moveTo(i+Math.sin(m)*c,s-Math.cos(m)*p),m+=I,t.lineTo(i+Math.sin(m)*c,s-Math.cos(m)*p),m+=I,t.lineTo(i+Math.sin(m)*c,s-Math.cos(m)*p),t.closePath();break;case"rectRounded":h=.516*p,l=p-h,a=Math.cos(m+R)*l,d=Math.cos(m+R)*(n?n/2-h:l),r=Math.sin(m+R)*l,u=Math.sin(m+R)*(n?n/2-h:l),t.arc(i-d,s-r,h,m-C,m-E),t.arc(i+u,s-a,h,m-E,m),t.arc(i+d,s+r,h,m,m+E),t.arc(i-u,s+a,h,m+E,m+C),t.closePath();break;case"rect":if(!g){l=Math.SQRT1_2*p,c=n?n/2:l,t.rect(i-c,s-l,2*c,2*l);break}m+=R;case"rectRot":d=Math.cos(m)*(n?n/2:p),a=Math.cos(m)*p,r=Math.sin(m)*p,u=Math.sin(m)*(n?n/2:p),t.moveTo(i-d,s-r),t.lineTo(i+u,s-a),t.lineTo(i+d,s+r),t.lineTo(i-u,s+a),t.closePath();break;case"crossRot":m+=R;case"cross":d=Math.cos(m)*(n?n/2:p),a=Math.cos(m)*p,r=Math.sin(m)*p,u=Math.sin(m)*(n?n/2:p),t.moveTo(i-d,s-r),t.lineTo(i+d,s+r),t.moveTo(i+u,s-a),t.lineTo(i-u,s+a);break;case"star":d=Math.cos(m)*(n?n/2:p),a=Math.cos(m)*p,r=Math.sin(m)*p,u=Math.sin(m)*(n?n/2:p),t.moveTo(i-d,s-r),t.lineTo(i+d,s+r),t.moveTo(i+u,s-a),t.lineTo(i-u,s+a),m+=R,d=Math.cos(m)*(n?n/2:p),a=Math.cos(m)*p,r=Math.sin(m)*p,u=Math.sin(m)*(n?n/2:p),t.moveTo(i-d,s-r),t.lineTo(i+d,s+r),t.moveTo(i+u,s-a),t.lineTo(i-u,s+a);break;case"line":a=n?n/2:Math.cos(m)*p,r=Math.sin(m)*p,t.moveTo(i-a,s-r),t.lineTo(i+a,s+r);break;case"dash":t.moveTo(i,s),t.lineTo(i+Math.cos(m)*(n?n/2:p),s+Math.sin(m)*p);break;case!1:t.closePath()}t.fill(),e.borderWidth>0&&t.stroke()}}function Re(t,e,i){return i=i||.5,!e||t&&t.x>e.left-i&&t.x<e.right+i&&t.y>e.top-i&&t.y<e.bottom+i}function Ie(t,e){t.save(),t.beginPath(),t.rect(e.left,e.top,e.right-e.left,e.bottom-e.top),t.clip()}function ze(t){t.restore()}function Fe(t,e,i,s,n){if(!e)return t.lineTo(i.x,i.y);if("middle"===n){const s=(e.x+i.x)/2;t.lineTo(s,e.y),t.lineTo(s,i.y)}else"after"===n!=!!s?t.lineTo(e.x,i.y):t.lineTo(i.x,e.y);t.lineTo(i.x,i.y)}function Ve(t,e,i,s){if(!e)return t.lineTo(i.x,i.y);t.bezierCurveTo(s?e.cp1x:e.cp2x,s?e.cp1y:e.cp2y,s?i.cp2x:i.cp1x,s?i.cp2y:i.cp1y,i.x,i.y)}function Be(t,e,i,s,n){if(n.strikethrough||n.underline){const o=t.measureText(s),a=e-o.actualBoundingBoxLeft,r=e+o.actualBoundingBoxRight,l=i-o.actualBoundingBoxAscent,h=i+o.actualBoundingBoxDescent,c=n.strikethrough?(l+h)/2:h;t.strokeStyle=t.fillStyle,t.beginPath(),t.lineWidth=n.decorationWidth||2,t.moveTo(a,c),t.lineTo(r,c),t.stroke()}}function We(t,e){const i=t.fillStyle;t.fillStyle=e.color,t.fillRect(e.left,e.top,e.width,e.height),t.fillStyle=i}function Ne(t,e,i,o,a,r={}){const l=n(e)?e:[e],h=r.strokeWidth>0&&""!==r.strokeColor;let c,d;for(t.save(),t.font=a.string,function(t,e){e.translation&&t.translate(e.translation[0],e.translation[1]),s(e.rotation)||t.rotate(e.rotation),e.color&&(t.fillStyle=e.color),e.textAlign&&(t.textAlign=e.textAlign),e.textBaseline&&(t.textBaseline=e.textBaseline)}(t,r),c=0;c<l.length;++c)d=l[c],r.backdrop&&We(t,r.backdrop),h&&(r.strokeColor&&(t.strokeStyle=r.strokeColor),s(r.strokeWidth)||(t.lineWidth=r.strokeWidth),t.strokeText(d,i,o,r.maxWidth)),t.fillText(d,i,o,r.maxWidth),Be(t,i,o,d,r),o+=Number(a.lineHeight);t.restore()}function He(t,e){const{x:i,y:s,w:n,h:o,radius:a}=e;t.arc(i+a.topLeft,s+a.topLeft,a.topLeft,1.5*C,C,!0),t.lineTo(i,s+o-a.bottomLeft),t.arc(i+a.bottomLeft,s+o-a.bottomLeft,a.bottomLeft,C,E,!0),t.lineTo(i+n-a.bottomRight,s+o),t.arc(i+n-a.bottomRight,s+o-a.bottomRight,a.bottomRight,E,0,!0),t.lineTo(i+n,s+a.topRight),t.arc(i+n-a.topRight,s+a.topRight,a.topRight,0,-E,!0),t.lineTo(i+a.topLeft,s)}function je(t,e=[""],i,s,n=(()=>t[0])){const o=i||t;void 0===s&&(s=ti("_fallback",t));const a={[Symbol.toStringTag]:"Object",_cacheable:!0,_scopes:t,_rootScopes:o,_fallback:s,_getTarget:n,override:i=>je([i,...t],e,o,s)};return new Proxy(a,{deleteProperty:(e,i)=>(delete e[i],delete e._keys,delete t[0][i],!0),get:(i,s)=>qe(i,s,(()=>function(t,e,i,s){let n;for(const o of e)if(n=ti(Ue(o,t),i),void 0!==n)return Xe(t,n)?Ze(i,s,t,n):n}(s,e,t,i))),getOwnPropertyDescriptor:(t,e)=>Reflect.getOwnPropertyDescriptor(t._scopes[0],e),getPrototypeOf:()=>Reflect.getPrototypeOf(t[0]),has:(t,e)=>ei(t).includes(e),ownKeys:t=>ei(t),set(t,e,i){const s=t._storage||(t._storage=n());return t[e]=s[e]=i,delete t._keys,!0}})}function $e(t,e,i,s){const a={_cacheable:!1,_proxy:t,_context:e,_subProxy:i,_stack:new Set,_descriptors:Ye(t,s),setContext:e=>$e(t,e,i,s),override:n=>$e(t.override(n),e,i,s)};return new Proxy(a,{deleteProperty:(e,i)=>(delete e[i],delete t[i],!0),get:(t,e,i)=>qe(t,e,(()=>function(t,e,i){const{_proxy:s,_context:a,_subProxy:r,_descriptors:l}=t;let h=s[e];S(h)&&l.isScriptable(e)&&(h=function(t,e,i,s){const{_proxy:n,_context:o,_subProxy:a,_stack:r}=i;if(r.has(t))throw new Error("Recursion detected: "+Array.from(r).join("->")+"->"+t);r.add(t);let l=e(o,a||s);r.delete(t),Xe(t,l)&&(l=Ze(n._scopes,n,t,l));return l}(e,h,t,i));n(h)&&h.length&&(h=function(t,e,i,s){const{_proxy:n,_context:a,_subProxy:r,_descriptors:l}=i;if(void 0!==a.index&&s(t))return e[a.index%e.length];if(o(e[0])){const i=e,s=n._scopes.filter((t=>t!==i));e=[];for(const o of i){const i=Ze(s,n,t,o);e.push($e(i,a,r&&r[t],l))}}return e}(e,h,t,l.isIndexable));Xe(e,h)&&(h=$e(h,a,r&&r[e],l));return h}(t,e,i))),getOwnPropertyDescriptor:(e,i)=>e._descriptors.allKeys?Reflect.has(t,i)?{enumerable:!0,configurable:!0}:void 0:Reflect.getOwnPropertyDescriptor(t,i),getPrototypeOf:()=>Reflect.getPrototypeOf(t),has:(e,i)=>Reflect.has(t,i),ownKeys:()=>Reflect.ownKeys(t),set:(e,i,s)=>(t[i]=s,delete e[i],!0)})}function Ye(t,e={scriptable:!0,indexable:!0}){const{_scriptable:i=e.scriptable,_indexable:s=e.indexable,_allKeys:n=e.allKeys}=t;return{allKeys:n,scriptable:i,indexable:s,isScriptable:S(i)?i:()=>i,isIndexable:S(s)?s:()=>s}}const Ue=(t,e)=>t?t+w(e):e,Xe=(t,e)=>o(e)&&"adapters"!==t&&(null===Object.getPrototypeOf(e)||e.constructor===Object);function qe(t,e,i){if(Object.prototype.hasOwnProperty.call(t,e)||"constructor"===e)return t[e];const s=i();return t[e]=s,s}function Ke(t,e,i){return S(t)?t(e,i):t}const Ge=(t,e)=>!0===t?e:"string"==typeof t?M(e,t):void 0;function Je(t,e,i,s,n){for(const o of e){const e=Ge(i,o);if(e){t.add(e);const o=Ke(e._fallback,i,n);if(void 0!==o&&o!==i&&o!==s)return o}else if(!1===e&&void 0!==s&&i!==s)return null}return!1}function Ze(t,e,i,s){const a=e._rootScopes,r=Ke(e._fallback,i,s),l=[...t,...a],h=new Set;h.add(s);let c=Qe(h,l,i,r||i,s);return null!==c&&((void 0===r||r===i||(c=Qe(h,l,r,c,s),null!==c))&&je(Array.from(h),[""],a,r,(()=>function(t,e,i){const s=t._getTarget();e in s||(s[e]={});const a=s[e];if(n(a)&&o(i))return i;return a||{}}(e,i,s))))}function Qe(t,e,i,s,n){for(;i;)i=Je(t,e,i,s,n);return i}function ti(t,e){for(const i of e){if(!i)continue;const e=i[t];if(void 0!==e)return e}}function ei(t){let e=t._keys;return e||(e=t._keys=function(t){const e=new Set;for(const i of t)for(const t of Object.keys(i).filter((t=>!t.startsWith("_"))))e.add(t);return Array.from(e)}(t._scopes)),e}function ii(t,e,i,s){const{iScale:n}=t,{key:o="r"}=this._parsing,a=new Array(s);let r,l,h,c;for(r=0,l=s;r<l;++r)h=r+i,c=e[h],a[r]={r:n.parse(M(c,o),h)};return a}const si=Number.EPSILON||1e-14,ni=(t,e)=>e<t.length&&!t[e].skip&&t[e],oi=t=>"x"===t?"y":"x";function ai(t,e,i,s){const n=t.skip?e:t,o=e,a=i.skip?e:i,r=q(o,n),l=q(a,o);let h=r/(r+l),c=l/(r+l);h=isNaN(h)?0:h,c=isNaN(c)?0:c;const d=s*h,u=s*c;return{previous:{x:o.x-d*(a.x-n.x),y:o.y-d*(a.y-n.y)},next:{x:o.x+u*(a.x-n.x),y:o.y+u*(a.y-n.y)}}}function ri(t,e="x"){const i=oi(e),s=t.length,n=Array(s).fill(0),o=Array(s);let a,r,l,h=ni(t,0);for(a=0;a<s;++a)if(r=l,l=h,h=ni(t,a+1),l){if(h){const t=h[e]-l[e];n[a]=0!==t?(h[i]-l[i])/t:0}o[a]=r?h?F(n[a-1])!==F(n[a])?0:(n[a-1]+n[a])/2:n[a-1]:n[a]}!function(t,e,i){const s=t.length;let n,o,a,r,l,h=ni(t,0);for(let c=0;c<s-1;++c)l=h,h=ni(t,c+1),l&&h&&(V(e[c],0,si)?i[c]=i[c+1]=0:(n=i[c]/e[c],o=i[c+1]/e[c],r=Math.pow(n,2)+Math.pow(o,2),r<=9||(a=3/Math.sqrt(r),i[c]=n*a*e[c],i[c+1]=o*a*e[c])))}(t,n,o),function(t,e,i="x"){const s=oi(i),n=t.length;let o,a,r,l=ni(t,0);for(let h=0;h<n;++h){if(a=r,r=l,l=ni(t,h+1),!r)continue;const n=r[i],c=r[s];a&&(o=(n-a[i])/3,r[\`cp1\${i}\`]=n-o,r[\`cp1\${s}\`]=c-o*e[h]),l&&(o=(l[i]-n)/3,r[\`cp2\${i}\`]=n+o,r[\`cp2\${s}\`]=c+o*e[h])}}(t,o,e)}function li(t,e,i){return Math.max(Math.min(t,i),e)}function hi(t,e,i,s,n){let o,a,r,l;if(e.spanGaps&&(t=t.filter((t=>!t.skip))),"monotone"===e.cubicInterpolationMode)ri(t,n);else{let i=s?t[t.length-1]:t[0];for(o=0,a=t.length;o<a;++o)r=t[o],l=ai(i,r,t[Math.min(o+1,a-(s?0:1))%a],e.tension),r.cp1x=l.previous.x,r.cp1y=l.previous.y,r.cp2x=l.next.x,r.cp2y=l.next.y,i=r}e.capBezierPoints&&function(t,e){let i,s,n,o,a,r=Re(t[0],e);for(i=0,s=t.length;i<s;++i)a=o,o=r,r=i<s-1&&Re(t[i+1],e),o&&(n=t[i],a&&(n.cp1x=li(n.cp1x,e.left,e.right),n.cp1y=li(n.cp1y,e.top,e.bottom)),r&&(n.cp2x=li(n.cp2x,e.left,e.right),n.cp2y=li(n.cp2y,e.top,e.bottom)))}(t,i)}const ci=t=>0===t||1===t,di=(t,e,i)=>-Math.pow(2,10*(t-=1))*Math.sin((t-e)*O/i),ui=(t,e,i)=>Math.pow(2,-10*t)*Math.sin((t-e)*O/i)+1,fi={linear:t=>t,easeInQuad:t=>t*t,easeOutQuad:t=>-t*(t-2),easeInOutQuad:t=>(t/=.5)<1?.5*t*t:-.5*(--t*(t-2)-1),easeInCubic:t=>t*t*t,easeOutCubic:t=>(t-=1)*t*t+1,easeInOutCubic:t=>(t/=.5)<1?.5*t*t*t:.5*((t-=2)*t*t+2),easeInQuart:t=>t*t*t*t,easeOutQuart:t=>-((t-=1)*t*t*t-1),easeInOutQuart:t=>(t/=.5)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2),easeInQuint:t=>t*t*t*t*t,easeOutQuint:t=>(t-=1)*t*t*t*t+1,easeInOutQuint:t=>(t/=.5)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2),easeInSine:t=>1-Math.cos(t*E),easeOutSine:t=>Math.sin(t*E),easeInOutSine:t=>-.5*(Math.cos(C*t)-1),easeInExpo:t=>0===t?0:Math.pow(2,10*(t-1)),easeOutExpo:t=>1===t?1:1-Math.pow(2,-10*t),easeInOutExpo:t=>ci(t)?t:t<.5?.5*Math.pow(2,10*(2*t-1)):.5*(2-Math.pow(2,-10*(2*t-1))),easeInCirc:t=>t>=1?t:-(Math.sqrt(1-t*t)-1),easeOutCirc:t=>Math.sqrt(1-(t-=1)*t),easeInOutCirc:t=>(t/=.5)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1),easeInElastic:t=>ci(t)?t:di(t,.075,.3),easeOutElastic:t=>ci(t)?t:ui(t,.075,.3),easeInOutElastic(t){const e=.1125;return ci(t)?t:t<.5?.5*di(2*t,e,.45):.5+.5*ui(2*t-1,e,.45)},easeInBack(t){const e=1.70158;return t*t*((e+1)*t-e)},easeOutBack(t){const e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},easeInOutBack(t){let e=1.70158;return(t/=.5)<1?t*t*((1+(e*=1.525))*t-e)*.5:.5*((t-=2)*t*((1+(e*=1.525))*t+e)+2)},easeInBounce:t=>1-fi.easeOutBounce(1-t),easeOutBounce(t){const e=7.5625,i=2.75;return t<1/i?e*t*t:t<2/i?e*(t-=1.5/i)*t+.75:t<2.5/i?e*(t-=2.25/i)*t+.9375:e*(t-=2.625/i)*t+.984375},easeInOutBounce:t=>t<.5?.5*fi.easeInBounce(2*t):.5*fi.easeOutBounce(2*t-1)+.5};function gi(t,e,i,s){return{x:t.x+i*(e.x-t.x),y:t.y+i*(e.y-t.y)}}function pi(t,e,i,s){return{x:t.x+i*(e.x-t.x),y:"middle"===s?i<.5?t.y:e.y:"after"===s?i<1?t.y:e.y:i>0?e.y:t.y}}function mi(t,e,i,s){const n={x:t.cp2x,y:t.cp2y},o={x:e.cp1x,y:e.cp1y},a=gi(t,n,i),r=gi(n,o,i),l=gi(o,e,i),h=gi(a,r,i),c=gi(r,l,i);return gi(h,c,i)}const xi=/^(normal|(\\d+(?:\\.\\d+)?)(px|em|%)?)$/,bi=/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;function _i(t,e){const i=(""+t).match(xi);if(!i||"normal"===i[1])return 1.2*e;switch(t=+i[2],i[3]){case"px":return t;case"%":t/=100}return e*t}const yi=t=>+t||0;function vi(t,e){const i={},s=o(e),n=s?Object.keys(e):e,a=o(t)?s?i=>l(t[i],t[e[i]]):e=>t[e]:()=>t;for(const t of n)i[t]=yi(a(t));return i}function Mi(t){return vi(t,{top:"y",right:"x",bottom:"y",left:"x"})}function wi(t){return vi(t,["topLeft","topRight","bottomLeft","bottomRight"])}function ki(t){const e=Mi(t);return e.width=e.left+e.right,e.height=e.top+e.bottom,e}function Si(t,e){t=t||{},e=e||ue.font;let i=l(t.size,e.size);"string"==typeof i&&(i=parseInt(i,10));let s=l(t.style,e.style);s&&!(""+s).match(bi)&&(console.warn('Invalid font style specified: "'+s+'"'),s=void 0);const n={family:l(t.family,e.family),lineHeight:_i(l(t.lineHeight,e.lineHeight),i),size:i,style:s,weight:l(t.weight,e.weight),string:""};return n.string=De(n),n}function Pi(t,e,i,s){let o,a,r,l=!0;for(o=0,a=t.length;o<a;++o)if(r=t[o],void 0!==r&&(void 0!==e&&"function"==typeof r&&(r=r(e),l=!1),void 0!==i&&n(r)&&(r=r[i%r.length],l=!1),void 0!==r))return s&&!l&&(s.cacheable=!1),r}function Di(t,e,i){const{min:s,max:n}=t,o=c(e,(n-s)/2),a=(t,e)=>i&&0===t?0:t+e;return{min:a(s,-Math.abs(o)),max:a(n,o)}}function Ci(t,e){return Object.assign(Object.create(t),e)}function Oi(t,e,i){return t?function(t,e){return{x:i=>t+t+e-i,setWidth(t){e=t},textAlign:t=>"center"===t?t:"right"===t?"left":"right",xPlus:(t,e)=>t-e,leftForLtr:(t,e)=>t-e}}(e,i):{x:t=>t,setWidth(t){},textAlign:t=>t,xPlus:(t,e)=>t+e,leftForLtr:(t,e)=>t}}function Ai(t,e){let i,s;"ltr"!==e&&"rtl"!==e||(i=t.canvas.style,s=[i.getPropertyValue("direction"),i.getPropertyPriority("direction")],i.setProperty("direction",e,"important"),t.prevTextDirection=s)}function Ti(t,e){void 0!==e&&(delete t.prevTextDirection,t.canvas.style.setProperty("direction",e[0],e[1]))}function Li(t){return"angle"===t?{between:J,compare:K,normalize:G}:{between:tt,compare:(t,e)=>t-e,normalize:t=>t}}function Ei({start:t,end:e,count:i,loop:s,style:n}){return{start:t%i,end:e%i,loop:s&&(e-t+1)%i==0,style:n}}function Ri(t,e,i){if(!i)return[t];const{property:s,start:n,end:o}=i,a=e.length,{compare:r,between:l,normalize:h}=Li(s),{start:c,end:d,loop:u,style:f}=function(t,e,i){const{property:s,start:n,end:o}=i,{between:a,normalize:r}=Li(s),l=e.length;let h,c,{start:d,end:u,loop:f}=t;if(f){for(d+=l,u+=l,h=0,c=l;h<c&&a(r(e[d%l][s]),n,o);++h)d--,u--;d%=l,u%=l}return u<d&&(u+=l),{start:d,end:u,loop:f,style:t.style}}(t,e,i),g=[];let p,m,x,b=!1,_=null;const y=()=>b||l(n,x,p)&&0!==r(n,x),v=()=>!b||0===r(o,p)||l(o,x,p);for(let t=c,i=c;t<=d;++t)m=e[t%a],m.skip||(p=h(m[s]),p!==x&&(b=l(p,n,o),null===_&&y()&&(_=0===r(p,n)?t:i),null!==_&&v()&&(g.push(Ei({start:_,end:t,loop:u,count:a,style:f})),_=null),i=t,x=p));return null!==_&&g.push(Ei({start:_,end:d,loop:u,count:a,style:f})),g}function Ii(t,e){const i=[],s=t.segments;for(let n=0;n<s.length;n++){const o=Ri(s[n],t.points,e);o.length&&i.push(...o)}return i}function zi(t,e){const i=t.points,s=t.options.spanGaps,n=i.length;if(!n)return[];const o=!!t._loop,{start:a,end:r}=function(t,e,i,s){let n=0,o=e-1;if(i&&!s)for(;n<e&&!t[n].skip;)n++;for(;n<e&&t[n].skip;)n++;for(n%=e,i&&(o+=n);o>n&&t[o%e].skip;)o--;return o%=e,{start:n,end:o}}(i,n,o,s);if(!0===s)return Fi(t,[{start:a,end:r,loop:o}],i,e);return Fi(t,function(t,e,i,s){const n=t.length,o=[];let a,r=e,l=t[e];for(a=e+1;a<=i;++a){const i=t[a%n];i.skip||i.stop?l.skip||(s=!1,o.push({start:e%n,end:(a-1)%n,loop:s}),e=r=i.stop?a:null):(r=a,l.skip&&(e=a)),l=i}return null!==r&&o.push({start:e%n,end:r%n,loop:s}),o}(i,a,r<a?r+n:r,!!t._fullLoop&&0===a&&r===n-1),i,e)}function Fi(t,e,i,s){return s&&s.setContext&&i?function(t,e,i,s){const n=t._chart.getContext(),o=Vi(t.options),{_datasetIndex:a,options:{spanGaps:r}}=t,l=i.length,h=[];let c=o,d=e[0].start,u=d;function f(t,e,s,n){const o=r?-1:1;if(t!==e){for(t+=l;i[t%l].skip;)t-=o;for(;i[e%l].skip;)e+=o;t%l!=e%l&&(h.push({start:t%l,end:e%l,loop:s,style:n}),c=n,d=e%l)}}for(const t of e){d=r?d:t.start;let e,o=i[d%l];for(u=d+1;u<=t.end;u++){const r=i[u%l];e=Vi(s.setContext(Ci(n,{type:"segment",p0:o,p1:r,p0DataIndex:(u-1)%l,p1DataIndex:u%l,datasetIndex:a}))),Bi(e,c)&&f(d,u-1,t.loop,c),o=r,c=e}d<u-1&&f(d,u-1,t.loop,c)}return h}(t,e,i,s):e}function Vi(t){return{backgroundColor:t.backgroundColor,borderCapStyle:t.borderCapStyle,borderDash:t.borderDash,borderDashOffset:t.borderDashOffset,borderJoinStyle:t.borderJoinStyle,borderWidth:t.borderWidth,borderColor:t.borderColor}}function Bi(t,e){if(!e)return!1;const i=[],s=function(t,e){return Zt(e)?(i.includes(e)||i.push(e),i.indexOf(e)):e};return JSON.stringify(t,s)!==JSON.stringify(e,s)}function Wi(t,e,i){return t.options.clip?t[i]:e[i]}function Ni(t,e){const i=e._clip;if(i.disabled)return!1;const s=function(t,e){const{xScale:i,yScale:s}=t;return i&&s?{left:Wi(i,e,"left"),right:Wi(i,e,"right"),top:Wi(s,e,"top"),bottom:Wi(s,e,"bottom")}:e}(e,t.chartArea);return{left:!1===i.left?0:s.left-(!0===i.left?0:i.left),right:!1===i.right?t.width:s.right+(!0===i.right?0:i.right),top:!1===i.top?0:s.top-(!0===i.top?0:i.top),bottom:!1===i.bottom?t.height:s.bottom+(!0===i.bottom?0:i.bottom)}}var Hi=Object.freeze({__proto__:null,HALF_PI:E,INFINITY:T,PI:C,PITAU:A,QUARTER_PI:R,RAD_PER_DEG:L,TAU:O,TWO_THIRDS_PI:I,_addGrace:Di,_alignPixel:Ae,_alignStartEnd:ft,_angleBetween:J,_angleDiff:K,_arrayUnique:lt,_attachContext:$e,_bezierCurveTo:Ve,_bezierInterpolation:mi,_boundSegment:Ri,_boundSegments:Ii,_capitalize:w,_computeSegments:zi,_createResolver:je,_decimalPlaces:U,_deprecated:function(t,e,i,s){void 0!==e&&console.warn(t+': "'+i+'" is deprecated. Please use "'+s+'" instead')},_descriptors:Ye,_elementsEqual:f,_factorize:W,_filterBetween:nt,_getParentNode:ge,_getStartAndCountOfVisiblePoints:pt,_int16Range:Q,_isBetween:tt,_isClickEvent:D,_isDomSupported:fe,_isPointInArea:Re,_limitValue:Z,_longestText:Oe,_lookup:et,_lookupByKey:it,_measureText:Ce,_merger:m,_mergerIf:_,_normalizeAngle:G,_parseObjectDataRadialScale:ii,_pointInLine:gi,_readValueToProps:vi,_rlookupByKey:st,_scaleRangesChanged:mt,_setMinAndMaxByKey:j,_splitKey:v,_steppedInterpolation:pi,_steppedLineTo:Fe,_textX:gt,_toLeftRightCenter:ut,_updateBezierControlPoints:hi,addRoundedRectPath:He,almostEquals:V,almostWhole:H,callback:d,clearCanvas:Te,clipArea:Ie,clone:g,color:Qt,createContext:Ci,debounce:dt,defined:k,distanceBetweenPoints:q,drawPoint:Le,drawPointLegend:Ee,each:u,easingEffects:fi,finiteOrDefault:r,fontString:function(t,e,i){return e+" "+t+"px "+i},formatNumber:ne,getAngleFromPoint:X,getDatasetClipArea:Ni,getHoverColor:te,getMaximumSize:we,getRelativePosition:ve,getRtlAdapter:Oi,getStyle:xe,isArray:n,isFinite:a,isFunction:S,isNullOrUndef:s,isNumber:N,isObject:o,isPatternOrGradient:Zt,listenArrayEvents:at,log10:z,merge:x,mergeIf:b,niceNum:B,noop:e,overrideTextDirection:Ai,readUsedSize:Pe,renderText:Ne,requestAnimFrame:ht,resolve:Pi,resolveObjectKey:M,restoreTextDirection:Ti,retinaScale:ke,setsEqual:P,sign:F,splineCurve:ai,splineCurveMonotone:ri,supportsEventListenerOptions:Se,throttled:ct,toDegrees:Y,toDimension:c,toFont:Si,toFontString:De,toLineHeight:_i,toPadding:ki,toPercentage:h,toRadians:$,toTRBL:Mi,toTRBLCorners:wi,uid:i,unclipArea:ze,unlistenArrayEvents:rt,valueOrDefault:l});function ji(t,e,i,n){const{controller:o,data:a,_sorted:r}=t,l=o._cachedMeta.iScale,h=t.dataset&&t.dataset.options?t.dataset.options.spanGaps:null;if(l&&e===l.axis&&"r"!==e&&r&&a.length){const r=l._reversePixels?st:it;if(!n){const n=r(a,e,i);if(h){const{vScale:e}=o._cachedMeta,{_parsed:i}=t,a=i.slice(0,n.lo+1).reverse().findIndex((t=>!s(t[e.axis])));n.lo-=Math.max(0,a);const r=i.slice(n.hi).findIndex((t=>!s(t[e.axis])));n.hi+=Math.max(0,r)}return n}if(o._sharedOptions){const t=a[0],s="function"==typeof t.getRange&&t.getRange(e);if(s){const t=r(a,e,i-s),n=r(a,e,i+s);return{lo:t.lo,hi:n.hi}}}}return{lo:0,hi:a.length-1}}function $i(t,e,i,s,n){const o=t.getSortedVisibleDatasetMetas(),a=i[e];for(let t=0,i=o.length;t<i;++t){const{index:i,data:r}=o[t],{lo:l,hi:h}=ji(o[t],e,a,n);for(let t=l;t<=h;++t){const e=r[t];e.skip||s(e,i,t)}}}function Yi(t,e,i,s,n){const o=[];if(!n&&!t.isPointInArea(e))return o;return $i(t,i,e,(function(i,a,r){(n||Re(i,t.chartArea,0))&&i.inRange(e.x,e.y,s)&&o.push({element:i,datasetIndex:a,index:r})}),!0),o}function Ui(t,e,i,s,n,o){let a=[];const r=function(t){const e=-1!==t.indexOf("x"),i=-1!==t.indexOf("y");return function(t,s){const n=e?Math.abs(t.x-s.x):0,o=i?Math.abs(t.y-s.y):0;return Math.sqrt(Math.pow(n,2)+Math.pow(o,2))}}(i);let l=Number.POSITIVE_INFINITY;return $i(t,i,e,(function(i,h,c){const d=i.inRange(e.x,e.y,n);if(s&&!d)return;const u=i.getCenterPoint(n);if(!(!!o||t.isPointInArea(u))&&!d)return;const f=r(e,u);f<l?(a=[{element:i,datasetIndex:h,index:c}],l=f):f===l&&a.push({element:i,datasetIndex:h,index:c})})),a}function Xi(t,e,i,s,n,o){return o||t.isPointInArea(e)?"r"!==i||s?Ui(t,e,i,s,n,o):function(t,e,i,s){let n=[];return $i(t,i,e,(function(t,i,o){const{startAngle:a,endAngle:r}=t.getProps(["startAngle","endAngle"],s),{angle:l}=X(t,{x:e.x,y:e.y});J(l,a,r)&&n.push({element:t,datasetIndex:i,index:o})})),n}(t,e,i,n):[]}function qi(t,e,i,s,n){const o=[],a="x"===i?"inXRange":"inYRange";let r=!1;return $i(t,i,e,((t,s,l)=>{t[a]&&t[a](e[i],n)&&(o.push({element:t,datasetIndex:s,index:l}),r=r||t.inRange(e.x,e.y,n))})),s&&!r?[]:o}var Ki={evaluateInteractionItems:$i,modes:{index(t,e,i,s){const n=ve(e,t),o=i.axis||"x",a=i.includeInvisible||!1,r=i.intersect?Yi(t,n,o,s,a):Xi(t,n,o,!1,s,a),l=[];return r.length?(t.getSortedVisibleDatasetMetas().forEach((t=>{const e=r[0].index,i=t.data[e];i&&!i.skip&&l.push({element:i,datasetIndex:t.index,index:e})})),l):[]},dataset(t,e,i,s){const n=ve(e,t),o=i.axis||"xy",a=i.includeInvisible||!1;let r=i.intersect?Yi(t,n,o,s,a):Xi(t,n,o,!1,s,a);if(r.length>0){const e=r[0].datasetIndex,i=t.getDatasetMeta(e).data;r=[];for(let t=0;t<i.length;++t)r.push({element:i[t],datasetIndex:e,index:t})}return r},point:(t,e,i,s)=>Yi(t,ve(e,t),i.axis||"xy",s,i.includeInvisible||!1),nearest(t,e,i,s){const n=ve(e,t),o=i.axis||"xy",a=i.includeInvisible||!1;return Xi(t,n,o,i.intersect,s,a)},x:(t,e,i,s)=>qi(t,ve(e,t),"x",i.intersect,s),y:(t,e,i,s)=>qi(t,ve(e,t),"y",i.intersect,s)}};const Gi=["left","top","right","bottom"];function Ji(t,e){return t.filter((t=>t.pos===e))}function Zi(t,e){return t.filter((t=>-1===Gi.indexOf(t.pos)&&t.box.axis===e))}function Qi(t,e){return t.sort(((t,i)=>{const s=e?i:t,n=e?t:i;return s.weight===n.weight?s.index-n.index:s.weight-n.weight}))}function ts(t,e){const i=function(t){const e={};for(const i of t){const{stack:t,pos:s,stackWeight:n}=i;if(!t||!Gi.includes(s))continue;const o=e[t]||(e[t]={count:0,placed:0,weight:0,size:0});o.count++,o.weight+=n}return e}(t),{vBoxMaxWidth:s,hBoxMaxHeight:n}=e;let o,a,r;for(o=0,a=t.length;o<a;++o){r=t[o];const{fullSize:a}=r.box,l=i[r.stack],h=l&&r.stackWeight/l.weight;r.horizontal?(r.width=h?h*s:a&&e.availableWidth,r.height=n):(r.width=s,r.height=h?h*n:a&&e.availableHeight)}return i}function es(t,e,i,s){return Math.max(t[i],e[i])+Math.max(t[s],e[s])}function is(t,e){t.top=Math.max(t.top,e.top),t.left=Math.max(t.left,e.left),t.bottom=Math.max(t.bottom,e.bottom),t.right=Math.max(t.right,e.right)}function ss(t,e,i,s){const{pos:n,box:a}=i,r=t.maxPadding;if(!o(n)){i.size&&(t[n]-=i.size);const e=s[i.stack]||{size:0,count:1};e.size=Math.max(e.size,i.horizontal?a.height:a.width),i.size=e.size/e.count,t[n]+=i.size}a.getPadding&&is(r,a.getPadding());const l=Math.max(0,e.outerWidth-es(r,t,"left","right")),h=Math.max(0,e.outerHeight-es(r,t,"top","bottom")),c=l!==t.w,d=h!==t.h;return t.w=l,t.h=h,i.horizontal?{same:c,other:d}:{same:d,other:c}}function ns(t,e){const i=e.maxPadding;function s(t){const s={left:0,top:0,right:0,bottom:0};return t.forEach((t=>{s[t]=Math.max(e[t],i[t])})),s}return s(t?["left","right"]:["top","bottom"])}function os(t,e,i,s){const n=[];let o,a,r,l,h,c;for(o=0,a=t.length,h=0;o<a;++o){r=t[o],l=r.box,l.update(r.width||e.w,r.height||e.h,ns(r.horizontal,e));const{same:a,other:d}=ss(e,i,r,s);h|=a&&n.length,c=c||d,l.fullSize||n.push(r)}return h&&os(n,e,i,s)||c}function as(t,e,i,s,n){t.top=i,t.left=e,t.right=e+s,t.bottom=i+n,t.width=s,t.height=n}function rs(t,e,i,s){const n=i.padding;let{x:o,y:a}=e;for(const r of t){const t=r.box,l=s[r.stack]||{count:1,placed:0,weight:1},h=r.stackWeight/l.weight||1;if(r.horizontal){const s=e.w*h,o=l.size||t.height;k(l.start)&&(a=l.start),t.fullSize?as(t,n.left,a,i.outerWidth-n.right-n.left,o):as(t,e.left+l.placed,a,s,o),l.start=a,l.placed+=s,a=t.bottom}else{const s=e.h*h,a=l.size||t.width;k(l.start)&&(o=l.start),t.fullSize?as(t,o,n.top,a,i.outerHeight-n.bottom-n.top):as(t,o,e.top+l.placed,a,s),l.start=o,l.placed+=s,o=t.right}}e.x=o,e.y=a}var ls={addBox(t,e){t.boxes||(t.boxes=[]),e.fullSize=e.fullSize||!1,e.position=e.position||"top",e.weight=e.weight||0,e._layers=e._layers||function(){return[{z:0,draw(t){e.draw(t)}}]},t.boxes.push(e)},removeBox(t,e){const i=t.boxes?t.boxes.indexOf(e):-1;-1!==i&&t.boxes.splice(i,1)},configure(t,e,i){e.fullSize=i.fullSize,e.position=i.position,e.weight=i.weight},update(t,e,i,s){if(!t)return;const n=ki(t.options.layout.padding),o=Math.max(e-n.width,0),a=Math.max(i-n.height,0),r=function(t){const e=function(t){const e=[];let i,s,n,o,a,r;for(i=0,s=(t||[]).length;i<s;++i)n=t[i],({position:o,options:{stack:a,stackWeight:r=1}}=n),e.push({index:i,box:n,pos:o,horizontal:n.isHorizontal(),weight:n.weight,stack:a&&o+a,stackWeight:r});return e}(t),i=Qi(e.filter((t=>t.box.fullSize)),!0),s=Qi(Ji(e,"left"),!0),n=Qi(Ji(e,"right")),o=Qi(Ji(e,"top"),!0),a=Qi(Ji(e,"bottom")),r=Zi(e,"x"),l=Zi(e,"y");return{fullSize:i,leftAndTop:s.concat(o),rightAndBottom:n.concat(l).concat(a).concat(r),chartArea:Ji(e,"chartArea"),vertical:s.concat(n).concat(l),horizontal:o.concat(a).concat(r)}}(t.boxes),l=r.vertical,h=r.horizontal;u(t.boxes,(t=>{"function"==typeof t.beforeLayout&&t.beforeLayout()}));const c=l.reduce(((t,e)=>e.box.options&&!1===e.box.options.display?t:t+1),0)||1,d=Object.freeze({outerWidth:e,outerHeight:i,padding:n,availableWidth:o,availableHeight:a,vBoxMaxWidth:o/2/c,hBoxMaxHeight:a/2}),f=Object.assign({},n);is(f,ki(s));const g=Object.assign({maxPadding:f,w:o,h:a,x:n.left,y:n.top},n),p=ts(l.concat(h),d);os(r.fullSize,g,d,p),os(l,g,d,p),os(h,g,d,p)&&os(l,g,d,p),function(t){const e=t.maxPadding;function i(i){const s=Math.max(e[i]-t[i],0);return t[i]+=s,s}t.y+=i("top"),t.x+=i("left"),i("right"),i("bottom")}(g),rs(r.leftAndTop,g,d,p),g.x+=g.w,g.y+=g.h,rs(r.rightAndBottom,g,d,p),t.chartArea={left:g.left,top:g.top,right:g.left+g.w,bottom:g.top+g.h,height:g.h,width:g.w},u(r.chartArea,(e=>{const i=e.box;Object.assign(i,t.chartArea),i.update(g.w,g.h,{left:0,top:0,right:0,bottom:0})}))}};class hs{acquireContext(t,e){}releaseContext(t){return!1}addEventListener(t,e,i){}removeEventListener(t,e,i){}getDevicePixelRatio(){return 1}getMaximumSize(t,e,i,s){return e=Math.max(0,e||t.width),i=i||t.height,{width:e,height:Math.max(0,s?Math.floor(e/s):i)}}isAttached(t){return!0}updateConfig(t){}}class cs extends hs{acquireContext(t){return t&&t.getContext&&t.getContext("2d")||null}updateConfig(t){t.options.animation=!1}}const ds="$chartjs",us={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",pointerenter:"mouseenter",pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointerleave:"mouseout",pointerout:"mouseout"},fs=t=>null===t||""===t;const gs=!!Se&&{passive:!0};function ps(t,e,i){t&&t.canvas&&t.canvas.removeEventListener(e,i,gs)}function ms(t,e){for(const i of t)if(i===e||i.contains(e))return!0}function xs(t,e,i){const s=t.canvas,n=new MutationObserver((t=>{let e=!1;for(const i of t)e=e||ms(i.addedNodes,s),e=e&&!ms(i.removedNodes,s);e&&i()}));return n.observe(document,{childList:!0,subtree:!0}),n}function bs(t,e,i){const s=t.canvas,n=new MutationObserver((t=>{let e=!1;for(const i of t)e=e||ms(i.removedNodes,s),e=e&&!ms(i.addedNodes,s);e&&i()}));return n.observe(document,{childList:!0,subtree:!0}),n}const _s=new Map;let ys=0;function vs(){const t=window.devicePixelRatio;t!==ys&&(ys=t,_s.forEach(((e,i)=>{i.currentDevicePixelRatio!==t&&e()})))}function Ms(t,e,i){const s=t.canvas,n=s&&ge(s);if(!n)return;const o=ct(((t,e)=>{const s=n.clientWidth;i(t,e),s<n.clientWidth&&i()}),window),a=new ResizeObserver((t=>{const e=t[0],i=e.contentRect.width,s=e.contentRect.height;0===i&&0===s||o(i,s)}));return a.observe(n),function(t,e){_s.size||window.addEventListener("resize",vs),_s.set(t,e)}(t,o),a}function ws(t,e,i){i&&i.disconnect(),"resize"===e&&function(t){_s.delete(t),_s.size||window.removeEventListener("resize",vs)}(t)}function ks(t,e,i){const s=t.canvas,n=ct((e=>{null!==t.ctx&&i(function(t,e){const i=us[t.type]||t.type,{x:s,y:n}=ve(t,e);return{type:i,chart:e,native:t,x:void 0!==s?s:null,y:void 0!==n?n:null}}(e,t))}),t);return function(t,e,i){t&&t.addEventListener(e,i,gs)}(s,e,n),n}class Ss extends hs{acquireContext(t,e){const i=t&&t.getContext&&t.getContext("2d");return i&&i.canvas===t?(function(t,e){const i=t.style,s=t.getAttribute("height"),n=t.getAttribute("width");if(t[ds]={initial:{height:s,width:n,style:{display:i.display,height:i.height,width:i.width}}},i.display=i.display||"block",i.boxSizing=i.boxSizing||"border-box",fs(n)){const e=Pe(t,"width");void 0!==e&&(t.width=e)}if(fs(s))if(""===t.style.height)t.height=t.width/(e||2);else{const e=Pe(t,"height");void 0!==e&&(t.height=e)}}(t,e),i):null}releaseContext(t){const e=t.canvas;if(!e[ds])return!1;const i=e[ds].initial;["height","width"].forEach((t=>{const n=i[t];s(n)?e.removeAttribute(t):e.setAttribute(t,n)}));const n=i.style||{};return Object.keys(n).forEach((t=>{e.style[t]=n[t]})),e.width=e.width,delete e[ds],!0}addEventListener(t,e,i){this.removeEventListener(t,e);const s=t.$proxies||(t.$proxies={}),n={attach:xs,detach:bs,resize:Ms}[e]||ks;s[e]=n(t,e,i)}removeEventListener(t,e){const i=t.$proxies||(t.$proxies={}),s=i[e];if(!s)return;({attach:ws,detach:ws,resize:ws}[e]||ps)(t,e,s),i[e]=void 0}getDevicePixelRatio(){return window.devicePixelRatio}getMaximumSize(t,e,i,s){return we(t,e,i,s)}isAttached(t){const e=t&&ge(t);return!(!e||!e.isConnected)}}function Ps(t){return!fe()||"undefined"!=typeof OffscreenCanvas&&t instanceof OffscreenCanvas?cs:Ss}var Ds=Object.freeze({__proto__:null,BasePlatform:hs,BasicPlatform:cs,DomPlatform:Ss,_detectPlatform:Ps});const Cs="transparent",Os={boolean:(t,e,i)=>i>.5?e:t,color(t,e,i){const s=Qt(t||Cs),n=s.valid&&Qt(e||Cs);return n&&n.valid?n.mix(s,i).hexString():e},number:(t,e,i)=>t+(e-t)*i};class As{constructor(t,e,i,s){const n=e[i];s=Pi([t.to,s,n,t.from]);const o=Pi([t.from,n,s]);this._active=!0,this._fn=t.fn||Os[t.type||typeof o],this._easing=fi[t.easing]||fi.linear,this._start=Math.floor(Date.now()+(t.delay||0)),this._duration=this._total=Math.floor(t.duration),this._loop=!!t.loop,this._target=e,this._prop=i,this._from=o,this._to=s,this._promises=void 0}active(){return this._active}update(t,e,i){if(this._active){this._notify(!1);const s=this._target[this._prop],n=i-this._start,o=this._duration-n;this._start=i,this._duration=Math.floor(Math.max(o,t.duration)),this._total+=n,this._loop=!!t.loop,this._to=Pi([t.to,e,s,t.from]),this._from=Pi([t.from,s,e])}}cancel(){this._active&&(this.tick(Date.now()),this._active=!1,this._notify(!1))}tick(t){const e=t-this._start,i=this._duration,s=this._prop,n=this._from,o=this._loop,a=this._to;let r;if(this._active=n!==a&&(o||e<i),!this._active)return this._target[s]=a,void this._notify(!0);e<0?this._target[s]=n:(r=e/i%2,r=o&&r>1?2-r:r,r=this._easing(Math.min(1,Math.max(0,r))),this._target[s]=this._fn(n,a,r))}wait(){const t=this._promises||(this._promises=[]);return new Promise(((e,i)=>{t.push({res:e,rej:i})}))}_notify(t){const e=t?"res":"rej",i=this._promises||[];for(let t=0;t<i.length;t++)i[t][e]()}}class Ts{constructor(t,e){this._chart=t,this._properties=new Map,this.configure(e)}configure(t){if(!o(t))return;const e=Object.keys(ue.animation),i=this._properties;Object.getOwnPropertyNames(t).forEach((s=>{const a=t[s];if(!o(a))return;const r={};for(const t of e)r[t]=a[t];(n(a.properties)&&a.properties||[s]).forEach((t=>{t!==s&&i.has(t)||i.set(t,r)}))}))}_animateOptions(t,e){const i=e.options,s=function(t,e){if(!e)return;let i=t.options;if(!i)return void(t.options=e);i.$shared&&(t.options=i=Object.assign({},i,{$shared:!1,$animations:{}}));return i}(t,i);if(!s)return[];const n=this._createAnimations(s,i);return i.$shared&&function(t,e){const i=[],s=Object.keys(e);for(let e=0;e<s.length;e++){const n=t[s[e]];n&&n.active()&&i.push(n.wait())}return Promise.all(i)}(t.options.$animations,i).then((()=>{t.options=i}),(()=>{})),n}_createAnimations(t,e){const i=this._properties,s=[],n=t.$animations||(t.$animations={}),o=Object.keys(e),a=Date.now();let r;for(r=o.length-1;r>=0;--r){const l=o[r];if("$"===l.charAt(0))continue;if("options"===l){s.push(...this._animateOptions(t,e));continue}const h=e[l];let c=n[l];const d=i.get(l);if(c){if(d&&c.active()){c.update(d,h,a);continue}c.cancel()}d&&d.duration?(n[l]=c=new As(d,t,l,h),s.push(c)):t[l]=h}return s}update(t,e){if(0===this._properties.size)return void Object.assign(t,e);const i=this._createAnimations(t,e);return i.length?(bt.add(this._chart,i),!0):void 0}}function Ls(t,e){const i=t&&t.options||{},s=i.reverse,n=void 0===i.min?e:0,o=void 0===i.max?e:0;return{start:s?o:n,end:s?n:o}}function Es(t,e){const i=[],s=t._getSortedDatasetMetas(e);let n,o;for(n=0,o=s.length;n<o;++n)i.push(s[n].index);return i}function Rs(t,e,i,s={}){const n=t.keys,o="single"===s.mode;let r,l,h,c;if(null===e)return;let d=!1;for(r=0,l=n.length;r<l;++r){if(h=+n[r],h===i){if(d=!0,s.all)continue;break}c=t.values[h],a(c)&&(o||0===e||F(e)===F(c))&&(e+=c)}return d||s.all?e:0}function Is(t,e){const i=t&&t.options.stacked;return i||void 0===i&&void 0!==e.stack}function zs(t,e,i){const s=t[e]||(t[e]={});return s[i]||(s[i]={})}function Fs(t,e,i,s){for(const n of e.getMatchingVisibleMetas(s).reverse()){const e=t[n.index];if(i&&e>0||!i&&e<0)return n.index}return null}function Vs(t,e){const{chart:i,_cachedMeta:s}=t,n=i._stacks||(i._stacks={}),{iScale:o,vScale:a,index:r}=s,l=o.axis,h=a.axis,c=function(t,e,i){return\`\${t.id}.\${e.id}.\${i.stack||i.type}\`}(o,a,s),d=e.length;let u;for(let t=0;t<d;++t){const i=e[t],{[l]:o,[h]:d}=i;u=(i._stacks||(i._stacks={}))[h]=zs(n,c,o),u[r]=d,u._top=Fs(u,a,!0,s.type),u._bottom=Fs(u,a,!1,s.type);(u._visualValues||(u._visualValues={}))[r]=d}}function Bs(t,e){const i=t.scales;return Object.keys(i).filter((t=>i[t].axis===e)).shift()}function Ws(t,e){const i=t.controller.index,s=t.vScale&&t.vScale.axis;if(s){e=e||t._parsed;for(const t of e){const e=t._stacks;if(!e||void 0===e[s]||void 0===e[s][i])return;delete e[s][i],void 0!==e[s]._visualValues&&void 0!==e[s]._visualValues[i]&&delete e[s]._visualValues[i]}}}const Ns=t=>"reset"===t||"none"===t,Hs=(t,e)=>e?t:Object.assign({},t);class js{static defaults={};static datasetElementType=null;static dataElementType=null;constructor(t,e){this.chart=t,this._ctx=t.ctx,this.index=e,this._cachedDataOpts={},this._cachedMeta=this.getMeta(),this._type=this._cachedMeta.type,this.options=void 0,this._parsing=!1,this._data=void 0,this._objectData=void 0,this._sharedOptions=void 0,this._drawStart=void 0,this._drawCount=void 0,this.enableOptionSharing=!1,this.supportsDecimation=!1,this.$context=void 0,this._syncList=[],this.datasetElementType=new.target.datasetElementType,this.dataElementType=new.target.dataElementType,this.initialize()}initialize(){const t=this._cachedMeta;this.configure(),this.linkScales(),t._stacked=Is(t.vScale,t),this.addElements(),this.options.fill&&!this.chart.isPluginEnabled("filler")&&console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options")}updateIndex(t){this.index!==t&&Ws(this._cachedMeta),this.index=t}linkScales(){const t=this.chart,e=this._cachedMeta,i=this.getDataset(),s=(t,e,i,s)=>"x"===t?e:"r"===t?s:i,n=e.xAxisID=l(i.xAxisID,Bs(t,"x")),o=e.yAxisID=l(i.yAxisID,Bs(t,"y")),a=e.rAxisID=l(i.rAxisID,Bs(t,"r")),r=e.indexAxis,h=e.iAxisID=s(r,n,o,a),c=e.vAxisID=s(r,o,n,a);e.xScale=this.getScaleForId(n),e.yScale=this.getScaleForId(o),e.rScale=this.getScaleForId(a),e.iScale=this.getScaleForId(h),e.vScale=this.getScaleForId(c)}getDataset(){return this.chart.data.datasets[this.index]}getMeta(){return this.chart.getDatasetMeta(this.index)}getScaleForId(t){return this.chart.scales[t]}_getOtherScale(t){const e=this._cachedMeta;return t===e.iScale?e.vScale:e.iScale}reset(){this._update("reset")}_destroy(){const t=this._cachedMeta;this._data&&rt(this._data,this),t._stacked&&Ws(t)}_dataCheck(){const t=this.getDataset(),e=t.data||(t.data=[]),i=this._data;if(o(e)){const t=this._cachedMeta;this._data=function(t,e){const{iScale:i,vScale:s}=e,n="x"===i.axis?"x":"y",o="x"===s.axis?"x":"y",a=Object.keys(t),r=new Array(a.length);let l,h,c;for(l=0,h=a.length;l<h;++l)c=a[l],r[l]={[n]:c,[o]:t[c]};return r}(e,t)}else if(i!==e){if(i){rt(i,this);const t=this._cachedMeta;Ws(t),t._parsed=[]}e&&Object.isExtensible(e)&&at(e,this),this._syncList=[],this._data=e}}addElements(){const t=this._cachedMeta;this._dataCheck(),this.datasetElementType&&(t.dataset=new this.datasetElementType)}buildOrUpdateElements(t){const e=this._cachedMeta,i=this.getDataset();let s=!1;this._dataCheck();const n=e._stacked;e._stacked=Is(e.vScale,e),e.stack!==i.stack&&(s=!0,Ws(e),e.stack=i.stack),this._resyncElements(t),(s||n!==e._stacked)&&(Vs(this,e._parsed),e._stacked=Is(e.vScale,e))}configure(){const t=this.chart.config,e=t.datasetScopeKeys(this._type),i=t.getOptionScopes(this.getDataset(),e,!0);this.options=t.createResolver(i,this.getContext()),this._parsing=this.options.parsing,this._cachedDataOpts={}}parse(t,e){const{_cachedMeta:i,_data:s}=this,{iScale:a,_stacked:r}=i,l=a.axis;let h,c,d,u=0===t&&e===s.length||i._sorted,f=t>0&&i._parsed[t-1];if(!1===this._parsing)i._parsed=s,i._sorted=!0,d=s;else{d=n(s[t])?this.parseArrayData(i,s,t,e):o(s[t])?this.parseObjectData(i,s,t,e):this.parsePrimitiveData(i,s,t,e);const a=()=>null===c[l]||f&&c[l]<f[l];for(h=0;h<e;++h)i._parsed[h+t]=c=d[h],u&&(a()&&(u=!1),f=c);i._sorted=u}r&&Vs(this,d)}parsePrimitiveData(t,e,i,s){const{iScale:n,vScale:o}=t,a=n.axis,r=o.axis,l=n.getLabels(),h=n===o,c=new Array(s);let d,u,f;for(d=0,u=s;d<u;++d)f=d+i,c[d]={[a]:h||n.parse(l[f],f),[r]:o.parse(e[f],f)};return c}parseArrayData(t,e,i,s){const{xScale:n,yScale:o}=t,a=new Array(s);let r,l,h,c;for(r=0,l=s;r<l;++r)h=r+i,c=e[h],a[r]={x:n.parse(c[0],h),y:o.parse(c[1],h)};return a}parseObjectData(t,e,i,s){const{xScale:n,yScale:o}=t,{xAxisKey:a="x",yAxisKey:r="y"}=this._parsing,l=new Array(s);let h,c,d,u;for(h=0,c=s;h<c;++h)d=h+i,u=e[d],l[h]={x:n.parse(M(u,a),d),y:o.parse(M(u,r),d)};return l}getParsed(t){return this._cachedMeta._parsed[t]}getDataElement(t){return this._cachedMeta.data[t]}applyStack(t,e,i){const s=this.chart,n=this._cachedMeta,o=e[t.axis];return Rs({keys:Es(s,!0),values:e._stacks[t.axis]._visualValues},o,n.index,{mode:i})}updateRangeFromParsed(t,e,i,s){const n=i[e.axis];let o=null===n?NaN:n;const a=s&&i._stacks[e.axis];s&&a&&(s.values=a,o=Rs(s,n,this._cachedMeta.index)),t.min=Math.min(t.min,o),t.max=Math.max(t.max,o)}getMinMax(t,e){const i=this._cachedMeta,s=i._parsed,n=i._sorted&&t===i.iScale,o=s.length,r=this._getOtherScale(t),l=((t,e,i)=>t&&!e.hidden&&e._stacked&&{keys:Es(i,!0),values:null})(e,i,this.chart),h={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY},{min:c,max:d}=function(t){const{min:e,max:i,minDefined:s,maxDefined:n}=t.getUserBounds();return{min:s?e:Number.NEGATIVE_INFINITY,max:n?i:Number.POSITIVE_INFINITY}}(r);let u,f;function g(){f=s[u];const e=f[r.axis];return!a(f[t.axis])||c>e||d<e}for(u=0;u<o&&(g()||(this.updateRangeFromParsed(h,t,f,l),!n));++u);if(n)for(u=o-1;u>=0;--u)if(!g()){this.updateRangeFromParsed(h,t,f,l);break}return h}getAllParsedValues(t){const e=this._cachedMeta._parsed,i=[];let s,n,o;for(s=0,n=e.length;s<n;++s)o=e[s][t.axis],a(o)&&i.push(o);return i}getMaxOverflow(){return!1}getLabelAndValue(t){const e=this._cachedMeta,i=e.iScale,s=e.vScale,n=this.getParsed(t);return{label:i?""+i.getLabelForValue(n[i.axis]):"",value:s?""+s.getLabelForValue(n[s.axis]):""}}_update(t){const e=this._cachedMeta;this.update(t||"default"),e._clip=function(t){let e,i,s,n;return o(t)?(e=t.top,i=t.right,s=t.bottom,n=t.left):e=i=s=n=t,{top:e,right:i,bottom:s,left:n,disabled:!1===t}}(l(this.options.clip,function(t,e,i){if(!1===i)return!1;const s=Ls(t,i),n=Ls(e,i);return{top:n.end,right:s.end,bottom:n.start,left:s.start}}(e.xScale,e.yScale,this.getMaxOverflow())))}update(t){}draw(){const t=this._ctx,e=this.chart,i=this._cachedMeta,s=i.data||[],n=e.chartArea,o=[],a=this._drawStart||0,r=this._drawCount||s.length-a,l=this.options.drawActiveElementsOnTop;let h;for(i.dataset&&i.dataset.draw(t,n,a,r),h=a;h<a+r;++h){const e=s[h];e.hidden||(e.active&&l?o.push(e):e.draw(t,n))}for(h=0;h<o.length;++h)o[h].draw(t,n)}getStyle(t,e){const i=e?"active":"default";return void 0===t&&this._cachedMeta.dataset?this.resolveDatasetElementOptions(i):this.resolveDataElementOptions(t||0,i)}getContext(t,e,i){const s=this.getDataset();let n;if(t>=0&&t<this._cachedMeta.data.length){const e=this._cachedMeta.data[t];n=e.$context||(e.$context=function(t,e,i){return Ci(t,{active:!1,dataIndex:e,parsed:void 0,raw:void 0,element:i,index:e,mode:"default",type:"data"})}(this.getContext(),t,e)),n.parsed=this.getParsed(t),n.raw=s.data[t],n.index=n.dataIndex=t}else n=this.$context||(this.$context=function(t,e){return Ci(t,{active:!1,dataset:void 0,datasetIndex:e,index:e,mode:"default",type:"dataset"})}(this.chart.getContext(),this.index)),n.dataset=s,n.index=n.datasetIndex=this.index;return n.active=!!e,n.mode=i,n}resolveDatasetElementOptions(t){return this._resolveElementOptions(this.datasetElementType.id,t)}resolveDataElementOptions(t,e){return this._resolveElementOptions(this.dataElementType.id,e,t)}_resolveElementOptions(t,e="default",i){const s="active"===e,n=this._cachedDataOpts,o=t+"-"+e,a=n[o],r=this.enableOptionSharing&&k(i);if(a)return Hs(a,r);const l=this.chart.config,h=l.datasetElementScopeKeys(this._type,t),c=s?[\`\${t}Hover\`,"hover",t,""]:[t,""],d=l.getOptionScopes(this.getDataset(),h),u=Object.keys(ue.elements[t]),f=l.resolveNamedOptions(d,u,(()=>this.getContext(i,s,e)),c);return f.$shared&&(f.$shared=r,n[o]=Object.freeze(Hs(f,r))),f}_resolveAnimations(t,e,i){const s=this.chart,n=this._cachedDataOpts,o=\`animation-\${e}\`,a=n[o];if(a)return a;let r;if(!1!==s.options.animation){const s=this.chart.config,n=s.datasetAnimationScopeKeys(this._type,e),o=s.getOptionScopes(this.getDataset(),n);r=s.createResolver(o,this.getContext(t,i,e))}const l=new Ts(s,r&&r.animations);return r&&r._cacheable&&(n[o]=Object.freeze(l)),l}getSharedOptions(t){if(t.$shared)return this._sharedOptions||(this._sharedOptions=Object.assign({},t))}includeOptions(t,e){return!e||Ns(t)||this.chart._animationsDisabled}_getSharedOptions(t,e){const i=this.resolveDataElementOptions(t,e),s=this._sharedOptions,n=this.getSharedOptions(i),o=this.includeOptions(e,n)||n!==s;return this.updateSharedOptions(n,e,i),{sharedOptions:n,includeOptions:o}}updateElement(t,e,i,s){Ns(s)?Object.assign(t,i):this._resolveAnimations(e,s).update(t,i)}updateSharedOptions(t,e,i){t&&!Ns(e)&&this._resolveAnimations(void 0,e).update(t,i)}_setStyle(t,e,i,s){t.active=s;const n=this.getStyle(e,s);this._resolveAnimations(e,i,s).update(t,{options:!s&&this.getSharedOptions(n)||n})}removeHoverStyle(t,e,i){this._setStyle(t,i,"active",!1)}setHoverStyle(t,e,i){this._setStyle(t,i,"active",!0)}_removeDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!1)}_setDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!0)}_resyncElements(t){const e=this._data,i=this._cachedMeta.data;for(const[t,e,i]of this._syncList)this[t](e,i);this._syncList=[];const s=i.length,n=e.length,o=Math.min(n,s);o&&this.parse(0,o),n>s?this._insertElements(s,n-s,t):n<s&&this._removeElements(n,s-n)}_insertElements(t,e,i=!0){const s=this._cachedMeta,n=s.data,o=t+e;let a;const r=t=>{for(t.length+=e,a=t.length-1;a>=o;a--)t[a]=t[a-e]};for(r(n),a=t;a<o;++a)n[a]=new this.dataElementType;this._parsing&&r(s._parsed),this.parse(t,e),i&&this.updateElements(n,t,e,"reset")}updateElements(t,e,i,s){}_removeElements(t,e){const i=this._cachedMeta;if(this._parsing){const s=i._parsed.splice(t,e);i._stacked&&Ws(i,s)}i.data.splice(t,e)}_sync(t){if(this._parsing)this._syncList.push(t);else{const[e,i,s]=t;this[e](i,s)}this.chart._dataChanges.push([this.index,...t])}_onDataPush(){const t=arguments.length;this._sync(["_insertElements",this.getDataset().data.length-t,t])}_onDataPop(){this._sync(["_removeElements",this._cachedMeta.data.length-1,1])}_onDataShift(){this._sync(["_removeElements",0,1])}_onDataSplice(t,e){e&&this._sync(["_removeElements",t,e]);const i=arguments.length-2;i&&this._sync(["_insertElements",t,i])}_onDataUnshift(){this._sync(["_insertElements",0,arguments.length])}}class $s{static defaults={};static defaultRoutes=void 0;x;y;active=!1;options;$animations;tooltipPosition(t){const{x:e,y:i}=this.getProps(["x","y"],t);return{x:e,y:i}}hasValue(){return N(this.x)&&N(this.y)}getProps(t,e){const i=this.$animations;if(!e||!i)return this;const s={};return t.forEach((t=>{s[t]=i[t]&&i[t].active()?i[t]._to:this[t]})),s}}function Ys(t,e){const i=t.options.ticks,n=function(t){const e=t.options.offset,i=t._tickSize(),s=t._length/i+(e?0:1),n=t._maxLength/i;return Math.floor(Math.min(s,n))}(t),o=Math.min(i.maxTicksLimit||n,n),a=i.major.enabled?function(t){const e=[];let i,s;for(i=0,s=t.length;i<s;i++)t[i].major&&e.push(i);return e}(e):[],r=a.length,l=a[0],h=a[r-1],c=[];if(r>o)return function(t,e,i,s){let n,o=0,a=i[0];for(s=Math.ceil(s),n=0;n<t.length;n++)n===a&&(e.push(t[n]),o++,a=i[o*s])}(e,c,a,r/o),c;const d=function(t,e,i){const s=function(t){const e=t.length;let i,s;if(e<2)return!1;for(s=t[0],i=1;i<e;++i)if(t[i]-t[i-1]!==s)return!1;return s}(t),n=e.length/i;if(!s)return Math.max(n,1);const o=W(s);for(let t=0,e=o.length-1;t<e;t++){const e=o[t];if(e>n)return e}return Math.max(n,1)}(a,e,o);if(r>0){let t,i;const n=r>1?Math.round((h-l)/(r-1)):null;for(Us(e,c,d,s(n)?0:l-n,l),t=0,i=r-1;t<i;t++)Us(e,c,d,a[t],a[t+1]);return Us(e,c,d,h,s(n)?e.length:h+n),c}return Us(e,c,d),c}function Us(t,e,i,s,n){const o=l(s,0),a=Math.min(l(n,t.length),t.length);let r,h,c,d=0;for(i=Math.ceil(i),n&&(r=n-s,i=r/Math.floor(r/i)),c=o;c<0;)d++,c=Math.round(o+d*i);for(h=Math.max(o,0);h<a;h++)h===c&&(e.push(t[h]),d++,c=Math.round(o+d*i))}const Xs=(t,e,i)=>"top"===e||"left"===e?t[e]+i:t[e]-i,qs=(t,e)=>Math.min(e||t,t);function Ks(t,e){const i=[],s=t.length/e,n=t.length;let o=0;for(;o<n;o+=s)i.push(t[Math.floor(o)]);return i}function Gs(t,e,i){const s=t.ticks.length,n=Math.min(e,s-1),o=t._startPixel,a=t._endPixel,r=1e-6;let l,h=t.getPixelForTick(n);if(!(i&&(l=1===s?Math.max(h-o,a-h):0===e?(t.getPixelForTick(1)-h)/2:(h-t.getPixelForTick(n-1))/2,h+=n<e?l:-l,h<o-r||h>a+r)))return h}function Js(t){return t.drawTicks?t.tickLength:0}function Zs(t,e){if(!t.display)return 0;const i=Si(t.font,e),s=ki(t.padding);return(n(t.text)?t.text.length:1)*i.lineHeight+s.height}function Qs(t,e,i){let s=ut(t);return(i&&"right"!==e||!i&&"right"===e)&&(s=(t=>"left"===t?"right":"right"===t?"left":t)(s)),s}class tn extends $s{constructor(t){super(),this.id=t.id,this.type=t.type,this.options=void 0,this.ctx=t.ctx,this.chart=t.chart,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this._margins={left:0,right:0,top:0,bottom:0},this.maxWidth=void 0,this.maxHeight=void 0,this.paddingTop=void 0,this.paddingBottom=void 0,this.paddingLeft=void 0,this.paddingRight=void 0,this.axis=void 0,this.labelRotation=void 0,this.min=void 0,this.max=void 0,this._range=void 0,this.ticks=[],this._gridLineItems=null,this._labelItems=null,this._labelSizes=null,this._length=0,this._maxLength=0,this._longestTextCache={},this._startPixel=void 0,this._endPixel=void 0,this._reversePixels=!1,this._userMax=void 0,this._userMin=void 0,this._suggestedMax=void 0,this._suggestedMin=void 0,this._ticksLength=0,this._borderValue=0,this._cache={},this._dataLimitsCached=!1,this.$context=void 0}init(t){this.options=t.setContext(this.getContext()),this.axis=t.axis,this._userMin=this.parse(t.min),this._userMax=this.parse(t.max),this._suggestedMin=this.parse(t.suggestedMin),this._suggestedMax=this.parse(t.suggestedMax)}parse(t,e){return t}getUserBounds(){let{_userMin:t,_userMax:e,_suggestedMin:i,_suggestedMax:s}=this;return t=r(t,Number.POSITIVE_INFINITY),e=r(e,Number.NEGATIVE_INFINITY),i=r(i,Number.POSITIVE_INFINITY),s=r(s,Number.NEGATIVE_INFINITY),{min:r(t,i),max:r(e,s),minDefined:a(t),maxDefined:a(e)}}getMinMax(t){let e,{min:i,max:s,minDefined:n,maxDefined:o}=this.getUserBounds();if(n&&o)return{min:i,max:s};const a=this.getMatchingVisibleMetas();for(let r=0,l=a.length;r<l;++r)e=a[r].controller.getMinMax(this,t),n||(i=Math.min(i,e.min)),o||(s=Math.max(s,e.max));return i=o&&i>s?s:i,s=n&&i>s?i:s,{min:r(i,r(s,i)),max:r(s,r(i,s))}}getPadding(){return{left:this.paddingLeft||0,top:this.paddingTop||0,right:this.paddingRight||0,bottom:this.paddingBottom||0}}getTicks(){return this.ticks}getLabels(){const t=this.chart.data;return this.options.labels||(this.isHorizontal()?t.xLabels:t.yLabels)||t.labels||[]}getLabelItems(t=this.chart.chartArea){return this._labelItems||(this._labelItems=this._computeLabelItems(t))}beforeLayout(){this._cache={},this._dataLimitsCached=!1}beforeUpdate(){d(this.options.beforeUpdate,[this])}update(t,e,i){const{beginAtZero:s,grace:n,ticks:o}=this.options,a=o.sampleSize;this.beforeUpdate(),this.maxWidth=t,this.maxHeight=e,this._margins=i=Object.assign({left:0,right:0,top:0,bottom:0},i),this.ticks=null,this._labelSizes=null,this._gridLineItems=null,this._labelItems=null,this.beforeSetDimensions(),this.setDimensions(),this.afterSetDimensions(),this._maxLength=this.isHorizontal()?this.width+i.left+i.right:this.height+i.top+i.bottom,this._dataLimitsCached||(this.beforeDataLimits(),this.determineDataLimits(),this.afterDataLimits(),this._range=Di(this,n,s),this._dataLimitsCached=!0),this.beforeBuildTicks(),this.ticks=this.buildTicks()||[],this.afterBuildTicks();const r=a<this.ticks.length;this._convertTicksToLabels(r?Ks(this.ticks,a):this.ticks),this.configure(),this.beforeCalculateLabelRotation(),this.calculateLabelRotation(),this.afterCalculateLabelRotation(),o.display&&(o.autoSkip||"auto"===o.source)&&(this.ticks=Ys(this,this.ticks),this._labelSizes=null,this.afterAutoSkip()),r&&this._convertTicksToLabels(this.ticks),this.beforeFit(),this.fit(),this.afterFit(),this.afterUpdate()}configure(){let t,e,i=this.options.reverse;this.isHorizontal()?(t=this.left,e=this.right):(t=this.top,e=this.bottom,i=!i),this._startPixel=t,this._endPixel=e,this._reversePixels=i,this._length=e-t,this._alignToPixels=this.options.alignToPixels}afterUpdate(){d(this.options.afterUpdate,[this])}beforeSetDimensions(){d(this.options.beforeSetDimensions,[this])}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=0,this.right=this.width):(this.height=this.maxHeight,this.top=0,this.bottom=this.height),this.paddingLeft=0,this.paddingTop=0,this.paddingRight=0,this.paddingBottom=0}afterSetDimensions(){d(this.options.afterSetDimensions,[this])}_callHooks(t){this.chart.notifyPlugins(t,this.getContext()),d(this.options[t],[this])}beforeDataLimits(){this._callHooks("beforeDataLimits")}determineDataLimits(){}afterDataLimits(){this._callHooks("afterDataLimits")}beforeBuildTicks(){this._callHooks("beforeBuildTicks")}buildTicks(){return[]}afterBuildTicks(){this._callHooks("afterBuildTicks")}beforeTickToLabelConversion(){d(this.options.beforeTickToLabelConversion,[this])}generateTickLabels(t){const e=this.options.ticks;let i,s,n;for(i=0,s=t.length;i<s;i++)n=t[i],n.label=d(e.callback,[n.value,i,t],this)}afterTickToLabelConversion(){d(this.options.afterTickToLabelConversion,[this])}beforeCalculateLabelRotation(){d(this.options.beforeCalculateLabelRotation,[this])}calculateLabelRotation(){const t=this.options,e=t.ticks,i=qs(this.ticks.length,t.ticks.maxTicksLimit),s=e.minRotation||0,n=e.maxRotation;let o,a,r,l=s;if(!this._isVisible()||!e.display||s>=n||i<=1||!this.isHorizontal())return void(this.labelRotation=s);const h=this._getLabelSizes(),c=h.widest.width,d=h.highest.height,u=Z(this.chart.width-c,0,this.maxWidth);o=t.offset?this.maxWidth/i:u/(i-1),c+6>o&&(o=u/(i-(t.offset?.5:1)),a=this.maxHeight-Js(t.grid)-e.padding-Zs(t.title,this.chart.options.font),r=Math.sqrt(c*c+d*d),l=Y(Math.min(Math.asin(Z((h.highest.height+6)/o,-1,1)),Math.asin(Z(a/r,-1,1))-Math.asin(Z(d/r,-1,1)))),l=Math.max(s,Math.min(n,l))),this.labelRotation=l}afterCalculateLabelRotation(){d(this.options.afterCalculateLabelRotation,[this])}afterAutoSkip(){}beforeFit(){d(this.options.beforeFit,[this])}fit(){const t={width:0,height:0},{chart:e,options:{ticks:i,title:s,grid:n}}=this,o=this._isVisible(),a=this.isHorizontal();if(o){const o=Zs(s,e.options.font);if(a?(t.width=this.maxWidth,t.height=Js(n)+o):(t.height=this.maxHeight,t.width=Js(n)+o),i.display&&this.ticks.length){const{first:e,last:s,widest:n,highest:o}=this._getLabelSizes(),r=2*i.padding,l=$(this.labelRotation),h=Math.cos(l),c=Math.sin(l);if(a){const e=i.mirror?0:c*n.width+h*o.height;t.height=Math.min(this.maxHeight,t.height+e+r)}else{const e=i.mirror?0:h*n.width+c*o.height;t.width=Math.min(this.maxWidth,t.width+e+r)}this._calculatePadding(e,s,c,h)}}this._handleMargins(),a?(this.width=this._length=e.width-this._margins.left-this._margins.right,this.height=t.height):(this.width=t.width,this.height=this._length=e.height-this._margins.top-this._margins.bottom)}_calculatePadding(t,e,i,s){const{ticks:{align:n,padding:o},position:a}=this.options,r=0!==this.labelRotation,l="top"!==a&&"x"===this.axis;if(this.isHorizontal()){const a=this.getPixelForTick(0)-this.left,h=this.right-this.getPixelForTick(this.ticks.length-1);let c=0,d=0;r?l?(c=s*t.width,d=i*e.height):(c=i*t.height,d=s*e.width):"start"===n?d=e.width:"end"===n?c=t.width:"inner"!==n&&(c=t.width/2,d=e.width/2),this.paddingLeft=Math.max((c-a+o)*this.width/(this.width-a),0),this.paddingRight=Math.max((d-h+o)*this.width/(this.width-h),0)}else{let i=e.height/2,s=t.height/2;"start"===n?(i=0,s=t.height):"end"===n&&(i=e.height,s=0),this.paddingTop=i+o,this.paddingBottom=s+o}}_handleMargins(){this._margins&&(this._margins.left=Math.max(this.paddingLeft,this._margins.left),this._margins.top=Math.max(this.paddingTop,this._margins.top),this._margins.right=Math.max(this.paddingRight,this._margins.right),this._margins.bottom=Math.max(this.paddingBottom,this._margins.bottom))}afterFit(){d(this.options.afterFit,[this])}isHorizontal(){const{axis:t,position:e}=this.options;return"top"===e||"bottom"===e||"x"===t}isFullSize(){return this.options.fullSize}_convertTicksToLabels(t){let e,i;for(this.beforeTickToLabelConversion(),this.generateTickLabels(t),e=0,i=t.length;e<i;e++)s(t[e].label)&&(t.splice(e,1),i--,e--);this.afterTickToLabelConversion()}_getLabelSizes(){let t=this._labelSizes;if(!t){const e=this.options.ticks.sampleSize;let i=this.ticks;e<i.length&&(i=Ks(i,e)),this._labelSizes=t=this._computeLabelSizes(i,i.length,this.options.ticks.maxTicksLimit)}return t}_computeLabelSizes(t,e,i){const{ctx:o,_longestTextCache:a}=this,r=[],l=[],h=Math.floor(e/qs(e,i));let c,d,f,g,p,m,x,b,_,y,v,M=0,w=0;for(c=0;c<e;c+=h){if(g=t[c].label,p=this._resolveTickFontOptions(c),o.font=m=p.string,x=a[m]=a[m]||{data:{},gc:[]},b=p.lineHeight,_=y=0,s(g)||n(g)){if(n(g))for(d=0,f=g.length;d<f;++d)v=g[d],s(v)||n(v)||(_=Ce(o,x.data,x.gc,_,v),y+=b)}else _=Ce(o,x.data,x.gc,_,g),y=b;r.push(_),l.push(y),M=Math.max(_,M),w=Math.max(y,w)}!function(t,e){u(t,(t=>{const i=t.gc,s=i.length/2;let n;if(s>e){for(n=0;n<s;++n)delete t.data[i[n]];i.splice(0,s)}}))}(a,e);const k=r.indexOf(M),S=l.indexOf(w),P=t=>({width:r[t]||0,height:l[t]||0});return{first:P(0),last:P(e-1),widest:P(k),highest:P(S),widths:r,heights:l}}getLabelForValue(t){return t}getPixelForValue(t,e){return NaN}getValueForPixel(t){}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getPixelForDecimal(t){this._reversePixels&&(t=1-t);const e=this._startPixel+t*this._length;return Q(this._alignToPixels?Ae(this.chart,e,0):e)}getDecimalForPixel(t){const e=(t-this._startPixel)/this._length;return this._reversePixels?1-e:e}getBasePixel(){return this.getPixelForValue(this.getBaseValue())}getBaseValue(){const{min:t,max:e}=this;return t<0&&e<0?e:t>0&&e>0?t:0}getContext(t){const e=this.ticks||[];if(t>=0&&t<e.length){const i=e[t];return i.$context||(i.$context=function(t,e,i){return Ci(t,{tick:i,index:e,type:"tick"})}(this.getContext(),t,i))}return this.$context||(this.$context=Ci(this.chart.getContext(),{scale:this,type:"scale"}))}_tickSize(){const t=this.options.ticks,e=$(this.labelRotation),i=Math.abs(Math.cos(e)),s=Math.abs(Math.sin(e)),n=this._getLabelSizes(),o=t.autoSkipPadding||0,a=n?n.widest.width+o:0,r=n?n.highest.height+o:0;return this.isHorizontal()?r*i>a*s?a/i:r/s:r*s<a*i?r/i:a/s}_isVisible(){const t=this.options.display;return"auto"!==t?!!t:this.getMatchingVisibleMetas().length>0}_computeGridLineItems(t){const e=this.axis,i=this.chart,s=this.options,{grid:n,position:a,border:r}=s,h=n.offset,c=this.isHorizontal(),d=this.ticks.length+(h?1:0),u=Js(n),f=[],g=r.setContext(this.getContext()),p=g.display?g.width:0,m=p/2,x=function(t){return Ae(i,t,p)};let b,_,y,v,M,w,k,S,P,D,C,O;if("top"===a)b=x(this.bottom),w=this.bottom-u,S=b-m,D=x(t.top)+m,O=t.bottom;else if("bottom"===a)b=x(this.top),D=t.top,O=x(t.bottom)-m,w=b+m,S=this.top+u;else if("left"===a)b=x(this.right),M=this.right-u,k=b-m,P=x(t.left)+m,C=t.right;else if("right"===a)b=x(this.left),P=t.left,C=x(t.right)-m,M=b+m,k=this.left+u;else if("x"===e){if("center"===a)b=x((t.top+t.bottom)/2+.5);else if(o(a)){const t=Object.keys(a)[0],e=a[t];b=x(this.chart.scales[t].getPixelForValue(e))}D=t.top,O=t.bottom,w=b+m,S=w+u}else if("y"===e){if("center"===a)b=x((t.left+t.right)/2);else if(o(a)){const t=Object.keys(a)[0],e=a[t];b=x(this.chart.scales[t].getPixelForValue(e))}M=b-m,k=M-u,P=t.left,C=t.right}const A=l(s.ticks.maxTicksLimit,d),T=Math.max(1,Math.ceil(d/A));for(_=0;_<d;_+=T){const t=this.getContext(_),e=n.setContext(t),s=r.setContext(t),o=e.lineWidth,a=e.color,l=s.dash||[],d=s.dashOffset,u=e.tickWidth,g=e.tickColor,p=e.tickBorderDash||[],m=e.tickBorderDashOffset;y=Gs(this,_,h),void 0!==y&&(v=Ae(i,y,o),c?M=k=P=C=v:w=S=D=O=v,f.push({tx1:M,ty1:w,tx2:k,ty2:S,x1:P,y1:D,x2:C,y2:O,width:o,color:a,borderDash:l,borderDashOffset:d,tickWidth:u,tickColor:g,tickBorderDash:p,tickBorderDashOffset:m}))}return this._ticksLength=d,this._borderValue=b,f}_computeLabelItems(t){const e=this.axis,i=this.options,{position:s,ticks:a}=i,r=this.isHorizontal(),l=this.ticks,{align:h,crossAlign:c,padding:d,mirror:u}=a,f=Js(i.grid),g=f+d,p=u?-d:g,m=-$(this.labelRotation),x=[];let b,_,y,v,M,w,k,S,P,D,C,O,A="middle";if("top"===s)w=this.bottom-p,k=this._getXAxisLabelAlignment();else if("bottom"===s)w=this.top+p,k=this._getXAxisLabelAlignment();else if("left"===s){const t=this._getYAxisLabelAlignment(f);k=t.textAlign,M=t.x}else if("right"===s){const t=this._getYAxisLabelAlignment(f);k=t.textAlign,M=t.x}else if("x"===e){if("center"===s)w=(t.top+t.bottom)/2+g;else if(o(s)){const t=Object.keys(s)[0],e=s[t];w=this.chart.scales[t].getPixelForValue(e)+g}k=this._getXAxisLabelAlignment()}else if("y"===e){if("center"===s)M=(t.left+t.right)/2-g;else if(o(s)){const t=Object.keys(s)[0],e=s[t];M=this.chart.scales[t].getPixelForValue(e)}k=this._getYAxisLabelAlignment(f).textAlign}"y"===e&&("start"===h?A="top":"end"===h&&(A="bottom"));const T=this._getLabelSizes();for(b=0,_=l.length;b<_;++b){y=l[b],v=y.label;const t=a.setContext(this.getContext(b));S=this.getPixelForTick(b)+a.labelOffset,P=this._resolveTickFontOptions(b),D=P.lineHeight,C=n(v)?v.length:1;const e=C/2,i=t.color,o=t.textStrokeColor,h=t.textStrokeWidth;let d,f=k;if(r?(M=S,"inner"===k&&(f=b===_-1?this.options.reverse?"left":"right":0===b?this.options.reverse?"right":"left":"center"),O="top"===s?"near"===c||0!==m?-C*D+D/2:"center"===c?-T.highest.height/2-e*D+D:-T.highest.height+D/2:"near"===c||0!==m?D/2:"center"===c?T.highest.height/2-e*D:T.highest.height-C*D,u&&(O*=-1),0===m||t.showLabelBackdrop||(M+=D/2*Math.sin(m))):(w=S,O=(1-C)*D/2),t.showLabelBackdrop){const e=ki(t.backdropPadding),i=T.heights[b],s=T.widths[b];let n=O-e.top,o=0-e.left;switch(A){case"middle":n-=i/2;break;case"bottom":n-=i}switch(k){case"center":o-=s/2;break;case"right":o-=s;break;case"inner":b===_-1?o-=s:b>0&&(o-=s/2)}d={left:o,top:n,width:s+e.width,height:i+e.height,color:t.backdropColor}}x.push({label:v,font:P,textOffset:O,options:{rotation:m,color:i,strokeColor:o,strokeWidth:h,textAlign:f,textBaseline:A,translation:[M,w],backdrop:d}})}return x}_getXAxisLabelAlignment(){const{position:t,ticks:e}=this.options;if(-$(this.labelRotation))return"top"===t?"left":"right";let i="center";return"start"===e.align?i="left":"end"===e.align?i="right":"inner"===e.align&&(i="inner"),i}_getYAxisLabelAlignment(t){const{position:e,ticks:{crossAlign:i,mirror:s,padding:n}}=this.options,o=t+n,a=this._getLabelSizes().widest.width;let r,l;return"left"===e?s?(l=this.right+n,"near"===i?r="left":"center"===i?(r="center",l+=a/2):(r="right",l+=a)):(l=this.right-o,"near"===i?r="right":"center"===i?(r="center",l-=a/2):(r="left",l=this.left)):"right"===e?s?(l=this.left+n,"near"===i?r="right":"center"===i?(r="center",l-=a/2):(r="left",l-=a)):(l=this.left+o,"near"===i?r="left":"center"===i?(r="center",l+=a/2):(r="right",l=this.right)):r="right",{textAlign:r,x:l}}_computeLabelArea(){if(this.options.ticks.mirror)return;const t=this.chart,e=this.options.position;return"left"===e||"right"===e?{top:0,left:this.left,bottom:t.height,right:this.right}:"top"===e||"bottom"===e?{top:this.top,left:0,bottom:this.bottom,right:t.width}:void 0}drawBackground(){const{ctx:t,options:{backgroundColor:e},left:i,top:s,width:n,height:o}=this;e&&(t.save(),t.fillStyle=e,t.fillRect(i,s,n,o),t.restore())}getLineWidthForValue(t){const e=this.options.grid;if(!this._isVisible()||!e.display)return 0;const i=this.ticks.findIndex((e=>e.value===t));if(i>=0){return e.setContext(this.getContext(i)).lineWidth}return 0}drawGrid(t){const e=this.options.grid,i=this.ctx,s=this._gridLineItems||(this._gridLineItems=this._computeGridLineItems(t));let n,o;const a=(t,e,s)=>{s.width&&s.color&&(i.save(),i.lineWidth=s.width,i.strokeStyle=s.color,i.setLineDash(s.borderDash||[]),i.lineDashOffset=s.borderDashOffset,i.beginPath(),i.moveTo(t.x,t.y),i.lineTo(e.x,e.y),i.stroke(),i.restore())};if(e.display)for(n=0,o=s.length;n<o;++n){const t=s[n];e.drawOnChartArea&&a({x:t.x1,y:t.y1},{x:t.x2,y:t.y2},t),e.drawTicks&&a({x:t.tx1,y:t.ty1},{x:t.tx2,y:t.ty2},{color:t.tickColor,width:t.tickWidth,borderDash:t.tickBorderDash,borderDashOffset:t.tickBorderDashOffset})}}drawBorder(){const{chart:t,ctx:e,options:{border:i,grid:s}}=this,n=i.setContext(this.getContext()),o=i.display?n.width:0;if(!o)return;const a=s.setContext(this.getContext(0)).lineWidth,r=this._borderValue;let l,h,c,d;this.isHorizontal()?(l=Ae(t,this.left,o)-o/2,h=Ae(t,this.right,a)+a/2,c=d=r):(c=Ae(t,this.top,o)-o/2,d=Ae(t,this.bottom,a)+a/2,l=h=r),e.save(),e.lineWidth=n.width,e.strokeStyle=n.color,e.beginPath(),e.moveTo(l,c),e.lineTo(h,d),e.stroke(),e.restore()}drawLabels(t){if(!this.options.ticks.display)return;const e=this.ctx,i=this._computeLabelArea();i&&Ie(e,i);const s=this.getLabelItems(t);for(const t of s){const i=t.options,s=t.font;Ne(e,t.label,0,t.textOffset,s,i)}i&&ze(e)}drawTitle(){const{ctx:t,options:{position:e,title:i,reverse:s}}=this;if(!i.display)return;const a=Si(i.font),r=ki(i.padding),l=i.align;let h=a.lineHeight/2;"bottom"===e||"center"===e||o(e)?(h+=r.bottom,n(i.text)&&(h+=a.lineHeight*(i.text.length-1))):h+=r.top;const{titleX:c,titleY:d,maxWidth:u,rotation:f}=function(t,e,i,s){const{top:n,left:a,bottom:r,right:l,chart:h}=t,{chartArea:c,scales:d}=h;let u,f,g,p=0;const m=r-n,x=l-a;if(t.isHorizontal()){if(f=ft(s,a,l),o(i)){const t=Object.keys(i)[0],s=i[t];g=d[t].getPixelForValue(s)+m-e}else g="center"===i?(c.bottom+c.top)/2+m-e:Xs(t,i,e);u=l-a}else{if(o(i)){const t=Object.keys(i)[0],s=i[t];f=d[t].getPixelForValue(s)-x+e}else f="center"===i?(c.left+c.right)/2-x+e:Xs(t,i,e);g=ft(s,r,n),p="left"===i?-E:E}return{titleX:f,titleY:g,maxWidth:u,rotation:p}}(this,h,e,l);Ne(t,i.text,0,0,a,{color:i.color,maxWidth:u,rotation:f,textAlign:Qs(l,e,s),textBaseline:"middle",translation:[c,d]})}draw(t){this._isVisible()&&(this.drawBackground(),this.drawGrid(t),this.drawBorder(),this.drawTitle(),this.drawLabels(t))}_layers(){const t=this.options,e=t.ticks&&t.ticks.z||0,i=l(t.grid&&t.grid.z,-1),s=l(t.border&&t.border.z,0);return this._isVisible()&&this.draw===tn.prototype.draw?[{z:i,draw:t=>{this.drawBackground(),this.drawGrid(t),this.drawTitle()}},{z:s,draw:()=>{this.drawBorder()}},{z:e,draw:t=>{this.drawLabels(t)}}]:[{z:e,draw:t=>{this.draw(t)}}]}getMatchingVisibleMetas(t){const e=this.chart.getSortedVisibleDatasetMetas(),i=this.axis+"AxisID",s=[];let n,o;for(n=0,o=e.length;n<o;++n){const o=e[n];o[i]!==this.id||t&&o.type!==t||s.push(o)}return s}_resolveTickFontOptions(t){return Si(this.options.ticks.setContext(this.getContext(t)).font)}_maxDigits(){const t=this._resolveTickFontOptions(0).lineHeight;return(this.isHorizontal()?this.width:this.height)/t}}class en{constructor(t,e,i){this.type=t,this.scope=e,this.override=i,this.items=Object.create(null)}isForType(t){return Object.prototype.isPrototypeOf.call(this.type.prototype,t.prototype)}register(t){const e=Object.getPrototypeOf(t);let i;(function(t){return"id"in t&&"defaults"in t})(e)&&(i=this.register(e));const s=this.items,n=t.id,o=this.scope+"."+n;if(!n)throw new Error("class does not have id: "+t);return n in s||(s[n]=t,function(t,e,i){const s=x(Object.create(null),[i?ue.get(i):{},ue.get(e),t.defaults]);ue.set(e,s),t.defaultRoutes&&function(t,e){Object.keys(e).forEach((i=>{const s=i.split("."),n=s.pop(),o=[t].concat(s).join("."),a=e[i].split("."),r=a.pop(),l=a.join(".");ue.route(o,n,l,r)}))}(e,t.defaultRoutes);t.descriptors&&ue.describe(e,t.descriptors)}(t,o,i),this.override&&ue.override(t.id,t.overrides)),o}get(t){return this.items[t]}unregister(t){const e=this.items,i=t.id,s=this.scope;i in e&&delete e[i],s&&i in ue[s]&&(delete ue[s][i],this.override&&delete re[i])}}class sn{constructor(){this.controllers=new en(js,"datasets",!0),this.elements=new en($s,"elements"),this.plugins=new en(Object,"plugins"),this.scales=new en(tn,"scales"),this._typedRegistries=[this.controllers,this.scales,this.elements]}add(...t){this._each("register",t)}remove(...t){this._each("unregister",t)}addControllers(...t){this._each("register",t,this.controllers)}addElements(...t){this._each("register",t,this.elements)}addPlugins(...t){this._each("register",t,this.plugins)}addScales(...t){this._each("register",t,this.scales)}getController(t){return this._get(t,this.controllers,"controller")}getElement(t){return this._get(t,this.elements,"element")}getPlugin(t){return this._get(t,this.plugins,"plugin")}getScale(t){return this._get(t,this.scales,"scale")}removeControllers(...t){this._each("unregister",t,this.controllers)}removeElements(...t){this._each("unregister",t,this.elements)}removePlugins(...t){this._each("unregister",t,this.plugins)}removeScales(...t){this._each("unregister",t,this.scales)}_each(t,e,i){[...e].forEach((e=>{const s=i||this._getRegistryForType(e);i||s.isForType(e)||s===this.plugins&&e.id?this._exec(t,s,e):u(e,(e=>{const s=i||this._getRegistryForType(e);this._exec(t,s,e)}))}))}_exec(t,e,i){const s=w(t);d(i["before"+s],[],i),e[t](i),d(i["after"+s],[],i)}_getRegistryForType(t){for(let e=0;e<this._typedRegistries.length;e++){const i=this._typedRegistries[e];if(i.isForType(t))return i}return this.plugins}_get(t,e,i){const s=e.get(t);if(void 0===s)throw new Error('"'+t+'" is not a registered '+i+".");return s}}var nn=new sn;class on{constructor(){this._init=void 0}notify(t,e,i,s){if("beforeInit"===e&&(this._init=this._createDescriptors(t,!0),this._notify(this._init,t,"install")),void 0===this._init)return;const n=s?this._descriptors(t).filter(s):this._descriptors(t),o=this._notify(n,t,e,i);return"afterDestroy"===e&&(this._notify(n,t,"stop"),this._notify(this._init,t,"uninstall"),this._init=void 0),o}_notify(t,e,i,s){s=s||{};for(const n of t){const t=n.plugin;if(!1===d(t[i],[e,s,n.options],t)&&s.cancelable)return!1}return!0}invalidate(){s(this._cache)||(this._oldCache=this._cache,this._cache=void 0)}_descriptors(t){if(this._cache)return this._cache;const e=this._cache=this._createDescriptors(t);return this._notifyStateChanges(t),e}_createDescriptors(t,e){const i=t&&t.config,s=l(i.options&&i.options.plugins,{}),n=function(t){const e={},i=[],s=Object.keys(nn.plugins.items);for(let t=0;t<s.length;t++)i.push(nn.getPlugin(s[t]));const n=t.plugins||[];for(let t=0;t<n.length;t++){const s=n[t];-1===i.indexOf(s)&&(i.push(s),e[s.id]=!0)}return{plugins:i,localIds:e}}(i);return!1!==s||e?function(t,{plugins:e,localIds:i},s,n){const o=[],a=t.getContext();for(const r of e){const e=r.id,l=an(s[e],n);null!==l&&o.push({plugin:r,options:rn(t.config,{plugin:r,local:i[e]},l,a)})}return o}(t,n,s,e):[]}_notifyStateChanges(t){const e=this._oldCache||[],i=this._cache,s=(t,e)=>t.filter((t=>!e.some((e=>t.plugin.id===e.plugin.id))));this._notify(s(e,i),t,"stop"),this._notify(s(i,e),t,"start")}}function an(t,e){return e||!1!==t?!0===t?{}:t:null}function rn(t,{plugin:e,local:i},s,n){const o=t.pluginScopeKeys(e),a=t.getOptionScopes(s,o);return i&&e.defaults&&a.push(e.defaults),t.createResolver(a,n,[""],{scriptable:!1,indexable:!1,allKeys:!0})}function ln(t,e){const i=ue.datasets[t]||{};return((e.datasets||{})[t]||{}).indexAxis||e.indexAxis||i.indexAxis||"x"}function hn(t){if("x"===t||"y"===t||"r"===t)return t}function cn(t,...e){if(hn(t))return t;for(const s of e){const e=s.axis||("top"===(i=s.position)||"bottom"===i?"x":"left"===i||"right"===i?"y":void 0)||t.length>1&&hn(t[0].toLowerCase());if(e)return e}var i;throw new Error(\`Cannot determine type of '\${t}' axis. Please provide 'axis' or 'position' option.\`)}function dn(t,e,i){if(i[e+"AxisID"]===t)return{axis:e}}function un(t,e){const i=re[t.type]||{scales:{}},s=e.scales||{},n=ln(t.type,e),a=Object.create(null);return Object.keys(s).forEach((e=>{const r=s[e];if(!o(r))return console.error(\`Invalid scale configuration for scale: \${e}\`);if(r._proxy)return console.warn(\`Ignoring resolver passed as options for scale: \${e}\`);const l=cn(e,r,function(t,e){if(e.data&&e.data.datasets){const i=e.data.datasets.filter((e=>e.xAxisID===t||e.yAxisID===t));if(i.length)return dn(t,"x",i[0])||dn(t,"y",i[0])}return{}}(e,t),ue.scales[r.type]),h=function(t,e){return t===e?"_index_":"_value_"}(l,n),c=i.scales||{};a[e]=b(Object.create(null),[{axis:l},r,c[l],c[h]])})),t.data.datasets.forEach((i=>{const n=i.type||t.type,o=i.indexAxis||ln(n,e),r=(re[n]||{}).scales||{};Object.keys(r).forEach((t=>{const e=function(t,e){let i=t;return"_index_"===t?i=e:"_value_"===t&&(i="x"===e?"y":"x"),i}(t,o),n=i[e+"AxisID"]||e;a[n]=a[n]||Object.create(null),b(a[n],[{axis:e},s[n],r[t]])}))})),Object.keys(a).forEach((t=>{const e=a[t];b(e,[ue.scales[e.type],ue.scale])})),a}function fn(t){const e=t.options||(t.options={});e.plugins=l(e.plugins,{}),e.scales=un(t,e)}function gn(t){return(t=t||{}).datasets=t.datasets||[],t.labels=t.labels||[],t}const pn=new Map,mn=new Set;function xn(t,e){let i=pn.get(t);return i||(i=e(),pn.set(t,i),mn.add(i)),i}const bn=(t,e,i)=>{const s=M(e,i);void 0!==s&&t.add(s)};class _n{constructor(t){this._config=function(t){return(t=t||{}).data=gn(t.data),fn(t),t}(t),this._scopeCache=new Map,this._resolverCache=new Map}get platform(){return this._config.platform}get type(){return this._config.type}set type(t){this._config.type=t}get data(){return this._config.data}set data(t){this._config.data=gn(t)}get options(){return this._config.options}set options(t){this._config.options=t}get plugins(){return this._config.plugins}update(){const t=this._config;this.clearCache(),fn(t)}clearCache(){this._scopeCache.clear(),this._resolverCache.clear()}datasetScopeKeys(t){return xn(t,(()=>[[\`datasets.\${t}\`,""]]))}datasetAnimationScopeKeys(t,e){return xn(\`\${t}.transition.\${e}\`,(()=>[[\`datasets.\${t}.transitions.\${e}\`,\`transitions.\${e}\`],[\`datasets.\${t}\`,""]]))}datasetElementScopeKeys(t,e){return xn(\`\${t}-\${e}\`,(()=>[[\`datasets.\${t}.elements.\${e}\`,\`datasets.\${t}\`,\`elements.\${e}\`,""]]))}pluginScopeKeys(t){const e=t.id;return xn(\`\${this.type}-plugin-\${e}\`,(()=>[[\`plugins.\${e}\`,...t.additionalOptionScopes||[]]]))}_cachedScopes(t,e){const i=this._scopeCache;let s=i.get(t);return s&&!e||(s=new Map,i.set(t,s)),s}getOptionScopes(t,e,i){const{options:s,type:n}=this,o=this._cachedScopes(t,i),a=o.get(e);if(a)return a;const r=new Set;e.forEach((e=>{t&&(r.add(t),e.forEach((e=>bn(r,t,e)))),e.forEach((t=>bn(r,s,t))),e.forEach((t=>bn(r,re[n]||{},t))),e.forEach((t=>bn(r,ue,t))),e.forEach((t=>bn(r,le,t)))}));const l=Array.from(r);return 0===l.length&&l.push(Object.create(null)),mn.has(e)&&o.set(e,l),l}chartOptionScopes(){const{options:t,type:e}=this;return[t,re[e]||{},ue.datasets[e]||{},{type:e},ue,le]}resolveNamedOptions(t,e,i,s=[""]){const o={$shared:!0},{resolver:a,subPrefixes:r}=yn(this._resolverCache,t,s);let l=a;if(function(t,e){const{isScriptable:i,isIndexable:s}=Ye(t);for(const o of e){const e=i(o),a=s(o),r=(a||e)&&t[o];if(e&&(S(r)||vn(r))||a&&n(r))return!0}return!1}(a,e)){o.$shared=!1;l=$e(a,i=S(i)?i():i,this.createResolver(t,i,r))}for(const t of e)o[t]=l[t];return o}createResolver(t,e,i=[""],s){const{resolver:n}=yn(this._resolverCache,t,i);return o(e)?$e(n,e,void 0,s):n}}function yn(t,e,i){let s=t.get(e);s||(s=new Map,t.set(e,s));const n=i.join();let o=s.get(n);if(!o){o={resolver:je(e,i),subPrefixes:i.filter((t=>!t.toLowerCase().includes("hover")))},s.set(n,o)}return o}const vn=t=>o(t)&&Object.getOwnPropertyNames(t).some((e=>S(t[e])));const Mn=["top","bottom","left","right","chartArea"];function wn(t,e){return"top"===t||"bottom"===t||-1===Mn.indexOf(t)&&"x"===e}function kn(t,e){return function(i,s){return i[t]===s[t]?i[e]-s[e]:i[t]-s[t]}}function Sn(t){const e=t.chart,i=e.options.animation;e.notifyPlugins("afterRender"),d(i&&i.onComplete,[t],e)}function Pn(t){const e=t.chart,i=e.options.animation;d(i&&i.onProgress,[t],e)}function Dn(t){return fe()&&"string"==typeof t?t=document.getElementById(t):t&&t.length&&(t=t[0]),t&&t.canvas&&(t=t.canvas),t}const Cn={},On=t=>{const e=Dn(t);return Object.values(Cn).filter((t=>t.canvas===e)).pop()};function An(t,e,i){const s=Object.keys(t);for(const n of s){const s=+n;if(s>=e){const o=t[n];delete t[n],(i>0||s>e)&&(t[s+i]=o)}}}class Tn{static defaults=ue;static instances=Cn;static overrides=re;static registry=nn;static version="4.5.1";static getChart=On;static register(...t){nn.add(...t),Ln()}static unregister(...t){nn.remove(...t),Ln()}constructor(t,e){const s=this.config=new _n(e),n=Dn(t),o=On(n);if(o)throw new Error("Canvas is already in use. Chart with ID '"+o.id+"' must be destroyed before the canvas with ID '"+o.canvas.id+"' can be reused.");const a=s.createResolver(s.chartOptionScopes(),this.getContext());this.platform=new(s.platform||Ps(n)),this.platform.updateConfig(s);const r=this.platform.acquireContext(n,a.aspectRatio),l=r&&r.canvas,h=l&&l.height,c=l&&l.width;this.id=i(),this.ctx=r,this.canvas=l,this.width=c,this.height=h,this._options=a,this._aspectRatio=this.aspectRatio,this._layers=[],this._metasets=[],this._stacks=void 0,this.boxes=[],this.currentDevicePixelRatio=void 0,this.chartArea=void 0,this._active=[],this._lastEvent=void 0,this._listeners={},this._responsiveListeners=void 0,this._sortedMetasets=[],this.scales={},this._plugins=new on,this.$proxies={},this._hiddenIndices={},this.attached=!1,this._animationsDisabled=void 0,this.$context=void 0,this._doResize=dt((t=>this.update(t)),a.resizeDelay||0),this._dataChanges=[],Cn[this.id]=this,r&&l?(bt.listen(this,"complete",Sn),bt.listen(this,"progress",Pn),this._initialize(),this.attached&&this.update()):console.error("Failed to create chart: can't acquire context from the given item")}get aspectRatio(){const{options:{aspectRatio:t,maintainAspectRatio:e},width:i,height:n,_aspectRatio:o}=this;return s(t)?e&&o?o:n?i/n:null:t}get data(){return this.config.data}set data(t){this.config.data=t}get options(){return this._options}set options(t){this.config.options=t}get registry(){return nn}_initialize(){return this.notifyPlugins("beforeInit"),this.options.responsive?this.resize():ke(this,this.options.devicePixelRatio),this.bindEvents(),this.notifyPlugins("afterInit"),this}clear(){return Te(this.canvas,this.ctx),this}stop(){return bt.stop(this),this}resize(t,e){bt.running(this)?this._resizeBeforeDraw={width:t,height:e}:this._resize(t,e)}_resize(t,e){const i=this.options,s=this.canvas,n=i.maintainAspectRatio&&this.aspectRatio,o=this.platform.getMaximumSize(s,t,e,n),a=i.devicePixelRatio||this.platform.getDevicePixelRatio(),r=this.width?"resize":"attach";this.width=o.width,this.height=o.height,this._aspectRatio=this.aspectRatio,ke(this,a,!0)&&(this.notifyPlugins("resize",{size:o}),d(i.onResize,[this,o],this),this.attached&&this._doResize(r)&&this.render())}ensureScalesHaveIDs(){u(this.options.scales||{},((t,e)=>{t.id=e}))}buildOrUpdateScales(){const t=this.options,e=t.scales,i=this.scales,s=Object.keys(i).reduce(((t,e)=>(t[e]=!1,t)),{});let n=[];e&&(n=n.concat(Object.keys(e).map((t=>{const i=e[t],s=cn(t,i),n="r"===s,o="x"===s;return{options:i,dposition:n?"chartArea":o?"bottom":"left",dtype:n?"radialLinear":o?"category":"linear"}})))),u(n,(e=>{const n=e.options,o=n.id,a=cn(o,n),r=l(n.type,e.dtype);void 0!==n.position&&wn(n.position,a)===wn(e.dposition)||(n.position=e.dposition),s[o]=!0;let h=null;if(o in i&&i[o].type===r)h=i[o];else{h=new(nn.getScale(r))({id:o,type:r,ctx:this.ctx,chart:this}),i[h.id]=h}h.init(n,t)})),u(s,((t,e)=>{t||delete i[e]})),u(i,(t=>{ls.configure(this,t,t.options),ls.addBox(this,t)}))}_updateMetasets(){const t=this._metasets,e=this.data.datasets.length,i=t.length;if(t.sort(((t,e)=>t.index-e.index)),i>e){for(let t=e;t<i;++t)this._destroyDatasetMeta(t);t.splice(e,i-e)}this._sortedMetasets=t.slice(0).sort(kn("order","index"))}_removeUnreferencedMetasets(){const{_metasets:t,data:{datasets:e}}=this;t.length>e.length&&delete this._stacks,t.forEach(((t,i)=>{0===e.filter((e=>e===t._dataset)).length&&this._destroyDatasetMeta(i)}))}buildOrUpdateControllers(){const t=[],e=this.data.datasets;let i,s;for(this._removeUnreferencedMetasets(),i=0,s=e.length;i<s;i++){const s=e[i];let n=this.getDatasetMeta(i);const o=s.type||this.config.type;if(n.type&&n.type!==o&&(this._destroyDatasetMeta(i),n=this.getDatasetMeta(i)),n.type=o,n.indexAxis=s.indexAxis||ln(o,this.options),n.order=s.order||0,n.index=i,n.label=""+s.label,n.visible=this.isDatasetVisible(i),n.controller)n.controller.updateIndex(i),n.controller.linkScales();else{const e=nn.getController(o),{datasetElementType:s,dataElementType:a}=ue.datasets[o];Object.assign(e,{dataElementType:nn.getElement(a),datasetElementType:s&&nn.getElement(s)}),n.controller=new e(this,i),t.push(n.controller)}}return this._updateMetasets(),t}_resetElements(){u(this.data.datasets,((t,e)=>{this.getDatasetMeta(e).controller.reset()}),this)}reset(){this._resetElements(),this.notifyPlugins("reset")}update(t){const e=this.config;e.update();const i=this._options=e.createResolver(e.chartOptionScopes(),this.getContext()),s=this._animationsDisabled=!i.animation;if(this._updateScales(),this._checkEventBindings(),this._updateHiddenIndices(),this._plugins.invalidate(),!1===this.notifyPlugins("beforeUpdate",{mode:t,cancelable:!0}))return;const n=this.buildOrUpdateControllers();this.notifyPlugins("beforeElementsUpdate");let o=0;for(let t=0,e=this.data.datasets.length;t<e;t++){const{controller:e}=this.getDatasetMeta(t),i=!s&&-1===n.indexOf(e);e.buildOrUpdateElements(i),o=Math.max(+e.getMaxOverflow(),o)}o=this._minPadding=i.layout.autoPadding?o:0,this._updateLayout(o),s||u(n,(t=>{t.reset()})),this._updateDatasets(t),this.notifyPlugins("afterUpdate",{mode:t}),this._layers.sort(kn("z","_idx"));const{_active:a,_lastEvent:r}=this;r?this._eventHandler(r,!0):a.length&&this._updateHoverStyles(a,a,!0),this.render()}_updateScales(){u(this.scales,(t=>{ls.removeBox(this,t)})),this.ensureScalesHaveIDs(),this.buildOrUpdateScales()}_checkEventBindings(){const t=this.options,e=new Set(Object.keys(this._listeners)),i=new Set(t.events);P(e,i)&&!!this._responsiveListeners===t.responsive||(this.unbindEvents(),this.bindEvents())}_updateHiddenIndices(){const{_hiddenIndices:t}=this,e=this._getUniformDataChanges()||[];for(const{method:i,start:s,count:n}of e){An(t,s,"_removeElements"===i?-n:n)}}_getUniformDataChanges(){const t=this._dataChanges;if(!t||!t.length)return;this._dataChanges=[];const e=this.data.datasets.length,i=e=>new Set(t.filter((t=>t[0]===e)).map(((t,e)=>e+","+t.splice(1).join(",")))),s=i(0);for(let t=1;t<e;t++)if(!P(s,i(t)))return;return Array.from(s).map((t=>t.split(","))).map((t=>({method:t[1],start:+t[2],count:+t[3]})))}_updateLayout(t){if(!1===this.notifyPlugins("beforeLayout",{cancelable:!0}))return;ls.update(this,this.width,this.height,t);const e=this.chartArea,i=e.width<=0||e.height<=0;this._layers=[],u(this.boxes,(t=>{i&&"chartArea"===t.position||(t.configure&&t.configure(),this._layers.push(...t._layers()))}),this),this._layers.forEach(((t,e)=>{t._idx=e})),this.notifyPlugins("afterLayout")}_updateDatasets(t){if(!1!==this.notifyPlugins("beforeDatasetsUpdate",{mode:t,cancelable:!0})){for(let t=0,e=this.data.datasets.length;t<e;++t)this.getDatasetMeta(t).controller.configure();for(let e=0,i=this.data.datasets.length;e<i;++e)this._updateDataset(e,S(t)?t({datasetIndex:e}):t);this.notifyPlugins("afterDatasetsUpdate",{mode:t})}}_updateDataset(t,e){const i=this.getDatasetMeta(t),s={meta:i,index:t,mode:e,cancelable:!0};!1!==this.notifyPlugins("beforeDatasetUpdate",s)&&(i.controller._update(e),s.cancelable=!1,this.notifyPlugins("afterDatasetUpdate",s))}render(){!1!==this.notifyPlugins("beforeRender",{cancelable:!0})&&(bt.has(this)?this.attached&&!bt.running(this)&&bt.start(this):(this.draw(),Sn({chart:this})))}draw(){let t;if(this._resizeBeforeDraw){const{width:t,height:e}=this._resizeBeforeDraw;this._resizeBeforeDraw=null,this._resize(t,e)}if(this.clear(),this.width<=0||this.height<=0)return;if(!1===this.notifyPlugins("beforeDraw",{cancelable:!0}))return;const e=this._layers;for(t=0;t<e.length&&e[t].z<=0;++t)e[t].draw(this.chartArea);for(this._drawDatasets();t<e.length;++t)e[t].draw(this.chartArea);this.notifyPlugins("afterDraw")}_getSortedDatasetMetas(t){const e=this._sortedMetasets,i=[];let s,n;for(s=0,n=e.length;s<n;++s){const n=e[s];t&&!n.visible||i.push(n)}return i}getSortedVisibleDatasetMetas(){return this._getSortedDatasetMetas(!0)}_drawDatasets(){if(!1===this.notifyPlugins("beforeDatasetsDraw",{cancelable:!0}))return;const t=this.getSortedVisibleDatasetMetas();for(let e=t.length-1;e>=0;--e)this._drawDataset(t[e]);this.notifyPlugins("afterDatasetsDraw")}_drawDataset(t){const e=this.ctx,i={meta:t,index:t.index,cancelable:!0},s=Ni(this,t);!1!==this.notifyPlugins("beforeDatasetDraw",i)&&(s&&Ie(e,s),t.controller.draw(),s&&ze(e),i.cancelable=!1,this.notifyPlugins("afterDatasetDraw",i))}isPointInArea(t){return Re(t,this.chartArea,this._minPadding)}getElementsAtEventForMode(t,e,i,s){const n=Ki.modes[e];return"function"==typeof n?n(this,t,i,s):[]}getDatasetMeta(t){const e=this.data.datasets[t],i=this._metasets;let s=i.filter((t=>t&&t._dataset===e)).pop();return s||(s={type:null,data:[],dataset:null,controller:null,hidden:null,xAxisID:null,yAxisID:null,order:e&&e.order||0,index:t,_dataset:e,_parsed:[],_sorted:!1},i.push(s)),s}getContext(){return this.$context||(this.$context=Ci(null,{chart:this,type:"chart"}))}getVisibleDatasetCount(){return this.getSortedVisibleDatasetMetas().length}isDatasetVisible(t){const e=this.data.datasets[t];if(!e)return!1;const i=this.getDatasetMeta(t);return"boolean"==typeof i.hidden?!i.hidden:!e.hidden}setDatasetVisibility(t,e){this.getDatasetMeta(t).hidden=!e}toggleDataVisibility(t){this._hiddenIndices[t]=!this._hiddenIndices[t]}getDataVisibility(t){return!this._hiddenIndices[t]}_updateVisibility(t,e,i){const s=i?"show":"hide",n=this.getDatasetMeta(t),o=n.controller._resolveAnimations(void 0,s);k(e)?(n.data[e].hidden=!i,this.update()):(this.setDatasetVisibility(t,i),o.update(n,{visible:i}),this.update((e=>e.datasetIndex===t?s:void 0)))}hide(t,e){this._updateVisibility(t,e,!1)}show(t,e){this._updateVisibility(t,e,!0)}_destroyDatasetMeta(t){const e=this._metasets[t];e&&e.controller&&e.controller._destroy(),delete this._metasets[t]}_stop(){let t,e;for(this.stop(),bt.remove(this),t=0,e=this.data.datasets.length;t<e;++t)this._destroyDatasetMeta(t)}destroy(){this.notifyPlugins("beforeDestroy");const{canvas:t,ctx:e}=this;this._stop(),this.config.clearCache(),t&&(this.unbindEvents(),Te(t,e),this.platform.releaseContext(e),this.canvas=null,this.ctx=null),delete Cn[this.id],this.notifyPlugins("afterDestroy")}toBase64Image(...t){return this.canvas.toDataURL(...t)}bindEvents(){this.bindUserEvents(),this.options.responsive?this.bindResponsiveEvents():this.attached=!0}bindUserEvents(){const t=this._listeners,e=this.platform,i=(i,s)=>{e.addEventListener(this,i,s),t[i]=s},s=(t,e,i)=>{t.offsetX=e,t.offsetY=i,this._eventHandler(t)};u(this.options.events,(t=>i(t,s)))}bindResponsiveEvents(){this._responsiveListeners||(this._responsiveListeners={});const t=this._responsiveListeners,e=this.platform,i=(i,s)=>{e.addEventListener(this,i,s),t[i]=s},s=(i,s)=>{t[i]&&(e.removeEventListener(this,i,s),delete t[i])},n=(t,e)=>{this.canvas&&this.resize(t,e)};let o;const a=()=>{s("attach",a),this.attached=!0,this.resize(),i("resize",n),i("detach",o)};o=()=>{this.attached=!1,s("resize",n),this._stop(),this._resize(0,0),i("attach",a)},e.isAttached(this.canvas)?a():o()}unbindEvents(){u(this._listeners,((t,e)=>{this.platform.removeEventListener(this,e,t)})),this._listeners={},u(this._responsiveListeners,((t,e)=>{this.platform.removeEventListener(this,e,t)})),this._responsiveListeners=void 0}updateHoverStyle(t,e,i){const s=i?"set":"remove";let n,o,a,r;for("dataset"===e&&(n=this.getDatasetMeta(t[0].datasetIndex),n.controller["_"+s+"DatasetHoverStyle"]()),a=0,r=t.length;a<r;++a){o=t[a];const e=o&&this.getDatasetMeta(o.datasetIndex).controller;e&&e[s+"HoverStyle"](o.element,o.datasetIndex,o.index)}}getActiveElements(){return this._active||[]}setActiveElements(t){const e=this._active||[],i=t.map((({datasetIndex:t,index:e})=>{const i=this.getDatasetMeta(t);if(!i)throw new Error("No dataset found at index "+t);return{datasetIndex:t,element:i.data[e],index:e}}));!f(i,e)&&(this._active=i,this._lastEvent=null,this._updateHoverStyles(i,e))}notifyPlugins(t,e,i){return this._plugins.notify(this,t,e,i)}isPluginEnabled(t){return 1===this._plugins._cache.filter((e=>e.plugin.id===t)).length}_updateHoverStyles(t,e,i){const s=this.options.hover,n=(t,e)=>t.filter((t=>!e.some((e=>t.datasetIndex===e.datasetIndex&&t.index===e.index)))),o=n(e,t),a=i?t:n(t,e);o.length&&this.updateHoverStyle(o,s.mode,!1),a.length&&s.mode&&this.updateHoverStyle(a,s.mode,!0)}_eventHandler(t,e){const i={event:t,replay:e,cancelable:!0,inChartArea:this.isPointInArea(t)},s=e=>(e.options.events||this.options.events).includes(t.native.type);if(!1===this.notifyPlugins("beforeEvent",i,s))return;const n=this._handleEvent(t,e,i.inChartArea);return i.cancelable=!1,this.notifyPlugins("afterEvent",i,s),(n||i.changed)&&this.render(),this}_handleEvent(t,e,i){const{_active:s=[],options:n}=this,o=e,a=this._getActiveElements(t,s,i,o),r=D(t),l=function(t,e,i,s){return i&&"mouseout"!==t.type?s?e:t:null}(t,this._lastEvent,i,r);i&&(this._lastEvent=null,d(n.onHover,[t,a,this],this),r&&d(n.onClick,[t,a,this],this));const h=!f(a,s);return(h||e)&&(this._active=a,this._updateHoverStyles(a,s,e)),this._lastEvent=l,h}_getActiveElements(t,e,i,s){if("mouseout"===t.type)return[];if(!i)return e;const n=this.options.hover;return this.getElementsAtEventForMode(t,n.mode,n,s)}}function Ln(){return u(Tn.instances,(t=>t._plugins.invalidate()))}function En(){throw new Error("This method is not implemented: Check that a complete date adapter is provided.")}class Rn{static override(t){Object.assign(Rn.prototype,t)}options;constructor(t){this.options=t||{}}init(){}formats(){return En()}parse(){return En()}format(){return En()}add(){return En()}diff(){return En()}startOf(){return En()}endOf(){return En()}}var In={_date:Rn};function zn(t){const e=t.iScale,i=function(t,e){if(!t._cache.$bar){const i=t.getMatchingVisibleMetas(e);let s=[];for(let e=0,n=i.length;e<n;e++)s=s.concat(i[e].controller.getAllParsedValues(t));t._cache.$bar=lt(s.sort(((t,e)=>t-e)))}return t._cache.$bar}(e,t.type);let s,n,o,a,r=e._length;const l=()=>{32767!==o&&-32768!==o&&(k(a)&&(r=Math.min(r,Math.abs(o-a)||r)),a=o)};for(s=0,n=i.length;s<n;++s)o=e.getPixelForValue(i[s]),l();for(a=void 0,s=0,n=e.ticks.length;s<n;++s)o=e.getPixelForTick(s),l();return r}function Fn(t,e,i,s){return n(t)?function(t,e,i,s){const n=i.parse(t[0],s),o=i.parse(t[1],s),a=Math.min(n,o),r=Math.max(n,o);let l=a,h=r;Math.abs(a)>Math.abs(r)&&(l=r,h=a),e[i.axis]=h,e._custom={barStart:l,barEnd:h,start:n,end:o,min:a,max:r}}(t,e,i,s):e[i.axis]=i.parse(t,s),e}function Vn(t,e,i,s){const n=t.iScale,o=t.vScale,a=n.getLabels(),r=n===o,l=[];let h,c,d,u;for(h=i,c=i+s;h<c;++h)u=e[h],d={},d[n.axis]=r||n.parse(a[h],h),l.push(Fn(u,d,o,h));return l}function Bn(t){return t&&void 0!==t.barStart&&void 0!==t.barEnd}function Wn(t,e,i,s){let n=e.borderSkipped;const o={};if(!n)return void(t.borderSkipped=o);if(!0===n)return void(t.borderSkipped={top:!0,right:!0,bottom:!0,left:!0});const{start:a,end:r,reverse:l,top:h,bottom:c}=function(t){let e,i,s,n,o;return t.horizontal?(e=t.base>t.x,i="left",s="right"):(e=t.base<t.y,i="bottom",s="top"),e?(n="end",o="start"):(n="start",o="end"),{start:i,end:s,reverse:e,top:n,bottom:o}}(t);"middle"===n&&i&&(t.enableBorderRadius=!0,(i._top||0)===s?n=h:(i._bottom||0)===s?n=c:(o[Nn(c,a,r,l)]=!0,n=h)),o[Nn(n,a,r,l)]=!0,t.borderSkipped=o}function Nn(t,e,i,s){var n,o,a;return s?(a=i,t=Hn(t=(n=t)===(o=e)?a:n===a?o:n,i,e)):t=Hn(t,e,i),t}function Hn(t,e,i){return"start"===t?e:"end"===t?i:t}function jn(t,{inflateAmount:e},i){t.inflateAmount="auto"===e?1===i?.33:0:e}class $n extends js{static id="doughnut";static defaults={datasetElementType:!1,dataElementType:"arc",animation:{animateRotate:!0,animateScale:!1},animations:{numbers:{type:"number",properties:["circumference","endAngle","innerRadius","outerRadius","startAngle","x","y","offset","borderWidth","spacing"]}},cutout:"50%",rotation:0,circumference:360,radius:"100%",spacing:0,indexAxis:"r"};static descriptors={_scriptable:t=>"spacing"!==t,_indexable:t=>"spacing"!==t&&!t.startsWith("borderDash")&&!t.startsWith("hoverBorderDash")};static overrides={aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data,{labels:{pointStyle:i,textAlign:s,color:n,useBorderRadius:o,borderRadius:a}}=t.legend.options;return e.labels.length&&e.datasets.length?e.labels.map(((e,r)=>{const l=t.getDatasetMeta(0).controller.getStyle(r);return{text:e,fillStyle:l.backgroundColor,fontColor:n,hidden:!t.getDataVisibility(r),lineDash:l.borderDash,lineDashOffset:l.borderDashOffset,lineJoin:l.borderJoinStyle,lineWidth:l.borderWidth,strokeStyle:l.borderColor,textAlign:s,pointStyle:i,borderRadius:o&&(a||l.borderRadius),index:r}})):[]}},onClick(t,e,i){i.chart.toggleDataVisibility(e.index),i.chart.update()}}}};constructor(t,e){super(t,e),this.enableOptionSharing=!0,this.innerRadius=void 0,this.outerRadius=void 0,this.offsetX=void 0,this.offsetY=void 0}linkScales(){}parse(t,e){const i=this.getDataset().data,s=this._cachedMeta;if(!1===this._parsing)s._parsed=i;else{let n,a,r=t=>+i[t];if(o(i[t])){const{key:t="value"}=this._parsing;r=e=>+M(i[e],t)}for(n=t,a=t+e;n<a;++n)s._parsed[n]=r(n)}}_getRotation(){return $(this.options.rotation-90)}_getCircumference(){return $(this.options.circumference)}_getRotationExtents(){let t=O,e=-O;for(let i=0;i<this.chart.data.datasets.length;++i)if(this.chart.isDatasetVisible(i)&&this.chart.getDatasetMeta(i).type===this._type){const s=this.chart.getDatasetMeta(i).controller,n=s._getRotation(),o=s._getCircumference();t=Math.min(t,n),e=Math.max(e,n+o)}return{rotation:t,circumference:e-t}}update(t){const e=this.chart,{chartArea:i}=e,s=this._cachedMeta,n=s.data,o=this.getMaxBorderWidth()+this.getMaxOffset(n)+this.options.spacing,a=Math.max((Math.min(i.width,i.height)-o)/2,0),r=Math.min(h(this.options.cutout,a),1),l=this._getRingWeight(this.index),{circumference:d,rotation:u}=this._getRotationExtents(),{ratioX:f,ratioY:g,offsetX:p,offsetY:m}=function(t,e,i){let s=1,n=1,o=0,a=0;if(e<O){const r=t,l=r+e,h=Math.cos(r),c=Math.sin(r),d=Math.cos(l),u=Math.sin(l),f=(t,e,s)=>J(t,r,l,!0)?1:Math.max(e,e*i,s,s*i),g=(t,e,s)=>J(t,r,l,!0)?-1:Math.min(e,e*i,s,s*i),p=f(0,h,d),m=f(E,c,u),x=g(C,h,d),b=g(C+E,c,u);s=(p-x)/2,n=(m-b)/2,o=-(p+x)/2,a=-(m+b)/2}return{ratioX:s,ratioY:n,offsetX:o,offsetY:a}}(u,d,r),x=(i.width-o)/f,b=(i.height-o)/g,_=Math.max(Math.min(x,b)/2,0),y=c(this.options.radius,_),v=(y-Math.max(y*r,0))/this._getVisibleDatasetWeightTotal();this.offsetX=p*y,this.offsetY=m*y,s.total=this.calculateTotal(),this.outerRadius=y-v*this._getRingWeightOffset(this.index),this.innerRadius=Math.max(this.outerRadius-v*l,0),this.updateElements(n,0,n.length,t)}_circumference(t,e){const i=this.options,s=this._cachedMeta,n=this._getCircumference();return e&&i.animation.animateRotate||!this.chart.getDataVisibility(t)||null===s._parsed[t]||s.data[t].hidden?0:this.calculateCircumference(s._parsed[t]*n/O)}updateElements(t,e,i,s){const n="reset"===s,o=this.chart,a=o.chartArea,r=o.options.animation,l=(a.left+a.right)/2,h=(a.top+a.bottom)/2,c=n&&r.animateScale,d=c?0:this.innerRadius,u=c?0:this.outerRadius,{sharedOptions:f,includeOptions:g}=this._getSharedOptions(e,s);let p,m=this._getRotation();for(p=0;p<e;++p)m+=this._circumference(p,n);for(p=e;p<e+i;++p){const e=this._circumference(p,n),i=t[p],o={x:l+this.offsetX,y:h+this.offsetY,startAngle:m,endAngle:m+e,circumference:e,outerRadius:u,innerRadius:d};g&&(o.options=f||this.resolveDataElementOptions(p,i.active?"active":s)),m+=e,this.updateElement(i,p,o,s)}}calculateTotal(){const t=this._cachedMeta,e=t.data;let i,s=0;for(i=0;i<e.length;i++){const n=t._parsed[i];null===n||isNaN(n)||!this.chart.getDataVisibility(i)||e[i].hidden||(s+=Math.abs(n))}return s}calculateCircumference(t){const e=this._cachedMeta.total;return e>0&&!isNaN(t)?O*(Math.abs(t)/e):0}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart,s=i.data.labels||[],n=ne(e._parsed[t],i.options.locale);return{label:s[t]||"",value:n}}getMaxBorderWidth(t){let e=0;const i=this.chart;let s,n,o,a,r;if(!t)for(s=0,n=i.data.datasets.length;s<n;++s)if(i.isDatasetVisible(s)){o=i.getDatasetMeta(s),t=o.data,a=o.controller;break}if(!t)return 0;for(s=0,n=t.length;s<n;++s)r=a.resolveDataElementOptions(s),"inner"!==r.borderAlign&&(e=Math.max(e,r.borderWidth||0,r.hoverBorderWidth||0));return e}getMaxOffset(t){let e=0;for(let i=0,s=t.length;i<s;++i){const t=this.resolveDataElementOptions(i);e=Math.max(e,t.offset||0,t.hoverOffset||0)}return e}_getRingWeightOffset(t){let e=0;for(let i=0;i<t;++i)this.chart.isDatasetVisible(i)&&(e+=this._getRingWeight(i));return e}_getRingWeight(t){return Math.max(l(this.chart.data.datasets[t].weight,1),0)}_getVisibleDatasetWeightTotal(){return this._getRingWeightOffset(this.chart.data.datasets.length)||1}}class Yn extends js{static id="polarArea";static defaults={dataElementType:"arc",animation:{animateRotate:!0,animateScale:!0},animations:{numbers:{type:"number",properties:["x","y","startAngle","endAngle","innerRadius","outerRadius"]}},indexAxis:"r",startAngle:0};static overrides={aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data;if(e.labels.length&&e.datasets.length){const{labels:{pointStyle:i,color:s}}=t.legend.options;return e.labels.map(((e,n)=>{const o=t.getDatasetMeta(0).controller.getStyle(n);return{text:e,fillStyle:o.backgroundColor,strokeStyle:o.borderColor,fontColor:s,lineWidth:o.borderWidth,pointStyle:i,hidden:!t.getDataVisibility(n),index:n}}))}return[]}},onClick(t,e,i){i.chart.toggleDataVisibility(e.index),i.chart.update()}}},scales:{r:{type:"radialLinear",angleLines:{display:!1},beginAtZero:!0,grid:{circular:!0},pointLabels:{display:!1},startAngle:0}}};constructor(t,e){super(t,e),this.innerRadius=void 0,this.outerRadius=void 0}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart,s=i.data.labels||[],n=ne(e._parsed[t].r,i.options.locale);return{label:s[t]||"",value:n}}parseObjectData(t,e,i,s){return ii.bind(this)(t,e,i,s)}update(t){const e=this._cachedMeta.data;this._updateRadius(),this.updateElements(e,0,e.length,t)}getMinMax(){const t=this._cachedMeta,e={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY};return t.data.forEach(((t,i)=>{const s=this.getParsed(i).r;!isNaN(s)&&this.chart.getDataVisibility(i)&&(s<e.min&&(e.min=s),s>e.max&&(e.max=s))})),e}_updateRadius(){const t=this.chart,e=t.chartArea,i=t.options,s=Math.min(e.right-e.left,e.bottom-e.top),n=Math.max(s/2,0),o=(n-Math.max(i.cutoutPercentage?n/100*i.cutoutPercentage:1,0))/t.getVisibleDatasetCount();this.outerRadius=n-o*this.index,this.innerRadius=this.outerRadius-o}updateElements(t,e,i,s){const n="reset"===s,o=this.chart,a=o.options.animation,r=this._cachedMeta.rScale,l=r.xCenter,h=r.yCenter,c=r.getIndexAngle(0)-.5*C;let d,u=c;const f=360/this.countVisibleElements();for(d=0;d<e;++d)u+=this._computeAngle(d,s,f);for(d=e;d<e+i;d++){const e=t[d];let i=u,g=u+this._computeAngle(d,s,f),p=o.getDataVisibility(d)?r.getDistanceFromCenterForValue(this.getParsed(d).r):0;u=g,n&&(a.animateScale&&(p=0),a.animateRotate&&(i=g=c));const m={x:l,y:h,innerRadius:0,outerRadius:p,startAngle:i,endAngle:g,options:this.resolveDataElementOptions(d,e.active?"active":s)};this.updateElement(e,d,m,s)}}countVisibleElements(){const t=this._cachedMeta;let e=0;return t.data.forEach(((t,i)=>{!isNaN(this.getParsed(i).r)&&this.chart.getDataVisibility(i)&&e++})),e}_computeAngle(t,e,i){return this.chart.getDataVisibility(t)?$(this.resolveDataElementOptions(t,e).angle||i):0}}var Un=Object.freeze({__proto__:null,BarController:class extends js{static id="bar";static defaults={datasetElementType:!1,dataElementType:"bar",categoryPercentage:.8,barPercentage:.9,grouped:!0,animations:{numbers:{type:"number",properties:["x","y","base","width","height"]}}};static overrides={scales:{_index_:{type:"category",offset:!0,grid:{offset:!0}},_value_:{type:"linear",beginAtZero:!0}}};parsePrimitiveData(t,e,i,s){return Vn(t,e,i,s)}parseArrayData(t,e,i,s){return Vn(t,e,i,s)}parseObjectData(t,e,i,s){const{iScale:n,vScale:o}=t,{xAxisKey:a="x",yAxisKey:r="y"}=this._parsing,l="x"===n.axis?a:r,h="x"===o.axis?a:r,c=[];let d,u,f,g;for(d=i,u=i+s;d<u;++d)g=e[d],f={},f[n.axis]=n.parse(M(g,l),d),c.push(Fn(M(g,h),f,o,d));return c}updateRangeFromParsed(t,e,i,s){super.updateRangeFromParsed(t,e,i,s);const n=i._custom;n&&e===this._cachedMeta.vScale&&(t.min=Math.min(t.min,n.min),t.max=Math.max(t.max,n.max))}getMaxOverflow(){return 0}getLabelAndValue(t){const e=this._cachedMeta,{iScale:i,vScale:s}=e,n=this.getParsed(t),o=n._custom,a=Bn(o)?"["+o.start+", "+o.end+"]":""+s.getLabelForValue(n[s.axis]);return{label:""+i.getLabelForValue(n[i.axis]),value:a}}initialize(){this.enableOptionSharing=!0,super.initialize();this._cachedMeta.stack=this.getDataset().stack}update(t){const e=this._cachedMeta;this.updateElements(e.data,0,e.data.length,t)}updateElements(t,e,i,n){const o="reset"===n,{index:a,_cachedMeta:{vScale:r}}=this,l=r.getBasePixel(),h=r.isHorizontal(),c=this._getRuler(),{sharedOptions:d,includeOptions:u}=this._getSharedOptions(e,n);for(let f=e;f<e+i;f++){const e=this.getParsed(f),i=o||s(e[r.axis])?{base:l,head:l}:this._calculateBarValuePixels(f),g=this._calculateBarIndexPixels(f,c),p=(e._stacks||{})[r.axis],m={horizontal:h,base:i.base,enableBorderRadius:!p||Bn(e._custom)||a===p._top||a===p._bottom,x:h?i.head:g.center,y:h?g.center:i.head,height:h?g.size:Math.abs(i.size),width:h?Math.abs(i.size):g.size};u&&(m.options=d||this.resolveDataElementOptions(f,t[f].active?"active":n));const x=m.options||t[f].options;Wn(m,x,p,a),jn(m,x,c.ratio),this.updateElement(t[f],f,m,n)}}_getStacks(t,e){const{iScale:i}=this._cachedMeta,n=i.getMatchingVisibleMetas(this._type).filter((t=>t.controller.options.grouped)),o=i.options.stacked,a=[],r=this._cachedMeta.controller.getParsed(e),l=r&&r[i.axis],h=t=>{const e=t._parsed.find((t=>t[i.axis]===l)),n=e&&e[t.vScale.axis];if(s(n)||isNaN(n))return!0};for(const i of n)if((void 0===e||!h(i))&&((!1===o||-1===a.indexOf(i.stack)||void 0===o&&void 0===i.stack)&&a.push(i.stack),i.index===t))break;return a.length||a.push(void 0),a}_getStackCount(t){return this._getStacks(void 0,t).length}_getAxisCount(){return this._getAxis().length}getFirstScaleIdForIndexAxis(){const t=this.chart.scales,e=this.chart.options.indexAxis;return Object.keys(t).filter((i=>t[i].axis===e)).shift()}_getAxis(){const t={},e=this.getFirstScaleIdForIndexAxis();for(const i of this.chart.data.datasets)t[l("x"===this.chart.options.indexAxis?i.xAxisID:i.yAxisID,e)]=!0;return Object.keys(t)}_getStackIndex(t,e,i){const s=this._getStacks(t,i),n=void 0!==e?s.indexOf(e):-1;return-1===n?s.length-1:n}_getRuler(){const t=this.options,e=this._cachedMeta,i=e.iScale,s=[];let n,o;for(n=0,o=e.data.length;n<o;++n)s.push(i.getPixelForValue(this.getParsed(n)[i.axis],n));const a=t.barThickness;return{min:a||zn(e),pixels:s,start:i._startPixel,end:i._endPixel,stackCount:this._getStackCount(),scale:i,grouped:t.grouped,ratio:a?1:t.categoryPercentage*t.barPercentage}}_calculateBarValuePixels(t){const{_cachedMeta:{vScale:e,_stacked:i,index:n},options:{base:o,minBarLength:a}}=this,r=o||0,l=this.getParsed(t),h=l._custom,c=Bn(h);let d,u,f=l[e.axis],g=0,p=i?this.applyStack(e,l,i):f;p!==f&&(g=p-f,p=f),c&&(f=h.barStart,p=h.barEnd-h.barStart,0!==f&&F(f)!==F(h.barEnd)&&(g=0),g+=f);const m=s(o)||c?g:o;let x=e.getPixelForValue(m);if(d=this.chart.getDataVisibility(t)?e.getPixelForValue(g+p):x,u=d-x,Math.abs(u)<a){u=function(t,e,i){return 0!==t?F(t):(e.isHorizontal()?1:-1)*(e.min>=i?1:-1)}(u,e,r)*a,f===r&&(x-=u/2);const t=e.getPixelForDecimal(0),s=e.getPixelForDecimal(1),o=Math.min(t,s),h=Math.max(t,s);x=Math.max(Math.min(x,h),o),d=x+u,i&&!c&&(l._stacks[e.axis]._visualValues[n]=e.getValueForPixel(d)-e.getValueForPixel(x))}if(x===e.getPixelForValue(r)){const t=F(u)*e.getLineWidthForValue(r)/2;x+=t,u-=t}return{size:u,base:x,head:d,center:d+u/2}}_calculateBarIndexPixels(t,e){const i=e.scale,n=this.options,o=n.skipNull,a=l(n.maxBarThickness,1/0);let r,h;const c=this._getAxisCount();if(e.grouped){const i=o?this._getStackCount(t):e.stackCount,d="flex"===n.barThickness?function(t,e,i,s){const n=e.pixels,o=n[t];let a=t>0?n[t-1]:null,r=t<n.length-1?n[t+1]:null;const l=i.categoryPercentage;null===a&&(a=o-(null===r?e.end-e.start:r-o)),null===r&&(r=o+o-a);const h=o-(o-Math.min(a,r))/2*l;return{chunk:Math.abs(r-a)/2*l/s,ratio:i.barPercentage,start:h}}(t,e,n,i*c):function(t,e,i,n){const o=i.barThickness;let a,r;return s(o)?(a=e.min*i.categoryPercentage,r=i.barPercentage):(a=o*n,r=1),{chunk:a/n,ratio:r,start:e.pixels[t]-a/2}}(t,e,n,i*c),u="x"===this.chart.options.indexAxis?this.getDataset().xAxisID:this.getDataset().yAxisID,f=this._getAxis().indexOf(l(u,this.getFirstScaleIdForIndexAxis())),g=this._getStackIndex(this.index,this._cachedMeta.stack,o?t:void 0)+f;r=d.start+d.chunk*g+d.chunk/2,h=Math.min(a,d.chunk*d.ratio)}else r=i.getPixelForValue(this.getParsed(t)[i.axis],t),h=Math.min(a,e.min*e.ratio);return{base:r-h/2,head:r+h/2,center:r,size:h}}draw(){const t=this._cachedMeta,e=t.vScale,i=t.data,s=i.length;let n=0;for(;n<s;++n)null===this.getParsed(n)[e.axis]||i[n].hidden||i[n].draw(this._ctx)}},BubbleController:class extends js{static id="bubble";static defaults={datasetElementType:!1,dataElementType:"point",animations:{numbers:{type:"number",properties:["x","y","borderWidth","radius"]}}};static overrides={scales:{x:{type:"linear"},y:{type:"linear"}}};initialize(){this.enableOptionSharing=!0,super.initialize()}parsePrimitiveData(t,e,i,s){const n=super.parsePrimitiveData(t,e,i,s);for(let t=0;t<n.length;t++)n[t]._custom=this.resolveDataElementOptions(t+i).radius;return n}parseArrayData(t,e,i,s){const n=super.parseArrayData(t,e,i,s);for(let t=0;t<n.length;t++){const s=e[i+t];n[t]._custom=l(s[2],this.resolveDataElementOptions(t+i).radius)}return n}parseObjectData(t,e,i,s){const n=super.parseObjectData(t,e,i,s);for(let t=0;t<n.length;t++){const s=e[i+t];n[t]._custom=l(s&&s.r&&+s.r,this.resolveDataElementOptions(t+i).radius)}return n}getMaxOverflow(){const t=this._cachedMeta.data;let e=0;for(let i=t.length-1;i>=0;--i)e=Math.max(e,t[i].size(this.resolveDataElementOptions(i))/2);return e>0&&e}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart.data.labels||[],{xScale:s,yScale:n}=e,o=this.getParsed(t),a=s.getLabelForValue(o.x),r=n.getLabelForValue(o.y),l=o._custom;return{label:i[t]||"",value:"("+a+", "+r+(l?", "+l:"")+")"}}update(t){const e=this._cachedMeta.data;this.updateElements(e,0,e.length,t)}updateElements(t,e,i,s){const n="reset"===s,{iScale:o,vScale:a}=this._cachedMeta,{sharedOptions:r,includeOptions:l}=this._getSharedOptions(e,s),h=o.axis,c=a.axis;for(let d=e;d<e+i;d++){const e=t[d],i=!n&&this.getParsed(d),u={},f=u[h]=n?o.getPixelForDecimal(.5):o.getPixelForValue(i[h]),g=u[c]=n?a.getBasePixel():a.getPixelForValue(i[c]);u.skip=isNaN(f)||isNaN(g),l&&(u.options=r||this.resolveDataElementOptions(d,e.active?"active":s),n&&(u.options.radius=0)),this.updateElement(e,d,u,s)}}resolveDataElementOptions(t,e){const i=this.getParsed(t);let s=super.resolveDataElementOptions(t,e);s.$shared&&(s=Object.assign({},s,{$shared:!1}));const n=s.radius;return"active"!==e&&(s.radius=0),s.radius+=l(i&&i._custom,n),s}},DoughnutController:$n,LineController:class extends js{static id="line";static defaults={datasetElementType:"line",dataElementType:"point",showLine:!0,spanGaps:!1};static overrides={scales:{_index_:{type:"category"},_value_:{type:"linear"}}};initialize(){this.enableOptionSharing=!0,this.supportsDecimation=!0,super.initialize()}update(t){const e=this._cachedMeta,{dataset:i,data:s=[],_dataset:n}=e,o=this.chart._animationsDisabled;let{start:a,count:r}=pt(e,s,o);this._drawStart=a,this._drawCount=r,mt(e)&&(a=0,r=s.length),i._chart=this.chart,i._datasetIndex=this.index,i._decimated=!!n._decimated,i.points=s;const l=this.resolveDatasetElementOptions(t);this.options.showLine||(l.borderWidth=0),l.segment=this.options.segment,this.updateElement(i,void 0,{animated:!o,options:l},t),this.updateElements(s,a,r,t)}updateElements(t,e,i,n){const o="reset"===n,{iScale:a,vScale:r,_stacked:l,_dataset:h}=this._cachedMeta,{sharedOptions:c,includeOptions:d}=this._getSharedOptions(e,n),u=a.axis,f=r.axis,{spanGaps:g,segment:p}=this.options,m=N(g)?g:Number.POSITIVE_INFINITY,x=this.chart._animationsDisabled||o||"none"===n,b=e+i,_=t.length;let y=e>0&&this.getParsed(e-1);for(let i=0;i<_;++i){const g=t[i],_=x?g:{};if(i<e||i>=b){_.skip=!0;continue}const v=this.getParsed(i),M=s(v[f]),w=_[u]=a.getPixelForValue(v[u],i),k=_[f]=o||M?r.getBasePixel():r.getPixelForValue(l?this.applyStack(r,v,l):v[f],i);_.skip=isNaN(w)||isNaN(k)||M,_.stop=i>0&&Math.abs(v[u]-y[u])>m,p&&(_.parsed=v,_.raw=h.data[i]),d&&(_.options=c||this.resolveDataElementOptions(i,g.active?"active":n)),x||this.updateElement(g,i,_,n),y=v}}getMaxOverflow(){const t=this._cachedMeta,e=t.dataset,i=e.options&&e.options.borderWidth||0,s=t.data||[];if(!s.length)return i;const n=s[0].size(this.resolveDataElementOptions(0)),o=s[s.length-1].size(this.resolveDataElementOptions(s.length-1));return Math.max(i,n,o)/2}draw(){const t=this._cachedMeta;t.dataset.updateControlPoints(this.chart.chartArea,t.iScale.axis),super.draw()}},PieController:class extends $n{static id="pie";static defaults={cutout:0,rotation:0,circumference:360,radius:"100%"}},PolarAreaController:Yn,RadarController:class extends js{static id="radar";static defaults={datasetElementType:"line",dataElementType:"point",indexAxis:"r",showLine:!0,elements:{line:{fill:"start"}}};static overrides={aspectRatio:1,scales:{r:{type:"radialLinear"}}};getLabelAndValue(t){const e=this._cachedMeta.vScale,i=this.getParsed(t);return{label:e.getLabels()[t],value:""+e.getLabelForValue(i[e.axis])}}parseObjectData(t,e,i,s){return ii.bind(this)(t,e,i,s)}update(t){const e=this._cachedMeta,i=e.dataset,s=e.data||[],n=e.iScale.getLabels();if(i.points=s,"resize"!==t){const e=this.resolveDatasetElementOptions(t);this.options.showLine||(e.borderWidth=0);const o={_loop:!0,_fullLoop:n.length===s.length,options:e};this.updateElement(i,void 0,o,t)}this.updateElements(s,0,s.length,t)}updateElements(t,e,i,s){const n=this._cachedMeta.rScale,o="reset"===s;for(let a=e;a<e+i;a++){const e=t[a],i=this.resolveDataElementOptions(a,e.active?"active":s),r=n.getPointPositionForValue(a,this.getParsed(a).r),l=o?n.xCenter:r.x,h=o?n.yCenter:r.y,c={x:l,y:h,angle:r.angle,skip:isNaN(l)||isNaN(h),options:i};this.updateElement(e,a,c,s)}}},ScatterController:class extends js{static id="scatter";static defaults={datasetElementType:!1,dataElementType:"point",showLine:!1,fill:!1};static overrides={interaction:{mode:"point"},scales:{x:{type:"linear"},y:{type:"linear"}}};getLabelAndValue(t){const e=this._cachedMeta,i=this.chart.data.labels||[],{xScale:s,yScale:n}=e,o=this.getParsed(t),a=s.getLabelForValue(o.x),r=n.getLabelForValue(o.y);return{label:i[t]||"",value:"("+a+", "+r+")"}}update(t){const e=this._cachedMeta,{data:i=[]}=e,s=this.chart._animationsDisabled;let{start:n,count:o}=pt(e,i,s);if(this._drawStart=n,this._drawCount=o,mt(e)&&(n=0,o=i.length),this.options.showLine){this.datasetElementType||this.addElements();const{dataset:n,_dataset:o}=e;n._chart=this.chart,n._datasetIndex=this.index,n._decimated=!!o._decimated,n.points=i;const a=this.resolveDatasetElementOptions(t);a.segment=this.options.segment,this.updateElement(n,void 0,{animated:!s,options:a},t)}else this.datasetElementType&&(delete e.dataset,this.datasetElementType=!1);this.updateElements(i,n,o,t)}addElements(){const{showLine:t}=this.options;!this.datasetElementType&&t&&(this.datasetElementType=this.chart.registry.getElement("line")),super.addElements()}updateElements(t,e,i,n){const o="reset"===n,{iScale:a,vScale:r,_stacked:l,_dataset:h}=this._cachedMeta,c=this.resolveDataElementOptions(e,n),d=this.getSharedOptions(c),u=this.includeOptions(n,d),f=a.axis,g=r.axis,{spanGaps:p,segment:m}=this.options,x=N(p)?p:Number.POSITIVE_INFINITY,b=this.chart._animationsDisabled||o||"none"===n;let _=e>0&&this.getParsed(e-1);for(let c=e;c<e+i;++c){const e=t[c],i=this.getParsed(c),p=b?e:{},y=s(i[g]),v=p[f]=a.getPixelForValue(i[f],c),M=p[g]=o||y?r.getBasePixel():r.getPixelForValue(l?this.applyStack(r,i,l):i[g],c);p.skip=isNaN(v)||isNaN(M)||y,p.stop=c>0&&Math.abs(i[f]-_[f])>x,m&&(p.parsed=i,p.raw=h.data[c]),u&&(p.options=d||this.resolveDataElementOptions(c,e.active?"active":n)),b||this.updateElement(e,c,p,n),_=i}this.updateSharedOptions(d,n,c)}getMaxOverflow(){const t=this._cachedMeta,e=t.data||[];if(!this.options.showLine){let t=0;for(let i=e.length-1;i>=0;--i)t=Math.max(t,e[i].size(this.resolveDataElementOptions(i))/2);return t>0&&t}const i=t.dataset,s=i.options&&i.options.borderWidth||0;if(!e.length)return s;const n=e[0].size(this.resolveDataElementOptions(0)),o=e[e.length-1].size(this.resolveDataElementOptions(e.length-1));return Math.max(s,n,o)/2}}});function Xn(t,e,i,s){const n=vi(t.options.borderRadius,["outerStart","outerEnd","innerStart","innerEnd"]);const o=(i-e)/2,a=Math.min(o,s*e/2),r=t=>{const e=(i-Math.min(o,t))*s/2;return Z(t,0,Math.min(o,e))};return{outerStart:r(n.outerStart),outerEnd:r(n.outerEnd),innerStart:Z(n.innerStart,0,a),innerEnd:Z(n.innerEnd,0,a)}}function qn(t,e,i,s){return{x:i+t*Math.cos(e),y:s+t*Math.sin(e)}}function Kn(t,e,i,s,n,o){const{x:a,y:r,startAngle:l,pixelMargin:h,innerRadius:c}=e,d=Math.max(e.outerRadius+s+i-h,0),u=c>0?c+s+i+h:0;let f=0;const g=n-l;if(s){const t=((c>0?c-s:0)+(d>0?d-s:0))/2;f=(g-(0!==t?g*t/(t+s):g))/2}const p=(g-Math.max(.001,g*d-i/C)/d)/2,m=l+p+f,x=n-p-f,{outerStart:b,outerEnd:_,innerStart:y,innerEnd:v}=Xn(e,u,d,x-m),M=d-b,w=d-_,k=m+b/M,S=x-_/w,P=u+y,D=u+v,O=m+y/P,A=x-v/D;if(t.beginPath(),o){const e=(k+S)/2;if(t.arc(a,r,d,k,e),t.arc(a,r,d,e,S),_>0){const e=qn(w,S,a,r);t.arc(e.x,e.y,_,S,x+E)}const i=qn(D,x,a,r);if(t.lineTo(i.x,i.y),v>0){const e=qn(D,A,a,r);t.arc(e.x,e.y,v,x+E,A+Math.PI)}const s=(x-v/u+(m+y/u))/2;if(t.arc(a,r,u,x-v/u,s,!0),t.arc(a,r,u,s,m+y/u,!0),y>0){const e=qn(P,O,a,r);t.arc(e.x,e.y,y,O+Math.PI,m-E)}const n=qn(M,m,a,r);if(t.lineTo(n.x,n.y),b>0){const e=qn(M,k,a,r);t.arc(e.x,e.y,b,m-E,k)}}else{t.moveTo(a,r);const e=Math.cos(k)*d+a,i=Math.sin(k)*d+r;t.lineTo(e,i);const s=Math.cos(S)*d+a,n=Math.sin(S)*d+r;t.lineTo(s,n)}t.closePath()}function Gn(t,e,i,s,n){const{fullCircles:o,startAngle:a,circumference:r,options:l}=e,{borderWidth:h,borderJoinStyle:c,borderDash:d,borderDashOffset:u,borderRadius:f}=l,g="inner"===l.borderAlign;if(!h)return;t.setLineDash(d||[]),t.lineDashOffset=u,g?(t.lineWidth=2*h,t.lineJoin=c||"round"):(t.lineWidth=h,t.lineJoin=c||"bevel");let p=e.endAngle;if(o){Kn(t,e,i,s,p,n);for(let e=0;e<o;++e)t.stroke();isNaN(r)||(p=a+(r%O||O))}g&&function(t,e,i){const{startAngle:s,pixelMargin:n,x:o,y:a,outerRadius:r,innerRadius:l}=e;let h=n/r;t.beginPath(),t.arc(o,a,r,s-h,i+h),l>n?(h=n/l,t.arc(o,a,l,i+h,s-h,!0)):t.arc(o,a,n,i+E,s-E),t.closePath(),t.clip()}(t,e,p),l.selfJoin&&p-a>=C&&0===f&&"miter"!==c&&function(t,e,i){const{startAngle:s,x:n,y:o,outerRadius:a,innerRadius:r,options:l}=e,{borderWidth:h,borderJoinStyle:c}=l,d=Math.min(h/a,G(s-i));if(t.beginPath(),t.arc(n,o,a-h/2,s+d/2,i-d/2),r>0){const e=Math.min(h/r,G(s-i));t.arc(n,o,r+h/2,i-e/2,s+e/2,!0)}else{const e=Math.min(h/2,a*G(s-i));if("round"===c)t.arc(n,o,e,i-C/2,s+C/2,!0);else if("bevel"===c){const a=2*e*e,r=-a*Math.cos(i+C/2)+n,l=-a*Math.sin(i+C/2)+o,h=a*Math.cos(s+C/2)+n,c=a*Math.sin(s+C/2)+o;t.lineTo(r,l),t.lineTo(h,c)}}t.closePath(),t.moveTo(0,0),t.rect(0,0,t.canvas.width,t.canvas.height),t.clip("evenodd")}(t,e,p),o||(Kn(t,e,i,s,p,n),t.stroke())}function Jn(t,e,i=e){t.lineCap=l(i.borderCapStyle,e.borderCapStyle),t.setLineDash(l(i.borderDash,e.borderDash)),t.lineDashOffset=l(i.borderDashOffset,e.borderDashOffset),t.lineJoin=l(i.borderJoinStyle,e.borderJoinStyle),t.lineWidth=l(i.borderWidth,e.borderWidth),t.strokeStyle=l(i.borderColor,e.borderColor)}function Zn(t,e,i){t.lineTo(i.x,i.y)}function Qn(t,e,i={}){const s=t.length,{start:n=0,end:o=s-1}=i,{start:a,end:r}=e,l=Math.max(n,a),h=Math.min(o,r),c=n<a&&o<a||n>r&&o>r;return{count:s,start:l,loop:e.loop,ilen:h<l&&!c?s+h-l:h-l}}function to(t,e,i,s){const{points:n,options:o}=e,{count:a,start:r,loop:l,ilen:h}=Qn(n,i,s),c=function(t){return t.stepped?Fe:t.tension||"monotone"===t.cubicInterpolationMode?Ve:Zn}(o);let d,u,f,{move:g=!0,reverse:p}=s||{};for(d=0;d<=h;++d)u=n[(r+(p?h-d:d))%a],u.skip||(g?(t.moveTo(u.x,u.y),g=!1):c(t,f,u,p,o.stepped),f=u);return l&&(u=n[(r+(p?h:0))%a],c(t,f,u,p,o.stepped)),!!l}function eo(t,e,i,s){const n=e.points,{count:o,start:a,ilen:r}=Qn(n,i,s),{move:l=!0,reverse:h}=s||{};let c,d,u,f,g,p,m=0,x=0;const b=t=>(a+(h?r-t:t))%o,_=()=>{f!==g&&(t.lineTo(m,g),t.lineTo(m,f),t.lineTo(m,p))};for(l&&(d=n[b(0)],t.moveTo(d.x,d.y)),c=0;c<=r;++c){if(d=n[b(c)],d.skip)continue;const e=d.x,i=d.y,s=0|e;s===u?(i<f?f=i:i>g&&(g=i),m=(x*m+e)/++x):(_(),t.lineTo(e,i),u=s,x=0,f=g=i),p=i}_()}function io(t){const e=t.options,i=e.borderDash&&e.borderDash.length;return!(t._decimated||t._loop||e.tension||"monotone"===e.cubicInterpolationMode||e.stepped||i)?eo:to}const so="function"==typeof Path2D;function no(t,e,i,s){so&&!e.options.segment?function(t,e,i,s){let n=e._path;n||(n=e._path=new Path2D,e.path(n,i,s)&&n.closePath()),Jn(t,e.options),t.stroke(n)}(t,e,i,s):function(t,e,i,s){const{segments:n,options:o}=e,a=io(e);for(const r of n)Jn(t,o,r.style),t.beginPath(),a(t,e,r,{start:i,end:i+s-1})&&t.closePath(),t.stroke()}(t,e,i,s)}class oo extends $s{static id="line";static defaults={borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",borderWidth:3,capBezierPoints:!0,cubicInterpolationMode:"default",fill:!1,spanGaps:!1,stepped:!1,tension:0};static defaultRoutes={backgroundColor:"backgroundColor",borderColor:"borderColor"};static descriptors={_scriptable:!0,_indexable:t=>"borderDash"!==t&&"fill"!==t};constructor(t){super(),this.animated=!0,this.options=void 0,this._chart=void 0,this._loop=void 0,this._fullLoop=void 0,this._path=void 0,this._points=void 0,this._segments=void 0,this._decimated=!1,this._pointsUpdated=!1,this._datasetIndex=void 0,t&&Object.assign(this,t)}updateControlPoints(t,e){const i=this.options;if((i.tension||"monotone"===i.cubicInterpolationMode)&&!i.stepped&&!this._pointsUpdated){const s=i.spanGaps?this._loop:this._fullLoop;hi(this._points,i,t,s,e),this._pointsUpdated=!0}}set points(t){this._points=t,delete this._segments,delete this._path,this._pointsUpdated=!1}get points(){return this._points}get segments(){return this._segments||(this._segments=zi(this,this.options.segment))}first(){const t=this.segments,e=this.points;return t.length&&e[t[0].start]}last(){const t=this.segments,e=this.points,i=t.length;return i&&e[t[i-1].end]}interpolate(t,e){const i=this.options,s=t[e],n=this.points,o=Ii(this,{property:e,start:s,end:s});if(!o.length)return;const a=[],r=function(t){return t.stepped?pi:t.tension||"monotone"===t.cubicInterpolationMode?mi:gi}(i);let l,h;for(l=0,h=o.length;l<h;++l){const{start:h,end:c}=o[l],d=n[h],u=n[c];if(d===u){a.push(d);continue}const f=r(d,u,Math.abs((s-d[e])/(u[e]-d[e])),i.stepped);f[e]=t[e],a.push(f)}return 1===a.length?a[0]:a}pathSegment(t,e,i){return io(this)(t,this,e,i)}path(t,e,i){const s=this.segments,n=io(this);let o=this._loop;e=e||0,i=i||this.points.length-e;for(const a of s)o&=n(t,this,a,{start:e,end:e+i-1});return!!o}draw(t,e,i,s){const n=this.options||{};(this.points||[]).length&&n.borderWidth&&(t.save(),no(t,this,i,s),t.restore()),this.animated&&(this._pointsUpdated=!1,this._path=void 0)}}function ao(t,e,i,s){const n=t.options,{[i]:o}=t.getProps([i],s);return Math.abs(e-o)<n.radius+n.hitRadius}function ro(t,e){const{x:i,y:s,base:n,width:o,height:a}=t.getProps(["x","y","base","width","height"],e);let r,l,h,c,d;return t.horizontal?(d=a/2,r=Math.min(i,n),l=Math.max(i,n),h=s-d,c=s+d):(d=o/2,r=i-d,l=i+d,h=Math.min(s,n),c=Math.max(s,n)),{left:r,top:h,right:l,bottom:c}}function lo(t,e,i,s){return t?0:Z(e,i,s)}function ho(t){const e=ro(t),i=e.right-e.left,s=e.bottom-e.top,n=function(t,e,i){const s=t.options.borderWidth,n=t.borderSkipped,o=Mi(s);return{t:lo(n.top,o.top,0,i),r:lo(n.right,o.right,0,e),b:lo(n.bottom,o.bottom,0,i),l:lo(n.left,o.left,0,e)}}(t,i/2,s/2),a=function(t,e,i){const{enableBorderRadius:s}=t.getProps(["enableBorderRadius"]),n=t.options.borderRadius,a=wi(n),r=Math.min(e,i),l=t.borderSkipped,h=s||o(n);return{topLeft:lo(!h||l.top||l.left,a.topLeft,0,r),topRight:lo(!h||l.top||l.right,a.topRight,0,r),bottomLeft:lo(!h||l.bottom||l.left,a.bottomLeft,0,r),bottomRight:lo(!h||l.bottom||l.right,a.bottomRight,0,r)}}(t,i/2,s/2);return{outer:{x:e.left,y:e.top,w:i,h:s,radius:a},inner:{x:e.left+n.l,y:e.top+n.t,w:i-n.l-n.r,h:s-n.t-n.b,radius:{topLeft:Math.max(0,a.topLeft-Math.max(n.t,n.l)),topRight:Math.max(0,a.topRight-Math.max(n.t,n.r)),bottomLeft:Math.max(0,a.bottomLeft-Math.max(n.b,n.l)),bottomRight:Math.max(0,a.bottomRight-Math.max(n.b,n.r))}}}}function co(t,e,i,s){const n=null===e,o=null===i,a=t&&!(n&&o)&&ro(t,s);return a&&(n||tt(e,a.left,a.right))&&(o||tt(i,a.top,a.bottom))}function uo(t,e){t.rect(e.x,e.y,e.w,e.h)}function fo(t,e,i={}){const s=t.x!==i.x?-e:0,n=t.y!==i.y?-e:0,o=(t.x+t.w!==i.x+i.w?e:0)-s,a=(t.y+t.h!==i.y+i.h?e:0)-n;return{x:t.x+s,y:t.y+n,w:t.w+o,h:t.h+a,radius:t.radius}}var go=Object.freeze({__proto__:null,ArcElement:class extends $s{static id="arc";static defaults={borderAlign:"center",borderColor:"#fff",borderDash:[],borderDashOffset:0,borderJoinStyle:void 0,borderRadius:0,borderWidth:2,offset:0,spacing:0,angle:void 0,circular:!0,selfJoin:!1};static defaultRoutes={backgroundColor:"backgroundColor"};static descriptors={_scriptable:!0,_indexable:t=>"borderDash"!==t};circumference;endAngle;fullCircles;innerRadius;outerRadius;pixelMargin;startAngle;constructor(t){super(),this.options=void 0,this.circumference=void 0,this.startAngle=void 0,this.endAngle=void 0,this.innerRadius=void 0,this.outerRadius=void 0,this.pixelMargin=0,this.fullCircles=0,t&&Object.assign(this,t)}inRange(t,e,i){const s=this.getProps(["x","y"],i),{angle:n,distance:o}=X(s,{x:t,y:e}),{startAngle:a,endAngle:r,innerRadius:h,outerRadius:c,circumference:d}=this.getProps(["startAngle","endAngle","innerRadius","outerRadius","circumference"],i),u=(this.options.spacing+this.options.borderWidth)/2,f=l(d,r-a),g=J(n,a,r)&&a!==r,p=f>=O||g,m=tt(o,h+u,c+u);return p&&m}getCenterPoint(t){const{x:e,y:i,startAngle:s,endAngle:n,innerRadius:o,outerRadius:a}=this.getProps(["x","y","startAngle","endAngle","innerRadius","outerRadius"],t),{offset:r,spacing:l}=this.options,h=(s+n)/2,c=(o+a+l+r)/2;return{x:e+Math.cos(h)*c,y:i+Math.sin(h)*c}}tooltipPosition(t){return this.getCenterPoint(t)}draw(t){const{options:e,circumference:i}=this,s=(e.offset||0)/4,n=(e.spacing||0)/2,o=e.circular;if(this.pixelMargin="inner"===e.borderAlign?.33:0,this.fullCircles=i>O?Math.floor(i/O):0,0===i||this.innerRadius<0||this.outerRadius<0)return;t.save();const a=(this.startAngle+this.endAngle)/2;t.translate(Math.cos(a)*s,Math.sin(a)*s);const r=s*(1-Math.sin(Math.min(C,i||0)));t.fillStyle=e.backgroundColor,t.strokeStyle=e.borderColor,function(t,e,i,s,n){const{fullCircles:o,startAngle:a,circumference:r}=e;let l=e.endAngle;if(o){Kn(t,e,i,s,l,n);for(let e=0;e<o;++e)t.fill();isNaN(r)||(l=a+(r%O||O))}Kn(t,e,i,s,l,n),t.fill()}(t,this,r,n,o),Gn(t,this,r,n,o),t.restore()}},BarElement:class extends $s{static id="bar";static defaults={borderSkipped:"start",borderWidth:0,borderRadius:0,inflateAmount:"auto",pointStyle:void 0};static defaultRoutes={backgroundColor:"backgroundColor",borderColor:"borderColor"};constructor(t){super(),this.options=void 0,this.horizontal=void 0,this.base=void 0,this.width=void 0,this.height=void 0,this.inflateAmount=void 0,t&&Object.assign(this,t)}draw(t){const{inflateAmount:e,options:{borderColor:i,backgroundColor:s}}=this,{inner:n,outer:o}=ho(this),a=(r=o.radius).topLeft||r.topRight||r.bottomLeft||r.bottomRight?He:uo;var r;t.save(),o.w===n.w&&o.h===n.h||(t.beginPath(),a(t,fo(o,e,n)),t.clip(),a(t,fo(n,-e,o)),t.fillStyle=i,t.fill("evenodd")),t.beginPath(),a(t,fo(n,e)),t.fillStyle=s,t.fill(),t.restore()}inRange(t,e,i){return co(this,t,e,i)}inXRange(t,e){return co(this,t,null,e)}inYRange(t,e){return co(this,null,t,e)}getCenterPoint(t){const{x:e,y:i,base:s,horizontal:n}=this.getProps(["x","y","base","horizontal"],t);return{x:n?(e+s)/2:e,y:n?i:(i+s)/2}}getRange(t){return"x"===t?this.width/2:this.height/2}},LineElement:oo,PointElement:class extends $s{static id="point";parsed;skip;stop;static defaults={borderWidth:1,hitRadius:1,hoverBorderWidth:1,hoverRadius:4,pointStyle:"circle",radius:3,rotation:0};static defaultRoutes={backgroundColor:"backgroundColor",borderColor:"borderColor"};constructor(t){super(),this.options=void 0,this.parsed=void 0,this.skip=void 0,this.stop=void 0,t&&Object.assign(this,t)}inRange(t,e,i){const s=this.options,{x:n,y:o}=this.getProps(["x","y"],i);return Math.pow(t-n,2)+Math.pow(e-o,2)<Math.pow(s.hitRadius+s.radius,2)}inXRange(t,e){return ao(this,t,"x",e)}inYRange(t,e){return ao(this,t,"y",e)}getCenterPoint(t){const{x:e,y:i}=this.getProps(["x","y"],t);return{x:e,y:i}}size(t){let e=(t=t||this.options||{}).radius||0;e=Math.max(e,e&&t.hoverRadius||0);return 2*(e+(e&&t.borderWidth||0))}draw(t,e){const i=this.options;this.skip||i.radius<.1||!Re(this,e,this.size(i)/2)||(t.strokeStyle=i.borderColor,t.lineWidth=i.borderWidth,t.fillStyle=i.backgroundColor,Le(t,i,this.x,this.y))}getRange(){const t=this.options||{};return t.radius+t.hitRadius}}});function po(t,e,i,s){const n=t.indexOf(e);if(-1===n)return((t,e,i,s)=>("string"==typeof e?(i=t.push(e)-1,s.unshift({index:i,label:e})):isNaN(e)&&(i=null),i))(t,e,i,s);return n!==t.lastIndexOf(e)?i:n}function mo(t){const e=this.getLabels();return t>=0&&t<e.length?e[t]:t}function xo(t,e,{horizontal:i,minRotation:s}){const n=$(s),o=(i?Math.sin(n):Math.cos(n))||.001,a=.75*e*(""+t).length;return Math.min(e/o,a)}class bo extends tn{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._endValue=void 0,this._valueRange=0}parse(t,e){return s(t)||("number"==typeof t||t instanceof Number)&&!isFinite(+t)?null:+t}handleTickRangeOptions(){const{beginAtZero:t}=this.options,{minDefined:e,maxDefined:i}=this.getUserBounds();let{min:s,max:n}=this;const o=t=>s=e?s:t,a=t=>n=i?n:t;if(t){const t=F(s),e=F(n);t<0&&e<0?a(0):t>0&&e>0&&o(0)}if(s===n){let e=0===n?1:Math.abs(.05*n);a(n+e),t||o(s-e)}this.min=s,this.max=n}getTickLimit(){const t=this.options.ticks;let e,{maxTicksLimit:i,stepSize:s}=t;return s?(e=Math.ceil(this.max/s)-Math.floor(this.min/s)+1,e>1e3&&(console.warn(\`scales.\${this.id}.ticks.stepSize: \${s} would result generating up to \${e} ticks. Limiting to 1000.\`),e=1e3)):(e=this.computeTickLimit(),i=i||11),i&&(e=Math.min(i,e)),e}computeTickLimit(){return Number.POSITIVE_INFINITY}buildTicks(){const t=this.options,e=t.ticks;let i=this.getTickLimit();i=Math.max(2,i);const n=function(t,e){const i=[],{bounds:n,step:o,min:a,max:r,precision:l,count:h,maxTicks:c,maxDigits:d,includeBounds:u}=t,f=o||1,g=c-1,{min:p,max:m}=e,x=!s(a),b=!s(r),_=!s(h),y=(m-p)/(d+1);let v,M,w,k,S=B((m-p)/g/f)*f;if(S<1e-14&&!x&&!b)return[{value:p},{value:m}];k=Math.ceil(m/S)-Math.floor(p/S),k>g&&(S=B(k*S/g/f)*f),s(l)||(v=Math.pow(10,l),S=Math.ceil(S*v)/v),"ticks"===n?(M=Math.floor(p/S)*S,w=Math.ceil(m/S)*S):(M=p,w=m),x&&b&&o&&H((r-a)/o,S/1e3)?(k=Math.round(Math.min((r-a)/S,c)),S=(r-a)/k,M=a,w=r):_?(M=x?a:M,w=b?r:w,k=h-1,S=(w-M)/k):(k=(w-M)/S,k=V(k,Math.round(k),S/1e3)?Math.round(k):Math.ceil(k));const P=Math.max(U(S),U(M));v=Math.pow(10,s(l)?P:l),M=Math.round(M*v)/v,w=Math.round(w*v)/v;let D=0;for(x&&(u&&M!==a?(i.push({value:a}),M<a&&D++,V(Math.round((M+D*S)*v)/v,a,xo(a,y,t))&&D++):M<a&&D++);D<k;++D){const t=Math.round((M+D*S)*v)/v;if(b&&t>r)break;i.push({value:t})}return b&&u&&w!==r?i.length&&V(i[i.length-1].value,r,xo(r,y,t))?i[i.length-1].value=r:i.push({value:r}):b&&w!==r||i.push({value:w}),i}({maxTicks:i,bounds:t.bounds,min:t.min,max:t.max,precision:e.precision,step:e.stepSize,count:e.count,maxDigits:this._maxDigits(),horizontal:this.isHorizontal(),minRotation:e.minRotation||0,includeBounds:!1!==e.includeBounds},this._range||this);return"ticks"===t.bounds&&j(n,this,"value"),t.reverse?(n.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),n}configure(){const t=this.ticks;let e=this.min,i=this.max;if(super.configure(),this.options.offset&&t.length){const s=(i-e)/Math.max(t.length-1,1)/2;e-=s,i+=s}this._startValue=e,this._endValue=i,this._valueRange=i-e}getLabelForValue(t){return ne(t,this.chart.options.locale,this.options.ticks.format)}}class _o extends bo{static id="linear";static defaults={ticks:{callback:ae.formatters.numeric}};determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=a(t)?t:0,this.max=a(e)?e:1,this.handleTickRangeOptions()}computeTickLimit(){const t=this.isHorizontal(),e=t?this.width:this.height,i=$(this.options.ticks.minRotation),s=(t?Math.sin(i):Math.cos(i))||.001,n=this._resolveTickFontOptions(0);return Math.ceil(e/Math.min(40,n.lineHeight/s))}getPixelForValue(t){return null===t?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getValueForPixel(t){return this._startValue+this.getDecimalForPixel(t)*this._valueRange}}const yo=t=>Math.floor(z(t)),vo=(t,e)=>Math.pow(10,yo(t)+e);function Mo(t){return 1===t/Math.pow(10,yo(t))}function wo(t,e,i){const s=Math.pow(10,i),n=Math.floor(t/s);return Math.ceil(e/s)-n}function ko(t,{min:e,max:i}){e=r(t.min,e);const s=[],n=yo(e);let o=function(t,e){let i=yo(e-t);for(;wo(t,e,i)>10;)i++;for(;wo(t,e,i)<10;)i--;return Math.min(i,yo(t))}(e,i),a=o<0?Math.pow(10,Math.abs(o)):1;const l=Math.pow(10,o),h=n>o?Math.pow(10,n):0,c=Math.round((e-h)*a)/a,d=Math.floor((e-h)/l/10)*l*10;let u=Math.floor((c-d)/Math.pow(10,o)),f=r(t.min,Math.round((h+d+u*Math.pow(10,o))*a)/a);for(;f<i;)s.push({value:f,major:Mo(f),significand:u}),u>=10?u=u<15?15:20:u++,u>=20&&(o++,u=2,a=o>=0?1:a),f=Math.round((h+d+u*Math.pow(10,o))*a)/a;const g=r(t.max,f);return s.push({value:g,major:Mo(g),significand:u}),s}class So extends tn{static id="logarithmic";static defaults={ticks:{callback:ae.formatters.logarithmic,major:{enabled:!0}}};constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._valueRange=0}parse(t,e){const i=bo.prototype.parse.apply(this,[t,e]);if(0!==i)return a(i)&&i>0?i:null;this._zero=!0}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=a(t)?Math.max(0,t):null,this.max=a(e)?Math.max(0,e):null,this.options.beginAtZero&&(this._zero=!0),this._zero&&this.min!==this._suggestedMin&&!a(this._userMin)&&(this.min=t===vo(this.min,0)?vo(this.min,-1):vo(this.min,0)),this.handleTickRangeOptions()}handleTickRangeOptions(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let i=this.min,s=this.max;const n=e=>i=t?i:e,o=t=>s=e?s:t;i===s&&(i<=0?(n(1),o(10)):(n(vo(i,-1)),o(vo(s,1)))),i<=0&&n(vo(s,-1)),s<=0&&o(vo(i,1)),this.min=i,this.max=s}buildTicks(){const t=this.options,e=ko({min:this._userMin,max:this._userMax},this);return"ticks"===t.bounds&&j(e,this,"value"),t.reverse?(e.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),e}getLabelForValue(t){return void 0===t?"0":ne(t,this.chart.options.locale,this.options.ticks.format)}configure(){const t=this.min;super.configure(),this._startValue=z(t),this._valueRange=z(this.max)-z(t)}getPixelForValue(t){return void 0!==t&&0!==t||(t=this.min),null===t||isNaN(t)?NaN:this.getPixelForDecimal(t===this.min?0:(z(t)-this._startValue)/this._valueRange)}getValueForPixel(t){const e=this.getDecimalForPixel(t);return Math.pow(10,this._startValue+e*this._valueRange)}}function Po(t){const e=t.ticks;if(e.display&&t.display){const t=ki(e.backdropPadding);return l(e.font&&e.font.size,ue.font.size)+t.height}return 0}function Do(t,e,i,s,n){return t===s||t===n?{start:e-i/2,end:e+i/2}:t<s||t>n?{start:e-i,end:e}:{start:e,end:e+i}}function Co(t){const e={l:t.left+t._padding.left,r:t.right-t._padding.right,t:t.top+t._padding.top,b:t.bottom-t._padding.bottom},i=Object.assign({},e),s=[],o=[],a=t._pointLabels.length,r=t.options.pointLabels,l=r.centerPointLabels?C/a:0;for(let u=0;u<a;u++){const a=r.setContext(t.getPointLabelContext(u));o[u]=a.padding;const f=t.getPointPosition(u,t.drawingArea+o[u],l),g=Si(a.font),p=(h=t.ctx,c=g,d=n(d=t._pointLabels[u])?d:[d],{w:Oe(h,c.string,d),h:d.length*c.lineHeight});s[u]=p;const m=G(t.getIndexAngle(u)+l),x=Math.round(Y(m));Oo(i,e,m,Do(x,f.x,p.w,0,180),Do(x,f.y,p.h,90,270))}var h,c,d;t.setCenterPoint(e.l-i.l,i.r-e.r,e.t-i.t,i.b-e.b),t._pointLabelItems=function(t,e,i){const s=[],n=t._pointLabels.length,o=t.options,{centerPointLabels:a,display:r}=o.pointLabels,l={extra:Po(o)/2,additionalAngle:a?C/n:0};let h;for(let o=0;o<n;o++){l.padding=i[o],l.size=e[o];const n=Ao(t,o,l);s.push(n),"auto"===r&&(n.visible=To(n,h),n.visible&&(h=n))}return s}(t,s,o)}function Oo(t,e,i,s,n){const o=Math.abs(Math.sin(i)),a=Math.abs(Math.cos(i));let r=0,l=0;s.start<e.l?(r=(e.l-s.start)/o,t.l=Math.min(t.l,e.l-r)):s.end>e.r&&(r=(s.end-e.r)/o,t.r=Math.max(t.r,e.r+r)),n.start<e.t?(l=(e.t-n.start)/a,t.t=Math.min(t.t,e.t-l)):n.end>e.b&&(l=(n.end-e.b)/a,t.b=Math.max(t.b,e.b+l))}function Ao(t,e,i){const s=t.drawingArea,{extra:n,additionalAngle:o,padding:a,size:r}=i,l=t.getPointPosition(e,s+n+a,o),h=Math.round(Y(G(l.angle+E))),c=function(t,e,i){90===i||270===i?t-=e/2:(i>270||i<90)&&(t-=e);return t}(l.y,r.h,h),d=function(t){if(0===t||180===t)return"center";if(t<180)return"left";return"right"}(h),u=function(t,e,i){"right"===i?t-=e:"center"===i&&(t-=e/2);return t}(l.x,r.w,d);return{visible:!0,x:l.x,y:c,textAlign:d,left:u,top:c,right:u+r.w,bottom:c+r.h}}function To(t,e){if(!e)return!0;const{left:i,top:s,right:n,bottom:o}=t;return!(Re({x:i,y:s},e)||Re({x:i,y:o},e)||Re({x:n,y:s},e)||Re({x:n,y:o},e))}function Lo(t,e,i){const{left:n,top:o,right:a,bottom:r}=i,{backdropColor:l}=e;if(!s(l)){const i=wi(e.borderRadius),s=ki(e.backdropPadding);t.fillStyle=l;const h=n-s.left,c=o-s.top,d=a-n+s.width,u=r-o+s.height;Object.values(i).some((t=>0!==t))?(t.beginPath(),He(t,{x:h,y:c,w:d,h:u,radius:i}),t.fill()):t.fillRect(h,c,d,u)}}function Eo(t,e,i,s){const{ctx:n}=t;if(i)n.arc(t.xCenter,t.yCenter,e,0,O);else{let i=t.getPointPosition(0,e);n.moveTo(i.x,i.y);for(let o=1;o<s;o++)i=t.getPointPosition(o,e),n.lineTo(i.x,i.y)}}class Ro extends bo{static id="radialLinear";static defaults={display:!0,animate:!0,position:"chartArea",angleLines:{display:!0,lineWidth:1,borderDash:[],borderDashOffset:0},grid:{circular:!1},startAngle:0,ticks:{showLabelBackdrop:!0,callback:ae.formatters.numeric},pointLabels:{backdropColor:void 0,backdropPadding:2,display:!0,font:{size:10},callback:t=>t,padding:5,centerPointLabels:!1}};static defaultRoutes={"angleLines.color":"borderColor","pointLabels.color":"color","ticks.color":"color"};static descriptors={angleLines:{_fallback:"grid"}};constructor(t){super(t),this.xCenter=void 0,this.yCenter=void 0,this.drawingArea=void 0,this._pointLabels=[],this._pointLabelItems=[]}setDimensions(){const t=this._padding=ki(Po(this.options)/2),e=this.width=this.maxWidth-t.width,i=this.height=this.maxHeight-t.height;this.xCenter=Math.floor(this.left+e/2+t.left),this.yCenter=Math.floor(this.top+i/2+t.top),this.drawingArea=Math.floor(Math.min(e,i)/2)}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!1);this.min=a(t)&&!isNaN(t)?t:0,this.max=a(e)&&!isNaN(e)?e:0,this.handleTickRangeOptions()}computeTickLimit(){return Math.ceil(this.drawingArea/Po(this.options))}generateTickLabels(t){bo.prototype.generateTickLabels.call(this,t),this._pointLabels=this.getLabels().map(((t,e)=>{const i=d(this.options.pointLabels.callback,[t,e],this);return i||0===i?i:""})).filter(((t,e)=>this.chart.getDataVisibility(e)))}fit(){const t=this.options;t.display&&t.pointLabels.display?Co(this):this.setCenterPoint(0,0,0,0)}setCenterPoint(t,e,i,s){this.xCenter+=Math.floor((t-e)/2),this.yCenter+=Math.floor((i-s)/2),this.drawingArea-=Math.min(this.drawingArea/2,Math.max(t,e,i,s))}getIndexAngle(t){return G(t*(O/(this._pointLabels.length||1))+$(this.options.startAngle||0))}getDistanceFromCenterForValue(t){if(s(t))return NaN;const e=this.drawingArea/(this.max-this.min);return this.options.reverse?(this.max-t)*e:(t-this.min)*e}getValueForDistanceFromCenter(t){if(s(t))return NaN;const e=t/(this.drawingArea/(this.max-this.min));return this.options.reverse?this.max-e:this.min+e}getPointLabelContext(t){const e=this._pointLabels||[];if(t>=0&&t<e.length){const i=e[t];return function(t,e,i){return Ci(t,{label:i,index:e,type:"pointLabel"})}(this.getContext(),t,i)}}getPointPosition(t,e,i=0){const s=this.getIndexAngle(t)-E+i;return{x:Math.cos(s)*e+this.xCenter,y:Math.sin(s)*e+this.yCenter,angle:s}}getPointPositionForValue(t,e){return this.getPointPosition(t,this.getDistanceFromCenterForValue(e))}getBasePosition(t){return this.getPointPositionForValue(t||0,this.getBaseValue())}getPointLabelPosition(t){const{left:e,top:i,right:s,bottom:n}=this._pointLabelItems[t];return{left:e,top:i,right:s,bottom:n}}drawBackground(){const{backgroundColor:t,grid:{circular:e}}=this.options;if(t){const i=this.ctx;i.save(),i.beginPath(),Eo(this,this.getDistanceFromCenterForValue(this._endValue),e,this._pointLabels.length),i.closePath(),i.fillStyle=t,i.fill(),i.restore()}}drawGrid(){const t=this.ctx,e=this.options,{angleLines:i,grid:s,border:n}=e,o=this._pointLabels.length;let a,r,l;if(e.pointLabels.display&&function(t,e){const{ctx:i,options:{pointLabels:s}}=t;for(let n=e-1;n>=0;n--){const e=t._pointLabelItems[n];if(!e.visible)continue;const o=s.setContext(t.getPointLabelContext(n));Lo(i,o,e);const a=Si(o.font),{x:r,y:l,textAlign:h}=e;Ne(i,t._pointLabels[n],r,l+a.lineHeight/2,a,{color:o.color,textAlign:h,textBaseline:"middle"})}}(this,o),s.display&&this.ticks.forEach(((t,e)=>{if(0!==e||0===e&&this.min<0){r=this.getDistanceFromCenterForValue(t.value);const i=this.getContext(e),a=s.setContext(i),l=n.setContext(i);!function(t,e,i,s,n){const o=t.ctx,a=e.circular,{color:r,lineWidth:l}=e;!a&&!s||!r||!l||i<0||(o.save(),o.strokeStyle=r,o.lineWidth=l,o.setLineDash(n.dash||[]),o.lineDashOffset=n.dashOffset,o.beginPath(),Eo(t,i,a,s),o.closePath(),o.stroke(),o.restore())}(this,a,r,o,l)}})),i.display){for(t.save(),a=o-1;a>=0;a--){const s=i.setContext(this.getPointLabelContext(a)),{color:n,lineWidth:o}=s;o&&n&&(t.lineWidth=o,t.strokeStyle=n,t.setLineDash(s.borderDash),t.lineDashOffset=s.borderDashOffset,r=this.getDistanceFromCenterForValue(e.reverse?this.min:this.max),l=this.getPointPosition(a,r),t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(l.x,l.y),t.stroke())}t.restore()}}drawBorder(){}drawLabels(){const t=this.ctx,e=this.options,i=e.ticks;if(!i.display)return;const s=this.getIndexAngle(0);let n,o;t.save(),t.translate(this.xCenter,this.yCenter),t.rotate(s),t.textAlign="center",t.textBaseline="middle",this.ticks.forEach(((s,a)=>{if(0===a&&this.min>=0&&!e.reverse)return;const r=i.setContext(this.getContext(a)),l=Si(r.font);if(n=this.getDistanceFromCenterForValue(this.ticks[a].value),r.showLabelBackdrop){t.font=l.string,o=t.measureText(s.label).width,t.fillStyle=r.backdropColor;const e=ki(r.backdropPadding);t.fillRect(-o/2-e.left,-n-l.size/2-e.top,o+e.width,l.size+e.height)}Ne(t,s.label,0,-n,l,{color:r.color,strokeColor:r.textStrokeColor,strokeWidth:r.textStrokeWidth})})),t.restore()}drawTitle(){}}const Io={millisecond:{common:!0,size:1,steps:1e3},second:{common:!0,size:1e3,steps:60},minute:{common:!0,size:6e4,steps:60},hour:{common:!0,size:36e5,steps:24},day:{common:!0,size:864e5,steps:30},week:{common:!1,size:6048e5,steps:4},month:{common:!0,size:2628e6,steps:12},quarter:{common:!1,size:7884e6,steps:4},year:{common:!0,size:3154e7}},zo=Object.keys(Io);function Fo(t,e){return t-e}function Vo(t,e){if(s(e))return null;const i=t._adapter,{parser:n,round:o,isoWeekday:r}=t._parseOpts;let l=e;return"function"==typeof n&&(l=n(l)),a(l)||(l="string"==typeof n?i.parse(l,n):i.parse(l)),null===l?null:(o&&(l="week"!==o||!N(r)&&!0!==r?i.startOf(l,o):i.startOf(l,"isoWeek",r)),+l)}function Bo(t,e,i,s){const n=zo.length;for(let o=zo.indexOf(t);o<n-1;++o){const t=Io[zo[o]],n=t.steps?t.steps:Number.MAX_SAFE_INTEGER;if(t.common&&Math.ceil((i-e)/(n*t.size))<=s)return zo[o]}return zo[n-1]}function Wo(t,e,i){if(i){if(i.length){const{lo:s,hi:n}=et(i,e);t[i[s]>=e?i[s]:i[n]]=!0}}else t[e]=!0}function No(t,e,i){const s=[],n={},o=e.length;let a,r;for(a=0;a<o;++a)r=e[a],n[r]=a,s.push({value:r,major:!1});return 0!==o&&i?function(t,e,i,s){const n=t._adapter,o=+n.startOf(e[0].value,s),a=e[e.length-1].value;let r,l;for(r=o;r<=a;r=+n.add(r,1,s))l=i[r],l>=0&&(e[l].major=!0);return e}(t,s,n,i):s}class Ho extends tn{static id="time";static defaults={bounds:"data",adapters:{},time:{parser:!1,unit:!1,round:!1,isoWeekday:!1,minUnit:"millisecond",displayFormats:{}},ticks:{source:"auto",callback:!1,major:{enabled:!1}}};constructor(t){super(t),this._cache={data:[],labels:[],all:[]},this._unit="day",this._majorUnit=void 0,this._offsets={},this._normalized=!1,this._parseOpts=void 0}init(t,e={}){const i=t.time||(t.time={}),s=this._adapter=new In._date(t.adapters.date);s.init(e),b(i.displayFormats,s.formats()),this._parseOpts={parser:i.parser,round:i.round,isoWeekday:i.isoWeekday},super.init(t),this._normalized=e.normalized}parse(t,e){return void 0===t?null:Vo(this,t)}beforeLayout(){super.beforeLayout(),this._cache={data:[],labels:[],all:[]}}determineDataLimits(){const t=this.options,e=this._adapter,i=t.time.unit||"day";let{min:s,max:n,minDefined:o,maxDefined:r}=this.getUserBounds();function l(t){o||isNaN(t.min)||(s=Math.min(s,t.min)),r||isNaN(t.max)||(n=Math.max(n,t.max))}o&&r||(l(this._getLabelBounds()),"ticks"===t.bounds&&"labels"===t.ticks.source||l(this.getMinMax(!1))),s=a(s)&&!isNaN(s)?s:+e.startOf(Date.now(),i),n=a(n)&&!isNaN(n)?n:+e.endOf(Date.now(),i)+1,this.min=Math.min(s,n-1),this.max=Math.max(s+1,n)}_getLabelBounds(){const t=this.getLabelTimestamps();let e=Number.POSITIVE_INFINITY,i=Number.NEGATIVE_INFINITY;return t.length&&(e=t[0],i=t[t.length-1]),{min:e,max:i}}buildTicks(){const t=this.options,e=t.time,i=t.ticks,s="labels"===i.source?this.getLabelTimestamps():this._generate();"ticks"===t.bounds&&s.length&&(this.min=this._userMin||s[0],this.max=this._userMax||s[s.length-1]);const n=this.min,o=nt(s,n,this.max);return this._unit=e.unit||(i.autoSkip?Bo(e.minUnit,this.min,this.max,this._getLabelCapacity(n)):function(t,e,i,s,n){for(let o=zo.length-1;o>=zo.indexOf(i);o--){const i=zo[o];if(Io[i].common&&t._adapter.diff(n,s,i)>=e-1)return i}return zo[i?zo.indexOf(i):0]}(this,o.length,e.minUnit,this.min,this.max)),this._majorUnit=i.major.enabled&&"year"!==this._unit?function(t){for(let e=zo.indexOf(t)+1,i=zo.length;e<i;++e)if(Io[zo[e]].common)return zo[e]}(this._unit):void 0,this.initOffsets(s),t.reverse&&o.reverse(),No(this,o,this._majorUnit)}afterAutoSkip(){this.options.offsetAfterAutoskip&&this.initOffsets(this.ticks.map((t=>+t.value)))}initOffsets(t=[]){let e,i,s=0,n=0;this.options.offset&&t.length&&(e=this.getDecimalForValue(t[0]),s=1===t.length?1-e:(this.getDecimalForValue(t[1])-e)/2,i=this.getDecimalForValue(t[t.length-1]),n=1===t.length?i:(i-this.getDecimalForValue(t[t.length-2]))/2);const o=t.length<3?.5:.25;s=Z(s,0,o),n=Z(n,0,o),this._offsets={start:s,end:n,factor:1/(s+1+n)}}_generate(){const t=this._adapter,e=this.min,i=this.max,s=this.options,n=s.time,o=n.unit||Bo(n.minUnit,e,i,this._getLabelCapacity(e)),a=l(s.ticks.stepSize,1),r="week"===o&&n.isoWeekday,h=N(r)||!0===r,c={};let d,u,f=e;if(h&&(f=+t.startOf(f,"isoWeek",r)),f=+t.startOf(f,h?"day":o),t.diff(i,e,o)>1e5*a)throw new Error(e+" and "+i+" are too far apart with stepSize of "+a+" "+o);const g="data"===s.ticks.source&&this.getDataTimestamps();for(d=f,u=0;d<i;d=+t.add(d,a,o),u++)Wo(c,d,g);return d!==i&&"ticks"!==s.bounds&&1!==u||Wo(c,d,g),Object.keys(c).sort(Fo).map((t=>+t))}getLabelForValue(t){const e=this._adapter,i=this.options.time;return i.tooltipFormat?e.format(t,i.tooltipFormat):e.format(t,i.displayFormats.datetime)}format(t,e){const i=this.options.time.displayFormats,s=this._unit,n=e||i[s];return this._adapter.format(t,n)}_tickFormatFunction(t,e,i,s){const n=this.options,o=n.ticks.callback;if(o)return d(o,[t,e,i],this);const a=n.time.displayFormats,r=this._unit,l=this._majorUnit,h=r&&a[r],c=l&&a[l],u=i[e],f=l&&c&&u&&u.major;return this._adapter.format(t,s||(f?c:h))}generateTickLabels(t){let e,i,s;for(e=0,i=t.length;e<i;++e)s=t[e],s.label=this._tickFormatFunction(s.value,e,t)}getDecimalForValue(t){return null===t?NaN:(t-this.min)/(this.max-this.min)}getPixelForValue(t){const e=this._offsets,i=this.getDecimalForValue(t);return this.getPixelForDecimal((e.start+i)*e.factor)}getValueForPixel(t){const e=this._offsets,i=this.getDecimalForPixel(t)/e.factor-e.end;return this.min+i*(this.max-this.min)}_getLabelSize(t){const e=this.options.ticks,i=this.ctx.measureText(t).width,s=$(this.isHorizontal()?e.maxRotation:e.minRotation),n=Math.cos(s),o=Math.sin(s),a=this._resolveTickFontOptions(0).size;return{w:i*n+a*o,h:i*o+a*n}}_getLabelCapacity(t){const e=this.options.time,i=e.displayFormats,s=i[e.unit]||i.millisecond,n=this._tickFormatFunction(t,0,No(this,[t],this._majorUnit),s),o=this._getLabelSize(n),a=Math.floor(this.isHorizontal()?this.width/o.w:this.height/o.h)-1;return a>0?a:1}getDataTimestamps(){let t,e,i=this._cache.data||[];if(i.length)return i;const s=this.getMatchingVisibleMetas();if(this._normalized&&s.length)return this._cache.data=s[0].controller.getAllParsedValues(this);for(t=0,e=s.length;t<e;++t)i=i.concat(s[t].controller.getAllParsedValues(this));return this._cache.data=this.normalize(i)}getLabelTimestamps(){const t=this._cache.labels||[];let e,i;if(t.length)return t;const s=this.getLabels();for(e=0,i=s.length;e<i;++e)t.push(Vo(this,s[e]));return this._cache.labels=this._normalized?t:this.normalize(t)}normalize(t){return lt(t.sort(Fo))}}function jo(t,e,i){let s,n,o,a,r=0,l=t.length-1;i?(e>=t[r].pos&&e<=t[l].pos&&({lo:r,hi:l}=it(t,"pos",e)),({pos:s,time:o}=t[r]),({pos:n,time:a}=t[l])):(e>=t[r].time&&e<=t[l].time&&({lo:r,hi:l}=it(t,"time",e)),({time:s,pos:o}=t[r]),({time:n,pos:a}=t[l]));const h=n-s;return h?o+(a-o)*(e-s)/h:o}var $o=Object.freeze({__proto__:null,CategoryScale:class extends tn{static id="category";static defaults={ticks:{callback:mo}};constructor(t){super(t),this._startValue=void 0,this._valueRange=0,this._addedLabels=[]}init(t){const e=this._addedLabels;if(e.length){const t=this.getLabels();for(const{index:i,label:s}of e)t[i]===s&&t.splice(i,1);this._addedLabels=[]}super.init(t)}parse(t,e){if(s(t))return null;const i=this.getLabels();return((t,e)=>null===t?null:Z(Math.round(t),0,e))(e=isFinite(e)&&i[e]===t?e:po(i,t,l(e,t),this._addedLabels),i.length-1)}determineDataLimits(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let{min:i,max:s}=this.getMinMax(!0);"ticks"===this.options.bounds&&(t||(i=0),e||(s=this.getLabels().length-1)),this.min=i,this.max=s}buildTicks(){const t=this.min,e=this.max,i=this.options.offset,s=[];let n=this.getLabels();n=0===t&&e===n.length-1?n:n.slice(t,e+1),this._valueRange=Math.max(n.length-(i?0:1),1),this._startValue=this.min-(i?.5:0);for(let i=t;i<=e;i++)s.push({value:i});return s}getLabelForValue(t){return mo.call(this,t)}configure(){super.configure(),this.isHorizontal()||(this._reversePixels=!this._reversePixels)}getPixelForValue(t){return"number"!=typeof t&&(t=this.parse(t)),null===t?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getValueForPixel(t){return Math.round(this._startValue+this.getDecimalForPixel(t)*this._valueRange)}getBasePixel(){return this.bottom}},LinearScale:_o,LogarithmicScale:So,RadialLinearScale:Ro,TimeScale:Ho,TimeSeriesScale:class extends Ho{static id="timeseries";static defaults=Ho.defaults;constructor(t){super(t),this._table=[],this._minPos=void 0,this._tableRange=void 0}initOffsets(){const t=this._getTimestampsForTable(),e=this._table=this.buildLookupTable(t);this._minPos=jo(e,this.min),this._tableRange=jo(e,this.max)-this._minPos,super.initOffsets(t)}buildLookupTable(t){const{min:e,max:i}=this,s=[],n=[];let o,a,r,l,h;for(o=0,a=t.length;o<a;++o)l=t[o],l>=e&&l<=i&&s.push(l);if(s.length<2)return[{time:e,pos:0},{time:i,pos:1}];for(o=0,a=s.length;o<a;++o)h=s[o+1],r=s[o-1],l=s[o],Math.round((h+r)/2)!==l&&n.push({time:l,pos:o/(a-1)});return n}_generate(){const t=this.min,e=this.max;let i=super.getDataTimestamps();return i.includes(t)&&i.length||i.splice(0,0,t),i.includes(e)&&1!==i.length||i.push(e),i.sort(((t,e)=>t-e))}_getTimestampsForTable(){let t=this._cache.all||[];if(t.length)return t;const e=this.getDataTimestamps(),i=this.getLabelTimestamps();return t=e.length&&i.length?this.normalize(e.concat(i)):e.length?e:i,t=this._cache.all=t,t}getDecimalForValue(t){return(jo(this._table,t)-this._minPos)/this._tableRange}getValueForPixel(t){const e=this._offsets,i=this.getDecimalForPixel(t)/e.factor-e.end;return jo(this._table,i*this._tableRange+this._minPos,!0)}}});const Yo=["rgb(54, 162, 235)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(153, 102, 255)","rgb(201, 203, 207)"],Uo=Yo.map((t=>t.replace("rgb(","rgba(").replace(")",", 0.5)")));function Xo(t){return Yo[t%Yo.length]}function qo(t){return Uo[t%Uo.length]}function Ko(t){let e=0;return(i,s)=>{const n=t.getDatasetMeta(s).controller;n instanceof $n?e=function(t,e){return t.backgroundColor=t.data.map((()=>Xo(e++))),e}(i,e):n instanceof Yn?e=function(t,e){return t.backgroundColor=t.data.map((()=>qo(e++))),e}(i,e):n&&(e=function(t,e){return t.borderColor=Xo(e),t.backgroundColor=qo(e),++e}(i,e))}}function Go(t){let e;for(e in t)if(t[e].borderColor||t[e].backgroundColor)return!0;return!1}var Jo={id:"colors",defaults:{enabled:!0,forceOverride:!1},beforeLayout(t,e,i){if(!i.enabled)return;const{data:{datasets:s},options:n}=t.config,{elements:o}=n,a=Go(s)||(r=n)&&(r.borderColor||r.backgroundColor)||o&&Go(o)||"rgba(0,0,0,0.1)"!==ue.borderColor||"rgba(0,0,0,0.1)"!==ue.backgroundColor;var r;if(!i.forceOverride&&a)return;const l=Ko(t);s.forEach(l)}};function Zo(t){if(t._decimated){const e=t._data;delete t._decimated,delete t._data,Object.defineProperty(t,"data",{configurable:!0,enumerable:!0,writable:!0,value:e})}}function Qo(t){t.data.datasets.forEach((t=>{Zo(t)}))}var ta={id:"decimation",defaults:{algorithm:"min-max",enabled:!1},beforeElementsUpdate:(t,e,i)=>{if(!i.enabled)return void Qo(t);const n=t.width;t.data.datasets.forEach(((e,o)=>{const{_data:a,indexAxis:r}=e,l=t.getDatasetMeta(o),h=a||e.data;if("y"===Pi([r,t.options.indexAxis]))return;if(!l.controller.supportsDecimation)return;const c=t.scales[l.xAxisID];if("linear"!==c.type&&"time"!==c.type)return;if(t.options.parsing)return;let{start:d,count:u}=function(t,e){const i=e.length;let s,n=0;const{iScale:o}=t,{min:a,max:r,minDefined:l,maxDefined:h}=o.getUserBounds();return l&&(n=Z(it(e,o.axis,a).lo,0,i-1)),s=h?Z(it(e,o.axis,r).hi+1,n,i)-n:i-n,{start:n,count:s}}(l,h);if(u<=(i.threshold||4*n))return void Zo(e);let f;switch(s(a)&&(e._data=h,delete e.data,Object.defineProperty(e,"data",{configurable:!0,enumerable:!0,get:function(){return this._decimated},set:function(t){this._data=t}})),i.algorithm){case"lttb":f=function(t,e,i,s,n){const o=n.samples||s;if(o>=i)return t.slice(e,e+i);const a=[],r=(i-2)/(o-2);let l=0;const h=e+i-1;let c,d,u,f,g,p=e;for(a[l++]=t[p],c=0;c<o-2;c++){let s,n=0,o=0;const h=Math.floor((c+1)*r)+1+e,m=Math.min(Math.floor((c+2)*r)+1,i)+e,x=m-h;for(s=h;s<m;s++)n+=t[s].x,o+=t[s].y;n/=x,o/=x;const b=Math.floor(c*r)+1+e,_=Math.min(Math.floor((c+1)*r)+1,i)+e,{x:y,y:v}=t[p];for(u=f=-1,s=b;s<_;s++)f=.5*Math.abs((y-n)*(t[s].y-v)-(y-t[s].x)*(o-v)),f>u&&(u=f,d=t[s],g=s);a[l++]=d,p=g}return a[l++]=t[h],a}(h,d,u,n,i);break;case"min-max":f=function(t,e,i,n){let o,a,r,l,h,c,d,u,f,g,p=0,m=0;const x=[],b=e+i-1,_=t[e].x,y=t[b].x-_;for(o=e;o<e+i;++o){a=t[o],r=(a.x-_)/y*n,l=a.y;const e=0|r;if(e===h)l<f?(f=l,c=o):l>g&&(g=l,d=o),p=(m*p+a.x)/++m;else{const i=o-1;if(!s(c)&&!s(d)){const e=Math.min(c,d),s=Math.max(c,d);e!==u&&e!==i&&x.push({...t[e],x:p}),s!==u&&s!==i&&x.push({...t[s],x:p})}o>0&&i!==u&&x.push(t[i]),x.push(a),h=e,m=0,f=g=l,c=d=u=o}}return x}(h,d,u,n);break;default:throw new Error(\`Unsupported decimation algorithm '\${i.algorithm}'\`)}e._decimated=f}))},destroy(t){Qo(t)}};function ea(t,e,i,s){if(s)return;let n=e[t],o=i[t];return"angle"===t&&(n=G(n),o=G(o)),{property:t,start:n,end:o}}function ia(t,e,i){for(;e>t;e--){const t=i[e];if(!isNaN(t.x)&&!isNaN(t.y))break}return e}function sa(t,e,i,s){return t&&e?s(t[i],e[i]):t?t[i]:e?e[i]:0}function na(t,e){let i=[],s=!1;return n(t)?(s=!0,i=t):i=function(t,e){const{x:i=null,y:s=null}=t||{},n=e.points,o=[];return e.segments.forEach((({start:t,end:e})=>{e=ia(t,e,n);const a=n[t],r=n[e];null!==s?(o.push({x:a.x,y:s}),o.push({x:r.x,y:s})):null!==i&&(o.push({x:i,y:a.y}),o.push({x:i,y:r.y}))})),o}(t,e),i.length?new oo({points:i,options:{tension:0},_loop:s,_fullLoop:s}):null}function oa(t){return t&&!1!==t.fill}function aa(t,e,i){let s=t[e].fill;const n=[e];let o;if(!i)return s;for(;!1!==s&&-1===n.indexOf(s);){if(!a(s))return s;if(o=t[s],!o)return!1;if(o.visible)return s;n.push(s),s=o.fill}return!1}function ra(t,e,i){const s=function(t){const e=t.options,i=e.fill;let s=l(i&&i.target,i);void 0===s&&(s=!!e.backgroundColor);if(!1===s||null===s)return!1;if(!0===s)return"origin";return s}(t);if(o(s))return!isNaN(s.value)&&s;let n=parseFloat(s);return a(n)&&Math.floor(n)===n?function(t,e,i,s){"-"!==t&&"+"!==t||(i=e+i);if(i===e||i<0||i>=s)return!1;return i}(s[0],e,n,i):["origin","start","end","stack","shape"].indexOf(s)>=0&&s}function la(t,e,i){const s=[];for(let n=0;n<i.length;n++){const o=i[n],{first:a,last:r,point:l}=ha(o,e,"x");if(!(!l||a&&r))if(a)s.unshift(l);else if(t.push(l),!r)break}t.push(...s)}function ha(t,e,i){const s=t.interpolate(e,i);if(!s)return{};const n=s[i],o=t.segments,a=t.points;let r=!1,l=!1;for(let t=0;t<o.length;t++){const e=o[t],s=a[e.start][i],h=a[e.end][i];if(tt(n,s,h)){r=n===s,l=n===h;break}}return{first:r,last:l,point:s}}class ca{constructor(t){this.x=t.x,this.y=t.y,this.radius=t.radius}pathSegment(t,e,i){const{x:s,y:n,radius:o}=this;return e=e||{start:0,end:O},t.arc(s,n,o,e.end,e.start,!0),!i.bounds}interpolate(t){const{x:e,y:i,radius:s}=this,n=t.angle;return{x:e+Math.cos(n)*s,y:i+Math.sin(n)*s,angle:n}}}function da(t){const{chart:e,fill:i,line:s}=t;if(a(i))return function(t,e){const i=t.getDatasetMeta(e),s=i&&t.isDatasetVisible(e);return s?i.dataset:null}(e,i);if("stack"===i)return function(t){const{scale:e,index:i,line:s}=t,n=[],o=s.segments,a=s.points,r=function(t,e){const i=[],s=t.getMatchingVisibleMetas("line");for(let t=0;t<s.length;t++){const n=s[t];if(n.index===e)break;n.hidden||i.unshift(n.dataset)}return i}(e,i);r.push(na({x:null,y:e.bottom},s));for(let t=0;t<o.length;t++){const e=o[t];for(let t=e.start;t<=e.end;t++)la(n,a[t],r)}return new oo({points:n,options:{}})}(t);if("shape"===i)return!0;const n=function(t){const e=t.scale||{};if(e.getPointPositionForValue)return function(t){const{scale:e,fill:i}=t,s=e.options,n=e.getLabels().length,a=s.reverse?e.max:e.min,r=function(t,e,i){let s;return s="start"===t?i:"end"===t?e.options.reverse?e.min:e.max:o(t)?t.value:e.getBaseValue(),s}(i,e,a),l=[];if(s.grid.circular){const t=e.getPointPositionForValue(0,a);return new ca({x:t.x,y:t.y,radius:e.getDistanceFromCenterForValue(r)})}for(let t=0;t<n;++t)l.push(e.getPointPositionForValue(t,r));return l}(t);return function(t){const{scale:e={},fill:i}=t,s=function(t,e){let i=null;return"start"===t?i=e.bottom:"end"===t?i=e.top:o(t)?i=e.getPixelForValue(t.value):e.getBasePixel&&(i=e.getBasePixel()),i}(i,e);if(a(s)){const t=e.isHorizontal();return{x:t?s:null,y:t?null:s}}return null}(t)}(t);return n instanceof ca?n:na(n,s)}function ua(t,e,i){const s=da(e),{chart:n,index:o,line:a,scale:r,axis:l}=e,h=a.options,c=h.fill,d=h.backgroundColor,{above:u=d,below:f=d}=c||{},g=n.getDatasetMeta(o),p=Ni(n,g);s&&a.points.length&&(Ie(t,i),function(t,e){const{line:i,target:s,above:n,below:o,area:a,scale:r,clip:l}=e,h=i._loop?"angle":e.axis;t.save();let c=o;o!==n&&("x"===h?(fa(t,s,a.top),pa(t,{line:i,target:s,color:n,scale:r,property:h,clip:l}),t.restore(),t.save(),fa(t,s,a.bottom)):"y"===h&&(ga(t,s,a.left),pa(t,{line:i,target:s,color:o,scale:r,property:h,clip:l}),t.restore(),t.save(),ga(t,s,a.right),c=n));pa(t,{line:i,target:s,color:c,scale:r,property:h,clip:l}),t.restore()}(t,{line:a,target:s,above:u,below:f,area:i,scale:r,axis:l,clip:p}),ze(t))}function fa(t,e,i){const{segments:s,points:n}=e;let o=!0,a=!1;t.beginPath();for(const r of s){const{start:s,end:l}=r,h=n[s],c=n[ia(s,l,n)];o?(t.moveTo(h.x,h.y),o=!1):(t.lineTo(h.x,i),t.lineTo(h.x,h.y)),a=!!e.pathSegment(t,r,{move:a}),a?t.closePath():t.lineTo(c.x,i)}t.lineTo(e.first().x,i),t.closePath(),t.clip()}function ga(t,e,i){const{segments:s,points:n}=e;let o=!0,a=!1;t.beginPath();for(const r of s){const{start:s,end:l}=r,h=n[s],c=n[ia(s,l,n)];o?(t.moveTo(h.x,h.y),o=!1):(t.lineTo(i,h.y),t.lineTo(h.x,h.y)),a=!!e.pathSegment(t,r,{move:a}),a?t.closePath():t.lineTo(i,c.y)}t.lineTo(i,e.first().y),t.closePath(),t.clip()}function pa(t,e){const{line:i,target:s,property:n,color:o,scale:a,clip:r}=e,l=function(t,e,i){const s=t.segments,n=t.points,o=e.points,a=[];for(const t of s){let{start:s,end:r}=t;r=ia(s,r,n);const l=ea(i,n[s],n[r],t.loop);if(!e.segments){a.push({source:t,target:l,start:n[s],end:n[r]});continue}const h=Ii(e,l);for(const e of h){const s=ea(i,o[e.start],o[e.end],e.loop),r=Ri(t,n,s);for(const t of r)a.push({source:t,target:e,start:{[i]:sa(l,s,"start",Math.max)},end:{[i]:sa(l,s,"end",Math.min)}})}}return a}(i,s,n);for(const{source:e,target:h,start:c,end:d}of l){const{style:{backgroundColor:l=o}={}}=e,u=!0!==s;t.save(),t.fillStyle=l,ma(t,a,r,u&&ea(n,c,d)),t.beginPath();const f=!!i.pathSegment(t,e);let g;if(u){f?t.closePath():xa(t,s,d,n);const e=!!s.pathSegment(t,h,{move:f,reverse:!0});g=f&&e,g||xa(t,s,c,n)}t.closePath(),t.fill(g?"evenodd":"nonzero"),t.restore()}}function ma(t,e,i,s){const n=e.chart.chartArea,{property:o,start:a,end:r}=s||{};if("x"===o||"y"===o){let e,s,l,h;"x"===o?(e=a,s=n.top,l=r,h=n.bottom):(e=n.left,s=a,l=n.right,h=r),t.beginPath(),i&&(e=Math.max(e,i.left),l=Math.min(l,i.right),s=Math.max(s,i.top),h=Math.min(h,i.bottom)),t.rect(e,s,l-e,h-s),t.clip()}}function xa(t,e,i,s){const n=e.interpolate(i,s);n&&t.lineTo(n.x,n.y)}var ba={id:"filler",afterDatasetsUpdate(t,e,i){const s=(t.data.datasets||[]).length,n=[];let o,a,r,l;for(a=0;a<s;++a)o=t.getDatasetMeta(a),r=o.dataset,l=null,r&&r.options&&r instanceof oo&&(l={visible:t.isDatasetVisible(a),index:a,fill:ra(r,a,s),chart:t,axis:o.controller.options.indexAxis,scale:o.vScale,line:r}),o.$filler=l,n.push(l);for(a=0;a<s;++a)l=n[a],l&&!1!==l.fill&&(l.fill=aa(n,a,i.propagate))},beforeDraw(t,e,i){const s="beforeDraw"===i.drawTime,n=t.getSortedVisibleDatasetMetas(),o=t.chartArea;for(let e=n.length-1;e>=0;--e){const i=n[e].$filler;i&&(i.line.updateControlPoints(o,i.axis),s&&i.fill&&ua(t.ctx,i,o))}},beforeDatasetsDraw(t,e,i){if("beforeDatasetsDraw"!==i.drawTime)return;const s=t.getSortedVisibleDatasetMetas();for(let e=s.length-1;e>=0;--e){const i=s[e].$filler;oa(i)&&ua(t.ctx,i,t.chartArea)}},beforeDatasetDraw(t,e,i){const s=e.meta.$filler;oa(s)&&"beforeDatasetDraw"===i.drawTime&&ua(t.ctx,s,t.chartArea)},defaults:{propagate:!0,drawTime:"beforeDatasetDraw"}};const _a=(t,e)=>{let{boxHeight:i=e,boxWidth:s=e}=t;return t.usePointStyle&&(i=Math.min(i,e),s=t.pointStyleWidth||Math.min(s,e)),{boxWidth:s,boxHeight:i,itemHeight:Math.max(e,i)}};class ya extends $s{constructor(t){super(),this._added=!1,this.legendHitBoxes=[],this._hoveredItem=null,this.doughnutMode=!1,this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this.legendItems=void 0,this.columnSizes=void 0,this.lineWidths=void 0,this.maxHeight=void 0,this.maxWidth=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.height=void 0,this.width=void 0,this._margins=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e,i){this.maxWidth=t,this.maxHeight=e,this._margins=i,this.setDimensions(),this.buildLabels(),this.fit()}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=this._margins.left,this.right=this.width):(this.height=this.maxHeight,this.top=this._margins.top,this.bottom=this.height)}buildLabels(){const t=this.options.labels||{};let e=d(t.generateLabels,[this.chart],this)||[];t.filter&&(e=e.filter((e=>t.filter(e,this.chart.data)))),t.sort&&(e=e.sort(((e,i)=>t.sort(e,i,this.chart.data)))),this.options.reverse&&e.reverse(),this.legendItems=e}fit(){const{options:t,ctx:e}=this;if(!t.display)return void(this.width=this.height=0);const i=t.labels,s=Si(i.font),n=s.size,o=this._computeTitleHeight(),{boxWidth:a,itemHeight:r}=_a(i,n);let l,h;e.font=s.string,this.isHorizontal()?(l=this.maxWidth,h=this._fitRows(o,n,a,r)+10):(h=this.maxHeight,l=this._fitCols(o,s,a,r)+10),this.width=Math.min(l,t.maxWidth||this.maxWidth),this.height=Math.min(h,t.maxHeight||this.maxHeight)}_fitRows(t,e,i,s){const{ctx:n,maxWidth:o,options:{labels:{padding:a}}}=this,r=this.legendHitBoxes=[],l=this.lineWidths=[0],h=s+a;let c=t;n.textAlign="left",n.textBaseline="middle";let d=-1,u=-h;return this.legendItems.forEach(((t,f)=>{const g=i+e/2+n.measureText(t.text).width;(0===f||l[l.length-1]+g+2*a>o)&&(c+=h,l[l.length-(f>0?0:1)]=0,u+=h,d++),r[f]={left:0,top:u,row:d,width:g,height:s},l[l.length-1]+=g+a})),c}_fitCols(t,e,i,s){const{ctx:n,maxHeight:o,options:{labels:{padding:a}}}=this,r=this.legendHitBoxes=[],l=this.columnSizes=[],h=o-t;let c=a,d=0,u=0,f=0,g=0;return this.legendItems.forEach(((t,o)=>{const{itemWidth:p,itemHeight:m}=function(t,e,i,s,n){const o=function(t,e,i,s){let n=t.text;n&&"string"!=typeof n&&(n=n.reduce(((t,e)=>t.length>e.length?t:e)));return e+i.size/2+s.measureText(n).width}(s,t,e,i),a=function(t,e,i){let s=t;"string"!=typeof e.text&&(s=va(e,i));return s}(n,s,e.lineHeight);return{itemWidth:o,itemHeight:a}}(i,e,n,t,s);o>0&&u+m+2*a>h&&(c+=d+a,l.push({width:d,height:u}),f+=d+a,g++,d=u=0),r[o]={left:f,top:u,col:g,width:p,height:m},d=Math.max(d,p),u+=m+a})),c+=d,l.push({width:d,height:u}),c}adjustHitBoxes(){if(!this.options.display)return;const t=this._computeTitleHeight(),{legendHitBoxes:e,options:{align:i,labels:{padding:s},rtl:n}}=this,o=Oi(n,this.left,this.width);if(this.isHorizontal()){let n=0,a=ft(i,this.left+s,this.right-this.lineWidths[n]);for(const r of e)n!==r.row&&(n=r.row,a=ft(i,this.left+s,this.right-this.lineWidths[n])),r.top+=this.top+t+s,r.left=o.leftForLtr(o.x(a),r.width),a+=r.width+s}else{let n=0,a=ft(i,this.top+t+s,this.bottom-this.columnSizes[n].height);for(const r of e)r.col!==n&&(n=r.col,a=ft(i,this.top+t+s,this.bottom-this.columnSizes[n].height)),r.top=a,r.left+=this.left+s,r.left=o.leftForLtr(o.x(r.left),r.width),a+=r.height+s}}isHorizontal(){return"top"===this.options.position||"bottom"===this.options.position}draw(){if(this.options.display){const t=this.ctx;Ie(t,this),this._draw(),ze(t)}}_draw(){const{options:t,columnSizes:e,lineWidths:i,ctx:s}=this,{align:n,labels:o}=t,a=ue.color,r=Oi(t.rtl,this.left,this.width),h=Si(o.font),{padding:c}=o,d=h.size,u=d/2;let f;this.drawTitle(),s.textAlign=r.textAlign("left"),s.textBaseline="middle",s.lineWidth=.5,s.font=h.string;const{boxWidth:g,boxHeight:p,itemHeight:m}=_a(o,d),x=this.isHorizontal(),b=this._computeTitleHeight();f=x?{x:ft(n,this.left+c,this.right-i[0]),y:this.top+c+b,line:0}:{x:this.left+c,y:ft(n,this.top+b+c,this.bottom-e[0].height),line:0},Ai(this.ctx,t.textDirection);const _=m+c;this.legendItems.forEach(((y,v)=>{s.strokeStyle=y.fontColor,s.fillStyle=y.fontColor;const M=s.measureText(y.text).width,w=r.textAlign(y.textAlign||(y.textAlign=o.textAlign)),k=g+u+M;let S=f.x,P=f.y;r.setWidth(this.width),x?v>0&&S+k+c>this.right&&(P=f.y+=_,f.line++,S=f.x=ft(n,this.left+c,this.right-i[f.line])):v>0&&P+_>this.bottom&&(S=f.x=S+e[f.line].width+c,f.line++,P=f.y=ft(n,this.top+b+c,this.bottom-e[f.line].height));if(function(t,e,i){if(isNaN(g)||g<=0||isNaN(p)||p<0)return;s.save();const n=l(i.lineWidth,1);if(s.fillStyle=l(i.fillStyle,a),s.lineCap=l(i.lineCap,"butt"),s.lineDashOffset=l(i.lineDashOffset,0),s.lineJoin=l(i.lineJoin,"miter"),s.lineWidth=n,s.strokeStyle=l(i.strokeStyle,a),s.setLineDash(l(i.lineDash,[])),o.usePointStyle){const a={radius:p*Math.SQRT2/2,pointStyle:i.pointStyle,rotation:i.rotation,borderWidth:n},l=r.xPlus(t,g/2);Ee(s,a,l,e+u,o.pointStyleWidth&&g)}else{const o=e+Math.max((d-p)/2,0),a=r.leftForLtr(t,g),l=wi(i.borderRadius);s.beginPath(),Object.values(l).some((t=>0!==t))?He(s,{x:a,y:o,w:g,h:p,radius:l}):s.rect(a,o,g,p),s.fill(),0!==n&&s.stroke()}s.restore()}(r.x(S),P,y),S=gt(w,S+g+u,x?S+k:this.right,t.rtl),function(t,e,i){Ne(s,i.text,t,e+m/2,h,{strikethrough:i.hidden,textAlign:r.textAlign(i.textAlign)})}(r.x(S),P,y),x)f.x+=k+c;else if("string"!=typeof y.text){const t=h.lineHeight;f.y+=va(y,t)+c}else f.y+=_})),Ti(this.ctx,t.textDirection)}drawTitle(){const t=this.options,e=t.title,i=Si(e.font),s=ki(e.padding);if(!e.display)return;const n=Oi(t.rtl,this.left,this.width),o=this.ctx,a=e.position,r=i.size/2,l=s.top+r;let h,c=this.left,d=this.width;if(this.isHorizontal())d=Math.max(...this.lineWidths),h=this.top+l,c=ft(t.align,c,this.right-d);else{const e=this.columnSizes.reduce(((t,e)=>Math.max(t,e.height)),0);h=l+ft(t.align,this.top,this.bottom-e-t.labels.padding-this._computeTitleHeight())}const u=ft(a,c,c+d);o.textAlign=n.textAlign(ut(a)),o.textBaseline="middle",o.strokeStyle=e.color,o.fillStyle=e.color,o.font=i.string,Ne(o,e.text,u,h,i)}_computeTitleHeight(){const t=this.options.title,e=Si(t.font),i=ki(t.padding);return t.display?e.lineHeight+i.height:0}_getLegendItemAt(t,e){let i,s,n;if(tt(t,this.left,this.right)&&tt(e,this.top,this.bottom))for(n=this.legendHitBoxes,i=0;i<n.length;++i)if(s=n[i],tt(t,s.left,s.left+s.width)&&tt(e,s.top,s.top+s.height))return this.legendItems[i];return null}handleEvent(t){const e=this.options;if(!function(t,e){if(("mousemove"===t||"mouseout"===t)&&(e.onHover||e.onLeave))return!0;if(e.onClick&&("click"===t||"mouseup"===t))return!0;return!1}(t.type,e))return;const i=this._getLegendItemAt(t.x,t.y);if("mousemove"===t.type||"mouseout"===t.type){const o=this._hoveredItem,a=(n=i,null!==(s=o)&&null!==n&&s.datasetIndex===n.datasetIndex&&s.index===n.index);o&&!a&&d(e.onLeave,[t,o,this],this),this._hoveredItem=i,i&&!a&&d(e.onHover,[t,i,this],this)}else i&&d(e.onClick,[t,i,this],this);var s,n}}function va(t,e){return e*(t.text?t.text.length:0)}var Ma={id:"legend",_element:ya,start(t,e,i){const s=t.legend=new ya({ctx:t.ctx,options:i,chart:t});ls.configure(t,s,i),ls.addBox(t,s)},stop(t){ls.removeBox(t,t.legend),delete t.legend},beforeUpdate(t,e,i){const s=t.legend;ls.configure(t,s,i),s.options=i},afterUpdate(t){const e=t.legend;e.buildLabels(),e.adjustHitBoxes()},afterEvent(t,e){e.replay||t.legend.handleEvent(e.event)},defaults:{display:!0,position:"top",align:"center",fullSize:!0,reverse:!1,weight:1e3,onClick(t,e,i){const s=e.datasetIndex,n=i.chart;n.isDatasetVisible(s)?(n.hide(s),e.hidden=!0):(n.show(s),e.hidden=!1)},onHover:null,onLeave:null,labels:{color:t=>t.chart.options.color,boxWidth:40,padding:10,generateLabels(t){const e=t.data.datasets,{labels:{usePointStyle:i,pointStyle:s,textAlign:n,color:o,useBorderRadius:a,borderRadius:r}}=t.legend.options;return t._getSortedDatasetMetas().map((t=>{const l=t.controller.getStyle(i?0:void 0),h=ki(l.borderWidth);return{text:e[t.index].label,fillStyle:l.backgroundColor,fontColor:o,hidden:!t.visible,lineCap:l.borderCapStyle,lineDash:l.borderDash,lineDashOffset:l.borderDashOffset,lineJoin:l.borderJoinStyle,lineWidth:(h.width+h.height)/4,strokeStyle:l.borderColor,pointStyle:s||l.pointStyle,rotation:l.rotation,textAlign:n||l.textAlign,borderRadius:a&&(r||l.borderRadius),datasetIndex:t.index}}),this)}},title:{color:t=>t.chart.options.color,display:!1,position:"center",text:""}},descriptors:{_scriptable:t=>!t.startsWith("on"),labels:{_scriptable:t=>!["generateLabels","filter","sort"].includes(t)}}};class wa extends $s{constructor(t){super(),this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this._padding=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e){const i=this.options;if(this.left=0,this.top=0,!i.display)return void(this.width=this.height=this.right=this.bottom=0);this.width=this.right=t,this.height=this.bottom=e;const s=n(i.text)?i.text.length:1;this._padding=ki(i.padding);const o=s*Si(i.font).lineHeight+this._padding.height;this.isHorizontal()?this.height=o:this.width=o}isHorizontal(){const t=this.options.position;return"top"===t||"bottom"===t}_drawArgs(t){const{top:e,left:i,bottom:s,right:n,options:o}=this,a=o.align;let r,l,h,c=0;return this.isHorizontal()?(l=ft(a,i,n),h=e+t,r=n-i):("left"===o.position?(l=i+t,h=ft(a,s,e),c=-.5*C):(l=n-t,h=ft(a,e,s),c=.5*C),r=s-e),{titleX:l,titleY:h,maxWidth:r,rotation:c}}draw(){const t=this.ctx,e=this.options;if(!e.display)return;const i=Si(e.font),s=i.lineHeight/2+this._padding.top,{titleX:n,titleY:o,maxWidth:a,rotation:r}=this._drawArgs(s);Ne(t,e.text,0,0,i,{color:e.color,maxWidth:a,rotation:r,textAlign:ut(e.align),textBaseline:"middle",translation:[n,o]})}}var ka={id:"title",_element:wa,start(t,e,i){!function(t,e){const i=new wa({ctx:t.ctx,options:e,chart:t});ls.configure(t,i,e),ls.addBox(t,i),t.titleBlock=i}(t,i)},stop(t){const e=t.titleBlock;ls.removeBox(t,e),delete t.titleBlock},beforeUpdate(t,e,i){const s=t.titleBlock;ls.configure(t,s,i),s.options=i},defaults:{align:"center",display:!1,font:{weight:"bold"},fullSize:!0,padding:10,position:"top",text:"",weight:2e3},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const Sa=new WeakMap;var Pa={id:"subtitle",start(t,e,i){const s=new wa({ctx:t.ctx,options:i,chart:t});ls.configure(t,s,i),ls.addBox(t,s),Sa.set(t,s)},stop(t){ls.removeBox(t,Sa.get(t)),Sa.delete(t)},beforeUpdate(t,e,i){const s=Sa.get(t);ls.configure(t,s,i),s.options=i},defaults:{align:"center",display:!1,font:{weight:"normal"},fullSize:!0,padding:0,position:"top",text:"",weight:1500},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const Da={average(t){if(!t.length)return!1;let e,i,s=new Set,n=0,o=0;for(e=0,i=t.length;e<i;++e){const i=t[e].element;if(i&&i.hasValue()){const t=i.tooltipPosition();s.add(t.x),n+=t.y,++o}}if(0===o||0===s.size)return!1;return{x:[...s].reduce(((t,e)=>t+e))/s.size,y:n/o}},nearest(t,e){if(!t.length)return!1;let i,s,n,o=e.x,a=e.y,r=Number.POSITIVE_INFINITY;for(i=0,s=t.length;i<s;++i){const s=t[i].element;if(s&&s.hasValue()){const t=q(e,s.getCenterPoint());t<r&&(r=t,n=s)}}if(n){const t=n.tooltipPosition();o=t.x,a=t.y}return{x:o,y:a}}};function Ca(t,e){return e&&(n(e)?Array.prototype.push.apply(t,e):t.push(e)),t}function Oa(t){return("string"==typeof t||t instanceof String)&&t.indexOf("\\n")>-1?t.split("\\n"):t}function Aa(t,e){const{element:i,datasetIndex:s,index:n}=e,o=t.getDatasetMeta(s).controller,{label:a,value:r}=o.getLabelAndValue(n);return{chart:t,label:a,parsed:o.getParsed(n),raw:t.data.datasets[s].data[n],formattedValue:r,dataset:o.getDataset(),dataIndex:n,datasetIndex:s,element:i}}function Ta(t,e){const i=t.chart.ctx,{body:s,footer:n,title:o}=t,{boxWidth:a,boxHeight:r}=e,l=Si(e.bodyFont),h=Si(e.titleFont),c=Si(e.footerFont),d=o.length,f=n.length,g=s.length,p=ki(e.padding);let m=p.height,x=0,b=s.reduce(((t,e)=>t+e.before.length+e.lines.length+e.after.length),0);if(b+=t.beforeBody.length+t.afterBody.length,d&&(m+=d*h.lineHeight+(d-1)*e.titleSpacing+e.titleMarginBottom),b){m+=g*(e.displayColors?Math.max(r,l.lineHeight):l.lineHeight)+(b-g)*l.lineHeight+(b-1)*e.bodySpacing}f&&(m+=e.footerMarginTop+f*c.lineHeight+(f-1)*e.footerSpacing);let _=0;const y=function(t){x=Math.max(x,i.measureText(t).width+_)};return i.save(),i.font=h.string,u(t.title,y),i.font=l.string,u(t.beforeBody.concat(t.afterBody),y),_=e.displayColors?a+2+e.boxPadding:0,u(s,(t=>{u(t.before,y),u(t.lines,y),u(t.after,y)})),_=0,i.font=c.string,u(t.footer,y),i.restore(),x+=p.width,{width:x,height:m}}function La(t,e,i,s){const{x:n,width:o}=i,{width:a,chartArea:{left:r,right:l}}=t;let h="center";return"center"===s?h=n<=(r+l)/2?"left":"right":n<=o/2?h="left":n>=a-o/2&&(h="right"),function(t,e,i,s){const{x:n,width:o}=s,a=i.caretSize+i.caretPadding;return"left"===t&&n+o+a>e.width||"right"===t&&n-o-a<0||void 0}(h,t,e,i)&&(h="center"),h}function Ea(t,e,i){const s=i.yAlign||e.yAlign||function(t,e){const{y:i,height:s}=e;return i<s/2?"top":i>t.height-s/2?"bottom":"center"}(t,i);return{xAlign:i.xAlign||e.xAlign||La(t,e,i,s),yAlign:s}}function Ra(t,e,i,s){const{caretSize:n,caretPadding:o,cornerRadius:a}=t,{xAlign:r,yAlign:l}=i,h=n+o,{topLeft:c,topRight:d,bottomLeft:u,bottomRight:f}=wi(a);let g=function(t,e){let{x:i,width:s}=t;return"right"===e?i-=s:"center"===e&&(i-=s/2),i}(e,r);const p=function(t,e,i){let{y:s,height:n}=t;return"top"===e?s+=i:s-="bottom"===e?n+i:n/2,s}(e,l,h);return"center"===l?"left"===r?g+=h:"right"===r&&(g-=h):"left"===r?g-=Math.max(c,u)+n:"right"===r&&(g+=Math.max(d,f)+n),{x:Z(g,0,s.width-e.width),y:Z(p,0,s.height-e.height)}}function Ia(t,e,i){const s=ki(i.padding);return"center"===e?t.x+t.width/2:"right"===e?t.x+t.width-s.right:t.x+s.left}function za(t){return Ca([],Oa(t))}function Fa(t,e){const i=e&&e.dataset&&e.dataset.tooltip&&e.dataset.tooltip.callbacks;return i?t.override(i):t}const Va={beforeTitle:e,title(t){if(t.length>0){const e=t[0],i=e.chart.data.labels,s=i?i.length:0;if(this&&this.options&&"dataset"===this.options.mode)return e.dataset.label||"";if(e.label)return e.label;if(s>0&&e.dataIndex<s)return i[e.dataIndex]}return""},afterTitle:e,beforeBody:e,beforeLabel:e,label(t){if(this&&this.options&&"dataset"===this.options.mode)return t.label+": "+t.formattedValue||t.formattedValue;let e=t.dataset.label||"";e&&(e+=": ");const i=t.formattedValue;return s(i)||(e+=i),e},labelColor(t){const e=t.chart.getDatasetMeta(t.datasetIndex).controller.getStyle(t.dataIndex);return{borderColor:e.borderColor,backgroundColor:e.backgroundColor,borderWidth:e.borderWidth,borderDash:e.borderDash,borderDashOffset:e.borderDashOffset,borderRadius:0}},labelTextColor(){return this.options.bodyColor},labelPointStyle(t){const e=t.chart.getDatasetMeta(t.datasetIndex).controller.getStyle(t.dataIndex);return{pointStyle:e.pointStyle,rotation:e.rotation}},afterLabel:e,afterBody:e,beforeFooter:e,footer:e,afterFooter:e};function Ba(t,e,i,s){const n=t[e].call(i,s);return void 0===n?Va[e].call(i,s):n}class Wa extends $s{static positioners=Da;constructor(t){super(),this.opacity=0,this._active=[],this._eventPosition=void 0,this._size=void 0,this._cachedAnimations=void 0,this._tooltipItems=[],this.$animations=void 0,this.$context=void 0,this.chart=t.chart,this.options=t.options,this.dataPoints=void 0,this.title=void 0,this.beforeBody=void 0,this.body=void 0,this.afterBody=void 0,this.footer=void 0,this.xAlign=void 0,this.yAlign=void 0,this.x=void 0,this.y=void 0,this.height=void 0,this.width=void 0,this.caretX=void 0,this.caretY=void 0,this.labelColors=void 0,this.labelPointStyles=void 0,this.labelTextColors=void 0}initialize(t){this.options=t,this._cachedAnimations=void 0,this.$context=void 0}_resolveAnimations(){const t=this._cachedAnimations;if(t)return t;const e=this.chart,i=this.options.setContext(this.getContext()),s=i.enabled&&e.options.animation&&i.animations,n=new Ts(this.chart,s);return s._cacheable&&(this._cachedAnimations=Object.freeze(n)),n}getContext(){return this.$context||(this.$context=(t=this.chart.getContext(),e=this,i=this._tooltipItems,Ci(t,{tooltip:e,tooltipItems:i,type:"tooltip"})));var t,e,i}getTitle(t,e){const{callbacks:i}=e,s=Ba(i,"beforeTitle",this,t),n=Ba(i,"title",this,t),o=Ba(i,"afterTitle",this,t);let a=[];return a=Ca(a,Oa(s)),a=Ca(a,Oa(n)),a=Ca(a,Oa(o)),a}getBeforeBody(t,e){return za(Ba(e.callbacks,"beforeBody",this,t))}getBody(t,e){const{callbacks:i}=e,s=[];return u(t,(t=>{const e={before:[],lines:[],after:[]},n=Fa(i,t);Ca(e.before,Oa(Ba(n,"beforeLabel",this,t))),Ca(e.lines,Ba(n,"label",this,t)),Ca(e.after,Oa(Ba(n,"afterLabel",this,t))),s.push(e)})),s}getAfterBody(t,e){return za(Ba(e.callbacks,"afterBody",this,t))}getFooter(t,e){const{callbacks:i}=e,s=Ba(i,"beforeFooter",this,t),n=Ba(i,"footer",this,t),o=Ba(i,"afterFooter",this,t);let a=[];return a=Ca(a,Oa(s)),a=Ca(a,Oa(n)),a=Ca(a,Oa(o)),a}_createItems(t){const e=this._active,i=this.chart.data,s=[],n=[],o=[];let a,r,l=[];for(a=0,r=e.length;a<r;++a)l.push(Aa(this.chart,e[a]));return t.filter&&(l=l.filter(((e,s,n)=>t.filter(e,s,n,i)))),t.itemSort&&(l=l.sort(((e,s)=>t.itemSort(e,s,i)))),u(l,(e=>{const i=Fa(t.callbacks,e);s.push(Ba(i,"labelColor",this,e)),n.push(Ba(i,"labelPointStyle",this,e)),o.push(Ba(i,"labelTextColor",this,e))})),this.labelColors=s,this.labelPointStyles=n,this.labelTextColors=o,this.dataPoints=l,l}update(t,e){const i=this.options.setContext(this.getContext()),s=this._active;let n,o=[];if(s.length){const t=Da[i.position].call(this,s,this._eventPosition);o=this._createItems(i),this.title=this.getTitle(o,i),this.beforeBody=this.getBeforeBody(o,i),this.body=this.getBody(o,i),this.afterBody=this.getAfterBody(o,i),this.footer=this.getFooter(o,i);const e=this._size=Ta(this,i),a=Object.assign({},t,e),r=Ea(this.chart,i,a),l=Ra(i,a,r,this.chart);this.xAlign=r.xAlign,this.yAlign=r.yAlign,n={opacity:1,x:l.x,y:l.y,width:e.width,height:e.height,caretX:t.x,caretY:t.y}}else 0!==this.opacity&&(n={opacity:0});this._tooltipItems=o,this.$context=void 0,n&&this._resolveAnimations().update(this,n),t&&i.external&&i.external.call(this,{chart:this.chart,tooltip:this,replay:e})}drawCaret(t,e,i,s){const n=this.getCaretPosition(t,i,s);e.lineTo(n.x1,n.y1),e.lineTo(n.x2,n.y2),e.lineTo(n.x3,n.y3)}getCaretPosition(t,e,i){const{xAlign:s,yAlign:n}=this,{caretSize:o,cornerRadius:a}=i,{topLeft:r,topRight:l,bottomLeft:h,bottomRight:c}=wi(a),{x:d,y:u}=t,{width:f,height:g}=e;let p,m,x,b,_,y;return"center"===n?(_=u+g/2,"left"===s?(p=d,m=p-o,b=_+o,y=_-o):(p=d+f,m=p+o,b=_-o,y=_+o),x=p):(m="left"===s?d+Math.max(r,h)+o:"right"===s?d+f-Math.max(l,c)-o:this.caretX,"top"===n?(b=u,_=b-o,p=m-o,x=m+o):(b=u+g,_=b+o,p=m+o,x=m-o),y=b),{x1:p,x2:m,x3:x,y1:b,y2:_,y3:y}}drawTitle(t,e,i){const s=this.title,n=s.length;let o,a,r;if(n){const l=Oi(i.rtl,this.x,this.width);for(t.x=Ia(this,i.titleAlign,i),e.textAlign=l.textAlign(i.titleAlign),e.textBaseline="middle",o=Si(i.titleFont),a=i.titleSpacing,e.fillStyle=i.titleColor,e.font=o.string,r=0;r<n;++r)e.fillText(s[r],l.x(t.x),t.y+o.lineHeight/2),t.y+=o.lineHeight+a,r+1===n&&(t.y+=i.titleMarginBottom-a)}}_drawColorBox(t,e,i,s,n){const a=this.labelColors[i],r=this.labelPointStyles[i],{boxHeight:l,boxWidth:h}=n,c=Si(n.bodyFont),d=Ia(this,"left",n),u=s.x(d),f=l<c.lineHeight?(c.lineHeight-l)/2:0,g=e.y+f;if(n.usePointStyle){const e={radius:Math.min(h,l)/2,pointStyle:r.pointStyle,rotation:r.rotation,borderWidth:1},i=s.leftForLtr(u,h)+h/2,o=g+l/2;t.strokeStyle=n.multiKeyBackground,t.fillStyle=n.multiKeyBackground,Le(t,e,i,o),t.strokeStyle=a.borderColor,t.fillStyle=a.backgroundColor,Le(t,e,i,o)}else{t.lineWidth=o(a.borderWidth)?Math.max(...Object.values(a.borderWidth)):a.borderWidth||1,t.strokeStyle=a.borderColor,t.setLineDash(a.borderDash||[]),t.lineDashOffset=a.borderDashOffset||0;const e=s.leftForLtr(u,h),i=s.leftForLtr(s.xPlus(u,1),h-2),r=wi(a.borderRadius);Object.values(r).some((t=>0!==t))?(t.beginPath(),t.fillStyle=n.multiKeyBackground,He(t,{x:e,y:g,w:h,h:l,radius:r}),t.fill(),t.stroke(),t.fillStyle=a.backgroundColor,t.beginPath(),He(t,{x:i,y:g+1,w:h-2,h:l-2,radius:r}),t.fill()):(t.fillStyle=n.multiKeyBackground,t.fillRect(e,g,h,l),t.strokeRect(e,g,h,l),t.fillStyle=a.backgroundColor,t.fillRect(i,g+1,h-2,l-2))}t.fillStyle=this.labelTextColors[i]}drawBody(t,e,i){const{body:s}=this,{bodySpacing:n,bodyAlign:o,displayColors:a,boxHeight:r,boxWidth:l,boxPadding:h}=i,c=Si(i.bodyFont);let d=c.lineHeight,f=0;const g=Oi(i.rtl,this.x,this.width),p=function(i){e.fillText(i,g.x(t.x+f),t.y+d/2),t.y+=d+n},m=g.textAlign(o);let x,b,_,y,v,M,w;for(e.textAlign=o,e.textBaseline="middle",e.font=c.string,t.x=Ia(this,m,i),e.fillStyle=i.bodyColor,u(this.beforeBody,p),f=a&&"right"!==m?"center"===o?l/2+h:l+2+h:0,y=0,M=s.length;y<M;++y){for(x=s[y],b=this.labelTextColors[y],e.fillStyle=b,u(x.before,p),_=x.lines,a&&_.length&&(this._drawColorBox(e,t,y,g,i),d=Math.max(c.lineHeight,r)),v=0,w=_.length;v<w;++v)p(_[v]),d=c.lineHeight;u(x.after,p)}f=0,d=c.lineHeight,u(this.afterBody,p),t.y-=n}drawFooter(t,e,i){const s=this.footer,n=s.length;let o,a;if(n){const r=Oi(i.rtl,this.x,this.width);for(t.x=Ia(this,i.footerAlign,i),t.y+=i.footerMarginTop,e.textAlign=r.textAlign(i.footerAlign),e.textBaseline="middle",o=Si(i.footerFont),e.fillStyle=i.footerColor,e.font=o.string,a=0;a<n;++a)e.fillText(s[a],r.x(t.x),t.y+o.lineHeight/2),t.y+=o.lineHeight+i.footerSpacing}}drawBackground(t,e,i,s){const{xAlign:n,yAlign:o}=this,{x:a,y:r}=t,{width:l,height:h}=i,{topLeft:c,topRight:d,bottomLeft:u,bottomRight:f}=wi(s.cornerRadius);e.fillStyle=s.backgroundColor,e.strokeStyle=s.borderColor,e.lineWidth=s.borderWidth,e.beginPath(),e.moveTo(a+c,r),"top"===o&&this.drawCaret(t,e,i,s),e.lineTo(a+l-d,r),e.quadraticCurveTo(a+l,r,a+l,r+d),"center"===o&&"right"===n&&this.drawCaret(t,e,i,s),e.lineTo(a+l,r+h-f),e.quadraticCurveTo(a+l,r+h,a+l-f,r+h),"bottom"===o&&this.drawCaret(t,e,i,s),e.lineTo(a+u,r+h),e.quadraticCurveTo(a,r+h,a,r+h-u),"center"===o&&"left"===n&&this.drawCaret(t,e,i,s),e.lineTo(a,r+c),e.quadraticCurveTo(a,r,a+c,r),e.closePath(),e.fill(),s.borderWidth>0&&e.stroke()}_updateAnimationTarget(t){const e=this.chart,i=this.$animations,s=i&&i.x,n=i&&i.y;if(s||n){const i=Da[t.position].call(this,this._active,this._eventPosition);if(!i)return;const o=this._size=Ta(this,t),a=Object.assign({},i,this._size),r=Ea(e,t,a),l=Ra(t,a,r,e);s._to===l.x&&n._to===l.y||(this.xAlign=r.xAlign,this.yAlign=r.yAlign,this.width=o.width,this.height=o.height,this.caretX=i.x,this.caretY=i.y,this._resolveAnimations().update(this,l))}}_willRender(){return!!this.opacity}draw(t){const e=this.options.setContext(this.getContext());let i=this.opacity;if(!i)return;this._updateAnimationTarget(e);const s={width:this.width,height:this.height},n={x:this.x,y:this.y};i=Math.abs(i)<.001?0:i;const o=ki(e.padding),a=this.title.length||this.beforeBody.length||this.body.length||this.afterBody.length||this.footer.length;e.enabled&&a&&(t.save(),t.globalAlpha=i,this.drawBackground(n,t,s,e),Ai(t,e.textDirection),n.y+=o.top,this.drawTitle(n,t,e),this.drawBody(n,t,e),this.drawFooter(n,t,e),Ti(t,e.textDirection),t.restore())}getActiveElements(){return this._active||[]}setActiveElements(t,e){const i=this._active,s=t.map((({datasetIndex:t,index:e})=>{const i=this.chart.getDatasetMeta(t);if(!i)throw new Error("Cannot find a dataset at index "+t);return{datasetIndex:t,element:i.data[e],index:e}})),n=!f(i,s),o=this._positionChanged(s,e);(n||o)&&(this._active=s,this._eventPosition=e,this._ignoreReplayEvents=!0,this.update(!0))}handleEvent(t,e,i=!0){if(e&&this._ignoreReplayEvents)return!1;this._ignoreReplayEvents=!1;const s=this.options,n=this._active||[],o=this._getActiveElements(t,n,e,i),a=this._positionChanged(o,t),r=e||!f(o,n)||a;return r&&(this._active=o,(s.enabled||s.external)&&(this._eventPosition={x:t.x,y:t.y},this.update(!0,e))),r}_getActiveElements(t,e,i,s){const n=this.options;if("mouseout"===t.type)return[];if(!s)return e.filter((t=>this.chart.data.datasets[t.datasetIndex]&&void 0!==this.chart.getDatasetMeta(t.datasetIndex).controller.getParsed(t.index)));const o=this.chart.getElementsAtEventForMode(t,n.mode,n,i);return n.reverse&&o.reverse(),o}_positionChanged(t,e){const{caretX:i,caretY:s,options:n}=this,o=Da[n.position].call(this,t,e);return!1!==o&&(i!==o.x||s!==o.y)}}var Na={id:"tooltip",_element:Wa,positioners:Da,afterInit(t,e,i){i&&(t.tooltip=new Wa({chart:t,options:i}))},beforeUpdate(t,e,i){t.tooltip&&t.tooltip.initialize(i)},reset(t,e,i){t.tooltip&&t.tooltip.initialize(i)},afterDraw(t){const e=t.tooltip;if(e&&e._willRender()){const i={tooltip:e};if(!1===t.notifyPlugins("beforeTooltipDraw",{...i,cancelable:!0}))return;e.draw(t.ctx),t.notifyPlugins("afterTooltipDraw",i)}},afterEvent(t,e){if(t.tooltip){const i=e.replay;t.tooltip.handleEvent(e.event,i,e.inChartArea)&&(e.changed=!0)}},defaults:{enabled:!0,external:null,position:"average",backgroundColor:"rgba(0,0,0,0.8)",titleColor:"#fff",titleFont:{weight:"bold"},titleSpacing:2,titleMarginBottom:6,titleAlign:"left",bodyColor:"#fff",bodySpacing:2,bodyFont:{},bodyAlign:"left",footerColor:"#fff",footerSpacing:2,footerMarginTop:6,footerFont:{weight:"bold"},footerAlign:"left",padding:6,caretPadding:2,caretSize:5,cornerRadius:6,boxHeight:(t,e)=>e.bodyFont.size,boxWidth:(t,e)=>e.bodyFont.size,multiKeyBackground:"#fff",displayColors:!0,boxPadding:0,borderColor:"rgba(0,0,0,0)",borderWidth:0,animation:{duration:400,easing:"easeOutQuart"},animations:{numbers:{type:"number",properties:["x","y","width","height","caretX","caretY"]},opacity:{easing:"linear",duration:200}},callbacks:Va},defaultRoutes:{bodyFont:"font",footerFont:"font",titleFont:"font"},descriptors:{_scriptable:t=>"filter"!==t&&"itemSort"!==t&&"external"!==t,_indexable:!1,callbacks:{_scriptable:!1,_indexable:!1},animation:{_fallback:!1},animations:{_fallback:"animation"}},additionalOptionScopes:["interaction"]};return Tn.register(Un,$o,go,t),Tn.helpers={...Hi},Tn._adapters=In,Tn.Animation=As,Tn.Animations=Ts,Tn.animator=bt,Tn.controllers=nn.controllers.items,Tn.DatasetController=js,Tn.Element=$s,Tn.elements=go,Tn.Interaction=Ki,Tn.layouts=ls,Tn.platforms=Ds,Tn.Scale=tn,Tn.Ticks=ae,Object.assign(Tn,Un,$o,go,t,Ds),Tn.Chart=Tn,"undefined"!=typeof window&&(window.Chart=Tn),Tn}));
//# sourceMappingURL=chart.umd.js.map
<\/script>
</head>
<body>
  <div id="toast" class="toast"></div>
  <script src="/app.js?v=5"><\/script>
</body>
</html>
`;
var PWA_APP_CSS = `\uFEFF@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap');
:root{--bg:#080d15;--side:#0c121d;--surface:#111925;--surface2:#151f2c;--line:#202c3a;--text:#edf2f8;--muted:#8290a7;--primary:#7367f0;--primary2:#5848df;--green:#31c887;--blue:#4f8cff;--amber:#f0a52b;--red:#ef5b67;--purple:#a77bf3;--cyan:#20b8a6;--shadow:0 18px 40px rgba(0,0,0,.22)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font:13px 'DM Sans','Segoe UI',sans-serif;overflow:hidden;height:100vh}
button,input,select,textarea{font:inherit;border:0;outline:none}
a{color:var(--primary);text-decoration:none}

/* Shell */
.app-shell{display:flex;height:100vh}
.sidebar{width:240px;flex:0 0 240px;background:linear-gradient(180deg,#0d1420,#0a1019);border-right:1px solid var(--line);display:flex;flex-direction:column;transition:.25s}
.sidebar.hidden{margin-left:-240px}
.main{flex:1;min-width:0;display:flex;flex-direction:column}
.topbar{height:64px;flex:0 0 64px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:rgba(8,13,21,.8);backdrop-filter:blur(16px)}
.topbar h1{font:700 18px Manrope;margin:0}
.topbar p{color:var(--muted);margin:2px 0 0;font-size:11px}
.content{padding:24px;overflow:auto;flex:1}

/* Brand */
.brand{height:72px;padding:16px;display:flex;align-items:center;gap:11px;border-bottom:1px solid var(--line)}
.brand-mark{width:36px;height:36px;border-radius:10px;background:linear-gradient(145deg,#8175ff,#4e42c9);display:grid;place-items:center;font:800 18px Manrope;color:#fff}
.brand strong{font:800 13px Manrope;letter-spacing:.5px}
.brand strong span{color:#8d82ff}
.brand small{display:block;color:var(--muted);font-size:10px;margin-top:2px}

/* Nav */
.sidebar nav{padding:12px 10px;overflow:auto;flex:1;display:flex;flex-direction:column;gap:8px}
.nav-card{padding:6px;border:1px solid rgba(133,121,255,.16);border-radius:12px;background:linear-gradient(145deg,rgba(23,33,48,.7),rgba(10,17,27,.58))}
.nav-item{width:100%;height:38px;border:0;background:0;color:#a8b4c6;display:flex;align-items:center;gap:10px;border-radius:8px;padding:0 12px;margin:2px 0;cursor:pointer;text-align:left;transition:.15s;font-size:12px}
.nav-item:hover{background:var(--surface2);color:#fff}
.nav-item.active{color:#fff;background:linear-gradient(90deg,var(--primary2),var(--primary));box-shadow:0 6px 16px rgba(88,72,223,.22)}
.nav-item i{font-style:normal;font-size:16px;width:20px;text-align:center}
.nav-label{padding:8px 12px 4px;font:700 9px Manrope;color:var(--muted);text-transform:uppercase;letter-spacing:.8px}
.nav-secondary{margin-top:auto}

/* Profile */
.profile{height:68px;border-top:1px solid var(--line);display:flex;align-items:center;gap:10px;padding:12px}
.profile strong{font-size:12px}
.profile small{display:block;color:var(--muted);font-size:10px;margin-top:2px}
.profile small b{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--green);margin-right:4px}
.profile button{margin-left:auto;background:0;border:0;color:var(--muted);cursor:pointer;font-size:18px}

/* Avatar */
.avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(145deg,#6558d9,#26364e);display:grid;place-items:center;font-weight:700;color:#fff;font-size:12px}

/* KPI Cards */
.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:20px}
.kpi{min-height:100px;padding:16px;background:linear-gradient(145deg,rgba(25,37,53,.73),rgba(12,20,31,.62));border:1px solid rgba(140,154,180,.16);border-radius:11px;display:flex;flex-direction:column;justify-content:space-between;gap:8px}
.kpi span{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;font-weight:600}
.kpi b{font:800 22px Manrope}
.kpi .label-green{color:var(--green)}
.kpi .label-blue{color:var(--blue)}
.kpi .label-amber{color:var(--amber)}
.kpi .label-red{color:var(--red)}
.kpi .label-purple{color:var(--purple)}

/* Panels */
.panel{background:linear-gradient(145deg,rgba(18,27,40,.96),rgba(14,22,32,.96));border:1px solid var(--line);border-radius:11px;box-shadow:var(--shadow);overflow:hidden}
.panel-head{min-height:55px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line)}
.panel-head h3{font:700 13px Manrope;margin:0}
.panel-head p{color:var(--muted);font-size:11px;margin:2px 0 0}

/* Welcome */
.welcome{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px}
.welcome span{display:block;color:var(--primary);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase}
.welcome h2{font:800 22px Manrope;margin:4px 0 0}
.welcome p{color:var(--muted);font-size:12px;margin:3px 0 0}

/* Tables */
.table-wrap{overflow:auto}
table{width:100%;border-collapse:collapse}
th{height:38px;padding:0 12px;background:rgba(24,35,49,.75);color:#7f8da1;font-size:9px;text-transform:uppercase;letter-spacing:.4px;text-align:left;position:sticky;top:0;z-index:2}
td{height:48px;padding:0 12px;border-top:1px solid rgba(32,44,58,.7);font-size:10px;color:#b9c4d3}
tr:hover td{background:rgba(115,103,240,.04)}
td b{display:block;color:#e8edf3;font-size:11px}
td small{color:var(--muted);font-size:9px}

/* Status badges */
.status{display:inline-block;padding:3px 8px;border-radius:6px;font-size:9px;font-weight:700;white-space:nowrap}
.status.New{background:rgba(79,140,255,.16);color:#79a7ff}
.status.Follow-up{background:rgba(240,165,43,.16);color:#ffc45d}
.status.Contacted{background:rgba(167,123,243,.16);color:#c9a8ff}
.status.Negotiation{background:rgba(32,184,166,.16);color:#5de5d3}
.status.Quotation{background:rgba(79,140,255,.16);color:#79a7ff}
.status.Booked,.status.Confirmed{background:rgba(49,200,135,.16);color:#5de2a6}
.status.Lost{background:rgba(239,91,103,.16);color:#ff7f89}
.status.overdue{background:rgba(239,91,103,.16);color:#ff7f89}
.status.pending{background:rgba(240,165,43,.16);color:#ffc45d}
.status.Paid{background:rgba(49,200,135,.16);color:#5de2a6}
.status.Delivered{background:rgba(49,200,135,.16);color:#5de2a6}

/* Buttons */
.btn{height:36px;border-radius:8px;border:1px solid transparent;padding:0 14px;color:#fff;cursor:pointer;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:.15s;font-size:12px}
.btn:disabled{opacity:.5;pointer-events:none}
.btn.primary{background:linear-gradient(135deg,var(--primary),var(--primary2))}
.btn.primary:hover{filter:brightness(1.12)}
.btn.ghost{background:0;border-color:var(--line);color:var(--text)}
.btn.ghost:hover{background:var(--surface2)}
.btn.danger{background:rgba(239,91,103,.16);color:#ff7f89;border-color:rgba(239,91,103,.25)}
.btn.small{height:30px;padding:0 10px;font-size:10px}
.btn.green{background:var(--green)}

/* Forms */
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:20px}
label{display:flex;flex-direction:column;gap:4px;font-size:10px;font-weight:600;color:var(--muted)}
label input,label select,label textarea{height:38px;margin-top:2px;padding:0 10px;border:1px solid var(--line);border-radius:7px;background:var(--surface2);color:var(--text);font-size:12px}
label textarea{height:42px;resize:vertical;padding:8px 10px}
label input:focus,label select:focus,label textarea:focus{border-color:var(--primary)}
label.full{grid-column:1/-1}

/* Modals */
.modal-overlay{position:fixed;inset:0;z-index:50;background:rgba(1,5,10,.76);backdrop-filter:blur(5px);display:grid;place-items:center;opacity:0;transition:.18s;pointer-events:none}
.modal-overlay.show{opacity:1;pointer-events:auto}
.modal-card{width:min(660px,calc(100vw - 32px));max-height:calc(100vh - 30px);overflow:auto;background:var(--surface);border:1px solid #2b394a;border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.5);transform:translateY(10px);transition:.18s}
.modal-overlay.show .modal-card{transform:translateY(0)}
.modal-head{padding:19px 21px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:flex-start}
.modal-head h2{font:700 17px Manrope;margin:4px 0 0}
.modal-head p{color:var(--muted);font-size:11px;margin:2px 0 0}
.modal-head span{color:var(--primary);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase}
.modal-head button{background:0;border:0;color:var(--muted);font-size:22px;cursor:pointer;padding:0 4px}
.modal-actions{padding:14px 20px;border-top:1px solid var(--line);display:flex;justify-content:flex-end;gap:8px}

/* Search */
.search{height:36px;width:280px;display:flex;align-items:center;gap:8px;padding:0 10px;border:1px solid var(--line);background:var(--surface);border-radius:8px}
.search input{flex:1;background:0;color:var(--text);font-size:12px}
.search i{font-style:normal;color:var(--muted);font-size:14px}

/* Filters */
.filter-bar{display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap}
.filter-bar select{height:32px;border:1px solid var(--line);background:#0d1520;color:#bdc7d5;border-radius:7px;padding:0 8px;font-size:10px}

/* Toast */
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);padding:10px 20px;border-radius:8px;background:var(--surface);border:1px solid var(--line);color:var(--text);font-size:12px;font-weight:600;box-shadow:0 12px 30px rgba(0,0,0,.4);opacity:0;transition:.25s;z-index:100;pointer-events:none}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

/* Activity timeline */
.activity-section{margin-top:16px;border:1px solid rgba(115,103,240,.2);border-radius:11px;background:rgba(9,16,27,.46);overflow:hidden}
.activity-head{min-height:55px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 15px;border-bottom:1px solid var(--line)}
.activity-head span{color:#958bff;font-size:8px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase}
.activity-head h3{font:700 13px Manrope;margin:2px 0 0}
.activity-composer{display:flex;align-items:center;gap:7px;flex:1;max-width:500px}
.activity-composer select{height:32px;border:1px solid var(--line);border-radius:7px;background:var(--surface2);color:var(--text);padding:0 8px;font-size:10px;width:100px}
.activity-composer input{height:32px;border:1px solid var(--line);border-radius:7px;background:var(--surface2);color:var(--text);padding:0 8px;font-size:10px;flex:1}
.activity-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));max-height:260px;overflow:auto}
.activity-row{display:flex;gap:10px;padding:12px;border-right:1px solid rgba(32,44,58,.45);border-bottom:1px solid rgba(32,44,58,.45)}
.activity-icon{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;border-radius:8px;background:rgba(115,103,240,.12);color:#a99fff;font-size:14px}
.activity-row div{min-width:0}
.activity-row b{font-size:10px}
.activity-row p{margin:3px 0;color:#c3ccd8;font-size:10px;line-height:1.4}
.activity-row small{color:var(--muted);font-size:9px}
.activity-empty{grid-column:1/-1;padding:24px;text-align:center;color:var(--muted);font-size:10px}

/* Lead detail panel */
.lead-detail{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
.lead-detail .info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(32,44,58,.3);font-size:11px}
.lead-detail .info-row span:first-child{color:var(--muted)}
.lead-detail .info-row b{font-weight:600}

/* Dashboard grid */
.dash-grid{display:grid;grid-template-columns:1.15fr 1fr .85fr;gap:15px}
@media(max-width:1100px){.dash-grid{grid-template-columns:1fr 1fr}}
@media(max-width:700px){.dash-grid{grid-template-columns:1fr}}

/* Customer cards */
.customer-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}
.customer-card{text-align:center;padding-bottom:15px;position:relative;overflow:hidden}
.customer-cover{height:80px;background:linear-gradient(135deg,#253148,#151d2a)}
.customer-cover.c0{background:linear-gradient(135deg,#3a2f6b,#1a1533)}
.customer-cover.c1{background:linear-gradient(135deg,#14404d,#0d2228)}
.customer-cover.c2{background:linear-gradient(135deg,#4d2c1d,#221410)}
.customer-cover.c3{background:linear-gradient(135deg,#1f3d5c,#101f30)}
.customer-cover.c4{background:linear-gradient(135deg,#412a56,#1e1427)}
.customer-card>.avatar{margin:-29px auto 8px;border:3px solid var(--surface)}
.customer-card h3{margin:0}
.customer-card p{color:var(--muted);margin:4px 0 12px}
.customer-card>div:nth-of-type(3){display:flex;justify-content:space-around;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:10px;margin-bottom:12px;font-size:10px;color:var(--muted)}
.customer-card small{color:var(--muted);font-size:9px}
.customer-actions{display:flex;gap:8px;justify-content:center;padding:0 12px}
.customer-actions .btn{flex:1}
.wa-reminder-btn{display:inline-flex;align-items:center;justify-content:center;padding:8px 10px;border-radius:8px;background:rgba(49,200,135,.12);color:var(--green);font-size:11px;font-weight:600;border:1px solid rgba(49,200,135,.25)}
.clean-empty{text-align:center;padding:60px 20px}
.clean-empty .placeholder-icon{margin:0 auto 14px}
/* Source chips */
.source-chips{display:flex;flex-direction:column;gap:8px;padding:16px}
.source-chip{display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--line);border-radius:9px;padding:10px 12px;cursor:pointer;color:var(--text);text-align:left}
.source-chip span{flex:1;font-weight:600}
.source-chip b{font-size:13px}
.source-chip i{display:block;flex:0 0 70px;height:6px;border-radius:4px;background:var(--line);overflow:hidden}
.source-chip i em{display:block;height:100%;background:var(--primary);border-radius:4px}
.source-chip:hover{border-color:rgba(133,121,255,.4)}
/* Backup cards */
.backup-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}
.backup-card{min-height:285px;display:flex;flex-direction:column;align-items:flex-start;padding:24px}
.backup-card>div:nth-child(2){flex:1}
.backup-icon{width:48px;height:48px;display:grid;place-items:center;margin-bottom:20px;border:1px solid rgba(115,103,240,.32);border-radius:8px;background:rgba(115,103,240,.11);color:#aaa1ff;font-size:22px}
.backup-icon.restore{border-color:rgba(32,184,166,.32);background:rgba(32,184,166,.1);color:#4dd6c6}
.backup-card span{color:#958bff;font-size:8px;font-weight:700;letter-spacing:1.1px}
.backup-card.restore span{color:#45cdbc}
.backup-card h3{margin:7px 0 9px;font:700 16px Manrope}
.backup-card p{max-width:440px;margin:0;color:var(--muted);font-size:10px;line-height:1.7}
.backup-card .btn{min-width:145px;margin-top:22px}
.backup-note{display:flex;align-items:center;gap:22px;margin-top:15px;padding:16px 20px}
.backup-note b{color:#d8e0ea;font-size:10px}
.backup-note span{color:var(--muted);font-size:9px}
@media(max-width:800px){.backup-grid{grid-template-columns:1fr}.backup-note{align-items:flex-start;flex-direction:column;gap:8px}}
@media(max-width:900px){.customer-grid{grid-template-columns:1fr 1fr}}

/* Lead profile + event modal additions */
.profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 18px}
.profile-grid>div{display:flex;flex-direction:column;gap:2px;padding:9px 12px;background:var(--surface2);border:1px solid var(--line);border-radius:9px}
.profile-grid>div span{font-size:10px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.4px}
.profile-grid>div b{font-size:13px;color:var(--text);word-break:break-word}
.activity-item{display:flex;gap:10px;padding:10px 12px;border-bottom:1px solid var(--line);font-size:12px}
.activity-item:last-child{border-bottom:0}
.activity-item b{font-size:12px;color:var(--text)}
.activity-item p{color:var(--muted);margin:2px 0 0}
.activity-item small{color:var(--muted);font-size:10px}
.cal-day{cursor:pointer}

@media(max-width:600px){.customer-grid{grid-template-columns:1fr}}

/* Mobile shell improvements */
@media(max-width:900px){
  .main{padding-bottom:0}
  .topbar{padding:0 14px}
  .topbar h1{font-size:15px}
  .topbar p{font-size:10px}
  .search{width:auto;flex:0 1 150px}
  .content{padding:14px}
  .nav-item{font-size:12px}
}
@media(max-width:600px){
  .app-shell{flex-direction:column}
  .sidebar{width:100%;height:auto;max-height:0;overflow:hidden;position:relative;border-right:0;border-bottom:1px solid var(--line)}
  .sidebar:not(.hidden){max-height:70vh;overflow:auto}
  .sidebar.hidden{margin-left:0;display:none}
  .main{height:100%}
  .brand{height:56px}
  .profile{display:none}
  .table-wrap{overflow-x:auto}
  .table-wrap table{min-width:640px}
  .kpi-grid{grid-template-columns:1fr 1fr;gap:10px}
  .dash-grid{grid-template-columns:1fr}
  .welcome{flex-direction:column;align-items:flex-start;gap:10px}
  .topbar{height:56px}
}

/* Responsive */
@media(max-width:900px){
  .sidebar{position:fixed;z-index:40;height:100vh;transition:margin .25s}
  .sidebar.hidden{margin-left:-240px}
  .search{width:180px}
}
@media(max-width:600px){
  .form-grid{grid-template-columns:1fr}
  .kpi-grid{grid-template-columns:1fr 1fr}
  .content{padding:16px}
}

/* Light theme */
body[data-theme="light"]{--bg:#eef2f7;--side:#fff;--surface:#fff;--surface2:#f5ffa;--line:#dce3ec;--text:#172133;--muted:#69778b}
body[data-theme="light"] .sidebar{background:linear-gradient(165deg,rgba(255,255,255,.9),rgba(241,245,252,.84))}
body[data-theme="light"] .topbar{background:rgba(255,255,255,.88)}
body[data-theme="light"] .panel{background:rgba(255,255,255,.82);border-color:rgba(104,88,220,.13)}
body[data-theme="light"] .kpi{background:linear-gradient(145deg,rgba(255,255,255,.82),rgba(240,244,251,.7));border-color:rgba(140,154,180,.18)}
body[data-theme="light"] label input,body[data-theme="light"] label select,body[data-theme="light"] label textarea{background:var(--surface2);border-color:var(--line)}
body[data-theme="light"] th{background:rgba(240,244,251,.8)}
body[data-theme="light"] td{border-color:rgba(220,227,236,.5)}
body[data-theme="light"] .modal-card{background:var(--surface);border-color:rgba(104,88,220,.13)}

/* Login */
.login-screen{display:grid;place-items:center;height:100vh;background:radial-gradient(circle at 74% -20%,rgba(81,93,164,.12),transparent 34%),var(--bg)}
.login-card{width:min(380px,calc(100vw - 40px));padding:32px;background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,.3)}
.login-card .brand-mark{width:44px;height:44px;border-radius:12px;font:800 22px Manrope;margin:0 auto 16px}
.login-card h2{font:800 20px Manrope;text-align:center;margin-bottom:4px}
.login-card p{text-align:center;color:var(--muted);font-size:12px;margin-bottom:20px}
.login-card .form-grid{padding:0}
.login-card label{margin-bottom:14px}
.login-card .btn{width:100%;height:40px;margin-top:4px}
.login-error{color:var(--red);font-size:11px;min-height:16px;margin-top:8px;text-align:center}

/* Install banner */
.install-banner{position:fixed;bottom:0;left:0;right:0;padding:12px 24px;background:linear-gradient(90deg,var(--primary2),var(--primary));display:flex;align-items:center;justify-content:space-between;z-index:60;box-shadow:0 -8px 30px rgba(0,0,0,.3)}
.install-banner span{font-size:12px;font-weight:600}
.install-banner .btn{height:32px;padding:0 14px;font-size:11px}
.install-banner.hidden{display:none}

/* Calendar (Shoot Calendar / Slotting) */
.calendar{padding:14px}
.calendar-toolbar{height:44px;display:flex;align-items:center;gap:10px}
.calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}
.calendar-grid.headings b{text-align:center;padding:8px;color:var(--muted);font-size:9px;border-bottom:1px solid var(--line)}
.cal-day{height:92px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:6px;overflow:hidden;background:rgba(10,17,27,.35)}
.cal-day>span{font-size:10px;color:#bdc7d5;display:inline-block;margin-bottom:4px}
.cal-day.muted{opacity:.32}
.cal-day.today>span{background:var(--primary);border-radius:50%;width:20px;height:20px;display:grid;place-content:center;color:#fff;font-weight:700}
.event{display:block;font-style:normal;font-size:8px;padding:3px 5px;margin-top:3px;border-radius:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:rgba(115,103,240,.18);color:#c7b8ff}
.event.more{background:transparent;color:var(--muted);padding-left:5px}
/* Monthly bars */
.monthly-bars{padding:14px 16px;display:grid;gap:11px}
.monthly-bars>div{display:grid;grid-template-columns:130px 1fr 90px;align-items:center;gap:10px;font-size:10px}
.monthly-bars span{color:#c3ccd8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.monthly-bars i{height:8px;border-radius:5px;background:rgba(32,44,58,.8);overflow:hidden;display:block}
.monthly-bars em{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,var(--primary2),var(--primary))}
.monthly-bars b{text-align:right;font-size:11px;color:#e8edf3}
.widget-empty{text-align:center;padding:26px;color:var(--muted);font-size:11px}
.widget-empty b{display:block;font-size:22px;margin-bottom:6px;color:#43536b}
/* Extra statuses */
.status.ready{background:rgba(240,165,43,.18);color:#ffc45d}
.status.in-progress{background:rgba(79,140,255,.16);color:#79a7ff}
.status.Active{background:rgba(49,200,135,.16);color:#5de2a6}
.status.Inactive{background:rgba(239,91,103,.16);color:#ff7f89}
.status.In-House{background:rgba(49,200,135,.16);color:#5de2a6}
.status.Outside{background:rgba(240,165,43,.16);color:#ffc45d}
.status.Scheduled{background:rgba(79,140,255,.16);color:#79a7ff}
.status.Completed{background:rgba(49,200,135,.16);color:#5de2a6}
.status.Cancelled{background:rgba(130,144,167,.16);color:#9aa8bb}
.brand-mark img{width:100%;height:100%;object-fit:contain;display:block}
.brand-mark.has-logo{background:transparent;border:0;box-shadow:none;overflow:visible}
.connection-pill{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:9px;font-weight:700;white-space:nowrap}
.connection-pill:before{content:'';width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 10px rgba(49,200,135,.75)}
.connection-pill.offline:before{background:var(--red);box-shadow:0 0 10px rgba(239,91,103,.7)}
.topbar-actions{display:flex;align-items:center;gap:8px}
.mobile-nav{display:none}
.portal-audit-row{padding:10px 0;border-top:1px solid var(--line);display:grid;gap:3px}
.portal-audit-row small{color:var(--muted)}
.portal-status-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:18px 20px}
.portal-status-grid>div{padding:12px;border:1px solid var(--line);border-radius:9px;background:var(--surface2)}
.portal-status-grid span{display:block;color:var(--muted);font-size:9px;text-transform:uppercase;letter-spacing:.5px}
.portal-status-grid b{display:block;margin-top:5px;font-size:12px}

@media(max-width:900px){
  .sidebar{display:flex!important;position:fixed!important;inset:0 auto 0 0;width:min(84vw,280px)!important;height:100dvh!important;max-height:none!important;margin:0!important;transform:translateX(-105%);transition:transform .22s ease;box-shadow:20px 0 60px rgba(0,0,0,.5);z-index:80}
  .sidebar:not(.hidden){transform:translateX(0)}
  .main{width:100%;height:100dvh}
  .content{padding-bottom:88px}
  .mobile-nav{position:fixed;left:10px;right:10px;bottom:calc(8px + env(safe-area-inset-bottom));height:62px;z-index:70;display:grid;grid-template-columns:repeat(5,1fr);background:rgba(13,22,35,.96);border:1px solid var(--line);border-radius:16px;box-shadow:0 14px 40px rgba(0,0,0,.45);backdrop-filter:blur(18px);overflow:hidden}
  .mobile-nav button{border:0;background:transparent;color:var(--muted);display:grid;place-items:center;align-content:center;gap:3px;font-size:9px;min-width:0}
  .mobile-nav button i{font-style:normal;font-size:17px;line-height:1}
  .mobile-nav button.active{color:#fff;background:rgba(115,103,240,.17)}
  body.pwa-drawer-open:after{content:'';position:fixed;inset:0;background:rgba(1,5,10,.58);z-index:75}
}
@media(max-width:600px){
  .topbar{padding:0 12px}.topbar .search{display:none}.topbar h1{max-width:50vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .connection-pill{padding:5px 7px}.connection-pill span{display:none}
  .content{padding:12px 12px 90px}.kpi-grid{grid-template-columns:1fr 1fr}.kpi{min-height:94px}
  .modal-card{width:calc(100vw - 18px);max-height:calc(100dvh - 18px);border-radius:13px}
  .modal-head{padding:16px}.form-grid{padding:16px!important}.modal-actions{position:sticky;bottom:0;background:var(--surface);padding:12px;flex-wrap:wrap}
  .modal-actions .btn{flex:1;min-width:110px}.profile-grid,.portal-status-grid{grid-template-columns:1fr}.portal-status-grid{padding:14px}
  .monthly-bars>div{grid-template-columns:88px 1fr 72px}.welcome h2{font-size:19px}
}

/* Match the approved Windows workspace */
.sidebar{width:238px;flex-basis:238px;background:linear-gradient(165deg,rgba(15,24,38,.94),rgba(7,13,22,.88));box-shadow:12px 0 45px rgba(0,0,0,.22),inset -1px 0 rgba(122,109,255,.07);backdrop-filter:blur(22px) saturate(135%)}
.brand{height:96px;padding:14px 18px}.brand-mark{width:64px;height:64px;flex:0 0 64px;border-radius:0;background:transparent;box-shadow:none}.brand strong{font:800 12px Manrope;letter-spacing:.5px}.brand small{font-size:8px}
.sidebar nav{padding:13px 10px;gap:12px}.sidebar-menu-card{padding:6px;border:1px solid rgba(133,121,255,.16);border-radius:12px;background:linear-gradient(145deg,rgba(23,33,48,.7),rgba(10,17,27,.58));box-shadow:0 10px 25px rgba(0,0,0,.14),inset 0 1px rgba(255,255,255,.025)}
.sidebar-menu-card-primary .nav-group-toggle{margin-bottom:3px;border-color:rgba(255,255,255,.06);font-weight:700;letter-spacing:.15px;box-shadow:inset 0 1px rgba(255,255,255,.025)}
.sidebar-menu-card-primary .nav-group:nth-child(1) .nav-group-toggle{color:#b8b1ff;background:linear-gradient(100deg,rgba(115,103,240,.2),rgba(115,103,240,.06));border-color:rgba(115,103,240,.3)}
.sidebar-menu-card-primary .nav-group:nth-child(2) .nav-group-toggle{color:#72e1d3;background:linear-gradient(100deg,rgba(32,184,166,.2),rgba(32,184,166,.06));border-color:rgba(32,184,166,.3)}
.sidebar-menu-card-primary .nav-group:nth-child(3) .nav-group-toggle{color:#ffd06e;background:linear-gradient(100deg,rgba(240,165,43,.2),rgba(240,165,43,.06));border-color:rgba(240,165,43,.3)}
.sidebar-menu-card-primary .nav-group:nth-child(4) .nav-group-toggle{color:#ff9da5;background:linear-gradient(100deg,rgba(239,91,103,.2),rgba(239,91,103,.06));border-color:rgba(239,91,103,.3)}
.sidebar-menu-card-primary .nav-group-toggle:hover,.sidebar-menu-card-primary .nav-group-toggle.group-active{color:#fff;filter:brightness(1.18);box-shadow:0 7px 18px rgba(0,0,0,.2),inset 3px 0 currentColor}.sidebar-menu-card-primary .nav-group-toggle>i{color:inherit;filter:drop-shadow(0 0 5px currentColor)}.sidebar-menu-card-primary .nav-group-toggle>b{color:inherit;opacity:.75}
.nav-group{margin:2px 0 5px}.nav-group-toggle{width:100%;height:41px;border:1px solid transparent;background:transparent;color:#a8b4c6;display:flex;align-items:center;gap:12px;border-radius:8px;padding:0 12px;cursor:pointer;text-align:left;transition:.2s}.nav-group-toggle>i{font-style:normal;font-size:18px;width:20px;text-align:center}.nav-group-toggle>span{flex:1;font-size:13px;font-weight:600}.nav-group-toggle>b{font-size:14px;color:#66758a;transition:transform .22s ease}.nav-group-toggle:hover,.nav-group-toggle.group-active{color:#fff;background:linear-gradient(100deg,rgba(115,103,240,.13),rgba(32,184,166,.05));border-color:rgba(133,121,255,.18)}.nav-group-toggle.group-active>i{color:#a99fff;filter:drop-shadow(0 0 5px rgba(145,131,255,.7))}.nav-group.open .nav-group-toggle>b{transform:rotate(180deg)}
.nav-submenu{display:block;overflow:hidden;max-height:0;opacity:0;transition:max-height .25s ease,opacity .2s ease}.nav-group.open .nav-submenu{max-height:285px;opacity:1}.nav-item{position:relative;overflow:hidden;height:39px;gap:12px;padding:0 12px;border:1px solid transparent}.nav-item i{font-style:normal;font-size:18px;width:20px;text-align:center}.nav-item span{font-size:12px}.nav-item.sub-item{width:calc(100% - 12px);height:37px;margin-left:12px;padding-left:13px}.nav-item.sub-item:before{content:'';position:absolute;left:-7px;width:1px;height:100%;background:rgba(115,103,240,.2)}.nav-item:hover{transform:translateX(4px);color:#fff;background:linear-gradient(100deg,rgba(115,103,240,.17),rgba(32,184,166,.07));border-color:rgba(133,121,255,.27)}.nav-item.active{color:#fff;background:linear-gradient(90deg,var(--primary2),var(--primary));border-color:rgba(171,160,255,.35);box-shadow:0 8px 24px rgba(88,72,223,.38),inset 0 1px rgba(255,255,255,.18)}.owner-item{margin-bottom:5px}
.profile{height:76px;padding:13px}.profile strong{font-size:12px}.profile-date{font-size:8px!important}.topbar{height:78px;flex-basis:78px;padding:0 25px}.page-title{display:flex;gap:14px;align-items:center}.page-title>button{border:0;background:none;color:var(--muted);font-size:21px;cursor:pointer}.page-title h1{font:700 20px Manrope;margin:0}.page-title p{color:var(--muted);margin:3px 0 0;font-size:11px}.top-actions{display:flex;align-items:center;gap:9px}.find-shortcut{height:32px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:#b9c4d3;padding:0 9px;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap}.find-shortcut kbd{margin-left:5px;padding:2px 4px;border:1px solid rgba(130,144,167,.35);border-radius:4px;color:var(--muted);font:9px inherit}.top-actions .search{height:38px;width:340px;border-radius:9px}.search>span:first-child{font-size:20px;color:var(--muted)}.search-clear{width:24px;height:24px;flex:0 0 24px;border:0;border-radius:6px;background:rgba(130,144,167,.12);color:#aeb9c8;font-size:17px;cursor:pointer}.search-clear:disabled{visibility:hidden}.icon-btn{width:38px;height:38px;border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--text);cursor:pointer}.content{padding:24px}
.connection-pill,#installAppBtn{display:none!important}.mobile-nav{display:none!important}

.login-page{min-height:100vh;display:grid;grid-template-columns:minmax(560px,56%) minmax(430px,44%);background:#08111d}.login-visual{position:relative;display:flex;flex-direction:column;min-height:100vh;padding:40px 52px;background:#070b10 url('/app-assets/login-studio-camera-v2.png') right center/cover no-repeat;overflow:hidden}.login-visual:before{content:'';position:absolute;z-index:0;inset:0;background:linear-gradient(90deg,rgba(3,7,11,.72),rgba(3,7,11,.54) 48%,rgba(3,7,11,.16) 78%,rgba(2,5,9,.55))}.login-product-brand,.visual-copy,.login-quote{position:relative;z-index:1}.login-product-brand{display:flex;align-items:center;gap:11px}.login-product-brand .brand-mark{width:40px;height:40px;flex:0 0 40px;border-radius:11px;background:linear-gradient(145deg,#8e72ff,#4f36d7);box-shadow:0 0 25px rgba(126,88,255,.42);font-size:20px}.login-product-brand strong{font:800 14px Manrope;letter-spacing:.3px}.login-product-brand strong span{color:#8d82ff}.login-product-brand small{display:block;margin-top:4px;color:#d2d9e5;font-size:9px}.visual-copy{margin:auto 0;max-width:650px;padding-top:52px}.visual-copy h1{margin:0 0 20px;color:#f7f8fb;font:800 clamp(44px,4.1vw,67px)/1.13 Manrope;letter-spacing:-2.4px;text-align:center;text-shadow:0 3px 24px rgba(0,0,0,.4)}.visual-copy h1 span{display:block}.visual-copy>p{width:min(520px,100%);margin:0 auto;color:#e4e9f1;font-size:11px;line-height:1.55;text-align:center;text-shadow:0 2px 12px #000}.visual-stats{display:flex;width:max-content;margin-top:36px;border:1px solid rgba(190,203,224,.18);border-radius:11px;background:rgba(5,10,17,.64);backdrop-filter:blur(9px)}.visual-stats div{min-width:150px;padding:16px 20px;border-right:1px solid rgba(190,203,224,.16)}.visual-stats div:last-child{border:0}.visual-stats b{display:block;font:700 17px Manrope}.visual-stats small{display:block;margin-top:3px;color:#9aa8bc;font-size:10px}.login-quote{margin-top:auto;color:#d7dee9;font-size:11px}.login-panel{display:grid;place-items:center;min-height:100vh;padding:48px;background:radial-gradient(circle at 35% 46%,rgba(16,54,76,.22),transparent 40%),linear-gradient(145deg,#101b2a,#091421 72%,#07121d)}.login-card{width:100%;max-width:430px;padding:0;background:none;border:0;box-shadow:none}.login-card .eyebrow{color:#9b8cff;font-size:9px;letter-spacing:1.8px;font-weight:700}.login-card h2{margin:12px 0 8px;color:#f6f8fb;font:800 29px Manrope;text-align:left}.login-card>p{margin:0 0 28px;color:#9ba9bc;font-size:12px;text-align:left}.login-card>label{display:block;margin-top:16px;color:#d6deea;font-size:10px;font-weight:700}.login-input{height:46px;margin-top:8px;border:1px solid #253448;background:rgba(7,17,28,.66);border-radius:9px;display:flex;align-items:center;gap:10px;padding:0 12px}.login-input:focus-within{border-color:#796af2;box-shadow:0 0 0 3px rgba(115,103,240,.12)}.login-input input{height:100%;flex:1;min-width:0;border:0;background:none;color:var(--text);outline:0}.login-input button{border:0;background:none;color:#718096;cursor:pointer}.login-options{display:flex;align-items:center;justify-content:space-between;margin:17px 0 22px;font-size:10px}.login-options label{display:flex;align-items:center;gap:6px;color:var(--muted)}.login-options button{border:0;background:none;color:#8f85ff;font-size:10px;cursor:pointer}.login-submit{width:100%;height:46px;border:0;border-radius:8px;background:linear-gradient(105deg,#7667f5,#6548e8);color:#fff;font-weight:700;box-shadow:0 12px 30px rgba(88,72,223,.27);cursor:pointer}.login-alert{display:none;margin:15px 0 2px;padding:10px 12px;border:1px solid rgba(239,91,103,.25);border-radius:8px;background:rgba(239,91,103,.1);color:#ff8790;font-size:10px}.login-alert.visible{display:block}.demo-login{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:20px;padding:12px 14px;border:1px solid #26354b;border-radius:8px;background:rgba(39,52,75,.48);color:var(--muted);font-size:9px}.demo-login b{grid-column:1/-1;color:#dce4ef}.license{display:block;margin-top:24px;color:#52647c;text-align:center;font-size:8px}
@media(max-width:1120px){.login-page{grid-template-columns:minmax(490px,54%) minmax(400px,46%)}.login-visual{padding:34px 38px}.top-actions .search{width:240px}.connection-pill{display:none}}
@media(max-width:900px){.content{padding-bottom:24px}}
@media(max-width:850px){.login-page{display:block}.login-visual{display:none}.login-panel{min-height:100vh;padding:28px}.login-card{max-width:430px}.find-shortcut,.top-actions>.icon-btn{display:none}}
@media(max-width:600px){.content{padding:12px}}
`;
var PWA_APP_JS = `// LenspireCRM Pro - PWA client (browser, no Electron)
const API = location.origin;
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const sameId = (a, b) => String(a ?? '') === String(b ?? '');
const dateFmt = v => v && v !== '-' ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '\\u2014';
const dateTimeFmt = v => v ? new Date(v).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '\\u2014';
const money = v => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v || 0));
const monthLabel = k => { const [y, m] = k.split('-'); const d = new Date(y, m - 1); return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }); };
const currentMonthKey = () => { const d = new Date(); return \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}\`; };
const localDateKey = () => { const d = new Date(); return \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}-\${String(d.getDate()).padStart(2, '0')}\`; };
const lastMonthKeys = count => Array.from({ length: count }, (_, i) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i); return \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}\`; });
const initials = name => String(name || '?').split(/\\s+/).map(p => p[0]).join('').slice(0, 2).toUpperCase();
const opt = (value, current) => \`<option value="\${esc(value)}"\${String(value) === String(current ?? '') ? ' selected' : ''}>\${esc(value)}</option>\`;
const waLink = (number, text) => 'https://wa.me/' + String(number || '').replace(/\\D/g, '') + '?text=' + encodeURIComponent(text || '');
const sep = ' \\u00B7 ';
const kpi = (label, value, sub, cls, icon) => \`<div class="kpi"><span>\${esc(icon || '')} \${esc(label)}</span><b class="\${esc(cls || '')}">\${value ?? '\\u2014'}</b><small style="color:var(--muted);font-size:10px">\${esc(sub || '')}</small></div>\`;
const stageBadge = job => {
  if (!job) return '<span class="status pending">\\u2014</span>';
  const stage = job.stage || 'Shoot Planning';
  const overdue = stage !== 'Delivered' && job.due_date && String(job.due_date) < localDateKey();
  const cls = stage === 'Delivered' ? 'Delivered' : stage === 'Ready for Delivery' ? 'ready' : overdue ? 'overdue' : 'pending';
  return \`<span class="status \${esc(cls)}">\${esc(overdue && stage !== 'Delivered' ? 'Overdue \\u00B7 ' + stage : stage)}</span>\`;
};
const statusPill = s => \`<span class="status \${esc(String(s || '').replace(/[^A-Za-z ]/g, ''))}">\${esc(s || '\\u2014')}</span>\`;

// State
let token = '';
let refreshToken = '';
let user = null;
localStorage.removeItem('lp_token');
localStorage.removeItem('lp_refresh');
localStorage.removeItem('lp_user');
let state = {
  view: 'Dashboard', leads: [], activities: [], customers: [], bookings: [], production: [],
  events: [], payments: [], salesTargets: [], salesExecutives: [], photographers: [], photographerDetails: [],
  sidebarHidden: matchMedia('(max-width:900px)').matches, query: '', leadSource: '', charts: [], cloudReady: true,
  groupOpen: { 'Sales & Marketing': false, Operations: false, Accounts: false, 'Post Production': false },
  calendarDate: new Date(), upcomingFilter: 'All', completedFilter: 'All',
  reportMonth: currentMonthKey(), productionReportMonth: currentMonthKey(), accountsFilter: { status: 'All', mode: 'All', month: 'All', salesperson: 'All' }, productionFilter: { stage: 'All', editor: 'All', delivery: 'All' }
};
let deferredPrompt = null;
const clientPortalLinkCache = new Map();
function workspaceName() { return String(user?.organizationName || user?.organization_name || user?.organizationBranding?.name || 'LenspireCRM').trim() || 'LenspireCRM'; }
function workspaceLogo() { const value = String(user?.organizationBranding?.logoUrl || user?.organizationBranding?.logo_url || '').trim(); return /^https:\\/\\/[^\\s]+$/i.test(value) ? value : ''; }
function normalizedAccess() {
  if (user?.role === 'Administrator') return { sales: 'full', operations: 'full', accounts: 'full', postProduction: 'full' };
  let access = user?.departmentAccess || {};
  if (typeof access === 'string') { try { access = JSON.parse(access); } catch { access = {}; } }
  return { sales: 'none', operations: 'none', accounts: 'none', postProduction: 'none', ...(access || {}) };
}
function canSeeDepartment(name) { const key = String(name || '').toLowerCase() === 'postproduction' ? 'postProduction' : name; return user?.role === 'Administrator' || normalizedAccess()[key] !== 'none'; }
function mobileViewForDepartment(name) { return ({ sales: 'Dashboard', operations: 'Operations Dashboard', accounts: 'Payment Dashboard', postproduction: String(user?.role || '').toLowerCase() === 'editor' ? 'Ongoing Jobs' : 'Production Dashboard' })[name]; }

// API layer
async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (!['GET','HEAD'].includes(String(opts.method || 'GET').toUpperCase())) headers['x-lenspire-web'] = '1';
  const res = await fetch(API + path, { ...opts, headers });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      const refreshed = await tryRefresh();
      if (refreshed) return api(path, opts);
    }
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

async function tryRefresh() {
  try {
    const res = await fetch(API + '/api/auth/refresh', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-lenspire-web':'1' }, body: '{}' });
    const data = await res.json();
    if (res.ok) return true;
  } catch {}
  logout();
  return false;
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// Auth
function loginScreen(message = '') {
  const remembered = localStorage.getItem('lp_remembered_user') || '';
  document.body.innerHTML = \`<main class="login-page">
    <section class="login-visual">
      <div class="login-product-brand"><div class="brand-mark">L</div><div><strong>LENSPIRE<span>CRM</span></strong><small>Photography Studio ERP</small></div></div>
      <div class="visual-copy"><h1>From first inquiry<span>to final delivery.</span></h1><p>Manage leads, shoots, clients, payments and production through one secure studio workspace.</p><div class="visual-stats"><div><b>Ready</b><small>Lead management</small></div><div><b>Secure</b><small>Cloud sign-in</small></div><div><b>Synced</b><small>Studio access</small></div></div></div>
      <div class="login-quote">&quot;Focus on the moments. Your workspace handles the workflow.&quot;</div>
    </section>
    <section class="login-panel"><form class="login-card" id="loginForm">
      <span class="eyebrow">WELCOME BACK</span><h2>LenspireCRM</h2><p>Sign in to manage your studio workspace.</p>
      <div class="login-alert\${message ? ' visible' : ''}" id="loginError">\${esc(message)}</div>
      <label>Username<div class="login-input"><span>\\u2659</span><input name="username" value="\${esc(remembered)}" required autocomplete="username" placeholder="Enter username"></div></label>
      <label>Password<div class="login-input"><span>\\u25C7</span><input name="password" type="password" required autocomplete="current-password" placeholder="Enter password"><button type="button" id="togglePassword" aria-label="Show password">\\u25C9</button></div></label>
      <div class="login-options"><label><input name="remember" type="checkbox"\${remembered ? ' checked' : ''}> Remember me</label><button type="button" id="forgotPassword">Forgot password?</button></div>
      <button class="login-submit" type="submit">Sign in <span>\\u2192</span></button>
      <div class="demo-login"><b>LenspireCRM Cloud</b><span>Secure account authentication</span><span>Internet connection required</span></div>
      <small class="license">\\u00A9 2026 LenspireCRM. All rights reserved.</small>
    </form></section>
  </main><div id="toast" class="toast"></div>\`;
  $('#togglePassword').onclick = () => { const input = $('#loginForm [name=password]'); input.type = input.type === 'password' ? 'text' : 'password'; input.focus(); };
  $('#forgotPassword').onclick = () => toast('Please contact your system administrator to reset the password.');
  $('#loginForm').onsubmit = async e => {
    e.preventDefault();
    const btn = $('#loginForm button[type=submit]');
    const err = $('#loginError');
    btn.disabled = true; btn.textContent = 'Signing in\\u2026'; err.textContent = '';
    try {
      const data = await fetch(API + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: $('#loginForm [name=username]').value, password: $('#loginForm [name=password]').value }) }).then(r => r.json());
      if (data.accessToken) {
        const username = $('#loginForm [name=username]').value.trim();
        if ($('#loginForm [name=remember]').checked) localStorage.setItem('lp_remembered_user', username); else localStorage.removeItem('lp_remembered_user');
        user = { ...data.user, organizationName: data.organization?.name || data.user?.organization_name, organizationBranding: data.organization || {} };
        await loadWorkspace();
        shell();
      } else {
        err.textContent = data.error || 'Invalid credentials'; err.classList.add('visible');
        btn.disabled = false; btn.textContent = 'Sign In';
      }
    } catch (ex) { err.textContent = 'Cannot reach server'; err.classList.add('visible'); btn.disabled = false; btn.innerHTML = 'Sign in <span>\\u2192</span>'; }
  };
  setTimeout(() => $('#loginForm [name=' + (remembered ? 'password' : 'username') + ']').focus(), 50);
}

async function logout() {
  await fetch(API + '/api/auth/logout', { method:'POST', headers:{'x-lenspire-web':'1'} }).catch(() => {});
  token = ''; refreshToken = ''; user = null;
  localStorage.removeItem('lp_token');
  localStorage.removeItem('lp_refresh');
  localStorage.removeItem('lp_user');
  loginScreen();
}

async function loadWorkspace() {
  try { state.leads = (await api('/api/leads')).leads || []; } catch { state.leads = []; }
  try { state.activities = (await api('/api/lead-activities')).activities || []; } catch { state.activities = []; }
  try {
    const w = await api('/api/workspace');
    state.customers = w.customers || [];
    state.bookings = w.bookings || [];
    state.production = w.production || [];
    state.events = w.events || [];
    state.payments = w.payments || [];
    state.salesTargets = w.salesTargets || [];
    state.salesExecutives = w.salesExecutives || [];
    state.photographers = w.photographers || [];
    state.photographerDetails = w.photographerDetails || [];
    state.cloudReady = true;
  } catch { state.cloudReady = false; }
}

// Shell
function visibleNavGroups() {
  const groups = [];
  if (user?.isPlatformOwner) groups.push(['Owner', '\\u25C7', [['Studio Management', 'Studio Management', '\\u25C7']]]);
  if (canSeeDepartment('sales')) groups.push(['Sales & Marketing', '\\u2301', [['Dashboard', 'Sales Dashboard', '\\u2302'], ['Lead Management', 'Lead Management', '\\u2659'], ['Customers', 'Customers', '\\u2666'], ['Sales Reports', 'Reports & Analytics', '\\u2301']]]);
  if (canSeeDepartment('operations')) groups.push(['Operations', '\\u25C8', [['Operations Dashboard', 'Operations Dashboard', '\\u2302'], ['Shoot Calendar', 'Shoot Calendar', '\\u25A1'], ['Slotting Sheet', 'Upcoming Event', '\\u25A6'], ['Completed Events', 'Completed Events', '\\u2713'], ['Photographers Details', 'Photographers Details', '\\u2659']]]);
  if (canSeeDepartment('accounts')) groups.push(['Accounts', '\\u20B9', [['Payment Dashboard', 'Payment Dashboard', '\\u20B9'], ['Receivables', 'Receivables \\u00B7 Dues', '\\u20B9'], ['Client Ledger', 'Client Account Ledger', '\\u2637'], ['Reports & Analytics', 'Reports & Analytics', '\\u2301']]]);
  if (canSeeDepartment('postproduction')) {
    const productionItems = [['Production Dashboard', 'Production Dashboard', '\\u25C8'], ['Edit Queue', 'Edit Queue', '\\u25C7'], ['Ongoing Jobs', 'Ongoing Jobs', '\\u25F7'], ['Deliveries', 'Deliveries', '\\u25A3'], ['Work Assigned', 'Work Assigned', '\\u25C7'], ['Production Reports', 'Production Reports', '\\u2301']];
    const role = String(user?.role || '').toLowerCase();
    groups.push(['Post Production', '\\u25B7', role === 'editor' ? productionItems.filter(([name]) => name === 'Work Assigned') : productionItems]);
  }
  return groups;
}

function viewTitle(view) { return ({ Dashboard: 'Sales Dashboard', 'Slotting Sheet': 'Upcoming Event', Receivables: 'Receivables \\u00B7 Dues', 'Client Ledger': 'Client Account Ledger', 'Sales Reports': 'Reports & Analytics', 'Payment Register': 'Collections \\u00B7 Payment Register' })[view] || view; }

function shell() {
  const groups = visibleNavGroups();
  const headerItems = String(user?.role || '').toLowerCase() === 'administrator' ? [['Team Management', '\\u2659'], ['Settings', '\\u2699'], ['Backup & Restore', '\\u25EB']] : [['Settings', '\\u2699']];
  const allowedViews = [...groups.flatMap(([, , items]) => items.map(([name]) => name)), ...headerItems.map(([name]) => name)];
  if (!allowedViews.includes(state.view)) state.view = allowedViews[0] || 'Settings';
  const active = state.view;
  const logo = workspaceLogo();
  const studio = workspaceName();
  const mobileItems = [['Sales', mobileViewForDepartment('sales'), '\\u2302'], ['Events', mobileViewForDepartment('operations'), '\\u25C6'], ['Accounts', mobileViewForDepartment('accounts'), '\\u20B9'], ['Production', mobileViewForDepartment('postproduction'), '\\u25B6']]
    .filter(([label]) => canSeeDepartment(label === 'Events' ? 'operations' : label === 'Production' ? 'postproduction' : label.toLowerCase()));
  const mobileNavHtml = mobileItems.slice(0, 4).map(([label, view, icon]) => 
    \`<button class="mobile-nav-item\${active === view ? ' active' : ''}" data-view="\${view}"><i>\${icon}</i><span>\${label}</span></button>\`
  ).join('');
  const brandMarkHtml = logo ? '<img src="' + esc(logo) + '" alt="' + esc(studio) + ' logo">' : '\\u25C7';
  const navigationHtml = groups.map(([label, icon, items]) => {
    if (label === 'Owner') return \`<button class="nav-item owner-item\${active === 'Studio Management' ? ' active' : ''}" data-view="Studio Management"><i>\\u25C7</i><span>Studio Management</span></button>\`;
    const open = !!state.groupOpen[label];
    const current = items.some(([name]) => name === active);
    return \`<div class="nav-group\${open ? ' open' : ''}" data-nav-group="\${esc(label)}"><button class="nav-group-toggle\${current ? ' group-active' : ''}" data-toggle-group="\${esc(label)}"><i>\${icon}</i><span>\${esc(label)}</span><b>\\u2304</b></button><div class="nav-submenu">\${items.map(([name, display, itemIcon]) => \`<button class="nav-item sub-item\${active === name ? ' active' : ''}" data-view="\${name}"><i>\${itemIcon}</i><span>\${esc(display)}</span></button>\`).join('')}</div></div>\`;
  }).join('');
  const headerNavHtml = headerItems.map(([name, icon]) => \`<button class="icon-btn header-nav" data-view="\${name}" title="\${name}" aria-label="\${name}">\${icon}</button>\`).join('');
  document.body.innerHTML = \`
    <div class="app-shell">
      <aside class="sidebar\${state.sidebarHidden ? ' hidden' : ''}">
        <div class="brand"><div class="brand-mark\${logo ? ' has-logo' : ''}">\${brandMarkHtml}</div><div><strong>\${esc(studio)}</strong><small>Powered by LenspireCRM</small></div></div>
        <nav>
          <div class="sidebar-menu-card sidebar-menu-card-primary">\${navigationHtml}</div>
        </nav>
        <div class="profile"><div class="avatar">\${esc(initials(user?.displayName))}</div><div><strong>\${esc(user?.displayName || 'User')}</strong><small><b></b> \${esc(user?.role || 'User')}</small><small class="profile-date">\${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long' })}</small></div><button id="logoutBtn" title="Sign out">\\u23FB</button></div>
      </aside>
      <div class="main">
        <div class="topbar">
          <div class="page-title">
            <button id="menuBtn" title="\${state.sidebarHidden ? 'Show sidebar' : 'Hide sidebar'}">\${state.sidebarHidden ? '\\u2630' : '\\u2039'}</button>
            <div><h1>\${esc(viewTitle(active))}</h1><p>\${subtitle()}</p></div>
          </div>
          <div class="top-actions"><button class="find-shortcut" id="moduleFindBtn">Find <kbd>Ctrl F</kbd></button><div class="search"><span>\\u2315</span><input id="globalSearch" type="search" placeholder="Find in this module\\u2026" value="\${esc(state.query)}"><button class="search-clear" id="clearGlobalSearch"\${state.query ? '' : ' disabled'}>\\u00D7</button></div>\${headerNavHtml}<button class="icon-btn" id="themeBtn" title="Switch display mode">\${document.body.dataset.theme === 'light' ? '\\u263E' : '\\u263C'}</button><button class="icon-btn notification" id="notificationBtn" title="Notifications" aria-label="Notifications">\\u2662</button><span id="connectionPill" class="connection-pill \${navigator.onLine ? 'online' : 'offline'}">\${navigator.onLine ? 'Cloud online' : 'Offline'}</span><button id="installAppBtn" class="btn secondary" hidden>Install</button></div>
        </div>
        <div class="content" id="content"></div>
      </div>
    </div>
    <div class="mobile-nav">\${mobileNavHtml}<button class="mobile-nav-item" id="mobileMoreBtn"><i>\\u2630</i><span>More</span></button></div>
    <div id="toast" class="toast"></div>\`;

  document.body.classList.toggle('pwa-drawer-open', !state.sidebarHidden);
  document.querySelectorAll('.nav-item, .header-nav, .mobile-nav-item[data-view]').forEach(b => b.onclick = () => { state.view = b.dataset.view; if (matchMedia('(max-width:900px)').matches) state.sidebarHidden = true; shell(); });
  document.querySelectorAll('[data-toggle-group]').forEach(button => button.onclick = () => { const name = button.dataset.toggleGroup; state.groupOpen[name] = !state.groupOpen[name]; shell(); });
  $('#menuBtn').onclick = () => { state.sidebarHidden = !state.sidebarHidden; shell(); };
  $('#mobileMoreBtn').onclick = () => { state.sidebarHidden = false; shell(); };
  $('#logoutBtn').onclick = logout;
  $('#globalSearch').oninput = e => { state.query = e.target.value; renderView(); };
  $('#clearGlobalSearch').onclick = () => { state.query = ''; shell(); };
  $('#moduleFindBtn').onclick = () => { $('#globalSearch').focus(); $('#globalSearch').select(); };
  $('#themeBtn').onclick = () => { document.body.dataset.theme = document.body.dataset.theme === 'light' ? 'dark' : 'light'; localStorage.setItem('lp_theme', document.body.dataset.theme); shell(); };
  $('#notificationBtn').onclick = () => toast("You're all caught up");
  document.onkeydown = e => { if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === 'f') { e.preventDefault(); const input = $('#globalSearch'); if (input) { input.focus(); input.select(); } } };
  const installButton = $('#installAppBtn');
  if (installButton) {
    installButton.hidden = !deferredPrompt;
    installButton.onclick = async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; installButton.hidden = true; };
  }
  renderView();
}

function subtitle() {
  return ({
    Dashboard: 'Your studio at a glance', 'Lead Management': 'Track every inquiry from first call to booking',
    Customers: 'Converted clients and their bookings', 'Sales Reports': 'Leads, pipeline and team performance',
    'Operations Dashboard': 'Shoots, slots and crew at a glance', 'Shoot Calendar': 'Plan shoots, meetings and team schedules',
    'Slotting Sheet': 'Upcoming shoots and crew slots', 'Completed Events': 'Finished shoots and coverage',
    'Photographers Details': 'Crew directory and availability',
    'Payment Dashboard': 'Collections and dues at a glance', 'Payment Register': 'Every payment across the studio',
    Receivables: 'Per-booking dues and follow-ups', 'Client Ledger': 'Every client account and secure portal access', 'Reports & Analytics': 'Monthly collections and targets',
    'Production Dashboard': 'Production pipeline at a glance', 'Edit Queue': 'Editing, albums and client approval',
    'Ongoing Jobs': 'Your active editing work', Deliveries: 'Ready and delivered jobs', 'Work Assigned': 'Load per editor and crew',
    'Production Reports': 'Turnaround, workload and delivery analytics',
    'Studio Management': 'LenspireCRM owner overview for every studio workspace',
    'Team Management': 'Manage users and access', Settings: 'Account and preferences', 'Backup & Restore': 'Protect your cloud workspace'
  }[state.view] || 'LenspireCRM Pro');
}

// Views
function renderView() {
  destroyCharts();
  const c = $('#content');
  if (state.view === 'Dashboard') renderDashboard(c);
  else if (state.view === 'Lead Management') renderLeads(c);
  else if (state.view === 'Customers') renderCustomers(c);
  else if (state.view === 'Sales Reports') renderSalesReports(c);
  else if (state.view === 'Operations Dashboard') renderOpsDashboard(c);
  else if (state.view === 'Shoot Calendar') renderShootCalendar(c);
  else if (state.view === 'Slotting Sheet') renderSlotting(c);
  else if (state.view === 'Completed Events') renderSlotting(c, true);
  else if (state.view === 'Photographers Details') renderPhotographers(c);
  else if (state.view === 'Payment Dashboard') renderAccountsDash(c);
  else if (state.view === 'Payment Register') renderAccountsReg(c);
  else if (state.view === 'Receivables') renderReceivables(c);
  else if (state.view === 'Client Ledger') renderClientLedger(c);
  else if (state.view === 'Reports & Analytics') renderReports(c);
  else if (state.view === 'Production Dashboard') renderProductionDashboard(c);
  else if (state.view === 'Edit Queue') renderEditQueue(c);
  else if (state.view === 'Ongoing Jobs') renderOngoingJobs(c);
  else if (state.view === 'Deliveries') renderDeliveries(c);
  else if (state.view === 'Work Assigned') renderWorkAssigned(c);
  else if (state.view === 'Production Reports') renderProductionReports(c);
  else if (state.view === 'Studio Management') renderStudioManagement(c);
  else if (state.view === 'Team Management') renderTeam(c);
  else if (state.view === 'Settings') renderSettings(c);
  else if (state.view === 'Backup & Restore') renderBackupRestore(c);
  else renderPlaceholder(c);
  bindView();
}

function destroyCharts() { state.charts.forEach(c => c.destroy()); state.charts = []; }

function cloudBanner(el) {
  if (state.cloudReady) return;
  el.insertAdjacentHTML('afterbegin', '<div style="padding:10px 14px;margin-bottom:14px;border:1px solid rgba(240,165,43,.3);background:rgba(240,165,43,.08);border-radius:9px;color:#ffc45d;font-size:11px">Cloud sync for this module is not available yet. Sign in again after the updated app is deployed.</div>');
}

// Dashboard
function renderDashboard(el) {
  const leads = state.leads;
  const newCount = leads.filter(l => l.status === 'New').length;
  const followUp = leads.filter(l => l.status === 'Follow-up').length;
  const confirmed = leads.filter(l => l.status === 'Confirmed').length;
  const lost = leads.filter(l => l.status === 'Lost').length;
  const total = leads.length;
  el.innerHTML = \`
    <div class="welcome"><div><span>SALES DASHBOARD</span><h2>Welcome back, \${esc(user?.displayName || 'User')}</h2><p>\${total} leads, \${state.bookings.length} bookings and \${state.events.length} calendar events across the studio.</p></div></div>
    <div class="kpi-grid">
      <div class="kpi"><span>Total Leads</span><b>\${total}</b></div>
      <div class="kpi"><span>New</span><b class="label-blue">\${newCount}</b></div>
      <div class="kpi"><span>Follow-up</span><b class="label-amber">\${followUp}</b></div>
      <div class="kpi"><span>Confirmed</span><b class="label-green">\${confirmed}</b></div>
      <div class="kpi"><span>Lost</span><b class="label-red">\${lost}</b></div>
    </div>
    <div class="dash-grid">
      <div class="panel"><div class="panel-head"><div><h3>Recent Leads</h3><p>Latest \${Math.min(6, total)} inquiries</p></div></div><div class="table-wrap"><table><thead><tr><th>Name</th><th>Event</th><th>Status</th><th>Date</th></tr></thead><tbody>\${leads.slice(0, 6).map(l => \`<tr style="cursor:pointer" data-view-lead="\${l.id}"><td><b>\${esc(l.name)}</b><small>\${esc(l.lead_code)}</small></td><td>\${esc(l.event_type || '\\u2014')}</td><td>\${statusPill(l.status)}</td><td>\${dateFmt(l.event_date)}</td></tr>\`).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:20px">No leads yet</td></tr>'}</tbody></table></div></div>
      <div class="panel"><div class="panel-head"><div><h3>Status Breakdown</h3></div></div><div style="padding:16px"><canvas id="statusChart" height="200"></canvas></div></div>
      <div class="panel"><div class="panel-head"><div><h3>Lead Sources</h3></div></div><div style="padding:16px"><canvas id="sourceChart" height="200"></canvas></div></div>
    </div>\`;
  if (typeof Chart !== 'undefined') {
    Chart.defaults.color = '#8290a7';
    const statusGroups = ['New', 'Follow-up', 'Contacted', 'Confirmed', 'Lost'];
    const statusCounts = statusGroups.map(s => leads.filter(l => l.status === s).length);
    const sc = $('#statusChart');
    if (sc) state.charts.push(new Chart(sc, { type: 'doughnut', data: { labels: statusGroups, datasets: [{ data: statusCounts, backgroundColor: ['#4f8cff', '#f0a52b', '#a77bf3', '#31c887', '#ef5b67'] }] }, options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 10, font: { size: 10 } } } } } }));
    const sources = [...new Set(leads.map(l => l.source).filter(Boolean))];
    const srcCounts = sources.map(s => leads.filter(l => l.source === s).length);
    const scc = $('#sourceChart');
    if (scc) state.charts.push(new Chart(scc, { type: 'bar', data: { labels: sources, datasets: [{ data: srcCounts, backgroundColor: 'rgba(115,103,240,.6)', borderRadius: 6 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } } }, x: { ticks: { font: { size: 10 } } } } } }));
  }
}

// Lead Management
function renderLeads(el) {
  let leads = state.leads;
  const sourceFilter = state.leadSource || '';
  if (sourceFilter) leads = leads.filter(l => (String(l.source || 'Other').trim() || 'Other') === sourceFilter);
  if (state.query) {
    const q = state.query.toLowerCase();
    leads = leads.filter(l => (l.name || '').toLowerCase().includes(q) || (l.lead_code || '').toLowerCase().includes(q) || (l.mobile || '').includes(q) || (l.city || '').toLowerCase().includes(q));
  }
  el.innerHTML = \`
    <div class="welcome"><div><span>LEAD MANAGEMENT</span><h2>Lead Management</h2><p>\${leads.length} leads tracked\${sourceFilter ? ' \\u00B7 source: ' + esc(sourceFilter) : ''}.</p></div><div style="display:flex;gap:8px">\${sourceFilter ? '<button class="btn ghost small" id="clearSourceFilter">\\u2715 Clear filter</button>' : ''}<button class="btn primary" id="addLeadBtn">+ New Lead</button></div></div>
    <div class="table-wrap"><table><thead><tr><th>Code</th><th>Name</th><th>Event</th><th>Date</th><th>Status</th><th>Source</th><th>City</th><th>Assigned</th></tr></thead><tbody>\${leads.map(l => \`<tr style="cursor:pointer" data-view-lead="\${l.id}"><td><b>\${esc(l.lead_code)}</b></td><td><b>\${esc(l.name)}</b><small>\${esc(l.mobile || '')}</small></td><td>\${esc(l.event_type || '\\u2014')}</td><td>\${dateFmt(l.event_date)}</td><td>\${statusPill(l.status)}</td><td>\${esc(l.source || '\\u2014')}</td><td>\${esc(l.city || '\\u2014')}</td><td>\${esc(l.assigned_to || '\\u2014')}</td></tr>\`).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:20px">No leads found.</td></tr>'}</tbody></table></div>\`;
  $('#addLeadBtn').onclick = () => openLeadModal();
  const clearSource = $('#clearSourceFilter');
  if (clearSource) clearSource.onclick = () => { state.leadSource = ''; renderView(); };
}

// Lead modal
function openLeadModal(lead = null) {
  const editing = !!lead;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'leadModal';
  overlay.innerHTML = \`<div class="modal-card" style="width:min(700px,calc(100vw - 32px))">
    <div class="modal-head"><div><span>\${editing ? 'UPDATE LEAD' : 'NEW LEAD'}</span><h2>\${editing ? 'Edit Lead' : 'Add Lead'}</h2><p>Capture the inquiry and schedule the next action.</p></div><button id="closeModal">\\u2715</button></div>
    <form id="leadForm" class="form-grid" style="padding:20px">
      <label class="full">Client Name<input name="name" required placeholder="e.g. Rahul & Priya" value="\${esc(lead?.name || '')}"></label>
      <label>Event Type<select name="eventType" required>\${['Wedding', 'Pre-Wedding', 'Engagement', 'Reception', 'Candid', 'Cinematic', 'Corporate', 'Birthday', 'Other'].map(v => opt(v, lead?.event_type)).join('')}</select></label>
      <label>Event Date<input name="eventDate" type="date" required value="\${esc(lead?.event_date || '').slice(0,10)}"></label>
      <label>Mobile<input name="mobile" type="tel" required placeholder="+91 98765 43210" value="\${esc(lead?.mobile || '')}"></label>
      <label>City<input name="city" required placeholder="Mumbai" value="\${esc(lead?.city || '')}"></label>
      <label>Source<select name="source">\${['Instagram','Google','Referral','WhatsApp','Website','Facebook'].map(v => opt(v, lead?.source)).join('')}</select></label>
      <label>Status<select name="status">\${['New','Follow-up','Confirmed','Lost'].map(v => opt(v, lead?.status || 'New')).join('')}</select></label>
      <label>Budget<input name="budget" placeholder="\\u20B93,00,000" value="\${esc(lead?.budget || '')}"></label>
      <label>Assigned To<input name="assignedTo" placeholder="Sales person" value="\${esc(lead?.assigned_to || '')}"></label>
      <label>Priority<select name="priority">\${['High','Medium','Low'].map(v => opt(v, lead?.priority || 'Medium')).join('')}</select></label>
      <label class="full">Notes<textarea name="notes" rows="3">\${esc(lead?.notes || '')}</textarea></label>
      <div class="modal-actions" style="grid-column:1/-1"><button type="button" class="btn ghost" id="cancelModal">Cancel</button><button type="submit" class="btn primary">\${editing ? 'Update Lead' : 'Save Lead'}</button></div>
    </form>
  </div>\`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('show'), 10);
  overlay.onclick = e => { if (e.target === overlay) closeModal(); };
  $('#closeModal').onclick = closeModal;
  $('#cancelModal').onclick = closeModal;
  $('#leadForm').onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.performedBy = user?.displayName || 'User';
    try {
      if (editing) await api('/api/leads/' + lead.id, { method: 'PUT', body: JSON.stringify(data) });
      else await api('/api/leads', { method: 'POST', body: JSON.stringify(data) });
      await loadWorkspace();
      closeModal();
      shell();
      toast(editing ? 'Lead updated' : 'Lead created');
    } catch (err) { toast(err.message || 'Save failed'); }
  };
}

function closeModal() {
  const m = document.querySelector('.modal-overlay.show');
  if (m) { m.classList.remove('show'); setTimeout(() => m.remove(), 180); }
}

// ---- Operations ----
function renderOpsDashboard(el) {
  cloudBanner(el);
  const events = state.events || [], production = state.production || [];
  const upcoming = events.filter(e => e.date_status !== 'Completed' && String(e.status) !== 'Completed');
  const completed = events.filter(e => e.date_status === 'Completed' || String(e.status) === 'Completed');
  const today = localDateKey();
  const todaysShoots = upcoming.filter(e => String(e.start_date || '').slice(0, 10) === today);
  const slotted = upcoming.filter(e => e.slotted === true || e.slotted === 1 || e.slotted === '1' || e.slotted === 'true');
  const photographers = state.photographerDetails || [];
  const busy = photographers.filter(p => todaysShoots.some(e => String(e.assignedPhotographer || '') === p.name)).length;
  el.innerHTML = \`
    <div class="welcome"><div><span>OPERATIONS DASHBOARD</span><h2>Operations Dashboard</h2><p>Shoots, slots and crew at a glance.</p></div></div>
    <div class="kpi-grid">
      \${kpi('Upcoming Shoots', upcoming.length, completed.length + ' completed', 'blue', '\\u25A1')}
      \${kpi('Today', todaysShoots.length, today, 'purple', '\\u2600')}
      \${kpi('Slotted', slotted.length, 'crew assigned', 'green', '\\u2713')}
      \${kpi('Photographers', photographers.length, busy + ' shooting today', 'amber', '\\u265F')}
      \${kpi('In Production', production.filter(j => j.stage !== 'Delivered').length, 'jobs in pipeline', 'red', '\\u25C8')}
    </div>
    <div class="dash-grid" style="grid-template-columns:1fr 1fr">
      <div class="panel"><div class="panel-head"><div><h3>Next Shoots</h3><p>Soonest upcoming events</p></div></div><div class="table-wrap"><table><thead><tr><th>Date</th><th>Client</th><th>Event</th><th>Photographer</th><th>Status</th></tr></thead><tbody>\${upcoming.slice(0, 8).map(e => \`<tr><td>\${dateFmt(e.start_date)}</td><td><b>\${esc(e.client_name || e.customerName || '\\u2014')}</b></td><td>\${esc(e.event_type || '\\u2014')}</td><td>\${esc(e.assignedPhotographer || '\\u2014')}</td><td>\${statusPill(e.status)}</td></tr>\`).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px">No upcoming shoots.</td></tr>'}</tbody></table></div></div>
      <div class="panel"><div class="panel-head"><div><h3>Slotting Progress</h3><p>Crew coverage vs events</p></div></div><div style="padding:16px"><canvas id="opsChart" height="220"></canvas></div></div>
    </div>\`;
  if (typeof Chart !== 'undefined' && $('#opsChart')) {
    state.charts.push(new Chart($('#opsChart'), { type: 'doughnut', data: { labels: ['Slotted', 'Awaiting Slot'], datasets: [{ data: [slotted.length, Math.max(0, upcoming.length - slotted.length)], backgroundColor: ['#31c887', '#f0a52b'] }] }, options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } } }));
  }
}

function eventDateSort(a, b) { return String(a.start_date || '').localeCompare(String(b.start_date || '')) || String(a.start_time || '').localeCompare(String(b.start_time || '')); }

function renderShootCalendar(el) {
  cloudBanner(el);
  const events = (state.events || []).filter(e => String(e.status) !== 'Completed').sort(eventDateSort);
  const month = state.calendarDate;
  const year = month.getFullYear(), mon = month.getMonth();
  const first = new Date(year, mon, 1), start = new Date(first); start.setDate(1 - ((first.getDay() + 6) % 7));
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(start); day.setDate(start.getDate() + i);
    const key = \`\${day.getFullYear()}-\${String(day.getMonth() + 1).padStart(2, '0')}-\${String(day.getDate()).padStart(2, '0')}\`;
    const dayEvents = events.filter(e => String(e.start_date || '').slice(0, 10) === key);
    const inMonth = day.getMonth() === mon;
    const isToday = key === localDateKey();
    cells.push(\`<div class="cal-day\${inMonth ? '' : ' muted'}\${isToday ? ' today' : ''}"><span>\${day.getDate()}</span>\${dayEvents.slice(0, 3).map(e => \`<i class="event \${esc((e.event_type || 'shoot').toLowerCase().replace(/[^a-z]/g, ''))}" data-calendar-event="\${e.id}" title="\${esc(e.title || e.client_name || 'Event')}">\${esc(e.client_name || e.customerName || e.title || 'Shoot')}</i>\`).join('')}\${dayEvents.length > 3 ? \`<i class="more">+\${dayEvents.length - 3} more</i>\` : ''}</div>\`);
  }
  el.innerHTML = \`
    <div class="welcome"><div><span>SHOOT CALENDAR</span><h2>Shoot Calendar</h2><p>\${month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p></div><div style="display:flex;gap:8px"><button class="btn ghost small" id="calPrev">\\u2039 Prev</button><button class="btn ghost small" id="calToday">Today</button><button class="btn ghost small" id="calNext">Next \\u203A</button><button class="btn primary small" id="addEventBtn">+ Add Event</button></div></div>
    <div class="panel"><div class="calendar"><div class="calendar-grid headings">\${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => \`<b>\${d}</b>\`).join('')}</div><div class="calendar-grid">\${cells.join('')}</div></div></div>
    <div class="panel" style="margin-top:15px"><div class="panel-head"><div><h3>Agenda</h3><p>Upcoming events this month</p></div></div><div class="table-wrap"><table><thead><tr><th>Date</th><th>Time</th><th>Client</th><th>Event</th><th>Photographer</th><th>Status</th></tr></thead><tbody>\${events.slice(0, 12).map(e => \`<tr style="cursor:pointer" data-view-event="\${e.id}"><td>\${dateFmt(e.start_date)}</td><td>\${esc(e.start_time || '\\u2014')}</td><td><b>\${esc(e.client_name || e.customerName || '\\u2014')}</b></td><td>\${esc(e.event_type || '\\u2014')}</td><td>\${esc(e.assignedPhotographer || '\\u2014')}</td><td>\${statusPill(e.status)}</td></tr>\`).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:20px">No upcoming events.</td></tr>'}</tbody></table></div></div>\`;
  $('#calPrev').onclick = () => { state.calendarDate = new Date(year, mon - 1, 1); renderView(); };
  $('#calNext').onclick = () => { state.calendarDate = new Date(year, mon + 1, 1); renderView(); };
  $('#calToday').onclick = () => { state.calendarDate = new Date(); renderView(); };
  $('#addEventBtn').onclick = () => openEventModal(null, localDateKey());
}

function renderSlotting(el, completed = false) {
  cloudBanner(el);
  const events = (state.events || []).filter(e => completed ? (e.date_status === 'Completed' || String(e.status) === 'Completed') : (e.date_status !== 'Completed' && String(e.status) !== 'Completed')).sort(eventDateSort);
  const filter = completed ? state.completedFilter : state.upcomingFilter;
  const filtered = filter === 'All' ? events : events.filter(e => e.event_type === filter);
  const types = [...new Set(events.map(e => e.event_type).filter(Boolean))];
  el.innerHTML = \`
    <div class="welcome"><div><span>\${completed ? 'COMPLETED EVENTS' : 'SLOTTING SHEET'}</span><h2>\${completed ? 'Completed Events' : 'Upcoming Events'}</h2><p>\${completed ? 'Finished shoots and coverage' : 'Shoots needing crew slots'}</p></div></div>
    <div class="filter-bar"><select data-filter="\${completed ? 'completed' : 'upcoming'}"><option value="All">All event types</option>\${types.map(t => opt(t, filter)).join('')}</select></div>
    <div class="table-wrap"><table><thead><tr><th>Date</th><th>Client</th><th>Event</th><th>Photographer</th><th>Coverage</th><th>Time</th><th>Status</th></tr></thead><tbody>\${filtered.map(e => \`<tr style="cursor:pointer" data-view-event="\${e.id}"><td>\${dateFmt(e.start_date)}</td><td><b>\${esc(e.client_name || e.customerName || '\\u2014')}</b><small>\${esc(e.contact_no || '')}</small></td><td>\${esc(e.event_type || '\\u2014')}</td><td>\${esc(e.assignedPhotographer || '\\u2014')}</td><td><small>\${[e.photo && 'Photo', e.video && 'Video', e.candid && 'Candid', e.cinematic && 'Cinematic', e.drone && 'Drone', e.assistant && 'Assistant', e.bts && 'BTS'].filter(Boolean).join(' \\u00B7 ') || '\\u2014'}</small></td><td>\${esc(e.start_time || '\\u2014')}</td><td>\${statusPill(e.status)}</td></tr>\`).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:20px">No events found.</td></tr>'}</tbody></table></div>\`;
  const sel = el.querySelector('[data-filter]');
  if (sel) sel.onchange = () => { if (completed) state.completedFilter = sel.value; else state.upcomingFilter = sel.value; renderView(); };
}

function renderPhotographers(el) {
  cloudBanner(el);
  const details = state.photographerDetails || [];
  const photographers = state.photographers || [];
  const todayKey = localDateKey();
  const todaysEvents = (state.events || []).filter(e => String(e.start_date || '').slice(0, 10) === todayKey);
  el.innerHTML = \`
    <div class="welcome"><div><span>PHOTOGRAPHERS DETAILS</span><h2>Photographers Details</h2><p>\${details.length} crew members on file.</p></div><div style="display:flex;gap:8px"><button class="btn primary" id="addPhotographerBtn">+ Add Photographer</button></div></div>
    <div class="kpi-grid">
      \${kpi('Total Crew', details.length, 'on file', 'blue', '\\u265F')}
      \${kpi('In-House', details.filter(d => d.status === 'In-House').length, 'studio crew', 'green', '\\u2713')}
      \${kpi('Outside', details.filter(d => d.status === 'Outside').length, 'freelancers', 'amber', '\\u25C6')}
      \${kpi('Shooting Today', todaysEvents.length, 'events today', 'red', '\\u2600')}
    </div>
    <div class="table-wrap"><table><thead><tr><th>Name</th><th>Mobile</th><th>Based In</th><th>Work</th><th>Status</th><th>Actions</th></tr></thead><tbody>\${details.map(d => \`<tr><td><b>\${esc(d.name)}</b></td><td>\${esc(d.mobile || '\\u2014')}</td><td>\${esc(d.living_in || '\\u2014')}</td><td>\${esc(d.work || '\\u2014')}</td><td>\${statusPill(d.status)}</td><td><div style="display:flex;gap:6px"><button class="btn ghost small" data-edit-photographer="\${d.id}">Edit</button><button class="btn danger small" data-delete-photographer="\${d.id}">Delete</button></div></td></tr>\`).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:20px">No photographers yet. Add your crew to start slotting shoots.</td></tr>'}</tbody></table></div>
    <div class="panel" style="margin-top:15px"><div class="panel-head"><div><h3>Team Accounts</h3><p>Photographers and cinematographers with logins</p></div></div><div class="table-wrap"><table><thead><tr><th>Name</th><th>Role</th></tr></thead><tbody>\${photographers.map(p => \`<tr><td><b>\${esc(p.displayName)}</b></td><td>\${esc(p.role || '\\u2014')}</td></tr>\`).join('') || '<tr><td colspan="2" style="text-align:center;color:var(--muted);padding:20px">No photographer logins yet.</td></tr>'}</tbody></table></div></div>\`;
  $('#addPhotographerBtn').onclick = () => openPhotographerModal();
  el.querySelectorAll('[data-edit-photographer]').forEach(b => b.onclick = () => { const d = details.find(x => sameId(x.id, b.dataset.editPhotographer)); if (d) openPhotographerModal(d); });
  el.querySelectorAll('[data-delete-photographer]').forEach(b => b.onclick = async () => {
    if (!confirm('Delete this photographer?')) return;
    try { await api('/api/photographers/' + b.dataset.deletePhotographer, { method: 'DELETE' }); await loadWorkspace(); renderView(); toast('Photographer deleted'); }
    catch (err) { toast(err.message || 'Could not delete'); }
  });
}

function openPhotographerModal(photographer = null) {
  const editing = !!photographer;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'photographerModal';
  overlay.innerHTML = \`<div class="modal-card">
    <div class="modal-head"><div><span>\${editing ? 'EDIT' : 'NEW'} PHOTOGRAPHER</span><h2>\${editing ? 'Edit Photographer' : 'Add Photographer'}</h2><p>Crew member details for slotting.</p></div><button id="closeModal">\\u2715</button></div>
    <form id="photographerForm" class="form-grid" style="padding:20px">
      <label>Name<input name="name" required placeholder="e.g. Avi Khutikar" value="\${esc(photographer?.name || '')}"></label>
      <label>Mobile<input name="mobile" type="tel" required placeholder="+91 98765 43210" value="\${esc(photographer?.mobile || '')}"></label>
      <label>Based In<input name="livingIn" placeholder="Mumbai" value="\${esc(photographer?.living_in || '')}"></label>
      <label>Work<select name="work" required>\${['Photographer', 'Cinematographer', 'Drone Operator', 'Assistant', 'Editor'].map(v => opt(v, photographer?.work)).join('')}</select></label>
      <label>Status<select name="status">\${['In-House', 'Outside'].map(v => opt(v, photographer?.status || 'In-House')).join('')}</select></label>
      <div class="modal-actions" style="grid-column:1/-1"><button type="button" class="btn ghost" id="cancelModal">Cancel</button><button type="submit" class="btn primary">\${editing ? 'Save Changes' : 'Add Photographer'}</button></div>
    </form>
  </div>\`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('show'), 10);
  overlay.onclick = e => { if (e.target === overlay) closeModal(); };
  $('#closeModal').onclick = closeModal;
  $('#cancelModal').onclick = closeModal;
  $('#photographerForm').onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    try {
      if (editing) await api('/api/photographers/' + photographer.id, { method: 'PUT', body: JSON.stringify(data) });
      else await api('/api/photographers', { method: 'POST', body: JSON.stringify(data) });
      await loadWorkspace();
      closeModal();
      renderView();
      toast(editing ? 'Photographer updated' : 'Photographer added');
    } catch (err) { toast(err.message || 'Save failed'); }
  };
}

// ---- Accounts ----
function accountsSummary() {
  const payments = state.payments || [], bookings = state.bookings || [];
  const collected = payments.filter(p => p.status === 'Paid' && p.payment_type !== 'Refund').reduce((s, p) => s + Number(p.amount || 0), 0);
  const refunded = payments.filter(p => p.status === 'Paid' && p.payment_type === 'Refund').reduce((s, p) => s + Number(p.amount || 0), 0);
  const pending = payments.filter(p => p.status === 'Pending').reduce((s, p) => s + Number(p.amount || 0), 0);
  const overdue = payments.filter(p => p.status === 'Overdue').reduce((s, p) => s + Number(p.amount || 0), 0);
  const quoted = bookings.reduce((s, b) => s + Number(b.quoted_amount || 0), 0);
  return { collected, refunded, pending, overdue, quoted, payments, bookings };
}

function renderAccountsDash(el) {
  cloudBanner(el);
  const { collected, refunded, pending, overdue, payments } = accountsSummary();
  const monthKey = currentMonthKey();
  const monthCollected = payments.filter(p => p.status === 'Paid' && p.payment_type !== 'Refund' && String(p.paid_at || p.created_at || '').slice(0, 7) === monthKey).reduce((s, p) => s + Number(p.amount || 0), 0);
  const target = (state.salesTargets || []).filter(t => t.target_month === monthKey).reduce((s, t) => s + Number(t.target_amount || 0), 0);
  el.innerHTML = \`
    <div class="welcome"><div><span>PAYMENTS</span><h2>Payment Dashboard</h2><p>Collections and dues at a glance.</p></div></div>
    <div class="kpi-grid">
      \${kpi('Collected (All)', money(collected), money(monthCollected) + ' this month', 'green', '\\u20B9')}
      \${kpi('Pending', money(pending), payments.filter(p => p.status === 'Pending').length + ' payments', 'amber', '\\u23F3')}
      \${kpi('Overdue', money(overdue), payments.filter(p => p.status === 'Overdue').length + ' payments', 'red', '\\u26A0')}
      \${kpi('Refunded', money(refunded), 'returned to clients', 'blue', '\\u21BA')}
      \${kpi('Monthly Target', target ? money(target) : '\\u2014', monthLabel(monthKey), 'purple', '\\u2699')}
    </div>
    <div class="dash-grid" style="grid-template-columns:1fr 1fr">
      <div class="panel"><div class="panel-head"><div><h3>Recent Payments</h3><p>Latest collections</p></div></div><div class="table-wrap"><table><thead><tr><th>Client</th><th>Booking</th><th>Amount</th><th>Status</th></tr></thead><tbody>\${payments.slice(0, 8).map(p => \`<tr><td><b>\${esc(p.clientName || '\\u2014')}</b></td><td>\${esc(p.booking_code || '\\u2014')}</td><td>\${money(p.amount)}</td><td>\${statusPill(p.status)}</td></tr>\`).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:20px">No payments yet.</td></tr>'}</tbody></table></div></div>
      <div class="panel"><div class="panel-head"><div><h3>Collection Mix</h3><p>Paid vs pending vs overdue</p></div></div><div style="padding:16px"><canvas id="accountsChart" height="220"></canvas></div></div>
    </div>\`;
  if (typeof Chart !== 'undefined' && $('#accountsChart')) {
    state.charts.push(new Chart($('#accountsChart'), { type: 'doughnut', data: { labels: ['Collected', 'Pending', 'Overdue'], datasets: [{ data: [collected, pending, overdue], backgroundColor: ['#31c887', '#f0a52b', '#ef5b67'] }] }, options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } } }));
  }
}

function filteredPayments() {
  const f = state.accountsFilter || {};
  let list = state.payments || [];
  if (f.status && f.status !== 'All') list = list.filter(p => p.status === f.status);
  if (f.mode && f.mode !== 'All') list = list.filter(p => p.payment_mode === f.mode);
  if (f.salesperson && f.salesperson !== 'All') list = list.filter(p => p.salesperson === f.salesperson);
  if (f.month && f.month !== 'All') list = list.filter(p => String(p.paid_at || p.created_at || '').slice(0, 7) === f.month);
  return list;
}

function renderAccountsReg(el) {
  cloudBanner(el);
  const payments = filteredPayments();
  const modes = [...new Set((state.payments || []).map(p => p.payment_mode).filter(Boolean))];
  const people = [...new Set((state.payments || []).map(p => p.salesperson).filter(Boolean))];
  const months = [...new Set((state.payments || []).map(p => String(p.paid_at || p.created_at || '').slice(0, 7)).filter(Boolean))].sort().reverse();
  const f = state.accountsFilter || {};
  const canEdit = user?.role === 'Administrator' || (user?.departmentAccess || {}).accounts === 'full';
  el.innerHTML = \`
    <div class="welcome"><div><span>PAYMENT REGISTER</span><h2>Payment Register</h2><p>Every payment across the studio.</p></div>\${canEdit ? '<button class="btn primary" id="addPaymentBtn">+ Record Payment</button>' : ''}</div>
    <div class="filter-bar">
      <select data-acc-filter="status">\${['All','Paid','Pending','Overdue'].map(v => opt(v, f.status)).join('')}</select>
      <select data-acc-filter="mode"><option value="All">All modes</option>\${modes.map(m => opt(m, f.mode)).join('')}</select>
      <select data-acc-filter="salesperson"><option value="All">All salespeople</option>\${people.map(m => opt(m, f.salesperson)).join('')}</select>
      <select data-acc-filter="month"><option value="All">All months</option>\${months.map(m => opt(m, f.month)).join('')}</select>
    </div>
    <div class="table-wrap"><table><thead><tr><th>Date</th><th>Client</th><th>Booking</th><th>Type</th><th>Amount</th><th>Mode</th><th>Status</th><th>Salesperson</th>\${canEdit ? '<th>Actions</th>' : ''}</tr></thead><tbody>\${payments.map(p => \`<tr><td>\${dateFmt(p.paid_at || p.created_at)}</td><td><b>\${esc(p.clientName || '\\u2014')}</b></td><td>\${esc(p.booking_code || '\\u2014')}</td><td>\${esc(p.payment_type || '\\u2014')}</td><td><b>\${money(p.amount)}</b></td><td>\${esc(p.payment_mode || '\\u2014')}</td><td>\${statusPill(p.status)}</td><td>\${esc(p.salesperson || '\\u2014')}</td>\${canEdit ? \`<td><div style="display:flex;gap:6px"><button class="btn ghost small" data-edit-payment="\${p.id}">Edit</button><button class="btn danger small" data-delete-payment="\${p.id}">Delete</button></div></td>\` : ''}</tr>\`).join('') || '<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:20px">No payments match the filters.</td></tr>'}</tbody></table></div>\`;
  el.querySelectorAll('[data-acc-filter]').forEach(sel => sel.onchange = () => { state.accountsFilter[sel.dataset.accFilter] = sel.value; renderView(); });
  if (canEdit) {
    $('#addPaymentBtn').onclick = () => openPaymentModal();
    el.querySelectorAll('[data-edit-payment]').forEach(b => b.onclick = () => { const p = state.payments.find(x => sameId(x.id, b.dataset.editPayment)); if (p) openPaymentModal(p); });
    el.querySelectorAll('[data-delete-payment]').forEach(b => b.onclick = async () => {
      if (!confirm('Delete this payment?')) return;
      try { await api('/api/payments/' + b.dataset.deletePayment, { method: 'DELETE' }); await loadWorkspace(); renderView(); toast('Payment deleted'); }
      catch (err) { toast(err.message || 'Could not delete'); }
    });
  }
}

function openPaymentModal(payment = null) {
  const editing = !!payment;
  const bookings = state.bookings || [];
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'paymentModal';
  overlay.innerHTML = \`<div class="modal-card">
    <div class="modal-head"><div><span>\${editing ? 'EDIT PAYMENT' : 'RECORD PAYMENT'}</span><h2>\${editing ? 'Edit Payment' : 'Record Payment'}</h2><p>Track collections against a booking.</p></div><button id="closeModal">\\u2715</button></div>
    <form id="paymentForm" class="form-grid" style="padding:20px">
      <label class="full">Booking<select name="bookingId" required>\${bookings.map(b => \`<option value="\${b.id}"\${editing && sameId(b.id, payment.booking_id) ? ' selected' : ''}>\${esc(b.booking_code || '')} \\u00B7 \${esc(b.clientName || '')} \\u00B7 \${esc(b.event_type || '')}</option>\`).join('')}</select></label>
      <label>Amount<input name="amount" type="number" min="1" required value="\${editing ? payment.amount : ''}"></label>
      <label>Type<select name="paymentType">\${['Advance','Balance','Full Payment','Refund'].map(v => opt(v, payment?.payment_type || 'Advance')).join('')}</select></label>
      <label>Mode<select name="paymentMode">\${['','UPI/Gpay','Bank Transfer','Cash','Cheque','Other'].map(v => opt(v, payment?.payment_mode || '')).join('')}</select></label>
      <label>Status<select name="status">\${['Paid','Pending','Overdue'].map(v => opt(v, payment?.status || 'Paid')).join('')}</select></label>
      <label>Due Date<input name="dueDate" type="date" value="\${esc(payment?.due_date || '').slice(0,10)}"></label>
      <label>Received By<input name="receivedBy" placeholder="Who collected this?" value="\${esc(payment?.received_by || user?.displayName || '')}"></label>
      <label class="full">Notes<textarea name="notes" rows="2">\${esc(payment?.notes || '')}</textarea></label>
      <div class="modal-actions" style="grid-column:1/-1"><button type="button" class="btn ghost" id="cancelModal">Cancel</button><button type="submit" class="btn primary">\${editing ? 'Save Changes' : 'Save Payment'}</button></div>
    </form>
  </div>\`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('show'), 10);
  overlay.onclick = e => { if (e.target === overlay) closeModal(); };
  $('#closeModal').onclick = closeModal;
  $('#cancelModal').onclick = closeModal;
  $('#paymentForm').onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.performedBy = user?.displayName || 'User';
    try {
      if (editing) await api('/api/payments/' + payment.id, { method: 'PUT', body: JSON.stringify(data) });
      else await api('/api/payments', { method: 'POST', body: JSON.stringify(data) });
      await loadWorkspace();
      closeModal();
      renderView();
      toast(editing ? 'Payment updated' : 'Payment recorded');
    } catch (err) { toast(err.message || 'Save failed'); }
  };
}

function renderReceivables(el) {
  cloudBanner(el);
  const { pending, overdue, bookings } = accountsSummary();
  const rows = (bookings || []).map(b => {
    const paid = Number(b.totalPaid || 0) - Number(b.totalRefunded || 0);
    const quoted = Number(b.quoted_amount || 0);
    const due = Math.max(0, quoted - paid);
    const nextDue = b.nextDueDate || b.pendingAmount ? (b.nextDueDate || '\\u2014') : '\\u2014';
    return { ...b, paid, quoted, due, nextDue };
  }).filter(b => b.due > 0).sort((a, b) => String(a.nextDue || '9999').localeCompare(String(b.nextDue || '9999')));
  el.innerHTML = \`
    <div class="welcome"><div><span>RECEIVABLES</span><h2>Receivables</h2><p>Per-booking dues and follow-ups.</p></div></div>
    <div class="kpi-grid">
      \${kpi('Total Outstanding', money(rows.reduce((s, r) => s + r.due, 0)), rows.length + ' bookings with dues', 'red', '\\u20B9')}
      \${kpi('Pending Payments', money(pending), 'not yet due', 'amber', '\\u23F3')}
      \${kpi('Overdue', money(overdue), 'past due date', 'red', '\\u26A0')}
    </div>
    <div class="table-wrap"><table><thead><tr><th>Client</th><th>Booking</th><th>Quoted</th><th>Paid</th><th>Due</th><th>Next Due</th><th>Contact</th></tr></thead><tbody>\${rows.map(r => \`<tr><td><b>\${esc(r.clientName || '\\u2014')}</b></td><td>\${esc(r.bookingCode || r.booking_code || '\\u2014')}<small>\${esc(r.eventType || r.event_type || '')}</small></td><td>\${money(r.quoted)}</td><td>\${money(r.paid)}</td><td><b style="color:var(--red)">\${money(r.due)}</b></td><td>\${r.nextDue === '\\u2014' ? '\\u2014' : dateFmt(r.nextDue)}</td><td>\${r.leadMobile || r.clientPhone ? \`<a href="\${waLink(r.leadMobile || r.clientPhone, 'Hello ' + (r.clientName || '') + ', this is a gentle reminder about your pending payment with Lenspire.')}" target="_blank" rel="noopener">WhatsApp</a>\` : '\\u2014'}</td></tr>\`).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:20px">No outstanding dues. All bookings are paid up.</td></tr>'}</tbody></table></div>\`;
}

function renderClientLedger(el) {
  cloudBanner(el);
  const q = String(state.query || '').toLowerCase();
  const rows = (state.bookings || []).map(b => {
    const paid = Number(b.totalPaid || 0) - Number(b.totalRefunded || 0);
    const quoted = Number(b.quoted_amount || b.quotedAmount || 0);
    return { ...b, paid, quoted, balance: Math.max(0, quoted - paid) };
  }).filter(b => !q || [b.clientName, b.event_type, b.booking_code].some(v => String(v || '').toLowerCase().includes(q)))
    .sort((a, b) => String(a.event_date || '9999-12-31').localeCompare(String(b.event_date || '9999-12-31')));
  el.innerHTML = \`
    <div class="welcome"><div><span>CLIENT ACCOUNT LEDGER</span><h2>Client Ledger</h2><p>Every client remains visible, including fully paid accounts.</p></div></div>
    <div class="table-wrap"><table><thead><tr><th>Date</th><th>Couple / Client</th><th>Event</th><th>Closing</th><th>Received</th><th>Balance</th><th>Client Portal</th></tr></thead><tbody>
      \${rows.map(r => \`<tr><td>\${dateFmt(r.event_date)}</td><td><b>\${esc(r.clientName || '\\u2014')}</b></td><td>\${esc(r.event_type || '\\u2014')}</td><td>\${money(r.quoted)}</td><td><b style="color:var(--green)">\${money(r.paid)}</b></td><td><b style="color:\${r.balance ? 'var(--amber)' : 'var(--green)'}">\${money(r.balance)}</b></td><td><button class="btn secondary" data-client-portal="\${r.id}">Manage Access</button></td></tr>\`).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:20px">No client accounts found.</td></tr>'}
    </tbody></table></div>\`;
  el.querySelectorAll('[data-client-portal]').forEach(button => button.onclick = () => {
    const booking = state.bookings.find(item => sameId(item.id, button.dataset.clientPortal));
    if (booking) openWebClientPortalAccess(booking);
  });
}

async function copyPortalLink(value) {
  if (!value) return false;
  try { await navigator.clipboard.writeText(value); return true; } catch {}
  const field = document.createElement('textarea'); field.value = value; field.style.position = 'fixed'; field.style.opacity = '0'; document.body.appendChild(field); field.select();
  const copied = document.execCommand('copy'); field.remove(); return copied;
}

async function openWebClientPortalAccess(booking) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay'; overlay.id = 'clientPortalModal';
  overlay.innerHTML = \`<div class="modal-card" style="width:min(760px,calc(100vw - 24px))"><div class="modal-head"><div><span>CLIENT PORTAL</span><h2>\${esc(booking.clientName || 'Client')}</h2><p>Secure gallery, approval and delivery access.</p></div><button id="closeModal">\\u2715</button></div><div id="portalAccessBody" style="padding:20px"><p style="color:var(--muted)">Loading portal access\\u2026</p></div></div>\`;
  document.body.appendChild(overlay); setTimeout(() => overlay.classList.add('show'), 10);
  overlay.onclick = e => { if (e.target === overlay) closeModal(); }; $('#closeModal').onclick = closeModal;
  const render = data => {
    const cached = clientPortalLinkCache.get(String(booking.id)) || '';
    const audits = data.audits || [];
    $('#portalAccessBody').innerHTML = \`
      <div class="portal-status-grid"><div><span>Status</span><b>\${esc(data.status || 'Not generated')}</b></div><div><span>Expires</span><b>\${data.expiresAt ? dateTimeFmt(data.expiresAt) : '\\u2014'}</b></div><div><span>Last opened</span><b>\${data.lastAccessedAt ? dateTimeFmt(data.lastAccessedAt) : 'Never'}</b></div><div><span>Opens</span><b>\${Number(data.accessCount || 0)}</b></div></div>
      <label style="display:block;margin-top:16px">Link validity<select id="portalExpiry"><option value="30">30 days</option><option value="60" selected>60 days</option><option value="90">90 days</option><option value="365">1 year</option></select></label>
      \${cached ? \`<label style="display:block;margin-top:12px">Secure link<input id="portalLink" readonly value="\${esc(cached)}"></label>\` : '<p style="color:var(--muted);font-size:12px;margin-top:12px">For security, an existing raw link is not stored. Generate a new link when you need to copy it.</p>'}
      <div class="modal-actions" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:15px"><button class="btn primary" id="generatePortal"\${canEditAccounts() ? '' : ' disabled'}>\${data.status === 'Not generated' ? 'Generate Link' : 'Regenerate Link'}</button><button class="btn secondary" id="copyPortal"\${cached ? '' : ' disabled'}>Copy Link</button><button class="btn danger" id="revokePortal"\${canEditAccounts() && data.status !== 'Not generated' ? '' : ' disabled'}>Revoke Access</button></div>
      <div class="portal-audit"><h3>Recent Access</h3>\${audits.map(a => \`<div><b>\${esc(a.action)}</b><span>\${esc(a.detail || '')}</span><small>\${dateTimeFmt(a.accessed_at)}</small></div>\`).join('') || '<p>No portal activity yet.</p>'}</div>\`;
    $('#generatePortal').onclick = async () => { try { const created = await api('/api/client-portal/link', { method: 'POST', body: JSON.stringify({ bookingId: booking.id, expiryDays: Number($('#portalExpiry').value) }) }); clientPortalLinkCache.set(String(booking.id), created.url); render(created); toast('Secure Client Portal link generated'); } catch (err) { toast(err.message || 'Could not generate link'); } };
    $('#copyPortal').onclick = async () => { if (await copyPortalLink(clientPortalLinkCache.get(String(booking.id)))) toast('Client Portal link copied'); else toast('Could not copy the link'); };
    $('#revokePortal').onclick = async () => { if (!confirm('Revoke this Client Portal link?')) return; try { const revoked = await api('/api/client-portal/link', { method: 'DELETE', body: JSON.stringify({ bookingId: booking.id }) }); clientPortalLinkCache.delete(String(booking.id)); render({ ...data, ...revoked, audits: [{ action: 'Access Revoked', detail: 'Studio revoked Client Portal access.', accessed_at: new Date().toISOString() }, ...audits] }); toast('Client Portal access revoked'); } catch (err) { toast(err.message || 'Could not revoke access'); } };
  };
  try { render(await api('/api/client-portal/link?bookingId=' + encodeURIComponent(booking.id))); }
  catch (err) { $('#portalAccessBody').innerHTML = '<p style="color:var(--red)">' + esc(err.message || 'Could not load Client Portal access') + '</p>'; }
}

function renderReports(el) {
  cloudBanner(el);
  const { collected, refunded, pending, payments } = accountsSummary();
  const months = [...new Set([currentMonthKey(), ...lastMonthKeys(12), ...(state.payments || []).map(p => String(p.paid_at || p.created_at || '').slice(0, 7)).filter(Boolean)])].sort().reverse();
  const month = state.reportMonth || currentMonthKey();
  const inMonth = payments.filter(p => String(p.paid_at || p.created_at || '').slice(0, 7) === month);
  const monthCollected = inMonth.filter(p => p.status === 'Paid' && p.payment_type !== 'Refund').reduce((s, p) => s + Number(p.amount || 0), 0);
  const monthRefunded = inMonth.filter(p => p.status === 'Paid' && p.payment_type === 'Refund').reduce((s, p) => s + Number(p.amount || 0), 0);
  const target = (state.salesTargets || []).filter(t => t.target_month === month).reduce((s, t) => s + Number(t.target_amount || 0), 0);
  const targetPercent = target ? Math.round((monthCollected / target) * 100) : null;
  const byMode = [...new Set(inMonth.map(p => p.payment_mode).filter(Boolean))].map(mode => ({ mode, total: inMonth.filter(p => p.payment_mode === mode && p.status === 'Paid' && p.payment_type !== 'Refund').reduce((s, p) => s + Number(p.amount || 0), 0) }));
  const byPerson = [...new Set(inMonth.map(p => p.salesperson).filter(Boolean))].map(name => {
    const list = inMonth.filter(p => p.salesperson === name && p.status === 'Paid' && p.payment_type !== 'Refund');
    const personTarget = (state.salesTargets || []).filter(t => t.target_month === month && t.salesperson === name).reduce((s, t) => s + Number(t.target_amount || 0), 0);
    return { name, collected: list.reduce((s, p) => s + Number(p.amount || 0), 0), count: list.length, target: personTarget, percent: personTarget ? Math.round((list.reduce((s, p) => s + Number(p.amount || 0), 0) / personTarget) * 100) : null };
  });
  const maxMode = Math.max(1, ...byMode.map(m => m.total));
  const maxPerson = Math.max(1, ...byPerson.map(p => p.collected));
  el.innerHTML = \`
    <div class="welcome"><div><span>REPORTS & ANALYTICS</span><h2>Reports & Analytics</h2><p>Monthly collections and targets.</p></div><div style="display:flex;gap:8px"><select data-report-month>\${months.map(m => opt(m, month)).join('')}</select></div></div>
    <div class="kpi-grid">
      \${kpi('Collected', money(monthCollected), monthLabel(month), 'green', '\\u20B9')}
      \${kpi('Refunded', money(monthRefunded), 'this month', 'blue', '\\u21BA')}
      \${kpi('Pending', money(pending), 'across all months', 'amber', '\\u23F3')}
      \${kpi('Target', target ? money(target) : '\\u2014', targetPercent !== null ? targetPercent + '% achieved' : 'no target set', 'purple', '\\u2699')}
    </div>
    <div class="dash-grid" style="grid-template-columns:1fr 1fr">
      <div class="panel"><div class="panel-head"><div><h3>Collections by Mode</h3><p>\${monthLabel(month)}</p></div></div><div class="monthly-bars">\${byMode.map(m => \`<div><span>\${esc(m.mode)}</span><i><em style="width:\${Math.round((m.total / maxMode) * 100)}%"></em></i><b>\${money(m.total)}</b></div>\`).join('') || '<div class="widget-empty"><b>\\u2014</b><span>No collections recorded.</span></div>'}</div></div>
      <div class="panel"><div class="panel-head"><div><h3>By Salesperson</h3><p>Collected vs target</p></div></div><div class="monthly-bars">\${byPerson.map(p => \`<div><span>\${esc(p.name)}</span><i><em style="width:\${Math.round((p.collected / maxPerson) * 100)}%"></em></i><b>\${money(p.collected)}</b></div>\`).join('') || '<div class="widget-empty"><b>\\u2014</b><span>No payments attributed yet.</span></div>'}</div></div>
    </div>\`;
  const sel = el.querySelector('[data-report-month]');
  if (sel) sel.onchange = () => { state.reportMonth = sel.value; renderView(); };
}

// ---- Post Production ----
function productionIsOverdue(job) {
  return job && job.stage !== 'Delivered' && job.due_date && String(job.due_date) < localDateKey();
}
function productionTurnaroundDays(job) {
  if (!job || job.stage !== 'Delivered' || !job.delivered_at || !job.eventDate) return null;
  const start = new Date(String(job.eventDate).slice(0, 10) + 'T00:00:00');
  const end = new Date(String(job.delivered_at).slice(0, 10) + 'T00:00:00');
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return Math.max(0, Math.round((end - start) / 86400000));
}
function productionDeliveredMonth(job) {
  return job && job.delivered_at ? String(job.delivered_at).slice(0, 7) : null;
}
function productionWorkload() {
  const names = [...new Set((state.production || []).map(j => j.editor).filter(Boolean))];
  return names.map(name => ({ name, count: (state.production || []).filter(j => j.editor === name && j.stage !== 'Delivered').length }));
}
function productionStageCounts() {
  const stages = ['Shoot Planning', 'Shoot Completed', 'Editing', 'Album Design', 'Client Approval', 'Ready for Delivery', 'Delivered'];
  return stages.map(stage => ({ stage, count: (state.production || []).filter(j => j.stage === stage).length }));
}
function filteredProduction() {
  const f = state.productionFilter || {};
  let list = state.production || [];
  if (f.stage && f.stage !== 'All') list = list.filter(j => j.stage === f.stage);
  if (f.editor && f.editor !== 'All') list = list.filter(j => j.editor === f.editor);
  if (f.delivery && f.delivery !== 'All') list = list.filter(j => j.delivery_status === f.delivery);
  return list;
}
function canEditPost() { return user?.role === 'Administrator' || normalizedAccess().postProduction === 'full'; }
function canEditAccounts() { return user?.role === 'Administrator' || normalizedAccess().accounts === 'full'; }
function canEditOps() { return user?.role === 'Administrator' || normalizedAccess().operations === 'full'; }

function renderOngoingJobs(el) {
  cloudBanner(el);
  const role = String(user?.role || '').toLowerCase();
  const name = String(user?.displayName || '').trim().toLowerCase();
  const q = String(state.query || '').toLowerCase();
  let jobs = (state.production || []).filter(job => job.stage !== 'Delivered');
  if (role === 'editor') jobs = jobs.filter(job => String(job.editor || '').trim().toLowerCase() === name);
  if (q) jobs = jobs.filter(job => [job.customerName, job.eventType, job.stage, job.editor].some(v => String(v || '').toLowerCase().includes(q)));
  jobs.sort((a, b) => String(a.due_date || '9999-12-31').localeCompare(String(b.due_date || '9999-12-31')));
  el.innerHTML = \`
    <div class="welcome"><div><span>ONGOING JOBS</span><h2>\${role === 'editor' ? 'My Editing Jobs' : 'Ongoing Jobs'}</h2><p>\${jobs.length} active production assignment\${jobs.length === 1 ? '' : 's'}.</p></div></div>
    <div class="customer-grid">\${jobs.map(job => \`<article class="panel customer-card"><div class="customer-cover c2"></div><div class="avatar large">\${initials(job.customerName)}</div><h3>\${esc(job.customerName || 'Client')}</h3><p>\${esc(job.eventType || '\\u2014')}</p><div><span>Due \${dateFmt(job.due_date)}</span><span>\${stageBadge(job)}</span></div><small>Editor: \${esc(job.editor || 'Awaiting Assignment')}</small>\${canEditPost() ? \`<div class="customer-actions"><button class="btn primary" data-edit-job="\${job.id}">Update Job</button></div>\` : ''}</article>\`).join('') || '<section class="panel clean-empty"><div class="placeholder-icon">\\u25B6</div><h2>No ongoing jobs</h2><p>Assigned editing work will appear here automatically.</p></section>'}</div>\`;
  el.querySelectorAll('[data-edit-job]').forEach(button => button.onclick = () => {
    const job = state.production.find(item => sameId(item.id, button.dataset.editJob));
    if (job) openProductionModal(job);
  });
}

function renderProductionDashboard(el) {
  cloudBanner(el);
  const jobs = state.production || [];
  const today = localDateKey();
  const inProduction = jobs.filter(j => j.stage !== 'Delivered').length;
  const overdue = jobs.filter(j => productionIsOverdue(j)).length;
  const ready = jobs.filter(j => j.stage === 'Ready for Delivery').length;
  const delivered = jobs.filter(j => j.stage === 'Delivered').length;
  const deliveredThisMonth = jobs.filter(j => productionDeliveredMonth(j) === currentMonthKey()).length;
  const stageData = productionStageCounts();
  const maxStage = Math.max(1, ...stageData.map(s => s.count));
  const workload = productionWorkload();
  const maxWorkload = Math.max(1, ...workload.map(w => w.count));
  el.innerHTML = \`
    <div class="welcome"><div><span>PRODUCTION DASHBOARD</span><h2>Production Dashboard</h2><p>Production pipeline at a glance.</p></div></div>
    <div class="kpi-grid">
      \${kpi('Total Jobs', jobs.length, inProduction + ' in production', 'blue', '\\u25C8')}
      \${kpi('In Production', inProduction, (jobs.length - inProduction) + ' delivered', 'purple', '\\u25C8')}
      \${kpi('Overdue', overdue, overdue ? overdue + ' jobs past due' : 'Nothing overdue', 'red', '\\u26A0')}
      \${kpi('Ready for Delivery', ready, 'Awaiting handover', 'amber', '\\u25A3')}
      \${kpi('Delivered', delivered, deliveredThisMonth + ' this month', 'green', '\\u2713')}
    </div>
    <div class="dash-grid" style="grid-template-columns:1fr 1fr">
      <div class="panel"><div class="panel-head"><div><h3>Jobs by Stage</h3><p>Where every job sits in the pipeline</p></div></div><div class="monthly-bars">\${stageData.map(item => \`<div><span>\${esc(item.stage)}</span><i><em style="width:\${Math.round((item.count / maxStage) * 100)}%"></em></i><b>\${item.count}</b></div>\`).join('') || '<div class="widget-empty"><b>\\u2014</b><span>No jobs yet.</span></div>'}</div></div>
      <div class="panel"><div class="panel-head"><div><h3>Editor Workload</h3><p>Active jobs per editor</p></div></div><div class="monthly-bars">\${workload.map(item => \`<div><span>\${esc(item.name)}</span><i><em style="width:\${Math.round((item.count / maxWorkload) * 100)}%"></em></i><b>\${item.count}</b></div>\`).join('') || '<div class="widget-empty"><b>\\u2014</b><span>No editors assigned.</span></div>'}</div></div>
    </div>\`;
}

function renderEditQueue(el) {
  cloudBanner(el);
  const jobs = filteredProduction().filter(j => j.stage !== 'Delivered');
  const stages = ['Shoot Planning', 'Shoot Completed', 'Editing', 'Album Design', 'Client Approval', 'Ready for Delivery'];
  const editors = [...new Set((state.production || []).map(j => j.editor).filter(Boolean))];
  const f = state.productionFilter || {};
  const editable = canEditPost();
  el.innerHTML = \`
    <div class="welcome"><div><span>EDIT QUEUE</span><h2>Edit Queue</h2><p>Editing, album design and client approval.</p></div></div>
    <div class="filter-bar">
      <select data-prod-filter="stage"><option value="All">All stages</option>\${stages.map(s => opt(s, f.stage)).join('')}</select>
      <select data-prod-filter="editor"><option value="All">All editors</option>\${editors.map(s => opt(s, f.editor)).join('')}</select>
      <select data-prod-filter="delivery"><option value="All">All delivery states</option>\${['Pending','In Progress'].map(s => opt(s, f.delivery)).join('')}</select>
    </div>
    <div class="table-wrap"><table><thead><tr><th>Client</th><th>Booking</th><th>Event</th><th>Stage</th><th>Due</th><th>Editor</th><th>Statuses</th>\${editable ? '<th>Actions</th>' : ''}</tr></thead><tbody>\${jobs.map(j => \`<tr><td><b>\${esc(j.customerName || '\\u2014')}</b></td><td>\${esc(j.bookingCode || '\\u2014')}</td><td>\${esc(j.eventType || '\\u2014')}<small>\${dateFmt(j.eventDate)}</small></td><td>\${stageBadge(j)}</td><td>\${j.due_date ? dateFmt(j.due_date) : '\\u2014'}</td><td>\${esc(j.editor || '\\u2014')}</td><td><small>RAW: \${esc(j.raw_status || '\\u2014')} \\u00B7 Edit: \${esc(j.editing_status || '\\u2014')} \\u00B7 Album: \${esc(j.album_status || '\\u2014')}</small></td>\${editable ? \`<td><div style="display:flex;gap:6px"><button class="btn ghost small" data-edit-production="\${j.id}">Edit</button>\${j.stage !== 'Delivered' ? \`<button class="btn green small" data-deliver-production="\${j.id}">Mark Delivered</button>\` : ''}</div></td>\` : ''}</tr>\`).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:20px">No jobs in the edit queue.</td></tr>'}</tbody></table></div>\`;
  el.querySelectorAll('[data-prod-filter]').forEach(sel => sel.onchange = () => { state.productionFilter[sel.dataset.prodFilter] = sel.value; renderView(); });
  if (editable) {
    el.querySelectorAll('[data-edit-production]').forEach(b => b.onclick = () => { const j = state.production.find(x => sameId(x.id, b.dataset.editProduction)); if (j) openProductionModal(j); });
    el.querySelectorAll('[data-deliver-production]').forEach(b => b.onclick = async () => {
      if (!confirm('Mark this job as delivered?')) return;
      try { await api('/api/production/' + b.dataset.deliverProduction + '/deliver', { method: 'PUT' }); await loadWorkspace(); renderView(); toast('Job marked delivered'); }
      catch (err) { toast(err.message || 'Could not update'); }
    });
  }
}

function renderDeliveries(el) {
  cloudBanner(el);
  const f = state.productionFilter || {};
  const ready = (state.production || []).filter(j => j.stage === 'Ready for Delivery');
  const delivered = (state.production || []).filter(j => j.stage === 'Delivered' && (!f.delivery || f.delivery === 'All' || j.delivery_status === f.delivery));
  const editable = canEditPost();
  el.innerHTML = \`
    <div class="welcome"><div><span>DELIVERIES</span><h2>Deliveries</h2><p>Ready and delivered jobs.</p></div></div>
    <div class="kpi-grid">
      \${kpi('Ready', ready.length, 'awaiting handover', 'amber', '\\u25A3')}
      \${kpi('Delivered', delivered.length, 'all-time', 'green', '\\u2713')}
    </div>
    <div class="panel" style="margin-bottom:15px"><div class="panel-head"><div><h3>Ready for Delivery</h3><p>Hand these over to clients</p></div></div><div class="table-wrap"><table><thead><tr><th>Client</th><th>Booking</th><th>Event</th><th>Due</th><th>Editor</th>\${editable ? '<th>Actions</th>' : ''}</tr></thead><tbody>\${ready.map(j => \`<tr><td><b>\${esc(j.customerName || '\\u2014')}</b></td><td>\${esc(j.bookingCode || '\\u2014')}</td><td>\${esc(j.eventType || '\\u2014')}<small>\${dateFmt(j.eventDate)}</small></td><td>\${j.due_date ? dateFmt(j.due_date) : '\\u2014'}</td><td>\${esc(j.editor || '\\u2014')}</td>\${editable ? \`<td><button class="btn green small" data-deliver-production="\${j.id}">Mark Delivered</button></td>\` : ''}</tr>\`).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:20px">Nothing ready for delivery right now.</td></tr>'}</tbody></table></div></div>
    <div class="table-wrap"><table><thead><tr><th>Client</th><th>Booking</th><th>Event</th><th>Delivered</th><th>Editor</th><th>Turnaround</th></tr></thead><tbody>\${delivered.map(j => \`<tr><td><b>\${esc(j.customerName || '\\u2014')}</b></td><td>\${esc(j.bookingCode || '\\u2014')}</td><td>\${esc(j.eventType || '\\u2014')}<small>\${dateFmt(j.eventDate)}</small></td><td>\${dateTimeFmt(j.delivered_at)}</td><td>\${esc(j.editor || '\\u2014')}</td><td>\${(function () { const days = productionTurnaroundDays(j); return days !== null ? days + ' days' : '\\u2014'; })()}</td></tr>\`).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:20px">No deliveries yet.</td></tr>'}</tbody></table></div>\`;
  if (editable) {
    el.querySelectorAll('[data-deliver-production]').forEach(b => b.onclick = async () => {
      if (!confirm('Mark this job as delivered?')) return;
      try { await api('/api/production/' + b.dataset.deliverProduction + '/deliver', { method: 'PUT' }); await loadWorkspace(); renderView(); toast('Job marked delivered'); }
      catch (err) { toast(err.message || 'Could not update'); }
    });
  }
}

function renderWorkAssigned(el) {
  cloudBanner(el);
  const workload = productionWorkload();
  const maxWorkload = Math.max(1, ...workload.map(w => w.count));
  const editors = [...new Set((state.production || []).map(j => j.editor).filter(Boolean))];
  const f = state.productionFilter || {};
  el.innerHTML = \`
    <div class="welcome"><div><span>WORK ASSIGNED</span><h2>Work Assigned</h2><p>Load per editor and crew.</p></div></div>
    <div class="kpi-grid">
      \${kpi('Editors', editors.length, 'with active jobs', 'blue', '\\u265F')}
      \${kpi('Active Jobs', (state.production || []).filter(j => j.stage !== 'Delivered').length, 'across all editors', 'purple', '\\u25C8')}
      \${kpi('Heaviest Load', workload.length ? Math.max(...workload.map(w => w.count)) : 0, 'jobs on one editor', 'amber', '\\u26A0')}
    </div>
    <div class="panel"><div class="panel-head"><div><h3>Editor Workload</h3><p>Active jobs per editor</p></div></div><div class="monthly-bars">\${workload.map(item => \`<div><span>\${esc(item.name)}</span><i><em style="width:\${Math.round((item.count / maxWorkload) * 100)}%"></em></i><b>\${item.count}</b></div>\`).join('') || '<div class="widget-empty"><b>\\u2014</b><span>No editors assigned.</span></div>'}</div></div>
    <div class="table-wrap" style="margin-top:15px"><table><thead><tr><th>Client</th><th>Booking</th><th>Stage</th><th>Editor</th><th>Due</th></tr></thead><tbody>\${(state.production || []).filter(j => j.stage !== 'Delivered' && (!f.editor || f.editor === 'All' || j.editor === f.editor)).map(j => \`<tr><td><b>\${esc(j.customerName || '\\u2014')}</b></td><td>\${esc(j.bookingCode || '\\u2014')}</td><td>\${stageBadge(j)}</td><td>\${esc(j.editor || '\\u2014')}</td><td>\${j.due_date ? dateFmt(j.due_date) : '\\u2014'}</td></tr>\`).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px">No active work assigned.</td></tr>'}</tbody></table></div>\`;
}

function renderProductionReports(el) {
  cloudBanner(el);
  const jobs = state.production || [];
  const months = [...new Set([currentMonthKey(), ...lastMonthKeys(12), ...jobs.map(productionDeliveredMonth).filter(Boolean)])].sort().reverse();
  const month = state.productionReportMonth || currentMonthKey();
  const inMonth = jobs.filter(j => productionDeliveredMonth(j) === month);
  const inProduction = jobs.filter(j => j.stage !== 'Delivered').length;
  const overdue = jobs.filter(j => productionIsOverdue(j)).length;
  const delivered = jobs.filter(j => j.stage === 'Delivered');
  const turnaround = delivered.map(productionTurnaroundDays).filter(d => d !== null);
  const avgTurnaround = turnaround.length ? Math.round(turnaround.reduce((s, d) => s + d, 0) / turnaround.length) : null;
  const stageData = productionStageCounts();
  const maxStage = Math.max(1, ...stageData.map(s => s.count));
  const workload = productionWorkload();
  const maxWorkload = Math.max(1, ...workload.map(w => w.count));
  el.innerHTML = \`
    <div class="welcome"><div><span>PRODUCTION REPORTS</span><h2>Production Reports</h2><p>Turnaround, workload and delivery analytics.</p></div><div style="display:flex;gap:8px"><select data-prod-report-month>\${months.map(m => opt(m, month)).join('')}</select></div></div>
    <div class="kpi-grid">
      \${kpi('Delivered', inMonth.length, 'jobs in ' + monthLabel(month), 'green', '\\u2713')}
      \${kpi('In Production', inProduction, 'active jobs now', 'purple', '\\u25C8')}
      \${kpi('Overdue', overdue, overdue ? overdue + ' jobs' : 'Nothing overdue', 'red', '\\u26A0')}
      \${kpi('Avg Turnaround', avgTurnaround !== null ? avgTurnaround + ' days' : '\\u2014', 'shoot to delivery', 'amber', '\\u23F1')}
      \${kpi('Total Delivered', delivered.length, 'all-time deliveries', 'blue', '\\u25A3')}
    </div>
    <div class="dash-grid" style="grid-template-columns:1fr 1fr">
      <div class="panel"><div class="panel-head"><div><h3>Jobs by Stage</h3><p>Current pipeline distribution</p></div></div><div class="monthly-bars">\${stageData.map(item => \`<div><span>\${esc(item.stage)}</span><i><em style="width:\${Math.round((item.count / maxStage) * 100)}%"></em></i><b>\${item.count}</b></div>\`).join('') || '<div class="widget-empty"><b>\\u2014</b><span>No jobs yet.</span></div>'}</div></div>
      <div class="panel"><div class="panel-head"><div><h3>Editor Workload</h3><p>Active jobs per editor</p></div></div><div class="monthly-bars">\${workload.map(item => \`<div><span>\${esc(item.name)}</span><i><em style="width:\${Math.round((item.count / maxWorkload) * 100)}%"></em></i><b>\${item.count}</b></div>\`).join('') || '<div class="widget-empty"><b>\\u2014</b><span>No editors assigned.</span></div>'}</div></div>
    </div>
    <div class="panel" style="margin-top:15px"><div class="panel-head"><div><h3>Monthly Deliveries</h3><p>Last 12 months of delivered jobs</p></div></div><div class="table-wrap"><table><thead><tr><th>Month</th><th>Delivered</th><th>Turnaround (avg)</th></tr></thead><tbody>\${lastMonthKeys(12).map(key => { const monthJobs = jobs.filter(j => productionDeliveredMonth(j) === key); const days = monthJobs.map(productionTurnaroundDays).filter(d => d !== null); return \`<tr><td><b>\${monthLabel(key)}</b><small>\${key}</small></td><td>\${monthJobs.length}</td><td>\${days.length ? Math.round(days.reduce((s, d) => s + d, 0) / days.length) + ' days' : '\\u2014'}</td></tr>\`; }).join('')}</tbody></table></div></div>\`;
  const sel = el.querySelector('[data-prod-report-month]');
  if (sel) sel.onchange = () => { state.productionReportMonth = sel.value; renderView(); };
}

function openProductionModal(job = null) {
  const editing = !!job;
  const stages = ['Shoot Planning', 'Shoot Completed', 'Editing', 'Album Design', 'Client Approval', 'Ready for Delivery', 'Delivered'];
  const statuses = ['Pending', 'In Progress', 'Completed'];
  const saved = ['Not Started', 'In Progress', 'Completed'];
  const editors = [...new Set([...(state.production || []).map(j => j.editor), ...(state.photographers || []).map(u => u.displayName)].filter(Boolean))];
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'productionModal';
  overlay.innerHTML = \`<div class="modal-card">
    <div class="modal-head"><div><span>\${editing ? 'UPDATE JOB' : 'PRODUCTION JOB'}</span><h2>\${editing ? 'Edit Production Job' : 'Production Job'}</h2><p>Update stage, statuses, editor and counts.</p></div><button id="closeModal">\\u2715</button></div>
    <form id="productionForm" class="form-grid" style="padding:20px">
      <label class="full">Client<b style="font-weight:700;color:var(--text)">\${esc(job ? job.customerName : '')}</b></label>
      <label>Stage<select name="stage">\${stages.map(s => opt(s, job?.stage || 'Shoot Planning')).join('')}</select></label>
      <label>Editor<select name="editor"><option value="">Unassigned</option>\${editors.map(e => opt(e, job?.editor || '')).join('')}</select></label>
      <label>Due Date<input name="dueDate" type="date" value="\${esc(job?.due_date || '').slice(0,10)}"></label>
      <label>RAW Status<select name="rawStatus">\${statuses.map(s => opt(s, job?.raw_status || 'Pending')).join('')}</select></label>
      <label>Editing Status<select name="editingStatus">\${saved.map(s => opt(s, job?.editing_status || 'Not Started')).join('')}</select></label>
      <label>Album Status<select name="albumStatus">\${saved.map(s => opt(s, job?.album_status || 'Not Started')).join('')}</select></label>
      <label>Video Status<select name="videoStatus">\${saved.map(s => opt(s, job?.video_status || 'Not Started')).join('')}</select></label>
      <label>Delivery Status<select name="deliveryStatus">\${['Pending','In Progress','Delivered'].map(s => opt(s, job?.delivery_status || 'Pending')).join('')}</select></label>
      <label>Photos<input name="photoCount" type="number" min="0" value="\${esc(job?.photo_count ?? 0)}"></label>
      <label>Videos<input name="videoCount" type="number" min="0" value="\${esc(job?.video_count ?? 0)}"></label>
      <label>Albums<input name="albumCount" type="number" min="0" value="\${esc(job?.album_count ?? 0)}"></label>
      <label class="full">Notes<textarea name="notes" rows="2">\${esc(job?.notes || '')}</textarea></label>
      <div class="modal-actions" style="grid-column:1/-1"><button type="button" class="btn ghost" id="cancelModal">Cancel</button><button type="submit" class="btn primary">\${editing ? 'Save Changes' : 'Save Job'}</button></div>
    </form>
  </div>\`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('show'), 10);
  overlay.onclick = e => { if (e.target === overlay) closeModal(); };
  $('#closeModal').onclick = closeModal;
  $('#cancelModal').onclick = closeModal;
  $('#productionForm').onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    try {
      if (editing) await api('/api/production/' + job.id, { method: 'PUT', body: JSON.stringify(data) });
      await loadWorkspace();
      closeModal();
      renderView();
      toast(editing ? 'Job updated' : 'Job saved');
    } catch (err) { toast(err.message || 'Save failed'); }
  };
}

// ---- Team & Settings ----
function renderTeam(el) {
  if (user?.role !== 'Administrator') {
    el.innerHTML = \`<div style="text-align:center;padding:60px 20px;color:var(--muted)"><div style="font-size:48px;margin-bottom:12px">\\u2298</div><h2 style="font:700 18px Manrope;color:var(--text)">Administrator access required</h2><p style="margin-top:8px">Only an administrator can manage users.</p></div>\`;
    return;
  }
  el.innerHTML = \`<div class="welcome"><div><span>TEAM</span><h2>Team Management</h2><p>Manage users and access permissions.</p></div><button class="btn primary" id="addUserBtn">+ Add User</button></div>
    <div class="table-wrap"><table><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Access</th><th>Active</th><th>Last Login</th></tr></thead><tbody id="userRows"><tr><td colspan="6" style="text-align:center;color:var(--muted);padding:20px">Loading users\\u2026</td></tr></tbody></table></div>\`;
  $('#addUserBtn').onclick = () => openUserModal();
  api('/api/users').then(d => {
    const rows = (d.users || []).map(u => {
      const access = u.departmentAccess || {};
      const parts = [];
      if (access.sales === 'full') parts.push('Sales');
      if (access.operations === 'full') parts.push('Ops');
      if (access.accounts === 'full') parts.push('Accounts');
      if (access.postProduction === 'full') parts.push('Post');
      return \`<tr><td><b>\${esc(u.displayName)}</b></td><td>\${esc(u.username)}</td><td>\${esc(u.role || '\\u2014')}</td><td>\${esc(parts.join(', ') || 'View only')}</td><td>\${statusPill(u.active ? 'Active' : 'Inactive')}</td><td>\${dateTimeFmt(u.lastLogin)}</td></tr>\`;
    }).join('');
    $('#userRows').innerHTML = rows || '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:20px">No users yet.</td></tr>';
  }).catch(err => { $('#userRows').innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:20px">' + esc(err.message || 'Could not load users') + '</td></tr>'; });
}

function openUserModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'userModal';
  overlay.innerHTML = \`<div class="modal-card">
    <div class="modal-head"><div><span>NEW USER</span><h2>Add Team Member</h2><p>Create a login and pick department access.</p></div><button id="closeModal">\\u2715</button></div>
    <form id="userForm" class="form-grid" style="padding:20px">
      <label>Display Name<input name="displayName" required placeholder="Full name" minlength="2"></label>
      <label>Username<input name="username" required pattern="[A-Za-z0-9._-]{3,30}" placeholder="e.g. priya.sharma"></label>
      <label>Password<input name="password" type="password" required minlength="8" placeholder="Min 8 characters"></label>
      <label>Role<select name="role">\${['Sales','Management','Accounts','Post Production','Sales Executive','Photographer','Cinematographer'].map(r => opt(r, 'Sales')).join('')}</select></label>
      <div class="modal-actions" style="grid-column:1/-1"><button type="button" class="btn ghost" id="cancelModal">Cancel</button><button type="submit" class="btn primary">Create User</button></div>
    </form>
  </div>\`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('show'), 10);
  overlay.onclick = e => { if (e.target === overlay) closeModal(); };
  $('#closeModal').onclick = closeModal;
  $('#cancelModal').onclick = closeModal;
  $('#userForm').onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    try {
      await api('/api/users', { method: 'POST', body: JSON.stringify(data) });
      closeModal();
      renderView();
      toast('User created');
    } catch (err) { toast(err.message || 'Could not create user'); }
  };
}

async function renderStudioManagement(el) {
  if (!user?.isPlatformOwner) { el.innerHTML = '<section class="panel clean-empty"><h2>Owner access required</h2><p>This page is available only to the LenspireCRM platform owner.</p></section>'; return; }
  el.innerHTML = '<div class="welcome"><div><span>LENSPIRECRM OWNER PANEL</span><h2>Studio Management</h2><p>Loading isolated studio workspaces\\u2026</p></div></div>';
  try {
    const data = await api('/api/platform/organizations');
    const studios = Array.isArray(data) ? data : (data.organizations || []);
    el.innerHTML = \`<div class="welcome"><div><span>LENSPIRECRM OWNER PANEL</span><h2>Studio Management</h2><p>\${studios.length} registered studio workspace\${studios.length === 1 ? '' : 's'}.</p></div></div>
      <div class="table-wrap"><table><thead><tr><th>Studio</th><th>Plan</th><th>Expiry</th><th>License</th><th>Status</th><th>Users</th><th>Created</th></tr></thead><tbody>\${studios.map(s => \`<tr><td><b>\${esc(s.studioName || 'LenspireCRM')}</b></td><td>\${esc(s.plan || 'starter')}</td><td>\${s.subscriptionExpiresAt ? dateFmt(s.subscriptionExpiresAt) : 'No expiry'}</td><td>\${esc(s.licenseCode || '\\u2014')}</td><td>\${statusPill(s.status || 'active')}</td><td>\${Number(s.userCount || 0)}</td><td>\${dateFmt(s.createdAt)}</td></tr>\`).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:20px">No studios registered.</td></tr>'}</tbody></table></div>
      <section class="panel" style="margin-top:16px"><div class="panel-head"><div><h3>Workspace controls</h3><p>Branding, plans, licenses and pause controls remain available in the Windows Owner Panel while the web controls receive final security testing.</p></div></div></section>\`;
  } catch (err) { el.innerHTML = '<section class="panel clean-empty"><h2>Could not load studios</h2><p>' + esc(err.message || 'Owner access could not be verified.') + '</p></section>'; }
}

function renderSettings(el) {
  el.innerHTML = \`<div class="welcome"><div><span>SETTINGS</span><h2>Settings</h2><p>Account and preferences.</p></div></div>
    <div class="panel" style="max-width:500px"><div class="panel-head"><div><h3>Theme</h3></div></div><div style="padding:16px"><label>Display Mode<select id="themeToggle"><option value="dark">Dark</option><option value="light">Light</option></select></label></div></div>
    <div class="panel" style="max-width:500px;margin-top:15px"><div class="panel-head"><div><h3>Account</h3></div></div><div style="padding:16px"><p style="color:var(--muted);font-size:12px">Signed in as <b style="color:var(--text)">\${esc(user?.displayName || '')}</b> (\${esc(user?.role || '')}). Cloud workspace data syncs from the desktop app.</p></div></div>\`;
  const toggle = $('#themeToggle');
  if (toggle) { toggle.value = document.body.dataset.theme || 'dark'; toggle.onchange = () => { document.body.dataset.theme = toggle.value; localStorage.setItem('lp_theme', toggle.value); }; }
}

function renderPlaceholder(el) {
  el.innerHTML = \`<div style="text-align:center;padding:60px 20px;color:var(--muted)"><div style="font-size:48px;margin-bottom:12px">\\u25C7</div><h2 style="font:700 18px Manrope;color:var(--text)">\${esc(state.view)}</h2><p style="margin-top:8px">This module is coming soon to the web PWA.</p></div>\`;
}

function bindView() {
  document.querySelectorAll('[data-view-lead]').forEach(tr => {
    tr.onclick = () => {
      const lead = state.leads.find(l => sameId(l.id, tr.dataset.viewLead));
      if (lead) openLeadProfile(lead);
    };
  });
  document.querySelectorAll('[data-view-event]').forEach(row => {
    row.onclick = () => {
      const event = state.events.find(e => sameId(e.id, row.dataset.viewEvent));
      if (event) openEventModal(event);
    };
  });
  document.querySelectorAll('[data-calendar-event]').forEach(chip => {
    chip.onclick = e => {
      e.stopPropagation();
      const event = state.events.find(ev => sameId(ev.id, chip.dataset.calendarEvent));
      if (event) openEventModal(event);
    };
  });
}


// Customers (converted clients)
function renderCustomers(el) {
  const customers = state.customers || [];
  el.innerHTML = \`
    <div class="welcome"><div><span>CLIENT DATABASE</span><h2>Customers</h2><p>\${customers.length} converted customers with connected bookings and production.</p></div><button class="btn primary" data-go-lead-management>+ Convert Lead</button></div>
    \${customers.length ? \`<div class="customer-grid">\${customers.map((c, i) => \`<article class="panel customer-card"><div class="customer-cover c\${i % 5}"></div><div class="avatar large">\${initials(c.name)}</div><h3>\${esc(c.name)}</h3><p>\${esc(c.eventType || '\\u2014')} \\u00B7 \${esc(c.city || '\\u2014')}</p><div><span>\${dateFmt(c.eventDate)}</span><span>\${money(c.quotedAmount)}</span></div><small>\${esc(c.customer_code || '')} \\u00B7 \${esc(c.bookingCode || '')}</small><div class="customer-actions">\${c.phone ? \`<a class="wa-reminder-btn" target="_blank" rel="noopener" href="\${waLink(c.phone, 'Hi ' + (c.name || '') + ', this is LenspireCRM.')}">WhatsApp</a>\` : ''}<button class="btn ghost" data-view-lead="\${c.lead_id}">Open Profile \\u2192</button></div></article>\`).join('')}</div>\` : \`<section class="panel clean-empty"><div class="placeholder-icon">\\u2666</div><h2>No customers yet</h2><p>Convert a qualified lead to automatically create its customer, booking, production and calendar records.</p><button class="btn primary" data-go-lead-management>Convert your first lead</button></section>\`}
    \`;
  el.querySelectorAll('[data-go-lead-management]').forEach(b => b.onclick = () => { state.view = 'Lead Management'; shell(); });
}

// Sales Reports
function renderSalesReports(el) {
  const leads = state.leads;
  const sources = [...new Set(leads.map(l => String(l.source || 'Other').trim() || 'Other'))].sort();
  const sourceData = sources.map(source => ({ source, count: leads.filter(l => (String(l.source || 'Other').trim() || 'Other') === source).length }));
  const maxSource = Math.max(1, ...sourceData.map(d => d.count));
  const statuses = ['New', 'Follow-up', 'Confirmed', 'Lost'];
  const months = lastMonthKeys(6);
  const maxLeads = Math.max(1, leads.length);
  const monthData = months.map(key => ({ key, leads: leads.filter(l => String(l.created_at || '').slice(0, 7) === key).length, confirmed: leads.filter(l => l.status === 'Confirmed' && String(l.created_at || '').slice(0, 7) === key).length }));
  const maxMonth = Math.max(1, ...monthData.map(m => m.leads));
  const confirmed = leads.filter(l => l.status === 'Confirmed').length;
  const followups = leads.filter(l => l.status === 'Follow-up').length;
  const lost = leads.filter(l => l.status === 'Lost').length;
  const totalSales = leads.filter(l => l.status === 'Confirmed').reduce((s, l) => s + Number(l.total_closing || 0), 0);
  const team = [...new Set(leads.map(l => l.assigned_to).filter(Boolean))].map(name => ({ name, value: leads.filter(l => l.assigned_to === name).length }));
  const maxTeam = Math.max(1, ...team.map(t => t.value));
  const openSource = source => { state.leadSource = source; state.view = 'Lead Management'; shell(); };
  el.innerHTML = \`
    <div class="kpi-grid">
      \${kpi('Total Leads', leads.length, 'Live pipeline', 'blue', '\\u265F')}
      \${kpi('Confirmed', confirmed, state.bookings.length + ' connected bookings', 'green', '\\u2713')}
      \${kpi('Follow-ups Due', followups, followups ? 'Needs attention' : 'Nothing overdue', 'amber', '\\u25B7')}
      \${kpi('Lost', lost, lost ? 'Lost opportunities' : 'No lost leads', 'red', '\\u00D7')}
      \${kpi('Total Sales', money(totalSales), 'From confirmed leads', 'purple', '\\u20B9')}
    </div>
    <div class="dash-grid" style="grid-template-columns:1fr 1fr">
      <div class="panel"><div class="panel-head"><div><h3>Leads by Source</h3><p>Where your inquiries come from \\u2014 click a source to open filtered leads</p></div></div><div class="source-chips">\${sourceData.map(item => \`<button class="source-chip" data-source-filter="\${esc(item.source)}"><span>\${esc(item.source)}</span><b>\${item.count}</b><i><em style="width:\${Math.round(item.count / maxSource * 100)}%"></em></i></button>\`).join('') || '<div class="widget-empty"><b>\\u2014</b><span>No leads yet.</span></div>'}</div></div>
      <div class="panel"><div class="panel-head"><div><h3>Pipeline Status</h3><p>Current distribution of open opportunities</p></div></div><div class="monthly-bars">\${statuses.map(status => { const count = leads.filter(l => l.status === status).length; return \`<div><span>\${status}</span><i><em style="width:\${Math.round(count / maxLeads * 100)}%"></em></i><b>\${count}</b></div>\`; }).join('')}</div></div>
      <div class="panel"><div class="panel-head"><div><h3>Monthly Lead Trend</h3><p>New leads vs confirmed bookings \\u2014 last 6 months</p></div></div><div class="monthly-bars">\${monthData.map(item => \`<div><span>\${monthLabel(item.key)}</span><i><em style="width:\${Math.round(item.leads / maxMonth * 100)}%"></em></i><b>\${item.leads} / \${item.confirmed}</b></div>\`).join('')}</div></div>
      <div class="panel"><div class="panel-head"><div><h3>Team Leaderboard</h3><p>Leads handled per sales person</p></div></div><div class="monthly-bars">\${team.length ? team.map(item => \`<div><span>\${esc(item.name)}</span><i><em style="width:\${Math.round(item.value / maxTeam * 100)}%"></em></i><b>\${item.value}</b></div>\`).join('') : '<div class="widget-empty"><b>\\u2014</b><span>No sales executives assigned yet.</span></div>'}</div></div>
    </div>\`;
  el.querySelectorAll('[data-source-filter]').forEach(chip => chip.onclick = () => openSource(chip.dataset.sourceFilter));
}

// Backup & Restore (cloud)
function renderBackupRestore(el) {
  el.innerHTML = \`
    <div class="welcome"><div><span>DATA PROTECTION</span><h2>Backup &amp; Restore</h2><p>Protect the complete cloud CRM workspace \\u2014 leads, clients, bookings, payments, production and team accounts.</p></div></div>
    <div class="backup-grid">
      <section class="panel backup-card"><div class="backup-icon backup">\\u21E9</div><div><span>CREATE A SAFE COPY</span><h3>Back Up Cloud Data</h3><p>Download all workspace records as a LenspireCRM backup file (JSON).</p></div><button class="btn primary" id="createBackup">Create Backup</button></section>
      <section class="panel backup-card restore"><div class="backup-icon restore">\\u21BA</div><div><span>RECOVER YOUR WORKSPACE</span><h3>Restore Cloud Data</h3><p>Select a backup file. Current data will be replaced with the backup contents.</p></div><button class="btn ghost" id="restoreBackup">Restore Backup</button></section>
    </div>
    <section class="panel backup-note"><b>Backup guidance</b><span>Keep backup files in a secure external drive or cloud folder.</span><span>Create a fresh backup before major changes or data resets.</span><span>Restoring replaces the current workspace \\u2014 an Administrator account is required.</span></section>\`;
  $('#createBackup').onclick = async () => {
    toast('Web backup is disabled until encrypted browser export is available. Use the desktop app.');
    return;
    const btn = $('#createBackup'); btn.disabled = true; btn.textContent = 'Creating Backup\\u2026';
    try {
      const res = await fetch(API + '/api/backup', { headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Could not create backup');
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'lenspirecrm-backup-' + localDateKey() + '.json';
      a.click();
      URL.revokeObjectURL(a.href);
      toast('Backup downloaded');
    } catch (e) { toast(e.message || 'Could not create backup'); }
    btn.disabled = false; btn.textContent = 'Create Backup';
  };
  $('#restoreBackup').onclick = () => {
    toast('Web restore is disabled to prevent unencrypted backup handling. Use the desktop app.');
    return;
    if (!confirm('Restore this backup? All current cloud data will be replaced.')) return;
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json,application/json';
    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const btn = $('#restoreBackup'); btn.disabled = true; btn.textContent = 'Restoring\\u2026';
      try {
        const text = await file.text();
        const payload = JSON.parse(text);
        const res = await fetch(API + '/api/backup/restore', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Restore failed');
        toast('Backup restored. Reloading\\u2026');
        setTimeout(() => location.reload(), 1200);
      } catch (e) { toast(e.message || 'Could not restore backup'); }
      btn.disabled = false; btn.textContent = 'Restore Backup';
    };
    input.click();
  };
}

// ---- Operations: event modal (create / edit calendar events) ----
const EVENT_TYPES = ['Shoot', 'Wedding', 'Pre-Wedding', 'Engagement', 'Corporate', 'Meeting', 'Other'];
const EVENT_STATUSES_LIST = ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
function openEventModal(event = null, date = '') {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'eventModal';
  overlay.innerHTML = \`<div class="modal-card">
    <div class="modal-head"><div><span>STUDIO OPERATIONS</span><h2>\${event ? 'Update Event' : 'Create Event'}</h2><p>Schedule work and assign the responsible photographer.</p></div><button id="closeModal">\\u2715</button></div>
    <form id="eventForm" class="form-grid" style="padding:20px">
      <label class="full">Event Title<input name="title" required placeholder="e.g. Rahul & Priya / Wedding" value="\${esc(event?.title || '')}"></label>
      <label>Event Type<select name="eventType">\${EVENT_TYPES.map(v => opt(v, event?.event_type || 'Shoot')).join('')}</select></label>
      <label>Status<select name="status">\${EVENT_STATUSES_LIST.map(v => opt(v, event?.status || 'Scheduled')).join('')}</select></label>
      <label>Date<input name="startDate" type="date" required value="\${esc(event?.start_date || date || '').slice(0, 10)}"></label>
      <label>City / Location<input name="city" placeholder="Mumbai" value="\${esc(event?.city || '')}"></label>
      <label>Start Time<input name="startTime" type="time" value="\${esc(event?.start_time || '')}"></label>
      <label>End Time<input name="endTime" type="time" value="\${esc(event?.end_time || '')}"></label>
      <label class="full">Assigned Photographer<select name="assignedUserId"><option value="">Unassigned</option>\${(state.photographers || []).map(p => \`<option value="\${p.id}"\${sameId(p.id, event?.assigned_user_id) ? ' selected' : ''}>\${esc(p.displayName)} \\u00B7 \${esc(p.role || '')}</option>\`).join('')}</select></label>
      <label>Client Name<input name="clientName" placeholder="Client / couple name" value="\${esc(event?.client_name || '')}"></label>
      <label>Contact No.<input name="contactNo" placeholder="+91 98765 43210" value="\${esc(event?.contact_no || '')}"></label>
      <label>Handled By<input name="handledBy" placeholder="Sales person" value="\${esc(event?.handled_by || '')}"></label>
      <label>Crew / Coverage<select name="photo">\${['', 'Yes', 'No'].map(v => opt(v, event?.photo || '')).join('')}</select></label>
      <label class="full">Brief / Notes<textarea name="notes" rows="3">\${esc(event?.notes || '')}</textarea></label>
      <div class="modal-actions" style="grid-column:1/-1"><button type="button" class="btn ghost" id="cancelModal">Cancel</button>\${event ? '<button type="button" class="btn danger" id="deleteEventBtn">Delete</button>' : ''}<button type="submit" class="btn primary">\${event ? 'Save Changes' : 'Create Event'}</button></div>
    </form>
  </div>\`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('show'), 10);
  overlay.onclick = e => { if (e.target === overlay) closeModal(); };
  $('#closeModal').onclick = closeModal;
  $('#cancelModal').onclick = closeModal;
  const del = $('#deleteEventBtn');
  if (del) del.onclick = async () => {
    if (!confirm('Delete this event?')) return;
    try { await api('/api/events/' + event.id, { method: 'DELETE' }); await loadWorkspace(); closeModal(); renderView(); toast('Event deleted'); }
    catch (err) { toast(err.message || 'Could not delete'); }
  };
  $('#eventForm').onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    try {
      if (event) await api('/api/events/' + event.id, { method: 'PUT', body: JSON.stringify(data) });
      else await api('/api/events', { method: 'POST', body: JSON.stringify(data) });
      await loadWorkspace();
      closeModal();
      renderView();
      toast(event ? 'Event updated' : 'Event created');
    } catch (err) { toast(err.message || 'Save failed'); }
  };
}

// ---- Sales: lead profile modal (full record + activity feed) ----
function openLeadProfile(lead) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'leadProfileModal';
  const rows = [
    ['Lead Code', lead.lead_code], ['Name', lead.name], ['Event', lead.event_type], ['Event Date', dateFmt(lead.event_date)],
    ['Status', lead.status], ['Source', lead.source], ['City', lead.city], ['Mobile', lead.mobile],
    ['Assigned To', lead.assigned_to], ['Priority', lead.priority], ['Budget', lead.budget],
    ['Next Follow-up', lead.next_followup_at ? dateTimeFmt(lead.next_followup_at) : '\\u2014'], ['Notes', lead.notes]
  ].map(([k, v]) => \`<div><span>\${esc(k)}</span><b>\${esc(v || '\\u2014')}</b></div>\`).join('');
  overlay.innerHTML = \`<div class="modal-card" style="width:min(680px,calc(100vw - 32px))">
    <div class="modal-head"><div><span>LEAD PROFILE</span><h2>\${esc(lead.name || 'Lead')}</h2><p>\${esc(lead.event_type || '')} \\u00B7 \${dateFmt(lead.event_date)}</p></div><button id="closeModal">\\u2715</button></div>
    <div style="padding:20px">
      <div class="profile-grid">\${rows}</div>
      <div class="panel" style="margin-top:15px"><div class="panel-head"><div><h3>Activities</h3><p>Follow-ups, calls, WhatsApp and meetings</p></div></div><div id="profileActivities"><div style="padding:16px;color:var(--muted);font-size:12px">Loading activities\\u2026</div></div></div>
      <div class="modal-actions" style="display:flex;gap:8px;justify-content:flex-end;margin-top:15px"><button type="button" class="btn ghost" id="cancelModal">Close</button><button type="button" class="btn primary" id="editLeadBtn">Edit Lead</button></div>
    </div>
  </div>\`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('show'), 10);
  overlay.onclick = e => { if (e.target === overlay) closeModal(); };
  $('#closeModal').onclick = closeModal;
  $('#cancelModal').onclick = closeModal;
  $('#editLeadBtn').onclick = () => { closeModal(); setTimeout(() => openLeadModal(lead), 180); };
  api('/api/leads/' + lead.id + '/activities').then(d => {
    const acts = d.activities || [];
    const list = $('#profileActivities');
    if (!list) return;
    list.innerHTML = acts.length ? acts.map(a => \`<div class="activity-item"><div style="flex:1"><b>\${esc(a.activity_type)}</b><p>\${esc(a.description || '')}</p><small>\${esc(a.performed_by || 'System')} \\u00B7 \${dateTimeFmt(a.created_at)}</small></div></div>\`).join('') : '<div style="padding:16px;color:var(--muted);font-size:12px">No activities recorded yet.</div>';
  }).catch(() => { const list = $('#profileActivities'); if (list) list.innerHTML = '<div style="padding:16px;color:var(--muted);font-size:12px">Could not load activities.</div>'; });
}


// Init
(async function init() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  document.body.dataset.theme = localStorage.getItem('lp_theme') || 'dark';
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; const button = $('#installAppBtn'); if (button) button.hidden = false; });
  window.addEventListener('online', () => { const pill = $('#connectionPill'); if (pill) { pill.className = 'connection-pill online'; pill.textContent = 'Cloud online'; } });
  window.addEventListener('offline', () => { const pill = $('#connectionPill'); if (pill) { pill.className = 'connection-pill offline'; pill.textContent = 'Offline'; } });
  if (!token || !user) { loginScreen(); return; }
  try { await loadWorkspace(); } catch { state.leads = []; }
  shell();
})();
`;
var PWA_SERVICE_WORKER = `\uFEFFconst CACHE = 'lenspirecrm-pwa-v5';
const PRECACHE = ['/', '/app', '/app.css?v=5', '/app.js?v=5', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/api/')) return;
  const path = new URL(e.request.url).pathname;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(response => { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put('/app', copy)); return response; }).catch(() => caches.match('/app')));
    return;
  }
  if (path === '/app.js' || path === '/app.css') {
    e.respondWith(fetch(e.request).then(resp => {
      if (resp.status === 200) caches.open(CACHE).then(cache => cache.put(e.request, resp.clone()));
      return resp;
    }).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => {
      if (r) return r;
      return fetch(e.request).then(resp => {
        if (resp.status === 200 && e.request.url.startsWith(self.location.origin)) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match('/app'));
    })
  );
});
`;
var PWA_MANIFEST_JSON = `{
  "name": "LenspireCRM Pro",
  "short_name": "LenspireCRM",
  "id": "/app",
  "description": "Sales Lead Tracker & CRM \u2014 manage leads, payments and production from any device.",
  "start_url": "/app",
  "scope": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#080d15",
  "theme_color": "#7367f0",
  "categories": [
    "business",
    "productivity"
  ],
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}`;

// node_modules/postgres/cf/polyfills.js
import { EventEmitter } from "node:events";
import { Buffer as Buffer2 } from "node:buffer";
var Crypto = globalThis.crypto;
var ids = 1;
var tasks = /* @__PURE__ */ new Set();
var v4Seg = "(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])";
var v4Str = `(${v4Seg}[.]){3}${v4Seg}`;
var IPv4Reg = new RegExp(`^${v4Str}$`);
var v6Seg = "(?:[0-9a-fA-F]{1,4})";
var IPv6Reg = new RegExp(
  `^((?:${v6Seg}:){7}(?:${v6Seg}|:)|(?:${v6Seg}:){6}(?:${v4Str}|:${v6Seg}|:)|(?:${v6Seg}:){5}(?::${v4Str}|(:${v6Seg}){1,2}|:)|(?:${v6Seg}:){4}(?:(:${v6Seg}){0,1}:${v4Str}|(:${v6Seg}){1,3}|:)|(?:${v6Seg}:){3}(?:(:${v6Seg}){0,2}:${v4Str}|(:${v6Seg}){1,4}|:)|(?:${v6Seg}:){2}(?:(:${v6Seg}){0,3}:${v4Str}|(:${v6Seg}){1,5}|:)|(?:${v6Seg}:){1}(?:(:${v6Seg}){0,4}:${v4Str}|(:${v6Seg}){1,6}|:)|(?::((?::${v6Seg}){0,5}:${v4Str}|(?::${v6Seg}){1,7}|:)))(%[0-9a-zA-Z-.:]{1,})?$`
);
var textEncoder = new TextEncoder();
var crypto2 = {
  randomBytes: /* @__PURE__ */ __name((l) => Crypto.getRandomValues(Buffer2.alloc(l)), "randomBytes"),
  pbkdf2Sync: /* @__PURE__ */ __name(async (password, salt, iterations, keylen) => Crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations
    },
    await Crypto.subtle.importKey(
      "raw",
      textEncoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    ),
    keylen * 8,
    ["deriveBits"]
  ), "pbkdf2Sync"),
  createHash: /* @__PURE__ */ __name((type) => ({
    update: /* @__PURE__ */ __name((x) => ({
      digest: /* @__PURE__ */ __name((encoding) => {
        if (!(x instanceof Uint8Array)) {
          x = textEncoder.encode(x);
        }
        let prom;
        if (type === "sha256") {
          prom = Crypto.subtle.digest("SHA-256", x);
        } else if (type === "md5") {
          prom = Crypto.subtle.digest("md5", x);
        } else {
          throw Error("createHash only supports sha256 or md5 in this environment, not ${type}.");
        }
        if (encoding === "hex") {
          return prom.then((arrayBuf) => Buffer2.from(arrayBuf).toString("hex"));
        } else if (encoding) {
          throw Error(`createHash only supports hex encoding or unencoded in this environment, not ${encoding}`);
        } else {
          return prom;
        }
      }, "digest")
    }), "update")
  }), "createHash"),
  createHmac: /* @__PURE__ */ __name((type, key) => ({
    update: /* @__PURE__ */ __name((x) => ({
      digest: /* @__PURE__ */ __name(async () => Buffer2.from(
        await Crypto.subtle.sign(
          "HMAC",
          await Crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]),
          textEncoder.encode(x)
        )
      ), "digest")
    }), "update")
  }), "createHmac")
};
var performance = globalThis.performance;
var process = {
  env: {}
};
var os = {
  userInfo() {
    return { username: "postgres" };
  }
};
var fs = {
  readFile() {
    throw new Error("Reading files not supported on CloudFlare");
  }
};
var net = {
  isIP: /* @__PURE__ */ __name((x) => IPv4Reg.test(x) ? 4 : IPv6Reg.test(x) ? 6 : 0, "isIP"),
  Socket
};
var tls = {
  connect({ socket: tcp, servername }) {
    tcp.writer.releaseLock();
    tcp.reader.releaseLock();
    tcp.readyState = "upgrading";
    tcp.raw = tcp.raw.startTls({ servername });
    tcp.raw.closed.then(
      () => tcp.emit("close"),
      (e) => tcp.emit("error", e)
    );
    tcp.writer = tcp.raw.writable.getWriter();
    tcp.reader = tcp.raw.readable.getReader();
    tcp.writer.ready.then(() => {
      tcp.read();
      tcp.readyState = "upgrade";
    });
    return tcp;
  }
};
function Socket() {
  const tcp = Object.assign(new EventEmitter(), {
    readyState: "open",
    raw: null,
    writer: null,
    reader: null,
    connect,
    write,
    end,
    destroy,
    read
  });
  return tcp;
  async function connect(port, host) {
    try {
      tcp.readyState = "opening";
      const { connect: connect2 } = await import("cloudflare:sockets");
      tcp.raw = connect2(host + ":" + port, tcp.ssl ? { secureTransport: "starttls" } : {});
      tcp.raw.closed.then(
        () => {
          tcp.readyState !== "upgrade" ? close() : (tcp.readyState = "open", tcp.emit("secureConnect"));
        },
        (e) => tcp.emit("error", e)
      );
      tcp.writer = tcp.raw.writable.getWriter();
      tcp.reader = tcp.raw.readable.getReader();
      tcp.ssl ? readFirst() : read();
      tcp.writer.ready.then(() => {
        tcp.readyState = "open";
        tcp.emit("connect");
      });
    } catch (err) {
      error(err);
    }
  }
  __name(connect, "connect");
  function close() {
    if (tcp.readyState === "closed")
      return;
    tcp.readyState = "closed";
    tcp.emit("close");
  }
  __name(close, "close");
  function write(data, cb) {
    tcp.writer.write(data).then(cb, error);
    return true;
  }
  __name(write, "write");
  function end(data) {
    return data ? tcp.write(data, () => tcp.raw.close()) : tcp.raw.close();
  }
  __name(end, "end");
  function destroy() {
    tcp.destroyed = true;
    tcp.end();
  }
  __name(destroy, "destroy");
  async function read() {
    try {
      let done, value;
      while ({ done, value } = await tcp.reader.read(), !done)
        tcp.emit("data", Buffer2.from(value));
    } catch (err) {
      error(err);
    }
  }
  __name(read, "read");
  async function readFirst() {
    const { value } = await tcp.reader.read();
    tcp.emit("data", Buffer2.from(value));
  }
  __name(readFirst, "readFirst");
  function error(err) {
    tcp.emit("error", err);
    tcp.emit("close");
  }
  __name(error, "error");
}
__name(Socket, "Socket");
function setImmediate(fn) {
  const id = ids++;
  tasks.add(id);
  queueMicrotask(() => {
    if (tasks.has(id)) {
      fn();
      tasks.delete(id);
    }
  });
  return id;
}
__name(setImmediate, "setImmediate");
function clearImmediate(id) {
  tasks.delete(id);
}
__name(clearImmediate, "clearImmediate");

// node_modules/postgres/cf/src/types.js
import { Buffer as Buffer3 } from "node:buffer";

// node_modules/postgres/cf/src/query.js
var originCache = /* @__PURE__ */ new Map();
var originStackCache = /* @__PURE__ */ new Map();
var originError = /* @__PURE__ */ Symbol("OriginError");
var CLOSE = {};
var Query = class extends Promise {
  static {
    __name(this, "Query");
  }
  constructor(strings, args, handler, canceller, options = {}) {
    let resolve, reject;
    super((a, b2) => {
      resolve = a;
      reject = b2;
    });
    this.tagged = Array.isArray(strings.raw);
    this.strings = strings;
    this.args = args;
    this.handler = handler;
    this.canceller = canceller;
    this.options = options;
    this.state = null;
    this.statement = null;
    this.resolve = (x) => (this.active = false, resolve(x));
    this.reject = (x) => (this.active = false, reject(x));
    this.active = false;
    this.cancelled = null;
    this.executed = false;
    this.signature = "";
    this[originError] = this.handler.debug ? new Error() : this.tagged && cachedError(this.strings);
  }
  get origin() {
    return (this.handler.debug ? this[originError].stack : this.tagged && originStackCache.has(this.strings) ? originStackCache.get(this.strings) : originStackCache.set(this.strings, this[originError].stack).get(this.strings)) || "";
  }
  static get [Symbol.species]() {
    return Promise;
  }
  cancel() {
    return this.canceller && (this.canceller(this), this.canceller = null);
  }
  simple() {
    this.options.simple = true;
    this.options.prepare = false;
    return this;
  }
  async readable() {
    this.simple();
    this.streaming = true;
    return this;
  }
  async writable() {
    this.simple();
    this.streaming = true;
    return this;
  }
  cursor(rows = 1, fn) {
    this.options.simple = false;
    if (typeof rows === "function") {
      fn = rows;
      rows = 1;
    }
    this.cursorRows = rows;
    if (typeof fn === "function")
      return this.cursorFn = fn, this;
    let prev;
    return {
      [Symbol.asyncIterator]: () => ({
        next: /* @__PURE__ */ __name(() => {
          if (this.executed && !this.active)
            return { done: true };
          prev && prev();
          const promise = new Promise((resolve, reject) => {
            this.cursorFn = (value) => {
              resolve({ value, done: false });
              return new Promise((r) => prev = r);
            };
            this.resolve = () => (this.active = false, resolve({ done: true }));
            this.reject = (x) => (this.active = false, reject(x));
          });
          this.execute();
          return promise;
        }, "next"),
        return() {
          prev && prev(CLOSE);
          return { done: true };
        }
      })
    };
  }
  describe() {
    this.options.simple = false;
    this.onlyDescribe = this.options.prepare = true;
    return this;
  }
  stream() {
    throw new Error(".stream has been renamed to .forEach");
  }
  forEach(fn) {
    this.forEachFn = fn;
    this.handle();
    return this;
  }
  raw() {
    this.isRaw = true;
    return this;
  }
  values() {
    this.isRaw = "values";
    return this;
  }
  async handle() {
    !this.executed && (this.executed = true) && await 1 && this.handler(this);
  }
  execute() {
    this.handle();
    return this;
  }
  then() {
    this.handle();
    return super.then.apply(this, arguments);
  }
  catch() {
    this.handle();
    return super.catch.apply(this, arguments);
  }
  finally() {
    this.handle();
    return super.finally.apply(this, arguments);
  }
};
function cachedError(xs) {
  if (originCache.has(xs))
    return originCache.get(xs);
  const x = Error.stackTraceLimit;
  Error.stackTraceLimit = 4;
  originCache.set(xs, new Error());
  Error.stackTraceLimit = x;
  return originCache.get(xs);
}
__name(cachedError, "cachedError");

// node_modules/postgres/cf/src/errors.js
var PostgresError = class extends Error {
  static {
    __name(this, "PostgresError");
  }
  constructor(x) {
    super(x.message);
    this.name = this.constructor.name;
    Object.assign(this, x);
  }
};
var Errors = {
  connection,
  postgres,
  generic,
  notSupported
};
function connection(x, options, socket) {
  const { host, port } = socket || options;
  const error = Object.assign(
    new Error("write " + x + " " + (options.path || host + ":" + port)),
    {
      code: x,
      errno: x,
      address: options.path || host
    },
    options.path ? {} : { port }
  );
  Error.captureStackTrace(error, connection);
  return error;
}
__name(connection, "connection");
function postgres(x) {
  const error = new PostgresError(x);
  Error.captureStackTrace(error, postgres);
  return error;
}
__name(postgres, "postgres");
function generic(code, message) {
  const error = Object.assign(new Error(code + ": " + message), { code });
  Error.captureStackTrace(error, generic);
  return error;
}
__name(generic, "generic");
function notSupported(x) {
  const error = Object.assign(
    new Error(x + " (B) is not supported"),
    {
      code: "MESSAGE_NOT_SUPPORTED",
      name: x
    }
  );
  Error.captureStackTrace(error, notSupported);
  return error;
}
__name(notSupported, "notSupported");

// node_modules/postgres/cf/src/types.js
var types = {
  string: {
    to: 25,
    from: null,
    // defaults to string
    serialize: /* @__PURE__ */ __name((x) => "" + x, "serialize")
  },
  number: {
    to: 0,
    from: [21, 23, 26, 700, 701],
    serialize: /* @__PURE__ */ __name((x) => "" + x, "serialize"),
    parse: /* @__PURE__ */ __name((x) => +x, "parse")
  },
  json: {
    to: 114,
    from: [114, 3802],
    serialize: /* @__PURE__ */ __name((x) => JSON.stringify(x), "serialize"),
    parse: /* @__PURE__ */ __name((x) => JSON.parse(x), "parse")
  },
  boolean: {
    to: 16,
    from: 16,
    serialize: /* @__PURE__ */ __name((x) => x === true ? "t" : "f", "serialize"),
    parse: /* @__PURE__ */ __name((x) => x === "t", "parse")
  },
  date: {
    to: 1184,
    from: [1082, 1114, 1184],
    serialize: /* @__PURE__ */ __name((x) => (x instanceof Date ? x : new Date(x)).toISOString(), "serialize"),
    parse: /* @__PURE__ */ __name((x) => new Date(x), "parse")
  },
  bytea: {
    to: 17,
    from: 17,
    serialize: /* @__PURE__ */ __name((x) => "\\x" + Buffer3.from(x).toString("hex"), "serialize"),
    parse: /* @__PURE__ */ __name((x) => Buffer3.from(x.slice(2), "hex"), "parse")
  }
};
var NotTagged = class {
  static {
    __name(this, "NotTagged");
  }
  then() {
    notTagged();
  }
  catch() {
    notTagged();
  }
  finally() {
    notTagged();
  }
};
var Identifier = class extends NotTagged {
  static {
    __name(this, "Identifier");
  }
  constructor(value) {
    super();
    this.value = escapeIdentifier(value);
  }
};
var Parameter = class extends NotTagged {
  static {
    __name(this, "Parameter");
  }
  constructor(value, type, array) {
    super();
    this.value = value;
    this.type = type;
    this.array = array;
  }
};
var Builder = class extends NotTagged {
  static {
    __name(this, "Builder");
  }
  constructor(first, rest) {
    super();
    this.first = first;
    this.rest = rest;
  }
  build(before, parameters, types2, options) {
    const keyword = builders.map(([x, fn]) => ({ fn, i: before.search(x) })).sort((a, b2) => a.i - b2.i).pop();
    return keyword.i === -1 ? escapeIdentifiers(this.first, options) : keyword.fn(this.first, this.rest, parameters, types2, options);
  }
};
function handleValue(x, parameters, types2, options) {
  let value = x instanceof Parameter ? x.value : x;
  if (value === void 0) {
    x instanceof Parameter ? x.value = options.transform.undefined : value = x = options.transform.undefined;
    if (value === void 0)
      throw Errors.generic("UNDEFINED_VALUE", "Undefined values are not allowed");
  }
  return "$" + types2.push(
    x instanceof Parameter ? (parameters.push(x.value), x.array ? x.array[x.type || inferType(x.value)] || x.type || firstIsString(x.value) : x.type) : (parameters.push(x), inferType(x))
  );
}
__name(handleValue, "handleValue");
var defaultHandlers = typeHandlers(types);
function stringify(q, string, value, parameters, types2, options) {
  for (let i = 1; i < q.strings.length; i++) {
    string += stringifyValue(string, value, parameters, types2, options) + q.strings[i];
    value = q.args[i];
  }
  return string;
}
__name(stringify, "stringify");
function stringifyValue(string, value, parameters, types2, o) {
  return value instanceof Builder ? value.build(string, parameters, types2, o) : value instanceof Query ? fragment(value, parameters, types2, o) : value instanceof Identifier ? value.value : value && value[0] instanceof Query ? value.reduce((acc, x) => acc + " " + fragment(x, parameters, types2, o), "") : handleValue(value, parameters, types2, o);
}
__name(stringifyValue, "stringifyValue");
function fragment(q, parameters, types2, options) {
  q.fragment = true;
  return stringify(q, q.strings[0], q.args[0], parameters, types2, options);
}
__name(fragment, "fragment");
function valuesBuilder(first, parameters, types2, columns, options) {
  return first.map(
    (row) => "(" + columns.map(
      (column) => stringifyValue("values", row[column], parameters, types2, options)
    ).join(",") + ")"
  ).join(",");
}
__name(valuesBuilder, "valuesBuilder");
function values(first, rest, parameters, types2, options) {
  const multi = Array.isArray(first[0]);
  const columns = rest.length ? rest.flat() : Object.keys(multi ? first[0] : first);
  return valuesBuilder(multi ? first : [first], parameters, types2, columns, options);
}
__name(values, "values");
function select(first, rest, parameters, types2, options) {
  typeof first === "string" && (first = [first].concat(rest));
  if (Array.isArray(first))
    return escapeIdentifiers(first, options);
  let value;
  const columns = rest.length ? rest.flat() : Object.keys(first);
  return columns.map((x) => {
    value = first[x];
    return (value instanceof Query ? fragment(value, parameters, types2, options) : value instanceof Identifier ? value.value : handleValue(value, parameters, types2, options)) + " as " + escapeIdentifier(options.transform.column.to ? options.transform.column.to(x) : x);
  }).join(",");
}
__name(select, "select");
var builders = Object.entries({
  values,
  in: /* @__PURE__ */ __name((...xs) => {
    const x = values(...xs);
    return x === "()" ? "(null)" : x;
  }, "in"),
  select,
  as: select,
  returning: select,
  "\\(": select,
  update(first, rest, parameters, types2, options) {
    return (rest.length ? rest.flat() : Object.keys(first)).map(
      (x) => escapeIdentifier(options.transform.column.to ? options.transform.column.to(x) : x) + "=" + stringifyValue("values", first[x], parameters, types2, options)
    );
  },
  insert(first, rest, parameters, types2, options) {
    const columns = rest.length ? rest.flat() : Object.keys(Array.isArray(first) ? first[0] : first);
    return "(" + escapeIdentifiers(columns, options) + ")values" + valuesBuilder(Array.isArray(first) ? first : [first], parameters, types2, columns, options);
  }
}).map(([x, fn]) => [new RegExp("((?:^|[\\s(])" + x + "(?:$|[\\s(]))(?![\\s\\S]*\\1)", "i"), fn]);
function notTagged() {
  throw Errors.generic("NOT_TAGGED_CALL", "Query not called as a tagged template literal");
}
__name(notTagged, "notTagged");
var serializers = defaultHandlers.serializers;
var parsers = defaultHandlers.parsers;
function firstIsString(x) {
  if (Array.isArray(x))
    return firstIsString(x[0]);
  return typeof x === "string" ? 1009 : 0;
}
__name(firstIsString, "firstIsString");
var mergeUserTypes = /* @__PURE__ */ __name(function(types2) {
  const user = typeHandlers(types2 || {});
  return {
    serializers: Object.assign({}, serializers, user.serializers),
    parsers: Object.assign({}, parsers, user.parsers)
  };
}, "mergeUserTypes");
function typeHandlers(types2) {
  return Object.keys(types2).reduce((acc, k) => {
    types2[k].from && [].concat(types2[k].from).forEach((x) => acc.parsers[x] = types2[k].parse);
    if (types2[k].serialize) {
      acc.serializers[types2[k].to] = types2[k].serialize;
      types2[k].from && [].concat(types2[k].from).forEach((x) => acc.serializers[x] = types2[k].serialize);
    }
    return acc;
  }, { parsers: {}, serializers: {} });
}
__name(typeHandlers, "typeHandlers");
function escapeIdentifiers(xs, { transform: { column } }) {
  return xs.map((x) => escapeIdentifier(column.to ? column.to(x) : x)).join(",");
}
__name(escapeIdentifiers, "escapeIdentifiers");
var escapeIdentifier = /* @__PURE__ */ __name(function escape(str) {
  return '"' + str.replace(/"/g, '""').replace(/\./g, '"."') + '"';
}, "escape");
var inferType = /* @__PURE__ */ __name(function inferType2(x) {
  return x instanceof Parameter ? x.type : x instanceof Date ? 1184 : x instanceof Uint8Array ? 17 : x === true || x === false ? 16 : typeof x === "bigint" ? 20 : Array.isArray(x) ? inferType2(x[0]) : 0;
}, "inferType");
var escapeBackslash = /\\/g;
var escapeQuote = /"/g;
function arrayEscape(x) {
  return x.replace(escapeBackslash, "\\\\").replace(escapeQuote, '\\"');
}
__name(arrayEscape, "arrayEscape");
var arraySerializer = /* @__PURE__ */ __name(function arraySerializer2(xs, serializer, options, typarray) {
  if (Array.isArray(xs) === false)
    return xs;
  if (!xs.length)
    return "{}";
  const first = xs[0];
  const delimiter = typarray === 1020 ? ";" : ",";
  if (Array.isArray(first) && !first.type)
    return "{" + xs.map((x) => arraySerializer2(x, serializer, options, typarray)).join(delimiter) + "}";
  return "{" + xs.map((x) => {
    if (x === void 0) {
      x = options.transform.undefined;
      if (x === void 0)
        throw Errors.generic("UNDEFINED_VALUE", "Undefined values are not allowed");
    }
    return x === null ? "null" : '"' + arrayEscape(serializer ? serializer(x.type ? x.value : x) : "" + x) + '"';
  }).join(delimiter) + "}";
}, "arraySerializer");
var arrayParserState = {
  i: 0,
  char: null,
  str: "",
  quoted: false,
  last: 0
};
var arrayParser = /* @__PURE__ */ __name(function arrayParser2(x, parser, typarray) {
  arrayParserState.i = arrayParserState.last = 0;
  return arrayParserLoop(arrayParserState, x, parser, typarray);
}, "arrayParser");
function arrayParserLoop(s, x, parser, typarray) {
  const xs = [];
  const delimiter = typarray === 1020 ? ";" : ",";
  for (; s.i < x.length; s.i++) {
    s.char = x[s.i];
    if (s.quoted) {
      if (s.char === "\\") {
        s.str += x[++s.i];
      } else if (s.char === '"') {
        xs.push(parser ? parser(s.str) : s.str);
        s.str = "";
        s.quoted = x[s.i + 1] === '"';
        s.last = s.i + 2;
      } else {
        s.str += s.char;
      }
    } else if (s.char === '"') {
      s.quoted = true;
    } else if (s.char === "{") {
      s.last = ++s.i;
      xs.push(arrayParserLoop(s, x, parser, typarray));
    } else if (s.char === "}") {
      s.quoted = false;
      s.last < s.i && xs.push(parser ? parser(x.slice(s.last, s.i)) : x.slice(s.last, s.i));
      s.last = s.i + 1;
      break;
    } else if (s.char === delimiter && s.p !== "}" && s.p !== '"') {
      xs.push(parser ? parser(x.slice(s.last, s.i)) : x.slice(s.last, s.i));
      s.last = s.i + 1;
    }
    s.p = s.char;
  }
  s.last < s.i && xs.push(parser ? parser(x.slice(s.last, s.i + 1)) : x.slice(s.last, s.i + 1));
  return xs;
}
__name(arrayParserLoop, "arrayParserLoop");
var toCamel = /* @__PURE__ */ __name((x) => {
  let str = x[0];
  for (let i = 1; i < x.length; i++)
    str += x[i] === "_" ? x[++i].toUpperCase() : x[i];
  return str;
}, "toCamel");
var toPascal = /* @__PURE__ */ __name((x) => {
  let str = x[0].toUpperCase();
  for (let i = 1; i < x.length; i++)
    str += x[i] === "_" ? x[++i].toUpperCase() : x[i];
  return str;
}, "toPascal");
var toKebab = /* @__PURE__ */ __name((x) => x.replace(/_/g, "-"), "toKebab");
var fromCamel = /* @__PURE__ */ __name((x) => x.replace(/([A-Z])/g, "_$1").toLowerCase(), "fromCamel");
var fromPascal = /* @__PURE__ */ __name((x) => (x.slice(0, 1) + x.slice(1).replace(/([A-Z])/g, "_$1")).toLowerCase(), "fromPascal");
var fromKebab = /* @__PURE__ */ __name((x) => x.replace(/-/g, "_"), "fromKebab");
function createJsonTransform(fn) {
  return /* @__PURE__ */ __name(function jsonTransform(x, column) {
    return typeof x === "object" && x !== null && (column.type === 114 || column.type === 3802) ? Array.isArray(x) ? x.map((x2) => jsonTransform(x2, column)) : Object.entries(x).reduce((acc, [k, v]) => Object.assign(acc, { [fn(k)]: jsonTransform(v, column) }), {}) : x;
  }, "jsonTransform");
}
__name(createJsonTransform, "createJsonTransform");
toCamel.column = { from: toCamel };
toCamel.value = { from: createJsonTransform(toCamel) };
fromCamel.column = { to: fromCamel };
var camel = { ...toCamel };
camel.column.to = fromCamel;
toPascal.column = { from: toPascal };
toPascal.value = { from: createJsonTransform(toPascal) };
fromPascal.column = { to: fromPascal };
var pascal = { ...toPascal };
pascal.column.to = fromPascal;
toKebab.column = { from: toKebab };
toKebab.value = { from: createJsonTransform(toKebab) };
fromKebab.column = { to: fromKebab };
var kebab = { ...toKebab };
kebab.column.to = fromKebab;

// node_modules/postgres/cf/src/connection.js
import { Buffer as Buffer5 } from "node:buffer";
import Stream from "node:stream";

// node_modules/postgres/cf/src/result.js
var Result = class extends Array {
  static {
    __name(this, "Result");
  }
  constructor() {
    super();
    Object.defineProperties(this, {
      count: { value: null, writable: true },
      state: { value: null, writable: true },
      command: { value: null, writable: true },
      columns: { value: null, writable: true },
      statement: { value: null, writable: true }
    });
  }
  static get [Symbol.species]() {
    return Array;
  }
};

// node_modules/postgres/cf/src/queue.js
var queue_default = Queue;
function Queue(initial = []) {
  let xs = initial.slice();
  let index = 0;
  return {
    get length() {
      return xs.length - index;
    },
    remove: /* @__PURE__ */ __name((x) => {
      const index2 = xs.indexOf(x);
      return index2 === -1 ? null : (xs.splice(index2, 1), x);
    }, "remove"),
    push: /* @__PURE__ */ __name((x) => (xs.push(x), x), "push"),
    shift: /* @__PURE__ */ __name(() => {
      const out = xs[index++];
      if (index === xs.length) {
        index = 0;
        xs = [];
      } else {
        xs[index - 1] = void 0;
      }
      return out;
    }, "shift")
  };
}
__name(Queue, "Queue");

// node_modules/postgres/cf/src/bytes.js
import { Buffer as Buffer4 } from "node:buffer";
var size = 256;
var buffer = Buffer4.allocUnsafe(size);
var messages = "BCcDdEFfHPpQSX".split("").reduce((acc, x) => {
  const v = x.charCodeAt(0);
  acc[x] = () => {
    buffer[0] = v;
    b.i = 5;
    return b;
  };
  return acc;
}, {});
var b = Object.assign(reset, messages, {
  N: String.fromCharCode(0),
  i: 0,
  inc(x) {
    b.i += x;
    return b;
  },
  str(x) {
    const length = Buffer4.byteLength(x);
    fit(length);
    b.i += buffer.write(x, b.i, length, "utf8");
    return b;
  },
  i16(x) {
    fit(2);
    buffer.writeUInt16BE(x, b.i);
    b.i += 2;
    return b;
  },
  i32(x, i) {
    if (i || i === 0) {
      buffer.writeUInt32BE(x, i);
      return b;
    }
    fit(4);
    buffer.writeUInt32BE(x, b.i);
    b.i += 4;
    return b;
  },
  z(x) {
    fit(x);
    buffer.fill(0, b.i, b.i + x);
    b.i += x;
    return b;
  },
  raw(x) {
    buffer = Buffer4.concat([buffer.subarray(0, b.i), x]);
    b.i = buffer.length;
    return b;
  },
  end(at = 1) {
    buffer.writeUInt32BE(b.i - at, at);
    const out = buffer.subarray(0, b.i);
    b.i = 0;
    buffer = Buffer4.allocUnsafe(size);
    return out;
  }
});
var bytes_default = b;
function fit(x) {
  if (buffer.length - b.i < x) {
    const prev = buffer, length = prev.length;
    buffer = Buffer4.allocUnsafe(length + (length >> 1) + x);
    prev.copy(buffer);
  }
}
__name(fit, "fit");
function reset() {
  b.i = 0;
  return b;
}
__name(reset, "reset");

// node_modules/postgres/cf/src/connection.js
var connection_default = Connection;
var uid = 1;
var Sync = bytes_default().S().end();
var Flush = bytes_default().H().end();
var SSLRequest = bytes_default().i32(8).i32(80877103).end(8);
var ExecuteUnnamed = Buffer5.concat([bytes_default().E().str(bytes_default.N).i32(0).end(), Sync]);
var DescribeUnnamed = bytes_default().D().str("S").str(bytes_default.N).end();
var noop = /* @__PURE__ */ __name(() => {
}, "noop");
var retryRoutines = /* @__PURE__ */ new Set([
  "FetchPreparedStatement",
  "RevalidateCachedQuery",
  "transformAssignedExpr"
]);
var errorFields = {
  83: "severity_local",
  // S
  86: "severity",
  // V
  67: "code",
  // C
  77: "message",
  // M
  68: "detail",
  // D
  72: "hint",
  // H
  80: "position",
  // P
  112: "internal_position",
  // p
  113: "internal_query",
  // q
  87: "where",
  // W
  115: "schema_name",
  // s
  116: "table_name",
  // t
  99: "column_name",
  // c
  100: "data type_name",
  // d
  110: "constraint_name",
  // n
  70: "file",
  // F
  76: "line",
  // L
  82: "routine"
  // R
};
function Connection(options, queues = {}, { onopen = noop, onend = noop, onclose = noop } = {}) {
  const {
    sslnegotiation,
    ssl,
    max,
    user,
    host,
    port,
    database,
    parsers: parsers2,
    transform,
    onnotice,
    onnotify,
    onparameter,
    max_pipeline,
    keep_alive,
    backoff: backoff2,
    target_session_attrs
  } = options;
  const sent = queue_default(), id = uid++, backend = { pid: null, secret: null }, idleTimer = timer(end, options.idle_timeout), lifeTimer = timer(end, options.max_lifetime), connectTimer = timer(connectTimedOut, options.connect_timeout);
  let socket = null, cancelMessage, errorResponse = null, result = new Result(), incoming = Buffer5.alloc(0), needsTypes = options.fetch_types, backendParameters = {}, statements = {}, statementId = Math.random().toString(36).slice(2), statementCount = 1, closedTime = 0, remaining = 0, hostIndex = 0, retries = 0, length = 0, delay = 0, rows = 0, serverSignature = null, nextWriteTimer = null, terminated = false, incomings = null, results = null, initial = null, ending = null, stream = null, chunk = null, ended = null, nonce = null, query = null, final = null;
  const connection2 = {
    queue: queues.closed,
    idleTimer,
    connect(query2) {
      initial = query2;
      reconnect();
    },
    terminate,
    execute,
    cancel,
    end,
    count: 0,
    id
  };
  queues.closed && queues.closed.push(connection2);
  return connection2;
  async function createSocket() {
    let x;
    try {
      x = options.socket ? await Promise.resolve(options.socket(options)) : new net.Socket();
    } catch (e) {
      error(e);
      return;
    }
    x.on("error", error);
    x.on("close", closed);
    x.on("drain", drain);
    return x;
  }
  __name(createSocket, "createSocket");
  async function cancel({ pid, secret }, resolve, reject) {
    try {
      cancelMessage = bytes_default().i32(16).i32(80877102).i32(pid).i32(secret).end(16);
      await connect();
      socket.once("error", reject);
      socket.once("close", resolve);
    } catch (error2) {
      reject(error2);
    }
  }
  __name(cancel, "cancel");
  function execute(q) {
    if (terminated)
      return queryError(q, Errors.connection("CONNECTION_DESTROYED", options));
    if (stream)
      return queryError(q, Errors.generic("COPY_IN_PROGRESS", "You cannot execute queries during copy"));
    if (q.cancelled)
      return;
    try {
      q.state = backend;
      query ? sent.push(q) : (query = q, query.active = true);
      build(q);
      return write(toBuffer(q)) && !q.describeFirst && !q.cursorFn && sent.length < max_pipeline && (!q.options.onexecute || q.options.onexecute(connection2));
    } catch (error2) {
      sent.length === 0 && write(Sync);
      errored(error2);
      return true;
    }
  }
  __name(execute, "execute");
  function toBuffer(q) {
    if (q.parameters.length >= 65534)
      throw Errors.generic("MAX_PARAMETERS_EXCEEDED", "Max number of parameters (65534) exceeded");
    return q.options.simple ? bytes_default().Q().str(q.statement.string + bytes_default.N).end() : q.describeFirst ? Buffer5.concat([describe(q), Flush]) : q.prepare ? q.prepared ? prepared(q) : Buffer5.concat([describe(q), prepared(q)]) : unnamed(q);
  }
  __name(toBuffer, "toBuffer");
  function describe(q) {
    return Buffer5.concat([
      Parse(q.statement.string, q.parameters, q.statement.types, q.statement.name),
      Describe("S", q.statement.name)
    ]);
  }
  __name(describe, "describe");
  function prepared(q) {
    return Buffer5.concat([
      Bind(q.parameters, q.statement.types, q.statement.name, q.cursorName),
      q.cursorFn ? Execute("", q.cursorRows) : ExecuteUnnamed
    ]);
  }
  __name(prepared, "prepared");
  function unnamed(q) {
    return Buffer5.concat([
      Parse(q.statement.string, q.parameters, q.statement.types),
      DescribeUnnamed,
      prepared(q)
    ]);
  }
  __name(unnamed, "unnamed");
  function build(q) {
    const parameters = [], types2 = [];
    const string = stringify(q, q.strings[0], q.args[0], parameters, types2, options);
    !q.tagged && q.args.forEach((x) => handleValue(x, parameters, types2, options));
    q.prepare = options.prepare && ("prepare" in q.options ? q.options.prepare : true);
    q.string = string;
    q.signature = q.prepare && types2 + string;
    q.onlyDescribe && delete statements[q.signature];
    q.parameters = q.parameters || parameters;
    q.prepared = q.prepare && q.signature in statements;
    q.describeFirst = q.onlyDescribe || parameters.length && !q.prepared;
    q.statement = q.prepared ? statements[q.signature] : { string, types: types2, name: q.prepare ? statementId + statementCount++ : "" };
    typeof options.debug === "function" && options.debug(id, string, parameters, types2);
  }
  __name(build, "build");
  function write(x, fn) {
    chunk = chunk ? Buffer5.concat([chunk, x]) : Buffer5.from(x);
    if (fn || chunk.length >= 1024)
      return nextWrite(fn);
    nextWriteTimer === null && (nextWriteTimer = setImmediate(nextWrite));
    return true;
  }
  __name(write, "write");
  function nextWrite(fn) {
    const x = socket.write(chunk, fn);
    nextWriteTimer !== null && clearImmediate(nextWriteTimer);
    chunk = nextWriteTimer = null;
    return x;
  }
  __name(nextWrite, "nextWrite");
  function connectTimedOut() {
    errored(Errors.connection("CONNECT_TIMEOUT", options, socket));
    socket.destroy();
  }
  __name(connectTimedOut, "connectTimedOut");
  async function secure() {
    if (sslnegotiation !== "direct") {
      write(SSLRequest);
      const canSSL = await new Promise((r) => socket.once("data", (x) => r(x[0] === 83)));
      if (!canSSL && ssl === "prefer")
        return connected();
    }
    const options2 = {
      socket,
      servername: net.isIP(socket.host) ? void 0 : socket.host
    };
    if (sslnegotiation === "direct")
      options2.ALPNProtocols = ["postgresql"];
    if (ssl === "require" || ssl === "allow" || ssl === "prefer")
      options2.rejectUnauthorized = false;
    else if (typeof ssl === "object")
      Object.assign(options2, ssl);
    socket.removeAllListeners();
    socket = tls.connect(options2);
    socket.on("secureConnect", connected);
    socket.on("error", error);
    socket.on("close", closed);
    socket.on("drain", drain);
  }
  __name(secure, "secure");
  function drain() {
    !query && onopen(connection2);
  }
  __name(drain, "drain");
  function data(x) {
    if (incomings) {
      incomings.push(x);
      remaining -= x.length;
      if (remaining > 0)
        return;
    }
    incoming = incomings ? Buffer5.concat(incomings, length - remaining) : incoming.length === 0 ? x : Buffer5.concat([incoming, x], incoming.length + x.length);
    while (incoming.length > 4) {
      length = incoming.readUInt32BE(1);
      if (length >= incoming.length) {
        remaining = length - incoming.length;
        incomings = [incoming];
        break;
      }
      try {
        handle(incoming.subarray(0, length + 1));
      } catch (e) {
        query && (query.cursorFn || query.describeFirst) && write(Sync);
        errored(e);
      }
      incoming = incoming.subarray(length + 1);
      remaining = 0;
      incomings = null;
    }
  }
  __name(data, "data");
  async function connect() {
    terminated = false;
    backendParameters = {};
    socket || (socket = await createSocket());
    if (!socket)
      return;
    connectTimer.start();
    if (options.socket)
      return ssl ? secure() : connected();
    socket.on("connect", ssl ? secure : connected);
    if (options.path)
      return socket.connect(options.path);
    socket.ssl = ssl;
    socket.connect(port[hostIndex], host[hostIndex]);
    socket.host = host[hostIndex];
    socket.port = port[hostIndex];
    hostIndex = (hostIndex + 1) % port.length;
  }
  __name(connect, "connect");
  function reconnect() {
    setTimeout(connect, closedTime ? Math.max(0, closedTime + delay - performance.now()) : 0);
  }
  __name(reconnect, "reconnect");
  function connected() {
    try {
      statements = {};
      needsTypes = options.fetch_types;
      statementId = Math.random().toString(36).slice(2);
      statementCount = 1;
      lifeTimer.start();
      socket.on("data", data);
      keep_alive && socket.setKeepAlive && socket.setKeepAlive(true, 1e3 * keep_alive);
      const s = StartupMessage();
      write(s);
    } catch (err) {
      error(err);
    }
  }
  __name(connected, "connected");
  function error(err) {
    if (connection2.queue === queues.connecting && options.host[retries + 1])
      return;
    errored(err);
    while (sent.length)
      queryError(sent.shift(), err);
  }
  __name(error, "error");
  function errored(err) {
    stream && (stream.destroy(err), stream = null);
    query && queryError(query, err);
    initial && (queryError(initial, err), initial = null);
  }
  __name(errored, "errored");
  function queryError(query2, err) {
    if (query2.reserve)
      return query2.reject(err);
    if (!err || typeof err !== "object")
      err = new Error(err);
    "query" in err || "parameters" in err || Object.defineProperties(err, {
      stack: { value: err.stack + query2.origin.replace(/.*\n/, "\n"), enumerable: options.debug },
      query: { value: query2.string, enumerable: options.debug },
      parameters: { value: query2.parameters, enumerable: options.debug },
      args: { value: query2.args, enumerable: options.debug },
      types: { value: query2.statement && query2.statement.types, enumerable: options.debug }
    });
    query2.reject(err);
  }
  __name(queryError, "queryError");
  function end() {
    return ending || (!connection2.reserved && onend(connection2), !connection2.reserved && !initial && !query && sent.length === 0 ? (terminate(), new Promise((r) => socket && socket.readyState !== "closed" ? socket.once("close", r) : r())) : ending = new Promise((r) => ended = r));
  }
  __name(end, "end");
  function terminate() {
    terminated = true;
    if (stream || query || initial || sent.length)
      error(Errors.connection("CONNECTION_DESTROYED", options));
    clearImmediate(nextWriteTimer);
    if (socket) {
      socket.removeListener("data", data);
      socket.removeListener("connect", connected);
      socket.readyState === "open" && socket.end(bytes_default().X().end());
    }
    ended && (ended(), ending = ended = null);
  }
  __name(terminate, "terminate");
  async function closed(hadError) {
    incoming = Buffer5.alloc(0);
    remaining = 0;
    incomings = null;
    clearImmediate(nextWriteTimer);
    socket.removeListener("data", data);
    socket.removeListener("connect", connected);
    idleTimer.cancel();
    lifeTimer.cancel();
    connectTimer.cancel();
    socket.removeAllListeners();
    socket = null;
    if (initial)
      return reconnect();
    !hadError && (query || sent.length) && error(Errors.connection("CONNECTION_CLOSED", options, socket));
    closedTime = performance.now();
    hadError && options.shared.retries++;
    delay = (typeof backoff2 === "function" ? backoff2(options.shared.retries) : backoff2) * 1e3;
    onclose(connection2, Errors.connection("CONNECTION_CLOSED", options, socket));
  }
  __name(closed, "closed");
  function handle(xs, x = xs[0]) {
    (x === 68 ? DataRow : (
      // D
      x === 100 ? CopyData : (
        // d
        x === 65 ? NotificationResponse : (
          // A
          x === 83 ? ParameterStatus : (
            // S
            x === 90 ? ReadyForQuery : (
              // Z
              x === 67 ? CommandComplete : (
                // C
                x === 50 ? BindComplete : (
                  // 2
                  x === 49 ? ParseComplete : (
                    // 1
                    x === 116 ? ParameterDescription : (
                      // t
                      x === 84 ? RowDescription : (
                        // T
                        x === 82 ? Authentication : (
                          // R
                          x === 110 ? NoData : (
                            // n
                            x === 75 ? BackendKeyData : (
                              // K
                              x === 69 ? ErrorResponse : (
                                // E
                                x === 115 ? PortalSuspended : (
                                  // s
                                  x === 51 ? CloseComplete : (
                                    // 3
                                    x === 71 ? CopyInResponse : (
                                      // G
                                      x === 78 ? NoticeResponse : (
                                        // N
                                        x === 72 ? CopyOutResponse : (
                                          // H
                                          x === 99 ? CopyDone : (
                                            // c
                                            x === 73 ? EmptyQueryResponse : (
                                              // I
                                              x === 86 ? FunctionCallResponse : (
                                                // V
                                                x === 118 ? NegotiateProtocolVersion : (
                                                  // v
                                                  x === 87 ? CopyBothResponse : (
                                                    // W
                                                    /* c8 ignore next */
                                                    UnknownMessage
                                                  )
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    ))(xs);
  }
  __name(handle, "handle");
  function DataRow(x) {
    let index = 7;
    let length2;
    let column;
    let value;
    const row = query.isRaw ? new Array(query.statement.columns.length) : {};
    for (let i = 0; i < query.statement.columns.length; i++) {
      column = query.statement.columns[i];
      length2 = x.readInt32BE(index);
      index += 4;
      value = length2 === -1 ? null : query.isRaw === true ? x.subarray(index, index += length2) : column.parser === void 0 ? x.toString("utf8", index, index += length2) : column.parser.array === true ? column.parser(x.toString("utf8", index + 1, index += length2)) : column.parser(x.toString("utf8", index, index += length2));
      query.isRaw ? row[i] = query.isRaw === true ? value : transform.value.from ? transform.value.from(value, column) : value : row[column.name] = transform.value.from ? transform.value.from(value, column) : value;
    }
    query.forEachFn ? query.forEachFn(transform.row.from ? transform.row.from(row) : row, result) : result[rows++] = transform.row.from ? transform.row.from(row) : row;
  }
  __name(DataRow, "DataRow");
  function ParameterStatus(x) {
    const [k, v] = x.toString("utf8", 5, x.length - 1).split(bytes_default.N);
    backendParameters[k] = v;
    if (options.parameters[k] !== v) {
      options.parameters[k] = v;
      onparameter && onparameter(k, v);
    }
  }
  __name(ParameterStatus, "ParameterStatus");
  function ReadyForQuery(x) {
    if (query) {
      if (errorResponse) {
        query.retried ? errored(query.retried) : query.prepared && retryRoutines.has(errorResponse.routine) ? retry(query, errorResponse) : errored(errorResponse);
      } else {
        query.resolve(results || result);
      }
    } else if (errorResponse) {
      errored(errorResponse);
    }
    query = results = errorResponse = null;
    result = new Result();
    connectTimer.cancel();
    if (initial) {
      if (target_session_attrs) {
        if (!backendParameters.in_hot_standby || !backendParameters.default_transaction_read_only)
          return fetchState();
        else if (tryNext(target_session_attrs, backendParameters))
          return terminate();
      }
      if (needsTypes) {
        initial.reserve && (initial = null);
        return fetchArrayTypes();
      }
      initial && !initial.reserve && execute(initial);
      options.shared.retries = retries = 0;
      initial = null;
      return;
    }
    while (sent.length && (query = sent.shift()) && (query.active = true, query.cancelled))
      Connection(options).cancel(query.state, query.cancelled.resolve, query.cancelled.reject);
    if (query)
      return;
    connection2.reserved ? !connection2.reserved.release && x[5] === 73 ? ending ? terminate() : (connection2.reserved = null, onopen(connection2)) : connection2.reserved() : ending ? terminate() : onopen(connection2);
  }
  __name(ReadyForQuery, "ReadyForQuery");
  function CommandComplete(x) {
    rows = 0;
    for (let i = x.length - 1; i > 0; i--) {
      if (x[i] === 32 && x[i + 1] < 58 && result.count === null)
        result.count = +x.toString("utf8", i + 1, x.length - 1);
      if (x[i - 1] >= 65) {
        result.command = x.toString("utf8", 5, i);
        result.state = backend;
        break;
      }
    }
    final && (final(), final = null);
    if (result.command === "BEGIN" && max !== 1 && !connection2.reserved)
      return errored(Errors.generic("UNSAFE_TRANSACTION", "Only use sql.begin, sql.reserved or max: 2"));
    if (query.options.simple)
      return BindComplete();
    if (query.cursorFn) {
      result.count && query.cursorFn(result);
      write(Sync);
    }
  }
  __name(CommandComplete, "CommandComplete");
  function ParseComplete() {
    query.parsing = false;
  }
  __name(ParseComplete, "ParseComplete");
  function BindComplete() {
    !result.statement && (result.statement = query.statement);
    result.columns = query.statement.columns;
  }
  __name(BindComplete, "BindComplete");
  function ParameterDescription(x) {
    const length2 = x.readUInt16BE(5);
    for (let i = 0; i < length2; ++i)
      !query.statement.types[i] && (query.statement.types[i] = x.readUInt32BE(7 + i * 4));
    query.prepare && (statements[query.signature] = query.statement);
    query.describeFirst && !query.onlyDescribe && (write(prepared(query)), query.describeFirst = false);
  }
  __name(ParameterDescription, "ParameterDescription");
  function RowDescription(x) {
    if (result.command) {
      results = results || [result];
      results.push(result = new Result());
      result.count = null;
      query.statement.columns = null;
    }
    const length2 = x.readUInt16BE(5);
    let index = 7;
    let start;
    query.statement.columns = Array(length2);
    for (let i = 0; i < length2; ++i) {
      start = index;
      while (x[index++] !== 0) ;
      const table = x.readUInt32BE(index);
      const number = x.readUInt16BE(index + 4);
      const type = x.readUInt32BE(index + 6);
      query.statement.columns[i] = {
        name: transform.column.from ? transform.column.from(x.toString("utf8", start, index - 1)) : x.toString("utf8", start, index - 1),
        parser: parsers2[type],
        table,
        number,
        type
      };
      index += 18;
    }
    result.statement = query.statement;
    if (query.onlyDescribe)
      return query.resolve(query.statement), write(Sync);
  }
  __name(RowDescription, "RowDescription");
  async function Authentication(x, type = x.readUInt32BE(5)) {
    (type === 3 ? AuthenticationCleartextPassword : type === 5 ? AuthenticationMD5Password : type === 10 ? SASL : type === 11 ? SASLContinue : type === 12 ? SASLFinal : type !== 0 ? UnknownAuth : noop)(x, type);
  }
  __name(Authentication, "Authentication");
  async function AuthenticationCleartextPassword() {
    const payload = await Pass();
    write(
      bytes_default().p().str(payload).z(1).end()
    );
  }
  __name(AuthenticationCleartextPassword, "AuthenticationCleartextPassword");
  async function AuthenticationMD5Password(x) {
    const payload = "md5" + await md5(
      Buffer5.concat([
        Buffer5.from(await md5(await Pass() + user)),
        x.subarray(9)
      ])
    );
    write(
      bytes_default().p().str(payload).z(1).end()
    );
  }
  __name(AuthenticationMD5Password, "AuthenticationMD5Password");
  async function SASL() {
    nonce = (await crypto2.randomBytes(18)).toString("base64");
    bytes_default().p().str("SCRAM-SHA-256" + bytes_default.N);
    const i = bytes_default.i;
    write(bytes_default.inc(4).str("n,,n=*,r=" + nonce).i32(bytes_default.i - i - 4, i).end());
  }
  __name(SASL, "SASL");
  async function SASLContinue(x) {
    const res = x.toString("utf8", 9).split(",").reduce((acc, x2) => (acc[x2[0]] = x2.slice(2), acc), {});
    const saltedPassword = await crypto2.pbkdf2Sync(
      await Pass(),
      Buffer5.from(res.s, "base64"),
      parseInt(res.i),
      32,
      "sha256"
    );
    const clientKey = await hmac(saltedPassword, "Client Key");
    const auth = "n=*,r=" + nonce + ",r=" + res.r + ",s=" + res.s + ",i=" + res.i + ",c=biws,r=" + res.r;
    serverSignature = (await hmac(await hmac(saltedPassword, "Server Key"), auth)).toString("base64");
    const payload = "c=biws,r=" + res.r + ",p=" + xor(
      clientKey,
      Buffer5.from(await hmac(await sha256(clientKey), auth))
    ).toString("base64");
    write(
      bytes_default().p().str(payload).end()
    );
  }
  __name(SASLContinue, "SASLContinue");
  function SASLFinal(x) {
    if (x.toString("utf8", 9).split(bytes_default.N, 1)[0].slice(2) === serverSignature)
      return;
    errored(Errors.generic("SASL_SIGNATURE_MISMATCH", "The server did not return the correct signature"));
    socket.destroy();
  }
  __name(SASLFinal, "SASLFinal");
  function Pass() {
    return Promise.resolve(
      typeof options.pass === "function" ? options.pass() : options.pass
    );
  }
  __name(Pass, "Pass");
  function NoData() {
    result.statement = query.statement;
    result.statement.columns = [];
    if (query.onlyDescribe)
      return query.resolve(query.statement), write(Sync);
  }
  __name(NoData, "NoData");
  function BackendKeyData(x) {
    backend.pid = x.readUInt32BE(5);
    backend.secret = x.readUInt32BE(9);
  }
  __name(BackendKeyData, "BackendKeyData");
  async function fetchArrayTypes() {
    needsTypes = false;
    const types2 = await new Query([`
      select b.oid, b.typarray
      from pg_catalog.pg_type a
      left join pg_catalog.pg_type b on b.oid = a.typelem
      where a.typcategory = 'A'
      group by b.oid, b.typarray
      order by b.oid
    `], [], execute);
    types2.forEach(({ oid, typarray }) => addArrayType(oid, typarray));
  }
  __name(fetchArrayTypes, "fetchArrayTypes");
  function addArrayType(oid, typarray) {
    if (!!options.parsers[typarray] && !!options.serializers[typarray]) return;
    const parser = options.parsers[oid];
    options.shared.typeArrayMap[oid] = typarray;
    options.parsers[typarray] = (xs) => arrayParser(xs, parser, typarray);
    options.parsers[typarray].array = true;
    options.serializers[typarray] = (xs) => arraySerializer(xs, options.serializers[oid], options, typarray);
  }
  __name(addArrayType, "addArrayType");
  function tryNext(x, xs) {
    return x === "read-write" && xs.default_transaction_read_only === "on" || x === "read-only" && xs.default_transaction_read_only === "off" || x === "primary" && xs.in_hot_standby === "on" || x === "standby" && xs.in_hot_standby === "off" || x === "prefer-standby" && xs.in_hot_standby === "off" && options.host[retries];
  }
  __name(tryNext, "tryNext");
  function fetchState() {
    const query2 = new Query([`
      show transaction_read_only;
      select pg_catalog.pg_is_in_recovery()
    `], [], execute, null, { simple: true });
    query2.resolve = ([[a], [b2]]) => {
      backendParameters.default_transaction_read_only = a.transaction_read_only;
      backendParameters.in_hot_standby = b2.pg_is_in_recovery ? "on" : "off";
    };
    query2.execute();
  }
  __name(fetchState, "fetchState");
  function ErrorResponse(x) {
    if (query) {
      (query.cursorFn || query.describeFirst) && write(Sync);
      errorResponse = Errors.postgres(parseError(x));
    } else {
      errored(Errors.postgres(parseError(x)));
    }
  }
  __name(ErrorResponse, "ErrorResponse");
  function retry(q, error2) {
    delete statements[q.signature];
    q.retried = error2;
    execute(q);
  }
  __name(retry, "retry");
  function NotificationResponse(x) {
    if (!onnotify)
      return;
    let index = 9;
    while (x[index++] !== 0) ;
    onnotify(
      x.toString("utf8", 9, index - 1),
      x.toString("utf8", index, x.length - 1)
    );
  }
  __name(NotificationResponse, "NotificationResponse");
  async function PortalSuspended() {
    try {
      const x = await Promise.resolve(query.cursorFn(result));
      rows = 0;
      x === CLOSE ? write(Close(query.portal)) : (result = new Result(), write(Execute("", query.cursorRows)));
    } catch (err) {
      write(Sync);
      query.reject(err);
    }
  }
  __name(PortalSuspended, "PortalSuspended");
  function CloseComplete() {
    result.count && query.cursorFn(result);
    query.resolve(result);
  }
  __name(CloseComplete, "CloseComplete");
  function CopyInResponse() {
    stream = new Stream.Writable({
      autoDestroy: true,
      write(chunk2, encoding, callback) {
        socket.write(bytes_default().d().raw(chunk2).end(), callback);
      },
      destroy(error2, callback) {
        callback(error2);
        socket.write(bytes_default().f().str(error2 + bytes_default.N).end());
        stream = null;
      },
      final(callback) {
        socket.write(bytes_default().c().end());
        final = callback;
        stream = null;
      }
    });
    query.resolve(stream);
  }
  __name(CopyInResponse, "CopyInResponse");
  function CopyOutResponse() {
    stream = new Stream.Readable({
      read() {
        socket.resume();
      }
    });
    query.resolve(stream);
  }
  __name(CopyOutResponse, "CopyOutResponse");
  function CopyBothResponse() {
    stream = new Stream.Duplex({
      autoDestroy: true,
      read() {
        socket.resume();
      },
      /* c8 ignore next 11 */
      write(chunk2, encoding, callback) {
        socket.write(bytes_default().d().raw(chunk2).end(), callback);
      },
      destroy(error2, callback) {
        callback(error2);
        socket.write(bytes_default().f().str(error2 + bytes_default.N).end());
        stream = null;
      },
      final(callback) {
        socket.write(bytes_default().c().end());
        final = callback;
      }
    });
    query.resolve(stream);
  }
  __name(CopyBothResponse, "CopyBothResponse");
  function CopyData(x) {
    stream && (stream.push(x.subarray(5)) || socket.pause());
  }
  __name(CopyData, "CopyData");
  function CopyDone() {
    stream && stream.push(null);
    stream = null;
  }
  __name(CopyDone, "CopyDone");
  function NoticeResponse(x) {
    onnotice ? onnotice(parseError(x)) : console.log(parseError(x));
  }
  __name(NoticeResponse, "NoticeResponse");
  function EmptyQueryResponse() {
  }
  __name(EmptyQueryResponse, "EmptyQueryResponse");
  function FunctionCallResponse() {
    errored(Errors.notSupported("FunctionCallResponse"));
  }
  __name(FunctionCallResponse, "FunctionCallResponse");
  function NegotiateProtocolVersion() {
    errored(Errors.notSupported("NegotiateProtocolVersion"));
  }
  __name(NegotiateProtocolVersion, "NegotiateProtocolVersion");
  function UnknownMessage(x) {
    console.error("Postgres.js : Unknown Message:", x[0]);
  }
  __name(UnknownMessage, "UnknownMessage");
  function UnknownAuth(x, type) {
    console.error("Postgres.js : Unknown Auth:", type);
  }
  __name(UnknownAuth, "UnknownAuth");
  function Bind(parameters, types2, statement = "", portal = "") {
    let prev, type;
    bytes_default().B().str(portal + bytes_default.N).str(statement + bytes_default.N).i16(0).i16(parameters.length);
    parameters.forEach((x, i) => {
      if (x === null)
        return bytes_default.i32(4294967295);
      type = types2[i];
      parameters[i] = x = type in options.serializers ? options.serializers[type](x) : "" + x;
      prev = bytes_default.i;
      bytes_default.inc(4).str(x).i32(bytes_default.i - prev - 4, prev);
    });
    bytes_default.i16(0);
    return bytes_default.end();
  }
  __name(Bind, "Bind");
  function Parse(str, parameters, types2, name = "") {
    bytes_default().P().str(name + bytes_default.N).str(str + bytes_default.N).i16(parameters.length);
    parameters.forEach((x, i) => bytes_default.i32(types2[i] || 0));
    return bytes_default.end();
  }
  __name(Parse, "Parse");
  function Describe(x, name = "") {
    return bytes_default().D().str(x).str(name + bytes_default.N).end();
  }
  __name(Describe, "Describe");
  function Execute(portal = "", rows2 = 0) {
    return Buffer5.concat([
      bytes_default().E().str(portal + bytes_default.N).i32(rows2).end(),
      Flush
    ]);
  }
  __name(Execute, "Execute");
  function Close(portal = "") {
    return Buffer5.concat([
      bytes_default().C().str("P").str(portal + bytes_default.N).end(),
      bytes_default().S().end()
    ]);
  }
  __name(Close, "Close");
  function StartupMessage() {
    return cancelMessage || bytes_default().inc(4).i16(3).z(2).str(
      Object.entries(Object.assign(
        {
          user,
          database,
          client_encoding: "UTF8"
        },
        options.connection
      )).filter(([, v]) => v).map(([k, v]) => k + bytes_default.N + v).join(bytes_default.N)
    ).z(2).end(0);
  }
  __name(StartupMessage, "StartupMessage");
}
__name(Connection, "Connection");
function parseError(x) {
  const error = {};
  let start = 5;
  for (let i = 5; i < x.length - 1; i++) {
    if (x[i] === 0) {
      error[errorFields[x[start]]] = x.toString("utf8", start + 1, i);
      start = i + 1;
    }
  }
  return error;
}
__name(parseError, "parseError");
function md5(x) {
  return crypto2.createHash("md5").update(x).digest("hex");
}
__name(md5, "md5");
function hmac(key, x) {
  return crypto2.createHmac("sha256", key).update(x).digest();
}
__name(hmac, "hmac");
function sha256(x) {
  return crypto2.createHash("sha256").update(x).digest();
}
__name(sha256, "sha256");
function xor(a, b2) {
  const length = Math.max(a.length, b2.length);
  const buffer2 = Buffer5.allocUnsafe(length);
  for (let i = 0; i < length; i++)
    buffer2[i] = a[i] ^ b2[i];
  return buffer2;
}
__name(xor, "xor");
function timer(fn, seconds) {
  seconds = typeof seconds === "function" ? seconds() : seconds;
  if (!seconds)
    return { cancel: noop, start: noop };
  let timer2;
  return {
    cancel() {
      timer2 && (clearTimeout(timer2), timer2 = null);
    },
    start() {
      timer2 && clearTimeout(timer2);
      timer2 = setTimeout(done, seconds * 1e3, arguments);
    }
  };
  function done(args) {
    fn.apply(null, args);
    timer2 = null;
  }
  __name(done, "done");
}
__name(timer, "timer");

// node_modules/postgres/cf/src/subscribe.js
import { Buffer as Buffer6 } from "node:buffer";
var noop2 = /* @__PURE__ */ __name(() => {
}, "noop");
function Subscribe(postgres2, options) {
  const subscribers = /* @__PURE__ */ new Map(), slot = "postgresjs_" + Math.random().toString(36).slice(2), state = {};
  let connection2, stream, ended = false;
  const sql = subscribe.sql = postgres2({
    ...options,
    transform: { column: {}, value: {}, row: {} },
    max: 1,
    fetch_types: false,
    idle_timeout: null,
    max_lifetime: null,
    connection: {
      ...options.connection,
      replication: "database"
    },
    onclose: /* @__PURE__ */ __name(async function() {
      if (ended)
        return;
      stream = null;
      state.pid = state.secret = void 0;
      connected(await init(sql, slot, options.publications));
      subscribers.forEach((event) => event.forEach(({ onsubscribe }) => onsubscribe()));
    }, "onclose"),
    no_subscribe: true
  });
  const end = sql.end, close = sql.close;
  sql.end = async () => {
    ended = true;
    stream && await new Promise((r) => (stream.once("close", r), stream.end()));
    return end();
  };
  sql.close = async () => {
    stream && await new Promise((r) => (stream.once("close", r), stream.end()));
    return close();
  };
  return subscribe;
  async function subscribe(event, fn, onsubscribe = noop2, onerror = noop2) {
    event = parseEvent(event);
    if (!connection2)
      connection2 = init(sql, slot, options.publications);
    const subscriber = { fn, onsubscribe };
    const fns = subscribers.has(event) ? subscribers.get(event).add(subscriber) : subscribers.set(event, /* @__PURE__ */ new Set([subscriber])).get(event);
    const unsubscribe = /* @__PURE__ */ __name(() => {
      fns.delete(subscriber);
      fns.size === 0 && subscribers.delete(event);
    }, "unsubscribe");
    return connection2.then((x) => {
      connected(x);
      onsubscribe();
      stream && stream.on("error", onerror);
      return { unsubscribe, state, sql };
    });
  }
  __name(subscribe, "subscribe");
  function connected(x) {
    stream = x.stream;
    state.pid = x.state.pid;
    state.secret = x.state.secret;
  }
  __name(connected, "connected");
  async function init(sql2, slot2, publications) {
    if (!publications)
      throw new Error("Missing publication names");
    const xs = await sql2.unsafe(
      `CREATE_REPLICATION_SLOT ${slot2} TEMPORARY LOGICAL pgoutput NOEXPORT_SNAPSHOT`
    );
    const [x] = xs;
    const stream2 = await sql2.unsafe(
      `START_REPLICATION SLOT ${slot2} LOGICAL ${x.consistent_point} (proto_version '1', publication_names '${publications}')`
    ).writable();
    const state2 = {
      lsn: Buffer6.concat(x.consistent_point.split("/").map((x2) => Buffer6.from(("00000000" + x2).slice(-8), "hex")))
    };
    stream2.on("data", data);
    stream2.on("error", error);
    stream2.on("close", sql2.close);
    return { stream: stream2, state: xs.state };
    function error(e) {
      console.error("Unexpected error during logical streaming - reconnecting", e);
    }
    __name(error, "error");
    function data(x2) {
      if (x2[0] === 119) {
        parse(x2.subarray(25), state2, sql2.options.parsers, handle, options.transform);
      } else if (x2[0] === 107 && x2[17]) {
        state2.lsn = x2.subarray(1, 9);
        pong();
      }
    }
    __name(data, "data");
    function handle(a, b2) {
      const path = b2.relation.schema + "." + b2.relation.table;
      call("*", a, b2);
      call("*:" + path, a, b2);
      b2.relation.keys.length && call("*:" + path + "=" + b2.relation.keys.map((x2) => a[x2.name]), a, b2);
      call(b2.command, a, b2);
      call(b2.command + ":" + path, a, b2);
      b2.relation.keys.length && call(b2.command + ":" + path + "=" + b2.relation.keys.map((x2) => a[x2.name]), a, b2);
    }
    __name(handle, "handle");
    function pong() {
      const x2 = Buffer6.alloc(34);
      x2[0] = "r".charCodeAt(0);
      x2.fill(state2.lsn, 1);
      x2.writeBigInt64BE(BigInt(Date.now() - Date.UTC(2e3, 0, 1)) * BigInt(1e3), 25);
      stream2.write(x2);
    }
    __name(pong, "pong");
  }
  __name(init, "init");
  function call(x, a, b2) {
    subscribers.has(x) && subscribers.get(x).forEach(({ fn }) => fn(a, b2, x));
  }
  __name(call, "call");
}
__name(Subscribe, "Subscribe");
function Time(x) {
  return new Date(Date.UTC(2e3, 0, 1) + Number(x / BigInt(1e3)));
}
__name(Time, "Time");
function parse(x, state, parsers2, handle, transform) {
  const char = /* @__PURE__ */ __name((acc, [k, v]) => (acc[k.charCodeAt(0)] = v, acc), "char");
  Object.entries({
    R: /* @__PURE__ */ __name((x2) => {
      let i = 1;
      const r = state[x2.readUInt32BE(i)] = {
        schema: x2.toString("utf8", i += 4, i = x2.indexOf(0, i)) || "pg_catalog",
        table: x2.toString("utf8", i + 1, i = x2.indexOf(0, i + 1)),
        columns: Array(x2.readUInt16BE(i += 2)),
        keys: []
      };
      i += 2;
      let columnIndex = 0, column;
      while (i < x2.length) {
        column = r.columns[columnIndex++] = {
          key: x2[i++],
          name: transform.column.from ? transform.column.from(x2.toString("utf8", i, i = x2.indexOf(0, i))) : x2.toString("utf8", i, i = x2.indexOf(0, i)),
          type: x2.readUInt32BE(i += 1),
          parser: parsers2[x2.readUInt32BE(i)],
          atttypmod: x2.readUInt32BE(i += 4)
        };
        column.key && r.keys.push(column);
        i += 4;
      }
    }, "R"),
    Y: /* @__PURE__ */ __name(() => {
    }, "Y"),
    // Type
    O: /* @__PURE__ */ __name(() => {
    }, "O"),
    // Origin
    B: /* @__PURE__ */ __name((x2) => {
      state.date = Time(x2.readBigInt64BE(9));
      state.lsn = x2.subarray(1, 9);
    }, "B"),
    I: /* @__PURE__ */ __name((x2) => {
      let i = 1;
      const relation = state[x2.readUInt32BE(i)];
      const { row } = tuples(x2, relation.columns, i += 7, transform);
      handle(row, {
        command: "insert",
        relation
      });
    }, "I"),
    D: /* @__PURE__ */ __name((x2) => {
      let i = 1;
      const relation = state[x2.readUInt32BE(i)];
      i += 4;
      const key = x2[i] === 75;
      handle(
        key || x2[i] === 79 ? tuples(x2, relation.columns, i += 3, transform).row : null,
        {
          command: "delete",
          relation,
          key
        }
      );
    }, "D"),
    U: /* @__PURE__ */ __name((x2) => {
      let i = 1;
      const relation = state[x2.readUInt32BE(i)];
      i += 4;
      const key = x2[i] === 75;
      const xs = key || x2[i] === 79 ? tuples(x2, relation.columns, i += 3, transform) : null;
      xs && (i = xs.i);
      const { row } = tuples(x2, relation.columns, i + 3, transform);
      handle(row, {
        command: "update",
        relation,
        key,
        old: xs && xs.row
      });
    }, "U"),
    T: /* @__PURE__ */ __name(() => {
    }, "T"),
    // Truncate,
    C: /* @__PURE__ */ __name(() => {
    }, "C")
    // Commit
  }).reduce(char, {})[x[0]](x);
}
__name(parse, "parse");
function tuples(x, columns, xi, transform) {
  let type, column, value;
  const row = transform.raw ? new Array(columns.length) : {};
  for (let i = 0; i < columns.length; i++) {
    type = x[xi++];
    column = columns[i];
    value = type === 110 ? null : type === 117 ? void 0 : column.parser === void 0 ? x.toString("utf8", xi + 4, xi += 4 + x.readUInt32BE(xi)) : column.parser.array === true ? column.parser(x.toString("utf8", xi + 5, xi += 4 + x.readUInt32BE(xi))) : column.parser(x.toString("utf8", xi + 4, xi += 4 + x.readUInt32BE(xi)));
    transform.raw ? row[i] = transform.raw === true ? value : transform.value.from ? transform.value.from(value, column) : value : row[column.name] = transform.value.from ? transform.value.from(value, column) : value;
  }
  return { i: xi, row: transform.row.from ? transform.row.from(row) : row };
}
__name(tuples, "tuples");
function parseEvent(x) {
  const xs = x.match(/^(\*|insert|update|delete)?:?([^.]+?\.?[^=]+)?=?(.+)?/i) || [];
  if (!xs)
    throw new Error("Malformed subscribe pattern: " + x);
  const [, command, path, key] = xs;
  return (command || "*") + (path ? ":" + (path.indexOf(".") === -1 ? "public." + path : path) : "") + (key ? "=" + key : "");
}
__name(parseEvent, "parseEvent");

// node_modules/postgres/cf/src/large.js
import Stream2 from "node:stream";
function largeObject(sql, oid, mode = 131072 | 262144) {
  return new Promise(async (resolve, reject) => {
    await sql.begin(async (sql2) => {
      let finish;
      !oid && ([{ oid }] = await sql2`select lo_creat(-1) as oid`);
      const [{ fd }] = await sql2`select lo_open(${oid}, ${mode}) as fd`;
      const lo = {
        writable,
        readable,
        close: /* @__PURE__ */ __name(() => sql2`select lo_close(${fd})`.then(finish), "close"),
        tell: /* @__PURE__ */ __name(() => sql2`select lo_tell64(${fd})`, "tell"),
        read: /* @__PURE__ */ __name((x) => sql2`select loread(${fd}, ${x}) as data`, "read"),
        write: /* @__PURE__ */ __name((x) => sql2`select lowrite(${fd}, ${x})`, "write"),
        truncate: /* @__PURE__ */ __name((x) => sql2`select lo_truncate64(${fd}, ${x})`, "truncate"),
        seek: /* @__PURE__ */ __name((x, whence = 0) => sql2`select lo_lseek64(${fd}, ${x}, ${whence})`, "seek"),
        size: /* @__PURE__ */ __name(() => sql2`
          select
            lo_lseek64(${fd}, location, 0) as position,
            seek.size
          from (
            select
              lo_lseek64($1, 0, 2) as size,
              tell.location
            from (select lo_tell64($1) as location) tell
          ) seek
        `, "size")
      };
      resolve(lo);
      return new Promise(async (r) => finish = r);
      async function readable({
        highWaterMark = 2048 * 8,
        start = 0,
        end = Infinity
      } = {}) {
        let max = end - start;
        start && await lo.seek(start);
        return new Stream2.Readable({
          highWaterMark,
          async read(size2) {
            const l = size2 > max ? size2 - max : size2;
            max -= size2;
            const [{ data }] = await lo.read(l);
            this.push(data);
            if (data.length < size2)
              this.push(null);
          }
        });
      }
      __name(readable, "readable");
      async function writable({
        highWaterMark = 2048 * 8,
        start = 0
      } = {}) {
        start && await lo.seek(start);
        return new Stream2.Writable({
          highWaterMark,
          write(chunk, encoding, callback) {
            lo.write(chunk).then(() => callback(), callback);
          }
        });
      }
      __name(writable, "writable");
    }).catch(reject);
  });
}
__name(largeObject, "largeObject");

// node_modules/postgres/cf/src/index.js
Object.assign(Postgres, {
  PostgresError,
  toPascal,
  pascal,
  toCamel,
  camel,
  toKebab,
  kebab,
  fromPascal,
  fromCamel,
  fromKebab,
  BigInt: {
    to: 20,
    from: [20],
    parse: /* @__PURE__ */ __name((x) => BigInt(x), "parse"),
    // eslint-disable-line
    serialize: /* @__PURE__ */ __name((x) => x.toString(), "serialize")
  }
});
var src_default = Postgres;
function Postgres(a, b2) {
  const options = parseOptions(a, b2), subscribe = options.no_subscribe || Subscribe(Postgres, { ...options });
  let ending = false;
  const queries = queue_default(), connecting = queue_default(), reserved = queue_default(), closed = queue_default(), ended = queue_default(), open = queue_default(), busy = queue_default(), full = queue_default(), queues = { connecting, reserved, closed, ended, open, busy, full };
  const connections = [...Array(options.max)].map(() => connection_default(options, queues, { onopen, onend, onclose }));
  const sql = Sql(handler);
  Object.assign(sql, {
    get parameters() {
      return options.parameters;
    },
    largeObject: largeObject.bind(null, sql),
    subscribe,
    CLOSE,
    END: CLOSE,
    PostgresError,
    options,
    reserve,
    listen,
    begin,
    close,
    end
  });
  return sql;
  function Sql(handler2) {
    handler2.debug = options.debug;
    Object.entries(options.types).reduce((acc, [name, type]) => {
      acc[name] = (x) => new Parameter(x, type.to);
      return acc;
    }, typed);
    Object.assign(sql2, {
      types: typed,
      typed,
      unsafe,
      notify,
      array,
      json: json2,
      file
    });
    return sql2;
    function typed(value, type) {
      return new Parameter(value, type);
    }
    __name(typed, "typed");
    function sql2(strings, ...args) {
      const query = strings && Array.isArray(strings.raw) ? new Query(strings, args, handler2, cancel) : typeof strings === "string" && !args.length ? new Identifier(options.transform.column.to ? options.transform.column.to(strings) : strings) : new Builder(strings, args);
      return query;
    }
    __name(sql2, "sql");
    function unsafe(string, args = [], options2 = {}) {
      arguments.length === 2 && !Array.isArray(args) && (options2 = args, args = []);
      const query = new Query([string], args, handler2, cancel, {
        prepare: false,
        ...options2,
        simple: "simple" in options2 ? options2.simple : args.length === 0
      });
      return query;
    }
    __name(unsafe, "unsafe");
    function file(path, args = [], options2 = {}) {
      arguments.length === 2 && !Array.isArray(args) && (options2 = args, args = []);
      const query = new Query([], args, (query2) => {
        fs.readFile(path, "utf8", (err, string) => {
          if (err)
            return query2.reject(err);
          query2.strings = [string];
          handler2(query2);
        });
      }, cancel, {
        ...options2,
        simple: "simple" in options2 ? options2.simple : args.length === 0
      });
      return query;
    }
    __name(file, "file");
  }
  __name(Sql, "Sql");
  async function listen(name, fn, onlisten) {
    const listener = { fn, onlisten };
    const sql2 = listen.sql || (listen.sql = Postgres({
      ...options,
      max: 1,
      idle_timeout: null,
      max_lifetime: null,
      fetch_types: false,
      onclose() {
        Object.entries(listen.channels).forEach(([name2, { listeners }]) => {
          delete listen.channels[name2];
          Promise.all(listeners.map((l) => listen(name2, l.fn, l.onlisten).catch(() => {
          })));
        });
      },
      onnotify(c, x) {
        c in listen.channels && listen.channels[c].listeners.forEach((l) => l.fn(x));
      }
    }));
    const channels = listen.channels || (listen.channels = {}), exists = name in channels;
    if (exists) {
      channels[name].listeners.push(listener);
      const result2 = await channels[name].result;
      listener.onlisten && listener.onlisten();
      return { state: result2.state, unlisten };
    }
    channels[name] = { result: sql2`listen ${sql2.unsafe('"' + name.replace(/"/g, '""') + '"')}`, listeners: [listener] };
    const result = await channels[name].result;
    listener.onlisten && listener.onlisten();
    return { state: result.state, unlisten };
    async function unlisten() {
      if (name in channels === false)
        return;
      channels[name].listeners = channels[name].listeners.filter((x) => x !== listener);
      if (channels[name].listeners.length)
        return;
      delete channels[name];
      return sql2`unlisten ${sql2.unsafe('"' + name.replace(/"/g, '""') + '"')}`;
    }
    __name(unlisten, "unlisten");
  }
  __name(listen, "listen");
  async function notify(channel, payload) {
    return await sql`select pg_notify(${channel}, ${"" + payload})`;
  }
  __name(notify, "notify");
  async function reserve() {
    const queue = queue_default();
    const c = open.length ? open.shift() : await new Promise((resolve, reject) => {
      const query = { reserve: resolve, reject };
      queries.push(query);
      closed.length && connect(closed.shift(), query);
    });
    move(c, reserved);
    c.reserved = () => queue.length ? c.execute(queue.shift()) : move(c, reserved);
    c.reserved.release = true;
    const sql2 = Sql(handler2);
    sql2.release = () => {
      c.reserved = null;
      onopen(c);
    };
    return sql2;
    function handler2(q) {
      c.queue === full ? queue.push(q) : c.execute(q) || move(c, full);
    }
    __name(handler2, "handler");
  }
  __name(reserve, "reserve");
  async function begin(options2, fn) {
    !fn && (fn = options2, options2 = "");
    const queries2 = queue_default();
    let savepoints = 0, connection2, prepare = null;
    try {
      await sql.unsafe("begin " + options2.replace(/[^a-z ]/ig, ""), [], { onexecute }).execute();
      return await Promise.race([
        scope(connection2, fn),
        new Promise((_, reject) => connection2.onclose = reject)
      ]);
    } catch (error) {
      throw error;
    }
    async function scope(c, fn2, name) {
      const sql2 = Sql(handler2);
      sql2.savepoint = savepoint;
      sql2.prepare = (x) => prepare = x.replace(/[^a-z0-9$-_. ]/gi);
      let uncaughtError, result;
      name && await sql2`savepoint ${sql2(name)}`;
      try {
        result = await new Promise((resolve, reject) => {
          const x = fn2(sql2);
          Promise.resolve(Array.isArray(x) ? Promise.all(x) : x).then(resolve, reject);
        });
        if (uncaughtError)
          throw uncaughtError;
      } catch (e) {
        await (name ? sql2`rollback to ${sql2(name)}` : sql2`rollback`);
        throw e instanceof PostgresError && e.code === "25P02" && uncaughtError || e;
      }
      if (!name) {
        prepare ? await sql2`prepare transaction '${sql2.unsafe(prepare)}'` : await sql2`commit`;
      }
      return result;
      function savepoint(name2, fn3) {
        if (name2 && Array.isArray(name2.raw))
          return savepoint((sql3) => sql3.apply(sql3, arguments));
        arguments.length === 1 && (fn3 = name2, name2 = null);
        return scope(c, fn3, "s" + savepoints++ + (name2 ? "_" + name2 : ""));
      }
      __name(savepoint, "savepoint");
      function handler2(q) {
        q.catch((e) => uncaughtError || (uncaughtError = e));
        c.queue === full ? queries2.push(q) : c.execute(q) || move(c, full);
      }
      __name(handler2, "handler");
    }
    __name(scope, "scope");
    function onexecute(c) {
      connection2 = c;
      move(c, reserved);
      c.reserved = () => queries2.length ? c.execute(queries2.shift()) : move(c, reserved);
    }
    __name(onexecute, "onexecute");
  }
  __name(begin, "begin");
  function move(c, queue) {
    c.queue.remove(c);
    queue.push(c);
    c.queue = queue;
    queue === open ? c.idleTimer.start() : c.idleTimer.cancel();
    return c;
  }
  __name(move, "move");
  function json2(x) {
    return new Parameter(x, 3802);
  }
  __name(json2, "json");
  function array(x, type) {
    if (!Array.isArray(x))
      return array(Array.from(arguments));
    return new Parameter(x, type || (x.length ? inferType(x) || 25 : 0), options.shared.typeArrayMap);
  }
  __name(array, "array");
  function handler(query) {
    if (ending)
      return query.reject(Errors.connection("CONNECTION_ENDED", options, options));
    if (open.length)
      return go(open.shift(), query);
    if (closed.length)
      return connect(closed.shift(), query);
    busy.length ? go(busy.shift(), query) : queries.push(query);
  }
  __name(handler, "handler");
  function go(c, query) {
    return c.execute(query) ? move(c, busy) : move(c, full);
  }
  __name(go, "go");
  function cancel(query) {
    return new Promise((resolve, reject) => {
      query.state ? query.active ? connection_default(options).cancel(query.state, resolve, reject) : query.cancelled = { resolve, reject } : (queries.remove(query), query.cancelled = true, query.reject(Errors.generic("57014", "canceling statement due to user request")), resolve());
    });
  }
  __name(cancel, "cancel");
  async function end({ timeout = null } = {}) {
    if (ending)
      return ending;
    await 1;
    let timer2;
    return ending = Promise.race([
      new Promise((r) => timeout !== null && (timer2 = setTimeout(destroy, timeout * 1e3, r))),
      Promise.all(connections.map((c) => c.end()).concat(
        listen.sql ? listen.sql.end({ timeout: 0 }) : [],
        subscribe.sql ? subscribe.sql.end({ timeout: 0 }) : []
      ))
    ]).then(() => clearTimeout(timer2));
  }
  __name(end, "end");
  async function close() {
    await Promise.all(connections.map((c) => c.end()));
  }
  __name(close, "close");
  async function destroy(resolve) {
    await Promise.all(connections.map((c) => c.terminate()));
    while (queries.length)
      queries.shift().reject(Errors.connection("CONNECTION_DESTROYED", options));
    resolve();
  }
  __name(destroy, "destroy");
  function connect(c, query) {
    move(c, connecting);
    c.connect(query);
    return c;
  }
  __name(connect, "connect");
  function onend(c) {
    move(c, ended);
  }
  __name(onend, "onend");
  function onopen(c) {
    if (queries.length === 0)
      return move(c, open);
    let max = Math.ceil(queries.length / (connecting.length + 1)), ready = true;
    while (ready && queries.length && max-- > 0) {
      const query = queries.shift();
      if (query.reserve)
        return query.reserve(c);
      ready = c.execute(query);
    }
    ready ? move(c, busy) : move(c, full);
  }
  __name(onopen, "onopen");
  function onclose(c, e) {
    move(c, closed);
    c.reserved = null;
    c.onclose && (c.onclose(e), c.onclose = null);
    options.onclose && options.onclose(c.id);
    queries.length && connect(c, queries.shift());
  }
  __name(onclose, "onclose");
}
__name(Postgres, "Postgres");
function parseOptions(a, b2) {
  if (a && a.shared)
    return a;
  const env = process.env, o = (!a || typeof a === "string" ? b2 : a) || {}, { url, multihost } = parseUrl(a), query = [...url.searchParams].reduce((a2, [b3, c]) => (a2[b3] = c, a2), {}), host = o.hostname || o.host || multihost || url.hostname || env.PGHOST || "localhost", port = o.port || url.port || env.PGPORT || 5432, user = o.user || o.username || url.username || env.PGUSERNAME || env.PGUSER || osUsername();
  o.no_prepare && (o.prepare = false);
  query.sslmode && (query.ssl = query.sslmode, delete query.sslmode);
  "timeout" in o && (console.log("The timeout option is deprecated, use idle_timeout instead"), o.idle_timeout = o.timeout);
  query.sslrootcert === "system" && (query.ssl = "verify-full");
  const ints = ["idle_timeout", "connect_timeout", "max_lifetime", "max_pipeline", "backoff", "keep_alive"];
  const defaults = {
    max: globalThis.Cloudflare ? 3 : 10,
    ssl: false,
    sslnegotiation: null,
    idle_timeout: null,
    connect_timeout: 30,
    max_lifetime,
    max_pipeline: 100,
    backoff,
    keep_alive: 60,
    prepare: true,
    debug: false,
    fetch_types: true,
    publications: "alltables",
    target_session_attrs: null
  };
  return {
    host: Array.isArray(host) ? host : host.split(",").map((x) => x.split(":")[0]),
    port: Array.isArray(port) ? port : host.split(",").map((x) => parseInt(x.split(":")[1] || port)),
    path: o.path || host.indexOf("/") > -1 && host + "/.s.PGSQL." + port,
    database: o.database || o.db || (url.pathname || "").slice(1) || env.PGDATABASE || user,
    user,
    pass: o.pass || o.password || url.password || env.PGPASSWORD || "",
    ...Object.entries(defaults).reduce(
      (acc, [k, d]) => {
        const value = k in o ? o[k] : k in query ? query[k] === "disable" || query[k] === "false" ? false : query[k] : env["PG" + k.toUpperCase()] || d;
        acc[k] = typeof value === "string" && ints.includes(k) ? +value : value;
        return acc;
      },
      {}
    ),
    connection: {
      application_name: env.PGAPPNAME || "postgres.js",
      ...o.connection,
      ...Object.entries(query).reduce((acc, [k, v]) => (k in defaults || (acc[k] = v), acc), {})
    },
    types: o.types || {},
    target_session_attrs: tsa(o, url, env),
    onnotice: o.onnotice,
    onnotify: o.onnotify,
    onclose: o.onclose,
    onparameter: o.onparameter,
    socket: o.socket,
    transform: parseTransform(o.transform || { undefined: void 0 }),
    parameters: {},
    shared: { retries: 0, typeArrayMap: {} },
    ...mergeUserTypes(o.types)
  };
}
__name(parseOptions, "parseOptions");
function tsa(o, url, env) {
  const x = o.target_session_attrs || url.searchParams.get("target_session_attrs") || env.PGTARGETSESSIONATTRS;
  if (!x || ["read-write", "read-only", "primary", "standby", "prefer-standby"].includes(x))
    return x;
  throw new Error("target_session_attrs " + x + " is not supported");
}
__name(tsa, "tsa");
function backoff(retries) {
  return (0.5 + Math.random() / 2) * Math.min(3 ** retries / 100, 20);
}
__name(backoff, "backoff");
function max_lifetime() {
  return 60 * (30 + Math.random() * 30);
}
__name(max_lifetime, "max_lifetime");
function parseTransform(x) {
  return {
    undefined: x.undefined,
    column: {
      from: typeof x.column === "function" ? x.column : x.column && x.column.from,
      to: x.column && x.column.to
    },
    value: {
      from: typeof x.value === "function" ? x.value : x.value && x.value.from,
      to: x.value && x.value.to
    },
    row: {
      from: typeof x.row === "function" ? x.row : x.row && x.row.from,
      to: x.row && x.row.to
    }
  };
}
__name(parseTransform, "parseTransform");
function parseUrl(url) {
  if (!url || typeof url !== "string")
    return { url: { searchParams: /* @__PURE__ */ new Map() } };
  let host = url;
  host = host.slice(host.indexOf("://") + 3).split(/[?/]/)[0];
  host = decodeURIComponent(host.slice(host.indexOf("@") + 1));
  const urlObj = new URL(url.replace(host, host.split(",")[0]));
  return {
    url: {
      username: decodeURIComponent(urlObj.username),
      password: decodeURIComponent(urlObj.password),
      host: urlObj.host,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      searchParams: urlObj.searchParams
    },
    multihost: host.indexOf(",") > -1 && host
  };
}
__name(parseUrl, "parseUrl");
function osUsername() {
  try {
    return os.userInfo().username;
  } catch (_) {
    return process.env.USERNAME || process.env.USER || process.env.LOGNAME;
  }
}
__name(osUsername, "osUsername");

// src/auth.js
var encoder = new TextEncoder();
function toBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
__name(toBase64Url, "toBase64Url");
function fromBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  try {
    const binary = atob(normalized);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch {
    return null;
  }
}
__name(fromBase64Url, "fromBase64Url");
function randomToken(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}
__name(randomToken, "randomToken");
async function sha2562(value) {
  return toBase64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))));
}
__name(sha2562, "sha256");
async function hashPassword(password, salt = randomToken(16), iterations = 1e5) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: encoder.encode(salt), iterations },
    key,
    256
  );
  return { hash: toBase64Url(new Uint8Array(bits)), salt, iterations };
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, expectedHash, salt, iterations) {
  const actual = await hashPassword(password, salt, iterations);
  const left = fromBase64Url(actual.hash);
  const right = fromBase64Url(expectedHash);
  if (!left || !right || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}
__name(verifyPassword, "verifyPassword");
async function signAccessToken(payload, secret, lifetimeSeconds = 900) {
  const now = Math.floor(Date.now() / 1e3);
  const header = toBase64Url(encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = toBase64Url(encoder.encode(JSON.stringify({ ...payload, iat: now, exp: now + lifetimeSeconds })));
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${header}.${body}`));
  return `${header}.${body}.${toBase64Url(new Uint8Array(signature))}`;
}
__name(signAccessToken, "signAccessToken");
async function verifyAccessToken(token, secret) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  try {
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(parts[2]),
      encoder.encode(`${parts[0]}.${parts[1]}`)
    );
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(parts[1])));
    if (!payload.sub || !payload.org || !payload.exp || payload.exp <= Math.floor(Date.now() / 1e3)) return null;
    return payload;
  } catch {
    return null;
  }
}
__name(verifyAccessToken, "verifyAccessToken");

// src/index.js
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders }
  });
}
__name(json, "json");
function operationalEvent(severity, code, details = {}) {
  const event = JSON.stringify({ type: "lenspirecrm.operation", severity, code, time: (/* @__PURE__ */ new Date()).toISOString(), ...details });
  if (severity === "error") console.error(event);
  else if (severity === "warning") console.warn(event);
  else console.log(event);
}
__name(operationalEvent, "operationalEvent");
function html(content, status = 200) {
  return new Response(content, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff"
    }
  });
}
__name(html, "html");
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
__name(escapeHtml, "escapeHtml");
async function encryptionKey(encodedKey, usages) {
  const raw = Uint8Array.from(atob(encodedKey || ""), (char) => char.charCodeAt(0));
  if (raw.length !== 32) throw new Error("DRIVE_TOKEN_KEY is not configured correctly");
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, usages);
}
__name(encryptionKey, "encryptionKey");
function productionConfigurationStatus(env) {
  let driveKeyValid = false;
  try {
    driveKeyValid = Uint8Array.from(atob(env.DRIVE_TOKEN_KEY || ""), (char) => char.charCodeAt(0)).length === 32;
  } catch {}
  const checks = {
    database: Boolean(env.CRM_DB?.connectionString),
    jwtSecret: typeof env.JWT_SECRET === "string" && env.JWT_SECRET.length >= 32,
    assetStorage: Boolean(env.STUDIO_ASSETS),
    driveEncryptionKey: driveKeyValid,
    googleClientId: Boolean(env.GOOGLE_CLIENT_ID),
    googleClientSecret: Boolean(env.GOOGLE_CLIENT_SECRET)
  };
  return {
    ok: Object.values(checks).every(Boolean),
    checks,
     optional: { backupEncryptionKey: Boolean(env.BACKUP_ENCRYPTION_KEY) && (() => { try { return Uint8Array.from(atob(env.BACKUP_ENCRYPTION_KEY || ""), (c) => c.charCodeAt(0)).length === 32; } catch { return false; } })() },
    setupTokenPresent: Boolean(env.SETUP_TOKEN),
    recommendation: env.SETUP_TOKEN ? "Remove or rotate SETUP_TOKEN after confirming owner recovery procedures." : null
  };
}
__name(productionConfigurationStatus, "productionConfigurationStatus");
async function encryptSecret(value, encodedKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await encryptionKey(encodedKey, ["encrypt"]);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(value)));
  const encode = /* @__PURE__ */ __name((bytes) => btoa(String.fromCharCode(...bytes)), "encode");
  return { iv: encode(iv), ciphertext: encode(encrypted) };
}
__name(encryptSecret, "encryptSecret");
async function googleConnect(request, env) {
  const sql = getDatabase(env);
  try {
    const user = await requireUser(request, env, sql);
if (!user) return json({ error: "Authentication required" }, 401);

const org = user.organization_id;

if (!canWriteSales(user)) return json({ error: "Sales write access required" }, 403);
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.DRIVE_TOKEN_KEY) return json({ error: "Google Drive OAuth is not configured" }, 503);
    const origin = new URL(request.url).origin;
    const state = await signAccessToken({ sub: user.id, org: user.organization_id, role: user.role, purpose: "google-drive" }, env.JWT_SECRET, 600);
    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: `${origin}/api/google/callback`,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/drive.file",
      access_type: "offline",
      prompt: "consent",
      state
    });
    return json({ authorizationUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
  } finally {
    await closeDatabase(sql);
  }
}
__name(googleConnect, "googleConnect");
async function googleCallback(request, env) {
  const url = new URL(request.url);
  if (url.searchParams.get("error")) return html("<h1>Google Drive connection cancelled</h1><p>You can close this window and try again from LenspireCRM.</p>", 400);
  const claims = await verifyAccessToken(url.searchParams.get("state"), env.JWT_SECRET);
  if (!claims || claims.purpose !== "google-drive" || claims.role !== "Administrator") return html("<h1>Invalid or expired connection request</h1>", 403);
  const code = url.searchParams.get("code");
  if (!code) return html("<h1>Google did not return an authorization code</h1>", 400);
  const origin = url.origin;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET, redirect_uri: `${origin}/api/google/callback`, grant_type: "authorization_code" })
  });
  const tokens = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !tokens.refresh_token) {
    const description = tokens.error_description || (tokenResponse.ok ? "Google did not return a refresh token" : "Google OAuth failed with HTTP " + tokenResponse.status);
    const isConfigIssue = /invalid_client|client secret|redirect_uri/i.test(description);
    const title = isConfigIssue ? "Google Drive configuration error" : "Google Drive connection failed";
    const detail = isConfigIssue ? "The LenspireCRM administrator needs to update the GOOGLE_CLIENT_SECRET (and verify the redirect URI) on the Cloudflare Worker, then try connecting again." : "You can close this window and try again from LenspireCRM.";
    return html('<!doctype html><html><head><meta charset="utf-8"><title>' + title + '</title></head><body style="font:16px system-ui;padding:40px;background:#0b1220;color:#e5edf8"><h1>' + title + "</h1><p>" + escapeHtml(description) + "</p><p>" + detail + "</p></body></html>", 502);
  }
  const folderResponse = await fetch("https://www.googleapis.com/drive/v3/files?fields=id,name", {
    method: "POST",
    headers: { authorization: `Bearer ${tokens.access_token}`, "content-type": "application/json" },
    body: JSON.stringify({ name: "LenspireCRM", mimeType: "application/vnd.google-apps.folder" })
  });
  const folder = await folderResponse.json();
  if (!folderResponse.ok) throw new Error(folder.error?.message || "Could not create the LenspireCRM Drive folder");
  const encrypted = await encryptSecret(tokens.refresh_token, env.DRIVE_TOKEN_KEY);
  const sql = getDatabase(env);
  try {
    await ensureCloudSchemaReady(sql);
    await sql`
      insert into integrations (organization_id,provider,encrypted_credentials,settings,connected_by)
      values (${claims.org},'google_drive',${encrypted}::jsonb,${{ folderId: folder.id, folderName: folder.name }}::jsonb,${claims.sub})
      on conflict (organization_id,provider) do update set encrypted_credentials=excluded.encrypted_credentials,settings=excluded.settings,connected_by=excluded.connected_by,updated_at=now()
    `;
  } finally {
    await closeDatabase(sql);
  }
  return html('<!doctype html><html><head><meta charset="utf-8"><title>Google Drive connected</title></head><body style="font:16px system-ui;padding:40px;background:#0b1220;color:#e5edf8"><h1>Google Drive connected</h1><p>The LenspireCRM folder was created successfully. You can close this window and return to the desktop app.</p></body></html>');
}
__name(googleCallback, "googleCallback");
var setupPage = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>LenspireCRM Owner Setup</title><style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1220;color:#e5edf8;font:15px system-ui,sans-serif}.card{width:min(460px,calc(100% - 32px));background:#121c2f;border:1px solid #263653;border-radius:18px;padding:28px;box-shadow:0 24px 70px #0008}h1{margin:0 0 8px;font-size:25px}p{color:#9eb0ca;line-height:1.5}label{display:block;margin:16px 0 6px;font-weight:650}input{width:100%;padding:12px 13px;border:1px solid #344867;border-radius:9px;background:#0c1526;color:#fff;font:inherit}button{width:100%;margin-top:20px;padding:13px;border:0;border-radius:9px;background:#3b82f6;color:#fff;font-weight:750;cursor:pointer}button:disabled{opacity:.55}.message{min-height:22px;margin-top:14px}.ok{color:#67e8a5}.error{color:#fca5a5}</style></head>
<body><main class="card"><h1>Create the LenspireCRM owner</h1><p>This one-time page creates the first production administrator. Use a unique password with at least 12 characters, uppercase, lowercase, a number, and a symbol.</p>
<form id="setup"><label>Display name</label><input name="displayName" value="Sandeep Jadhav" maxlength="80" required><label>Username</label><input name="username" value="admin" minlength="3" maxlength="30" pattern="[A-Za-z0-9._-]+" required><label>Password</label><input name="password" type="password" minlength="12" autocomplete="new-password" required><label>Confirm password</label><input name="confirmPassword" type="password" minlength="12" autocomplete="new-password" required><button>Create owner account</button><div id="message" class="message" role="status"></div></form></main>
<script>const token=decodeURIComponent(location.hash.slice(1));history.replaceState(null,'',location.pathname);const form=document.querySelector('#setup'),message=document.querySelector('#message');form.addEventListener('submit',async event=>{event.preventDefault();message.textContent='';message.className='message';const values=Object.fromEntries(new FormData(form));if(values.password!==values.confirmPassword){message.textContent='Passwords do not match.';message.classList.add('error');return}const button=form.querySelector('button');button.disabled=true;try{const response=await fetch('/api/setup',{method:'POST',headers:{'content-type':'application/json','x-setup-token':token},body:JSON.stringify(values)});const contentType=response.headers.get('content-type')||'';const result=contentType.includes('application/json')?await response.json():{error:'The server returned an unexpected response (HTTP '+response.status+'). Please reload this page and try again.'};if(!response.ok)throw new Error(result.error||'Setup failed');form.reset();message.textContent='Owner account created. This setup page is now disabled.';message.classList.add('ok')}catch(error){message.textContent=error.message;message.classList.add('error');button.disabled=false}});<\/script></body></html>`;
function getDatabase(env) {
  if (!env.CRM_DB?.connectionString) throw new Error("CRM_DB Hyperdrive binding is not configured");
  return src_default(env.CRM_DB.connectionString, { prepare: false, max: 1 });
}
__name(getDatabase, "getDatabase");
async function closeDatabase(sql) {
  try {
    await sql.end({ timeout: 1 });
  } catch (error) {
    console.error("Database disconnect error", error);
  }
}
__name(closeDatabase, "closeDatabase");
async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
__name(readJson, "readJson");
async function requireAccessClaims(request, env) {
  if (!env.JWT_SECRET) return null;
  const authorization = request.headers.get("authorization") || "";
  const cookies = Object.fromEntries(String(request.headers.get("cookie") || "").split(";").map(part => part.trim().split(/=(.*)/s).slice(0,2)).filter(([key]) => key));
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!bearer && request.method !== "GET" && request.headers.get("x-lenspire-web") !== "1") return null;
  const token = bearer || decodeURIComponent(cookies.lp_access || "");
  return verifyAccessToken(token, env.JWT_SECRET);
}
__name(requireAccessClaims, "requireAccessClaims");
async function requireUser(request, env, sql) {
  const claims = await requireAccessClaims(request, env);
  if (!claims) return null;
  return {
    id: claims.sub,
    organization_id: claims.org,
    username: claims.username || "",
    display_name: claims.name || "Cloud User",
    role: claims.role,
    password_upgrade_required: Boolean(claims.passwordUpgradeRequired),
    department_access: claims.access || normalizeDepartmentAccess(null, claims.role)
  };
}
__name(requireUser, "requireUser");
function licenseRestriction(profile) {
  if (!profile || String(profile.status || "active").toLowerCase() === "active" && !profile.subscription_expires_at) return null;
  if (String(profile.status || "active").toLowerCase() !== "active") return { code: "studio_paused", message: "This studio workspace is paused. Please contact LenspireCRM to renew access." };
  const expiry = String(profile.subscription_expires_at || "").slice(0, 10);
  if (expiry && expiry < (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)) return { code: "subscription_expired", message: `This studio subscription expired on ${expiry}. Please contact LenspireCRM to renew access.` };
  return null;
}
__name(licenseRestriction, "licenseRestriction");
async function studioLicenseRestriction(sql, organizationId) {
  const [profile] = await sql`select status, subscription_expires_at from organization_profiles where organization_id=${organizationId} limit 1`;
  return licenseRestriction(profile);
}
__name(studioLicenseRestriction, "studioLicenseRestriction");
function canWriteSales(user) {
  return user?.role === "Administrator" || normalizeDepartmentAccess(user?.department_access, user?.role).sales === "full";
}
__name(canWriteSales, "canWriteSales");
function leadInput(body) {
  const value = /* @__PURE__ */ __name((camel2, snake = camel2) => body?.[camel2] ?? body?.[snake] ?? null, "value");
  const amount = /* @__PURE__ */ __name((name) => {
    const raw = value(name, name.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`));
    return raw === "" || raw == null ? null : Number(raw);
  }, "amount");
  return {
    name: String(value("name") || "").trim(),
    eventType: String(value("eventType", "event_type") || "").trim(),
    eventDate: value("eventDate", "event_date") || null,
    city: value("city"),
    source: value("source"),
    status: String(value("status") || "New"),
    budget: value("budget"),
    assignedTo: value("assignedTo", "assigned_to"),
    mobile: value("mobile"),
    priority: String(value("priority") || "Medium"),
    notes: value("notes"),
    nextFollowupAt: value("nextFollowupAt", "next_followup_at") || null,
    clientName: value("clientName", "client_name"),
    clientMobile: value("clientMobile", "client_mobile"),
    coupleName: value("coupleName", "couple_name"),
    weddingDates: value("weddingDates", "wedding_dates"),
    totalClosing: amount("totalClosing"),
    paymentMode: value("paymentMode", "payment_mode"),
    advanceReceived: amount("advanceReceived"),
    receivedBy: value("receivedBy", "received_by"),
    paymentReceivedDate: value("paymentReceivedDate", "payment_received_date") || null,
    lostReason: value("lostReason", "lost_reason"),
    referredBy: value("referredBy", "referred_by"),
    referralCode: value("referralCode", "referral_code"),
    quotationPath: value("quotationPath", "quotation_path"),
    quotationName: value("quotationName", "quotation_name")
  };
}
__name(leadInput, "leadInput");
function productionSegments(eventType) {
  const type = String(eventType || "").trim().toLowerCase();
  const hasPreWedding = /pre[-\s]?wedding/.test(type);
  const hasSeparateWedding = hasPreWedding && (/\+|&|\band\b|,|\//.test(type) || /\bwedding\b/.test(type.replace(/pre[-\s]?wedding/g, "")));
  if (hasPreWedding && hasSeparateWedding) return ["Pre-wedding", "Wedding"];
  if (hasPreWedding) return ["Pre-wedding"];
  return ["Wedding"];
}
async function leadsApi(request, env, pathname) {
  const sql = getDatabase(env);
  try {
    const user = await requireUser(request, env, sql);
    if (!user) return json({ error: "Authentication required" }, 401);
    const convertMatch = pathname.match(/^\/api\/leads\/([0-9a-f-]{36})\/convert$/i);
    if (request.method === "POST" && convertMatch) {
      if (!canWriteSales(user)) return json({ error: "Sales write access required" }, 403);
      await ensureCloudSchemaReady(sql);
      const leadId = convertMatch[1];
      let converted;
      await sql.begin(async (tx) => {
        const leadRows = await tx`select * from leads where id=${leadId} and organization_id=${user.organization_id} limit 1`;
        const lead = leadRows[0];
        if (!lead) throw new Error("Lead not found");
        let customerRows = await tx`select * from customers where lead_id=${leadId} and organization_id=${user.organization_id} limit 1`;
        if (!customerRows.length) customerRows = await tx`insert into customers (organization_id,customer_code,lead_id,name,phone,city,source) values (${user.organization_id},${"C-"+leadId.slice(0,8).toUpperCase()},${leadId},${lead.name},${lead.mobile||null},${lead.city||null},${lead.source||null}) returning *`;
        const customer = customerRows[0];
        let bookingRows = await tx`select * from bookings where lead_id=${leadId} and organization_id=${user.organization_id} limit 1`;
        const quoted = Number(String(lead.total_closing||lead.budget||0).replace(/[^0-9.]/g,""))||0;
        if (!bookingRows.length) bookingRows = await tx`insert into bookings (organization_id,booking_code,customer_id,lead_id,event_type,event_date,city,package_name,quoted_amount,status) values (${user.organization_id},${"B-"+leadId.slice(0,8).toUpperCase()},${customer.id},${leadId},${lead.event_type||"Other"},${lead.event_date||null},${lead.city||null},${"Custom Package"},${quoted},${"Confirmed"}) returning *`;
        const booking = bookingRows[0];
        const eventDate = lead.event_date || new Date().toISOString().slice(0, 10);
let eventRows = await tx`
  select * from calendar_events
  where booking_id=${booking.id} and organization_id=${user.organization_id}
  limit 1
`;
if (!eventRows.length) eventRows = await tx`
  insert into calendar_events (
    organization_id, booking_id, customer_id, title, event_type, start_date,
    city, status, notes, client_name, handled_by, couple_name, contact_no,
    slotted, date_status
  ) values (
    ${user.organization_id}, ${booking.id}, ${customer.id},
    ${`${lead.name || "Client"} · ${lead.event_type || "Event"}`},
    ${lead.event_type || "Shoot"}, ${eventDate}, ${lead.city || null},
    ${"Scheduled"}, ${lead.notes || null}, ${lead.client_name || lead.name || null},
    ${lead.assigned_to || null}, ${lead.couple_name || null},
    ${lead.mobile || lead.client_mobile || null}, ${false}, ${"Confirmed"}
  ) returning *
`;
const calendarEvent = eventRows[0];

for (const eventSegment of productionSegments(lead.event_type)) {
  await tx`insert into production_jobs (organization_id,booking_id,customer_id,event_segment,stage,raw_status,editing_status,album_status,video_status,delivery_status,due_date) values (${user.organization_id},${booking.id},${customer.id},${eventSegment},${"Shoot Planning"},${"Pending"},${"Not Started"},${"Not Started"},${"Not Started"},${"Pending"},${lead.event_date||null}) on conflict (booking_id,event_segment) do nothing`;
}
const paymentRows = await tx`select id from payments where booking_id=${booking.id} and organization_id=${user.organization_id} limit 1`;
if (quoted > 0 && !paymentRows.length) {
  const advanceReceived = Math.min(quoted, Number(lead.advance_received) || 0);
  const advanceAmount = Math.round(quoted * 0.10);
  const firstShootAmount = Math.round(quoted * 0.40);
  const weddingAmount = Math.round(quoted * 0.40);
  const schedule = [
    { type: "Advance", amount: advanceReceived > 0 ? advanceReceived : advanceAmount, status: advanceReceived > 0 ? "Paid" : "Pending", dueDate: lead.payment_received_date || lead.event_date || null, paidAt: advanceReceived > 0 ? lead.payment_received_date || new Date().toISOString() : null, mode: lead.payment_mode || null, receivedBy: lead.received_by || null, notes: "10% booking advance" },
    { type: "First Shoot", amount: firstShootAmount, status: "Pending", dueDate: lead.event_date || null, paidAt: null, mode: null, receivedBy: null, notes: "40% due at first shoot" },
    { type: "Wedding Day", amount: weddingAmount, status: "Pending", dueDate: lead.event_date || null, paidAt: null, mode: null, receivedBy: null, notes: "40% due on wedding day" },
    { type: "Final Delivery", amount: quoted - advanceAmount - firstShootAmount - weddingAmount, status: "Pending", dueDate: null, paidAt: null, mode: null, receivedBy: null, notes: "10% due on final delivery" }
  ];
  for (const installment of schedule) await tx`
    insert into payments (organization_id,booking_id,customer_id,amount,payment_type,status,due_date,paid_at,payment_mode,received_by,notes)
    values (${user.organization_id},${booking.id},${customer.id},${installment.amount},${installment.type},${installment.status},${installment.dueDate},${installment.paidAt},${installment.mode},${installment.receivedBy},${installment.notes})
  `;
}
await tx`update leads set status=${"Confirmed"} where id=${leadId} and organization_id=${user.organization_id}`;
converted = { customerId: customer.id, bookingId: booking.id, eventId: calendarEvent.id, customerCode: customer.customer_code, bookingCode: booking.booking_code };
      });
      return json({ success: true, converted });
    }
    if (request.method === "POST" && pathname === "/api/leads/import") {
      if (!canWriteSales(user)) return json({ error: "Sales write access required" }, 403);
      const body = await readJson(request);
      if (!Array.isArray(body?.leads) || body.leads.length > 200) return json({ error: "Provide up to 200 leads per request" }, 400);
      let imported = 0, skipped = 0;
      const confirmedLeadIds = [];
      await sql.begin(async (transaction) => {
        for (const source of body.leads) {
          const input = leadInput(source);
          const leadCode = String(source?.lead_code || source?.leadCode || "").trim() || "LD-IMP-" + Date.now().toString(36).toUpperCase() + "-" + randomToken(4).toUpperCase();
          if (!input.name || !input.eventType) {
            skipped++;
            continue;
          }
          const rows = await transaction`
            insert into leads (organization_id, lead_code, name, event_type, event_date, city, source, status, budget, assigned_to, mobile, priority, notes, next_followup_at, client_name, client_mobile, couple_name, wedding_dates, total_closing, payment_mode, advance_received, received_by, payment_received_date, lost_reason, quotation_path, quotation_name, referred_by, referral_code)
            values (${user.organization_id}, ${leadCode}, ${input.name}, ${input.eventType}, ${input.eventDate}, ${input.city}, ${input.source}, ${input.status}, ${input.budget}, ${input.assignedTo}, ${input.mobile}, ${input.priority}, ${input.notes}, ${input.nextFollowupAt}, ${input.clientName}, ${input.clientMobile}, ${input.coupleName}, ${input.weddingDates}, ${input.totalClosing}, ${input.paymentMode}, ${input.advanceReceived}, ${input.receivedBy}, ${input.paymentReceivedDate}, ${input.lostReason}, ${input.quotationPath}, ${input.quotationName}, ${input.referredBy}, ${input.referralCode})
            on conflict (organization_id, lead_code) do nothing returning id
          `;
          if (rows.length) {
            imported++;
            if (String(input.status).trim().toLowerCase() === "confirmed") confirmedLeadIds.push(rows[0].id);
          }
          else skipped++;
        }
      });
      const [{ count }] = await sql`select count(*)::int as count from leads where organization_id=${user.organization_id}`;
      return json({ ok: true, imported, skipped, confirmedLeadIds, cloudTotal: count });
    }
    const attachmentMatch = pathname.match(/^\/api\/leads\/([0-9a-f-]{36})\/attachment$/i);
    if (attachmentMatch && request.method === "PUT") {
      if (!canWriteSales(user)) return json({ error: "Sales write access required" }, 403);
      const body = await readJson(request);
      const [updated] = await sql`
        update leads set quotation_path=${body?.path || body?.quotationPath || null}, quotation_name=${body?.name || body?.quotationName || null}
        where id=${attachmentMatch[1]} and organization_id=${user.organization_id} returning *
      `;
      return updated ? json({ lead: updated }) : json({ error: "Lead not found" }, 404);
    }
    const match = pathname.match(/^\/api\/leads(?:\/([0-9a-f-]{36}))?$/i);
    if (!match) return json({ error: "Not found" }, 404);
    const leadId = match[1] || null;
    if (request.method === "GET" && !leadId) {
      const rows = await sql`select * from leads where organization_id = ${user.organization_id} order by created_at desc`;
      return json({ leads: rows });
    }
    if (request.method === "POST" && !leadId) {
      if (!canWriteSales(user)) return json({ error: "Sales write access required" }, 403);
      const input = leadInput(await readJson(request));
      if (!input.name || !input.eventType) return json({ error: "Name and event type are required" }, 400);
      const leadCode = `LD-${Date.now().toString(36).toUpperCase()}-${randomToken(3).toUpperCase()}`;
      const [created] = await sql`
        insert into leads (organization_id, lead_code, name, event_type, event_date, city, source, status, budget, assigned_to, mobile, priority, notes, next_followup_at, client_name, client_mobile, couple_name, wedding_dates, total_closing, payment_mode, advance_received, received_by, payment_received_date, lost_reason, quotation_path, quotation_name, referred_by, referral_code)
        values (${user.organization_id}, ${leadCode}, ${input.name}, ${input.eventType}, ${input.eventDate}, ${input.city}, ${input.source}, ${input.status}, ${input.budget}, ${input.assignedTo}, ${input.mobile}, ${input.priority}, ${input.notes}, ${input.nextFollowupAt}, ${input.clientName}, ${input.clientMobile}, ${input.coupleName}, ${input.weddingDates}, ${input.totalClosing}, ${input.paymentMode}, ${input.advanceReceived}, ${input.receivedBy}, ${input.paymentReceivedDate}, ${input.lostReason}, ${input.quotationPath}, ${input.quotationName}, ${input.referredBy}, ${input.referralCode}) returning *
      `;
      return json({ lead: created }, 201);
    }
    if (request.method === "PUT" && leadId) {
      if (!canWriteSales(user)) return json({ error: "Sales write access required" }, 403);
      const input = leadInput(await readJson(request));
      if (!input.name || !input.eventType) return json({ error: "Name and event type are required" }, 400);
      const [updated] = await sql`
        update leads set name=${input.name}, event_type=${input.eventType}, event_date=${input.eventDate}, city=${input.city}, source=${input.source}, status=${input.status}, budget=${input.budget}, assigned_to=${input.assignedTo}, mobile=${input.mobile}, priority=${input.priority}, notes=${input.notes}, next_followup_at=${input.nextFollowupAt}, client_name=${input.clientName}, client_mobile=${input.clientMobile}, couple_name=${input.coupleName}, wedding_dates=${input.weddingDates}, total_closing=${input.totalClosing}, payment_mode=${input.paymentMode}, advance_received=${input.advanceReceived}, received_by=${input.receivedBy}, payment_received_date=${input.paymentReceivedDate}, lost_reason=${input.lostReason}, quotation_path=${input.quotationPath}, quotation_name=${input.quotationName}, referred_by=${input.referredBy}, referral_code=${input.referralCode}
        where id=${leadId} and organization_id=${user.organization_id} returning *
      `;
      return updated ? json({ lead: updated }) : json({ error: "Lead not found" }, 404);
    }
    if (request.method === "DELETE" && leadId) {
      if (!canWriteSales(user)) return json({ error: "Sales write access required" }, 403);
      const org = user.organization_id;
      const [existing] = await sql`select id from leads where id=${leadId} and organization_id=${org} limit 1`;
      if (!existing) return json({ error: "Lead not found" }, 404);
      let deleted;
      await sql.begin(async (transaction) => {
        // A confirmed lead owns a connected customer/booking workflow. Remove
        // only that workflow, in foreign-key order, as one atomic operation.
        const bookingIds = transaction`select id from bookings where organization_id=${org} and (lead_id=${leadId} or customer_id in (select id from customers where organization_id=${org} and lead_id=${leadId}))`;
        const customerIds = transaction`select id from customers where organization_id=${org} and lead_id=${leadId}`;
        await transaction`delete from production_activity_log where organization_id=${org} and booking_id in (${bookingIds})`;
        await transaction`delete from client_portal_access_log where organization_id=${org} and booking_id in (${bookingIds})`;
        await transaction`delete from client_portal_access where organization_id=${org} and booking_id in (${bookingIds})`;
        await transaction`delete from production_jobs where organization_id=${org} and booking_id in (${bookingIds})`;
        await transaction`delete from payments where organization_id=${org} and booking_id in (${bookingIds})`;
        await transaction`delete from calendar_events where organization_id=${org} and (booking_id in (${bookingIds}) or customer_id in (${customerIds}))`;
        await transaction`delete from bookings where organization_id=${org} and id in (${bookingIds})`;
        await transaction`delete from customers where organization_id=${org} and id in (${customerIds})`;
        await transaction`delete from lead_activities where organization_id=${org} and lead_id=${leadId}`;
        [deleted] = await transaction`delete from leads where id=${leadId} and organization_id=${org} returning id`;
      });
      return deleted ? json({ ok: true, id: deleted.id }) : json({ error: "Lead not found" }, 404);
    }
    return json({ error: "Method not allowed" }, 405);
  } finally {
    await closeDatabase(sql);
  }
}
__name(leadsApi, "leadsApi");
async function leadActivitiesApi(request, env, pathname) {
  const sql = getDatabase(env);
  try {
    const user = await requireUser(request, env, sql);
    if (!user) return json({ error: "Authentication required" }, 401);
    if (request.method === "GET" && pathname === "/api/lead-activities") {
      const activities = await sql`
        select a.* from lead_activities a join leads l on l.id=a.lead_id
        where a.organization_id=${user.organization_id} and l.organization_id=${user.organization_id}
        order by a.created_at desc
      `;
      return json({ activities });
    }
    if (request.method === "POST" && pathname === "/api/lead-activities/import") {
      if (!canWriteSales(user)) return json({ error: "Sales write access required" }, 403);
      const body = await readJson(request);
      if (!Array.isArray(body?.activities) || body.activities.length > 1e4) return json({ error: "Provide up to 10000 activities" }, 400);
      let imported = 0, skipped = 0;
      await sql.begin(async (transaction) => {
        for (const source of body.activities) {
          const leadCode = String(source?.leadCode || source?.lead_code || "").trim();
          const activityType = String(source?.activityType || source?.activity_type || "").trim();
          const description = String(source?.description || "").trim();
          const performedBy = String(source?.performedBy || source?.performed_by || "System").trim();
          const createdAt = source?.createdAt || source?.created_at || null;
          if (!leadCode || !activityType || !description) {
            skipped++;
            continue;
          }
          const [lead2] = await transaction`select id from leads where organization_id=${user.organization_id} and lead_code=${leadCode} limit 1`;
          if (!lead2) {
            skipped++;
            continue;
          }
          const rows = await transaction`
            insert into lead_activities (organization_id,lead_id,activity_type,description,performed_by,created_at)
            select ${user.organization_id},${lead2.id},${activityType},${description},${performedBy},coalesce(${createdAt}::timestamptz,now())
            where not exists (
              select 1 from lead_activities where organization_id=${user.organization_id} and lead_id=${lead2.id}
              and activity_type=${activityType} and description=${description} and performed_by=${performedBy}
              and created_at=coalesce(${createdAt}::timestamptz,created_at)
            ) returning id
          `;
          if (rows.length) imported++;
          else skipped++;
        }
      });
      const [{ count }] = await sql`select count(*)::int as count from lead_activities where organization_id=${user.organization_id}`;
      return json({ ok: true, imported, skipped, cloudTotal: count });
    }
    const match = pathname.match(/^\/api\/leads\/([0-9a-f-]{36})\/activities$/i);
    if (!match) return json({ error: "Not found" }, 404);
    const leadId = match[1];
    const [lead] = await sql`select id from leads where id=${leadId} and organization_id=${user.organization_id} limit 1`;
    if (!lead) return json({ error: "Lead not found" }, 404);
    if (request.method === "GET") {
      const activities = await sql`select * from lead_activities where organization_id=${user.organization_id} and lead_id=${leadId} order by created_at desc`;
      return json({ activities });
    }
    if (request.method === "POST") {
      if (!canWriteSales(user)) return json({ error: "Sales write access required" }, 403);
      const body = await readJson(request), allowed = ["Call", "WhatsApp", "Meeting", "Note", "Quotation"];
      const activityType = String(body?.type || body?.activityType || "").trim(), description = String(body?.description || "").trim();
      if (!allowed.includes(activityType) || !description) return json({ error: "A valid activity type and description are required" }, 400);
      const [created] = await sql`
        insert into lead_activities (organization_id,lead_id,activity_type,description,performed_by)
        values (${user.organization_id},${leadId},${activityType},${description},${user.display_name}) returning *
      `;
      return json({ activity: created }, 201);
    }
    return json({ error: "Method not allowed" }, 405);
  } finally {
    await closeDatabase(sql);
  }
}
__name(leadActivitiesApi, "leadActivitiesApi");
function authCookie(name, value, maxAge) {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
}
function authJson(data, status, accessToken, refreshToken) {
  const headers = new Headers({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  if (accessToken) headers.append("set-cookie", authCookie("lp_access", accessToken, 900));
  if (refreshToken) headers.append("set-cookie", authCookie("lp_refresh", refreshToken, 2592000));
  return new Response(JSON.stringify(data), { status, headers });
}
function clearAuthJson(data = { ok: true }, status = 200) {
  const headers = new Headers({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  headers.append("set-cookie", authCookie("lp_access", "", 0));
  headers.append("set-cookie", authCookie("lp_refresh", "", 0));
  return new Response(JSON.stringify(data), { status, headers });
}
function requestCookie(request, name) {
  for (const part of String(request.headers.get("cookie") || "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return "";
}
async function ensureAuthRateLimitSchema(sql) {
  await sql`create table if not exists auth_rate_limits (
    rate_key text primary key,
    failures integer not null default 0,
    window_started_at timestamptz not null default now(),
    blocked_until timestamptz,
    updated_at timestamptz not null default now()
  )`;
  await sql`create index if not exists auth_rate_limits_updated_at on auth_rate_limits (updated_at)`;
}
async function ensureAuthSessionSchema(sql) {
  await sql`alter table refresh_tokens add column if not exists created_at timestamptz not null default now()`;
  // PostgreSQL's CREATE INDEX IF NOT EXISTS can still race in the system
  // catalog when multiple Worker isolates initialize this schema together.
  // Keep the advisory lock and DDL in one transaction so only one request can
  // attempt this index creation at a time.
  await sql`do $$
    begin
      perform pg_advisory_xact_lock(hashtext('lenspirecrm:refresh_tokens_user_active_created'));
      create index if not exists refresh_tokens_user_active_created
        on refresh_tokens (organization_id,user_id,created_at desc)
        where revoked_at is null;
    end
  $$`;
  await sql`delete from refresh_tokens where expires_at < now() - interval '7 days' or revoked_at < now() - interval '7 days'`;
}
class SchemaMigrationRequiredError extends Error {
  constructor(component) {
    super(`Database migration required for ${component}`);
    this.name = "SchemaMigrationRequiredError";
    this.component = component;
  }
}
let authSchemaVerified = false;
let organizationProfileSchemaVerified = false;
async function assertAuthSchemaReady(sql) {
  if (authSchemaVerified) return;
  const [schema] = await sql`select
    to_regclass('public.auth_rate_limits') is not null as auth_rate_limits,
    exists (select 1 from information_schema.columns where table_schema='public' and table_name='refresh_tokens' and column_name='created_at') as refresh_token_created_at,
    to_regclass('public.refresh_tokens_user_active_created') is not null as refresh_token_index`;
  if (!schema || !Object.values(schema).every(Boolean)) throw new SchemaMigrationRequiredError("authentication");
  authSchemaVerified = true;
}
async function assertOrganizationProfileSchemaReady(sql) {
  if (organizationProfileSchemaVerified) return;
  const [schema] = await sql`select count(*)::int = 7 as ready
    from information_schema.columns
    where table_schema='public' and table_name='organization_profiles'
      and column_name in ('logo_url','contact_phone','whatsapp_number','contact_email','studio_address','document_header','document_footer')`;
  if (!schema?.ready) throw new SchemaMigrationRequiredError("organization profiles");
  organizationProfileSchemaVerified = true;
}
async function authRateKey(request, username) {
  const address = String(request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  return sha2562(`${address.toLowerCase()}\n${String(username).trim().toLowerCase()}`);
}
async function authRateBlocked(sql, rateKey) {
  const [record] = await sql`select blocked_until from auth_rate_limits where rate_key=${rateKey} and blocked_until > now() limit 1`;
  return record?.blocked_until || null;
}
async function recordAuthFailure(sql, rateKey) {
  const [record] = await sql`
    insert into auth_rate_limits (rate_key, failures, window_started_at, updated_at)
    values (${rateKey}, 1, now(), now())
    on conflict (rate_key) do update set
      failures = case when auth_rate_limits.window_started_at < now() - interval '15 minutes' then 1 else auth_rate_limits.failures + 1 end,
      window_started_at = case when auth_rate_limits.window_started_at < now() - interval '15 minutes' then now() else auth_rate_limits.window_started_at end,
      blocked_until = case
        when auth_rate_limits.window_started_at >= now() - interval '15 minutes' and auth_rate_limits.failures + 1 >= 5 then now() + interval '15 minutes'
        else null
      end,
      updated_at = now()
    returning blocked_until
  `;
  return record?.blocked_until || null;
}
async function login(request, env) {
  if (!env.JWT_SECRET) return json({ error: "Authentication is not configured" }, 503);
  const body = await readJson(request);
  const username = String(body?.username || "").trim();
  const password = String(body?.password || "");
  if (!username || !password) return json({ error: "Username and password are required" }, 400);
  const sql = getDatabase(env);
  try {
    try {
      await assertAuthSchemaReady(sql);
      const rateKey = await authRateKey(request, username);
      if (await authRateBlocked(sql, rateKey)) {
        operationalEvent("warning", "auth.rate_limited");
        return json({ error: "Too many sign-in attempts. Try again in 15 minutes." }, 429, { "retry-after": "900" });
      }
      await assertOrganizationProfileSchemaReady(sql);
      const [user] = await sql`
      select id, organization_id, username, display_name, role, department_access,
             password_hash, password_salt, password_iterations
      from users where lower(username) = lower(${username}) and active = true limit 1
    `;
      if (!user?.password_salt || !await verifyPassword(password, user.password_hash, user.password_salt, user.password_iterations)) {
        const blockedUntil = await recordAuthFailure(sql, rateKey);
        if (blockedUntil) {
          operationalEvent("warning", "auth.rate_limit_triggered");
          return json({ error: "Too many sign-in attempts. Try again in 15 minutes." }, 429, { "retry-after": "900" });
        }
        return json({ error: "Incorrect username or password" }, 401);
      }
      const passwordUpgradeRequired = !isStrongPassword(password);
      const [profile] = await sql`select status, subscription_expires_at, logo_url, contact_phone, whatsapp_number, contact_email, studio_address, document_header, document_footer from organization_profiles where organization_id=${user.organization_id} limit 1`;
      const platformOwner = await sql`select 1 from platform_admins where user_id=${user.id} limit 1`;
      const restriction = licenseRestriction(profile);
      if (restriction && !platformOwner.at(0)) return json({ error: restriction.message, code: restriction.code }, 403);
      const refreshToken = (passwordUpgradeRequired ? "upgrade." : "") + randomToken(48);
      const refreshHash = await sha2562(refreshToken);
      await sql.begin(async (transaction) => {
        await transaction`delete from auth_rate_limits where rate_key=${rateKey}`;
        await transaction`update users set last_login = now() where id = ${user.id} and organization_id=${user.organization_id}`;
        await transaction`
        insert into refresh_tokens (organization_id, user_id, token_hash, expires_at)
        values (${user.organization_id}, ${user.id}, ${refreshHash}, now() + interval '30 days')
      `;
        await transaction`update refresh_tokens set revoked_at=now()
          where organization_id=${user.organization_id} and user_id=${user.id}
            and id in (select id from refresh_tokens where organization_id=${user.organization_id} and user_id=${user.id} and revoked_at is null order by created_at desc offset 5)`;
        await transaction`
        insert into audit_logs (organization_id, user_id, action, entity_type, entity_id)
        values (${user.organization_id}, ${user.id}, 'auth.login', 'user', ${user.id})
      `;
      });
      const accessToken = await signAccessToken(
        { sub: user.id, org: user.organization_id, role: user.role, username: user.username, name: user.display_name, access: normalizeDepartmentAccess(user.department_access, user.role), passwordUpgradeRequired },
        env.JWT_SECRET
      );
      const [organization] = await sql`select name from organizations where id=${user.organization_id} limit 1`;
      const responseBody = {
        accessToken,
        refreshToken,
        expiresIn: 900,
        user: {
          id: user.id,
          organizationId: user.organization_id,
          organization_name: organization?.name || "Studio",
                    isPlatformOwner: Boolean(platformOwner.at(0)),
          
          username: user.username,
          displayName: user.display_name,
          role: user.role,
          passwordUpgradeRequired,
          departmentAccess: normalizeDepartmentAccess(user.department_access, user.role)
        },
         organization: {
          name: organization?.name || "Studio",
          logoUrl: profile?.logo_url || null,
          contactPhone: profile?.contact_phone || null,
          whatsappNumber: profile?.whatsapp_number || null,
          contactEmail: profile?.contact_email || null,
          studioAddress: profile?.studio_address || null,
          documentHeader: profile?.document_header || null,
          documentFooter: profile?.document_footer || null,
          studioSlug: profile?.studio_slug || null
        }
      };
      return authJson(responseBody, 200, accessToken, refreshToken);
    } catch (error) {
      console.error("login failed", error?.stack || error);
      return json({ error: "Login failed" }, 500);
    }
  } finally {
    await closeDatabase(sql);
  }
}
__name(login, "login");
async function refreshSession(request, env) {
  if (!env.JWT_SECRET) return json({ error: "Authentication is not configured" }, 503);
  const body = await readJson(request);
  const presentedToken = String(body?.refreshToken || requestCookie(request, "lp_refresh") || "");
  if (!presentedToken) return json({ error: "Refresh token is required" }, 400);
  const tokenHash = await sha2562(presentedToken);
  const sql = getDatabase(env);
  try {
    await assertAuthSchemaReady(sql);
    const [record] = await sql`
      select rt.id as token_id, u.id, u.organization_id, u.username, u.display_name, u.role, u.department_access
      from refresh_tokens rt join users u on u.id=rt.user_id and u.organization_id=rt.organization_id
      where rt.token_hash=${tokenHash} and rt.revoked_at is null and rt.expires_at>now() and u.active=true limit 1
    `;
    if (!record) return json({ error: "Session has expired. Please sign in again." }, 401);
    const passwordUpgradeRequired = presentedToken.startsWith("upgrade.");
    const nextRefreshToken = (passwordUpgradeRequired ? "upgrade." : "") + randomToken(48);
    const nextHash = await sha2562(nextRefreshToken);
    const rotated = await sql.begin(async (transaction) => {
      const [revoked] = await transaction`update refresh_tokens set revoked_at=now() where id=${record.token_id} and organization_id=${record.organization_id} and user_id=${record.id} and revoked_at is null returning id`;
      if (!revoked) return false;
      await transaction`
        insert into refresh_tokens (organization_id,user_id,token_hash,expires_at)
        values (${record.organization_id},${record.id},${nextHash},now()+interval '30 days')
      `;
      return true;
    });
    if (!rotated) return clearAuthJson({ error: "Session has already been refreshed. Please sign in again." }, 401);
    const accessToken = await signAccessToken({ sub: record.id, org: record.organization_id, role: record.role, username: record.username, name: record.display_name, access: normalizeDepartmentAccess(record.department_access, record.role), passwordUpgradeRequired }, env.JWT_SECRET);
    return authJson({ accessToken, refreshToken: nextRefreshToken, expiresIn: 900 }, 200, accessToken, nextRefreshToken);
  } finally {
    await closeDatabase(sql);
  }
}
__name(refreshSession, "refreshSession");
async function logoutSession(request, env) {
  const presentedToken = requestCookie(request, "lp_refresh");
  if (presentedToken && env.CRM_DB?.connectionString) {
    const sql = getDatabase(env);
    try {
      const tokenHash = await sha2562(presentedToken);
      const [revoked] = await sql`update refresh_tokens set revoked_at=now() where token_hash=${tokenHash} and revoked_at is null returning organization_id,user_id`;
      if (revoked) await sql`insert into audit_logs (organization_id,user_id,action,entity_type,entity_id) values (${revoked.organization_id},${revoked.user_id},'auth.logout','user',${revoked.user_id})`;
    } finally {
      await closeDatabase(sql);
    }
  }
  return clearAuthJson();
}
__name(logoutSession, "logoutSession");
const strongPasswordMessage = "Password must be 12-128 characters and include uppercase, lowercase, number, and symbol.";
const isStrongPassword = (value) => typeof value === "string" && value.length >= 12 && value.length <= 128 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
async function changePassword(request, env) {
  const sql = getDatabase(env);
  try {
    const user = await requireUser(request, env, sql);
    if (!user) return json({ error: "Authentication required" }, 401);
    const body = await readJson(request);
    const currentPassword = String(body?.currentPassword || "");
    const newPassword = String(body?.newPassword || "");
    if (!isStrongPassword(newPassword)) return json({ error: strongPasswordMessage }, 400);
    const [credentials] = await sql`
      select password_hash,password_salt,password_iterations from users where id=${user.id} and organization_id=${user.organization_id} limit 1
    `;
    if (!credentials?.password_salt || !await verifyPassword(currentPassword, credentials.password_hash, credentials.password_salt, credentials.password_iterations)) {
      return json({ error: "Current password is incorrect" }, 401);
    }
    if (currentPassword === newPassword) return json({ error: "Choose a different password" }, 400);
    const passwordData = await hashPassword(newPassword);
    await sql.begin(async (transaction) => {
      await transaction`
        update users set password_hash=${passwordData.hash},password_salt=${passwordData.salt},password_iterations=${passwordData.iterations}
        where id=${user.id} and organization_id=${user.organization_id}
      `;
      await transaction`update refresh_tokens set revoked_at=now() where user_id=${user.id} and organization_id=${user.organization_id} and revoked_at is null`;
      await transaction`
        insert into audit_logs (organization_id,user_id,action,entity_type,entity_id)
        values (${user.organization_id},${user.id},'auth.password_changed','user',${user.id})
      `;
    });
    return json({ ok: true, signInAgain: true });
  } finally {
    await closeDatabase(sql);
  }
}
__name(changePassword, "changePassword");
async function resetOwnerPassword(request, env) {
  if (!env.SETUP_TOKEN || request.headers.get("x-setup-token") !== env.SETUP_TOKEN) {
    return json({ error: "Invalid or expired setup authorization" }, 403);
  }
  const body = await readJson(request);
  const username = String(body?.username || "").trim();
  const password = String(body?.newPassword || body?.password || "");
  if (!username || !isStrongPassword(password)) return json({ error: `Username is required. ${strongPasswordMessage}` }, 400);
  const sql = getDatabase(env);
  try {
    const [user] = await sql`select id, organization_id from users where lower(username) = lower(${username}) limit 1`;
    if (!user) return json({ error: "User not found" }, 404);
    const passwordData = await hashPassword(password);
    await sql.begin(async (transaction) => {
      await transaction`
        update users set password_hash=${passwordData.hash}, password_salt=${passwordData.salt}, password_iterations=${passwordData.iterations}
        where id=${user.id} and organization_id=${user.organization_id}
      `;
      await transaction`update refresh_tokens set revoked_at=now() where user_id=${user.id} and organization_id=${user.organization_id} and revoked_at is null`;
      await transaction`
        insert into audit_logs (organization_id,user_id,action,entity_type,entity_id)
        values (${user.organization_id},${user.id},'auth.password_reset','user',${user.id})
      `;
    });
    return json({ ok: true, user: username });
  } finally {
    await closeDatabase(sql);
  }
}
__name(resetOwnerPassword, "resetOwnerPassword");
function normalizeDepartmentAccess(value, role) {
  const defaults = role === "Administrator" ? { sales: "full", operations: "full", accounts: "full", postProduction: "full" } : { sales: "none", operations: "none", accounts: "none", postProduction: "none" };
  let parsed = value;
  while (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      break;
    }
  }
  const allowed = /* @__PURE__ */ new Set(["full", "view", "none"]);
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, allowed.has(parsed?.[key]) ? parsed[key] : fallback]));
}
__name(normalizeDepartmentAccess, "normalizeDepartmentAccess");
function mapUser(row) {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    role: row.role,
    departmentAccess: normalizeDepartmentAccess(row.department_access, row.role),
    active: row.active,
    lastLogin: row.last_login,
    createdAt: row.created_at
  };
}
__name(mapUser, "mapUser");
async function usersApi(request, env, pathname) {
  const sql = getDatabase(env);
  try {
    const user = await requireUser(request, env, sql);
if (!user) return json({ error: "Authentication required" }, 401);

const canReadPostProductionUsers =
  user.role === "Administrator" ||
  (["Post Production", "Editor"].includes(user.role) &&
   normalizeDepartmentAccess(user.department_access, user.role).postProduction === "full");

if (request.method === "GET" && pathname === "/api/users") {
  if (!canReadPostProductionUsers) {
    return json({ error: "Administrator or Post Production access required" }, 403);
  }

  const rows = user.role === "Administrator"
    ? await sql`
        select id, username, display_name, role, department_access, active, last_login, created_at
        from users where organization_id = ${user.organization_id}
        order by active desc, display_name`
    : await sql`
        select id, username, display_name, role, department_access, active, last_login, created_at
        from users
        where organization_id = ${user.organization_id}
          and active = true
          and role in ('Post Production', 'Editor')
        order by display_name`;

  return json({ users: rows.map(mapUser) });
}

if (user.role !== "Administrator") {
  return json({ error: "Administrator access required" }, 403);
}
    if (request.method === "POST" && pathname === "/api/users") {
      const body = await readJson(request);
      const username = String(body?.username || "").trim();
      const displayName = String(body?.displayName || "").trim();
      const password = String(body?.password || "");
      const role = String(body?.role || "");
      const allowedRoles = ["Sales", "Management", "Accounts", "Post Production", "Editor", "Sales Executive", "Photographer", "Cinematographer"];
      if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username)) return json({ error: "Username must be 3-30 letters, numbers, dots, dashes or underscores." }, 400);
      if (displayName.length < 2 || displayName.length > 80) return json({ error: "Enter a valid full name." }, 400);
      if (!isStrongPassword(password)) return json({ error: strongPasswordMessage }, 400);
      if (!allowedRoles.includes(role)) return json({ error: "Select a valid role." }, 400);
      const access = normalizeDepartmentAccess(body?.departmentAccess, role);
      const passwordData = await hashPassword(password);
      try {
        const [created] = await sql`
          insert into users (organization_id, username, display_name, role, password_hash, password_salt, password_iterations, department_access)
          values (${user.organization_id}, ${username}, ${displayName}, ${role}, ${passwordData.hash}, ${passwordData.salt}, ${passwordData.iterations}, ${access}::jsonb)
          returning id, username, display_name, role, department_access, active, last_login, created_at
        `;
        await sql`
          insert into audit_logs (organization_id, user_id, action, entity_type, entity_id)
          values (${user.organization_id}, ${user.id}, 'user.created', 'user', ${created.id})
        `;
        return json({ user: mapUser(created) }, 201);
      } catch (error) {
        if (/duplicate|unique/i.test(String(error.message))) return json({ error: "That username is already in use." }, 409);
        throw error;
      }
    }
    const match = pathname.match(/^\/api\/users\/([0-9a-f-]{36})\/(access|active|role|reset-password)$/i);
    if (!match) return json({ error: "Not found" }, 404);
    const targetId = match[1];
    const action = match[2].toLowerCase();
    const [target] = await sql`select id, organization_id, role from users where id = ${targetId} and organization_id = ${user.organization_id} limit 1`;
    if (!target) return json({ error: "User account not found" }, 404);
    if (request.method === "PATCH" && action === "role") {
      const body = await readJson(request);
      const role = String(body?.role || "");
      const allowedRoles = ["Sales", "Management", "Accounts", "Post Production", "Editor", "Sales Executive", "Photographer", "Cinematographer"];
      if (!allowedRoles.includes(role)) return json({ error: "Select a valid role." }, 400);
      await sql.begin(async (transaction) => {
        await transaction`update users set role = ${role} where id = ${target.id} and organization_id = ${user.organization_id}`;
        if (role === "Editor") {
          const editorAccess = { sales: "none", operations: "none", accounts: "none", postProduction: "full" };
          await transaction`update users set department_access = ${editorAccess}::jsonb where id = ${target.id} and organization_id = ${user.organization_id}`;
        }
        await transaction`insert into audit_logs (organization_id,user_id,action,entity_type,entity_id) values (${user.organization_id},${user.id},'user.role_changed','user',${target.id})`;
      });
      const [updated] = await sql`select id, username, display_name, role, department_access, active, last_login, created_at from users where id = ${target.id} and organization_id = ${user.organization_id}`;
      return json({ user: mapUser(updated) });
    }
    if (request.method === "PATCH" && action === "access") {
      const body = await readJson(request);
      const access = normalizeDepartmentAccess(body?.access, target.role);
      await sql.begin(async (transaction) => {
        await transaction`update users set department_access = ${access}::jsonb where id = ${target.id} and organization_id = ${user.organization_id}`;
        await transaction`insert into audit_logs (organization_id,user_id,action,entity_type,entity_id) values (${user.organization_id},${user.id},'user.access_changed','user',${target.id})`;
      });
      const [updated] = await sql`select id, username, display_name, role, department_access, active, last_login, created_at from users where id = ${target.id} and organization_id = ${user.organization_id}`;
      return json({ user: mapUser(updated) });
    }
    if (request.method === "PATCH" && action === "active") {
      const body = await readJson(request);
      const active = Boolean(body?.active);
      if (String(target.id) === String(user.id) && !active) return json({ error: "You cannot deactivate your own account." }, 400);
      await sql.begin(async (transaction) => {
        await transaction`update users set active = ${active} where id = ${target.id} and organization_id = ${user.organization_id}`;
        await transaction`insert into audit_logs (organization_id,user_id,action,entity_type,entity_id) values (${user.organization_id},${user.id},${active ? "user.activated" : "user.deactivated"},'user',${target.id})`;
        if (!active) await transaction`update refresh_tokens set revoked_at=now() where user_id=${target.id} and organization_id=${user.organization_id} and revoked_at is null`;
      });
      const [updated] = await sql`select id, username, display_name, role, department_access, active, last_login, created_at from users where id = ${target.id} and organization_id = ${user.organization_id}`;
      return json({ user: mapUser(updated) });
    }
    if (request.method === "POST" && action === "reset-password") {
      const body = await readJson(request);
      const password = String(body?.password || "");
      if (!isStrongPassword(password)) return json({ error: strongPasswordMessage }, 400);
      const passwordData = await hashPassword(password);
      await sql.begin(async (transaction) => {
        await transaction`
          update users set password_hash=${passwordData.hash}, password_salt=${passwordData.salt}, password_iterations=${passwordData.iterations}
          where id=${target.id} and organization_id=${user.organization_id}
        `;
        await transaction`update refresh_tokens set revoked_at=now() where user_id=${target.id} and organization_id=${user.organization_id} and revoked_at is null`;
        await transaction`
          insert into audit_logs (organization_id,user_id,action,entity_type,entity_id)
          values (${user.organization_id},${user.id},'user.password_reset','user',${target.id})
        `;
      });
      return json({ ok: true });
    }
    return json({ error: "Method not allowed" }, 405);
  } finally {
    await closeDatabase(sql);
  }
}
__name(usersApi, "usersApi");
async function setupOwner(request, env) {
  if (!env.SETUP_TOKEN || request.headers.get("x-setup-token") !== env.SETUP_TOKEN) {
    return json({ error: "Invalid or expired setup authorization" }, 403);
  }
  const body = await readJson(request);
  const username = String(body?.username || "").trim();
  const displayName = String(body?.displayName || "").trim();
  const password = String(body?.password || "");
  if (!/^[A-Za-z0-9._-]{3,30}$/.test(username)) return json({ error: "Enter a valid username" }, 400);
  if (displayName.length < 2 || displayName.length > 80) return json({ error: "Enter a valid display name" }, 400);
  if (!isStrongPassword(password)) return json({ error: strongPasswordMessage }, 400);
  const sql = getDatabase(env);
  try {
    const [{ count }] = await sql`select count(*)::int as count from users`;
    if (count !== 0) return json({ error: "Initial setup has already been completed" }, 409);
    const [organization] = await sql`select id from organizations where name = 'LenspireCRM' limit 1`;
    if (!organization) return json({ error: "LenspireCRM organization is missing" }, 500);
    const passwordData = await hashPassword(password);
    const fullAccess = { sales: "full", operations: "full", accounts: "full", postProduction: "full" };
    const [user] = await sql.begin(async (transaction) => {
      const [created] = await transaction`
        insert into users (organization_id, username, display_name, role, password_hash, password_salt, password_iterations, department_access)
        values (${organization.id}, ${username}, ${displayName}, 'Administrator', ${passwordData.hash}, ${passwordData.salt}, ${passwordData.iterations}, ${fullAccess}::jsonb)
        returning id, username, display_name
      `;
      await transaction`
        insert into audit_logs (organization_id, user_id, action, entity_type, entity_id)
        values (${organization.id}, ${created.id}, 'setup.owner_created', 'user', ${created.id})
      `;
      await transaction`insert into platform_admins (user_id) values (${created.id}) on conflict do nothing`;
      return [created];
    });
    return json({ ok: true, user: { id: user.id, username: user.username, displayName: user.display_name } }, 201);
  } finally {
    await closeDatabase(sql);
  }
}
__name(setupOwner, "setupOwner");
async function decryptSecret(encrypted, encodedKey) {
  const key = await encryptionKey(encodedKey, ["decrypt"]);
  const decode = /* @__PURE__ */ __name((bytes) => Uint8Array.from(atob(bytes), (char) => char.charCodeAt(0)), "decode");
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: decode(encrypted.iv) }, key, decode(encrypted.ciphertext));
  return new TextDecoder().decode(plain);
}
__name(decryptSecret, "decryptSecret");

async function backupAtRestEncrypt(data, encodedKey) {
  if (!encodedKey || typeof encodedKey !== "string") return data;
  try {
    const raw = Uint8Array.from(atob(encodedKey), (char) => char.charCodeAt(0));
    const key = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(data))));
    return { __encryptedBackup: true, iv: base64FromBytes(iv), ciphertext: base64FromBytes(encrypted) };
  } catch {
    return data;
  }
}
__name(backupAtRestEncrypt, "backupAtRestEncrypt");
async function backupAtRestDecrypt(wrapped, encodedKey) {
  if (!wrapped || typeof wrapped !== "object" || !wrapped.__encryptedBackup || !encodedKey) return wrapped;
  try {
    const raw = Uint8Array.from(atob(encodedKey), (char) => char.charCodeAt(0));
    const key = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);
    const iv = base64ToBytes(wrapped.iv);
    const ciphertext = base64ToBytes(wrapped.ciphertext);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
    return JSON.parse(new TextDecoder().decode(plain));
  } catch {
    return wrapped;
  }
}
__name(backupAtRestDecrypt, "backupAtRestDecrypt");

const BACKUP_KDF_ITERATIONS = 310000;
const BACKUP_KEY_LENGTH = 32;
const BACKUP_SALT_LENGTH = 64;
const BACKUP_IV_LENGTH = 12;
const BACKUP_AUTH_TAG_LENGTH = 16;
function base64FromBytes(bytes) {
  return btoa(String.fromCharCode(...bytes));
}
function base64ToBytes(b64) {
  return Uint8Array.from(atob(b64 || ""), (c) => c.charCodeAt(0));
}
async function backupEncryptPayload(payload, password) {
  if (typeof password !== "string" || password.length < 12) throw new Error("Backup password must be at least 12 characters.");
  const salt = crypto.getRandomValues(new Uint8Array(BACKUP_SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(BACKUP_IV_LENGTH));
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const aesKey = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: BACKUP_KDF_ITERATIONS, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: BACKUP_KEY_LENGTH * 8, tagLength: BACKUP_AUTH_TAG_LENGTH * 8 }, false, ["encrypt"]);
  const plaintext = JSON.stringify(payload);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, new TextEncoder().encode(plaintext)));
  return {
    encrypted: true,
    version: 2,
    kdf: "pbkdf2-sha256",
    iterations: BACKUP_KDF_ITERATIONS,
    salt: base64FromBytes(salt),
    iv: base64FromBytes(iv),
    authTag: base64FromBytes(encrypted.slice(encrypted.length - BACKUP_AUTH_TAG_LENGTH)),
    ciphertext: base64FromBytes(encrypted.slice(0, encrypted.length - BACKUP_AUTH_TAG_LENGTH))
  };
}
__name(backupEncryptPayload, "backupEncryptPayload");
async function backupDecryptPayload(encryptedObj, password) {
  const iterations = Number(encryptedObj.iterations) || BACKUP_KDF_ITERATIONS;
  if (!Number.isInteger(iterations) || iterations < 100000 || iterations > 2000000) throw new Error("Invalid backup key-derivation settings.");
  const salt = base64ToBytes(encryptedObj.salt);
  const iv = base64ToBytes(encryptedObj.iv);
  const authTag = base64ToBytes(encryptedObj.authTag);
  const ciphertext = base64ToBytes(encryptedObj.ciphertext);
  const combined = new Uint8Array(ciphertext.length + authTag.length);
  combined.set(ciphertext);
  combined.set(authTag, ciphertext.length);
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const aesKey = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: BACKUP_KEY_LENGTH * 8, tagLength: BACKUP_AUTH_TAG_LENGTH * 8 }, false, ["decrypt"]);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, combined);
  return JSON.parse(new TextDecoder().decode(plain));
}
__name(backupDecryptPayload, "backupDecryptPayload");
async function createAutoBackupSnapshot(sql, org) {
  return {
    exportedAt: /* @__PURE__ */ new Date().toISOString(),
    app: "LenspireCRM Pro",
    kind: "lenspirecrm-cloud-backup",
    organization: { name: ((await sql`select name from organizations where id = ${org}`))[0]?.name || "LenspireCRM" },
    leads: await sql`select * from leads where organization_id = ${org} order by created_at`,
    customers: await sql`select * from customers where organization_id = ${org} order by created_at`,
    bookings: await sql`select * from bookings where organization_id = ${org} order by created_at`,
    production: await sql`select * from production_jobs where organization_id = ${org} order by created_at`,
    productionActivities: await sql`select * from production_activity_log where organization_id = ${org} order by created_at`,
    clientPortalAccess: await sql`select * from client_portal_access where organization_id = ${org} order by created_at`,
    clientPortalAccessLog: await sql`select * from client_portal_access_log where organization_id = ${org} order by accessed_at`,
    events: await sql`select * from calendar_events where organization_id = ${org} order by created_at`,
    payments: await sql`select * from payments where organization_id = ${org} order by created_at`,
    activities: await sql`select * from lead_activities where organization_id = ${org} order by created_at`,
    salesTargets: await sql`select * from sales_targets where organization_id = ${org} order by target_month`,
    photographers: await sql`select * from photographer_details where organization_id = ${org} order by created_at`,
    users: await sql`select id, username, display_name, role, department_access, active, last_login, created_at from users where organization_id = ${org} order by display_name`
  };
}
__name(createAutoBackupSnapshot, "createAutoBackupSnapshot");
async function createAutoBackup(sql, org, options = {}, env) {
  const snapshot = await createAutoBackupSnapshot(sql, org);
  const retentionDays = Number(options.retentionDays) || 7;
  const expiresAt = /* @__PURE__ */ new Date(Date.now() + retentionDays * 864e5).toISOString();
  const backupName = "Auto-Backup-" + new Date().toISOString().replace(/[:.]/g, "-");
  const rowCounts = {
    leads: snapshot.leads.length,
    customers: snapshot.customers.length,
    bookings: snapshot.bookings.length,
    production: snapshot.production.length,
    productionActivities: snapshot.productionActivities.length,
    clientPortalAccess: snapshot.clientPortalAccess.length,
    clientPortalAccessLog: snapshot.clientPortalAccessLog.length,
    events: snapshot.events.length,
    payments: snapshot.payments.length,
    activities: snapshot.activities.length,
    salesTargets: snapshot.salesTargets.length,
    photographers: snapshot.photographers.length,
    users: snapshot.users.length
  };
  const encryptedData = env?.BACKUP_ENCRYPTION_KEY ? await backupAtRestEncrypt(snapshot, env.BACKUP_ENCRYPTION_KEY) : snapshot;
  await sql`insert into auto_backups (organization_id, backup_name, backup_type, row_counts, backup_data, retention_days, expires_at)
    values (${org}, ${backupName}, ${options.backupType || "auto"}, ${rowCounts}, ${encryptedData}, ${retentionDays}, ${sql.types.timestamptz(expiresAt)})`;
  await sql`insert into backup_configs (organization_id, auto_backup_enabled, auto_backup_interval_hours, auto_backup_retention_count, last_backup_at, updated_at)
    values (${org}, true, 24, 7, now(), now())
    on conflict (organization_id) do update set last_backup_at = now(), updated_at = now()`;
  const [result] = await sql`select id, backup_name as "backupName", backup_type as "backupType", created_at as "createdAt", retention_days as "retentionDays", expires_at as "expiresAt", row_counts as "rowCounts" from auto_backups where organization_id = ${org} and backup_name = ${backupName} order by created_at desc limit 1`;
  return result;
}
__name(createAutoBackup, "createAutoBackup");
function parseAutoBackupRow(row) {
  return row && typeof row === "object" ? { id: row.id, backupName: row.backupName || row.backup_name, backupType: row.backupType || row.backup_type, createdAt: row.createdAt || row.created_at, retentionDays: row.retentionDays || row.retention_days, expiresAt: row.expiresAt || row.expires_at, rowCounts: row.rowCounts || row.row_counts || {} } : null;
}
__name(parseAutoBackupRow, "parseAutoBackupRow");
async function pruneAutoBackups(sql, org, retentionCount) {
  const count = Number(retentionCount) || 7;
  const expired = await sql`delete from auto_backups where organization_id = ${org} and (expires_at < now() or id not in (select id from auto_backups where organization_id = ${org} order by created_at desc limit ${count})) returning id`;
  return expired.count;
}
__name(pruneAutoBackups, "pruneAutoBackups");
function parseJsonValue(value) {
  let parsed = value;
  while (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      break;
    }
  }
  return parsed && typeof parsed === "object" ? parsed : null;
}
__name(parseJsonValue, "parseJsonValue");
async function driveAccessToken(refreshToken, env) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    })
  });
  const tokens = await response.json().catch(() => ({}));
  if (!response.ok || !tokens.access_token) {
    throw new Error(tokens.error_description || tokens.error || "Google Drive token refresh failed (HTTP " + response.status + ")");
  }
  return tokens.access_token;
}
__name(driveAccessToken, "driveAccessToken");
async function driveUploadRequest(accessToken, folderId, name, mimeType, bytes) {
  const boundary = "LenspireCRM-" + randomToken(12);
  const metadata = JSON.stringify({ name, parents: folderId ? [folderId] : [] });
  const encoder2 = new TextEncoder();
  const parts = [
    encoder2.encode("--" + boundary + "\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n" + metadata + "\r\n"),
    encoder2.encode("--" + boundary + "\r\nContent-Type: " + mimeType + "\r\n\r\n"),
    new Uint8Array(bytes),
    encoder2.encode("\r\n--" + boundary + "--\r\n")
  ];
  let total = 0;
  for (const part of parts) total += part.byteLength;
  const body = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    body.set(part, offset);
    offset += part.byteLength;
  }
  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink", {
    method: "POST",
    headers: { authorization: "Bearer " + accessToken, "content-type": "multipart/related; boundary=" + boundary },
    body
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.id) throw new Error(result.error?.message || "Google Drive upload failed (HTTP " + response.status + ")");
  return result;
}
__name(driveUploadRequest, "driveUploadRequest");
async function driveApi(request, env, pathname) {
  const sql = getDatabase(env);
  try {
    await ensureCloudSchemaReady(sql);
    const user = await requireUser(request, env, sql);
    if (!user) return json({ error: "Authentication required" }, 401);
    if (!canWriteSales(user)) return json({ error: "Sales write access required" }, 403);
    if (request.method === "POST" && pathname === "/api/drive/upload") {
      const [integration] = await sql`select encrypted_credentials, settings from integrations where organization_id = ${user.organization_id} and provider = 'google_drive' limit 1`;
      if (!integration) return json({ error: "Google Drive is not connected. Connect it in Settings first." }, 409);
      const credentials = parseJsonValue(integration.encrypted_credentials);
      const settings = parseJsonValue(integration.settings);
      if (!credentials?.iv || !credentials?.ciphertext) return json({ error: "Google Drive credentials are missing. Reconnect Drive in Settings." }, 409);
      const form = await request.formData().catch(() => null);
      const file = form?.get("file");
      if (!file) return json({ error: "No file was provided." }, 400);
      const name = String(form.get("name") || file.name || "quotation");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const mimeType = file.type || "application/octet-stream";
      const refreshToken = await decryptSecret(credentials, env.DRIVE_TOKEN_KEY);
      const accessToken = await driveAccessToken(refreshToken, env);
      const uploaded = await driveUploadRequest(accessToken, settings?.folderId, name, mimeType, bytes);
      const leadId = String(form.get("leadId") || "").trim();
      let validLeadId = /^[0-9a-f-]{36}$/i.test(leadId) ? leadId : null;
      if (validLeadId) {
        const [existing] = await sql`select id from leads where id = ${validLeadId} and organization_id = ${user.organization_id} limit 1`;
        if (!existing) validLeadId = null;
      }
      const [record] = await sql`
        insert into files (organization_id, lead_id, drive_file_id, drive_folder_id, file_name, mime_type, size_bytes, uploaded_by)
        values (${user.organization_id}, ${validLeadId}, ${uploaded.id}, ${settings?.folderId || null}, ${uploaded.name || name}, ${uploaded.mimeType || mimeType}, ${Number(uploaded.size) || bytes.byteLength}, ${user.id})
        returning id, lead_id, drive_file_id, drive_folder_id, file_name, mime_type, size_bytes, created_at
      `;
      return json({ file: { ...record, webViewLink: uploaded.webViewLink || null } }, 201);
    }
    if (request.method === "GET" && pathname === "/api/drive/files") {
      const url = new URL(request.url);
      const leadId = String(url.searchParams.get("leadId") || "").trim();
      const rows = /^[0-9a-f-]{36}$/i.test(leadId) ? await sql`select * from files where organization_id = ${user.organization_id} and lead_id = ${leadId} order by created_at desc` : await sql`select * from files where organization_id = ${user.organization_id} order by created_at desc`;
      return json({ files: rows });
    }
    const match = pathname.match(/^\/api\/drive\/files\/([0-9a-f-]{36})$/i);
    if (match && request.method === "DELETE") {
      const [record] = await sql`select * from files where id = ${match[1]} and organization_id = ${user.organization_id} limit 1`;
      if (!record) return json({ error: "File not found" }, 404);
      const [integration] = await sql`select encrypted_credentials from integrations where organization_id = ${user.organization_id} and provider = 'google_drive' limit 1`;
      if (integration) {
        try {
          const credentials = parseJsonValue(integration.encrypted_credentials);
          if (credentials?.iv && credentials?.ciphertext) {
            const refreshToken = await decryptSecret(credentials, env.DRIVE_TOKEN_KEY);
            const accessToken = await driveAccessToken(refreshToken, env);
            await fetch("https://www.googleapis.com/drive/v3/files/" + encodeURIComponent(record.drive_file_id), {
              method: "DELETE",
              headers: { authorization: "Bearer " + accessToken }
            });
          }
        } catch (error) {
          console.error("Drive file delete failed", error.message);
        }
      }
      await sql`delete from files where id = ${record.id} and organization_id = ${user.organization_id}`;
      return json({ ok: true });
    }
    if (request.method === "GET" && pathname === "/api/backup") {
      if (user.role !== "Administrator") return json({ error: "Administrator access required" }, 403);
      const password = new URL(request.url).searchParams.get("password");
      const dump = {
        exportedAt: /* @__PURE__ */ new Date().toISOString(),
        app: "LenspireCRM Pro",
        kind: "lenspirecrm-cloud-backup",
        organization: { name: user.organization_name || "LenspireCRM" },
        leads: await sql`select * from leads where organization_id = ${org} order by created_at`,
        customers: await sql`select * from customers where organization_id = ${org} order by created_at`,
        bookings: await sql`select * from bookings where organization_id = ${org} order by created_at`,
        production: await sql`select * from production_jobs where organization_id = ${org} order by created_at`,
        productionActivities: await sql`select * from production_activity_log where organization_id = ${org} order by created_at`,
        clientPortalAccess: await sql`select * from client_portal_access where organization_id = ${org} order by created_at`,
        clientPortalAccessLog: await sql`select * from client_portal_access_log where organization_id = ${org} order by accessed_at`,
        events: await sql`select * from calendar_events where organization_id = ${org} order by created_at`,
        payments: await sql`select * from payments where organization_id = ${org} order by created_at`,
        activities: await sql`select * from lead_activities where organization_id = ${org} order by created_at`,
        salesTargets: await sql`select * from sales_targets where organization_id = ${org} order by target_month`,
        photographers: await sql`select * from photographer_details where organization_id = ${org} order by created_at`,
        users: await sql`select id, username, display_name, role, department_access, active, last_login, created_at from users where organization_id = ${org} order by display_name`
      };
      if (password) {
        const encrypted = await backupEncryptPayload(dump, password);
        return new Response(JSON.stringify(encrypted, null, 2), {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "content-disposition": 'attachment; filename="lenspirecrm-backup-enc.json"',
            "cache-control": "no-store"
          }
        });
      }
      return new Response(JSON.stringify(dump, null, 2), {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "content-disposition": 'attachment; filename="lenspirecrm-backup.json"',
          "cache-control": "no-store"
        }
      });
    }
    if (request.method === "POST" && pathname === "/api/backup/restore") {
      if (user.role !== "Administrator") return json({ error: "Administrator access required" }, 403);
      const password = new URL(request.url).searchParams.get("password");
      const body = await readJson(request);
      if (!body) return json({ error: "Invalid backup file" }, 400);
      let payload = body;
      if (password || (body?.encrypted === true && typeof body?.salt === "string" && typeof body?.iv === "string" && typeof body?.authTag === "string" && typeof body?.ciphertext === "string")) {
        const pw = password || "";
        if (pw.length < 12) return json({ error: "Backup password must be at least 12 characters." }, 400);
        try { payload = await backupDecryptPayload(body, pw); } catch { return json({ error: "Incorrect backup password or corrupted backup file." }, 400); }
      }
      if (!payload || payload.kind !== "lenspirecrm-cloud-backup" && payload.format !== "lenspirecrm-cloud-backup") return json({ error: "Invalid backup file" }, 400);
      const now = /* @__PURE__ */ new Date().toISOString();
      const leadRows = Array.isArray(payload.leads) ? payload.leads : [];
      const customerRows = Array.isArray(payload.customers) ? payload.customers : [];
      const bookingRows = Array.isArray(payload.bookings) ? payload.bookings : [];
      const productionRows = Array.isArray(payload.production) ? payload.production : [];
      const productionActivityRows = Array.isArray(payload.productionActivities) ? payload.productionActivities : [];
      const portalAccessRows = Array.isArray(payload.clientPortalAccess) ? payload.clientPortalAccess : [];
      const portalAccessLogRows = Array.isArray(payload.clientPortalAccessLog) ? payload.clientPortalAccessLog : [];
      const eventRows = Array.isArray(payload.events) ? payload.events : [];
      const paymentRows = Array.isArray(payload.payments) ? payload.payments : [];
      const activityRows = Array.isArray(payload.activities) ? payload.activities : [];
      const targetRows = Array.isArray(payload.salesTargets) ? payload.salesTargets : [];
      const photographerRows = Array.isArray(payload.photographers) ? payload.photographers : [];
      await sql.begin(async (tx) => {
        await tx`delete from payments where organization_id = ${org}`;
        await tx`delete from calendar_events where organization_id = ${org}`;
        await tx`delete from client_portal_access_log where organization_id = ${org}`;
        await tx`delete from client_portal_access where organization_id = ${org}`;
        await tx`delete from production_activity_log where organization_id = ${org}`;
        await tx`delete from production_jobs where organization_id = ${org}`;
        await tx`delete from bookings where organization_id = ${org}`;
        await tx`delete from customers where organization_id = ${org}`;
        await tx`delete from lead_activities where organization_id = ${org}`;
        await tx`delete from sales_targets where organization_id = ${org}`;
        await tx`delete from photographer_details where organization_id = ${org}`;
        await tx`delete from leads where organization_id = ${org}`;
        for (const r of leadRows) {
          const input = leadInput(r);
          const leadCode = String(r?.lead_code || r?.leadCode || "").trim();
          if (!leadCode || !input.name) continue;
          const leadId = String(r?.id || "");
          await tx`
            insert into leads (id, organization_id, lead_code, name, event_type, event_date, city, source, status, budget, assigned_to, mobile, priority, notes, next_followup_at, client_name, client_mobile, couple_name, wedding_dates, total_closing, payment_mode, advance_received, received_by, payment_received_date, lost_reason, quotation_path, quotation_name, referred_by, referral_code, created_at)
            values (${leadId || void 0}, ${org}, ${leadCode}, ${input.name}, ${input.eventType}, ${input.eventDate}, ${input.city}, ${input.source}, ${input.status}, ${input.budget}, ${input.assignedTo}, ${input.mobile}, ${input.priority}, ${input.notes}, ${input.nextFollowupAt}, ${input.clientName}, ${input.clientMobile}, ${input.coupleName}, ${input.weddingDates}, ${input.totalClosing}, ${input.paymentMode}, ${input.advanceReceived}, ${input.receivedBy}, ${input.paymentReceivedDate}, ${input.lostReason}, ${input.quotationPath}, ${input.quotationName}, ${input.referredBy}, ${input.referralCode}, ${r?.created_at || now})
            on conflict (organization_id, lead_code) do update set
              name = excluded.name, event_type = excluded.event_type, event_date = excluded.event_date,
              city = excluded.city, source = excluded.source, status = excluded.status, budget = excluded.budget,
              assigned_to = excluded.assigned_to, mobile = excluded.mobile, priority = excluded.priority,
              notes = excluded.notes, next_followup_at = excluded.next_followup_at, client_name = excluded.client_name,
              client_mobile = excluded.client_mobile, couple_name = excluded.couple_name, wedding_dates = excluded.wedding_dates,
              total_closing = excluded.total_closing, payment_mode = excluded.payment_mode, advance_received = excluded.advance_received,
              received_by = excluded.received_by, payment_received_date = excluded.payment_received_date, lost_reason = excluded.lost_reason,
              quotation_path = excluded.quotation_path, quotation_name = excluded.quotation_name, referred_by = excluded.referred_by,
              referral_code = excluded.referral_code
          `;
        }
        for (const r of customerRows) {
          const code = String(r?.customer_code || r?.customerCode || "").trim();
          if (!code || !r?.name) continue;
          const custId = String(r?.id || "");
          if (custId) {
            await tx`
              insert into customers (id, organization_id, customer_code, lead_id, name, phone, email, city, source, created_at)
              values (${custId}, ${org}, ${code}, ${r?.lead_id || null}, ${r?.name}, ${r?.phone || null}, ${r?.email || null}, ${r?.city || null}, ${r?.source || null}, ${r?.created_at || now})
              on conflict (organization_id, customer_code) do update set
                lead_id = excluded.lead_id, name = excluded.name, phone = excluded.phone, email = excluded.email,
                city = excluded.city, source = excluded.source
            `;
          } else {
            await tx`
              insert into customers (organization_id, customer_code, lead_id, name, phone, email, city, source, created_at)
              values (${org}, ${code}, ${r?.lead_id || null}, ${r?.name}, ${r?.phone || null}, ${r?.email || null}, ${r?.city || null}, ${r?.source || null}, ${r?.created_at || now})
              on conflict (organization_id, customer_code) do update set
                lead_id = excluded.lead_id, name = excluded.name, phone = excluded.phone, email = excluded.email,
                city = excluded.city, source = excluded.source
            `;
          }
        }
        for (const r of bookingRows) {
          const code = String(r?.booking_code || r?.bookingCode || "").trim();
          if (!code || !r?.customer_id) continue;
          const bookId = String(r?.id || "");
          if (bookId) {
            await tx`
              insert into bookings (id, organization_id, booking_code, customer_id, lead_id, event_type, event_date, city, package_name, quoted_amount, status, created_at)
              values (${bookId}, ${org}, ${code}, ${r?.customer_id}, ${r?.lead_id || null}, ${r?.event_type || "Wedding"}, ${r?.event_date || null}, ${r?.city || null}, ${r?.package_name || "Custom Package"}, ${toNumber(r?.quoted_amount) ?? 0}, ${r?.status || "Confirmed"}, ${r?.created_at || now})
              on conflict (organization_id, booking_code) do update set
                customer_id = excluded.customer_id, lead_id = excluded.lead_id, event_type = excluded.event_type,
                event_date = excluded.event_date, city = excluded.city, package_name = excluded.package_name,
                quoted_amount = excluded.quoted_amount, status = excluded.status
            `;
          } else {
            await tx`
              insert into bookings (organization_id, booking_code, customer_id, lead_id, event_type, event_date, city, package_name, quoted_amount, status, created_at)
              values (${org}, ${code}, ${r?.customer_id}, ${r?.lead_id || null}, ${r?.event_type || "Wedding"}, ${r?.event_date || null}, ${r?.city || null}, ${r?.package_name || "Custom Package"}, ${toNumber(r?.quoted_amount) ?? 0}, ${r?.status || "Confirmed"}, ${r?.created_at || now})
              on conflict (organization_id, booking_code) do update set
                customer_id = excluded.customer_id, lead_id = excluded.lead_id, event_type = excluded.event_type,
                event_date = excluded.event_date, city = excluded.city, package_name = excluded.package_name,
                quoted_amount = excluded.quoted_amount, status = excluded.status
            `;
          }
        }
        for (const r of portalAccessRows) {
          if (!r?.booking_id || !r?.expires_at) continue;
          await tx`
            insert into client_portal_access (id,organization_id,booking_id,token_version,expires_at,revoked_at,closed_at,last_accessed_at,access_count,created_by,created_at,updated_at)
            values (${r?.id || void 0},${org},${r.booking_id},${Math.max(1, Number(r?.token_version || 1))},${r.expires_at},${r?.revoked_at || null},${r?.closed_at || null},${r?.last_accessed_at || null},${Math.max(0, Number(r?.access_count || 0))},${null},${r?.created_at || now},${r?.updated_at || now})
            on conflict (organization_id,booking_id) do update set token_version=excluded.token_version,expires_at=excluded.expires_at,revoked_at=excluded.revoked_at,closed_at=excluded.closed_at,last_accessed_at=excluded.last_accessed_at,access_count=excluded.access_count,created_by=excluded.created_by,updated_at=excluded.updated_at
          `;
        }
        for (const r of portalAccessLogRows) {
          if (!r?.portal_access_id || !r?.booking_id || !r?.action) continue;
          await tx`
            insert into client_portal_access_log (id,organization_id,portal_access_id,booking_id,action,detail,accessed_at)
            values (${r?.id || void 0},${org},${r.portal_access_id},${r.booking_id},${r.action},${r?.detail || ""},${r?.accessed_at || now})
            on conflict (id) do nothing
          `;
        }
        for (const r of productionRows) {
          if (!r?.booking_id) continue;
          await tx`
            insert into production_jobs (id, organization_id, booking_id, customer_id, event_segment, stage, raw_status, editing_status, album_status, video_status, delivery_status, due_date, editor, photo_count, video_count, album_count, delivered_at, client_approved_at, client_feedback_status, client_feedback_message, client_feedback_at, notes, created_at)
            values (${r?.id || void 0}, ${org}, ${r?.booking_id}, ${r?.customer_id || null}, ${r?.event_segment || r?.eventSegment || "Wedding"}, ${r?.stage || "Shoot Planning"}, ${r?.raw_status || "Pending"}, ${r?.editing_status || "Not Started"}, ${r?.album_status || "Not Started"}, ${r?.video_status || "Not Started"}, ${r?.delivery_status || "Pending"}, ${r?.due_date || null}, ${r?.editor || null}, ${toNumber(r?.photo_count) ?? 0}, ${toNumber(r?.video_count) ?? 0}, ${toNumber(r?.album_count) ?? 0}, ${r?.delivered_at || null}, ${r?.client_approved_at || null}, ${r?.client_feedback_status || null}, ${r?.client_feedback_message || null}, ${r?.client_feedback_at || null}, ${r?.notes || null}, ${r?.created_at || now})
            on conflict (booking_id,event_segment) do update set
              customer_id = excluded.customer_id, stage = excluded.stage, raw_status = excluded.raw_status,
              editing_status = excluded.editing_status, album_status = excluded.album_status,
              video_status = excluded.video_status, delivery_status = excluded.delivery_status,
              due_date = excluded.due_date, editor = excluded.editor, photo_count = excluded.photo_count,
              video_count = excluded.video_count, album_count = excluded.album_count,
              delivered_at = excluded.delivered_at, client_approved_at = excluded.client_approved_at,
              client_feedback_status = excluded.client_feedback_status, client_feedback_message = excluded.client_feedback_message,
              client_feedback_at = excluded.client_feedback_at, notes = excluded.notes
          `;
        }
        for (const r of productionActivityRows) {
          if (!r?.production_job_id || !r?.booking_id || !r?.action) continue;
          await tx`
            insert into production_activity_log (id,organization_id,production_job_id,booking_id,action,message,actor,created_at)
            values (${r?.id || void 0},${org},${r.production_job_id},${r.booking_id},${r.action},${r?.message || ""},${r?.actor || "System"},${r?.created_at || now})
            on conflict (id) do nothing
          `;
        }
        for (const r of eventRows) {
          if (!r?.title) continue;
          await tx`
            insert into calendar_events (organization_id, booking_id, customer_id, title, event_type, start_date, start_time, end_time, city, status, assigned_user_id, notes, client_name, handled_by, couple_name, contact_no, photo, video, candid, cinematic, drone, assistant, bts, slotted, date_status, tbd_month, created_at)
            values (${org}, ${r?.booking_id || null}, ${r?.customer_id || null}, ${r?.title}, ${r?.event_type || "Shoot"}, ${r?.start_date || null}, ${r?.start_time || null}, ${r?.end_time || null}, ${r?.city || null}, ${r?.status || "Scheduled"}, ${r?.assigned_user_id || null}, ${r?.notes || null}, ${r?.client_name || null}, ${r?.handled_by || null}, ${r?.couple_name || null}, ${r?.contact_no || null}, ${r?.photo || null}, ${r?.video || null}, ${r?.candid || null}, ${r?.cinematic || null}, ${r?.drone || null}, ${r?.assistant || null}, ${r?.bts || null}, ${r?.slotted === true || r?.slotted === "true"}, ${r?.date_status || "Confirmed"}, ${r?.tbd_month || null}, ${r?.created_at || now})
          `;
        }
        for (const r of paymentRows) {
          if (!r?.booking_id) continue;
          await tx`
            insert into payments (organization_id, booking_id, customer_id, amount, payment_type, status, due_date, paid_at, payment_mode, received_by, notes, created_at)
            values (${org}, ${r?.booking_id}, ${r?.customer_id || null}, ${toNumber(r?.amount) ?? 0}, ${r?.payment_type || "Advance"}, ${r?.status || "Pending"}, ${r?.due_date || null}, ${r?.paid_at || null}, ${r?.payment_mode || null}, ${r?.received_by || null}, ${r?.notes || null}, ${r?.created_at || now})
          `;
        }
        for (const r of activityRows) {
          if (!r?.lead_id || !r?.activity_type) continue;
          await tx`
            insert into lead_activities (organization_id, lead_id, activity_type, description, performed_by, created_at)
            values (${org}, ${r?.lead_id}, ${r?.activity_type}, ${r?.description || ""}, ${r?.performed_by || "System"}, ${r?.created_at || now})
          `;
        }
        for (const r of targetRows) {
          if (!r?.salesperson || !r?.target_month) continue;
          await tx`
            insert into sales_targets (organization_id, salesperson, target_month, target_amount, target_bookings, updated_at)
            values (${org}, ${r?.salesperson}, ${r?.target_month}, ${toNumber(r?.target_amount) ?? 0}, ${toNumber(r?.target_bookings) ?? 0}, ${r?.updated_at || now})
            on conflict (organization_id, salesperson, target_month) do update set
              target_amount = excluded.target_amount, target_bookings = excluded.target_bookings, updated_at = excluded.updated_at
          `;
        }
        for (const r of photographerRows) {
          if (!r?.name || !r?.mobile) continue;
          await tx`
            insert into photographer_details (organization_id, name, mobile, living_in, work, status, created_at)
            values (${org}, ${r?.name}, ${r?.mobile}, ${r?.living_in || null}, ${r?.work || null}, ${r?.status || "Active"}, ${r?.created_at || now})
          `;
        }
      });
      return json({ ok: true, restored: { leads: leadRows.length, customers: customerRows.length, bookings: bookingRows.length, payments: paymentRows.length, production: productionRows.length, productionActivities: productionActivityRows.length, clientPortalAccess: portalAccessRows.length, clientPortalAccessLog: portalAccessLogRows.length, events: eventRows.length } });
    }

    if (request.method === "GET" && pathname === "/api/backup/auto/list") {
      const rows = await sql`select id, backup_name as "backupName", backup_type as "backupType", row_counts as "rowCounts", created_at as "createdAt", expires_at as "expiresAt", retention_days as "retentionDays" from auto_backups where organization_id = ${org} order by created_at desc limit 50`;
      return json({ backups: rows.map(parseAutoBackupRow).filter(Boolean) });
    }
    if (request.method === "GET" && pathname === "/api/backup/auto/latest") {
      const [latest] = await sql`select id, backup_name as "backupName", backup_type as "backupType", row_counts as "rowCounts", backup_data as "backupData", created_at as "createdAt", expires_at as "expiresAt", retention_days as "retentionDays" from auto_backups where organization_id = ${org} order by created_at desc limit 1`;
      if (!latest) return json({ error: "No auto-backup found" }, 404);
      const row = parseAutoBackupRow(latest);
      const backupData = env?.BACKUP_ENCRYPTION_KEY ? await backupAtRestDecrypt(latest.backupData, env.BACKUP_ENCRYPTION_KEY) : latest.backupData;
      return json({ backup: { ...row, backupData } });
    }
    if (request.method === "POST" && pathname === "/api/backup/auto/trigger") {
      const result = await createAutoBackup(sql, org, { backupType: "manual" }, env);
      const [cfg] = await sql`select coalesce(max(auto_backup_retention_count),7) as cnt from backup_configs where organization_id = ${org}`;
      await pruneAutoBackups(sql, org, cfg?.cnt || 7);
      return json({ ok: true, backup: result });
    }
    const autoBackupIdMatch = pathname.match(/^\/api\/backup\/auto\/([0-9a-f-]{36})$/i);
    if (autoBackupIdMatch && request.method === "DELETE") {
      const [deleted] = await sql`delete from auto_backups where id = ${autoBackupIdMatch[1]} and organization_id = ${org} returning id`;
      if (!deleted) return json({ error: "Backup not found" }, 404);
      return json({ ok: true, deleted: deleted.id });
    }
    if (request.method === "GET" && pathname === "/api/backup/auto/config") {
      const [config] = await sql`select auto_backup_enabled as "enabled", auto_backup_interval_hours as "intervalHours", auto_backup_retention_count as "retentionCount", last_backup_at as "lastBackupAt" from backup_configs where organization_id = ${org}`;
      return json({ config: config || null });
    }
    if (request.method === "POST" && pathname === "/api/backup/auto/config") {
      const body = await readJson(request);
      const intervalHours = Number(body?.intervalHours || body?.interval_hours || 24);
      const retentionCount = Number(body?.retentionCount || body?.retention_count || 7);
      const enabled = body?.enabled === true || body?.enabled === undefined;
      if (intervalHours < 1 || intervalHours > 168) return json({ error: "Interval must be between 1 and 168 hours." }, 400);
      if (retentionCount < 1 || retentionCount > 90) return json({ error: "Retention count must be between 1 and 90." }, 400);
      await sql`insert into backup_configs (organization_id, auto_backup_enabled, auto_backup_interval_hours, auto_backup_retention_count, last_backup_at, updated_at)
        values (${org}, ${enabled}, ${intervalHours}, ${retentionCount}, ${sql.types.timestamptz(null)}, now())
        on conflict (organization_id) do update set auto_backup_enabled = ${enabled}, auto_backup_interval_hours = ${intervalHours}, auto_backup_retention_count = ${retentionCount}, updated_at = now()`;
      return json({ ok: true, config: { enabled, intervalHours, retentionCount } });
    }

    return json({ error: "Not found" }, 404);
  } finally {
    await closeDatabase(sql);
  }
}
__name(driveApi, "driveApi");
var ALLOWED_PAYMENT_TYPES = ["Advance", "First Shoot", "Wedding Day", "Final Delivery", "Balance", "Full Payment", "Refund"];
var ALLOWED_PAYMENT_MODES = ["UPI/Gpay", "Bank Transfer", "Cash", "Cheque", "Other"];
var ALLOWED_PAYMENT_STATUSES = ["Paid", "Pending", "Overdue"];
var PRODUCTION_STAGES = ["Shoot Planning", "Shoot Completed", "Editing", "Album Design", "Client Approval", "Ready for Delivery", "Delivered"];
var EVENT_STATUSES = ["Scheduled", "Confirmed", "In Progress", "Completed", "Cancelled"];
function canWriteDepartment(user, department) {
  return user?.role === "Administrator" || normalizeDepartmentAccess(user?.department_access, user?.role)[department] === "full";
}
__name(canWriteDepartment, "canWriteDepartment");
function toNumber(value) {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
__name(toNumber, "toNumber");
function toBoolean(value) {
  return value === true || value === 1 || String(value).toLowerCase() === "true" || String(value) === "1";
}
__name(toBoolean, "toBoolean");
function uuidOrNull(value) {
  return /^[0-9a-f-]{36}$/i.test(String(value || "")) ? String(value) : null;
}
__name(uuidOrNull, "uuidOrNull");
function eventInput(body, existing = {}) {
  const raw = body || {};
  const dateStatus = raw.dateStatus === "TBD Month" ? "TBD Month" : "Confirmed";
  const tbdMonth = dateStatus === "TBD Month" ? String(raw.tbdMonth ?? raw.tbd_month ?? existing.tbd_month ?? "").trim() : "";
  const startDate = dateStatus === "TBD Month" ? tbdMonth ? tbdMonth + "-01" : "" : String(raw.startDate ?? raw.start_date ?? existing.start_date ?? "").trim();
  const title = String(raw.title ?? [raw.clientName ?? raw.client_name ?? existing.client_name, raw.eventType ?? raw.event_type ?? existing.event_type ?? "Shoot"].filter(Boolean).join(" / ") ?? "").trim();
  const startTime = String(raw.startTime ?? raw.start_time ?? existing.start_time ?? "").trim() || null;
  const endTime = String(raw.endTime ?? raw.end_time ?? existing.end_time ?? "").trim() || null;
  return {
    title,
    eventType: String(raw.eventType ?? raw.event_type ?? existing.event_type ?? "Shoot").trim(),
    startDate,
    startTime,
    endTime,
    city: raw.city ?? existing.city ?? null,
    status: String(raw.status ?? existing.status ?? "Scheduled"),
    assignedUserId: uuidOrNull(raw.assignedUserId ?? raw.assigned_user_id ?? existing.assigned_user_id),
    notes: raw.notes ?? existing.notes ?? "",
    clientName: raw.clientName ?? raw.client_name ?? existing.client_name ?? "",
    handledBy: raw.handledBy ?? raw.handled_by ?? existing.handled_by ?? "",
    coupleName: raw.coupleName ?? raw.couple_name ?? existing.couple_name ?? "",
    contactNo: raw.contactNo ?? raw.contact_no ?? existing.contact_no ?? "",
    photo: raw.photo ?? existing.photo ?? "",
    video: raw.video ?? existing.video ?? "",
    candid: raw.candid ?? existing.candid ?? "",
    cinematic: raw.cinematic ?? existing.cinematic ?? "",
    drone: raw.drone ?? existing.drone ?? "",
    assistant: raw.assistant ?? existing.assistant ?? "",
    bts: raw.bts ?? existing.bts ?? "",
    slotted: toBoolean(raw.slotted ?? existing.slotted),
    dateStatus,
    tbdMonth,
    bookingId: uuidOrNull(raw.bookingId ?? raw.booking_id ?? existing.booking_id),
    customerId: uuidOrNull(raw.customerId ?? raw.customer_id ?? existing.customer_id)
  };
}
__name(eventInput, "eventInput");
function photographerInput(body, existing = {}) {
  const raw = body || {};
  return {
    name: String(raw.name ?? existing.name ?? "").trim(),
    mobile: String(raw.mobile ?? existing.mobile ?? "").trim(),
    livingIn: raw.livingIn ?? raw.living_in ?? existing.living_in ?? "",
    work: String(raw.work ?? existing.work ?? "").trim(),
    status: String(raw.status ?? existing.status ?? "In-House")
  };
}
__name(photographerInput, "photographerInput");
function paymentInput(body, existing = {}) {
  const raw = body || {};
  const status = String(raw.status ?? existing.status ?? "Paid");
  return {
    bookingId: uuidOrNull(raw.bookingId ?? raw.booking_id ?? existing.booking_id),
    amount: toNumber(raw.amount),
    paymentType: String(raw.paymentType ?? raw.payment_type ?? existing.payment_type ?? "Advance"),
    status,
    paymentMode: raw.paymentMode ?? raw.payment_mode ?? existing.payment_mode ?? "",
    receivedBy: raw.receivedBy ?? raw.received_by ?? existing.received_by ?? "",
    notes: raw.notes ?? existing.notes ?? "",
    dueDate: raw.dueDate ?? raw.due_date ?? existing.due_date ?? null,
    paidAt: status === "Paid" ? raw.paidAt ?? raw.paid_at ?? existing.paid_at ?? (/* @__PURE__ */ new Date()).toISOString() : null
  };
}
__name(paymentInput, "paymentInput");
function productionInput(body, existing = {}) {
  const raw = body || {};
  const stage = String(raw.stage ?? existing.stage ?? "Shoot Planning");
  const isDelivered = stage === "Delivered";
  return {
    stage,
    editor: raw.editor ?? existing.editor ?? "",
    dueDate: raw.dueDate ?? raw.due_date ?? existing.due_date ?? null,
    rawStatus: String(raw.rawStatus ?? raw.raw_status ?? existing.raw_status ?? "Pending"),
    editingStatus: String(raw.editingStatus ?? raw.editing_status ?? existing.editing_status ?? "Not Started"),
    albumStatus: String(raw.albumStatus ?? raw.album_status ?? existing.album_status ?? "Not Started"),
    videoStatus: String(raw.videoStatus ?? raw.video_status ?? existing.video_status ?? "Not Started"),
    deliveryStatus: isDelivered ? "Delivered & Closed" : String(raw.deliveryStatus ?? raw.delivery_status ?? existing.delivery_status ?? "Pending"),
    photoCount: toNumber(raw.photoCount ?? raw.photo_count ?? existing.photo_count) ?? 0,
    videoCount: toNumber(raw.videoCount ?? raw.video_count ?? existing.video_count) ?? 0,
    albumCount: toNumber(raw.albumCount ?? raw.album_count ?? existing.album_count) ?? 0,
    notes: raw.notes ?? existing.notes ?? "",
    deliveredAt: isDelivered ? raw.deliveredAt ?? raw.delivered_at ?? existing.delivered_at ?? (/* @__PURE__ */ new Date()).toISOString() : null
  };
}
__name(productionInput, "productionInput");
async function productionDeliveryEligibility(sql, job, organizationId) {
  const [account] = await sql`
    select b.quoted_amount,
      coalesce(sum(case when p.status = 'Paid' and p.payment_type <> 'Refund' then p.amount else 0 end), 0)::numeric as received,
      coalesce(sum(case when p.status = 'Paid' and p.payment_type = 'Refund' then p.amount else 0 end), 0)::numeric as refunded
    from bookings b
    left join payments p on p.booking_id = b.id and p.organization_id = b.organization_id
    where b.id = ${job.booking_id} and b.organization_id = ${organizationId}
    group by b.id`;
  const total = Math.max(0, Number(account?.quoted_amount || 0));
  const received = Math.max(0, Number(account?.received || 0) - Number(account?.refunded || 0));
  const balance = Math.max(0, total - received);
  const approved = job.client_feedback_status === "Approved" && Boolean(job.client_approved_at);
  return { approved, total, received, balance, canDeliver: approved && balance < 0.01 };
}
__name(productionDeliveryEligibility, "productionDeliveryEligibility");
async function recordProductionActivity(sql, { organizationId, jobId, bookingId, action, message = "", actor = "System" }) {
  await sql`insert into production_activity_log (organization_id,production_job_id,booking_id,action,message,actor) values (${organizationId},${jobId},${bookingId},${String(action || "Update").slice(0, 80)},${String(message || "").slice(0, 2000)},${String(actor || "System").slice(0, 160)})`;
}
__name(recordProductionActivity, "recordProductionActivity");
async function recordBookingProductionActivity(sql, organizationId, bookingId, action, message, actor) {
  const jobs = await sql`select id,booking_id from production_jobs where organization_id=${organizationId} and booking_id=${bookingId}`;
  for (const job of jobs) await recordProductionActivity(sql, { organizationId, jobId: job.id, bookingId: job.booking_id, action, message, actor });
}
__name(recordBookingProductionActivity, "recordBookingProductionActivity");
async function clientPortalBookingClosed(sql, organizationId, bookingId) {
  const [summary] = await sql`select count(*)::int as total,count(*) filter (where stage='Delivered')::int as delivered from production_jobs where organization_id=${organizationId} and booking_id=${bookingId}`;
  return Number(summary?.total || 0) > 0 && Number(summary?.delivered || 0) === Number(summary?.total || 0);
}
__name(clientPortalBookingClosed, "clientPortalBookingClosed");
async function recordClientPortalAccess(sql, access, action, detail = "") {
  await sql`insert into client_portal_access_log (organization_id,portal_access_id,booking_id,action,detail) values (${access.organization_id},${access.id},${access.booking_id},${String(action || "Portal Access").slice(0, 100)},${String(detail || "").slice(0, 1000)})`;
}
__name(recordClientPortalAccess, "recordClientPortalAccess");
async function closeClientPortalIfDelivered(sql, organizationId, bookingId) {
  if (!bookingId || !await clientPortalBookingClosed(sql, organizationId, bookingId)) return null;
  const [access] = await sql`update client_portal_access set closed_at=now(),updated_at=now() where organization_id=${organizationId} and booking_id=${bookingId} and closed_at is null returning *`;
  if (access) await recordClientPortalAccess(sql, access, "Portal Closed", "Project delivered and closed. Client Portal access was locked automatically.");
  return access || null;
}
__name(closeClientPortalIfDelivered, "closeClientPortalIfDelivered");
async function validateClientPortalAccess(sql, claims, { recordOpen = false } = {}) {
  const bookingId = uuidOrNull(claims?.booking), organizationId = uuidOrNull(claims?.org);
  if (!bookingId || !organizationId) return { error: "Invalid portal link", status: 401 };
  let [access] = await sql`select * from client_portal_access where organization_id=${organizationId} and booking_id=${bookingId} limit 1`;
  if (!access) {
    const expiresAt = new Date(Number(claims?.exp || Math.floor(Date.now() / 1000)) * 1000).toISOString();
    [access] = await sql`insert into client_portal_access (organization_id,booking_id,token_version,expires_at) values (${organizationId},${bookingId},${Number(claims?.portalVersion || 1)},${expiresAt}) on conflict (organization_id,booking_id) do nothing returning *`;
    if (!access) [access] = await sql`select * from client_portal_access where organization_id=${organizationId} and booking_id=${bookingId} limit 1`;
  }
  if (!access) return { error: "Portal access record was not found", status: 401 };
  if (await clientPortalBookingClosed(sql, organizationId, bookingId)) {
    [access] = await sql`update client_portal_access set closed_at=coalesce(closed_at,now()),updated_at=now() where id=${access.id} and organization_id=${organizationId} and booking_id=${bookingId} returning *`;
  }
  if (access.closed_at) return { error: "This Client Portal is closed because the project has been delivered and closed.", status: 410 };
  if (access.revoked_at) return { error: "This Client Portal link has been revoked. Please request a new link from your studio.", status: 401 };
  if (new Date(access.expires_at).getTime() <= Date.now()) return { error: "This Client Portal link has expired. Please request a new link from your studio.", status: 401 };
  if (Number(claims?.portalVersion || 1) !== Number(access.token_version || 1)) return { error: "This Client Portal link is no longer active. Please use the latest link from your studio.", status: 401 };
  if (recordOpen) {
    [access] = await sql`update client_portal_access set last_accessed_at=now(),access_count=access_count+1,updated_at=now() where id=${access.id} and organization_id=${organizationId} and booking_id=${bookingId} returning *`;
    await recordClientPortalAccess(sql, access, "Portal Opened", "Client opened the secure portal.");
  }
  return { access };
}
__name(validateClientPortalAccess, "validateClientPortalAccess");
function clientPortalAccessStatus(access, closed = false) {
  if (!access) return "Not Generated";
  if (closed || access.closed_at) return "Closed";
  if (access.revoked_at) return "Revoked";
  if (new Date(access.expires_at).getTime() <= Date.now()) return "Expired";
  return "Active";
}
__name(clientPortalAccessStatus, "clientPortalAccessStatus");
async function ensureOrganizationProfileSchema(sql) {
  await sql`alter table organization_profiles add column if not exists logo_url text`;
  await sql`alter table organization_profiles add column if not exists contact_phone text`;
  await sql`alter table organization_profiles add column if not exists whatsapp_number text`;
  await sql`alter table organization_profiles add column if not exists contact_email text`;
  await sql`alter table organization_profiles add column if not exists studio_address text`;
  await sql`alter table organization_profiles add column if not exists document_header text`;
  await sql`alter table organization_profiles add column if not exists document_footer text`;
  await sql`alter table organization_profiles add column if not exists studio_slug text`;
  await sql`create unique index if not exists organization_profiles_studio_slug_key on organization_profiles (studio_slug) where studio_slug IS NOT NULL`;
}
__name(ensureOrganizationProfileSchema, "ensureOrganizationProfileSchema");
async function ensureTenantRelationshipConstraints(sql) {
  await sql`create table if not exists tenant_constraint_audit (
    constraint_name text primary key,
    table_name text not null,
    status text not null,
    diagnostic text,
    checked_at timestamptz not null default now()
  )`;
  for (const table of ["users", "leads", "customers", "bookings", "production_jobs", "calendar_events", "payments", "production_activity_log", "client_portal_access"]) {
    await sql.unsafe(`create unique index if not exists ${table}_organization_id_id_key on ${table} (organization_id, id)`);
  }
  const constraints = [
    ["customers", "customers_tenant_lead_fk", "lead_id", "leads", "on delete set null"],
    ["bookings", "bookings_tenant_customer_fk", "customer_id", "customers", "on delete cascade"],
    ["bookings", "bookings_tenant_lead_fk", "lead_id", "leads", "on delete set null"],
    ["production_jobs", "production_jobs_tenant_booking_fk", "booking_id", "bookings", "on delete cascade"],
    ["production_jobs", "production_jobs_tenant_customer_fk", "customer_id", "customers", "on delete cascade"],
    ["calendar_events", "calendar_events_tenant_booking_fk", "booking_id", "bookings", "on delete set null"],
    ["calendar_events", "calendar_events_tenant_customer_fk", "customer_id", "customers", "on delete set null"],
    ["calendar_events", "calendar_events_tenant_user_fk", "assigned_user_id", "users", "on delete set null"],
    ["payments", "payments_tenant_booking_fk", "booking_id", "bookings", "on delete cascade"],
    ["payments", "payments_tenant_customer_fk", "customer_id", "customers", "on delete cascade"],
    ["production_activity_log", "production_activity_tenant_job_fk", "production_job_id", "production_jobs", "on delete cascade"],
    ["production_activity_log", "production_activity_tenant_booking_fk", "booking_id", "bookings", "on delete cascade"],
    ["client_portal_access", "client_portal_tenant_booking_fk", "booking_id", "bookings", "on delete cascade"],
    ["client_portal_access", "client_portal_tenant_creator_fk", "created_by", "users", "on delete set null"],
    ["client_portal_access_log", "client_portal_log_tenant_access_fk", "portal_access_id", "client_portal_access", "on delete cascade"],
    ["client_portal_access_log", "client_portal_log_tenant_booking_fk", "booking_id", "bookings", "on delete cascade"],
    ["files", "files_tenant_lead_fk", "lead_id", "leads", "on delete cascade"]
  ];
  for (const [table, name, column, target, deleteAction] of constraints) {
    await sql.unsafe(`do $$ begin
      if not exists (select 1 from pg_constraint where conname = '${name}') then
        alter table ${table} add constraint ${name}
          foreign key (organization_id, ${column}) references ${target} (organization_id, id) ${deleteAction} not valid;
      end if;
    end $$`);
  }
  for (const [table, name] of constraints) {
    const [state] = await sql`select convalidated from pg_constraint where conname=${name} limit 1`;
    if (state?.convalidated) {
      await sql`insert into tenant_constraint_audit (constraint_name,table_name,status,diagnostic,checked_at)
        values (${name},${table},'validated',null,now())
        on conflict (constraint_name) do update set table_name=excluded.table_name,status=excluded.status,diagnostic=null,checked_at=now()`;
      continue;
    }
    try {
      await sql.unsafe(`alter table ${table} validate constraint ${name}`);
      await sql`insert into tenant_constraint_audit (constraint_name,table_name,status,diagnostic,checked_at)
        values (${name},${table},'validated',null,now())
        on conflict (constraint_name) do update set table_name=excluded.table_name,status=excluded.status,diagnostic=null,checked_at=now()`;
    } catch (error) {
      const diagnostic = String(error?.message || "Constraint validation failed").slice(0, 1000);
      operationalEvent("error", "tenant.constraint_needs_review", { constraint: name, table });
      await sql`insert into tenant_constraint_audit (constraint_name,table_name,status,diagnostic,checked_at)
        values (${name},${table},'needs_review',${diagnostic},now())
        on conflict (constraint_name) do update set table_name=excluded.table_name,status=excluded.status,diagnostic=excluded.diagnostic,checked_at=now()`;
    }
  }
}
__name(ensureTenantRelationshipConstraints, "ensureTenantRelationshipConstraints");
let cloudSchemaVerified = false;
async function ensureCloudSchema(sql) {
  await sql`create table if not exists integrations (
    id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id) on delete cascade,
    provider text not null, encrypted_credentials jsonb not null, settings jsonb not null default '{}'::jsonb,
    connected_by uuid references users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
    unique (organization_id, provider)
  )`;
  await sql`create table if not exists files (
    id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id) on delete cascade,
    lead_id uuid references leads(id) on delete cascade, drive_file_id text not null, drive_folder_id text,
    file_name text not null, mime_type text, size_bytes bigint, uploaded_by uuid references users(id),
    created_at timestamptz not null default now()
  )`;
  await sql`create table if not exists customers (
    id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id) on delete cascade,
    customer_code text not null, lead_id uuid references leads(id) on delete set null, name text not null, phone text,
    email text, city text, source text, created_at timestamptz not null default now(),
    unique (organization_id, customer_code), unique (organization_id, lead_id)
  )`;
  await sql`create table if not exists bookings (
    id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id) on delete cascade,
    booking_code text not null, customer_id uuid not null references customers(id), lead_id uuid references leads(id),
    event_type text not null, event_date date, city text, package_name text not null default 'Custom Package',
    quoted_amount numeric(14,2) not null default 0, status text not null default 'Confirmed',
    created_at timestamptz not null default now(), unique (organization_id, booking_code)
  )`;
  await sql`create table if not exists production_jobs (
    id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id) on delete cascade,
    booking_id uuid not null unique references bookings(id) on delete cascade, customer_id uuid not null references customers(id),
    stage text not null default 'Shoot Planning', raw_status text not null default 'Pending', editing_status text not null default 'Not Started',
    album_status text not null default 'Not Started', video_status text not null default 'Not Started', delivery_status text not null default 'Pending',
    due_date date, created_at timestamptz not null default now()
  )`;
  await sql`create table if not exists calendar_events (
    id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id) on delete cascade,
    booking_id uuid references bookings(id) on delete set null, customer_id uuid references customers(id) on delete set null,
    title text not null, event_type text not null default 'Shoot', start_date date, start_time time, end_time time, city text,
    status text not null default 'Scheduled', assigned_user_id uuid references users(id), notes text, client_name text,
    handled_by text, couple_name text, contact_no text, photo text, video text, candid text, cinematic text, drone text,
    assistant text, bts text, slotted boolean not null default false, date_status text not null default 'Confirmed',
    tbd_month text, created_at timestamptz not null default now()
  )`;
  await sql`create table if not exists payments (
    id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id) on delete cascade,
    booking_id uuid not null references bookings(id) on delete cascade, customer_id uuid not null references customers(id),
    amount numeric(14,2) not null default 0, payment_type text not null default 'Advance', status text not null default 'Pending',
    due_date date, paid_at timestamptz, created_at timestamptz not null default now()
  )`;
  await sql`create table if not exists sales_targets (
    id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id) on delete cascade,
    salesperson text not null, target_month text not null, target_amount numeric(14,2) not null default 0,
    target_bookings integer not null default 0, updated_at timestamptz not null default now(),
    unique (organization_id, salesperson, target_month)
  )`;
  await sql`create table if not exists photographer_details (
    id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id) on delete cascade,
    name text not null, mobile text not null, living_in text, work text, status text not null default 'In-House',
    created_at timestamptz not null default now()
  )`;
  await sql`alter table production_jobs add column if not exists editor text`;
  await sql`alter table production_jobs add column if not exists photo_count integer not null default 0`;
  await sql`alter table production_jobs add column if not exists video_count integer not null default 0`;
  await sql`alter table production_jobs add column if not exists album_count integer not null default 0`;
  await sql`alter table production_jobs add column if not exists delivered_at timestamptz`;
  await sql`alter table production_jobs add column if not exists client_approved_at timestamptz`;
  await sql`alter table production_jobs add column if not exists client_feedback_status text`;
  await sql`alter table production_jobs add column if not exists client_feedback_message text`;
  await sql`alter table production_jobs add column if not exists client_feedback_at timestamptz`;
  await sql`alter table production_jobs add column if not exists notes text`;
  await sql`create table if not exists production_activity_log (
    id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id) on delete cascade,
    production_job_id uuid not null references production_jobs(id) on delete cascade,
    booking_id uuid not null references bookings(id) on delete cascade,
    action text not null, message text, actor text not null default 'System', created_at timestamptz not null default now()
  )`;
  await sql`create index if not exists production_activity_log_org_job_created on production_activity_log (organization_id, production_job_id, created_at desc)`;
  await sql`create table if not exists client_portal_access (
    id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id) on delete cascade,
    booking_id uuid not null references bookings(id) on delete cascade, token_version integer not null default 1,
    short_token text unique,
    expires_at timestamptz not null, revoked_at timestamptz, closed_at timestamptz,
    last_accessed_at timestamptz, access_count integer not null default 0,
    created_by uuid references users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
    unique (organization_id, booking_id)
  )`;
  await sql`alter table client_portal_access add column if not exists short_token text`;
  await sql`create unique index if not exists client_portal_access_short_token_key on client_portal_access (short_token) where short_token is not null`;
  await sql`create table if not exists client_portal_access_log (
    id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id) on delete cascade,
    portal_access_id uuid not null references client_portal_access(id) on delete cascade,
    booking_id uuid not null references bookings(id) on delete cascade,
    action text not null, detail text, accessed_at timestamptz not null default now()
  )`;
  await sql`create index if not exists client_portal_access_log_org_booking_time on client_portal_access_log (organization_id, booking_id, accessed_at desc)`;
  await sql`create table if not exists client_portal_users (
    id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id) on delete cascade,
    booking_id uuid not null references bookings(id) on delete cascade,
    email text not null, password_hash text not null, password_salt text not null, password_iterations integer not null default 100000,
    name text, phone text, status text not null default 'active',
    last_login timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
    unique (organization_id, booking_id)
  )`;
  await sql`create unique index if not exists client_portal_users_org_email_key on client_portal_users (organization_id, lower(email))`;
  await sql`create index if not exists client_portal_users_booking on client_portal_users (organization_id, booking_id)`;
  await sql`alter table production_jobs drop constraint if exists production_jobs_booking_id_key`;
  await sql`alter table production_jobs add column if not exists source_event_id uuid references calendar_events(id) on delete cascade`;
  await sql`create unique index if not exists production_jobs_source_event_id_key on production_jobs (source_event_id) where source_event_id is not null`;
  await sql`alter table production_jobs add column if not exists event_segment text`;
await sql`update production_jobs set event_segment = coalesce(nullif(event_segment, ''), 'Wedding') where event_segment is null or event_segment = ''`;
await sql`alter table production_jobs alter column event_segment set default 'Wedding'`;
await sql`alter table production_jobs alter column event_segment set not null`;
await sql`alter table production_jobs drop constraint if exists production_jobs_booking_id_key`;
await sql`create unique index if not exists production_jobs_booking_segment_unique on production_jobs (booking_id, event_segment)`;
  await sql`alter table payments add column if not exists payment_mode text`;
  await sql`alter table payments add column if not exists received_by text`;
  await sql`alter table payments add column if not exists notes text`;
  await sql`alter table calendar_events add column if not exists end_time time`;
  await sql`alter table calendar_events add column if not exists assigned_user_id uuid`;
  await sql`alter table calendar_events add column if not exists notes text`;
  await sql`alter table calendar_events add column if not exists client_name text`;
  await sql`alter table calendar_events add column if not exists handled_by text`;
  await sql`alter table calendar_events add column if not exists couple_name text`;
  await sql`alter table calendar_events add column if not exists contact_no text`;
  await sql`alter table calendar_events add column if not exists photo text`;
  await sql`alter table calendar_events add column if not exists video text`;
  await sql`alter table calendar_events add column if not exists candid text`;
  await sql`alter table calendar_events add column if not exists cinematic text`;
  await sql`alter table calendar_events add column if not exists drone text`;
  await sql`alter table calendar_events add column if not exists assistant text`;
  await sql`alter table calendar_events add column if not exists bts text`;
  await sql`alter table calendar_events add column if not exists slotted boolean not null default false`;
  await sql`alter table calendar_events add column if not exists date_status text not null default 'Confirmed'`;
  await sql`alter table calendar_events add column if not exists tbd_month text`;
  await sql`create table if not exists auto_backups (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references organizations(id) on delete cascade,
    backup_name text not null,
    backup_type text not null default 'auto',
    row_counts jsonb not null default '{}'::jsonb,
    backup_data jsonb not null,
    retention_days integer not null default 7,
    created_at timestamptz not null default now(),
    expires_at timestamptz not null,
    constraint auto_backups_type_check check (backup_type in ('auto', 'manual'))
  )`;
  await sql`create index if not exists auto_backups_org_created on auto_backups (organization_id, created_at desc)`;
  await sql`create index if not exists auto_backups_expires on auto_backups (expires_at)`;
  await sql`create table if not exists backup_configs (
    organization_id uuid primary key references organizations(id) on delete cascade,
    auto_backup_enabled boolean not null default true,
    auto_backup_interval_hours integer not null default 24,
    auto_backup_retention_count integer not null default 7,
    last_backup_at timestamptz,
    updated_at timestamptz not null default now()
  )`;
  await ensureTenantRelationshipConstraints(sql);
}
__name(ensureCloudSchema, "ensureCloudSchema");
async function ensureCloudSchemaReady(sql) {
  if (cloudSchemaVerified) return;
  const [schema] = await sql`
    select
      to_regclass('public.customers') is not null as customers,
      to_regclass('public.bookings') is not null as bookings,
      to_regclass('public.production_jobs') is not null as production_jobs,
      to_regclass('public.calendar_events') is not null as calendar_events,
      to_regclass('public.payments') is not null as payments,
      to_regclass('public.sales_targets') is not null as sales_targets,
      to_regclass('public.photographer_details') is not null as photographer_details,
      to_regclass('public.integrations') is not null as integrations,
      to_regclass('public.files') is not null as files,
      to_regclass('public.auto_backups') is not null as auto_backups,
      to_regclass('public.backup_configs') is not null as backup_configs,
      exists (select 1 from information_schema.columns where table_schema='public' and table_name='production_jobs' and column_name='source_event_id') as source_event_id,
      exists (select 1 from information_schema.columns where table_schema='public' and table_name='production_jobs' and column_name='event_segment') as event_segment,
      exists (select 1 from information_schema.columns where table_schema='public' and table_name='calendar_events' and column_name='date_status') as date_status`;
  if (schema && Object.values(schema).every(Boolean)) {
    cloudSchemaVerified = true;
    return;
  }
  throw new SchemaMigrationRequiredError("cloud workspace");
}
__name(ensureCloudSchemaReady, "ensureCloudSchemaReady");
const CLOUD_SCHEMA_VERSION = 3;
async function runCloudMigrations(sql, actor) {
  return sql.begin(async transaction => {
    await transaction`select pg_advisory_xact_lock(hashtext('lenspirecrm:cloud-schema-migrations'))`;
    await transaction`create table if not exists schema_migrations (
      version integer primary key,
      applied_at timestamptz not null default now(),
      applied_by text not null
    )`;
    const [current] = await transaction`select coalesce(max(version),0)::int as version from schema_migrations`;
    const applied = [];
    if (Number(current?.version || 0) < CLOUD_SCHEMA_VERSION) {
      await ensureAuthRateLimitSchema(transaction);
      await ensureAuthSessionSchema(transaction);
      await ensureOrganizationProfileSchema(transaction);
      await ensureCloudSchema(transaction);
      await transaction`insert into schema_migrations (version,applied_by) values (${CLOUD_SCHEMA_VERSION},${actor}) on conflict (version) do nothing`;
      applied.push(CLOUD_SCHEMA_VERSION);
    }
    authSchemaVerified = true;
    organizationProfileSchemaVerified = true;
    cloudSchemaVerified = true;
    return { currentVersion: CLOUD_SCHEMA_VERSION, applied };
  });
}
async function runTenantIsolationRehearsal(sql) {
  const rehearsalId = crypto.randomUUID();
  const prefix = `LENSPIRE_REHEARSAL_${rehearsalId}`;
  let result = null;
  try {
    await sql.begin(async transaction => {
      const [tenantA] = await transaction`insert into organizations (name) values (${prefix + "_A"}) returning id`;
      const [tenantB] = await transaction`insert into organizations (name) values (${prefix + "_B"}) returning id`;
      const [leadA] = await transaction`insert into leads (organization_id,lead_code,name,event_type,status,priority) values (${tenantA.id},${"RA-" + rehearsalId.slice(0,8)},'Tenant A rehearsal','Test','New','Medium') returning id`;
      const [leadB] = await transaction`insert into leads (organization_id,lead_code,name,event_type,status,priority) values (${tenantB.id},${"RB-" + rehearsalId.slice(0,8)},'Tenant B rehearsal','Test','New','Medium') returning id`;
      const [customerA] = await transaction`insert into customers (organization_id,customer_code,lead_id,name) values (${tenantA.id},${"CA-" + rehearsalId.slice(0,8)},${leadA.id},'Tenant A customer') returning id`;
      const [customerB] = await transaction`insert into customers (organization_id,customer_code,lead_id,name) values (${tenantB.id},${"CB-" + rehearsalId.slice(0,8)},${leadB.id},'Tenant B customer') returning id`;
      const [bookingA] = await transaction`insert into bookings (organization_id,booking_code,customer_id,lead_id,event_type,package_name,status) values (${tenantA.id},${"BA-" + rehearsalId.slice(0,8)},${customerA.id},${leadA.id},'Test','Rehearsal','Confirmed') returning id`;
      const expectForeignKeyBlock = async (savepoint, operation) => {
        await transaction.unsafe(`savepoint ${savepoint}`);
        let blocked = false;
        try {
          await operation();
        } catch (error) {
          blocked = error?.code === "23503" || /foreign key/i.test(String(error?.message || ""));
        }
        await transaction.unsafe(`rollback to savepoint ${savepoint}`);
        if (!blocked) throw new Error(`tenant_rehearsal_${savepoint}_not_blocked`);
      };
      await expectForeignKeyBlock("customer_lead", () => transaction`insert into customers (organization_id,customer_code,lead_id,name) values (${tenantB.id},${"XCL-" + rehearsalId.slice(0,8)},${leadA.id},'Forbidden cross tenant')`);
      await expectForeignKeyBlock("booking_customer", () => transaction`insert into bookings (organization_id,booking_code,customer_id,lead_id,event_type,package_name,status) values (${tenantB.id},${"XBK-" + rehearsalId.slice(0,8)},${customerA.id},${leadB.id},'Test','Forbidden','Confirmed')`);
      await expectForeignKeyBlock("portal_booking", () => transaction`insert into client_portal_access (organization_id,booking_id,token_version,expires_at) values (${tenantB.id},${bookingA.id},1,now()+interval '1 hour')`);
      await expectForeignKeyBlock("file_lead", () => transaction`insert into files (organization_id,lead_id,drive_file_id,file_name) values (${tenantB.id},${leadA.id},${"rehearsal-" + rehearsalId},'forbidden.txt')`);
      const crossTenantRead = await transaction`select id from leads where id=${leadA.id} and organization_id=${tenantB.id}`;
      const crossTenantUpdate = await transaction`update leads set name='Forbidden update' where id=${leadA.id} and organization_id=${tenantB.id} returning id`;
      const crossTenantDelete = await transaction`delete from leads where id=${leadA.id} and organization_id=${tenantB.id} returning id`;
      result = {
        foreignKeysBlocked: true,
        crossTenantReadBlocked: crossTenantRead.length === 0,
        crossTenantUpdateBlocked: crossTenantUpdate.length === 0,
        crossTenantDeleteBlocked: crossTenantDelete.length === 0,
        tenantA: tenantA.id,
        tenantB: tenantB.id
      };
      if (!Object.values(result).slice(0, 4).every(Boolean)) throw new Error("tenant_rehearsal_scope_failure");
      throw new Error("lenspire_tenant_rehearsal_rollback");
    });
  } catch (error) {
    if (error?.message !== "lenspire_tenant_rehearsal_rollback" || !result) throw error;
  }
  const [residual] = await sql`select count(*)::int as count from organizations where name like ${prefix + "%"}`;
  return { ok: Number(residual?.count || 0) === 0, rehearsalId, ...result, residualOrganizations: Number(residual?.count || 0), productionDataCommitted: false };
}
async function syncCompletedEventsToProduction(sql, organizationId, sourceEventId) {
  const events = await sql`select distinct on (e.id) e.id, e.event_type, e.start_date, coalesce(e.booking_id, fallback.id) as booking_id, coalesce(e.customer_id, fallback.customer_id) as customer_id from calendar_events e left join bookings fallback on fallback.organization_id = e.organization_id left join customers fallback_customer on fallback_customer.id = fallback.customer_id and fallback_customer.organization_id = e.organization_id where e.organization_id = ${organizationId} and e.id = ${sourceEventId} and (e.status = ${"Completed"} or (e.date_status <> ${"TBD Month"} and e.start_date < current_date)) and (e.booking_id is not null or lower(trim(coalesce(e.client_name, e.couple_name, ${""}))) = lower(trim(fallback_customer.name))) order by e.id, fallback.created_at desc`;
  for (const event of events) {
    if (!event.booking_id || !event.customer_id) continue;
    try {
    // Desktop and web can load the same workspace concurrently. If another
    // request already linked this event, it is already synchronized.
    const linked = await sql`select id from production_jobs where organization_id=${organizationId} and source_event_id=${event.id} limit 1`;
    if (linked.length) continue;
    const rawType = String(event.event_type || "Wedding").trim() || "Wedding";
    const segment = /pre[-\s]?wedding/i.test(rawType) ? "Pre-wedding" : rawType;
    const exact = await sql`select id, source_event_id from production_jobs where organization_id=${organizationId} and booking_id=${event.booking_id} and lower(event_segment)=lower(${segment}) limit 1`;
    if (exact.length) {
      if (!exact[0].source_event_id) await sql`update production_jobs set source_event_id=${event.id}, due_date=coalesce(due_date,${event.start_date || null}) where id=${exact[0].id} and organization_id=${organizationId} and booking_id=${event.booking_id} and not exists (select 1 from production_jobs where organization_id=${organizationId} and source_event_id=${event.id})`;
      continue;
    }
    // Confirmed leads historically received a generic Wedding placeholder.
    // Reuse that untouched job for the first completed non-wedding event so
    // Post Production receives one real event row instead of a duplicate.
    const placeholder = await sql`select id from production_jobs where organization_id=${organizationId} and booking_id=${event.booking_id} and source_event_id is null and event_segment=${"Wedding"} limit 1`;
    if (placeholder.length) {
      await sql`update production_jobs set event_segment=${segment}, source_event_id=${event.id}, due_date=coalesce(due_date,${event.start_date || null}) where id=${placeholder[0].id} and organization_id=${organizationId} and booking_id=${event.booking_id} and not exists (select 1 from production_jobs where organization_id=${organizationId} and source_event_id=${event.id})`;
      continue;
    }
    await sql`insert into production_jobs (organization_id, booking_id, customer_id, source_event_id, event_segment, stage, raw_status, editing_status, album_status, video_status, delivery_status, due_date) values (${organizationId}, ${event.booking_id}, ${event.customer_id}, ${event.id}, ${segment}, ${"Shoot Planning"}, ${"Pending"}, ${"Not Started"}, ${"Not Started"}, ${"Not Started"}, ${"Pending"}, ${event.start_date || null}) on conflict do nothing`;
    } catch (error) {
      // A uniqueness race during background synchronization must never prevent
      // the user from opening the CRM workspace.
      if (error?.code === "23505") continue;
      throw error;
    }
  }
}
__name(syncCompletedEventsToProduction, "syncCompletedEventsToProduction");
async function workspaceApi(request, env, pathname) {
  const sql = getDatabase(env);
  try {
    const isWorkspaceRead = request.method === "GET" && pathname === "/api/workspace";
    const claims = isWorkspaceRead ? await requireAccessClaims(request, env) : null;
    const user = isWorkspaceRead && claims ? { id: claims.sub, organization_id: claims.org, role: claims.role } : await requireUser(request, env, sql);
    if (!user) return json({ error: "Authentication required" }, 401);
    await ensureCloudSchemaReady(sql);
    const org2 = user.organization_id;
    if (request.method === "GET" && pathname === "/api/workspace") {
      const customers = await sql`
        select c.*, b.id as "bookingId", b.booking_code as "bookingCode", b.event_type as "eventType",
               b.event_date as "eventDate", b.quoted_amount as "quotedAmount", b.status as "bookingStatus"
        from customers c left join bookings b on b.customer_id = c.id and b.organization_id = c.organization_id
        where c.organization_id = ${org2} order by c.created_at desc`;
      const bookings = await sql`
        select b.*, c.name as "clientName", c.phone as "clientPhone", l.assigned_to as "salesperson", l.mobile as "leadMobile",
               coalesce(sum(case when p.status = 'Paid' and p.payment_type != 'Refund' then p.amount else 0 end), 0)::numeric as "totalPaid",
               coalesce(sum(case when p.status = 'Paid' and p.payment_type = 'Refund' then p.amount else 0 end), 0)::numeric as "totalRefunded",
               coalesce(sum(case when p.status = 'Pending' then p.amount else 0 end), 0)::numeric as "pendingAmount",
               count(p.id)::int as "paymentCount",
               min(case when p.status = 'Pending' then p.due_date end) as "nextDueDate"
        from bookings b
        left join customers c on c.id = b.customer_id and c.organization_id = b.organization_id
        left join payments p on p.booking_id = b.id and p.organization_id = b.organization_id
        left join leads l on l.id = b.lead_id and l.organization_id = b.organization_id
        where b.organization_id = ${org2}
        group by b.id, c.name, c.phone, l.assigned_to, l.mobile
        order by b.created_at desc`;
      const production = await sql`
        select p.*, c.name as "customerName", c.phone as "clientPhone", b.booking_code as "bookingCode",
               b.event_type as "eventType", b.event_date as "eventDate", b.quoted_amount as "quotedAmount",
               l.assigned_to as "salesperson", l.mobile as "leadMobile"
        from production_jobs p
        join customers c on c.id = p.customer_id and c.organization_id = p.organization_id
        join bookings b on b.id = p.booking_id and b.organization_id = p.organization_id
        left join leads l on l.id = b.lead_id and l.organization_id = p.organization_id
        where p.organization_id = ${org2} order by p.created_at desc`;
      const events = await sql`
        select e.*, coalesce(e.booking_id, fallback_booking.id) as booking_id, coalesce(e.customer_id, fallback_booking.customer_id) as customer_id, c.name as "customerName", u.display_name as "assignedPhotographer", u.role as "assignedRole"
        from calendar_events e
        left join lateral (
          select b.id, b.customer_id from bookings b join customers fc on fc.id = b.customer_id and fc.organization_id = b.organization_id
          where b.organization_id = e.organization_id and lower(trim(fc.name)) = lower(trim(coalesce(e.client_name, e.couple_name, ${""})))
          order by b.created_at desc limit 1
        ) fallback_booking on e.booking_id is null
        left join customers c on c.id = coalesce(e.customer_id, fallback_booking.customer_id) and c.organization_id = e.organization_id
        left join users u on u.id = e.assigned_user_id and u.organization_id = e.organization_id
        where e.organization_id = ${org2}
        order by case when e.date_status = 'TBD Month' then 1 else 0 end, e.start_date, e.start_time`;
      const payments = await sql`
        select p.*, b.booking_code, b.event_type, b.event_date, b.quoted_amount,
               c.name as "clientName", c.phone as "clientPhone", l.assigned_to as "salesperson", l.mobile as "leadMobile"
        from payments p
        left join bookings b on b.id = p.booking_id and b.organization_id = p.organization_id
        left join customers c on c.id = p.customer_id and c.organization_id = p.organization_id
        left join leads l on l.id = b.lead_id and l.organization_id = p.organization_id
        where p.organization_id = ${org2} order by p.created_at desc`;
      const productionActivities = await sql`
        select a.*, p.event_segment as "eventSegment", b.booking_code as "bookingCode", c.name as "customerName"
        from production_activity_log a
        join production_jobs p on p.id=a.production_job_id and p.organization_id=a.organization_id
        join bookings b on b.id=a.booking_id and b.organization_id=a.organization_id
        join customers c on c.id=p.customer_id and c.organization_id=a.organization_id
        where a.organization_id=${org2}
        order by a.created_at desc limit 500`;
      const salesTargets = await sql`
        select * from sales_targets where organization_id = ${org2} order by target_month desc, salesperson`;
      const salesExecutives = await sql`
        select id, display_name as "displayName" from users
        where organization_id = ${org2} and role in ('Sales', 'Sales Executive') and active = true order by display_name`;
      const photographers = await sql`
        select id, display_name as "displayName", role from users
        where organization_id = ${org2} and role in ('Photographer', 'Cinematographer') and active = true order by display_name`;
      const photographerDetails = await sql`
        select * from photographer_details where organization_id = ${org2} order by name`;
      return json({ customers, bookings, production, productionActivities, events, payments, salesTargets, salesExecutives, photographers, photographerDetails, asOf: (/* @__PURE__ */ new Date()).toISOString() });
    }
    const eventMatch = pathname.match(/^\/api\/events(?:\/([0-9a-f-]{36}))?$/i);
    if (eventMatch) {
      const eventId = eventMatch[1] || null;
      if (request.method === "POST" && !eventId) {
        if (!canWriteDepartment(user, "operations")) return json({ error: "Operations write access required" }, 403);
        const input = eventInput(await readJson(request));
        if (!input.title || !/^\d{4}-\d{2}-\d{2}$/.test(input.startDate || "")) return json({ error: "A title and a valid event date are required." }, 400);
        if (!EVENT_STATUSES.includes(input.status)) return json({ error: "Select a valid event status." }, 400);
        if (input.assignedUserId) {
          const [photographer] = await sql`select id from users where id = ${input.assignedUserId} and organization_id = ${org2} and active = true and role in ('Photographer', 'Cinematographer') limit 1`;
          if (!photographer) return json({ error: "Select an active photographer or cinematographer." }, 400);
        }
        const [created] = await sql`
          insert into calendar_events (organization_id, booking_id, customer_id, title, event_type, start_date, start_time, end_time, city, status, assigned_user_id, notes, client_name, handled_by, couple_name, contact_no, photo, video, candid, cinematic, drone, assistant, bts, slotted, date_status, tbd_month)
          values (${org2}, ${input.bookingId}, ${input.customerId}, ${input.title}, ${input.eventType}, ${input.startDate}, ${input.startTime}, ${input.endTime}, ${input.city}, ${input.status}, ${input.assignedUserId}, ${input.notes}, ${input.clientName}, ${input.handledBy}, ${input.coupleName}, ${input.contactNo}, ${input.photo}, ${input.video}, ${input.candid}, ${input.cinematic}, ${input.drone}, ${input.assistant}, ${input.bts}, ${input.slotted}, ${input.dateStatus}, ${input.tbdMonth})
          returning *`;
        await syncCompletedEventsToProduction(sql, org2, created.id);
        return json({ event: created }, 201);
      }
      if (request.method === "PUT" && eventId) {
        if (!canWriteDepartment(user, "operations")) return json({ error: "Operations write access required" }, 403);
        const [existing] = await sql`select * from calendar_events where id = ${eventId} and organization_id = ${org2} limit 1`;
        if (!existing) return json({ error: "Event not found" }, 404);
        const input = eventInput(await readJson(request), existing);
        if (!input.title || !/^\d{4}-\d{2}-\d{2}$/.test(input.startDate || "")) return json({ error: "A title and a valid event date are required." }, 400);
        if (!EVENT_STATUSES.includes(input.status)) return json({ error: "Select a valid event status." }, 400);
        if (input.assignedUserId) {
          const [photographer] = await sql`select id from users where id = ${input.assignedUserId} and organization_id = ${org2} and active = true and role in ('Photographer', 'Cinematographer') limit 1`;
          if (!photographer) return json({ error: "Select an active photographer or cinematographer." }, 400);
        }
        const [updated] = await sql`
          update calendar_events set title=${input.title}, event_type=${input.eventType}, start_date=${input.startDate}, start_time=${input.startTime}, end_time=${input.endTime}, city=${input.city}, status=${input.status}, assigned_user_id=${input.assignedUserId}, notes=${input.notes}, client_name=${input.clientName}, handled_by=${input.handledBy}, couple_name=${input.coupleName}, contact_no=${input.contactNo}, photo=${input.photo}, video=${input.video}, candid=${input.candid}, cinematic=${input.cinematic}, drone=${input.drone}, assistant=${input.assistant}, bts=${input.bts}, slotted=${input.slotted}, date_status=${input.dateStatus}, tbd_month=${input.tbdMonth}
          where id=${eventId} and organization_id=${org2} returning *`;
        await syncCompletedEventsToProduction(sql, org2, updated.id);
        return json({ event: updated });
      }
      if (request.method === "DELETE" && eventId) {
        if (!canWriteDepartment(user, "operations")) return json({ error: "Operations write access required" }, 403);
        const deleted = await sql`delete from calendar_events where id = ${eventId} and organization_id = ${org2} returning id`;
        if (!deleted.length) return json({ error: "Event not found" }, 404);
        return json({ ok: true });
      }
      return json({ error: "Method not allowed" }, 405);
    }
    const photographerMatch = pathname.match(/^\/api\/photographers(?:\/([0-9a-f-]{36}))?$/i);
    if (photographerMatch) {
      const photographerId = photographerMatch[1] || null;
      if (request.method === "POST" && !photographerId) {
        if (!canWriteDepartment(user, "operations")) return json({ error: "Operations write access required" }, 403);
        const input = photographerInput(await readJson(request));
        if (!input.name || !input.mobile || !input.work) return json({ error: "Photographer name, mobile and work are required." }, 400);
        if (!["In-House", "Outside"].includes(input.status)) return json({ error: "Status must be In-House or Outside." }, 400);
        const [created] = await sql`
          insert into photographer_details (organization_id, name, mobile, living_in, work, status)
          values (${org2}, ${input.name}, ${input.mobile}, ${input.livingIn}, ${input.work}, ${input.status}) returning *`;
        return json({ photographer: created }, 201);
      }
      if (request.method === "PUT" && photographerId) {
        if (!canWriteDepartment(user, "operations")) return json({ error: "Operations write access required" }, 403);
        const [existing] = await sql`select * from photographer_details where id = ${photographerId} and organization_id = ${org2} limit 1`;
        if (!existing) return json({ error: "Photographer not found" }, 404);
        const input = photographerInput(await readJson(request), existing);
        if (!input.name || !input.mobile || !input.work) return json({ error: "Photographer name, mobile and work are required." }, 400);
        if (!["In-House", "Outside"].includes(input.status)) return json({ error: "Status must be In-House or Outside." }, 400);
        const [updated] = await sql`
          update photographer_details set name=${input.name}, mobile=${input.mobile}, living_in=${input.livingIn}, work=${input.work}, status=${input.status}
          where id=${photographerId} and organization_id=${org2} returning *`;
        return json({ photographer: updated });
      }
      if (request.method === "DELETE" && photographerId) {
        if (!canWriteDepartment(user, "operations")) return json({ error: "Operations write access required" }, 403);
        const deleted = await sql`delete from photographer_details where id = ${photographerId} and organization_id = ${org2} returning id`;
        if (!deleted.length) return json({ error: "Photographer not found" }, 404);
        return json({ ok: true });
      }
      return json({ error: "Method not allowed" }, 405);
    }
    const productionActionMatch = pathname.match(/^\/api\/production\/([0-9a-f-]{36})\/(stage|deliver)$/i);
    if (productionActionMatch) {
      if (!canWriteDepartment(user, "postProduction")) return json({ error: "Post Production write access required" }, 403);
      const jobId = productionActionMatch[1], action = productionActionMatch[2].toLowerCase();
      const [job] = await sql`select * from production_jobs where id = ${jobId} and organization_id = ${org2} limit 1`;
      if (!job) return json({ error: "Production job not found" }, 404);
      if (request.method === "PUT" && action === "stage") {
        const body = await readJson(request);
        const stage = String(body?.stage || "");
        if (!PRODUCTION_STAGES.includes(stage)) return json({ error: "Select a valid production stage." }, 400);
        const isDelivered = stage === "Delivered";
        if (isDelivered) {
          const eligibility = await productionDeliveryEligibility(sql, job, org2);
          if (!eligibility.approved) return json({ error: "Final delivery is locked until the client approves the gallery in the Client Portal." }, 409);
          if (eligibility.balance >= 0.01) return json({ error: `Final delivery is locked until Accounts records full payment. Balance ₹${eligibility.balance.toLocaleString("en-IN")} is pending.` }, 409);
        }
        const [updated] = await sql`
          update production_jobs set stage=${stage}, delivery_status=${isDelivered ? "Delivered & Closed" : job.delivery_status},
            delivered_at=${isDelivered ? (/* @__PURE__ */ new Date()).toISOString() : job.delivered_at}
          where id=${jobId} and organization_id=${org2} returning *`;
        if (stage !== job.stage) await recordProductionActivity(sql, { organizationId: org2, jobId, bookingId: job.booking_id, action: isDelivered ? "Delivery Completed" : "Stage Changed", message: isDelivered ? "Final delivery completed and project closed." : `Production stage changed from ${job.stage} to ${stage}.`, actor: user.display_name || user.username || "Post Production" });
        if (isDelivered) await closeClientPortalIfDelivered(sql, org2, job.booking_id);
        return json({ job: updated });
      }
      if (request.method === "PUT" && action === "deliver") {
        const eligibility = await productionDeliveryEligibility(sql, job, org2);
        if (!eligibility.approved) return json({ error: "Final delivery is locked until the client approves the gallery in the Client Portal." }, 409);
        if (eligibility.balance >= 0.01) return json({ error: `Final delivery is locked until Accounts records full payment. Balance ₹${eligibility.balance.toLocaleString("en-IN")} is pending.` }, 409);
        const [updated] = await sql`
          update production_jobs set stage='Delivered', delivery_status='Delivered & Closed', delivered_at=${(/* @__PURE__ */ new Date()).toISOString()}
          where id=${jobId} and organization_id=${org2} returning *`;
        await recordProductionActivity(sql, { organizationId: org2, jobId, bookingId: job.booking_id, action: "Delivery Completed", message: "Final delivery completed and project closed.", actor: user.display_name || user.username || "Post Production" });
        await closeClientPortalIfDelivered(sql, org2, job.booking_id);
        return json({ job: updated });
      }
      return json({ error: "Method not allowed" }, 405);
    }
    const productionMatch = pathname.match(/^\/api\/production\/([0-9a-f-]{36})$/i);
    if (productionMatch) {
      if (request.method === "PUT") {
        if (!canWriteDepartment(user, "postProduction")) return json({ error: "Post Production write access required" }, 403);
        const jobId = productionMatch[1];
        const [existing] = await sql`select * from production_jobs where id = ${jobId} and organization_id = ${org2} limit 1`;
        if (!existing) return json({ error: "Production job not found" }, 404);
        const input = productionInput(await readJson(request), existing);
        if (!PRODUCTION_STAGES.includes(input.stage)) return json({ error: "Select a valid production stage." }, 400);
        if (input.stage === "Delivered") {
          const eligibility = await productionDeliveryEligibility(sql, existing, org2);
          if (!eligibility.approved) return json({ error: "Final delivery is locked until the client approves the gallery in the Client Portal." }, 409);
          if (eligibility.balance >= 0.01) return json({ error: `Final delivery is locked until Accounts records full payment. Balance ₹${eligibility.balance.toLocaleString("en-IN")} is pending.` }, 409);
        }
        const [updated] = await sql`
          update production_jobs set stage=${input.stage}, editor=${input.editor}, due_date=${input.dueDate},
            raw_status=${input.rawStatus}, editing_status=${input.editingStatus}, album_status=${input.albumStatus},
            video_status=${input.videoStatus}, delivery_status=${input.deliveryStatus}, photo_count=${input.photoCount},
            video_count=${input.videoCount}, album_count=${input.albumCount}, notes=${input.notes}, delivered_at=${input.deliveredAt}
          where id=${jobId} and organization_id=${org2} returning *`;
        await recordProductionActivity(sql, { organizationId: org2, jobId, bookingId: existing.booking_id, action: input.stage === "Delivered" ? "Delivery Completed" : input.stage !== existing.stage ? "Stage Changed" : "Workflow Updated", message: input.stage === "Delivered" ? "Final delivery completed and project closed." : input.stage !== existing.stage ? `Production stage changed from ${existing.stage} to ${input.stage}.` : "Production workflow or assignments updated.", actor: user.display_name || user.username || "Post Production" });
        if (input.stage === "Delivered") await closeClientPortalIfDelivered(sql, org2, existing.booking_id);
        return json({ job: updated });
      }
      return json({ error: "Method not allowed" }, 405);
    }
    const paymentMatch = pathname.match(/^\/api\/payments(?:\/([0-9a-f-]{36}))?$/i);
    if (paymentMatch) {
      const paymentId = paymentMatch[1] || null;
      if (request.method === "POST" && !paymentId) {
        if (!canWriteDepartment(user, "accounts")) return json({ error: "Accounts write access required" }, 403);
        const input = paymentInput(await readJson(request));
        if (!input.bookingId) return json({ error: "Select a booking to record this payment." }, 400);
        const [booking] = await sql`select * from bookings where id = ${input.bookingId} and organization_id = ${org2} limit 1`;
        if (!booking) return json({ error: "Booking not found" }, 404);
        if (!input.amount || input.amount <= 0) return json({ error: "Enter a valid payment amount." }, 400);
        if (!ALLOWED_PAYMENT_TYPES.includes(input.paymentType)) return json({ error: "Invalid payment type." }, 400);
        if (input.paymentMode && !ALLOWED_PAYMENT_MODES.includes(input.paymentMode)) return json({ error: "Invalid payment mode." }, 400);
        if (!ALLOWED_PAYMENT_STATUSES.includes(input.status)) return json({ error: "Invalid payment status." }, 400);
        const [created] = await sql`
          insert into payments (organization_id, booking_id, customer_id, amount, payment_type, status, payment_mode, received_by, notes, due_date, paid_at)
          values (${org2}, ${booking.id}, ${booking.customer_id}, ${input.amount}, ${input.paymentType}, ${input.status}, ${input.paymentMode}, ${input.receivedBy}, ${input.notes}, ${input.dueDate}, ${input.paidAt}) returning *`;
        await recordBookingProductionActivity(sql, org2, booking.id, "Payment Recorded", `${input.paymentType} payment ₹${Number(input.amount).toLocaleString("en-IN")} recorded as ${input.status}.`, user.display_name || user.username || input.receivedBy || "Accounts");
        return json({ payment: created }, 201);
      }
      if (request.method === "PUT" && paymentId) {
        if (!canWriteDepartment(user, "accounts")) return json({ error: "Accounts write access required" }, 403);
        const [existing] = await sql`select * from payments where id = ${paymentId} and organization_id = ${org2} limit 1`;
        if (!existing) return json({ error: "Payment not found" }, 404);
        const input = paymentInput(await readJson(request), existing);
        if (!input.amount || input.amount <= 0) return json({ error: "Enter a valid payment amount." }, 400);
        if (!ALLOWED_PAYMENT_TYPES.includes(input.paymentType)) return json({ error: "Invalid payment type." }, 400);
        if (input.paymentMode && !ALLOWED_PAYMENT_MODES.includes(input.paymentMode)) return json({ error: "Invalid payment mode." }, 400);
        if (!ALLOWED_PAYMENT_STATUSES.includes(input.status)) return json({ error: "Invalid payment status." }, 400);
        const [updated] = await sql`
          update payments set amount=${input.amount}, payment_type=${input.paymentType}, status=${input.status},
            payment_mode=${input.paymentMode}, received_by=${input.receivedBy}, notes=${input.notes},
            due_date=${input.dueDate}, paid_at=${input.paidAt}
          where id=${paymentId} and organization_id=${org2} returning *`;
        await recordBookingProductionActivity(sql, org2, existing.booking_id, "Payment Updated", `${input.paymentType} payment updated to ₹${Number(input.amount).toLocaleString("en-IN")} · ${input.status}.`, user.display_name || user.username || input.receivedBy || "Accounts");
        return json({ payment: updated });
      }
      if (request.method === "DELETE" && paymentId) {
        if (!canWriteDepartment(user, "accounts")) return json({ error: "Accounts write access required" }, 403);
        const [existing] = await sql`select * from payments where id = ${paymentId} and organization_id = ${org2} limit 1`;
        if (!existing) return json({ error: "Payment not found" }, 404);
        const deleted = await sql`delete from payments where id = ${paymentId} and organization_id = ${org2} returning id`;
        if (!deleted.length) return json({ error: "Payment not found" }, 404);
        await recordBookingProductionActivity(sql, org2, existing.booking_id, "Payment Deleted", `${existing.payment_type} payment entry ₹${Number(existing.amount || 0).toLocaleString("en-IN")} was deleted.`, user.display_name || user.username || "Accounts");
        return json({ ok: true });
      }
      return json({ error: "Method not allowed" }, 405);
    }
    if (request.method === "POST" && pathname === "/api/sales-targets") {
      if (!canWriteDepartment(user, "accounts")) return json({ error: "Accounts write access required" }, 403);
      const body = await readJson(request);
      const salesperson = String(body?.salesperson || "").trim();
      const targetMonth = String(body?.targetMonth || body?.target_month || "").trim();
      const targetAmount = toNumber(body?.targetAmount ?? body?.target_amount);
      const targetBookings = toNumber(body?.targetBookings ?? body?.target_bookings) ?? 0;
      if (!salesperson || !/^\d{4}-\d{2}$/.test(targetMonth)) return json({ error: "Salesperson and a YYYY-MM target month are required." }, 400);
      const [saved] = await sql`
        insert into sales_targets (organization_id, salesperson, target_month, target_amount, target_bookings)
        values (${org2}, ${salesperson}, ${targetMonth}, ${targetAmount ?? 0}, ${targetBookings})
        on conflict (organization_id, salesperson, target_month)
        do update set target_amount = excluded.target_amount, target_bookings = excluded.target_bookings, updated_at = now()
        returning *`;
      return json({ target: saved });
    }
    return json({ error: "Not found" }, 404);
  } finally {
    await closeDatabase(sql);
  }
}
__name(workspaceApi, "workspaceApi");
async function platformOrganizationsApi(request, env, pathname) {
  const sql = getDatabase(env);
  try {
    const user = await requireUser(request, env, sql);
    if (!user) return json({ error: "Authentication required" }, 401);
    if (user.password_upgrade_required) return json({ error: "Password upgrade required before platform administration.", code: "password_upgrade_required" }, 403);
    const [owner] = await sql`select 1 from platform_admins where user_id=${user.id} limit 1`;
    if (!owner) return json({ error: "LenspireCRM Owner access required" }, 403);
    if (request.method === "POST" && pathname === "/api/platform/migrations") {
      const result = await runCloudMigrations(sql, `owner:${user.id}`);
      operationalEvent("info", "database.migrations_completed", { version: result.currentVersion, applied: result.applied.length });
      return json({ ok: true, ...result });
    }
    await assertOrganizationProfileSchemaReady(sql);
    if (request.method === "GET" && pathname === "/api/platform/smoke-tests") {
      await ensureCloudSchemaReady(sql);
      await assertAuthSchemaReady(sql);
      const [schemaVersion] = await sql`select coalesce(max(version),0)::int as version from schema_migrations`;
      const [constraints] = await sql`select count(*)::int as total, count(*) filter (where status='validated')::int as validated, count(*) filter (where status<>'validated')::int as needs_review from tenant_constraint_audit`;
      const [workspace] = await sql`select
        (select count(*)::int from organizations) as organizations,
        (select count(*)::int from users where organization_id=${user.organization_id}) as users,
        (select count(*)::int from leads where organization_id=${user.organization_id}) as leads`;
      const [isolation] = await sql`select
        (select count(*)::int from customers c join leads l on l.id=c.lead_id where c.lead_id is not null and c.organization_id<>l.organization_id) as customer_lead,
        (select count(*)::int from bookings b join customers c on c.id=b.customer_id where b.organization_id<>c.organization_id) as booking_customer,
        (select count(*)::int from production_jobs p join bookings b on b.id=p.booking_id where p.organization_id<>b.organization_id) as production_booking,
        (select count(*)::int from client_portal_access p join bookings b on b.id=p.booking_id where p.organization_id<>b.organization_id) as portal_booking,
        (select count(*)::int from files f join leads l on l.id=f.lead_id where f.lead_id is not null and f.organization_id<>l.organization_id) as file_lead`;
      const [features] = await sql`select
        (select count(*)::int from integrations where organization_id=${user.organization_id} and provider='google_drive') as drive_integrations,
        (select count(*)::int from files where organization_id=${user.organization_id}) as file_records,
        (select count(*)::int from client_portal_access where organization_id=${user.organization_id} and revoked_at is null and expires_at>now()) as active_portals`;
      const checks = {
        migrations: Number(schemaVersion?.version || 0) >= CLOUD_SCHEMA_VERSION,
        tenantConstraints: Number(constraints?.needs_review || 0) === 0,
        tenantIsolation: Object.values(isolation || {}).every(value => Number(value || 0) === 0),
        workspaceAccess: Number(workspace?.users || 0) > 0,
        objectStorageBound: Boolean(env.STUDIO_ASSETS),
        fileMetadataReady: Number(features?.file_records || 0) >= 0,
        clientPortalReady: Number(features?.active_portals || 0) >= 0
      };
      const ok = Object.values(checks).every(Boolean);
      operationalEvent(ok ? "info" : "error", "production.smoke_tests", { ok });
      return json({ ok, checkedAt: (/* @__PURE__ */ new Date()).toISOString(), checks, schemaVersion: Number(schemaVersion?.version || 0), tenantConstraints: constraints, isolation, workspace, features });
    }
    if (request.method === "POST" && pathname === "/api/platform/tenant-rehearsal") {
      const result = await runTenantIsolationRehearsal(sql);
      operationalEvent(result.ok ? "info" : "error", "tenant.rehearsal_completed", { ok: result.ok, residualOrganizations: result.residualOrganizations });
      return json(result, result.ok ? 200 : 500);
    }
    if (request.method === "GET" && pathname === "/api/platform/tenant-integrity") {
      await ensureCloudSchemaReady(sql);
      const constraints = await sql`
        select a.constraint_name,a.table_name,
               case when c.convalidated then 'validated' else a.status end as status,
               case when c.convalidated then null else a.diagnostic end as diagnostic,
               a.checked_at
        from tenant_constraint_audit a
        left join pg_constraint c on c.conname=a.constraint_name
        order by a.table_name,a.constraint_name`;
      const needsReview = constraints.filter((item) => item.status !== "validated").length;
      return json({ ok: needsReview === 0, validated: constraints.length - needsReview, needsReview, constraints });
    }
    if (request.method === "GET" && pathname === "/api/platform/production-readiness") {
      await ensureCloudSchemaReady(sql);
      const configuration = productionConfigurationStatus(env);
      const [database] = await sql`select now() as checked_at`;
      const [tenantConstraints] = await sql`select count(*)::int as total, count(*) filter (where status='validated')::int as validated, count(*) filter (where status<>'validated')::int as needs_review from tenant_constraint_audit`;
      return json({ ok: configuration.ok && Number(tenantConstraints?.needs_review || 0) === 0, configuration, database: { reachable: true, checkedAt: database.checked_at }, tenantConstraints });
    }
    if (request.method === "GET" && pathname === "/api/platform/operations") {
      await ensureCloudSchemaReady(sql);
      await assertAuthSchemaReady(sql);
      const [auth] = await sql`select count(*) filter (where blocked_until>now())::int as blocked, count(*) filter (where updated_at>now()-interval '24 hours')::int as attempted_keys from auth_rate_limits`;
      const [sessions] = await sql`select count(*) filter (where revoked_at is null and expires_at>now())::int as active, count(*) filter (where revoked_at>now()-interval '24 hours')::int as revoked_24h from refresh_tokens`;
      const [audits] = await sql`select count(*) filter (where created_at>now()-interval '24 hours')::int as events_24h, max(created_at) as latest from audit_logs`;
      const [constraints] = await sql`select count(*) filter (where status='validated')::int as validated, count(*) filter (where status<>'validated')::int as needs_review from tenant_constraint_audit`;
      const healthy = Number(constraints?.needs_review || 0) === 0;
      return json({ ok: healthy, checkedAt: (/* @__PURE__ */ new Date()).toISOString(), authentication: auth, sessions, audits, tenantConstraints: constraints });
    }
        if (request.method === "POST" && pathname === "/api/platform/organizations") {
      const body = await readJson(request);
      const studioName = String(body?.studioName || "").trim();
      const plan = String(body?.plan || "starter").trim().toLowerCase();
      const subscriptionExpiresAt = String(body?.subscriptionExpiresAt || body?.subscription_expires_at || "").trim();
      const licenseCode = String(body?.licenseCode || body?.license_code || "").trim();
      const ownerName = String(body?.ownerName || "").trim();
      const username = String(body?.username || "").trim();
      const password = String(body?.password || "");
      if (studioName.length < 2 || studioName.length > 120 || ownerName.length < 2 || ownerName.length > 80) return json({ error: "Enter valid studio and administrator names." }, 400);
      if (!["starter","professional","enterprise"].includes(plan)) return json({ error: "Select a valid plan." }, 400);
      if (subscriptionExpiresAt && !/^\d{4}-\d{2}-\d{2}$/.test(subscriptionExpiresAt)) return json({ error: "Enter a valid subscription expiry date." }, 400);
      const generatedLicenseCode = `LENSPIRE-${(studioName.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "STUDIO")}-${(subscriptionExpiresAt.match(/^\d{4}/)?.[0] || new Date().getUTCFullYear())}`;
      const resolvedLicenseCode = licenseCode || generatedLicenseCode;
      if (resolvedLicenseCode.length > 80) return json({ error: "License code must be 80 characters or fewer." }, 400);
      if (!/^[A-Za-z0-9._-]{3,30}$/.test(username) || !isStrongPassword(password)) return json({ error: `Enter a valid username. ${strongPasswordMessage}` }, 400);
      const [existing] = await sql`select id from users where lower(username)=lower(${username}) limit 1`;
      if (existing) return json({ error: "That username is already in use." }, 409);
      const passwordData = await hashPassword(password);
      const access = { sales: "full", operations: "full", accounts: "full", postProduction: "full" };
      const created = await sql.begin(async transaction => {
        const [organization] = await transaction`insert into organizations (name) values (${studioName}) returning id,name,created_at`;
        const studioSlug = slugify(studioName);
        const [slugConflict] = await transaction`select 1 from organization_profiles where studio_slug=${studioSlug} limit 1`;
        const finalSlug = slugConflict ? `${studioSlug}-${organization.id.slice(0, 8)}` : studioSlug;
        await transaction`insert into organization_profiles (organization_id,studio_name,studio_slug,status,plan,onboarding_status,subscription_expires_at,license_code) values (${organization.id},${studioName},${finalSlug},'active',${plan},'live',${subscriptionExpiresAt || null},${resolvedLicenseCode})`;
        await transaction`insert into users (organization_id,username,display_name,role,password_hash,password_salt,password_iterations,department_access) values (${organization.id},${username},${ownerName},'Administrator',${passwordData.hash},${passwordData.salt},${passwordData.iterations},${access}::jsonb)`;
        return organization;
      });
      return json({ organization: { organizationId: created.id, studioName: created.name, status: 'active', plan, userCount: 1, subscriptionExpiresAt: subscriptionExpiresAt || null, licenseCode: resolvedLicenseCode, createdAt: created.created_at } }, 201);
    }
    const statusMatch = pathname.match(/^\/api\/platform\/organizations\/([0-9a-f-]{36})\/status$/i);
    if (request.method === "PATCH" && statusMatch) {
      const status = String((await readJson(request))?.status || "").trim().toLowerCase();
      if (!["active","paused"].includes(status)) return json({ error: "Status must be active or paused." }, 400);
      const [updated] = await sql`update organization_profiles set status=${status},updated_at=now() where organization_id=${statusMatch[1]} returning organization_id,studio_name,status,plan,created_at`;
      if (!updated) return json({ error: "Studio workspace not found." }, 404);
      return json({ organization: { organizationId: updated.organization_id, studioName: updated.studio_name, status: updated.status, plan: updated.plan, createdAt: updated.created_at } });
    }
    const subscriptionMatch = pathname.match(/^\/api\/platform\/organizations\/([0-9a-f-]{36})\/subscription$/i);
    if (request.method === "PATCH" && subscriptionMatch) {
      const body = await readJson(request);
      const plan = String(body?.plan || "").trim().toLowerCase();
      const subscriptionExpiresAt = String(body?.subscriptionExpiresAt || body?.subscription_expires_at || "").trim();
      const licenseCode = String(body?.licenseCode || body?.license_code || "").trim();
      if (!["starter", "professional", "enterprise"].includes(plan)) return json({ error: "Select a valid plan." }, 400);
      if (subscriptionExpiresAt && !/^\d{4}-\d{2}-\d{2}$/.test(subscriptionExpiresAt)) return json({ error: "Enter a valid subscription expiry date." }, 400);
      if (licenseCode.length > 80) return json({ error: "License code must be 80 characters or fewer." }, 400);
      const [updated] = await sql`update organization_profiles set plan=${plan},subscription_expires_at=${subscriptionExpiresAt || null},license_code=${licenseCode || null},updated_at=now() where organization_id=${subscriptionMatch[1]} returning organization_id,studio_name,status,plan,subscription_expires_at,license_code`;
      if (!updated) return json({ error: "Studio workspace not found." }, 404);
      return json({ organization: { organizationId: updated.organization_id, studioName: updated.studio_name, status: updated.status, plan: updated.plan, subscriptionExpiresAt: updated.subscription_expires_at, licenseCode: updated.license_code } });
    }
    const brandingMatch = pathname.match(/^\/api\/platform\/organizations\/([0-9a-f-]{36})\/branding$/i);
    if (request.method === "PATCH" && brandingMatch) {
      const body = await readJson(request);
      const logoUrl = String(body?.logoUrl || body?.logo_url || "").trim();
      const contactPhone = String(body?.contactPhone || body?.contact_phone || "").trim();
      const whatsappNumber = String(body?.whatsappNumber || body?.whatsapp_number || "").trim();
      const contactEmail = String(body?.contactEmail || body?.contact_email || "").trim();
      const studioAddress = String(body?.studioAddress || body?.studio_address || "").trim();
      const documentHeader = String(body?.documentHeader || body?.document_header || "").trim();
      const documentFooter = String(body?.documentFooter || body?.document_footer || "").trim();
      if (logoUrl && !/^https:\/\/[^\s]+$/i.test(logoUrl)) return json({ error: "Logo URL must begin with https://" }, 400);
      if (logoUrl.length > 500 || contactPhone.length > 40 || whatsappNumber.length > 40 || contactEmail.length > 254 || studioAddress.length > 1000 || documentHeader.length > 1000 || documentFooter.length > 2000) return json({ error: "One or more branding fields are too long." }, 400);
      if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) return json({ error: "Enter a valid contact email address." }, 400);
      const studioSlug = String(body?.studioSlug || body?.studio_slug || "").trim();
      if (studioSlug && !/^[a-z0-9][a-z0-9-]{1,63}[a-z0-9]$|^[a-z0-9]{2,64}$/.test(studioSlug)) return json({ error: "Studio URL slug must be 2–64 characters: lowercase letters, numbers, and hyphens only." }, 400);
      if (studioSlug) {
        const [conflict] = await sql`select 1 from organization_profiles where studio_slug=${studioSlug} and organization_id!=${brandingMatch[1]} limit 1`;
        if (conflict) return json({ error: "This studio URL slug is already taken. Choose another." }, 409);
      }
      const [updated] = await sql`update organization_profiles set logo_url=${logoUrl || null},contact_phone=${contactPhone || null},whatsapp_number=${whatsappNumber || null},contact_email=${contactEmail || null},studio_address=${studioAddress || null},document_header=${documentHeader || null},document_footer=${documentFooter || null},studio_slug=${studioSlug || null},updated_at=now() where organization_id=${brandingMatch[1]} returning organization_id,studio_name,logo_url,contact_phone,whatsapp_number,contact_email,studio_address,document_header,document_footer,studio_slug`;
      if (!updated) return json({ error: "Studio workspace not found." }, 404);
      return json({ organization: { organizationId: updated.organization_id, studioName: updated.studio_name, logoUrl: updated.logo_url, contactPhone: updated.contact_phone, whatsappNumber: updated.whatsapp_number, contactEmail: updated.contact_email, studioAddress: updated.studio_address, documentHeader: updated.document_header, documentFooter: updated.document_footer, studioSlug: updated.studio_slug } });
    }
    const logoMatch = pathname.match(/^\/api\/platform\/organizations\/([0-9a-f-]{36})\/logo$/i);
    if (request.method === "POST" && logoMatch) {
      if (!env.STUDIO_ASSETS) return json({ error: "Studio logo storage is not configured yet." }, 503);
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) return json({ error: "Choose a logo image to upload." }, 400);
      const type = String(file.type || "").toLowerCase();
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(type)) return json({ error: "Upload a PNG, JPG, or WebP logo image." }, 400);
      if (!file.size || file.size > 2 * 1024 * 1024) return json({ error: "Logo image must be 2 MB or smaller." }, 400);
      const organizationId = logoMatch[1];
      await env.STUDIO_ASSETS.put(`studio-logos/${organizationId}/logo`, await file.arrayBuffer(), { httpMetadata: { contentType: type, cacheControl: 'public, max-age=3600' } });
      const logoUrl = new URL(`/studio-assets/logo/${organizationId}`, request.url).toString();
      const [updated] = await sql`update organization_profiles set logo_url=${logoUrl},updated_at=now() where organization_id=${organizationId} returning organization_id,logo_url`;
      if (!updated) return json({ error: "Studio workspace not found." }, 404);
      return json({ organization: { organizationId: updated.organization_id, logoUrl: updated.logo_url } });
    }
if (request.method !== "GET" || pathname !== "/api/platform/organizations") return json({ error: "Not found" }, 404);
    const rows = await sql`select o.id as organization_id, coalesce(p.studio_name,o.name) as studio_name, coalesce(p.status,'active') as status, coalesce(p.plan,'starter') as plan, p.subscription_expires_at, p.license_code, p.logo_url, p.contact_phone, p.whatsapp_number, p.contact_email, p.studio_address, p.document_header, p.document_footer, o.created_at, (select count(*)::int from users u where u.organization_id=o.id) as user_count from organizations o left join organization_profiles p on p.organization_id=o.id order by o.created_at asc`;
    return json({ organizations: rows.map(row => ({ organizationId: row.organization_id, studioName: row.studio_name, status: row.status, plan: row.plan, userCount: row.user_count, subscriptionExpiresAt: row.subscription_expires_at, licenseCode: row.license_code, logoUrl: row.logo_url, contactPhone: row.contact_phone, whatsappNumber: row.whatsapp_number, contactEmail: row.contact_email, studioAddress: row.studio_address, documentHeader: row.document_header, documentFooter: row.document_footer, createdAt: row.created_at })) });
  } finally {
    await closeDatabase(sql);
  }
}
async function studioLogoAsset(request, env, organizationId) {
  if (!env.STUDIO_ASSETS) return new Response("Logo storage is unavailable", { status: 503 });
  const object = await env.STUDIO_ASSETS.get(`studio-logos/${organizationId}/logo`);
  if (!object) return new Response("Logo not found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("cache-control", "public, max-age=3600");
  headers.set("etag", object.httpEtag);
  return new Response(object.body, { headers });
}
__name(studioLogoAsset, "studioLogoAsset");
var PWA_ICON_BUFFER = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAZ4ElEQVR42u3Y+b+mdVkH8PuPaQO1UmBmYBgGGAYGGBi2mYGBGRAERFxLTc3KyjIjI7PFyExpJTMjW6zIyCwrK1NiFmgBFGQRERf88ep1ZphmmDnnPM9zzn3fz/f7vd7X6/X+MeP53tfyOdN1qup6/Z7nAmBebGGlHHIAwUGpxY/8twKA5bkWysEHQCBQ5dfr9nwrABiWa6MKOPjfDADmyzVS4xz93d8MAMrkSimHH0AQUGqlR/8bAUDdXDPl8AMIAko5+gDCgEpbr939jQAgJ1cw5eH/egDAAlfR4QdAEFAOPwCCgKr4+D8bADAL19PhB0AQUDXUa3Y/GwDQJ9e19ON/zdcCAIbgyjr8AAgCyvEHQAhQIx7+ZwIA5sk1dvwBEAKU4w+AEKB6qVdf89UAgJK51o4/AEKAcvwBEAKU4w+AEKAWO/xPBwC0wFV3/AEQAtSix//qpwMAWuTKL1G3Xv2VAICWufaOPwBCgOMPAEJAquP/VABARo4/AAgBjj8ACAFNHv8nAwA4ovnj/6qrnwwA4HgCAAAIAC0d/ycCAFia4w8AQkDlx3/XEwEATK+B4/94AACzqzoA3LLr8QAAZuf4A4AQ4PgDgBBQ5PH/cgAA/REAAEAAcPwBQAiY+/F/LACA4RQZAF6567EAAIbj+AOAEDDv4/9oAADjKSMAXPVoAADjcfwBQAiYRwD4UgAA43P8AUAIGKduvupLAQDM38gB4IsBAMyf4w8AQoAAAAACgOMPAELAygPAIwEAlMfxBwAhoL+66apHAgAoV//H/8qHAwAonwAAAAKAAAAAAsBMx/+hAADqIQAAgAAwe9145UMBANRnlQHgfwMAqI8AAAACgOMPAELAsgHgfwIAqJfjDwBCgAAAAALAIvWKnf8dAED9HH8AEAIEAAAQAAQAAMgeAP4rAIB2OP4AIAQIAAAgAHRdd8POBwMAaI8AAAACgOMPAKlDwA07HwgAoF0CAAAIAM8HgB0PBADQruOO//U7DgQA0D4BAAAEAA8CAAkDwP4AANonAACAAOBBACBhANgXAED7/v/4v3zHvgDyWSjvADkJAFDx8S6lfA8QAIAGD7yAAM0GgL0BzE/G8t1hvg4FgO17AxiHWiYU6A8YjQAADr5AAHkDwP0B9EMNGQj0F/TlYAC4bvv9AaycGr/0HayOAACOvjAAeQPAfwYwmaohDOhTmIYAAI6+MAACAODwCwKQKADcF8B9LmWKMKDPYYEAAA6/IAAZA8C12+8LmNUXH/529b9BqcNlpsmou3b7FwKWs3Dsp1XD71Fq6SBg3smju/aKLwQsZpbDf1wQKPD3KDV1EDD/JCAA0PvxLy0EKCUIgADASMe/hBCglCAAywaAzwcc1ufxPxICxv0NSg0XBOwI2tHtueLzAXsGOv6HjfUblBq67ApaIQAw+PEfIwQ4RvPj7aHaAPAfAeMEgP7/u3Mcmnr7yveBcgkAjHL8+w4BjolQ4NuBAECyAOBoCAS+J/QSAD4X5DZuAFj5f2cbB0K/+c5QBgGAKgKAQyAQ+PbQcwDYfcXngtweefjbo5n1v63G0lPD0Q/Qn2735f8e5PXIw8+Nbtr/tqqWvF4anf6A1REAKO74W+q0GgZ8KwQABICKF7meEQT0D40EgH8Lchs3ACz931H+4tYrtdBLMJkAwNwDgEVN1jDg+yAAkDYAWMxkDwK+DXMLANdc/q8BYxz/Y/9/llh6oX36Dg4RABg9AFjACAL6EAGAJCGg1KXru6MnEQBgoBBQ4qL1rSk5CPgejBQAPhtwtH6P/6H/zXIWq+/L8vQqWXTXXPbZgGM98tBzq3b4f6uYheq7MiU9SwYCAIOEAEsUQUAPU3gAuPqyfwlYziyH//D/TQnl29EX/UyLBABWHAosS4QAfY0AAEUsSd8APQ5TB4B/DujD/Bejb4Beh2kJAFS/EL0/+h4EACxB0P8wTQDYddk/BazUPMv7Yw7MASsnAFDd0vP2mAkzgQCARQdmw2ywsgDwmYBZzG/BeXvMiBmhL92uSz8TMK25LDXvjnkxL/ROAMAyA3ODAACWGJgfUgSAqy79x4BJxi5vjhkyQwxLAMDiArOEAAAWFpgpkgSAfwhYzLhLyntjvswXYxIAsJwSe/DA172DOUMAAEup5kM+Nu9u3qg+AHw64GjjLSNvvRLzOPbThwLfx8xRi+7KSz8dcNhY5a2nU/Kxn5bvaPYokwCABeTgCwRmkJQB4JK/Dxht8Xjr42Q4+kuGAd/fLDI3AgCjLR3v7OgLA+YRAQB/cTj8CAJmkvkGgE8FeY23aPK+saO+mjBgNs0mQxEALBgLppHD77eZUTPKTAFg5yWfCnIaozK+69DH0G83p+aUPnQ7L/m7IJ9xlkquNx3u6HmTlt7EvFIKAcDxt0wKPHLeSRAwtwgAVLdIHH7HzNuZXQQA/BXheDlc3tP8UmYAuDfIYZzl0fYbPnjg2VXTi97XHFOCbscl9wY5DF0tv10fh0kPem+zTEm6HdvuDdo3+MJo+O1WfYj0n7c30xSo27Htb4O2jVEtvtvqj4/e8y3MNeUSAAQAS6Lng6PnfBezjQCABeHA4DuZcUoNAJ8M2jXsYmjrrVZ+UPSZb2bOqY8A4PhbDA6Jb2fWhYCMAWD7tk8GbRqyWnqnBw48OzP95Tuad2rXbd/2N0F7hl0G7bzTyo6G/vI9zT31EwAc/5SLwOEXBFr8vmYfAUAAsAAcByFACDD/TAoA9wTtGHb463+flR0FfeV72wMt7QEOEQAEgDSD7/ALAlm+vT3AdAHg4nuCNgw69JW/zcwHQD81J1sP2AdM0l1x8T1BG4asmt9l1sWvl9qVqRfsAybprrj4r4P6DTvs9b7LAwe+NhO91L5MPWEvsBwBQABw/B1/IUAIEAAEAAx4G0Pu8KNP7AcmBoC/Cuo23HDX+R6zLXX9k12GfrEjWIwA4PinDQD6hyw9Y08gAAgAjr/jjxBgV3AoAFx+8V8G9RqqanyLaRe4viFjD9kVHEsAcPxTHX8BgMx9ZGcgAAgATQ2z449+sjNYUQD4RFCf4Qa5rneYbVnrG/SV3cFh3eUXfSKoz2BDXNk7TL2k9Qx6y+7gBQQAAcDxByFAAMgYAC676C+CugxVNb3BAweemYp+Qa/ZISxOABAAqhxcAQC9Zo8gADj+/vp3/NFzdgmzB4A/D+ox3NDW8funX8R6Bb1nl7AcAUAAaG4J6xP0n32CAOD4++sf9KCdggAgADj+oBftFQ4GgEsv+rOgDkNULb/9wIFnJtIj6Ed7hekJAIa0iWUrAKAn7RcEAAHAX/+gL+0XJgaArX8alG+QAa3gdx/Y/8xE+gP9ab8wOwHAcFqwoD+FAAEAg2m5gn8FEACSBICPB2UbZjDL/93TLVb9gT61Z1iJ7pKtHw/KNUTV8LunWar6A/1q37ByAoCBtFBBvwoAOQPAnwTlGmYgy/7NB/Z/dSK9gb61b1gdASDZQFqkoG/tHAQAadwSBf3rXwHyBoC7gzINM4hl/+bpFqjeQP/aO6xWt23r3UGZhqjSf/Ok5akv0MP2Dv0QABINYu2LUwCghQCQMQToi1IDwIV3B+UZJIUX/psnLk19QSVq7+WM+yejbtuFfxyUZ5gBLPf3TvVXk76gErX3c7b9k5UAYAAtTNDPAoAAQKsDWPvC1BO0FgLsIAoIAB8LytP/8JX7W6f7a0lPUJfa+zrTDsqqu/jCjwVlGaJK/r3TLEp9MVyveQd9bQ/lJAAYvOIXpZ6YXz95v7y9LQCkCAB/FJSl/6Er97dO91eSnph3D5XeR/rbLmJ2AoChsyD1jUWuvwUAAQBDV9aC1A/lHX/LPE+P65nmA8BHg3IMs6jL/b0H9j+9LD0xfr+01F963D5iaQKAgSt2MQoAZR9+i739PtcnjQeAiy74aFCOvqvk3zppKeqHcXokS7/pdTuJF+ouuuAPg3L0P2zl/tbJS1E/DN0fw4QA36mlXtcf7RIADJul6Phb8nrdThIAMGyWouNv0et1ASBJAPhIUI7+h63M3zl5IeqFoXpi3BDg+9Xe83qiXQKAYbMMHX8hQM8LAAIArS17y1BPCAB63l5i0QCw9YKPBGXou0r+rfv3P70s/dDG8a+hF/W83ZRVt/WCPwjK0P+QlftbJy9D/dBWAPA9a+55/dAmAcCQFbcIBYC2jr+lX3/f6wUBAEPmr3/H3+JP2Pv6oNkAcFdQhv6HrMzfuX//V5alD1oOALm/ba29rw/a1G09/66gDL0PWaG/c+IS1AftBoDk37bW3tcHbeouPP+uoAx9V6m/c9IS1ANtV+bvW2vv64E2dRee//tBGfofsjJ/5+QlqAfaDgB5v2+tva8H2iQAGDJLUAAQAPS+3SQAYMgsQcdfCND7AkCSAPB7QRn6H7Iyf+fkJej7tx8Acn7jWnvf92+TAGDILEEBQADQ+3aTAIAhswQFAAFA7wsAKQLABef/blCGvqvU3zlpCfr+7VfWb1xr7/v+bRIADJklKAAIAHrfbhIAMGSWoAAgAOh9AUAAoOrlX+MCzBoAMpYAUE//+/6tBoAtvxOUofcBK/R3TlyAvn/7xz/pN661933/NgkAhswSFAAEAL1vNwkAGDJLUAAQAPS+AJAiAJy/5beDMvRdpf7O/fufWpbv335l/ca19r7v3yYBwJBZggKAAKD37SYBAENmCQoAAoDeFwCSBIDfCsrQ/5CV+TsnL0Hfv/0AkPMb19r7vn+bBABDZgkKAY6/3rebBAAMmSUoAAgAel8ASBIA7gzK0P+Qlfk7Jy9BPdB2AMj7fWvtfT3Qpm7LljuDMvRdpf7OSUtQH7Rb2b9trb2vD9rUbTnvzqAMvQ9Zob9z/76nlqUPGg4Ayb9trb2vD9rUbTnvw0EZ+h+yMn/n5CWoD9oNALm/ba29rw/aJAAYsuKWoBDwYcc/4fEXABAALP0UQyYA5AoBvmfdPa8fmg0AHwrK0P+QlftbJy9D/dBWAPA9a+55/dCm7rzzPhSUYYgq9bfu2/fUsvTDcD0xdvmOdfe8nmiXAND4sFmG+kEA0PN2EgKAAGAZ6gnHX8/bSRwOAL8ZlKP/YSv3t+7b9+Sy9MNwfTHO8ffdWuh1fdEuAcCwWYpCgCWv1+0kAQDDZikKARa8XhcAkgSADwbl6H/Yyv2tk5eifhijR7L0m163k3ih7txzPxiUY4gq9bdOWooL9MR4fdJqn+lz+4jFCQAGrujlqCfKDwK+Q7s9rl+aDwC/EZSl/4Er97dOXo76YR49U3tf6XG7iMkEAENX9HIUAsoMAd47R3/rGwEAQ2dBCgPeVQDQQ+0FgA8EZRlmeZf7eycvSD0xr37yfnl7O9seykgAMHjFL0khYNhe8w762h5KGgA2n/uBoDx9V8m/dZpFqSeoTe19nWkHZdVtPvfXg/L0P3xl/959+55Ylp6gNrX3dLYdlJEAkGT4Sh/ASctSCKCl4196P2fbPwIABtDCBP0sAGQKAHcE5RlmAMv+zZMXpr6gDrX3csb9k1G3efMdQZl6H8DCf+9UfzXpC/Sx3UMvBIBEQ9hCCNAX6GF7h54CwDmb7wjKNESV/pun+etJb6B/7R1Wrztn868FZRpmEMv+zdMtUL2B/rV3WC0BINkwWqKgb+0cBAD/CmCRgr7113/eAPD+oFzDDGT5v3u6Zao/0K/2DSslABhICxX0qwCQMQBs2vz+oGxDVA2/e+++JybSH+hTe4aV6TZt/tWgbMMMZvm/e7rFqj/Qp/YMKyEAGEzLFfSnACAAYDgtWPDXv+OfIwCc8ytB+QYZ0Ep++959j0+kR9CX9guzEQAMaBOLVghAT9ovCABCgH8FAP1orzApAJx9zi8HdRiiavnt0/7FpU/Qi/YK0xEAkgcAIQAcfwFAAEBab2IB6xP0n32CACAA+FcA0Ht2CYsHgF8K6jHc0NbzBtMvYv2CnrNLWIoAIARUObRCAHrNHkEAEAD8K4AAgF6zQ5g1AJx1zvuC+gxRtb3BtItZv6DH7A+OJwAIAEIAOP4CQMoAsOl9QX0GG+LK3mHv3senpm/QV3YHR3RnbfrFoE7DDXJd77B375enpm/I3E92BkcTAASAJoZZCEAf2RkIAEKAECAAoIfsCiYHgPcG9RpuqOt8j+kXuN4hV+/YFRyrO3PTe4N6DVm1vsm0i1z/kKVn7AkWIwAIAWkDgBBAln6xI1giAPxCULdh032dbzLbUtdDWWXoE/uBpQgAQkCzAz7LchcEHP5We8NuQAAQAIQAIQDH317g6ABwe9CGYYe93neZfeHrpVZl6gX7gEm6jZtuD9owZNX+NrMufv3Unmw9YB8wSbfx7NuDdgw69JW/zcwHQD81I9u3tweYhgAgAKQa/FkPgSDge9sDAkDDAeDng7YMO/z1v8/KjoK+8p3Nv75qiwAgAAgBQoDj7/gLAAIAQkCuJSAIOPzm3vFPHADeE7Rp2GXQzjvt3fvYzPSX72jeqV13xtnvCdo0dLX0VvfvfWxF9JlvZ9aplQAgBFgKDolvZs4d/5wB4OeCdg3/l0Fb77XSg3LoqOg338mMUw8BQAiwIBwY38VsO/4CAJaERdHHsREEfAtzTQUB4LagfcMvinbfbvXHR/95ezNNebozzrotyGHwhdHw2632EB08RnrQe5tlCtJtOOu2IIcxqvU37OMw6UXva44pQbfhrJ8N8hhnebT9hn0cqSPHSk96T/PLfAgAQoAFUsDhyhYGvJ3ZRQDAXxGOWZKD5p3MLQIAlokDl+TIeRPzStEB4N1BTuMslXzvOtTRO3L8/HZzak5Zve70s94d5DRWZX3foY/hsfw2M2pGmYUAIARYMI0dy5aYTbPJoAHgZ4Lcxls03vr+vY8ygT4xk4xDAGC0heOdBQGH3zwiAOAvDoQB398sMtcAcOa7AhaMtni89ZJSHH3f2QxSBAEAC0ggcPDNHhkDwPoz3xVwtLHKW69Mycfe9zFz1KNbf+ZPBxxtzPLe/ZjPsffu5o2aCQBYSsmDg3cwZwgAYDmB+SJPAPipgKWMXd4cM2WmGIcAgIUFZgkBACwuMEOkCACnnfnOgEnmUd4d82N+GI4AgCUG5gYBACwzMC/kCAAb3xkwi3mVt8eMmBH605228ScDZjW/BeftMRtmgz4IAFh0YCYQAKCOhWfpYQ7MAasMAKdu/ImA1ZhneX/0P6yMAIAlCPoeAQDqXIYWInodZg4APx7Ql/kvRt8APQ7TEABobkFakuhrEACwLEE/w2IBYN3GdwQMoZTyLdDDcDwBAEsU9CwpA8AZ7wgYWjEL1bdAr8JB3bozfixgDCWV74H+JDsBgLRL1qJFTyIAQOKFa+nqQ32IAAAWMPpO35EjAKw940cD5qXU8m30ml6jdQIAFrPlrL/0FwIAWNSWtV7SSyQJAD8SUIoaynfSP/qHFggAWOIWuZ7RMwgAYKlb7PpDf5AjAGx4e0CpaizfTT/oB2rQrdnw9oDS1Vq+nW8PpRIAcAgcBd/ZdyZnAPjhgJq0VL6n7wnzIgDgaDggvp1vhwAAjonD4vs4/CQJAG8LqF3W8va53x5WQwBAEFDK4SdjADhlw9sCWqLUUGW+aEl3yoa3BrRIqf4Ov3miPQIAgoBSDj8CAAgCSpkXcgSA098akIlSSx5+80Ei3SmnvyUgI6WOHH7zQD7dQp18+lsCMlP5St+TnQAAgoDDD3kDwA8F8EKqpaOvn+FYAgAIAg4/CACAMODoQ6IA8OYAZqNKOvr6EWYlAIAw4OhD1gBw0ulvDqAfarjSX9Cf5wPAmwIYhlrNwdc/MBQBAAQCBx/SBoD1bwpgflIee98d5ur5APDGAMrS1rH3PaE0AgAICA48CABAthDhHSBxAFiol61/YwAA7euOrpet/8EAANonAACAAOBBACBhAPiBAADaJwAAgADgQQAgXQBYqJeuf0MAAO3qFquXnvaGAADaJQAAgABwOAC8PgCAdnVLlccBgGTHXwAAgKQB4PtPe10AAO0RAABAABACACD98T8UAF4bAEA7BAAAEAAEAAAQAIQAAMh7/Bfq+059TQAA9RMAAEAAEAIAwPFfNAC8OgCAenUrLY8HAMmOvwAAAGkDwK0BANSnW21976m3BgBQj66P8pAAkDAAHAoBrwoAoHxdn+VBAUAAAAAyBICDIWDdLQEAlKsbojwsACQMAAv1knW3BABQnm7Iesm6VwYAUJ5u6PLIAJDs+AsAAJA0AAgBAJDw+B8KADcHADB/3dj14nU3BwAwP928yuMDQLLjfygA3BQAwPi6eZePAADJjv/BALD2pgAAxtOVUi9ee2MAAMPrSisfBQCSHf+FetHaGwMAGE5Xar1o7SsCAOhfV3r5SACQ7PgLAACQNAAcCgE3BACwel1t5aMBQLLjLwQAQNLjv1Anrr0hAIDZdbXXiWuvDwBgel0rdeKa6wMAmKxrrXxUAEh2/I+EgJcHAHC8ruXygQEgYQBYqBPWvDwAgCO6LHXCmusCALguz/EXAgAg6fEXAgBw/JPXCWuuDQDIpFNCAACOvxAAAI5/vvqeNXsCAFrkyk8KAafsCQBoiesuBADg+KvJQWB3AECNXHEhAADHXwkBADj+SggAwPFXk+u7T7kmAKAkrrMQAIDjr4QAABx/NVAQuDoAYEyurxAAgOOvBAEAHH41nxBw8q4AgD65rhXVd528KwBgNVxTQQAAh1/VFwKuCgCYhqspCADg8CtBAACHXzUSBK4MAHJyBVX3nSdfGQDk4OopYQDA0VdKEABw+JV6QRjYGQDUwdVSggCAw69Uz2HgpJ0BwHy5RqqAQLAjABiWa6OKr+84aUcAsDquiRIIABx8pVoLB9sDIAtbf/71f5wjLk4w6JgSAAAAAElFTkSuQmCC", "base64");
async function pwaRoutes(request, url, env) {
  var p = url.pathname;
  if (request.method !== "GET") return null;
  if (p === "/" || p === "/app")
    return new Response(PWA_APP_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  if (p === "/app.css")
    return new Response(PWA_APP_CSS, { headers: { "content-type": "text/css; charset=utf-8", "cache-control": "no-cache" } });
  if (p === "/app.js")
    return new Response(PWA_APP_JS, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "no-cache" } });
  if (p === "/app-assets/login-studio-camera-v2.png") {
    if (!env.STUDIO_ASSETS) return new Response("Asset storage is unavailable", { status: 503 });
    const object = await env.STUDIO_ASSETS.get("app-assets/login-studio-camera-v2.png");
    if (!object) return new Response("Asset not found", { status: 404 });
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("cache-control", "public, max-age=604800, immutable");
    headers.set("etag", object.httpEtag);
    return new Response(object.body, { headers });
  }
  if (p === "/chart.min.js")
    return new Response("// Chart.js is inlined in the HTML", { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=86400" } });
  if (p === "/manifest.json")
    return new Response(PWA_MANIFEST_JSON, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
  if (p === "/sw.js")
    return new Response(PWA_SERVICE_WORKER, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "no-store" } });
  if (p === "/mobile")
    return new Response(null, { status: 302, headers: { "location": "/app" } });
  if (p === "/icons/icon-192.png" || p === "/icons/icon-512.png" || p === "/favicon.ico")
    return new Response(PWA_ICON_BUFFER, { headers: { "content-type": "image/png", "cache-control": "public, max-age=604800" } });
  return null;
}
__name(pwaRoutes, "pwaRoutes");
function slugify(text) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "studio";
}
__name(slugify, "slugify");
const SHORT_TOKEN_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
function generateShortToken(length = 16) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => SHORT_TOKEN_ALPHABET[byte % SHORT_TOKEN_ALPHABET.length]).join("");
}
__name(generateShortToken, "generateShortToken");
function clientPortalApprovalPage() {
  return html(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Client Portal · LenspireCRM</title><style>body{margin:0;background:#09111d;color:#eaf0fa;font:15px system-ui,-apple-system,Segoe UI,sans-serif}.wrap{max-width:860px;margin:auto;padding:30px 16px 60px}.hero,.card{background:#111c2b;border:1px solid #25344a;border-radius:16px;padding:20px;margin-bottom:16px}.hero{background:linear-gradient(135deg,#1b2750,#151d36)}h1{margin:5px 0}h2{font-size:17px;margin:0 0 14px}.brand,.muted{color:#acb8cb}.brand{font-size:11px;letter-spacing:1px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}.stat,.gallery{padding:14px;background:#0b1522;border-radius:12px}.stat small{display:block;color:#9cabc1}.row{padding:10px 0;border-top:1px solid #27354a}.gallery{margin-top:10px;border:1px solid #263851}.gallery-head{display:flex;justify-content:space-between;gap:10px;align-items:center}.gallery-btns{display:flex;flex-wrap:wrap;gap:7px}.tag{color:#62e7bb}.btn{display:inline-block;border:0;margin:10px 7px 0 0;padding:11px 15px;border-radius:9px;background:#7060ef;color:#fff;text-decoration:none;font-weight:700;cursor:pointer}.btn.secondary{background:#1c2a3d}.btn.danger{background:#632e48}.btn:disabled{opacity:.55;cursor:wait}.notice{margin-top:10px;padding:10px;border-radius:9px;background:#15352f;color:#73e4bd}.notice.changes{background:#462b27;color:#ffc38c}.notice.payment{background:#40361e;color:#ffd677}.error{color:#ff9aa5}@media(max-width:600px){.grid{grid-template-columns:1fr}.gallery-head{display:block}.gallery-btns{flex-direction:column;gap:6px}.btn{margin:0 0 8px 0;width:100%;box-sizing:border-box;font-size:13px;padding:12px 15px}.btn:disabled{opacity:.55;cursor:wait}.hero,.card{padding:16px}}</style></head><body><main class="wrap" id="portalApp"><section class="hero"><div class="brand">LENSPIRECRM · CLIENT PORTAL</div><h1>Opening secure portal…</h1></section></main><script>const params=new URLSearchParams(location.search);const inviteToken=params.get('invite');let token=localStorage.getItem('lenspire_portal_token')||null;let hashToken=null;if(!token&&location.hash&&location.hash.length>1)hashToken=decodeURIComponent(location.hash.slice(1));if(hashToken)history.replaceState(null,'',location.pathname);const app=document.getElementById('portalApp'),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),money=v=>'₹'+Number(v||0).toLocaleString('en-IN',{maximumFractionDigits:0}),date=v=>v?new Date(String(v).slice(0,10)+'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):'TBD';async function api(path,options={}){const response=await fetch(path,{...options,headers:{'content-type':'application/json',authorization:'Bearer '+token,...(options.headers||{})}}),result=await response.json();if(!response.ok)throw Error(result.error||'Request failed');return result}function feedback(job,booking){if(job.stage==='Delivered')return'<div class="notice">✓ Delivered & Closed'+(job.deliveredAt?' · '+date(job.deliveredAt):'')+'</div>';if(job.feedbackStatus==='Approved'&&Number(booking.balance)>0)return'<div class="notice payment">✓ Gallery approved · Final Payment Due '+money(booking.balance)+'</div>';if(job.feedbackStatus==='Approved')return'<div class="notice">✓ Gallery approved · Payment complete · Studio can complete delivery</div>';if(job.feedbackStatus==='Changes Requested')return'<div class="notice changes">Change request sent'+(job.feedbackMessage?': '+esc(job.feedbackMessage):'')+'</div>';return''}async function send(jobId,action,button){let message='';if(action==='approve'&&!confirm('Approve this gallery delivery?'))return;if(action==='changes'){message=prompt('Please enter the changes required:','')?.trim()||'';if(!message)return}button.disabled=true;try{const result=await api('/api/client-portal/feedback',{method:'POST',body:JSON.stringify({jobId,action,message})});alert(result.message);await load()}catch(error){alert(error.message);button.disabled=false}}async function load(){if(!token)throw Error('This portal link is incomplete. Please request a new link from your studio.');const data=await api('/api/client-portal'),booking=data.booking,events=(data.events||[]).map(item=>'<div class="row"><b>'+esc(item.eventType)+'</b><br><span class="muted">'+date(item.startDate)+'</span> · <span class="tag">'+esc(item.status)+'</span></div>').join('')||'<p class="muted">Event details will appear here.</p>',payments=(data.payments||[]).map(item=>'<div class="row"><b>'+esc(item.paymentType)+'</b> · '+money(item.amount)+'<br><span class="muted">'+date(item.paidAt||item.dueDate)+' · '+esc(item.status)+'</span></div>').join('')||'<p class="muted">No payment entries yet.</p>',galleries=(data.production||[]).filter(item=>item.galleryLinks&&item.galleryLinks.length).map(item=>'<article class="gallery"><div class="gallery-head"><div><b>'+esc(item.eventSegment||'Event Gallery')+'</b><br><span class="muted">'+esc(item.stage==='Delivered'?(item.deliveryStatus||'Delivered & Closed'):(item.stage||'Ready'))+'</span></div><div class="gallery-btns">'+(item.galleryLinks||[]).map(link=>'<a class="btn" target="_blank" rel="noopener" href="'+esc(link.url)+'">'+esc(link.label||'View Gallery')+'</a>').join('')+'</div></div>'+feedback(item,booking)+(item.feedbackStatus==='Approved'?'':'<div><button class="btn secondary" data-approval="'+esc(item.id)+'">Approve Delivery</button><button class="btn danger" data-changes="'+esc(item.id)+'">Request Changes</button></div>')+'</article>').join('')||'<p class="muted">Your gallery will appear here when it is ready.</p>';app.innerHTML='<section class="hero"><div class="brand">'+esc(data.studio.name)+' · CLIENT PORTAL</div><h1>'+esc(booking.coupleName||booking.clientName)+'</h1><p>'+esc(booking.eventType)+' · '+date(booking.eventDate)+'</p></section><section class="grid"><div class="stat"><small>Total Booking</small><b>'+money(booking.total)+'</b></div><div class="stat"><small>Received</small><b>'+money(booking.received)+'</b></div><div class="stat"><small>Balance</small><b>'+money(booking.balance)+'</b></div></section><section class="card"><h2>Events</h2>'+events+'</section><section class="card"><h2>Payment Summary</h2>'+payments+'</section><section class="card"><h2>Gallery Delivery & Approval</h2>'+galleries+'</section><p class="muted">For help, contact '+esc(data.studio.phone||data.studio.email||'your studio')+'.</p>';app.querySelectorAll('[data-approval]').forEach(button=>button.onclick=()=>send(button.dataset.approval,'approve',button));app.querySelectorAll('[data-changes]').forEach(button=>button.onclick=()=>send(button.dataset.changes,'changes',button))}function showLoginForm(){app.innerHTML='<section class="hero"><div class="brand">LENSPIRECRM · CLIENT PORTAL</div><h1>Client Login</h1></section><section class="card"><h2>Enter your credentials</h2><form id="loginForm"><div style="margin-bottom:12px"><label style="display:block;color:#958bff;font-size:9px;font-weight:700;letter-spacing:1px">Email</label><input type="email" id="loginEmail" style="width:100%;padding:10px;border:1px solid #25344a;border-radius:8px;background:#0b1420;color:#eaf0fa;font:13px system-ui"></div><div style="margin-bottom:12px"><label style="display:block;color:#958bff;font-size:9px;font-weight:700;letter-spacing:1px">Password</label><input type="password" id="loginPassword" style="width:100%;padding:10px;border:1px solid #25344a;border-radius:8px;background:#0b1420;color:#eaf0fa;font:13px system-ui"></div><button type="submit" class="btn" style="width:100%;cursor:pointer">Login</button></form></section><p class="muted" id="loginError" style="display:none;color:#ff9aa5;margin-top:10px"></p>';document.getElementById('loginForm').addEventListener('submit',async(e)=>{e.preventDefault();const email=document.getElementById('loginEmail').value.trim();const password=document.getElementById('loginPassword').value;const btn=e.submitter;btn.disabled=true;try{const response=await fetch('/api/portal/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})}),result=await response.json();if(!response.ok)throw Error(result.error||'Login failed');token=result.accessToken;localStorage.setItem('lenspire_portal_token',token);history.replaceState(null,'',location.pathname);await load()}catch(error){document.getElementById('loginError').textContent=error.message;document.getElementById('loginError').style.display='block';btn.disabled=false}})}function showSetupForm(it){app.innerHTML='<section class="hero"><div class="brand">LENSPIRECRM · CLIENT PORTAL</div><h1>Set Your Password</h1></section><section class="card"><h2>'+esc('Welcome')+'</h2><p style="color:#acb8cb;font-size:14px">Set a password to access your secure client portal.</p><form id="setupForm"><div style="margin-bottom:12px"><label style="display:block;color:#958bff;font-size:9px;font-weight:700;letter-spacing:1px">New Password</label><input type="password" id="setupPassword" style="width:100%;padding:10px;border:1px solid #25344a;border-radius:8px;background:#0b1420;color:#eaf0fa;font:13px system-ui"></div><div style="margin-bottom:12px"><label style="display:block;color:#958bff;font-size:9px;font-weight:700;letter-spacing:1px">Confirm Password</label><input type="password" id="setupPassword2" style="width:100%;padding:10px;border:1px solid #25344a;border-radius:8px;background:#0b1420;color:#eaf0fa;font:13px system-ui"></div><button type="submit" class="btn" style="width:100%;cursor:pointer">Set Password</button></form></section><p class="muted" id="setupError" style="display:none;color:#ff9aa5;margin-top:10px"></p>';document.getElementById('setupForm').addEventListener('submit',async(e)=>{e.preventDefault();const password=document.getElementById('setupPassword').value;const password2=document.getElementById('setupPassword2').value;const btn=e.submitter;if(password!==password2){document.getElementById('setupError').textContent='Passwords do not match';document.getElementById('setupError').style.display='block';return}if(password.length<8){document.getElementById('setupError').textContent='Password must be at least 8 characters';document.getElementById('setupError').style.display='block';return}btn.disabled=true;try{const response=await fetch('/api/portal/setup-password',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({inviteToken:it,password})}),result=await response.json();if(!response.ok)throw Error(result.error||'Password setup failed');token=result.accessToken;localStorage.setItem('lenspire_portal_token',token);history.replaceState(null,'',location.pathname);await load()}catch(error){document.getElementById('setupError').textContent=error.message;document.getElementById('setupError').style.display='block';btn.disabled=false}})};async function resolveShortToken(st){if(st.startsWith('eyJ')){token=st;localStorage.setItem('lenspire_portal_token',token);await load()}else{app.innerHTML='<section class="hero"><div class="brand">LENSPIRECRM · CLIENT PORTAL</div><h1>Loading…</h1></section>';try{const response=await fetch('/api/client-portal/token',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({shortToken:st})}),result=await response.json();if(!response.ok)throw Error(result.error||'Token exchange failed');token=result.accessToken;localStorage.setItem('lenspire_portal_token',token);await load()}catch(error){app.innerHTML='<section class="hero"><h1>Portal unavailable</h1><p class="error">'+esc(error.message)+'</p></section>'}}}async function startPortal(){if(inviteToken){showSetupForm(inviteToken)}else if(token){await load().catch(error=>app.innerHTML='<section class="hero"><h1>Portal unavailable</h1><p class="error">'+esc(error.message)+'</p></section>')}else if(hashToken){await resolveShortToken(hashToken).catch(error=>app.innerHTML='<section class="hero"><h1>Portal unavailable</h1><p class="error">'+esc(error.message)+'</p></section>')}else{showLoginForm()}}startPortal().catch(error=>app.innerHTML='<section class="hero"><h1>Portal unavailable</h1><p class="error">'+esc(error.message)+'</p></section>')</script></body></html>`);
}
__name(clientPortalApprovalPage, "clientPortalApprovalPage");
function platformMigrationPage() {
  return html(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LenspireCRM · Database Migrations</title><style>body{margin:0;background:#09111d;color:#eaf0fa;font:15px system-ui;padding:32px}.card{max-width:680px;margin:auto;background:#111c2b;border:1px solid #293951;border-radius:16px;padding:24px}button{border:0;border-radius:9px;background:#7060ef;color:white;padding:12px 18px;font-weight:700;cursor:pointer}button:disabled{opacity:.55}.status{margin-top:16px;padding:12px;border-radius:9px;background:#0b1522;white-space:pre-wrap}.error{color:#ff9aa5}</style></head><body><main class="card"><h1>Database migrations</h1><p>This owner-only operation applies pending, versioned schema migrations under a PostgreSQL advisory lock.</p><button id="run">Run pending migrations</button><div id="status" class="status">Ready.</div></main><script>const button=document.getElementById('run'),status=document.getElementById('status');button.onclick=async()=>{button.disabled=true;status.className='status';status.textContent='Refreshing the secure owner session…';try{const refreshed=await fetch('/api/auth/refresh',{method:'POST',headers:{'content-type':'application/json'},body:'{}'}),refreshResult=await refreshed.json();if(!refreshed.ok)throw Error(refreshResult.error||'Owner session refresh failed');status.textContent='Running migrations…';const response=await fetch('/api/platform/migrations',{method:'POST',headers:{'content-type':'application/json','x-lenspire-web':'1'},body:'{}'}),result=await response.json();if(!response.ok)throw Error(result.error||'Migration failed');status.textContent='Migration complete. Version '+result.currentVersion+'. Applied: '+((result.applied||[]).join(', ')||'none (already current)')+'.'}catch(error){status.className='status error';status.textContent=error.message;button.disabled=false}}</script></body></html>`);
}
__name(platformMigrationPage, "platformMigrationPage");
function tenantRehearsalPage() {
  return html(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LenspireCRM · Tenant Rehearsal</title><style>body{margin:0;background:#09111d;color:#eaf0fa;font:15px system-ui;padding:32px}.card{max-width:720px;margin:auto;background:#111c2b;border:1px solid #293951;border-radius:16px;padding:24px}button{border:0;border-radius:9px;background:#7060ef;color:white;padding:12px 18px;font-weight:700;cursor:pointer}button:disabled{opacity:.55}.status{margin-top:16px;padding:12px;border-radius:9px;background:#0b1522;white-space:pre-wrap}.error{color:#ff9aa5}</style></head><body><main class="card"><h1>Rollback-only tenant rehearsal</h1><p>This owner-only operation creates two disposable tenants inside one transaction, verifies isolation controls, and rolls everything back.</p><button id="run">Run tenant rehearsal</button><div id="status" class="status">Ready.</div></main><script>const button=document.getElementById('run'),status=document.getElementById('status');button.onclick=async()=>{button.disabled=true;status.className='status';status.textContent='Running rollback-only rehearsal…';try{const response=await fetch('/api/platform/tenant-rehearsal',{method:'POST',headers:{'content-type':'application/json','x-lenspire-web':'1'},body:'{}'}),result=await response.json();if(!response.ok||!result.ok)throw Error(result.error||'Tenant rehearsal failed');status.textContent='Tenant rehearsal passed. Foreign keys blocked: '+result.foreignKeysBlocked+'. Read blocked: '+result.crossTenantReadBlocked+'. Update blocked: '+result.crossTenantUpdateBlocked+'. Delete blocked: '+result.crossTenantDeleteBlocked+'. Residual organizations: '+result.residualOrganizations+'. Production data committed: '+result.productionDataCommitted+'.'}catch(error){status.className='status error';status.textContent=error.message;button.disabled=false}}</script></body></html>`);
}
__name(tenantRehearsalPage, "tenantRehearsalPage");
async function clientPortalApi(request, env, pathname) {
  const sql = getDatabase(env);
  try {
    if (request.method === "POST" && pathname === "/api/client-portal/token") {
      const body = await readJson(request);
      const shortToken = String(body?.shortToken || body?.token || "").trim();
      if (!shortToken) return json({ error: "Short token is required" }, 400);
      await ensureCloudSchemaReady(sql);
      const [access] = await sql`select * from client_portal_access where short_token=${shortToken} limit 1`;
      if (!access) return json({ error: "Invalid or expired portal link. Please request a new link from your studio." }, 401);
      const portal = await validateClientPortalAccess(sql, { org: access.organization_id, booking: access.booking_id, purpose: "client-portal", portalVersion: Number(access.token_version) });
      if (portal.error) return json({ error: portal.error }, portal.status);
      const accessToken = await signAccessToken({ sub: access.organization_id, org: access.organization_id, role: "Client", purpose: "client-portal", booking: access.booking_id, portalVersion: Number(access.token_version) }, env.JWT_SECRET, Math.max(1, Math.floor((new Date(access.expires_at).getTime() - Date.now()) / 864e5)) * 24 * 60 * 60);
      return json({ accessToken });
    }
    if (request.method === "POST" && pathname === "/api/client-portal/feedback") {
      const claims = await requireAccessClaims(request, env);
      if (!claims || claims.purpose !== "client-portal" || !uuidOrNull(claims.booking)) return json({ error: "Invalid portal link" }, 401);
      await ensureCloudSchemaReady(sql);
      const portal = await validateClientPortalAccess(sql, claims);
      if (portal.error) return json({ error: portal.error }, portal.status);
      const body = await readJson(request), action = String(body?.action || ""), message = String(body?.message || "").trim().slice(0, 2000), jobId = uuidOrNull(body?.jobId);
      if (!["approve", "changes"].includes(action) || (action === "changes" && !message)) return json({ error: "Provide a valid approval or change request" }, 400);
      if (!jobId) return json({ error: "Select a valid production job" }, 400);
      const [job] = await sql`select * from production_jobs where id=${jobId} and booking_id=${claims.booking} and organization_id=${claims.org} limit 1`;
      if (!job) return json({ error: "Production job not found" }, 404);
      const now = new Date().toISOString(), status = action === "approve" ? "Approved" : "Changes Requested";
      await sql`update production_jobs set client_feedback_status=${status},client_feedback_message=${action === "changes" ? message : null},client_feedback_at=${now},stage=${action === "approve" ? "Ready for Delivery" : "Editing"},client_approved_at=${action === "approve" ? now : null} where id=${job.id} and organization_id=${claims.org} and booking_id=${claims.booking}`;
      await recordProductionActivity(sql, { organizationId: claims.org, jobId: job.id, bookingId: job.booking_id, action: action === "approve" ? "Client Approved" : "Client Requested Changes", message: action === "approve" ? "Client approved the gallery delivery in the Client Portal." : message, actor: "Client Portal" });
      await recordClientPortalAccess(sql, portal.access, action === "approve" ? "Delivery Approved" : "Changes Requested", action === "approve" ? `Client approved ${job.event_segment || "the gallery"}.` : message);
      return json({ ok: true, status, message: action === "approve" ? "Delivery approved successfully." : "Your change request was sent to the studio." });
    }
    if (pathname === "/api/client-portal/link") {
      const user = await requireUser(request, env, sql);
      if (!user) return json({ error: "Authentication required" }, 401);
      await ensureCloudSchemaReady(sql);
      const departmentAccess = normalizeDepartmentAccess(user.department_access, user.role);
      const canReadPortal = user.role === "Administrator" || departmentAccess.sales !== "none" || departmentAccess.accounts !== "none";
      const canWritePortal = canWriteSales(user) || canWriteDepartment(user, "accounts");
      if (!canReadPortal) return json({ error: "Sales or Accounts access required" }, 403);
      const url = new URL(request.url);
      const body = request.method === "GET" ? null : await readJson(request);
      const bookingId = uuidOrNull(body?.bookingId || url.searchParams.get("bookingId"));
      if (!bookingId) return json({ error: "Select a valid booking" }, 400);
      const [booking] = await sql`select b.id,b.customer_id,c.name as client_name,l.couple_name from bookings b join customers c on c.id=b.customer_id and c.organization_id=b.organization_id left join leads l on l.id=b.lead_id and l.organization_id=b.organization_id where b.id=${bookingId} and b.organization_id=${user.organization_id} limit 1`;
      if (!booking) return json({ error: "Booking not found" }, 404);
      const closed = await clientPortalBookingClosed(sql, user.organization_id, booking.id);
      if (closed) await closeClientPortalIfDelivered(sql, user.organization_id, booking.id);
      if (request.method === "POST") {
        if (!canWritePortal) return json({ error: "Sales or Accounts write access required" }, 403);
        if (closed) return json({ error: "This project is Delivered & Closed. Client Portal access cannot be reopened." }, 409);
        const expiryDays = Math.max(1, Math.min(365, Number.parseInt(body?.expiryDays, 10) || 60));
        const expiresAt = new Date(Date.now() + expiryDays * 864e5).toISOString();
          const [existing] = await sql`select * from client_portal_access where organization_id=${user.organization_id} and booking_id=${booking.id} limit 1`;
          const shortToken = generateShortToken(16);
          const [access] = await sql`
          insert into client_portal_access (organization_id,booking_id,token_version,short_token,expires_at,created_by)
          values (${user.organization_id},${booking.id},1,${shortToken},${expiresAt},${user.id})
          on conflict (organization_id,booking_id) do update set
            token_version=client_portal_access.token_version+1,short_token=${shortToken},expires_at=excluded.expires_at,
            revoked_at=null,closed_at=null,created_by=excluded.created_by,updated_at=now()
          returning *`;
          const action = existing ? "Link Regenerated" : "Link Generated";
          await recordClientPortalAccess(sql, access, action, `Secure link valid for ${expiryDays} day${expiryDays === 1 ? "" : "s"}.`);
          const accessToken = await signAccessToken({ sub: booking.customer_id, org: user.organization_id, role: "Client", purpose: "client-portal", booking: booking.id, portalVersion: Number(access.token_version) }, env.JWT_SECRET, expiryDays * 24 * 60 * 60);
          const audits = await sql`select action,detail,accessed_at from client_portal_access_log where organization_id=${user.organization_id} and booking_id=${booking.id} order by accessed_at desc limit 25`;
          const portalDomain = env.PORTAL_DOMAIN || `portal.${url.hostname.replace(/^[^.]+\./, '')}`;
          const [orgProfile] = await sql`select coalesce(p.studio_name, o.name) as studio_name,coalesce(p.studio_slug,slugify(coalesce(p.studio_name, o.name))) as studio_slug from organizations o left join organization_profiles p on p.organization_id = o.id where o.id = ${user.organization_id} limit 1`;
          const studioSlug = orgProfile?.studio_slug || slugify(orgProfile?.studio_name || user.organization_id);
          const clientSlug = slugify(booking.couple_name || booking.client_name || String(booking.id));
          return json({ url: `https://${portalDomain}/${studioSlug}/${clientSlug}#${shortToken}`, shortToken, accessToken, expiresInDays: expiryDays, expiresAt: access.expires_at, lastAccessedAt: access.last_accessed_at, accessCount: Number(access.access_count || 0), status: clientPortalAccessStatus(access), clientName: booking.couple_name || booking.client_name, audits });
      }
      if (request.method === "DELETE") {
        if (!canWritePortal) return json({ error: "Sales or Accounts write access required" }, 403);
        const [access] = await sql`update client_portal_access set revoked_at=now(),token_version=token_version+1,updated_at=now() where organization_id=${user.organization_id} and booking_id=${booking.id} returning *`;
        if (!access) return json({ error: "No Client Portal link exists for this booking" }, 404);
        await recordClientPortalAccess(sql, access, "Access Revoked", "Studio revoked Client Portal access.");
        return json({ ok: true, status: "Revoked", revokedAt: access.revoked_at });
      }
      if (request.method === "GET") {
        const [access] = await sql`select * from client_portal_access where organization_id=${user.organization_id} and booking_id=${booking.id} limit 1`;
        const audits = access ? await sql`select action,detail,accessed_at from client_portal_access_log where organization_id=${user.organization_id} and booking_id=${booking.id} order by accessed_at desc limit 25` : [];
        return json({ status: clientPortalAccessStatus(access, closed), expiresAt: access?.expires_at || null, lastAccessedAt: access?.last_accessed_at || null, accessCount: Number(access?.access_count || 0), revokedAt: access?.revoked_at || null, closedAt: access?.closed_at || null, clientName: booking.couple_name || booking.client_name, audits });
      }
      return json({ error: "Method not allowed" }, 405);
    }
    if (request.method !== "GET" || pathname !== "/api/client-portal") return json({ error: "Not found" }, 404);
    const claims = await requireAccessClaims(request, env);
    if (!claims || claims.purpose !== "client-portal" || !uuidOrNull(claims.booking)) return json({ error: "This client portal link is invalid or has expired. Please request a new link from your studio." }, 401);
    await ensureCloudSchemaReady(sql);
    const portal = await validateClientPortalAccess(sql, claims, { recordOpen: true });
    if (portal.error) return json({ error: portal.error }, portal.status);
    await assertOrganizationProfileSchemaReady(sql);
    const [booking] = await sql`select b.id,b.event_type,b.event_date,b.quoted_amount,c.name as client_name,l.couple_name from bookings b join customers c on c.id=b.customer_id and c.organization_id=b.organization_id left join leads l on l.id=b.lead_id and l.organization_id=b.organization_id where b.id=${claims.booking} and b.organization_id=${claims.org} limit 1`;
    if (!booking) return json({ error: "Booking no longer exists" }, 404);
    const payments = await sql`select payment_type,status,amount,due_date,paid_at from payments where booking_id=${booking.id} and organization_id=${claims.org} order by coalesce(paid_at,due_date,created_at)`;
    const events = await sql`select event_type,start_date,status from calendar_events where booking_id=${booking.id} and organization_id=${claims.org} order by start_date`;
    const production = await sql`select id,event_segment,stage,delivery_status,delivered_at,notes,client_feedback_status,client_feedback_message,client_feedback_at from production_jobs where booking_id=${booking.id} and organization_id=${claims.org} order by created_at`;
    const [profile] = await sql`select studio_name,contact_phone,contact_email from organization_profiles where organization_id=${claims.org} limit 1`;
    const received = payments.filter(p => p.status === "Paid" && p.payment_type !== "Refund").reduce((sum, p) => sum + Number(p.amount || 0), 0) - payments.filter(p => p.status === "Paid" && p.payment_type === "Refund").reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const portalProduction = production.map(p => { let galleryLinks = []; try { const saved = JSON.parse(String(p.notes || "").replace(/^LENSPIRE_DELIVERABLES_V1:/, "")); if (Array.isArray(saved?.galleryLinks)) { galleryLinks = saved.galleryLinks.filter(l => l && /^https:\/\/[^\s]+$/i.test(String(l?.url || ""))).map(l => ({ url: String(l.url), label: String(l.label || "View Gallery").slice(0, 80) })); } if (!galleryLinks.length) { const url = /^https:\/\/[^\s]+$/i.test(String(saved?.galleryUrl || "")) ? String(saved.galleryUrl) : ""; if (url) galleryLinks = [{ url, label: String(saved?.galleryLabel || "View Gallery").slice(0, 80) }]; } } catch {} return { id: p.id, eventSegment: p.event_segment, stage: p.stage, deliveryStatus: p.delivery_status, deliveredAt: p.delivered_at, galleryLinks, feedbackStatus: p.client_feedback_status, feedbackMessage: p.client_feedback_message, feedbackAt: p.client_feedback_at }; });
    return json({ studio: { name: profile?.studio_name || "LenspireCRM", phone: profile?.contact_phone || null, email: profile?.contact_email || null }, booking: { clientName: booking.client_name, coupleName: booking.couple_name, eventType: booking.event_type, eventDate: booking.event_date, total: Number(booking.quoted_amount || 0), received, balance: Math.max(0, Number(booking.quoted_amount || 0) - received) }, events: events.map(e => ({ eventType: e.event_type, startDate: e.start_date, status: e.status })), payments: payments.map(p => ({ paymentType: p.payment_type, status: p.status, amount: Number(p.amount || 0), dueDate: p.due_date, paidAt: p.paid_at })), production: portalProduction });
  } finally { await closeDatabase(sql); }
}
__name(clientPortalApi, "clientPortalApi");
async function portalAuthApi(request, env, pathname) {
  const sql = getDatabase(env);
  try {
    if (request.method === "POST" && pathname === "/api/portal/login") {
      const body = await readJson(request);
      const email = String(body?.email || "").trim().toLowerCase();
      const password = String(body?.password || "");
      if (!email || !password) return json({ error: "Email and password are required." }, 400);
      const [portalUser] = await sql`select pu.*, p.studio_name, p.studio_slug from client_portal_users pu join organization_profiles p on p.organization_id = pu.organization_id where lower(pu.email) = lower(${email}) and pu.status = 'active' limit 1`;
      if (!portalUser || !await verifyPassword(password, portalUser.password_hash, portalUser.password_salt, portalUser.password_iterations)) return json({ error: "Invalid email or password." }, 401);
      const accessToken = await signAccessToken({ sub: portalUser.booking_id, org: portalUser.organization_id, role: "Client", purpose: "client-portal", booking: portalUser.booking_id }, env.JWT_SECRET, 7 * 24 * 60 * 60);
      await sql`update client_portal_users set last_login = now() where id = ${portalUser.id}`;
      return json({ accessToken, studioName: portalUser.studio_name, studioSlug: portalUser.studio_slug, clientName: portalUser.name, bookingId: portalUser.booking_id });
    }
    if (request.method === "POST" && pathname === "/api/portal/setup-password") {
      const body = await readJson(request);
      const inviteToken = String(body?.inviteToken || body?.token || "");
      const password = String(body?.password || "");
      if (!inviteToken) return json({ error: "Invitation token is required." }, 400);
      if (!isStrongPassword(password)) return json({ error: strongPasswordMessage }, 400);
      const claims = await verifyAccessToken(inviteToken, env.JWT_SECRET);
      if (!claims || claims.purpose !== "client-invite") return json({ error: "Invalid or expired invitation." }, 401);
      const passwordData = await hashPassword(password);
      const updated = await sql`update client_portal_users set password_hash=${passwordData.hash},password_salt=${passwordData.salt},password_iterations=${passwordData.iterations},status='active',updated_at=now() where organization_id=${claims.org} and booking_id=${claims.booking} and lower(email)=lower(${claims.email}) and id=${claims.uid || (await sql`select id from client_portal_users where organization_id=${claims.org} and booking_id=${claims.booking} and lower(email)=lower(${claims.email}) limit 1`).id || null} returning id`;
      if (!updated) return json({ error: "Invitation not found. Please request a new invitation from your studio." }, 404);
      const accessToken = await signAccessToken({ sub: claims.booking, org: claims.org, role: "Client", purpose: "client-portal", booking: claims.booking }, env.JWT_SECRET, 7 * 24 * 60 * 60);
      return json({ accessToken, message: "Password set successfully." });
    }
    if (request.method === "POST" && pathname === "/api/portal/invite") {
      const user = await requireUser(request, env, sql);
      if (!user) return json({ error: "Authentication required" }, 401);
      if (!canWriteSales(user) && !canWriteDepartment(user, "accounts")) return json({ error: "Sales or Accounts write access required" }, 403);
      const body = await readJson(request);
      const bookingId = uuidOrNull(body?.bookingId);
      if (!bookingId) return json({ error: "Select a valid booking" }, 400);
      const clientName = String(body?.name || "").trim();
      const clientEmail = String(body?.email || "").trim().toLowerCase();
      if (!clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) return json({ error: "Enter a valid client email address." }, 400);
      await ensureCloudSchemaReady(sql);
      const [booking] = await sql`select b.id, c.name as client_name, l.couple_name from bookings b join customers c on c.id = b.customer_id and c.organization_id = b.organization_id left join leads l on l.id = b.lead_id and l.organization_id = b.organization_id where b.id = ${bookingId} and b.organization_id = ${user.organization_id} limit 1`;
      if (!booking) return json({ error: "Booking not found" }, 404);
      const [profile] = await sql`select studio_name, studio_slug from organization_profiles where organization_id = ${user.organization_id} limit 1`;
      const studioSlug = profile?.studio_slug || slugify(profile?.studio_name || user.organization_id);
      const tempPasswordData = await hashPassword(randomToken(32));
      const [portalUser] = await sql`
        insert into client_portal_users (organization_id, booking_id, email, password_hash, password_salt, password_iterations, name, phone, status)
        values (${user.organization_id}, ${bookingId}, ${clientEmail}, ${tempPasswordData.hash}, ${tempPasswordData.salt}, ${tempPasswordData.iterations}, ${clientName || booking.couple_name || booking.client_name || null}, ${String(body?.phone || "") || null}, 'active')
        on conflict (organization_id, lower(email)) do update set
          booking_id = ${bookingId},
          name = ${clientName || booking.couple_name || booking.client_name || null},
          phone = ${String(body?.phone || "") || null},
          password_hash = ${tempPasswordData.hash},
          password_salt = ${tempPasswordData.salt},
          password_iterations = ${tempPasswordData.iterations},
          status = 'active',
          updated_at = now()
        returning id
      `;
      if (!portalUser) return json({ error: "Could not create portal user" }, 500);
      const inviteToken = await signAccessToken({ org: user.organization_id, role: "Client", purpose: "client-invite", email: clientEmail, booking: bookingId, uid: portalUser.id }, env.JWT_SECRET, 7 * 24 * 60 * 60);
      const portalDomain = env.PORTAL_DOMAIN || `portal.${request.headers.get("host")?.replace(/^[^.]+\./, '') || "lenspireai.com"}`;
      const clientSlug = slugify(clientName || booking.couple_name || booking.client_name || clientEmail.split("@")[0]);
      const inviteUrl = `https://${portalDomain}/${studioSlug}/${clientSlug}?invite=${encodeURIComponent(inviteToken)}`;
      return json({ url: inviteUrl, email: clientEmail, expiresInDays: 7, clientName: clientName || booking.couple_name || booking.client_name });
    }
    return json({ error: "Not found" }, 404);
  } finally {
    await closeDatabase(sql);
  }
}
__name(portalAuthApi, "portalAuthApi");
var index_default = {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      var pwaResponse = await pwaRoutes(request, url, env);
      if (pwaResponse) return pwaResponse;
      if (url.hostname.startsWith("portal.") && request.method === "GET" && !url.pathname.startsWith("/api/")) return clientPortalApprovalPage();
      if (request.method === "GET" && url.pathname === "/client-portal") return clientPortalApprovalPage();
      if (request.method === "GET" && url.pathname === "/platform-migrations") return platformMigrationPage();
      if (request.method === "GET" && url.pathname === "/tenant-rehearsal") return tenantRehearsalPage();
      const logoAssetMatch = url.pathname.match(/^\/studio-assets\/logo\/([0-9a-f-]{36})$/i);
      if (request.method === "GET" && logoAssetMatch) return studioLogoAsset(request, env, logoAssetMatch[1]);
      const protectedApi = url.pathname.startsWith("/api/") && !url.pathname.startsWith("/api/auth/") && !url.pathname.startsWith("/api/platform/") && url.pathname !== "/api/setup" && url.pathname !== "/api/db-health" && url.pathname !== "/api/google/callback";
      if (protectedApi) {
        const claims = await requireAccessClaims(request, env);
        if (claims?.passwordUpgradeRequired) return json({ error: "Password upgrade required before accessing workspace data.", code: "password_upgrade_required" }, 403);
        if (claims?.org) {
          const sql = getDatabase(env);
          try {
            const [owner] = await sql`select 1 from platform_admins where user_id=${claims.sub} limit 1`;
            const restriction = owner ? null : await studioLicenseRestriction(sql, claims.org);
            if (restriction) return json({ error: restriction.message, code: restriction.code }, 403);
          } finally {
            await closeDatabase(sql);
          }
        }
      }
      if (request.method === "GET" && url.pathname === "/api/health") {
        return json({ ok: true, service: "lenspirecrm-api", time: (/* @__PURE__ */ new Date()).toISOString() });
      }
      if (request.method === "GET" && url.pathname === "/setup") return html(setupPage);
      if (request.method === "POST" && url.pathname === "/api/setup") return setupOwner(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/reset-password") return resetOwnerPassword(request, env);
      if (url.pathname.startsWith("/api/platform/organizations") || url.pathname === "/api/platform/tenant-integrity" || url.pathname === "/api/platform/production-readiness" || url.pathname === "/api/platform/operations" || url.pathname === "/api/platform/migrations" || url.pathname === "/api/platform/smoke-tests" || url.pathname === "/api/platform/tenant-rehearsal") return platformOrganizationsApi(request, env, url.pathname);
      if (url.pathname === "/api/client-portal" || url.pathname === "/api/client-portal/link" || url.pathname === "/api/client-portal/feedback" || url.pathname === "/api/client-portal/token") return clientPortalApi(request, env, url.pathname);
      if (url.pathname === "/api/portal/login" || url.pathname === "/api/portal/invite" || url.pathname === "/api/portal/setup-password") return portalAuthApi(request, env, url.pathname);
      if (url.pathname === "/api/users" || url.pathname.startsWith("/api/users/")) return usersApi(request, env, url.pathname);
      if (request.method === "GET" && url.pathname === "/api/db-health") {
        try {
          const sql = getDatabase(env);
          const [row] = await sql`select now() as now`;
          await closeDatabase(sql);
          return json({ ok: true, database: "reachable", now: row.now });
        } catch (error) {
          operationalEvent("error", "database.health_failed");
          return json({ ok: false, error: "Database health check failed" }, 503);
        }
      }
      if (request.method === "POST" && url.pathname === "/api/auth/login") {
        return login(request, env);
      }
      if (request.method === "POST" && url.pathname === "/api/auth/refresh") return refreshSession(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/logout") return logoutSession(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/change-password") return changePassword(request, env);
      if (request.method === "GET" && url.pathname === "/api/google/connect") return googleConnect(request, env);
      if (request.method === "GET" && url.pathname === "/api/google/callback") return googleCallback(request, env);
      if (url.pathname === "/api/drive/upload" || url.pathname === "/api/drive/files" || /^\/api\/drive\/files\/[0-9a-f-]{36}$/i.test(url.pathname) || url.pathname === "/api/backup" || url.pathname === "/api/backup/restore" || url.pathname === "/api/backup/auto/list" || url.pathname === "/api/backup/auto/latest" || url.pathname === "/api/backup/auto/trigger" || url.pathname === "/api/backup/auto/config" || /^\/api\/backup\/auto\/[0-9a-f-]{36}$/i.test(url.pathname)) {
        return driveApi(request, env, url.pathname);
      }
      if (url.pathname === "/api/lead-activities" || url.pathname === "/api/lead-activities/import" || /\/api\/leads\/[0-9a-f-]{36}\/activities$/i.test(url.pathname)) {
        return leadActivitiesApi(request, env, url.pathname);
      }
      if (url.pathname === "/api/workspace" || url.pathname === "/api/backup" || url.pathname === "/api/backup/restore" || url.pathname.startsWith("/api/events") || url.pathname.startsWith("/api/photographers") || url.pathname.startsWith("/api/production") || url.pathname.startsWith("/api/payments") || url.pathname === "/api/sales-targets") {
        return workspaceApi(request, env, url.pathname);
      }
      if (url.pathname === "/api/leads" || url.pathname.startsWith("/api/leads/")) {
        return leadsApi(request, env, url.pathname);
      }
      return json({ error: "Not found" }, 404);
    } catch (error) {
      if (error instanceof SchemaMigrationRequiredError) {
        operationalEvent("warning", "database.migration_required", { component: error.component });
        return json({ error: "Database migration required before this operation can continue", code: "schema_migration_required" }, 503, { "retry-after": "60" });
      }
      operationalEvent("error", "request.unhandled");
      console.error(error?.stack || error);
      return json({ error: "The server could not complete the request" }, 500);
    }
  }
};
async function scheduledController(controller, env, ctx) {
  const sql = getDatabase(env);
  try {
    await ensureCloudSchemaReady(sql);
    const orgs = await sql`select id, auto_backup_enabled as "enabled", auto_backup_interval_hours as "intervalHours", auto_backup_retention_count as "retentionCount", last_backup_at as "lastBackupAt" from organizations o join backup_configs bc on bc.organization_id = o.id where bc.auto_backup_enabled = true`;
    const now = Date.now();
    let created = 0;
    for (const org of orgs) {
      const lastBackup = org.lastBackupAt ? Date.parse(org.lastBackupAt) : 0;
      const intervalMs = Number(org.intervalHours) * 3600000;
      if (now - lastBackup < intervalMs) continue;
      try {
        const result = await createAutoBackup(sql, org.id, {}, env);
        const [cfg] = await sql`select coalesce(auto_backup_retention_count, 7) as cnt from backup_configs where organization_id = ${org.id}`;
        await pruneAutoBackups(sql, org.id, cfg?.cnt || 7);
        created++;
      } catch (error) {
        operationalEvent("error", "auto_backup_failed", { organizationId: org.id, error: String(error?.message || error) });
      }
    }
    if (created > 0) operationalEvent("info", "auto_backups_created", { count: created });
  } finally {
    await closeDatabase(sql);
  }
}
export {
  index_default as default,
  scheduledController as scheduled
};
//# sourceMappingURL=index.js.map
