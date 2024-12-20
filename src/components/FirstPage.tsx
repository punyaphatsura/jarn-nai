import type { Component, JSX } from "solid-js";
import {
  createSignal,
  Show,
  For,
  Match,
  Switch,
  onMount,
  onCleanup,
} from "solid-js";
import background1 from "../assets/background1.svg";
import background2 from "../assets/background2.svg";
import AlphabetInputForm from "./AbbretiveSearchInput";
import NewInstructorForm from "./NewInstructorForm";
import { Info } from "lucide-solid";
import { axiosClient } from "../libs/axios";
import type { IAjarn } from "../interfaces/ajarn";

const FirstPage: Component = () => {
  const [searchTerm, setSearchTerm] = createSignal("");
  const [searchResult, setSearchResult] = createSignal<IAjarn | undefined>();
  const [isLoading, setIsLoading] = createSignal(false);
  const [notFound, setNotFound] = createSignal(false);
  const [lastSearch, setLastSearch] = createSignal("");
  const [isAddFormState, setIsAddFormState] = createSignal(false);
  const [isInfoVisible, setIsInfoVisible] = createSignal(false);

  const handleSubmit = async () => {
    // Reset previous states
    setNotFound(false);
    setLastSearch(searchTerm());
    setIsLoading(true);

    try {
      const data = await axiosClient.get(
        `/ajarn/abbre/${searchTerm().toUpperCase()}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (data.data.status === 404) {
        console.log("Not found");
        setSearchResult(undefined);
        setNotFound(true);
        return;
      }

      // Check if data exists
      if (data.data) {
        setSearchResult(data.data);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } catch (e: any) {
      // console.error(e);

      // Check if it's a 404 error
      if (e.response?.status === 404) {
        setSearchResult(undefined);
        setNotFound(true);
      } else {
        // For other types of errors
        setSearchResult(undefined);
      }
    } finally {
      setIsLoading(false);
    }
  };

  let tooltipRef: HTMLDivElement | undefined;

  const handleClickOutside = (event: MouseEvent) => {
    if (tooltipRef && !tooltipRef.contains(event.target as Node)) {
      setIsInfoVisible(false);
    }
  };

  onMount(() => {
    if (typeof document !== "undefined")
      document.addEventListener("mousedown", handleClickOutside);
  });

  onCleanup(() => {
    if (typeof document !== "undefined")
      document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div
      class={`relative z-10 flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6`}
    >
      <img
        class="fixed left-0 top-0 -z-10 h-full max-h-[100dvh] w-full animate-[spin_60s_linear_infinite] blur-xl sm:blur-3xl"
        src={background1.src}
        alt=""
        fetchpriority="high"
      />
      <img
        class="fixed left-0 top-0 -z-10 h-full max-h-[100dvh] w-full animate-[reverse-spin_110s_linear_infinite] blur-xl sm:blur-3xl"
        src={background2.src}
        alt=""
        fetchpriority="high"
      />

      {/* Main content container with responsive width and padding */}
      <div
        class={`relative mx-auto w-full max-w-[500px] rounded-xl border border-slate-200 bg-white p-4 shadow-lg transition-transform sm:max-w-xl sm:p-8 md:max-w-2xl`}
      >
        <button
          onClick={() => setIsInfoVisible(!isInfoVisible())}
          class="absolute right-2 top-2 rounded-full p-2 text-gray-600 hover:bg-gray-200 focus:outline-none"
          aria-label="Toggle Information"
        >
          <Info size={20} />
        </button>
        <Switch>
          {/* New Instructor Form */}
          <Match when={isAddFormState()}>
            <NewInstructorForm
              initialAbbreviation={lastSearch()}
              onSubmissionComplete={() => {
                setLastSearch("");
                setNotFound(false);
                setSearchTerm("");
                // setIsAddFormState(false);
              }}
              onCancel={() => {
                setIsAddFormState(false);
              }}
            />
          </Match>

          {/* Main Search Interface */}
          <Match when={!isAddFormState()}>
            {/* Responsive title and subtitle */}
            <Show when={isInfoVisible()}>
              <div
                ref={tooltipRef}
                class="absolute right-2 top-2 mt-2 w-[300px] rounded-lg bg-slate-100 bg-opacity-90 p-4 text-center text-xs text-gray-500 shadow-lg backdrop-blur-md"
              >
                <div>
                  <p class="font-bold">Note:</p>
                  <p>
                    This website contains Jarn's data, but it is not yet
                    complete. If your abbreviation search is not found, please
                    help us make the data more comprehensive by submitting the
                    missing data. Currently, this platform supports only
                    instructors (Jarn) from the Computer Engineering Department
                    at Chulalongkorn University (CP CU). If I gather enough data
                    from other departments, I will expand this website to
                    support those departments as well.
                  </p>
                </div>
              </div>
            </Show>
            <div class="mb-6 text-center">
              <div class="mb-4 flex w-full items-center justify-center">
                <h1 class="text-4xl font-bold text-blue-800 sm:text-5xl md:text-6xl">
                  Jarn Nai
                </h1>
              </div>
              <p class="text-sm sm:text-base">
                This website is designed to solve the problem: 'Jarn Khon Nee
                Pen Krai Wa?' in Chula.
              </p>
            </div>

            {/* Alphabet Input Form */}
            <AlphabetInputForm
              value={searchTerm}
              setValue={setSearchTerm}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />

            {/* Not Found State with responsive layout */}
            <Show when={notFound()}>
              <div class="mt-6 translate-y-10 animate-[fadeInDown_0.5s_ease-out_forwards] rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 opacity-0">
                <div class="flex items-center">
                  <svg
                    class="mr-2 h-5 w-5 text-red-500 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h2 class="text-lg font-semibold sm:text-xl">Not Found</h2>
                </div>
                <p class="mt-2 text-sm sm:text-base">
                  No Jarn found for the abbreviation "{lastSearch()}" in my
                  data. If you believe this abbreviation is correct and should
                  be included, please help us expand our database by submitting
                  the new data. Your contribution can help make this resource
                  more comprehensive and accurate.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddFormState(true);
                }}
                class="mt-4 w-full rounded-lg border-2 border-blue-800 bg-white p-2 text-sm text-blue-800 transition-all hover:bg-slate-100 active:scale-95 sm:text-base"
              >
                Submit the data
              </button>
            </Show>

            {/* Search Result with responsive layout */}
            <Show when={searchResult()}>
              {(result) => (
                <div class="mt-6 translate-y-10 animate-[fadeInDown_0.5s_ease-out_forwards] rounded-lg bg-blue-50 p-4 opacity-0">
                  <div class="mb-4 flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0">
                    {result().imgSrc && (
                      <img
                        src={result().imgSrc!}
                        alt={`Profile of ${result().thname}`}
                        class="h-24 w-24 rounded-full object-cover shadow-md sm:mr-6"
                      />
                    )}
                    <div class="text-center sm:text-left">
                      <h2 class="text-xl font-bold text-blue-800 sm:text-2xl">
                        {result().thname}
                      </h2>
                      <p class="text-sm text-blue-600 sm:text-base">
                        {result().enname}
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div class="sm:col-span-2">
                      <p class="text-sm font-semibold sm:text-base">
                        Education:
                      </p>
                      <For each={result().education.split("\n")}>
                        {(item) => <p class="text-xs sm:text-sm">- {item}</p>}
                      </For>
                    </div>
                    <div>
                      <p class="text-sm font-semibold sm:text-base">
                        Research Interest:
                      </p>
                      <For each={result().interested.split("; ")}>
                        {(item) => <p class="text-xs sm:text-sm">- {item}</p>}
                      </For>
                    </div>
                    <div>
                      <p class="text-sm font-semibold sm:text-base">Room:</p>
                      <p class="text-xs sm:text-sm">{result().room}</p>
                    </div>
                    <div class="sm:col-span-2">
                      <p class="text-sm font-semibold sm:text-base">Contact:</p>
                      <p class="text-xs sm:text-sm">
                        Email:{" "}
                        <a
                          href={`mailto:${result().email}`}
                          class="text-blue-600 hover:underline"
                        >
                          {result().email}
                        </a>
                      </p>
                      <p class="text-xs sm:text-sm">
                        Website:{" "}
                        <a
                          href={result().website}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-blue-600 hover:underline"
                        >
                          {result().website}
                        </a>
                      </p>
                    </div>
                    {result().refUrl && (
                      <div class="sm:col-span-2">
                        <p class="text-sm font-semibold sm:text-base">
                          Reference:
                        </p>
                        <a
                          href={result().refUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="break-all text-xs text-blue-600 hover:underline sm:text-sm"
                        >
                          {result().refUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Show>
          </Match>
        </Switch>
      </div>
      <div class="mx-auto mt-8 flex w-fit items-center rounded-lg bg-slate-100 bg-opacity-50 p-4 text-center text-xs text-gray-500">
        <p class="mr-1 font-bold">Developed by: </p>
        <a
          about="blank"
          rel="noopener noreferrer"
          class="text-blue-800 underline transition-all hover:font-bold"
          href="https://github.com/punyaphatsura"
        >
          punyaphatsura
        </a>
      </div>
    </div>
  );
};

export default FirstPage;
