'use client'
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { mutate } from "swr";

interface IProps {
  showModalUpdate: boolean;
  setShowModalUpdate: (value: boolean) => void;
  exam: IExam | null;
  setExam: (value: IExam | null) => void;
}

function UpdateModal(props: IProps) {
  const { showModalUpdate, setShowModalUpdate, exam, setExam } = props;

  const [examId, setExamId] = useState<number>(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0);
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  useEffect(() => {
    if (exam) {
      setExamId(exam.examId);
      setNumberOfQuestions(exam.numberOfQuestions);
      setTimeLimit(exam.timeLimit);
      setQuestions(exam.questions);
    }
  }, [exam]);

  const handleCloseModal = () => {
    setExam(null);
    setShowModalUpdate(false);
  }

  const handleEditQuestion = (questionIndex: number, updatedQuestion: IQuestion) => {
    // Update a question in the questions array
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = updatedQuestion;
    setQuestions(updatedQuestions);
  }

  const handleEditAnswer = (questionIndex: number, answerIndex: number, updatedAnswer: IAnswer) => {
    // Update an answer in the answers array of a question
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex] = updatedAnswer;
    setQuestions(updatedQuestions);
  }

  const handleSubmit = () => {
    if (!examId || !numberOfQuestions || !timeLimit || questions.length === 0) {
      toast.error("Please fill in all fields.");
      return;
    }

    fetch(`http://localhost:3000/exams/${examId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application.json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        examId,
        numberOfQuestions,
        timeLimit,
        questions,
        
      })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          toast.success("Exam updated successfully!");
          handleCloseModal();
          mutate("http://localhost:3000/exams");
        }
      });
  }

  return (
    <Modal
      show={showModalUpdate}
      onHide={() => handleCloseModal()}
      backdrop="static"
      keyboard={false}
      size='lg'
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Exam</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Exam ID</Form.Label>
            <Form.Control
              type="number"
              placeholder="Exam ID"
              value={examId}
              onChange={(e) => setExamId(Number(e.target.value))}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Number of Questions</Form.Label>
            <Form.Control
              type="number"
              placeholder="Number of Questions"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Time Limit</Form.Label>
            <Form.Control
              type="number"
              placeholder="Time Limit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
            />
          </Form.Group>
          <div className="mb-3">
            {questions.map((question, questionIndex) => (
              <div key={questionIndex}>
                <Form.Group className="mb-3">
                  <Form.Label>Question {questionIndex + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Question ${questionIndex + 1}`}
                    value={question.content}
                    onChange={(e) => {
                      const updatedQuestion = { ...question, content: e.target.value };
                      handleEditQuestion(questionIndex, updatedQuestion);
                    }}
                  />
                </Form.Group>
                <div className="mb-3">
                  {question.answers.map((answer, answerIndex) => (
                    <div key={answerIndex}>
                      <Form.Group className="mb-3">
                        <Form.Label>Answer {answerIndex + 1}</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={`Answer ${answerIndex + 1}`}
                          value={answer.content}
                          onChange={(e) => {
                            const updatedAnswer = { ...answer, content: e.target.value };
                            handleEditAnswer(questionIndex, answerIndex, updatedAnswer);
                          }}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Is Correct"
                          checked={answer.isCorrect}
                          onChange={(e) => {
                            const updatedAnswer = { ...answer, isCorrect: e.target.checked };
                            handleEditAnswer(questionIndex, answerIndex, updatedAnswer);
                          }}
                        />
                      </Form.Group>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleCloseModal()}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleSubmit()}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateModal;

