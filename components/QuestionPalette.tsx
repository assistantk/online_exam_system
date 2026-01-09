
import React from 'react';
import { Question, QuestionStatus, UserProgress } from '../types';

interface QuestionPaletteProps {
  questions: Question[];
  progress: Record<number, UserProgress>;
  currentIdx: number;
  onNavigate: (idx: number) => void;
}

const QuestionPalette: React.FC<QuestionPaletteProps> = ({ questions, progress, currentIdx, onNavigate }) => {
  
  const counts = questions.reduce((acc, q) => {
    const status = progress[q.id].status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getStatusClass = (status: QuestionStatus) => {
    switch(status) {
      case QuestionStatus.ANSWERED: return 'status-answered';
      case QuestionStatus.NOT_ANSWERED: return 'status-not-answered';
      case QuestionStatus.MARKED_FOR_REVIEW: return 'status-marked';
      case QuestionStatus.ANSWERED_AND_MARKED_FOR_REVIEW: return 'status-marked-answered';
      default: return 'status-not-visited';
    }
  };

  return (
    <div className="p-4">
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mb-6 text-[10px] font-medium uppercase text-gray-600">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 flex items-center justify-center status-not-visited border">0</span>
          <span>Not Visited</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 flex items-center justify-center status-not-answered text-white">0</span>
          <span>Not Answered</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 flex items-center justify-center status-answered text-white">0</span>
          <span>Answered</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 flex items-center justify-center status-marked text-white">0</span>
          <span>Marked Review</span>
        </div>
        <div className="flex items-center space-x-2 col-span-2">
          <span className="w-6 h-6 flex items-center justify-center status-marked-answered text-white">0</span>
          <span>Answered & Marked Review</span>
        </div>
      </div>

      <div className="bg-[#337ab7] text-white text-xs font-bold p-2 mb-2">
        Question Paper Palette
      </div>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, i) => {
          const status = progress[q.id].status;
          const isActive = currentIdx === i;
          return (
            <button 
              key={q.id}
              onClick={() => onNavigate(i)}
              className={`w-10 h-10 flex items-center justify-center text-xs font-bold transition-transform ${getStatusClass(status)} ${isActive ? 'ring-2 ring-blue-500 scale-110 z-10 shadow-md' : 'shadow-sm'}`}
            >
              {(i + 1).toString().padStart(2, '0')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionPalette;
