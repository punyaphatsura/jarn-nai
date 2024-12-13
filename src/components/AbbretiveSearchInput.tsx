import type { Component } from "solid-js";
import { createSignal, createEffect, onCleanup } from "solid-js";

interface Props {
  value: () => string;
  setValue: (value: string) => void;
  handleSubmit: () => void;
  isLoading: () => boolean;
}

const AlphabetInputForm: Component<Props> = ({
  value,
  setValue,
  handleSubmit,
  isLoading,
}) => {
  // const [code, setValue] = createSignal("");
  const inputsRef: HTMLInputElement[] = [];

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    const key = e.key.toUpperCase();

    // Only allow A-Z uppercase letters
    if (/^[A-Z]$/.test(key)) {
      e.preventDefault();
      inputsRef[index].value = key;

      // Update code state
      const newCode = value().split("");
      newCode[index] = key;
      const newValue = newCode.join("");
      setValue(newValue);

      // Move focus to next input
      if (index + 1 < 3 || newValue.length < 3) {
        inputsRef[Math.min(newValue.length, index + 1)].focus();
      } else {
        inputsRef[index].blur();
      }
    }
    // Handle Backspace
    else if (e.key === "Backspace") {
      e.preventDefault();

      if (value()[index]) {
        // Current input has a value
        inputsRef[index].value = "";
        const newCode = value().split("");
        newCode[index] = "";
        setValue(newCode.join(""));
      } else if (index === 0) {
        return;
      } else {
        // Move focus to previous input
        inputsRef[index - 1].value = "";
        const newCode = value().split("");
        newCode[index - 1] = "";
        setValue(newCode.join(""));
        inputsRef[index - 1].focus();
      }
    }
    // Handle navigation keys
    else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 2) {
      e.preventDefault();
      inputsRef[index + 1].focus();
    }
  };

  return (
    <div class="flex items-center justify-center p-4">
      <div class="w-full max-w-md rounded-xl bg-white">
        <h1 class="mb-6 text-center text-2xl font-bold text-blue-800">
          Enter Jarn's Abbretive
        </h1>

        <div class="mb-6 flex items-center justify-center gap-2">
          {[0, 1, 2].map((index) => (
            <input
              type="text"
              maxLength={1}
              ref={(el) => (inputsRef[index] = el)}
              onKeyDown={(e) => {
                handleKeyDown(e, index);
              }}
              onChange={(e) => {}}
              value={value()[index] || ""}
              class="size-20 cursor-text rounded-t-lg border-b-2 border-gray-300 text-center text-5xl uppercase transition-all focus:border-blue-800 focus:outline-none active:scale-105"
              style="caret-color: transparent"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          class={`w-full rounded-xl py-3 text-white transition-all ${isLoading() || value().length !== 3 ? "bg-slate-400" : "bg-blue-800 hover:bg-blue-600 active:scale-95"}`}
          disabled={isLoading() || value().length !== 3}
        >
          {isLoading() ? (
            <div
              class={`text-center text-white transition-all ${isLoading() ? "scale-100" : "scale-0"}`}
            >
              <div role="status">
                <svg
                  aria-hidden="true"
                  class="mr-2 inline h-6 w-6 animate-spin fill-white text-gray-200 dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4475 97.8624 35.9316 97.0079 33.5933C95.2932 28.9777 92.871 24.5692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7479 32.2913 88.1029 35.8758C89.0246 38.2158 91.5235 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span>Loading...</span>
              </div>
            </div>
          ) : (
            "Search"
          )}
        </button>
      </div>
    </div>
  );
};

export default AlphabetInputForm;
