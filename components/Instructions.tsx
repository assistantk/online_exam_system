
import React, { useState } from 'react';
import { UserInfo } from '../types';

interface InstructionsProps {
  onStart: () => void;
  userInfo: UserInfo;
}

const Instructions: React.FC<InstructionsProps> = ({ onStart, userInfo }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex-grow bg-white p-6 overflow-y-auto max-w-5xl mx-auto shadow-md my-4">
      <div className="border-b-2 border-blue-900 pb-2 mb-4">
        <h1 className="text-2xl font-bold text-blue-900">General Instructions:</h1>
      </div>

      <div className="space-y-4 text-sm text-gray-800">
        <section>
          <h2 className="font-bold underline mb-2">Total Duration of Examination: 180 Minutes</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination.</li>
            <li>The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 flex items-center justify-center status-not-visited text-xs">01</span>
                  <span>You have not visited the question yet.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 flex items-center justify-center status-not-answered text-xs">03</span>
                  <span>You have not answered the question.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 flex items-center justify-center status-answered text-xs">05</span>
                  <span>You have answered the question.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 flex items-center justify-center status-marked text-xs">07</span>
                  <span>You have NOT answered the question, but have marked the question for review.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 flex items-center justify-center status-marked-answered text-xs">09</span>
                  <span>The question(s) "Answered and Marked for Review" will be considered for evaluation.</span>
                </div>
              </div>
            </li>
          </ol>
        </section>

        <section className="bg-gray-100 p-4 border border-gray-300">
          <h3 className="font-bold mb-2">Navigating to a Question:</h3>
          <p>Click on the question number in the Question Palette to go to that question directly.</p>
          <p>Click on <b>Save & Next</b> to save your answer for the current question and then go to the next question.</p>
        </section>

        <section className="mt-8 border-t pt-4">
          <label className="flex items-start space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm font-medium">
              I have read and understood the instructions. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from the examination and/or any other action.
            </span>
          </label>
          
          <div className="mt-6 flex justify-center">
            <button 
              onClick={onStart}
              disabled={!agreed}
              className={`px-8 py-2 font-bold uppercase tracking-wider transition-colors ${
                agreed 
                ? 'bg-[#337ab7] text-white hover:bg-blue-800' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              I am ready to begin
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Instructions;
