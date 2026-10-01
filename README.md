# JuvArt · Estudio Fotografía & Video

Sitio web de una sola página para el estudio JuvArt: presentación, servicios, paquetes, contacto, dirección y pie, con modo claro y oscuro.

## Estructura

- `index.html` — contenido de la página
- `css/estilos.css` — estilos y paleta (claro / oscuro)
- `js/app.js` — datos del estudio (contacto, dirección, horario, redes) y comportamiento
- `img/` — logo, isotipo y foto del equipo

## Datos del estudio

WhatsApp, teléfono, correo, dirección, horario y redes sociales se llenan en el objeto `ESTUDIO` al inicio de `js/app.js`.

## Verlo localmente

Es un sitio estático: basta abrir `index.html`, o levantar el servidor incluido:

```bash
node .claude/servidor.js
```

y entrar a http://localhost:5173
