import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { SubjectsCatalog } from '@/features/subjects/SubjectsCatalog';
import { SubjectDetail } from '@/features/subjects/SubjectDetail';
import { QuizSession } from '@/features/quiz/QuizSession';
import { QuizResult } from '@/features/quiz/QuizResult';
import { SimulacroHub } from '@/features/sim/SimulacroHub';
import { SimulacroSession } from '@/features/sim/SimulacroSession';
import { ReviewSession } from '@/features/review/ReviewSession';
import { GamesHub } from '@/features/games/GamesHub';
import { LightningMathGame } from '@/features/games/m1-lightning/LightningMathGame';
import { TimelineGame } from '@/features/games/timeline/TimelineGame';
import { ErrorDetectiveGame } from '@/features/games/error-detective/ErrorDetectiveGame';
import { FlashcardsView } from '@/features/games/flashcards/FlashcardsView';
import { ProgressDashboard } from '@/features/progress/ProgressDashboard';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/materias" element={<SubjectsCatalog />} />
          <Route path="/materias/:subjectId" element={<SubjectDetail />} />
          <Route path="/quiz" element={<QuizSession />} />
          <Route path="/quiz/resultado" element={<QuizResult />} />
          <Route path="/simulacro" element={<SimulacroHub />} />
          <Route path="/simulacro/:subjectId" element={<SimulacroSession />} />
          <Route path="/repaso" element={<ReviewSession />} />
          <Route path="/juegos" element={<GamesHub />} />
          <Route path="/juegos/calculo-relampago" element={<LightningMathGame />} />
          <Route path="/juegos/linea-tiempo" element={<TimelineGame />} />
          <Route path="/juegos/detective-errores" element={<ErrorDetectiveGame />} />
          <Route path="/juegos/flashcards" element={<FlashcardsView />} />
          <Route path="/progreso" element={<ProgressDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
