'use client'
/* eslint-disable react/jsx-key */
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import Button from 'react-bootstrap/esm/Button';
import Link from 'next/link';

interface IProps {
  exams: IExam[]
}
function AppTable(props: IProps) {
  const {exams} = props;
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [viewedExam, setViewedExam] = useState<IExam | null>(null);
 

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
    <h1>Statistical</h1>,
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
                            href={`/statistical/${item.examId}`}
                            style={{ color: 'white', textDecoration: 'none' }}
                            onClick={() => {
                              handleViewExam(item.examId);                             
                          }}
                        >View</Link>
                    </Button>
                  </td>  
                </tr>
              )
          })}
        </tbody>
      </Table>
    </>
  );
}

export default AppTable;