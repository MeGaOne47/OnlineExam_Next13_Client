/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { Button, Card, ListGroup } from "react-bootstrap";
import useSWR, { Fetcher } from 'swr'

const ViewDetailStatistical = ({ params }: { params: { id: string } }) => {
    const fetcher: Fetcher<ITatistical, string> = (url: string) => fetch(url)
        .then((res) => res.json());

    const { data, error, isLoading } = useSWR(
        `http://localhost:3000/exams/detail/${params.id}`,
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
    console.log('data:', data)

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', background: '#f0f0f0' }}>
            <Card style={{ border: '2px solid black', width: '50%', padding: '20px', background: '#ffffff', margin: '20px' }}>
                <Card.Header className="text-center" style={{ background: '#f39237', color: 'white', padding: '10px' }}>View detail statistical = {params.id}</Card.Header>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        <Card.Body>
                            <Card.Text style={{ margin: '10px' }}>
                                Số người thi: {data?.theNumberOfUser}
                            </Card.Text>
                            <Card.Text style={{ margin: '10px' }}>
                                Điểm cao nhất: {data?.theHigestScore}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className="text-muted" style={{ background: '#f39237', color: 'white', padding: '10px' }}>Điểm trung bình: {data?.averageScore}</Card.Footer>
                    </div>
                )}
            </Card>
        </div>
    )
    
    
}

export default ViewDetailStatistical;
