
import React, { useState, useEffect } from 'react';
import { Question, QuestionStatus, UserProgress, QuestionType } from '../types';
import QuestionPalette from './QuestionPalette';

interface ExamPortalProps {
  questions: Question[];
  progress: Record<number, UserProgress>;
  setProgress: React.Dispatch<React.SetStateAction<Record<number, UserProgress>>>;
  onSubmit: () => void;
}

const ExamPortal: React.FC<ExamPortalProps> = ({ questions, progress, setProgress, onSubmit }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180 * 60);
  const currentQuestion = questions[currentIdx];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          onSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onSubmit]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMCQSelect = (optIdx: number) => {
    setProgress(prev => ({
      ...prev,
      [currentQuestion.id]: { ...prev[currentQuestion.id], selectedOption: optIdx }
    }));
  };

  const handleMSQToggle = (optIdx: number) => {
    setProgress(prev => {
      const currentOptions = prev[currentQuestion.id].selectedOptions || [];
      const newOptions = currentOptions.includes(optIdx)
        ? currentOptions.filter(o => o !== optIdx)
        : [...currentOptions, optIdx];
      return {
        ...prev,
        [currentQuestion.id]: { ...prev[currentQuestion.id], selectedOptions: newOptions }
      };
    });
  };

  const handleNATInput = (val: string) => {
    setProgress(prev => ({
      ...prev,
      [currentQuestion.id]: { ...prev[currentQuestion.id], natValue: val }
    }));
  };

  const handleSaveAndNext = () => {
    const currentProg = progress[currentQuestion.id];
    let isAnswered = false;
    
    if (currentQuestion.type === QuestionType.MCQ) isAnswered = currentProg.selectedOption !== null;
    else if (currentQuestion.type === QuestionType.MSQ) isAnswered = (currentProg.selectedOptions?.length || 0) > 0;
    else if (currentQuestion.type === QuestionType.NAT) isAnswered = currentProg.natValue !== '';

    const newStatus = isAnswered ? QuestionStatus.ANSWERED : QuestionStatus.NOT_ANSWERED;
    
    setProgress(prev => ({
      ...prev,
      [currentQuestion.id]: { ...prev[currentQuestion.id], status: newStatus }
    }));

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handleClearResponse = () => {
    setProgress(prev => ({
      ...prev,
      [currentQuestion.id]: { 
        selectedOption: null, 
        selectedOptions: [], 
        natValue: '', 
        status: QuestionStatus.NOT_ANSWERED 
      }
    }));
  };

  const handleMarkForReview = () => {
    const currentProg = progress[currentQuestion.id];
    let hasAnswer = false;
    if (currentQuestion.type === QuestionType.MCQ) hasAnswer = currentProg.selectedOption !== null;
    else if (currentQuestion.type === QuestionType.MSQ) hasAnswer = (currentProg.selectedOptions?.length || 0) > 0;
    else if (currentQuestion.type === QuestionType.NAT) hasAnswer = currentProg.natValue !== '';

    const newStatus = hasAnswer ? QuestionStatus.ANSWERED_AND_MARKED_FOR_REVIEW : QuestionStatus.MARKED_FOR_REVIEW;

    setProgress(prev => ({
      ...prev,
      [currentQuestion.id]: { ...prev[currentQuestion.id], status: newStatus }
    }));

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row bg-white overflow-hidden">
      <div className="flex-grow flex flex-col border-r border-gray-300">
        <div className="bg-[#337ab7] text-white p-2 flex justify-between items-center">
          <span className="font-bold text-sm uppercase">Section: {currentQuestion.type}</span>
          <div className="bg-white text-blue-900 px-3 py-1 text-sm font-bold flex items-center shadow-inner rounded-sm">
            Time Left: <span className="ml-2 font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex-grow p-6 overflow-y-auto">
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-bold text-blue-900 flex items-start">
              <span className="mr-4 whitespace-nowrap">Question No. {currentIdx + 1}</span>
              <div className="flex-grow text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: currentQuestion.text }} />
            </h3>
          </div>

          <div className="mt-6">
            {currentQuestion.type === QuestionType.MCQ && (
              <div className="space-y-4">
                {currentQuestion.options?.map((opt, i) => (
                  <label key={i} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer transition-all">
                    <input 
                      type="radio" 
                      name={`q-${currentQuestion.id}`}
                      checked={progress[currentQuestion.id].selectedOption === i}
                      onChange={() => handleMCQSelect(i)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-gray-800 font-medium">{String.fromCharCode(65 + i)}) {opt}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === QuestionType.MSQ && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-orange-600 mb-2 italic">* Select one or more correct options</p>
                {currentQuestion.options?.map((opt, i) => (
                  <label key={i} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      checked={progress[currentQuestion.id].selectedOptions?.includes(i)}
                      onChange={() => handleMSQToggle(i)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="text-gray-800 font-medium">{String.fromCharCode(65 + i)}) {opt}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === QuestionType.NAT && (
              <div className="max-w-md">
                <p className="text-sm font-bold text-gray-600 mb-2">Enter Numerical Answer:</p>
                <input 
                  type="text"
                  value={progress[currentQuestion.id].natValue}
                  onChange={(e) => handleNATInput(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full border-2 border-blue-200 rounded p-4 text-xl font-mono focus:border-blue-500 outline-none"
                />
                <div className="grid grid-cols-4 gap-2 mt-4">
                    {['1','2','3','Clear','4','5','6','-','7','8','9','.','0','Backspace'].map(key => (
                        <button 
                            key={key}
                            onClick={() => {
                                let cur = progress[currentQuestion.id].natValue;
                                if (key === 'Clear') handleNATInput('');
                                else if (key === 'Backspace') handleNATInput(cur.slice(0, -1));
                                else handleNATInput(cur + key);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 p-2 rounded text-sm font-bold border"
                        >
                            {key}
                        </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t p-4 flex flex-wrap gap-4 justify-between bg-gray-50">
          <div className="flex gap-2">
            <button onClick={handleMarkForReview} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 font-medium rounded text-sm shadow-sm">
              Mark for Review & Next
            </button>
            <button onClick={handleClearResponse} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 font-medium rounded text-sm shadow-sm">
              Clear Response
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSaveAndNext} className="px-8 py-2 bg-[#337ab7] text-white hover:bg-blue-800 font-bold rounded text-sm uppercase shadow-md transform active:scale-95 transition-transform">
              Save & Next
            </button>
          </div>
        </div>
      </div>

      <div className="w-full md:w-80 flex flex-col bg-gray-50 border-l border-gray-300 shadow-xl">
        <div className="p-4 bg-white border-b flex items-center space-x-3">
           <img src="https://picsum.photos/id/64/100/100" alt="Profile" className="w-16 h-16 border-2 border-blue-100 p-1 rounded" />
           <div className="text-sm">
             <p className="font-bold text-gray-700">Demo Candidate</p>
           </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          <QuestionPalette 
            questions={questions} 
            progress={progress} 
            currentIdx={currentIdx}
            onNavigate={setCurrentIdx}
          />
        </div>

        <div className="p-4 bg-white border-t space-y-2">
          <button 
            onClick={() => { if(window.confirm('Are you sure you want to submit your test?')) onSubmit(); }}
            className="w-full py-3 bg-[#2b8b3e] text-white font-bold rounded uppercase hover:bg-green-700 transition-colors shadow-lg"
          >
            Final Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPortal;
