import type { Component } from "solid-js";
import { createSignal, Match, Switch } from "solid-js";
import { axiosClient } from "../libs/axios";

interface NewInstructorFormProps {
  initialAbbreviation: string;
  onSubmissionComplete?: () => void;
  onCancel?: () => void;
}
const NewInstructorForm: Component<NewInstructorFormProps> = ({
  initialAbbreviation,
  onCancel,
  onSubmissionComplete,
}) => {
  const abbreviation = initialAbbreviation.toUpperCase();
  const [fullName, setFullName] = createSignal("");
  const [department, setDepartment] = createSignal("Computer Department"); // Default department
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [submitSuccess, setsubmitSuccess] = createSignal(false);
  const [submitStatus, setSubmitStatus] = createSignal("");

  const departments = [
    "Civil Department",
    "Electrical Department",
    "Mechanical Department",
    "Industrial Department",
    "Chemical Department",
    "Mining and Petroleum Department",
    "Environmental Department",
    "Survey Department",
    "Metallurgical Department",
    "Computer Department",
    "Nuclear Department",
    "Water Resources Department",
  ];

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    // Basic validation
    if (!abbreviation.trim() || !fullName().trim() || !department().trim()) {
      setSubmitStatus("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("");
    try {
      await axiosClient.post(
        "/ajarn/abbre/request",
        {
          abbreviation: abbreviation.trim(),
          name: fullName().trim(),
          department: department().trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );
      setSubmitStatus("Submission successful! I will review your data ASAP.");
      setFullName("");
      setDepartment("Computer Department"); // Reset department field to default
      setsubmitSuccess(true);
      onSubmissionComplete?.();
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="mx-auto w-full max-w-[500px] px-4">
      <div class="rounded-lg">
        <h2 class="mb-6 text-center text-2xl font-bold text-blue-800">
          Submit New Data
        </h2>
        <Switch>
          <Match when={submitSuccess()}>
            <>
              {submitStatus() && (
                <div
                  class={`rounded-lg p-3 text-sm ${
                    submitStatus().includes("successful")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {submitStatus()}
                </div>
              )}
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting()}
                class={`mt-4 w-full rounded-lg bg-blue-600 p-2 text-white transition-all hover:bg-blue-700 active:scale-95`}
              >
                Go back
              </button>
            </>
          </Match>
          <Match when={!submitSuccess()}>
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label
                  for="abbreviation"
                  class="mb-2 block text-sm font-medium text-blue-700"
                >
                  Abbreviation
                </label>
                <input
                  id="abbreviation"
                  type="text"
                  value={abbreviation}
                  disabled
                  class="w-full cursor-not-allowed rounded-lg border border-blue-300 bg-blue-100 p-2 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-sm"
                />
              </div>

              <div>
                <label
                  for="fullName"
                  class="mb-2 block text-sm font-medium text-blue-700"
                >
                  Full Name (Thai or English)
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName()}
                  onInput={(e) => setFullName(e.currentTarget.value)}
                  placeholder="Enter first and last name"
                  required
                  class="w-full rounded-lg border border-blue-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-sm"
                />
              </div>

              {/* Department Dropdown */}
              <div>
                <label
                  for="department"
                  class="mb-2 block text-sm font-medium text-blue-700"
                >
                  Department
                </label>
                <select
                  id="department"
                  value={department()}
                  onInput={(e) => setDepartment(e.currentTarget.value)}
                  required
                  class="w-full rounded-lg border border-blue-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-sm"
                >
                  {departments.map((dept) => (
                    <option value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div class="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting()}
                  class={`w-full rounded-lg p-2 text-white transition-all sm:w-1/3 ${
                    isSubmitting()
                      ? "cursor-not-allowed bg-slate-200"
                      : "bg-slate-400 hover:bg-slate-500 active:scale-95"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting()}
                  class={`w-full rounded-lg p-2 text-white transition-all ${
                    isSubmitting()
                      ? "cursor-not-allowed bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                  }`}
                >
                  {isSubmitting() ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default NewInstructorForm;
