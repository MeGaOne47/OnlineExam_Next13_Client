'use client'
/* eslint-disable react/jsx-key */
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import CreateModal from './create.modal';
import { useEffect, useState } from 'react';
import UpdateModal from './update.modalExam';
import Link from "next/link";
import { toast } from 'react-toastify';
import { mutate } from "swr"

interface IProps {
  exams: IExam[]
}
function AppTable(props: IProps) {
  const {exams} = props;

  const [exam, setExam] = useState<IExam | null>(null);
  const [showModalCreate, setShowModalCreate] = useState<boolean>(false); 
  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [viewedExam, setViewedExam] = useState<IExam | null>(null);
  const [selectedExam, setSelectedExam] = useState<IExam | null>();

  const handleViewExam = (id: number) => {
      fetch(`http://localhost:3000/exams/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
          }).then(res => res.json())
          .then(res => {
              if (res) {
                  toast.success("View blog succeed !");
                  setViewedExam(res);
                  setShowViewModal(true);
                  mutate("http://localhost:3000/exams");
              } 
          });
  }

  return (
    <>
      <div
          className='mb-3'
          style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Table Exams</h3>
          <Button variant="secondary"
              onClick={() => setShowModalCreate(true)}
          >Add New</Button>
      </div>     
      <Table bordered hover size="sm">
        <thead>
          <tr>
            <th>examId</th>
            <th>numberOfQuestions</th>
            <th>timeLimit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {exams?.map(item => {
              return (
                <tr key={item.examId}>
                  <td>{item.examId}</td> 
                  <td>{item.numberOfQuestions}</td>  
                  <td>{item.timeLimit}</td>  
                  <td>
                    <Button variant='primary' className='mx-3' >
                        <Link
                            href={`/exams/${item.examId}`}
                            style={{ color: 'white', textDecoration: 'none' }}
                            onClick={() => {
                              handleViewExam(item.examId);                             
                          }}
                        >View</Link>
                    </Button>
                    <Button variant='warning' className='mx-3'
                        onClick={() => {
                          setExam(item);
                          setShowModalUpdate(true);
                      }}
                    >Edit</Button>
                    <Button variant='danger' className='mx-3' >
                        <Link
                            href={`/ExamJoin/${item.examId}`}
                            style={{ color: 'white', textDecoration: 'none' }}
                            onClick={() => {
                              handleViewExam(item.examId);                             
                          }}
                        >Join</Link>
                    </Button>
                  </td>
                </tr>
              )
          })}
        </tbody>
      </Table>

      {selectedExam && (
        <div>
          <h4>Questions for Exam ID: {selectedExam.examId}</h4>
          <ul>
            {selectedExam.questions.map((question) => (
              <li key={question.questionId}>
                {question.content}
                <ul>
                  {question.answers.map((answer) => (
                    <li key={answer.answerId}>
                      {answer.content} ({answer.isCorrect ? "Correct" : "Incorrect"})
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <CreateModal
          showModalCreate={showModalCreate}
          setShowModalCreate={setShowModalCreate}
      />

      <UpdateModal
          showModalUpdate={showModalUpdate}
          setShowModalUpdate={setShowModalUpdate}
          exam={exam}
          setExam={setExam}
      />
      
    </>

  );
}

export default AppTable;