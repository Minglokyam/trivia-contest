import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react';
import withApollo from '../../utils/withApollo';
import QuestionCard from '../../components/QuestionCard';
import { removeUnwantedCharacters, shuffleArray } from '../../utils/processString';
import { Wrapper } from '../../components/Wrapper';
import Cookie from 'js-cookie';
import Layout from '../../components/Layout';
import { parseCookie } from '../../utils/parseCookie';
import { BROWSER_USERNAME_KEY } from '../../utils/constants';
import { useRouter } from 'next/dist/client/router';
import { useIncrementPointMutation, UsersDocument } from '../../generated/graphql';
import { Answer, Question } from '../../types';
import useExamineUploadCondition from '../../utils/useExamineUploadCondition';
import { checkToday } from '../../utils/checkToday';

interface QuestionsProps {
    fetchedQuestions: Question[];
    userData: string;
}

const Questions: React.FC<QuestionsProps> = ({userData, fetchedQuestions}) => {
  const [processedQuestionList, setProcessedQuestionList] = useState([]);
  const [answerResult, setAnswerResult] = useState({});
  const [total, setTotal] = useState('TBD');
  const [visible, setVisible] = useState(false);
  const [incrementPoint] = useIncrementPointMutation();
  const router = useRouter();

  useExamineUploadCondition(visible);

  useEffect(() => {
    const tempAnswerResult = {};

    const tempProcessedQuestionList = fetchedQuestions.map((fetchedQuestion) => {
      const answers: Answer[] = [];

      const {
          question,
          correct_answer,
          incorrect_answers
      } = fetchedQuestion;

      answers.push({
        answer_text: correct_answer,
        correct: true,
        processed_answer_text: removeUnwantedCharacters(correct_answer)
      });
      incorrect_answers.forEach((incorrect_answer) => {
          answers.push({
              answer_text: incorrect_answer, 
              correct: false,
              processed_answer_text: removeUnwantedCharacters(incorrect_answer)
          });
      });

      shuffleArray(answers);

      const processed_question_text = removeUnwantedCharacters(question);

      tempAnswerResult[processed_question_text] = answers[0].correct ? 1 : 0;
      
      return {
        question,
        processed_question_text,
        answers
      };
    });

    setProcessedQuestionList(tempProcessedQuestionList);
    setAnswerResult(tempAnswerResult);
  }, []);

  const changeAnswer = (key, value) => {
    setAnswerResult({
      ...answerResult,
      [key]: value
    });
  };

  const computeMark = async (): Promise<string> => {
    let totalMark = 0;
    const answerResultValues: number[] = Object.values(answerResult);

    answerResultValues.forEach((mark) => {
      totalMark += mark;
    });

    const response = await incrementPoint({
      variables: {incrementPoints: totalMark, id: parseInt(router.query.id as string)},
      refetchQueries: [{ query: UsersDocument }]
    });

    const {updatedAt} = response.data.incrementPoint.user;

    Cookie.set(BROWSER_USERNAME_KEY, `${userData.split('+')[0]}+${userData.split('+')[1]}+${updatedAt}`);

    setVisible(true);

    return totalMark.toString();
  };

  return (
    <Layout userData={userData}>
      <Wrapper>
        <Flex direction='column' alignItems='center'>
          <Text fontWeight='bold' mt={1} fontSize='xl'>Questions</Text>
          <Stack>
                <Box>
                    {
                        processedQuestionList.map((processedQuestion, index) => (
                            <QuestionCard
                              visible={visible}
                              changeAnswer={changeAnswer}
                              key={processedQuestion.processed_question_text}
                              questionIndex={index+1}
                              processedQuestion={processedQuestion}
                            />
                        ))
                    }
                </Box> 
          </Stack>
          <Text mt={2} fontSize='lg'>Score: {total}</Text>
          <Flex mt={2} mb={4}>
            <Button mr={1} onClick={async () => setTotal(await computeMark())} isDisabled={visible}>Submit</Button>
            <Button ml={1} onClick={() => router.push('/')}>Go back</Button>
          </Flex>
        </Flex>
      </Wrapper>
    </Layout>
  )
}

export async function getServerSideProps({req}) {
    const cookie = parseCookie(req);
    const res = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
    const questionsResponse = await res.json();
    const userData = cookie[BROWSER_USERNAME_KEY];

    const getServerSidePropsResult = {};

    if(
      !userData ||
      checkToday(userData.split('+')[2])
    ){
      getServerSidePropsResult['redirect'] = {
        permanent: false,
        destination: '/'
      };
      
      getServerSidePropsResult['props'] = {};
    }
    else {
      getServerSidePropsResult['props'] = {
        userData,
        fetchedQuestions: questionsResponse.results
      };
    }

  return getServerSidePropsResult;
}

export default withApollo()(Questions);