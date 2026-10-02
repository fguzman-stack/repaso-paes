# Repaso PAES

Aplicación web para preparar la PAES con práctica por materia, simulacros, repetición espaciada, juegos de aprendizaje y seguimiento de progreso local.

## Tecnologías

- React 19 + TypeScript + Vite
- React Router
- Zustand + Dexie para persistencia local
- Tailwind CSS
- Vitest
- PWA con soporte offline

## Desarrollo Local

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: compila la aplicación para producción.
- `npm run preview`: previsualiza la compilación.
- `npm run lint`: ejecuta TypeScript sin emitir archivos.
- `npm test`: ejecuta las pruebas.

## GitHub Pages

El proyecto está configurado para publicarse en GitHub Pages desde GitHub Actions. La compilación genera la carpeta `dist` y se despliega automáticamente al hacer push a `main`.
