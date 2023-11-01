"use client"
import AppTable from '@/components/app.tableStatistical';
import { useEffect, useState } from 'react';

const Exams = () => {
  const userJSON = localStorage.getItem('user');
  const user = userJSON ? JSON.parse(userJSON) : null;
  const userToken = user ? user.access_token : null;

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userToken) {
      // Redirect or handle unauthorized access here
      // For example, you can redirect the user to the login page
      return;
    }

    fetch('http://localhost:3000/exams', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log('Dữ liệu statisticals: ',data)
      })
      .catch((error) => {
        setError(error);
      });
  }, [userToken]);

  if (error) return <div>Error loading data.</div>;
  if (data.length === 0) return <div>Loading data...</div>;

  return (
    <div>
      <AppTable exams={data} />
    </div>
  );
};

export default Exams;