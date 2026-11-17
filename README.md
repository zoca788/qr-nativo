# QR Nativo

Generador estático de códigos QR directos, sin redirecciones intermedias ni servicios de generación externos. Publicado en https://zoca788.github.io/qr-nativo/.

## Uso

Escribe texto, pega una URL o configura una red Wi-Fi. El contenido se codifica exactamente, con UTF-8 y ECI 26 para Unicode. Selecciona corrección L, M, Q o H y descarga PNG o SVG. Un lector independiente decodifica el símbolo y compara sus bytes con los originales antes de permitir la descarga.

La información se procesa en memoria del navegador: no se transmite ni se guarda en almacenamiento local. No hay analítica, fuentes remotas ni CDN en tiempo de ejecución. GitHub sirve los archivos estáticos y puede registrar las peticiones de acceso según sus políticas.

La corrección Reed–Solomon permite reparar daños y no proporciona cifrado ni autenticación. Cualquier lector puede acceder al contenido. Los porcentajes aproximados de recuperación se refieren a palabras de código y no garantizan resistir un porcentaje arbitrario de área tapada. Los QR tienen margen blanco de cuatro módulos y colores negro/blanco.

Un QR no caduca por este generador. Una URL incrustada sí depende de la disponibilidad del destino. El generador no controla las redirecciones que pueda configurar ese destino. La compatibilidad del formato Wi-Fi depende del lector y el sistema del dispositivo; redes empresariales no están soportadas.

## Desarrollo

Requiere Node.js y npm.

```
npm ci
npm test
npm run build
```

Sirve la raíz del repositorio mediante un servidor HTTP. `app.js` está compilado y se incluye en Git para que GitHub Pages publique la raíz de `main` sin compilar. Tras cambiar `src/` o `vendor/`, ejecuta build y confirma también `app.js`.

## Motor y licencias

- Project Nayuki QR Code Generator (MIT), fuente fijada al commit `bcfe1b018cec5f1f91b5705eca5bb4cdd34e9f8d`, en `vendor/qrcodegen.ts`. Se añadió únicamente la exportación ES por defecto. https://github.com/nayuki/QR-Code-generator
- jsQR 1.4.0 (Apache-2.0), decodificador independiente. https://github.com/cozmo/jsQR
- Avisos completos de terceros en THIRD_PARTY_NOTICES.txt.
- Referencia de corrección: https://www.qrcode.com/en/about/error_correction.html

## Publicación

GitHub Pages, rama `main`, carpeta raíz `/`. No requiere secretos ni servidor de aplicación.
