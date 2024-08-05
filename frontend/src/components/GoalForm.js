import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GoalForm.css';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryPie } from 'victory';
import { Container, Row, Col, Form, Table, Card, Modal, Button, ProgressBar } from 'react-bootstrap';
import { AppBar, Toolbar, Typography, IconButton, TextField, Card as MUICard, CardContent, CardActions } from '@mui/material';
import { Add as AddIcon, ExitToApp as ExitToAppIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const GoalForm = ({ onAdd, fetchGoals, fetchForecasts }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [category, setCategory] = useState(''); // New field
    const [description, setDescription] = useState(''); // New field
    const [goals, setGoals] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [cumulativeAmounts, setCumulativeAmounts] = useState({});
    const [currentAmount, setCurrentAmount] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const navigate = useNavigate();

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onAdd({ name, targetAmount, targetDate, category, description });
        const updatedGoals = await fetchGoals();
        setGoals(updatedGoals);
        setName('');
        setTargetAmount('');
        setTargetDate('');
        setCategory('');
        setDescription('');
    };

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

        return (
            <div className="forecast-item">
                <MUICard className="forecast-chart-container mb-4 shadow-lg">
                    <CardContent>
                        <Typography variant="h6" className="d-flex justify-content-between align-items-center">
                            {forecast.name}
                            <IconButton size="small" onClick={() => handleShowModal(forecast)} className="modal-icon">
                                <AddIcon />
                            </IconButton>
                        </Typography>
                        <VictoryPie
                            data={[
                                { x: "Received", y: amountReceived },
                                { x: "Remaining", y: remainingAmount > 0 ? remainingAmount : 0 },
                            ]}
                            colorScale={["#4CAF50", "#FF5252"]}
                            innerRadius={50}
                            labelRadius={80}
                            style={{ labels: { fontSize: 12, fill: "white" } }}
                        />
                        <ProgressBar now={progress} label={`${progress.toFixed(2)}%`} className="mt-3" animated striped />
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" color="primary" fullWidth onClick={() => handlePay(forecast._id, allocatedMoney)}>
                            Add Monthly Allocation
                        </Button>
                    </CardActions>
                </MUICard>
                {modalContent._id === forecast._id && (
                    <MUICard className="forecast-detail-container shadow-lg">
                        <CardContent>
                            <Typography variant="h6">Forecast Details</Typography>
                            <Table striped bordered hover className="mt-3">
                                <thead>
                                    <tr>
                                        <th>Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {forecast.paymentHistory?.map((payment, index) => (
                                        <tr key={index}>
                                            <td>${payment.amount}</td>
                                            <td>{new Date(payment.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <div className="additional-info mt-3">
                                <p><strong>Number of Months:</strong> {forecast.months}</p>
                                <p><strong>Amount Received:</strong> ${forecast.amountReceived || 0}</p>
                                <p><strong>Amount Remaining:</strong> ${forecast.targetAmount - (forecast.amountReceived || 0)}</p>
                            </div>
                        </CardContent>
                    </MUICard>
                )}
            </div>
        );
    };

    const renderMonthsToAchieveChart = () => {
        const data = forecasts.map(forecast => ({
            x: forecast.name,
            y: parseFloat(forecast.months) || 0
        }));

        return (
            <MUICard className="shadow-lg mb-4">
                <CardContent>
                    <Typography variant="h6">Months to Achieve Goal</Typography>
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
                </CardContent>
            </MUICard>
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
            <video autoPlay loop muted className="background-video">
                <source src="/path/to/your/video.mp4" type="video/mp4" />
            </video>

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
                    <Col md={12}>
                        <Typography variant="h5" className="section-title">Add New Goal</Typography>
                    </Col>
                    <Col md={6}>
                        <MUICard className="shadow-lg mb-4 goal-card">
                            <CardContent>
                                <Form onSubmit={handleSubmit} className="goal-form">
                                    <TextField
                                        label="Goal Name"
                                        variant="outlined"
                                        fullWidth
                                        className="mb-3"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <TextField
                                        label="Category"
                                        variant="outlined"
                                        fullWidth
                                        className="mb-3"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    />
                                    <TextField
                                        label="Target Amount"
                                        variant="outlined"
                                        type="number"
                                        fullWidth
                                        className="mb-3"
                                        value={targetAmount}
                                        onChange={(e) => setTargetAmount(e.target.value)}
                                        required
                                    />
                                    <TextField
                                        label="Target Date"
                                        variant="outlined"
                                        type="date"
                                        fullWidth
                                        className="mb-3"
                                        value={targetDate}
                                        onChange={(e) => setTargetDate(e.target.value)}
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <TextField
                                        label="Description"
                                        variant="outlined"
                                        fullWidth
                                        className="mb-3"
                                        multiline
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <Button type="submit" variant="contained" color="primary" fullWidth>Add Goal</Button>
                                </Form>
                            </CardContent>
                        </MUICard>
                    </Col>
                    <Col md={6}>
                        <MUICard className="shadow-lg mb-4 goal-card">
                            <CardContent>
                                <Typography variant="h6">Your Goals</Typography>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Goal Name</th>
                                            <th>Category</th>
                                            <th>Target Amount</th>
                                            <th>Target Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {goals.map(goal => (
                                            <tr key={goal._id}>
                                                <td>{goal.name}</td>
                                                <td>{goal.category}</td>
                                                <td>${goal.targetAmount}</td>
                                                <td>{new Date(goal.targetDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </CardContent>
                        </MUICard>
                    </Col>
                </Row>

                <hr className="section-divider" />

                <Row>
                    <Col md={12}>
                        <Typography variant="h5" className="section-title">Your Forecasts</Typography>
                    </Col>
                    {forecasts.map(forecast => (
                        <Col md={12} key={forecast._id}>
                            {renderForecastChart(forecast)}
                        </Col>
                    ))}
                </Row>

                <Row>
                    <Col md={12}>
                        {renderMonthsToAchieveChart()}
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default GoalForm;
