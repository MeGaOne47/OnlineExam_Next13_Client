/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { Button, Card, ListGroup } from "react-bootstrap";
import useSWR, { Fetcher } from 'swr';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { toast } from "react-toastify";

const ExamJoin = ({ params }: { params: { id: string } }) => {
    // Fetch data for the exam
    const fetcher: Fetcher<IExam, string> = (url: string) => fetch(url)
        .then((res) => res.json());

    const { data, error, isLoading } = useSWR(
        `http://localhost:3000/exams/${params.id}`,
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
    const [answerResult, setAnswerResult] = useState<boolean | null>(null);

    const goToNextQuestion = () => {
        if (selectedAnswerId !== null) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswerId(null);
            setAnswerResult(null);
        } else {
            toast.error('Please answer the current question before moving to the next one', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    const currentQuestion = data?.questions[currentQuestionIndex];

    // Retrieve user information
    const userJSON = localStorage.getItem('user');
    const user = userJSON ? JSON.parse(userJSON) : null;

    const [userData, setUserData] = useState<{ sub: number }>({
        sub: 0,
    });

    useEffect(() => {
        if (user && !userData.sub) { // Thêm điều kiện !userData.sub
            const fetchUserInfo = async (access_token: any) => {
                try {
                    const response = await fetch('http://localhost:3000/auth/user-info', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    });

                    if (response.status === 200) {
                        const userData = await response.json();
                        setUserData(userData);
                    } else {
                        toast.error('Failed to get user information', {
                            position: 'top-right',
                            autoClose: 3000,
                        });
                    }
                } catch (error) {
                    console.error('Error getting user information:', error);
                    toast.error('An error occurred while getting user information', {
                        position: 'top-right',
                        autoClose: 3000,
                    });
                }
            };
            fetchUserInfo(user.access_token);
        }
    }, [user, userData.sub]);

    // const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
    // const [answerResult, setAnswerResult] = useState<boolean | null>(null);
    const socket = io('http://127.0.0.1:8081');

    useEffect(() => {
        if (data && userData.sub) {
            // const dataToSend = {
            //     userId: userData.sub,
            //     examId: params.id
            // };
            // socket.emit('startExam', dataToSend);
            // socket.on('start', (data) => {
            //     const res = JSON.parse(data);
            //     console.log(res.examId)
            //   })
              
            socket.on('checkAnswer', (isCorrect) => {
                setAnswerResult(isCorrect);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [data, params.id, socket, userData.sub]);

    const submitAnswer = () => {
        if (selectedAnswerId !== null && userData.sub) {
            socket.emit('checkAnswer', {
                userId: userData.sub,
                answerId: selectedAnswerId,
            });

        }
    };
    const startExam = () => {
        const dataToSend = {
                userId: userData.sub,
                examId: params.id
            };
        socket.emit('startExam', dataToSend);
            socket.on('start', (data) => {
                const res = JSON.parse(data);
                console.log(res.examId)
              })
    };

    const finishExam = () => {
        if (userData.sub) {
            socket.emit('finishExam', {
                userId: userData.sub,
                examId: params.id,
            });
            socket.on('finishExam', (data) => {
                  console.log('Điểm: ' + data);
                  setUserScore(data);
                });
        }
    };
    const [userScore, setUserScore] = useState<number | null>(null);



    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading exam data</p>;
    }

    return (
        <div style={{ display: 'flex' }}>
        <Button onClick={startExam}>Nhớ Kết Nối Server</Button>
            <div style={{ flex: '1', margin: '45px' }}>
                <Card className="text-center" style={{ backgroundColor: '#f0f0f0', color: '#333' }}>
                    <Card.Header style={{ backgroundColor: '#ccc', color: 'white' }}>Exam ID: {data?.examId}</Card.Header>
                    <Card.Body>
                        <Card.Title style={{ color: 'green' }}>Number of Questions: {data?.numberOfQuestions}</Card.Title>
                        <Card.Text style={{ color: 'blue' }}>Time Limit: {data?.timeLimit}</Card.Text>
                    </Card.Body>
                </Card>
                <h1>User Score: {userScore !== null ? userScore : 'Not available'}</h1>
            </div>
            <div style={{ flex: '1' }}>
                <h3 style={{ backgroundColor: '#cccccc', color: 'white', padding: '10px', margin: '1px', borderRadius: '10px' }}>Questions:</h3>
                <ListGroup>
                    {currentQuestion && (
                        <ListGroup.Item style={{ backgroundColor: '#f9f9f9' }}>
                            Question {currentQuestionIndex + 1}: {currentQuestion.content}
                            <ul>
                                {currentQuestion.answers.map((answer) => (
                                    <li key={answer.answerId}>
                                        Answer: {answer.content}
                                        <input
                                            type="radio"
                                            name={`answer-${currentQuestion.questionId}`}
                                            value={answer.answerId}
                                            onChange={(e) => setSelectedAnswerId(Number(e.target.value))}
                                        />
                                        {/* Is Correct: {answer.isCorrect ? 'Yes' : 'No'} */}
                                    </li>
                                ))}
                            </ul>
                        </ListGroup.Item>
                    )}
                </ListGroup>
                <Button onClick={submitAnswer}>Submit Answer</Button>
                {answerResult !== null && (
                    <div>
                        {answerResult ? <p>Correct Answer!</p> : <p>Incorrect Answer.</p>}
                    </div>
                )}
                <Button onClick={goToNextQuestion}>Next</Button>
                <Button onClick={finishExam}>Finish Exam</Button>          
            </div>
        </div>
    );
}

export default ExamJoin;
