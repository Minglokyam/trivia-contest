export type Question = {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    incorrect_answers: string[];
    correct_answer: string;
}

export type ProcessedQuestion = {
    question: string;
    processed_question_text: string;
    answers: Answer[];
}

export type Answer = {
    processed_answer_text: string;
    correct: Boolean;
    answer_text: string;
}
