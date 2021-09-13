import React, { useState } from 'react';
import { Flex, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { Wrapper } from './Wrapper';
import { ProcessedQuestion } from '../types';
import { replaceHtmlSpecialCharacter } from '../utils/processString';

interface QuestionCardProps {
    changeAnswer: (key: string, value: number) => void;
    questionIndex: number;
    processedQuestion: ProcessedQuestion;
    visible: boolean;
}

const QuestionCard: React.FC<QuestionCardProps>= ({changeAnswer, questionIndex, processedQuestion, visible}) => {
    const [chosen, setChosen] = useState(processedQuestion.answers[0].processed_answer_text);
    let rightChoice = '';
    for(let i = 0; i < 4; i++){
        const {
            correct,
            processed_answer_text
        } = processedQuestion.answers[i];
        if(correct){
            rightChoice = processed_answer_text;
            break;
        }
    }

    return (
        <Wrapper>
            <Flex>
                <Text fontSize='lg'>{questionIndex}</Text>
                <Text fontSize='lg' ml={2}>
                    {replaceHtmlSpecialCharacter(processedQuestion.question)}
                </Text>
            </Flex>
            <RadioGroup
                onChange={(value) => {
                    setChosen(value);
                    changeAnswer(
                        processedQuestion.processed_question_text,
                        value === rightChoice ? 1 : 0
                    )
                }}
                mt={2}
                value={chosen}
            >
                <Stack>
                    {processedQuestion.answers.map(answer => {
                        const {
                            correct,
                            answer_text,
                            processed_answer_text
                        } = answer;
                        return (
                            <Radio
                                value={processed_answer_text}
                                key={processed_answer_text} 
                                size='lg'
                                isDisabled={visible}
                            >
                                <Text
                                    bg={!visible ? '' : !correct ? '#FC8181' : '#68D391'}
                                    p={1}
                                    borderRadius={4}
                                >
                                    {replaceHtmlSpecialCharacter(answer_text)}
                                </Text>
                            </Radio>
                        );
                    })}
                </Stack>
            </RadioGroup>
        </Wrapper>
    );
};

export default QuestionCard;