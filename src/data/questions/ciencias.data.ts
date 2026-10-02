import { Question } from '@/types';

export const CIENCIAS_QUESTIONS: Question[] = [
  {
    "id": "bio-001",
    "materia": "biologia",
    "ejeId": "bio-celula",
    "tema": "Transporte a través de la membrana plasmática",
    "dificultad": 2,
    "enunciado": "Si una célula animal (eritrocito) se coloca en una solución acuosa hipotónica con respecto a su citoplasma, ¿qué fenómeno físico-biológico ocurrirá y cuál será la consecuencia celular?",
    "alternativas": [
      {
        "id": "A",
        "texto": "Salida neta de agua hacia el exterior provocando crenación.",
        "explicacionDistractor": "La crenación ocurre en soluciones hipertónicas, no hipotónicas."
      },
      {
        "id": "B",
        "texto": "Aumento de la turgencia gracias a la pared celular de celulosa.",
        "explicacionDistractor": "Los eritrocitos son células animales y no poseen pared celular vegetal."
      },
      {
        "id": "C",
        "texto": "Entrada masiva de agua por ósmosis hasta provocar la lisis celular (citólisis).",
        "explicacionDistractor": "En medio hipotónico, el agua se desplaza hacia la mayor concentración de solutos (interior celular), rompiendo la membrana al carecer de pared."
      },
      {
        "id": "D",
        "texto": "Transporte activo de agua hacia el exterior consumiendo ATP.",
        "explicacionDistractor": "El agua se mueve pasivamente a través de acuaporinas por gradiente osmótico sin gasto de ATP."
      }
    ],
    "correcta": "C",
    "explicacionPasoAPaso": [
      "La ósmosis es el paso de solvente (agua) a través de una membrana semipermeable desde la zona de menor concentración de solutos (hipotónica) hacia la de mayor concentración.",
      "Al ingresar agua al eritrocito sin el soporte de una pared rígida, la presión intracelular aumenta hasta causar la ruptura de la membrana plasmática (citólisis o hemólisis)."
    ],
    "habilidad": "Resolver problemas",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "célula",
      "ósmosis",
      "membrana plasmática",
      "biología"
    ]
  },
  {
    "id": "bio-002",
    "materia": "biologia",
    "ejeId": "bio-fisiologia",
    "tema": "Regulación hormonal de la glicemia",
    "dificultad": 2,
    "enunciado": "Frente a un periodo de ayuno prolongado, el páncreas endocrino responde secretando una hormona que estimula la glucogenólisis y gluconeogénesis hepática para mantener los niveles normales de glucosa en sangre. ¿Cuál es dicha hormona?",
    "alternativas": [
      {
        "id": "A",
        "texto": "Insulina, sintetizada por las células beta pancreáticas.",
        "explicacionDistractor": "La insulina disminuye la glicemia en estado posprandial, no durante el ayuno."
      },
      {
        "id": "B",
        "texto": "Glucagón, sintetizado por las células alfa de los islotes de Langerhans.",
        "explicacionDistractor": "El glucagón es la hormona hiperglicemiante que moviliza las reservas de glucógeno hepático en situaciones de ayuno."
      },
      {
        "id": "C",
        "texto": "Somatostatina, sintetizada por las células delta.",
        "explicacionDistractor": "Inhibe la secreción de insulina y glucagón, pero no estimula la glucogenólisis."
      },
      {
        "id": "D",
        "texto": "Oxitocina, liberada por la neurohipófisis.",
        "explicacionDistractor": "Interviene en el parto y la eyección de leche, no en la homeostasis de la glucosa."
      }
    ],
    "correcta": "B",
    "explicacionPasoAPaso": [
      "Durante el ayuno disminuye la glicemia basal, lo que es detectado por los islotes de Langerhans.",
      "Las células alfa liberan glucagón al torrente sanguíneo, el cual se une a receptores hepáticos activando la degradación del glucógeno (glucogenólisis) y la síntesis de nueva glucosa (gluconeogénesis)."
    ],
    "habilidad": "Modelar",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "fisiología",
      "glicemia",
      "hormonas",
      "homeostasis"
    ]
  },
  {
    "id": "fis-001",
    "materia": "fisica",
    "ejeId": "fis-ondas",
    "tema": "Propagación y rapidez de ondas sonoras",
    "dificultad": 2,
    "enunciado": "Una onda sonora de frecuencia $f = 440\\text{ Hz}$ se propaga en el aire a una rapidez de $v = 340\\text{ m/s}$. ¿Cuál es su longitud de onda $\\lambda$?",
    "alternativas": [
      {
        "id": "A",
        "texto": "$\\approx 0,77\\text{ m}$",
        "explicacionDistractor": "$\\lambda = v / f = 340 / 440 = 34 / 44 = 17 / 22 \\approx 0,7727\\text{ m}$."
      },
      {
        "id": "B",
        "texto": "$\\approx 1,29\\text{ m}$",
        "explicacionDistractor": "Invierte la relación calculando $f / v = 440 / 340$."
      },
      {
        "id": "C",
        "texto": "$149.600\\text{ m}$",
        "explicacionDistractor": "Multiplica la velocidad por la frecuencia en vez de dividir."
      },
      {
        "id": "D",
        "texto": "$100\\text{ m}$",
        "explicacionDistractor": "Resta 440 - 340 = 100 de forma inconsistente."
      }
    ],
    "correcta": "A",
    "explicacionPasoAPaso": [
      "La ecuación fundamental de propagación de ondas es $v = \\lambda \\cdot f$.",
      "Despejamos la longitud de onda: $\\lambda = \\frac{v}{f}$.",
      "Reemplazamos: $\\lambda = \\frac{340\\text{ m/s}}{440\\text{ Hz}} = \\frac{17}{22} \\approx 0,77\\text{ m}$."
    ],
    "habilidad": "Resolver problemas",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "ondas",
      "sonido",
      "longitud de onda",
      "física"
    ]
  },
  {
    "id": "fis-002",
    "materia": "fisica",
    "ejeId": "fis-mecanica",
    "tema": "Segunda Ley de Newton",
    "dificultad": 1,
    "enunciado": "Un bloque de masa $m = 4\\text{ kg}$ descansa sobre una superficie horizontal lisa (sin roce). Si se le aplica una fuerza horizontal constante de $F = 12\\text{ N}$, ¿qué aceleración experimentará el bloque?",
    "alternativas": [
      {
        "id": "A",
        "texto": "$48\\text{ m/s}^2$",
        "explicacionDistractor": "Multiplica $12 \\cdot 4 = 48$ en vez de dividir."
      },
      {
        "id": "B",
        "texto": "$8\\text{ m/s}^2$",
        "explicacionDistractor": "Resta $12 - 4 = 8$."
      },
      {
        "id": "C",
        "texto": "$0,33\\text{ m/s}^2$",
        "explicacionDistractor": "Divide masa por fuerza ($4 / 12 = 1/3$)."
      },
      {
        "id": "D",
        "texto": "$3\\text{ m/s}^2$",
        "explicacionDistractor": "Segunda ley: $F = m \\cdot a \\implies a = F / m = 12 / 4 = 3\\text{ m/s}^2$."
      }
    ],
    "correcta": "D",
    "explicacionPasoAPaso": [
      "De acuerdo con la Segunda Ley de Newton, la fuerza neta es directamente proporcional a la aceleración: $F_{\\text{neta}} = m \\cdot a$.",
      "Como la superficie carece de roce, la fuerza neta en el eje horizontal es $12\\text{ N}$.",
      "Despejamos la aceleración: $a = \\frac{F}{m} = \\frac{12\\text{ N}}{4\\text{ kg}} = 3\\text{ m/s}^2$."
    ],
    "habilidad": "Resolver problemas",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "newton",
      "fuerza",
      "mecánica",
      "aceleración"
    ]
  },
  {
    "id": "qui-001",
    "materia": "quimica",
    "ejeId": "qui-reacciones",
    "tema": "Estequiometría y balance de masa",
    "dificultad": 2,
    "enunciado": "En la combustión completa del gas propano según la ecuación balanceada:\n$$\\text{C}_3\\text{H}_8 + 5\\,\\text{O}_2 \\longrightarrow 3\\,\\text{CO}_2 + 4\\,\\text{H}_2\\text{O}$$\n¿Cuántos moles de dióxido de carbono ($\\text{CO}_2$) se producen al reaccionar completamente $2\\text{ moles}$ de propano ($\\text{C}_3\\text{H}_8$) con exceso de oxígeno?",
    "alternativas": [
      {
        "id": "A",
        "texto": "$3\\text{ moles}$",
        "explicacionDistractor": "Asume la producción de 1 solo mol sin multiplicar por los 2 moles de reactivo."
      },
      {
        "id": "B",
        "texto": "$6\\text{ moles}$",
        "explicacionDistractor": "Por estequiometría: 1 mol de C3H8 produce 3 moles de CO2. Por tanto, 2 moles de C3H8 producen $2 \\cdot 3 = 6$ moles de CO2."
      },
      {
        "id": "C",
        "texto": "$5\\text{ moles}$",
        "explicacionDistractor": "Confunde los moles producidos con el coeficiente del oxígeno."
      },
      {
        "id": "D",
        "texto": "$8\\text{ moles}$",
        "explicacionDistractor": "Calcula los moles de agua ($2 \\cdot 4 = 8$) en lugar de los de CO2."
      }
    ],
    "correcta": "B",
    "explicacionPasoAPaso": [
      "Observamos la relación molar estequiométrica en la ecuación balanceada:",
      "$1\\text{ mol de C}_3\\text{H}_8 \\longleftrightarrow 3\\text{ moles de CO}_2$.",
      "Si reaccionan $2\\text{ moles de C}_3\\text{H}_8$ con oxígeno en exceso:",
      "$n_{\\text{CO}_2} = 2 \\cdot 3 = 6\\text{ moles de CO}_2$."
    ],
    "habilidad": "Resolver problemas",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "estequiometría",
      "combustión",
      "química",
      "moles"
    ]
  },
  {
    "id": "qui-002",
    "materia": "quimica",
    "ejeId": "qui-estructura",
    "tema": "Enlaces químicos y electronegatividad",
    "dificultad": 2,
    "enunciado": "¿Qué tipo de enlace químico se forma predominantemente entre átomos de sodio ($\\text{Na}$, metal alcalino de baja electronegatividad) y cloro ($\\text{Cl}$, no metal halógeno de alta electronegatividad)?",
    "alternativas": [
      {
        "id": "A",
        "texto": "Enlace covalente apolar.",
        "explicacionDistractor": "Ocurre entre átomos idénticos o con diferencia de electronegatividad casi nula."
      },
      {
        "id": "B",
        "texto": "Enlace metálico.",
        "explicacionDistractor": "Se presenta en agregados de átomos metálicos, no entre un metal y un no metal."
      },
      {
        "id": "C",
        "texto": "Enlace iónico o electrovalente.",
        "explicacionDistractor": "La gran diferencia de electronegatividad ($\\Delta EN > 1,7$) propicia la transferencia completa del electrón del sodio al cloro."
      },
      {
        "id": "D",
        "texto": "Puente de hidrógeno.",
        "explicacionDistractor": "Es una fuerza intermolecular entre hidrógeno y átomos muy electronegativos (F, O, N)."
      }
    ],
    "correcta": "C",
    "explicacionPasoAPaso": [
      "El sodio (Na, grupo 1) tiene tendencia a ceder 1 electrón de valencia formando el catión $\\text{Na}^+$.",
      "El cloro (Cl, grupo 17) capta dicho electrón completando su octeto como anión cloruro $\\text{Cl}^-$.",
      "La atracción electrostática entre los iones de signo opuesto constituye un enlace iónico."
    ],
    "habilidad": "Representar",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "enlace químico",
      "iónico",
      "electronegatividad"
    ]
  }
];
