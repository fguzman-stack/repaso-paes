import { Question } from '@/types';

export const TP_QUESTIONS: Question[] = [
  {
    "id": "tp-001",
    "materia": "tp",
    "ejeId": "tp-procesos",
    "tema": "Potencia y consumo de energía eléctrica industrial",
    "dificultad": 2,
    "enunciado": "Un motor eléctrico trifásico en un taller mecánico opera a una potencia nominal de $P = 2\\text{ kW}$. Si el motor funciona de manera continua durante $5\\text{ horas}$, ¿cuánta energía eléctrica consume expresada en kilovatios-hora ($\\text{kWh}$)?",
    "alternativas": [
      {
        "id": "A",
        "texto": "$2,5\\text{ kWh}$",
        "explicacionDistractor": "Divide $5 / 2 = 2,5$ en vez de multiplicar."
      },
      {
        "id": "B",
        "texto": "$10\\text{ kWh}$",
        "explicacionDistractor": "$E = P \\cdot t = 2\\text{ kW} \\cdot 5\\text{ h} = 10\\text{ kWh}$."
      },
      {
        "id": "C",
        "texto": "$7\\text{ kWh}$",
        "explicacionDistractor": "Suma $2 + 5 = 7$ ignorando la relación física."
      },
      {
        "id": "D",
        "texto": "$20\\text{ kWh}$",
        "explicacionDistractor": "Comete error de cálculo duplicando la potencia."
      }
    ],
    "correcta": "B",
    "explicacionPasoAPaso": [
      "La energía eléctrica consumida se define como el producto de la potencia por el tiempo de funcionamiento: $E = P \\cdot t$.",
      "Reemplazamos: $E = 2\\text{ kW} \\cdot 5\\text{ h} = 10\\text{ kWh}$."
    ],
    "habilidad": "Resolver problemas",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "electricidad",
      "energía",
      "potencia",
      "módulo TP"
    ]
  },
  {
    "id": "tp-002",
    "materia": "tp",
    "ejeId": "tp-seguridad",
    "tema": "Seguridad en laboratorio y manejo de residuos químicos",
    "dificultad": 1,
    "enunciado": "Al preparar una dilución acuosa de un ácido fuerte (como el ácido sulfúrico concentrado $\\text{H}_2\\text{SO}_4$) en un laboratorio técnico, ¿cuál es la norma fundamental de seguridad que previene proyecciones violentas por reacción altamente exotérmica?",
    "alternativas": [
      {
        "id": "A",
        "texto": "Verter siempre lentamente el ácido sobre el agua («ácido sobre agua»), agitando suavemente.",
        "explicacionDistractor": "Regla de oro de seguridad química: la masa de agua disipa el calor liberado evitando salpicaduras ácidas."
      },
      {
        "id": "B",
        "texto": "Verter rápidamente el agua sobre el ácido concentrado.",
        "explicacionDistractor": "Práctica extremadamente peligrosa: el agua entra en ebullición instantánea y proyecta ácido a los ojos o piel."
      },
      {
        "id": "C",
        "texto": "Calentar primero el ácido en un mechero antes de diluirlo.",
        "explicacionDistractor": "Aumenta drásticamente el riesgo de vapores tóxicos y quemaduras químicas."
      },
      {
        "id": "D",
        "texto": "Mezclar ambos componentes en un recipiente herméticamente cerrado sin ventilación.",
        "explicacionDistractor": "La acumulación de presión y calor puede provocar la explosión del contenedor."
      }
    ],
    "correcta": "A",
    "explicacionPasoAPaso": [
      "La disolución de un ácido fuerte en agua es una reacción fuertemente exotérmica (libera gran cantidad de calor).",
      "Si se añade agua al ácido concentrado, las primeras gotas pueden hervir al instante y salpicar.",
      "Por protocolo de seguridad industrial y de laboratorio, siempre se debe verter lentamente el ácido sobre un volumen mayor de agua, permitiendo la disipación controlada del calor."
    ],
    "habilidad": "Argumentar",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "seguridad",
      "laboratorio",
      "química aplicada",
      "módulo TP"
    ]
  }
];
