
import { Question, QuestionType } from './types';

// Fallback data for preview environment (same as in server.js)
const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 2,
    type: QuestionType.MCQ,
    text: "Which of the following mass extinctions is known as \"The Mother of all Mass Extinctions\"?",
    options: ["Permian-Triassic", "Triassic-Jurassic", "Cretaceous-Tertiary", "Ordovician-Silurian"],
    correctAnswer: 0
  },
  {
    id: 3,
    type: QuestionType.MCQ,
    text: "A sandstone bed striking E-W and dipping 40 degrees towards N is encountered at an outcrop having a flat topography. Towards which direction should a vertical borehole be dug so as to hit the sandstone bed?",
    options: ["S", "N", "E", "W"],
    correctAnswer: 1
  },
  {
    id: 5,
    type: QuestionType.MCQ,
    text: "'Present is the key to the past' is a fundamental doctrine in historical geology. What is this doctrine?",
    options: ["Doctrine of neptunism", "Doctrine of catastrophism", "Doctrine of uniformitarianism", "Doctrine of plutonism"],
    correctAnswer: 2
  },
  {
    id: 11,
    type: QuestionType.MCQ,
    text: "Which of the following types of ore deposits are associated with sedimentary processes?",
    options: ["Porphyry Tin deposits", "Graphite deposits in Khondalites", "Beach placers", "Stratiform Chromite deposits"],
    correctAnswer: 2
  },
  {
    id: 15,
    type: QuestionType.MCQ,
    text: "What type of structure is shown on the afforded map? A is the oldest bed while C is the youngest. The fault plane dips 60 degrees NW.<br/><div class='p-2 bg-gray-50 border my-2 text-center text-xs italic'>[Map Profile: C-B-A-B-C Sequence with Fault Dip]</div>",
    options: ["A faulted anticline", "A faulted syncline", "A folded normal fault", "A folded reverse fault"],
    correctAnswer: 0
  },
  {
    id: 19,
    type: QuestionType.MCQ,
    text: "Pick out the Precambrian rock unit from the four choices provided.",
    options: ["Chikshellikeri Limestone", "Neobolus Beds", "Chikkim Sandstone", "Boulder Conglomerate Fm."],
    correctAnswer: 0
  },
  {
    id: 20,
    type: QuestionType.MCQ,
    text: "A minor connection worked from a lower level to higher level in a mine is known as :",
    options: ["Winze", "Raise", "Crosscut", "Shaft"],
    correctAnswer: 1
  },
  {
    id: 32,
    type: QuestionType.MSQ,
    text: "SECTION - B (MSQ): Which of the following evolutionary breakthroughs is/are correctly linked with the geological time scale?",
    options: ["Cenozoic-Evolution of Mammals", "Mesozoic-Evolution of Birds", "Palaeozoic-Evolution of Vertebrates", "Proterozoic-Evolution of Life"],
    correctAnswers: [0, 1, 2, 3]
  },
  {
    id: 33,
    type: QuestionType.MSQ,
    text: "Choose the correct statement(s) about magmatic sills.",
    options: [
      "Sills are concordant with the country rocks.",
      "A simple sill results from the simple injection of a magma.",
      "A multiple sill results from two or more injections of the same kind of magma.",
      "Sills ideally have chilled margins both above and below."
    ],
    correctAnswers: [0, 1, 2, 3]
  },
  {
    id: 43,
    type: QuestionType.NAT,
    text: "SECTION - C (NAT): Of the 32 crystal classes, how many possess a centre of symmetry?",
    correctValue: 11,
    correctRange: { min: 11, max: 11 }
  },
  {
    id: 44,
    type: QuestionType.NAT,
    text: "The difference in the number of atoms per unit cell in a FCC (Face Centered Cubic) unit cell and BCC (Body Centered Cubic) unit cell is _______.",
    correctValue: 2,
    correctRange: { min: 2, max: 2 }
  }
];

/**
 * Fetches questions from the Node.js backend.
 * Falls back to local data if the server is unreachable (standard behavior for development).
 */
export const fetchQuestionsFromServer = async (): Promise<Question[]> => {
  try {
    const response = await fetch('/api/questions');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn("Backend server not found, using embedded fail-safe database.", error);
    // Simulate a successful network delay for the fallback
    return new Promise((resolve) => {
      setTimeout(() => resolve(FALLBACK_QUESTIONS), 2000);
    });
  }
};
