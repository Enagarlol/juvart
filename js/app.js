/* ==========================================================
   DATOS DEL ESTUDIO
   Llena estos campos y la página se actualiza sola
   (contacto, mapa, horario y redes sociales).
   ========================================================== */
const ESTUDIO = {
  whatsapp: '529621909505',  // con lada de país, solo números
  telefono: '962 190 9505',  // como quieres que se vea
  correo: 'juvart1908@gmail.com',
  direccion: 'Tapachula, Chiapas',  // texto que se muestra. Ej: 'Calle 60 #123, Centro, Tapachula, Chiapas'
  // Mapa con marcador en las coordenadas del estudio (latitud,longitud en "q"; "z" es el zoom)
  mapaEmbed: 'https://www.google.com/maps?q=14.895524,-92.291799&z=18&hl=es-419&output=embed',
  // Enlace del botón "Cómo llegar": Google Maps > Compartir > Copiar vínculo
  mapaEnlace: 'https://maps.app.goo.gl/TgRYBWBsm1cS3T82A',
  horario: [
    ['Todos los días', '24 horas'],
  ],
  // Pega aquí el enlace completo de cada red. Las que queden vacías no se muestran.
  redes: {
    facebook: 'https://www.facebook.com/profile.php?id=100064420225077',
    instagram: 'https://www.instagram.com/juvart_estudiofotografico/',
    tiktok: '',
    youtube: '',
  },
};

const ICONOS_REDES = {
  facebook: '<path d="M14.500 8.500H17V5h-2.500A3.500 3.500 0 0 0 11 8.500V11H8.500v3.500H11V21h3.500v-6.500H17l.5-3.500h-3V9a.5.5 0 0 1 .5-.5z"/>',
  instagram: '<rect x="3.500" y="3.500" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".6" fill="currentColor"/>',
  tiktok: '<path d="M14 3.500v11a3.500 3.500 0 1 1-3.500-3.500"/><path d="M14 3.500c.3 2.600 2 4.300 4.500 4.500"/>',
  youtube: '<rect x="2.500" y="6" width="19" height="12" rx="4"/><path d="m10.500 9.500 4 2.500-4 2.500z"/>',
};

document.documentElement.classList.add('js');

/* ---------- Tema claro / oscuro ---------- */
const raiz = document.documentElement;
const botonTema = document.getElementById('cambiar-tema');
const metaColor = document.querySelector('meta[name="theme-color"]');

function aplicarTema(tema) {
  raiz.setAttribute('data-theme', tema);
  botonTema.setAttribute('aria-label', tema === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  metaColor.setAttribute('content', tema === 'oscuro' ? '#0F0E0C' : '#F6F3EC');
}
aplicarTema(raiz.getAttribute('data-theme') || 'claro');

botonTema.addEventListener('click', () => {
  const nuevo = raiz.getAttribute('data-theme') === 'oscuro' ? 'claro' : 'oscuro';
  aplicarTema(nuevo);
  try { localStorage.setItem('juvart-tema', nuevo); } catch (e) {}
});

// Sigue al sistema mientras la persona no haya elegido un tema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  let guardado = null;
  try { guardado = localStorage.getItem('juvart-tema'); } catch (err) {}
  if (!guardado) aplicarTema(e.matches ? 'oscuro' : 'claro');
});

/* ---------- Menú móvil y encabezado ---------- */
const nav = document.getElementById('nav');
const menuBoton = document.getElementById('menu-boton');
const encabezado = document.getElementById('encabezado');

