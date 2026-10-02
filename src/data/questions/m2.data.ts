import { Question } from '@/types';

export const M2_QUESTIONS: Question[] = [
  {
    "id": "m2-001",
    "materia": "m2",
    "ejeId": "m2-numeros-avanzados",
    "tema": "Propiedades de Logaritmos",
    "dificultad": 2,
    "enunciado": "Si $\\log 2 \\approx 0,301$ y $\\log 3 \\approx 0,477$, ¿cuál es el valor aproximado de $\\log 72$?",
    "alternativas": [
      {
        "id": "A",
        "texto": "$0,778$",
        "explicacionDistractor": "Suma directamente $\\log 2 + \\log 3 = 0,778 = \\log 6$."
      },
      {
        "id": "B",
        "texto": "$1,556$",
        "explicacionDistractor": "Multiplica por 2 ambos términos en vez de usar los exponentes 3 y 2."
      },
      {
        "id": "C",
        "texto": "$2,142$",
        "explicacionDistractor": "Eleva al cuadrado los valores de los logaritmos en vez de multiplicarlos."
      },
      {
        "id": "D",
        "texto": "$1,857$",
        "explicacionDistractor": "$72 = 2^3 \\cdot 3^2 \\implies \\log 72 = 3\\log 2 + 2\\log 3 = 3(0,301) + 2(0,477) = 0,903 + 0,954 = 1,857$."
      }
    ],
    "correcta": "D",
    "explicacionPasoAPaso": [
      "Descomponemos 72 en sus factores primos: $72 = 8 \\cdot 9 = 2^3 \\cdot 3^2$.",
      "Aplicamos las propiedades de los logaritmos: $\\log(a \\cdot b) = \\log a + \\log b$ y $\\log(a^k) = k \\log a$.",
      "$\\log 72 = \\log(2^3 \\cdot 3^2) = \\log(2^3) + \\log(3^2) = 3\\log 2 + 2\\log 3$.",
      "Reemplazamos los valores dados: $3(0,301) + 2(0,477) = 0,903 + 0,954 = 1,857$."
    ],
    "habilidad": "Resolver problemas",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "logaritmos",
      "descomposición prima",
      "M2"
    ]
  },
  {
    "id": "m2-002",
    "materia": "m2",
    "ejeId": "m2-geometria-trig",
    "tema": "Razones trigonométricas en triángulos rectángulos",
    "dificultad": 2,
    "enunciado": "En un triángulo rectángulo, el seno de uno de sus ángulos agudos $\\alpha$ es $\\sin \\alpha = \\frac{4}{5}$. ¿Cuál es el valor de $\\tan \\alpha$?",
    "alternativas": [
      {
        "id": "A",
        "texto": "$\\frac{3}{4}$",
        "explicacionDistractor": "Calcula la cotangente invirtiendo la razón: adyacente / opuesto."
      },
      {
        "id": "B",
        "texto": "$\\frac{4}{3}$",
        "explicacionDistractor": "Cateto opuesto $= 4$, hipotenusa $= 5 \\implies$ cateto adyacente $= \\sqrt{5^2 - 4^2} = 3$. Luego $\\tan \\alpha = \\frac{4}{3}$."
      },
      {
        "id": "C",
        "texto": "$\\frac{3}{5}$",
        "explicacionDistractor": "Calcula el coseno de $\\alpha$ en vez de la tangente."
      },
      {
        "id": "D",
        "texto": "$\\frac{5}{3}$",
        "explicacionDistractor": "Calcula la secante del ángulo."
      }
    ],
    "correcta": "B",
    "explicacionPasoAPaso": [
      "Por definición, $\\sin \\alpha = \\frac{\\text{cateto opuesto}}{\\text{hipotenusa}} = \\frac{4}{5}$.",
      "Por Teorema de Pitágoras, el cateto adyacente $b$ cumple: $4^2 + b^2 = 5^2 \\implies 16 + b^2 = 25 \\implies b = 3$.",
      "La tangente se define como $\\tan \\alpha = \\frac{\\text{cateto opuesto}}{\\text{cateto adyacente}} = \\frac{4}{3}$."
    ],
    "habilidad": "Resolver problemas",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "trigonometría",
      "seno",
      "tangente",
      "M2"
    ]
  },
  {
    "id": "m2-003",
    "materia": "m2",
    "ejeId": "m2-probabilidad-condicional",
    "tema": "Probabilidad Condicional",
    "dificultad": 3,
    "enunciado": "En una fábrica, la máquina A produce el $60\\%$ de las piezas y la máquina B el $40\\%$. El $2\\%$ de las piezas de A son defectuosas, mientras que el $5\\%$ de las de B son defectuosas. Si se extrae una pieza al azar y resulta ser defectuosa, ¿cuál es la probabilidad de que haya sido producida por la máquina B?",
    "alternativas": [
      {
        "id": "A",
        "texto": "$\\frac{3}{8}$ o $0,375$",
        "explicacionDistractor": "Calcula la probabilidad de que la pieza defectuosa proceda de la máquina A: $0,012 / 0,032 = 3/8$."
      },
      {
        "id": "B",
        "texto": "$0,05$",
        "explicacionDistractor": "Toma directamente la probabilidad a priori de fallo de B sin condicionar."
      },
      {
        "id": "C",
        "texto": "$\\frac{5}{8}$ o $0,625$",
        "explicacionDistractor": "$P(D) = 0,60(0,02) + 0,40(0,05) = 0,012 + 0,020 = 0,032$. Por Bayes: $P(B|D) = \\frac{0,020}{0,032} = \\frac{20}{32} = \\frac{5}{8} = 0,625$."
      },
      {
        "id": "D",
        "texto": "$0,40$",
        "explicacionDistractor": "Toma la proporción de producción de B ignorando la tasa de defectos."
      }
    ],
    "correcta": "C",
    "explicacionPasoAPaso": [
      "Aplicamos el Teorema de Bayes:",
      "Probabilidad total de pieza defectuosa: $P(D) = P(A) \\cdot P(D|A) + P(B) \\cdot P(D|B)$.",
      "$P(D) = 0,60 \\cdot 0,02 + 0,40 \\cdot 0,05 = 0,012 + 0,020 = 0,032$.",
      "Calculamos $P(B|D) = \\frac{P(B \\cap D)}{P(D)} = \\frac{0,020}{0,032} = \\frac{20}{32} = \\frac{5}{8} = 0,625$."
    ],
    "habilidad": "Modelar",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "probabilidad condicional",
      "bayes",
      "M2"
    ]
  }
];
