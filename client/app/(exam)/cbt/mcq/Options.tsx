import { Question } from "@/lib/constants/mcq";

interface OptionsProps {
  currentQuestion: Question;
  currentSelectedOption: string | null;
  handleSelectOption: (letter: string) => void;
}

const Options = ({ currentQuestion, currentSelectedOption, handleSelectOption }: OptionsProps) => {
  return (
    <div className="px-6 pb-6 space-y-3" role="radiogroup" aria-label="Answer options">
      {(["A", "B", "C", "D"] as const).map((letter, idx) => {
        const isSelected = currentSelectedOption === letter;
        return (
          <label
            key={letter}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all outline-none focus-within:ring-2 focus-within:ring-green-500 ${
              isSelected
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-green-300 hover:bg-cream/50"
            }`}>
            <input
              type="radio"
              name="question-option"
              value={letter}
              checked={isSelected}
              onChange={() => handleSelectOption(letter)}
              className="sr-only"
            />
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? "border-green-600" : "border-gray-300"
                }`}
                aria-hidden="true">
                {isSelected && <div className="w-3 h-3 rounded-full bg-green-600" />}
              </div>
              <span className="font-bold text-green-800 w-6">{letter}.</span>
            </div>
            <span className="flex-1 text-[14px] text-gray-700">{currentQuestion.options[idx]}</span>
          </label>
        );
      })}
    </div>
  );
};

export default Options;
