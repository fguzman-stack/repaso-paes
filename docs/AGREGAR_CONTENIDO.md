# Guía para Agregar Nuevo Contenido a PAES Trainer

La arquitectura de **PAES Trainer** está completamente desacoplada: **agregar preguntas, ejes temáticos o retos no requiere tocar ningún componente React**.

---

## 1. Esquema de una Pregunta

Todas las preguntas se ubican en la carpeta `src/data/questions/` en archivos con sufijo `.data.ts` (por ejemplo `m1.data.ts`, `lectora.data.ts`).

### Estructura TypeScript:
```typescript
export interface Question {
  id: string;               // Identificador único (ej: 'm1-031')
  materia: SubjectId;       // 'm1' | 'm2' | 'lectora' | 'historia' | 'biologia' | 'fisica' | 'quimica' | 'tp'
  ejeId: string;            // ID del eje temático (ej: 'm1-algebra')
  tema: string;             // Subtema específico (ej: 'Productos notables')
  dificultad: 1 | 2 | 3;    // 1: Básica, 2: Media, 3: Avanzada
  enunciado: string;        // Texto del problema. Soporta fórmulas KaTeX entre $...$ o $$...$$
  textoBase?: string;       // (Opcional) Texto de lectura para comprensión de textos
  alternativas: {
    id: 'A' | 'B' | 'C' | 'D' | 'E';
    texto: string;
    explicacionDistractor?: string; // Análisis del error cognitivo que lleva a este distractor
  }[];
  correcta: 'A' | 'B' | 'C' | 'D' | 'E';
  explicacionPasoAPaso: string[];   // Lista ordenada con los pasos lógicos de resolución
  habilidad: 'Resolver problemas' | 'Modelar' | 'Representar' | 'Argumentar' | 'Localizar' | 'Interpretar' | 'Evaluar';
  origen: 'Pregunta original, basada en el temario';
  tags: string[];
  revisar?: boolean;        // true si tienes dudas sobre un dato y requieres revisión experta
}
```

---

## 2. Ejemplo Práctico de Adición

Copia la siguiente plantilla y agrégala al arreglo correspondiente en `src/data/questions/m1.data.ts`:

```typescript
{
  id: 'm1-031',
  materia: 'm1',
  ejeId: 'm1-numeros',
  tema: 'Operatoria con potencias',
  dificultad: 2,
  enunciado: '¿Cuál es el valor simplificado de la expresión $\\frac{2^5 \\cdot 4^2}{8^3}$?',
  alternativas: [
    { id: 'A', texto: '$1$', explicacionDistractor: 'Pasa todo a base 2: $2^5 \\cdot (2^2)^2 / (2^3)^3 = 2^{5+4} / 2^9 = 2^9 / 2^9 = 1$.' },
    { id: 'B', texto: '$2$', explicacionDistractor: 'Resta erróneamente los exponentes en el numerador.' },
    { id: 'C', texto: '$4$', explicacionDistractor: 'Multiplica bases sin homogeneizar a potencia de 2.' },
    { id: 'D', texto: '$\\frac{1}{2}$', explicacionDistractor: 'Invierte la fracción resultante.' },
  ],
  correcta: 'A',
  explicacionPasoAPaso: [
    'Expresamos todas las potencias en la base común 2: $4 = 2^2$ y $8 = 2^3$.',
    'Numerador: $2^5 \\cdot (2^2)^2 = 2^5 \\cdot 2^4 = 2^{5+4} = 2^9$.',
    'Denominador: $(2^3)^3 = 2^{3 \\cdot 3} = 2^9$.',
    'Cociente: $\\frac{2^9}{2^9} = 1$.',
  ],
  habilidad: 'Resolver problemas',
  origen: 'Pregunta original, basada en el temario',
  tags: ['potencias', 'números racionales'],
}
```

Al guardar el archivo, la pregunta se incorporará automáticamente a:
- Los quizzes temáticos del eje.
- Los simulacros y ensayos.
- La cola diaria del algoritmo de repetición espaciada SM-2.

---

## 3. Uso de KaTeX para Fórmulas Matemáticas y Químicas

- **En línea (inline)**: Encierra la fórmula entre signos de dólar simple `$x^2 + y^2 = r^2$`.
- **En bloque centrado (display)**: Encierra la fórmula entre signos de doble dólar `$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$`.
- **Ecuaciones químicas**: `$$\text{CH}_4 + 2\,\text{O}_2 \longrightarrow \text{CO}_2 + 2\,\text{H}_2\text{O}$$`.

---

## 4. Verificación de Integridad

Tras agregar nuevas preguntas, ejecuta:
```bash
npm test
```
Esto asegurará que los tipos, el algoritmo SM-2 y las funciones de puntaje sigan operando correctamente.
