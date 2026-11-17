import assert from 'node:assert/strict';
import {encode,validate,raster,svg} from '../src/qr.js';
import jsQR from 'jsqr';
let checks=0;
const samples=['https://example.com/path?q=exacto&otra=1#seccion','  texto con espacios\ny saltos  ','Español: áéíóú, ñ. 日本語 🌎','01234567890123456789','WIFI:T:WPA;S:Mi\\;red;P:clavé123;H:false;;','<script>alert("hola")</script>'];
for(const level of ['L','M','Q','H']) for(const text of samples){const qr=encode(text,level);assert.ok(validate(qr,text));assert.equal(qr.errorCorrectionLevel.ordinal,{L:0,M:1,Q:2,H:3}[level]);assert.ok(!validate(qr,text+'!'));assert.ok(svg(qr).includes('viewBox'));checks++;}
// Independent decoder must recover actual damaged symbol data at level H.
const text='Correccion Reed Solomon 1234567890';const qr=encode(text,'H');const image=raster(qr,7);
// Flip two data modules away from finder/timing patterns.
for(const [x,y] of [[qr.size-1,qr.size-1],[qr.size-2,qr.size-2]])for(let dy=0;dy<7;dy++)for(let dx=0;dx<7;dx++){const i=(((y+4)*7+dy)*image.width+(x+4)*7+dx)*4;image.data[i]=image.data[i+1]=image.data[i+2]=255-image.data[i];}
assert.equal(jsQR(image.data,image.width,image.height).data,text);checks++;
assert.throws(()=>encode(''));assert.throws(()=>encode('x'.repeat(3000)));assert.throws(()=>encode('x','invalid'));assert.ok(validate(encode('a'.repeat(1200),'L'),'a'.repeat(1200)));checks+=4;
console.log(`${checks} comprobaciones superadas: bytes exactos, Unicode, niveles L/M/Q/H, capacidad y recuperación tras daño.`);
