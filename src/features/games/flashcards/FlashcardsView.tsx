import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flashcard, SubjectId } from '@/types';
import { SUBJECT_LIST } from '@/data/subjects';
import { MathRenderer } from '@/components/math/MathRenderer';
import { useUserStore } from '@/store/useUserStore';
import { ArrowLeft, RotateCw, CheckCircle, HelpCircle, XCircle, BookOpen } from 'lucide-react';

const FLASHCARD_DECK: Flashcard[] = [
  {
    id: 'fc-1',
    materia: 'm1',
    ejeId: 'm1-algebra',
    concepto: 'Cuadrado de Binomio',
    definicionOFormula: '$$(a \\pm b)^2 = a^2 \\pm 2ab + b^2$$',
    ejemplo: '$(2x - 3)^2 = 4x^2 - 12x + 9$',
    dificultad: 1,
  },
  {
    id: 'fc-2',
    materia: 'm1',
    ejeId: 'm1-algebra',
    concepto: 'Vértice de una Parábola',
    definicionOFormula: '$$x_v = -\\frac{b}{2a}, \\quad y_v = f(x_v)$$',
    ejemplo: 'Si $f(x) = x^2 - 4x + 1$, entonces $x_v = -(-4)/2 = 2$.',
    dificultad: 2,
  },
  {
    id: 'fc-3',
    materia: 'm1',
    ejeId: 'm1-geometria',
    concepto: 'Teorema de Pitágoras',
    definicionOFormula: '$$a^2 + b^2 = c^2$$',
    ejemplo: 'Catetos 3 y 4 => Hipotenusa $\\sqrt{3^2 + 4^2} = 5$.',
    dificultad: 1,
  },
  {
    id: 'fc-4',
    materia: 'lectora',
    ejeId: 'lec-argumentativo',
    concepto: 'Tesis en un Texto Argumentativo',
    definicionOFormula: 'La postura, opinión o punto de vista que defiende el emisor mediante razonamientos (argumentos).',
    ejemplo: '«La jornada escolar completa debe reestructurarse para priorizar la salud mental».',
    dificultad: 1,
  },
  {
    id: 'fc-5',
    materia: 'historia',
    ejeId: 'his-ciudadania',
    concepto: 'Estado de Derecho',
    definicionOFormula: 'Principio en el cual todas las personas, instituciones y entidades públicas y privadas están sometidas a leyes públicamente promulgadas e iguales para todos.',
    ejemplo: 'Separación de poderes del Estado y principio de legalidad.',
    dificultad: 2,
  },
  {
    id: 'fc-6',
    materia: 'fisica',
    ejeId: 'fis-ondas',
    concepto: 'Ecuación Fundamental de las Ondas',
    definicionOFormula: '$$v = \\lambda \\cdot f$$',
    ejemplo: 'Velocidad ($v$) = longitud de onda ($\\lambda$) por frecuencia ($f$).',
    dificultad: 1,
  },
  {
    id: 'fc-7',
    materia: 'quimica',
    ejeId: 'qui-reacciones',
    concepto: 'Constante de Avogadro',
    definicionOFormula: '$$N_A = 6,022 \\times 10^{23}\\text{ partículas/mol}$$',
    ejemplo: '1 mol de moléculas de agua ($H_2O$) contiene $6,022 \\times 10^{23}$ moléculas.',
    dificultad: 1,
  },
  {
    id: 'fc-8',
    materia: 'biologia',
    ejeId: 'bio-celula',
    concepto: 'Mitocondria',
    definicionOFormula: 'Organelo celular encargado de la respiración celular aeróbica y de la síntesis de ATP.',
    ejemplo: 'Posee doble membrana y su propio material genético (ADN mitocondrial).',
    dificultad: 1,
  },
];

export const FlashcardsView: React.FC = () => {
  const navigate = useNavigate();
  const { addXP } = useUserStore();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCount, setStudiedCount] = useState(0);

  const deck = selectedSubject === 'all'
    ? FLASHCARD_DECK
    : FLASHCARD_DECK.filter((c) => c.materia === selectedSubject);

  const currentCard = deck[currentIndex % deck.length];

  const handleRating = (quality: 'lo-sabia' | 'dude' | 'no-sabia') => {
    setIsFlipped(false);
    setStudiedCount((prev) => prev + 1);

    if (quality === 'lo-sabia') {
      addXP(10);
    } else if (quality === 'dude') {
      addXP(5);
    } else {
      addXP(2);
    }

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % deck.length);
    }, 200);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/juegos')}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Juegos</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <BookOpen className="w-4 h-4" />
          <span>Flashcards Activas ({studiedCount} repasadas)</span>
        </div>
      </div>

      {/* Subject Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 text-xs">
        <button
          onClick={() => {
            setSelectedSubject('all');
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
            selectedSubject === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Todas ({FLASHCARD_DECK.length})
        </button>
        {SUBJECT_LIST.map((sub) => (
          <button
            key={sub.id}
            onClick={() => {
              setSelectedSubject(sub.id);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              selectedSubject === sub.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {sub.shortName}
          </button>
        ))}
      </div>

      {currentCard ? (
        <div className="space-y-4">
          {/* Card View with Flip */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[260px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xs flex flex-col justify-between text-center hover:border-blue-500/50 transition select-none"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {currentCard.materia.toUpperCase()}
              </span>
              <span className="flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Toca para voltear</span>
              </span>
            </div>

            <div className="my-auto py-6">
              {!isFlipped ? (
                <div>
                  <span className="text-xs text-slate-400 block mb-2">Concepto / Pregunta</span>
                  <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                    {currentCard.concepto}
                  </h3>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                    Definición / Fórmula
                  </span>
                  <div className="text-base text-slate-800 dark:text-slate-200">
                    <MathRenderer content={currentCard.definicionOFormula} />
                  </div>
                  {currentCard.ejemplo && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 italic">
                      <MathRenderer content={`Ejemplo: ${currentCard.ejemplo}`} />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400">
              Tarjeta {(currentIndex % deck.length) + 1} de {deck.length}
            </div>
          </div>

          {/* Autoevaluación SM-2 buttons */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => handleRating('no-sabia')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/30 p-3 text-xs font-semibold text-rose-800 dark:text-rose-200 hover:bg-rose-100 transition"
            >
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>No lo sabía</span>
            </button>
            <button
              onClick={() => handleRating('dude')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/30 p-3 text-xs font-semibold text-amber-800 dark:text-amber-200 hover:bg-amber-100 transition"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Dudé</span>
            </button>
            <button
              onClick={() => handleRating('lo-sabia')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/30 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 transition"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Lo sabía</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          No hay tarjetas en esta categoría.
        </div>
      )}
    </div>
  );
};
