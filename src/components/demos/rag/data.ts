/**
 * Tiny shared dataset for RAG demos. Vectors are hand-made with three meaning
 * dimensions [pets, vehicles, food] so the maths is easy to follow.
 */
export interface Row {
  id: number;
  text: string;
  vec: readonly [number, number, number];
  type: string;
  year: number;
}

export const ROWS: Row[] = [
  { id: 1, text: "Caring for a young dog", vec: [0.92, 0.05, 0.12], type: "guide", year: 2024 },
  { id: 2, text: "Why cats sleep so much", vec: [0.88, 0.02, 0.08], type: "article", year: 2021 },
  { id: 3, text: "Training your puppy to sit", vec: [0.95, 0.03, 0.05], type: "guide", year: 2019 },
  { id: 4, text: "Electric cars explained", vec: [0.03, 0.96, 0.02], type: "article", year: 2023 },
  { id: 5, text: "How buses run on time", vec: [0.05, 0.9, 0.04], type: "guide", year: 2022 },
  { id: 6, text: "Best pizza dough recipe", vec: [0.04, 0.02, 0.97], type: "recipe", year: 2020 },
  { id: 7, text: "Healthy fruit snacks for kids", vec: [0.1, 0.02, 0.93], type: "recipe", year: 2024 },
  { id: 8, text: "Dog-friendly road trips", vec: [0.62, 0.55, 0.1], type: "article", year: 2023 },
];

export const QUERIES = [
  { id: "pets", label: "puppy care", vec: [0.97, 0.04, 0.06] as const },
  { id: "vehicles", label: "fast vehicles", vec: [0.04, 0.98, 0.03] as const },
  { id: "food", label: "healthy snacks", vec: [0.06, 0.02, 0.98] as const },
] as const;

export type QueryId = (typeof QUERIES)[number]["id"];
