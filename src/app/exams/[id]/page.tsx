/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { Button, Card, ListGroup } from "react-bootstrap";
import useSWR, { Fetcher } from 'swr'

const ViewDetailExam = ({ params }: { params: { id: string } }) => {
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

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div style={{ display: 'flex'}}>
            <div style={{ flex: '1', margin: '45px' }}>
                <Card className="text-center" style={{ backgroundColor: '#f0f0f0', color: '#333' }}>
                    <Card.Header style={{ backgroundColor: '#ccc', color: 'white' }}>Exam ID: {data?.examId}</Card.Header>
                    <Card.Body>
                        <Card.Title style={{ color: 'green' }}>Number of Questions: {data?.numberOfQuestions}</Card.Title>
                        <Card.Text style={{ color: 'blue' }}>Time Limit: {data?.timeLimit}</Card.Text>
                    </Card.Body>
                </Card>
            </div>
            <div style={{ flex: '1' }}>
                <h3 style={{ backgroundColor: '#cccccc', color: 'white', padding: '10px', margin: '1px', borderRadius: '10px' }}>Questions:</h3>
                <ListGroup>
                    {data?.questions.map((question, index) => (
                        <ListGroup.Item key={index} style={{ backgroundColor: '#f9f9f9' }}>
                            Question {index + 1}: {question.content}
                            <ul>
                                {question.answers.map((answer) => (
                                    <li key={answer.answerId}>
                                        Answer: {answer.content}, Is Correct: {answer.isCorrect ? 'Yes' : 'No'}
                                    </li>
                                ))}
                            </ul>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </div>
    )
}

export default ViewDetailExam;
