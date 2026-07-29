# CARTELERA — Catálogo de series (Actividad práctica)

Aplicación web en **JavaScript Vanilla** que consume la API pública de
[TVMaze](https://www.tvmaze.com/api) para mostrar un catálogo de series
con una interfaz inspirada en plataformas como Netflix/Spotify.

## Cómo ejecutarla

No requiere instalación ni build. Basta con abrir `index.html` en el
navegador, o servirlo con un servidor estático simple, por ejemplo:

```bash
npx serve .
# o
python3 -m http.server 8080
```

Luego visita `http://localhost:8080`.

> Se recomienda usar un servidor local (en vez de abrir el archivo con
> doble clic) para evitar restricciones de CORS del navegador con `fetch()`.

## Estructura del proyecto

```
catalogo/
├── index.html          # Estructura de la página (sin tarjetas hardcodeadas)
├── css/
│   └── styles.css      # Identidad visual "cartelera de cine"
├── js/
│   ├── api.js           # Acceso a la API REST (fetch + async/await)
│   ├── cards.js          # Construcción dinámica de las tarjetas (DOM)
│   ├── pagination.js     # Construcción dinámica de los controles de paginación
│   └── app.js             # Orquestación: estado, carga de datos, render
└── README.md
```

Cada módulo tiene una única responsabilidad, siguiendo la organización
modular vista en clase:

- **api.js**: solo se comunica con la API. No toca el DOM.
- **cards.js**: solo construye elementos del DOM a partir de datos.
- **pagination.js**: solo construye los controles de paginación.
- **app.js**: conecta todo lo anterior y mantiene el estado (página actual).

## Cumplimiento de requerimientos

| Requerimiento | Dónde se resuelve |
|---|---|
| Consumir una API REST pública con `GET` | `js/api.js` → `fetchShowsPage()` |
| `fetch()` con `async`/`await` | `js/api.js` |
| Resultados mostrados en tarjetas | `js/cards.js` → `createShowCard()` |
| Cada tarjeta con imagen, título y año | `createShowCard()` (póster, `card-title`, `card-year-stub`) |
| Paginación entre resultados | `js/pagination.js` + `state.page` en `app.js` (usa el parámetro nativo `?page=` de TVMaze) |
| Tarjetas construidas 100% por JS | `index.html` solo define un `<section id="cardsGrid">` vacío |
| Estructura modular | Carpetas `css/` y `js/` con un archivo por responsabilidad |

## Notas sobre la API

TVMaze pagina el catálogo de forma nativa (`/shows?page=N`, ~250 series
por página). Cuando se llega al final del catálogo, la API responde con
un arreglo vacío o `404`; la aplicación detecta esto y deshabilita el
botón "Siguiente" en lugar de mostrar una página vacía.

Si se prefiere usar otra API (por ejemplo Studio Ghibli o cualquiera
sugerida en la guía), solo es necesario editar `API_BASE_URL` y la
función `fetchShowsPage()` en `js/api.js`, y ajustar los nombres de
campos (`name`, `image`, `premiered`, etc.) en `js/cards.js`.
