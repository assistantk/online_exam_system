
import React from 'react';
import { Question, UserProgress, UserInfo, QuestionStatus, QuestionType } from '../types';

interface ResultProps {
  questions: Question[];
  progress: Record<number, UserProgress>;
  userInfo: UserInfo;
  onReset: () => void;
}

const Result: React.FC<ResultProps> = ({ questions, progress, userInfo, onReset }) => {
  const evaluateQuestion = (q: Question, prog: UserProgress): boolean => {
    if (q.type === QuestionType.MCQ) {
      return prog.selectedOption === q.correctAnswer;
    } else if (q.type === QuestionType.MSQ) {
      if (!prog.selectedOptions || !q.correctAnswers) return false;
      if (prog.selectedOptions.length !== q.correctAnswers.length) return false;
      return prog.selectedOptions.every(val => q.correctAnswers!.includes(val));
    } else if (q.type === QuestionType.NAT) {
      const val = parseFloat(prog.natValue);
      if (isNaN(val)) return false;
      if (q.correctRange) {
        return val >= q.correctRange.min && val <= q.correctRange.max;
      }
      return val === q.correctValue;
    }
    return false;
  };

  const score = questions.reduce((acc, q) => {
    return evaluateQuestion(q, progress[q.id]) ? acc + 1 : acc;
  }, 0);

  const stats = {
    answered: 0,
    notAnswered: 0,
    marked: 0,
    notVisited: 0
  };

  questions.forEach(q => {
    const status = progress[q.id].status;
    if (status === QuestionStatus.ANSWERED || status === QuestionStatus.ANSWERED_AND_MARKED_FOR_REVIEW) stats.answered++;
    else if (status === QuestionStatus.NOT_ANSWERED) stats.notAnswered++;
    else if (status === QuestionStatus.MARKED_FOR_REVIEW) stats.marked++;
    else stats.notVisited++;
  });

  return (
    <div className="max-w-5xl mx-auto w-full p-8 space-y-8">
      <div className="bg-white p-10 rounded-xl shadow-2xl border border-blue-100 overflow-hidden">
        <div className="bg-blue-900 -mx-10 -mt-10 p-6 mb-8">
            <h2 className="text-3xl font-bold text-white text-center">Examination Result</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-stretch border-b pb-8 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 uppercase border-b border-blue-200 pb-2 mb-4">Candidate Information</h3>
            <div className="space-y-3">
                <p className="flex justify-between"><span>Name:</span> <span className="font-bold">{userInfo.name}</span></p>
                <p className="flex justify-between"><span>System ID:</span> <span className="font-bold">{userInfo.systemId}</span></p>
                <p className="flex justify-between"><span>Subject:</span> <span className="font-bold">{userInfo.subject}</span></p>
                <div className="mt-6 p-4 bg-white rounded border-2 border-blue-500 text-center">
                    <p className="text-gray-600 text-sm font-bold uppercase">Final Score</p>
                    <p className="text-4xl font-black text-blue-900">{score} / {questions.length}</p>
                </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
             <h3 className="text-lg font-bold text-gray-700 uppercase border-b border-gray-200 pb-2 mb-4">Performance Statistics</h3>
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-3 rounded border shadow-sm">
                 <p className="text-xs text-gray-500 uppercase">Answered</p>
                 <p className="text-2xl font-bold text-green-600">{stats.answered}</p>
               </div>
               <div className="bg-white p-3 rounded border shadow-sm">
                 <p className="text-xs text-gray-500 uppercase">Unanswered</p>
                 <p className="text-2xl font-bold text-red-600">{stats.notAnswered}</p>
               </div>
               <div className="bg-white p-3 rounded border shadow-sm">
                 <p className="text-xs text-gray-500 uppercase">Review Marked</p>
                 <p className="text-2xl font-bold text-purple-600">{stats.marked}</p>
               </div>
               <div className="bg-white p-3 rounded border shadow-sm">
                 <p className="text-xs text-gray-500 uppercase">Accuracy</p>
                 <p className="text-2xl font-bold text-blue-600">
                    {stats.answered > 0 ? Math.round((score / stats.answered) * 100) : 0}%
                 </p>
               </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800">Review & Solutions:</h3>
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {questions.map((q, i) => {
              const isCorrect = evaluateQuestion(q, progress[q.id]);
              const prog = progress[q.id];
              
              return (
                <div key={q.id} className={`p-5 rounded-lg border-l-8 shadow-sm ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <div className="flex justify-between mb-2">
                    <p className="font-bold text-blue-900 uppercase text-xs">Question {i+1} ({q.type})</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {isCorrect ? 'CORRECT' : 'INCORRECT'}
                    </span>
                  </div>
                  <div className="text-gray-800 mb-4 font-medium" dangerouslySetInnerHTML={{ __html: q.text }} />
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded border">
                        <p className="font-bold text-gray-500 uppercase text-[10px]">Your Answer</p>
                        <p className="font-semibold">
                            {q.type === QuestionType.MCQ ? (prog.selectedOption !== null ? q.options![prog.selectedOption] : 'No Selection') :
                             q.type === QuestionType.MSQ ? (prog.selectedOptions?.length > 0 ? prog.selectedOptions.map(idx => q.options![idx]).join(', ') : 'No Selection') :
                             (prog.natValue || 'No Value')}
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded border border-green-200">
                        <p className="font-bold text-green-600 uppercase text-[10px]">Correct Answer</p>
                        <p className="font-bold text-green-800">
                            {q.type === QuestionType.MCQ ? q.options![q.correctAnswer!] :
                             q.type === QuestionType.MSQ ? q.correctAnswers!.map(idx => q.options![idx]).join(', ') :
                             (q.correctValue ?? `${q.correctRange?.min} to ${q.correctRange?.max}`)}
                        </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={onReset}
            className="px-12 py-4 bg-[#337ab7] text-white font-black rounded-full hover:bg-blue-800 transition-all shadow-xl uppercase tracking-widest"
          >
            Finish & Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
