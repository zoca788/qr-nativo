import engine from '../vendor/qrcodegen.ts';
import jsQR from 'jsqr';
const levels = {L:engine.QrCode.Ecc.LOW,M:engine.QrCode.Ecc.MEDIUM,Q:engine.QrCode.Ecc.QUARTILE,H:engine.QrCode.Ecc.HIGH};
export function encode(text, level='M') {
  if (!text.length) throw new Error('Escribe el contenido que quieres guardar en el QR.');
  if (!levels[level]) throw new Error('Nivel de corrección no válido.');
  const bytes = new TextEncoder().encode(text);
  if (bytes.length > 2953) throw new Error('El contenido supera la capacidad de un QR. Reduce el texto.');
  const segments = engine.QrSegment.makeSegments(text);
  if (/[^\x00-\x7f]/.test(text)) segments.unshift(engine.QrSegment.makeEci(26));
  try { return engine.QrCode.encodeSegments(segments,levels[level],1,40,-1,false); }
  catch { throw new Error('Este contenido no cabe con el nivel '+level+'. Reduce el texto o elige una corrección menor.'); }
}
export function raster(qr, scale=6) {
  const width=(qr.size+8)*scale;
  const data=new Uint8ClampedArray(width*width*4); data.fill(255);
  for(let y=0;y<qr.size;y++) for(let x=0;x<qr.size;x++) if(qr.getModule(x,y)) {
    for(let dy=0;dy<scale;dy++) for(let dx=0;dx<scale;dx++) {
      const i=(((y+4)*scale+dy)*width+(x+4)*scale+dx)*4;
      data[i]=data[i+1]=data[i+2]=0;
    }
  }
  return {data,width,height:width};
}
export function validate(qr,text) {
  const {data,width,height}=raster(qr,4);
  const decoded=jsQR(data,width,height,{inversionAttempts:'dontInvert'});
  const expected=new TextEncoder().encode(text);
  return !!decoded && decoded.binaryData.length===expected.length && expected.every((b,i)=>decoded.binaryData[i]===b);
}
export function svg(qr) {
  let path='';
  for(let y=0;y<qr.size;y++) for(let x=0;x<qr.size;x++) if(qr.getModule(x,y)) path+=`M${x+4},${y+4}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${qr.size+8} ${qr.size+8}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="white"/><path d="${path}" fill="black"/></svg>`;
}
