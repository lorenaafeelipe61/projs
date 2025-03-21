import React from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import {
    People as PeopleIcon,
    CreditCard as CreditCardIcon,
    Payment as PaymentIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
    const stats = [
        { title: 'Usuários', value: 0, icon: <PeopleIcon /> },
        { title: 'Cartões', value: 0, icon: <CreditCardIcon /> },
        { title: 'Pagamentos', value: 0, icon: <PaymentIcon /> },
    ];

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Título */}
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Dashboard
                        </Typography>
                    </Grid>

                    {/* Cards de Resumo */}
                    {stats.map((stat) => (
                        <Grid item xs={12} sm={6} md={4} key={stat.title}>
                            <Card>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                mr: 2,
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>
                                        <Typography variant="h6" component="div">
                                            {stat.title}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4" component="div">
                                        {stat.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                    {/* Gráficos e Tabelas */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Atividades Recentes
                            </Typography>
                            <Typography color="text.secondary">
                                Nenhuma atividade recente
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};

export default Dashboard; 