import { Question } from '@/types';

export const HISTORIA_QUESTIONS: Question[] = [
  {
    "id": "his-001",
    "materia": "historia",
    "ejeId": "his-chile-siglo20",
    "tema": "El modelo ISI y la creación de la CORFO",
    "dificultad": 2,
    "enunciado": "Tras el devastador terremoto de Chillán de 1939 y los efectos acumulados de la Gran Depresión de 1929, el gobierno de Pedro Aguirre Cerda impulsó una profunda transformación económica conocida como la Industrialización por Sustitución de Importaciones (ISI). ¿Cuál fue el principal instrumento institucional creado por el Estado chileno para materializar este plan de desarrollo productivo?",
    "alternativas": [
      {
        "id": "A",
        "texto": "El Banco Central de Chile.",
        "explicacionDistractor": "Fue creado con anterioridad (1925) bajo la misión Kemmerer durante el gobierno de Arturo Alessandri."
      },
      {
        "id": "B",
        "texto": "La Corporación de Fomento de la Producción (CORFO).",
        "explicacionDistractor": "Creada en 1939 mediante la Ley 6.334 para liderar la electrificación (ENDESA), petróleo (ENAP), acero (CAP) y manufactura nacional."
      },
      {
        "id": "C",
        "texto": "La Oficina de Planificación Nacional (ODEPLAN).",
        "explicacionDistractor": "Fue creada posteriormente en la década de 1960 durante el gobierno de Eduardo Frei Montalva."
      },
      {
        "id": "D",
        "texto": "La Sociedad de Fomento Fabril (SOFOFA).",
        "explicacionDistractor": "Es una asociación gremial privada fundada a fines del siglo XIX (1883), no un organismo estatal de 1939."
      }
    ],
    "correcta": "B",
    "explicacionPasoAPaso": [
      "En abril de 1939, tras el terremoto de Chillán, se promulgó la ley que dio origen a la Corporación de Fomento de la Producción (CORFO).",
      "La CORFO constituyó el pilar del modelo ISI, impulsando empresas estratégicas en energía, hidrocarburos, telecomunicaciones y siderurgia."
    ],
    "habilidad": "Interpretar",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "historia de chile",
      "siglo XX",
      "modelo ISI",
      "CORFO"
    ]
  },
  {
    "id": "his-002",
    "materia": "historia",
    "ejeId": "his-ciudadania",
    "tema": "Bases de la institucionalidad democrática",
    "dificultad": 1,
    "enunciado": "En la tradición republicana y constitucional chilena, la soberanía reside esencialmente en:",
    "alternativas": [
      {
        "id": "A",
        "texto": "El Presidente de la República en su calidad de Jefe de Estado.",
        "explicacionDistractor": "El Presidente ejerce el poder delegado temporalmente, pero no es el depositario de la soberanía."
      },
      {
        "id": "B",
        "texto": "El Congreso Nacional de manera exclusiva y perpetua.",
        "explicacionDistractor": "El Congreso representa al electorado, pero la soberanía no le pertenece de forma absoluta."
      },
      {
        "id": "C",
        "texto": "La Nación, y se ejerce por el pueblo a través de elecciones periódicas y plebiscitos.",
        "explicacionDistractor": "Principio consagrado en el artículo 5 de la Constitución y en la teoría política republicana moderna."
      },
      {
        "id": "D",
        "texto": "Las Fuerzas Armadas y de Orden.",
        "explicacionDistractor": "Son instituciones no deliberantes y subordinadas al poder civil democrático."
      }
    ],
    "correcta": "C",
    "explicacionPasoAPaso": [
      "El principio de soberanía popular establece que el poder supremo emana de la Nación y de la ciudadanía.",
      "Su ejercicio se concreta mediante mecanismos de democracia representativa (elecciones) y directa (plebiscitos)."
    ],
    "habilidad": "Argumentar",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "formación ciudadana",
      "democracia",
      "soberanía"
    ]
  },
  {
    "id": "his-003",
    "materia": "historia",
    "ejeId": "his-economia",
    "tema": "Inflación y política monetaria",
    "dificultad": 2,
    "enunciado": "Cuando la inflación en un país experimenta un aumento persistente y generalizado en el nivel de precios de la economía, ¿cuál es la medida habitual que adopta un Banco Central autónomo para frenar dicha alza mediante la política monetaria?",
    "alternativas": [
      {
        "id": "A",
        "texto": "Elevar la Tasa de Política Monetaria (TPM) para encarecer el crédito y enfriar la demanda agregada.",
        "explicacionDistractor": "Mecanismo estándar: al subir la TPM, los créditos se encarecen, se desincentiva el consumo desmedido y se controla la inflación."
      },
      {
        "id": "B",
        "texto": "Reducir la TPM a cero para aumentar el circulante y abaratar préstamos.",
        "explicacionDistractor": "Eso aceleraría aún más la inflación al estimular la demanda agregada."
      },
      {
        "id": "C",
        "texto": "Fijar por decreto los precios máximos de todos los bienes de consumo.",
        "explicacionDistractor": "Es una medida de control administrativo ajena a la política monetaria de un Banco Central autónomo."
      },
      {
        "id": "D",
        "texto": "Eliminar el cobro de aranceles aduaneros a todas las exportaciones.",
        "explicacionDistractor": "Medida de comercio exterior, no de control de inflación por política monetaria."
      }
    ],
    "correcta": "A",
    "explicacionPasoAPaso": [
      "La herramienta fundamental del Banco Central para controlar la inflación es la Tasa de Política Monetaria (TPM).",
      "Un incremento de la tasa encarece el costo del dinero para la banca comercial y los consumidores, reduciendo la presión de demanda sobre los precios."
    ],
    "habilidad": "Modelar",
    "origen": "Pregunta original, basada en el temario",
    "tags": [
      "economía",
      "inflación",
      "banco central"
    ]
  }
];
