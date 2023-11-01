'use client'
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { mutate } from 'swr';

interface IProps {
  showModalCreate: boolean;
  setShowModalCreate: (value: boolean) => void;
}

function CreateExamModal(props: IProps) {
  const { showModalCreate, setShowModalCreate } = props;

  const [examTitle, setExamTitle] = useState<string>('');
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(1);
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [questions, setQuestions] = useState([
    {
      content: '',
      answers: [
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
      ],
    },
  ]);

  // Retrieve the user's token from localStorage
  const userJSON = localStorage.getItem('user');
  const user = userJSON ? JSON.parse(userJSON) : null;
  const userToken = user ? user.access_token : null;
  console.log('user:', user);
  console.log('userToken:', userToken);

  const addQuestion = () => {
    // Kiểm tra xem số lượng câu hỏi đã đạt đến giới hạn chưa
    if (questions.length < numberOfQuestions) {
        setQuestions([
        ...questions,
        {
            content: '',
            answers: [
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
            ],
        },
        ]);
    } else {
        toast.warning('You have reached the maximum number of questions.');
    }
  };

  const handleSubmit = () => {
    if (!userToken) {
      // Handle the case where the user's token is missing or invalid (e.g., redirect to login).
      console.error('User token is missing or invalid.');
      // You may want to handle this case by redirecting to the login page or displaying an error message.
      return;
    }

    if (!examTitle) {
      toast.error('Please provide an exam title.');
      return;
    }

    if (questions.some((q) => !q.content || q.answers.filter((a) => a.isCorrect).length < 1)) {
      toast.error(
        'Please fill in all questions and select at least one correct answer for each question.'
      );
      return;
    }

    const examData = {
      examTitle,
      numberOfQuestions,
      timeLimit,
      questions,
    };

    // Include the user's token in the request header
    fetch('http://localhost:3000/exams', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify(examData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.statusCode === 200) {
          toast.success('Exam created successfully!');
          handleCloseModal();
          mutate('http://localhost:3000/exams'); // Replace with your actual SWR endpoint.
        }
      })
      .catch((error) => {
        console.error('Error creating exam:', error);
        toast.error('Failed to create the exam.');
      });
  };

  const handleCloseModal = () => {
    setExamTitle('');
    setNumberOfQuestions(1);
    setTimeLimit(60);
    setQuestions([
      {
        content: '',
        answers: [
          { content: '', isCorrect: false },
          { content: '', isCorrect: false },
          { content: '', isCorrect: false },
          { content: '', isCorrect: false },
        ],
      },
    ]);
    setShowModalCreate(false);
  };

  return (
    <Modal show={showModalCreate} onHide={handleCloseModal} backdrop="static" keyboard={false} size="lg" style={{ maxWidth: '90%', margin: '0 auto' }}>
      <Modal.Header closeButton style={{ background: '#007bff', color: '#fff', borderBottom: 'none' }}>
        <Modal.Title style={{ margin: '0', padding: '1rem 2rem' }}>Create New Exam</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Exam Title"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              style={{ backgroundColor: '#f9f9f9', color: '#333' }}
            />
          </Form.Group>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form.Group style={{ flex: 1, marginRight: '1rem' }}>
              <Form.Label>Questions</Form.Label>
              <Form.Control
                type="number"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                style={{ backgroundColor: '#f9f9f9', color: '#333' }}
              />
            </Form.Group>
            <Form.Group style={{ flex: 1, marginRight: '1rem' }}>
              <Form.Label>Time Limit (minutes)</Form.Label>
              <Form.Control
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                style={{ backgroundColor: '#f9f9f9', color: '#333' }}
              />
            </Form.Group>
          </div>
          <h4>Questions</h4>
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <h5>Question {index + 1}</h5>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder={`Question ${index + 1}`}
                  value={question.content}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].content = e.target.value;
                    setQuestions(updatedQuestions);
                  }}
                  style={{ backgroundColor: '#f9f9f9', color: '#333' }}
                />
              </Form.Group>
              <div className="mt-2">
                <h6>Answers</h6>
                {question.answers.map((answer, ansIndex) => (
                  <div key={ansIndex} className="mb-2">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Form.Check
                        type="checkbox"
                        label={`Answer ${ansIndex + 1}`}
                        checked={answer.isCorrect}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[index].answers[ansIndex].isCorrect = e.target.checked;
                          setQuestions(updatedQuestions);
                        }}
                        style={{ color: '#007bff' }}
                      />
                      <Form.Control
                        type="text"
                        placeholder={`Answer ${ansIndex + 1}`}
                        value={answer.content}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[index].answers[ansIndex].content = e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                        style={{ backgroundColor: '#f9f9f9', color: '#333' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button variant="secondary" onClick={addQuestion}>
            Add Question
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ borderTop: 'none', padding: '1rem 2rem' }}>
        <Button variant="secondary" onClick={handleCloseModal} style={{ marginRight: '1rem' }}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create Exam
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 

export default CreateExamModal;