function cerrarMenu() {
  nav.classList.remove('abierto');
  menuBoton.setAttribute('aria-expanded', 'false');
  menuBoton.setAttribute('aria-label', 'Abrir menú');
}
menuBoton.addEventListener('click', () => {
  const abierto = nav.classList.toggle('abierto');
  menuBoton.setAttribute('aria-expanded', String(abierto));
  menuBoton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
});
nav.addEventListener('click', (e) => { if (e.target.closest('a')) cerrarMenu(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarMenu(); });

const alDesplazar = () => encabezado.classList.toggle('con-borde', window.scrollY > 8);
window.addEventListener('scroll', alDesplazar, { passive: true });
alDesplazar();

/* ---------- Sección activa en el menú ---------- */
const enlaces = [...nav.querySelectorAll('a')];
const observadorSecciones = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    enlaces.forEach((a) => a.classList.toggle('activo', a.getAttribute('href') === '#' + entrada.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => observadorSecciones.observe(s));

/* ---------- Aparición al hacer scroll ---------- */
const observadorRevelar = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    entrada.target.classList.add('visible');
    observadorRevelar.unobserve(entrada.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.revelar').forEach((el) => observadorRevelar.observe(el));

/* ---------- Datos de contacto, dirección y horario ---------- */
function ponerDato(id, texto, href) {
  const el = document.getElementById(id);
  if (!texto) return;
  el.textContent = texto;
  if (href) el.href = href;
}
const soloNumeros = (t) => t.replace(/\D/g, '');

ponerDato('dato-whatsapp', ESTUDIO.whatsapp && (ESTUDIO.telefono || '+' + soloNumeros(ESTUDIO.whatsapp)),'https://wa.me/' + soloNumeros(ESTUDIO.whatsapp));
ponerDato('dato-telefono', ESTUDIO.telefono, 'tel:' + soloNumeros(ESTUDIO.telefono));
ponerDato('dato-correo', ESTUDIO.correo, 'mailto:' + ESTUDIO.correo);

document.getElementById('dato-horario').innerHTML = ESTUDIO.horario
  .map(([dia, horas]) => `<div><dt>${dia}</dt><dd>${horas}</dd></div>`)
  .join('');

if (ESTUDIO.direccion) document.getElementById('dato-direccion').textContent = ESTUDIO.direccion;

// Sin enlace ni embed propios, el mapa y la ruta se arman a partir de la dirección escrita
const consultaMapa = encodeURIComponent(ESTUDIO.direccion);
const mapaSrc = ESTUDIO.mapaEmbed || (ESTUDIO.direccion && `https://www.google.com/maps?q=${consultaMapa}&output=embed`);
const mapaEnlace = ESTUDIO.mapaEnlace || (ESTUDIO.direccion && 'https://www.google.com/maps/dir/?api=1&destination=' + consultaMapa);

if (mapaSrc) {
  document.getElementById('mapa').innerHTML =
    `<iframe title="Mapa de ubicación de JuvArt" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" src="${mapaSrc}"></iframe>`;
}
if (mapaEnlace) {
  document.getElementById('como-llegar').href = mapaEnlace;
} else {
  document.getElementById('como-llegar').removeAttribute('target');
}

/* ---------- Redes sociales ---------- */
document.querySelectorAll('[data-redes]').forEach((caja) => {
  caja.innerHTML = Object.entries(ESTUDIO.redes).filter(([, url]) => url).map(([red, url]) => {
    const nombre = red.charAt(0).toUpperCase() + red.slice(1);
    return `<a href="${url}" target="_blank" rel="noopener" aria-label="${nombre}" title="${nombre}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS_REDES[red]}</svg></a>`;
  }).join('');
});

/* ---------- Paquetes: preselecciona el servicio en el formulario ---------- */
const selectServicio = document.getElementById('servicio');
document.querySelectorAll('[data-paquete]').forEach((boton) => {
  boton.addEventListener('click', () => { selectServicio.value = 'Paquete ' + boton.dataset.paquete; });
});

/* ---------- Formulario: abre WhatsApp (o correo) con el mensaje listo ---------- */
const formulario = document.getElementById('formulario');
const aviso = document.getElementById('formulario-aviso');

formulario.addEventListener('submit', (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(formulario));
  let primeroInvalido = null;

  ['nombre', 'telefono'].forEach((campo) => {
    const el = formulario.elements[campo];
    const vacio = !el.value.trim();
    el.classList.toggle('invalido', vacio);
    if (vacio && !primeroInvalido) primeroInvalido = el;
  });

  aviso.classList.toggle('error', Boolean(primeroInvalido));
  if (primeroInvalido) {
    aviso.textContent = 'Escribe tu nombre y un teléfono para poder responderte.';
    primeroInvalido.focus();
    return;
  }

  const lineas = [
    `Hola, soy ${datos.nombre.trim()}.`,
    `Me interesa: ${datos.servicio}.`,
    datos.fecha ? `Fecha del evento: ${datos.fecha.split('-').reverse().join('/')}.` : '',
    datos.mensaje.trim(),
    `Mi teléfono: ${datos.telefono.trim()}`,
  ].filter(Boolean);
  const texto = encodeURIComponent(lineas.join('\n'));

  if (ESTUDIO.whatsapp) {
    window.open(`https://wa.me/${soloNumeros(ESTUDIO.whatsapp)}?text=${texto}`, '_blank', 'noopener');
    aviso.textContent = 'Abrimos WhatsApp con tu mensaje listo. Solo falta enviarlo.';
  } else if (ESTUDIO.correo) {
    window.location.href = `mailto:${ESTUDIO.correo}?subject=${encodeURIComponent('Solicitud: ' + datos.servicio)}&body=${texto}`;
    aviso.textContent = 'Abrimos tu correo con el mensaje listo. Solo falta enviarlo.';
  } else {
    aviso.classList.add('error');
    aviso.textContent = 'Falta configurar el WhatsApp o correo del estudio en js/app.js.';
  }
});

document.getElementById('anio').textContent = new Date().getFullYear();
