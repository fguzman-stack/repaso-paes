# PAES Trainer 🇨🇱

Plataforma web de estudio para la **Prueba de Acceso a la Educación Superior (PAES)** de Chile, diseñada con rigor pedagógico, técnicas respaldadas por la ciencia cognitiva (recuperación activa, repetición espaciada SM-2, retroalimentación inmediata explicativa) y arquitectura local-first (PWA y Dexie IndexedDB).

---

## 🚀 Tecnologías Principales

- **Framework**: React 19 + TypeScript + Vite.
- **Enrutamiento**: React Router v7.
- **Estado Global**: Zustand con persistencia.
- **Persistencia Local**: Dexie.js (IndexedDB) para guardar historial de intentos, tarjetas SM-2 y simulacros sin necesidad de backend.
- **Tipografía Matemática y Científica**: KaTeX (renderizado seguro en bloque y en línea).
- **Gráficos y Analítica**: Recharts.
- **Diseño**: Tailwind CSS, tipografías *Space Grotesk* + *Plus Jakarta Sans*, modo claro y modo oscuro nativos.
- **PWA**: `vite-plugin-pwa` con service worker, manifest y soporte offline completo.
- **Pruebas Unitarias**: Vitest (tests para SM-2, cálculo de puntaje estimado y estado de usuario).

---

## 🛠️ Instalación y Ejecución Local

### Prerrequisitos
- Node.js 18+ o superior.
- npm 9+ o pnpm.

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd paes-trainer

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo en el puerto 3000
npm run dev

# 4. Ejecutar pruebas unitarias
npm test

# 5. Compilar para producción
npm run build
```

---

## 🚢 Despliegue en Producción (Vercel / Netlify / Cloudflare Pages)

### En Vercel
1. Conecta tu repositorio de GitHub.
2. Vercel detectará automáticamente Vite:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Haz clic en **Deploy**.

### En Netlify
1. Conecta el repositorio.
2. Configuración de compilación:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Agrega un archivo `public/_redirects` con el siguiente contenido para SPA routing:
   ```
   /*    /index.html   200
   ```
