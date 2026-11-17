import {encode,validate,svg,raster} from './qr.js';
const $=id=>document.getElementById(id);
let type='text', current=null, timer;
const escapeWifi=s=>s.replace(/([\\;,:" ])/g,'\\$1');
function payload(){
  if(type==='text') return $('content').value;
  if(!$('ssid').value) return '';
  const auth=$('auth').value;
  return `WIFI:T:${auth};S:${escapeWifi($('ssid').value)};${auth==='nopass'?'':`P:${escapeWifi($('password').value)};`}H:${$('hidden').checked};;`;
}
function invalidate(){
  current=null;$('qr').replaceChildren();$('qr').hidden=true;$('empty').hidden=false;
  $('png').disabled=$('svg').disabled=true;$('payload').textContent='';
  $('dimensions').textContent=$('level').textContent='—';
}
function generate(){
  clearTimeout(timer);invalidate();
  const text=payload();$('byte-count').textContent=`${new TextEncoder().encode($('content').value).length} bytes`;
  try{
    const qr=encode(text,$('ecc').value);
    if(!validate(qr,text)) throw new Error('La lectura de verificación no coincide. Reduce el contenido o cambia el nivel de corrección.');
    current=qr;
    $('qr').innerHTML=svg(qr);$('qr').hidden=false;$('empty').hidden=true;
    $('status').className='badge';$('status').textContent='✓ Verificado';
    $('dimensions').textContent=`Versión ${qr.version} · ${qr.size} × ${qr.size}`;
    $('level').textContent=`Corrección ${$('ecc').value}`;
    $('payload').textContent=text;
    $('message').textContent='Los bytes coinciden. Listo para compartir.';
    $('png').disabled=$('svg').disabled=false;
  }catch(error){$('status').className='badge error';$('status').textContent='Sin generar';$('message').textContent=error.message;}
}
function changed(){invalidate();$('status').className='badge';$('status').textContent='Pendiente';$('message').textContent='';clearTimeout(timer);timer=setTimeout(generate,350);}
document.querySelectorAll('[data-type]').forEach(tab=>{
 tab.addEventListener('click',()=>{
   type=tab.dataset.type;
   document.querySelectorAll('[data-type]').forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.classList.toggle('active',active);t.tabIndex=active?0:-1;});
   $('text-panel').hidden=type!=='text';$('wifi-panel').hidden=type!=='wifi';generate();
 });
 tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?$('text-tab'):event.key==='End'?$('wifi-tab'):tab.id==='text-tab'?$('wifi-tab'):$('text-tab');next.click();next.focus();}});
});
['content','ssid','password','auth','hidden','ecc'].forEach(id=>$(id).addEventListener('input',()=>{$('password').disabled=$('auth').value==='nopass';changed();}));
$('generate').addEventListener('click',generate);
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);}
$('svg').addEventListener('click',()=>{if(current)download(new Blob([svg(current)],{type:'image/svg+xml'}),'qr-nativo.svg');});
$('png').addEventListener('click',()=>{
 if(!current)return;const scale=Math.max(4,Math.ceil(1024/(current.size+8)));const image=raster(current,scale);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=image.width;
 canvas.getContext('2d').putImageData(new ImageData(image.data,image.width,image.height),0,0);
 canvas.toBlob(blob=>{if(blob)download(blob,'qr-nativo.png');},'image/png');
});
generate();
