
import React, { useState, useEffect } from 'react';
import { AppState, UserInfo, QuestionStatus, UserProgress, Question } from './types';
import Login from './components/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import Instructions from './components/Instructions';
import ExamPortal from './components/ExamPortal';
import Result from './components/Result';
import { fetchQuestionsFromServer } from './api';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '[Your Name]',
    systemId: '[C0001]',
    subject: 'IIT JAM: Geology (Solved Model Paper 3)'
  });
  
  const [progress, setProgress] = useState<Record<number, UserProgress>>({});

  // Fetch questions from our mock backend on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchQuestionsFromServer();
        setQuestions(data);
        
        // Initialize progress once questions are loaded
        const initialProgress = data.reduce((acc, q) => ({
          ...acc,
          [q.id]: { 
            selectedOption: null, 
            selectedOptions: [], 
            natValue: '', 
            status: QuestionStatus.NOT_VISITED 
          }
        }), {});
        
        setProgress(initialProgress);
      } catch (error) {
        console.error("Critical Failure: Could not reach backend:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const startExam = () => setAppState(AppState.EXAM);
  
  const goToInstructions = (name: string) => {
    setUserInfo(prev => ({ ...prev, name }));
    setAppState(AppState.INSTRUCTIONS);
  };
  
  const submitExam = () => setAppState(AppState.RESULT);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0b2b4f] text-white">
        <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-500"></div>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-orange-400">NODE</div>
        </div>
        <h2 className="text-xl font-bold tracking-widest uppercase mt-6">Initializing Node.js Session...</h2>
        <p className="mt-2 text-sm text-blue-200 animate-pulse">Requesting questions from secure API endpoint</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header userInfo={userInfo} />
      
      <main className="flex-grow flex flex-col bg-[#f0f2f5]">
        {appState === AppState.LOGIN && (
          <Login onLogin={goToInstructions} />
        )}
        
        {appState === AppState.INSTRUCTIONS && (
          <Instructions onStart={startExam} userInfo={userInfo} />
        )}
        
        {appState === AppState.EXAM && (
          <ExamPortal 
            questions={questions} 
            progress={progress}
            setProgress={setProgress}
            onSubmit={submitExam}
          />
        )}

        {appState === AppState.RESULT && (
          <Result 
            questions={questions}
            progress={progress}
            userInfo={userInfo}
            onReset={() => window.location.reload()}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
