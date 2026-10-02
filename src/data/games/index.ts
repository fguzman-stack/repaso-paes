export interface LightningQuestion {
  id: string;
  enunciado: string;
  opciones: string[];
  correcta: string;
  explicacion: string;
}

export const LIGHTNING_QUESTIONS: LightningQuestion[] = [
  {
    id: 'lm-1',
    enunciado: '¿Cuánto es el $25\\%$ de $160$?',
    opciones: ['40', '35', '50', '30'],
    correcta: '40',
    explicacion: 'El 25% equivale a la cuarta parte: 160 / 4 = 40.',
  },
  {
    id: 'lm-2',
    enunciado: '¿Cuál es el valor de $(-3)^3$?',
    opciones: ['-27', '27', '-9', '9'],
    correcta: '-27',
    explicacion: 'Base negativa con exponente impar resulta negativa: (-3) * (-3) * (-3) = -27.',
  },
  {
    id: 'lm-3',
    enunciado: 'Si $2x + 6 = 18$, ¿cuál es el valor de $x$?',
    opciones: ['6', '5', '8', '12'],
    correcta: '6',
    explicacion: '2x = 18 - 6 = 12 => x = 12 / 2 = 6.',
  },
  {
    id: 'lm-4',
    enunciado: '¿Cuánto es $\\frac{1}{2} + \\frac{1}{4}$?',
    opciones: ['3/4', '2/6', '1/8', '2/4'],
    correcta: '3/4',
    explicacion: '2/4 + 1/4 = 3/4.',
  },
  {
    id: 'lm-5',
    enunciado: '¿Cuál es el valor de $\\sqrt{144} - \\sqrt{49}$?',
    opciones: ['5', '7', '12', '17'],
    correcta: '5',
    explicacion: '12 - 7 = 5.',
  },
  {
    id: 'lm-6',
    enunciado: 'Si el precio de un artículo de $200 aumenta un $15\\%$, ¿cuál es el nuevo precio?',
    opciones: ['$230', '$215', '$220', '$245'],
    correcta: '$230',
    explicacion: '15% de 200 es 30 => 200 + 30 = 230.',
  },
  {
    id: 'lm-7',
    enunciado: '¿Cuál es el desarrollo de $(x + 5)(x - 5)$?',
    opciones: ['x² - 25', 'x² + 25', 'x² - 10x + 25', 'x² - 5'],
    correcta: 'x² - 25',
    explicacion: 'Suma por su diferencia: a² - b² = x² - 25.',
  },
  {
    id: 'lm-8',
    enunciado: '¿Cuál es la pendiente de la recta $y = -4x + 7$?',
    opciones: ['-4', '4', '7', '-7'],
    correcta: '-4',
    explicacion: 'En la forma y = mx + n, el coeficiente de x es la pendiente m = -4.',
  },
];

export interface TimelineEvent {
  id: string;
  año: number;
  hito: string;
  descripcion: string;
}

export interface TimelineChallenge {
  id: string;
  titulo: string;
  periodo: string;
  eventos: TimelineEvent[];
}

export const TIMELINE_CHALLENGES: TimelineChallenge[] = [
  {
    id: 'hist-chile-1',
    titulo: 'Chile en el Siglo XX: Hitos de Transformación',
    periodo: '1920 - 1990',
    eventos: [
      { id: 'ev-1', año: 1925, hito: 'Promulgación de la Constitución de 1925', descripcion: 'Estableció el régimen presidencialista y separó la Iglesia del Estado.' },
      { id: 'ev-2', año: 1938, hito: 'Triunfo del Frente Popular (Pedro Aguirre Cerda)', descripcion: 'Inicio de los gobiernos radicales y fomento a la educación pública y la CORFO.' },
      { id: 'ev-3', año: 1949, hito: 'Concesión del voto femenino universal en elecciones presidenciales', descripcion: 'Hito cívico fundamental impulsado por el Movimiento Pro-Emancipación de las Mujeres (MEMCH).' },
      { id: 'ev-4', año: 1970, hito: 'Elección de Salvador Allende (Unidad Popular)', descripcion: 'Comienzo de la vía chilena al socialismo y nacionalización del cobre.' },
      { id: 'ev-5', año: 1988, hito: 'Plebiscito del 5 de Octubre', descripcion: 'Triunfo de la opción NO que abrió la transición democrática en Chile.' },
    ],
  },
];

export interface ErrorDetectiveCase {
  id: string;
  problema: string;
  pasos: { numero: number; contenido: string; tieneError: boolean; explicacion: string }[];
  conclusionFinal: string;
}

export const ERROR_CASES: ErrorDetectiveCase[] = [
  {
    id: 'det-1',
    problema: 'Resolver la ecuación: $2(3x - 4) = 4x + 10$',
    pasos: [
      { numero: 1, contenido: 'Distribuir el 2 en el paréntesis: $6x - 8 = 4x + 10$', tieneError: false, explicacion: 'Distribución correcta de 2 * 3x y 2 * (-4).' },
      { numero: 2, contenido: 'Restar 4x a ambos lados: $2x - 8 = 10$', tieneError: false, explicacion: '6x - 4x = 2x.' },
      { numero: 3, contenido: 'Restar 8 a ambos lados: $2x = 10 - 8 = 2$', tieneError: true, explicacion: '¡ERROR AQUÍ! Al tener -8, se debe sumar 8 a ambos lados (2x = 10 + 8 = 18), no restar.' },
      { numero: 4, contenido: 'Dividir por 2: $x = 1$', tieneError: false, explicacion: 'Paso condicionado al error previo.' },
    ],
    conclusionFinal: 'El error estuvo en el Paso 3, al no cambiar de operación el término constante al transponerlo.',
  },
  {
    id: 'det-2',
    problema: 'Simplificar la expresión fraccionaria: $\\frac{x^2 - 9}{x + 3}$ con $x \\neq -3$',
    pasos: [
      { numero: 1, contenido: 'Reconocer diferencia de cuadrados en el numerador: $x^2 - 9 = (x - 3)(x + 3)$', tieneError: false, explicacion: 'Factorización correcta de la diferencia de cuadrados.' },
      { numero: 2, contenido: 'Reescribir la fracción: $\\frac{(x - 3)(x + 3)}{x + 3}$', tieneError: false, explicacion: 'Sustitución válida del numerador factorizado.' },
      { numero: 3, contenido: 'Cancelar el factor $(x + 3)$ y concluir que el resultado es $x - 3$', tieneError: false, explicacion: 'Simplificación correcta.' },
    ],
    conclusionFinal: 'Esta resolución no tiene errores conceptuales.',
  },
];
