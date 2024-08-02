import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GoalForm.css';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Container, Form, Table, Card, Row, Col, ProgressBar, Modal, Button } from 'react-bootstrap';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Add as AddIcon, AccountCircle, ExitToApp as ExitToAppIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

ChartJS.register(ArcElement, Tooltip, Legend);

const GoalForm = ({ onAdd, fetchGoals, fetchForecasts }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [goals, setGoals] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [cumulativeAmounts, setCumulativeAmounts] = useState({});
    const [currentAmount, setCurrentAmount] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onAdd({ name, targetAmount, targetDate });
        const updatedGoals = await fetchGoals();
        setGoals(updatedGoals);
        setName('');
        setTargetAmount('');
        setTargetDate('');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setCurrentAmount(data.accountBalance);
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const getGoalsAndForecasts = async () => {
            const goalsData = await fetchGoals();
            setGoals(goalsData);
            const forecastsData = await fetchForecasts();
            setForecasts(forecastsData);
            const initialCumulativeAmounts = {};
            forecastsData.forEach(forecast => {
                initialCumulativeAmounts[forecast._id] = currentAmount || 0;
            });
            setCumulativeAmounts(initialCumulativeAmounts);
        };

        getGoalsAndForecasts();
    }, [fetchGoals, fetchForecasts]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login', { replace: true });
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handlePay = async (forecastId, allocatedMoney) => {
        if (currentAmount < allocatedMoney) {
            alert('Cannot process transaction: Low balance');
            return;
        }

        setCumulativeAmounts(prevCumulativeAmounts => {
            const newCumulativeAmounts = { ...prevCumulativeAmounts };
            newCumulativeAmounts[forecastId] = (newCumulativeAmounts[forecastId] || 0) + allocatedMoney;
            return newCumulativeAmounts;
        });

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:3000/api/forecasts/update`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ forecastId, allocatedMoney, userId }),
            });
            if (!response.ok) {
                throw new Error('Payment failed');
            }

            const updatedForecast = await response.json();
            setForecasts(prevForecasts =>
                prevForecasts.map(f =>
                    f._id === forecastId ? updatedForecast : f
                )
            );
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const renderForecastChart = (forecast) => {
        const allocatedMoney = forecast.monthlyIncome * (forecast.allocationPercentage / 100);
        const amountReceived = forecast.amountReceived || 0;
        const remainingAmount = forecast.targetAmount - amountReceived;
        const progress = (amountReceived / forecast.targetAmount) * 100;

        const data = {
            labels: ['Amount Received', 'Remaining Amount'],
            datasets: [
                {
                    data: [amountReceived, remainingAmount > 0 ? remainingAmount : 0],
                    backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(192, 75, 75, 1)'],
                    borderColor: ['rgba(75, 192, 192, 1)', 'rgba(192, 75, 75, 1)'],
                    borderWidth: 1,
                },
            ],
        };

        const options = {
            cutout: '70%',
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`
                    }
                },
                legend: {
                    display: false
                },
                datalabels: {
                    display: true,
                    formatter: (value, context) => {
                        if (context.dataIndex === 0) {
                            return `${progress.toFixed(2)}%`;
                        } else {
                            return '';
                        }
                    },
                    color: 'white',
                    font: {
                        size: 18,
                    }
                }
            }
        };

        return (
            <Card className="forecast-chart-container mb-4 shadow-lg">
                <Card.Body>
                    <Card.Title>
                        {forecast.name}
                        <AddIcon onClick={() => handleShowModal(forecast)} />
                    </Card.Title>
                    <Doughnut data={data} options={options} />
                    <ProgressBar now={progress} label={`${progress.toFixed(2)}%`} className="mt-3" animated striped />
                    <Button variant="primary" className="mt-3" onClick={() => handlePay(forecast._id, allocatedMoney)}>
                        Add Monthly Allocation
                    </Button>
                </Card.Body>
            </Card>
        );
    };

    const renderMonthsToAchieveChart = () => {
        const data = forecasts.map(forecast => ({
            x: forecast.name,
            y: parseFloat(forecast.months) || 0
        }));

        return (
            <Card className="shadow-lg mb-4">
                <Card.Body>
                    <Card.Title>Months to Achieve Goal</Card.Title>
                    <VictoryChart
                        domainPadding={{ x: 50, y: 30 }}
                        padding={{ left: 80, right: 80, top: 30, bottom: 50 }}
                        width={600}
                        height={300}
                    >
                        <VictoryAxis
                            style={{ tickLabels: { fontSize: 12, padding: 5, fontWeight: 'bold' } }}
                        />
                        <VictoryAxis
                            dependentAxis
                            style={{ tickLabels: { fontSize: 12, padding: 5, fontWeight: 'bold' } }}
                        />
                        <VictoryLine
                            data={data}
                            x="x"
                            y="y"
                            style={{
                                data: { stroke: "#FF5722" },
                                labels: { fontSize: 12, fontWeight: 'bold' }
                            }}
                        />
                    </VictoryChart>
                </Card.Body>
            </Card>
        );
    };

    const handleShowModal = (forecast) => {
        setModalContent(forecast);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent({});
    };

    return (
        <Container fluid className="goal-container p-4">
            <AppBar position="static" className="app-bar">
                <Toolbar className="toolbar">
                    <IconButton edge="start" color="inherit" onClick={handleBackToDashboard} className="icon-button">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" className="typography">
                        Goal Management
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout} className="icon-button">
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container className="goal-content mt-4">
                <Row>
                    <Col md={6}>
                        <Card className="shadow-lg mb-4">
                            <Card.Body>
                                <Card.Title>
                                    Add New Goal <AddIcon />
                                </Card.Title>
                                <Form onSubmit={handleSubmit} className="goal-form">
                                    <Form.Group className="mb-3" controlId="formGoalName">
                                        <Form.Label>Goal Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formTargetAmount">
                                        <Form.Label>Target Amount</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={targetAmount}
                                            onChange={(e) => setTargetAmount(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formTargetDate">
                                        <Form.Label>Target Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={targetDate}
                                            onChange={(e) => setTargetDate(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button type="submit" variant="primary">Add Goal</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="shadow-lg mb-4">
                            <Card.Body>
                                <Card.Title>Your Goals</Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Goal Name</th>
                                            <th>Target Amount</th>
                                            <th>Target Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {goals.map(goal => (
                                            <tr key={goal._id}>
                                                <td>{goal.name}</td>
                                                <td>${goal.targetAmount}</td>
                                                <td>{new Date(goal.targetDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    {forecasts.map(forecast => (
                        <Col md={6} key={forecast._id}>
                            <Card className="shadow-lg mb-4" onClick={() => handleShowModal(forecast)}>
                                <Card.Body>
                                    <Card.Title>{forecast.name}</Card.Title>
                                    <ProgressBar now={(forecast.amountReceived / forecast.targetAmount) * 100} label={`${((forecast.amountReceived / forecast.targetAmount) * 100).toFixed(2)}%`} animated striped />
                                    <Button variant="info" className="mt-3">View Details</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row>
                    <Col md={12}>
                        {renderMonthsToAchieveChart()}
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{modalContent.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalContent.name && renderForecastChart(modalContent)}
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modalContent.paymentHistory?.map((payment, index) => (
                                <tr key={index}>
                                    <td>${payment.amount}</td>
                                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="additional-info mt-3">
                        <p><strong>Number of Months:</strong> {modalContent.months}</p>
                        <p><strong>Amount Received:</strong> ${modalContent.amountReceived || 0}</p>
                        <p><strong>Amount Remaining:</strong> ${modalContent.targetAmount - (modalContent.amountReceived || 0)}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default GoalForm;
