import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    IconButton,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { PaymentMethod } from '../types';

interface Payment {
    id: number;
    userId: number;
    amount: number;
    description: string;
    status: 'pending' | 'completed' | 'failed';
    paymentMethod: PaymentMethod;
    date: string;
}

const Payments: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [payments, setPayments] = useState<Payment[]>([
        {
            id: 1,
            userId: 1,
            amount: 150.00,
            description: 'Compra na loja',
            status: 'completed',
            paymentMethod: {
                id: 1,
                userId: 1,
                type: 'credit_card',
                details: '**** **** **** 1234',
                isActive: true,
            },
            date: '2024-03-15',
        },
        // Dados de exemplo
    ]);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [formData, setFormData] = useState<Partial<Payment>>({});

    const handleOpen = (payment?: Payment) => {
        if (payment) {
            setSelectedPayment(payment);
            setFormData(payment);
        } else {
            setSelectedPayment(null);
            setFormData({});
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPayment(null);
        setFormData({});
    };

    const handleSubmit = () => {
        if (selectedPayment) {
            // Atualizar pagamento existente
            setPayments(payments.map(payment =>
                payment.id === selectedPayment.id ? { ...payment, ...formData } : payment
            ));
        } else {
            // Adicionar novo pagamento
            const newPayment: Payment = {
                id: payments.length + 1,
                userId: 1, // Temporário, deve vir do contexto de autenticação
                amount: formData.amount || 0,
                description: formData.description || '',
                status: 'pending',
                paymentMethod: formData.paymentMethod || {
                    id: 1,
                    userId: 1,
                    type: 'credit_card',
                    details: '**** **** **** 1234',
                    isActive: true,
                },
                date: new Date().toISOString().split('T')[0],
            };
            setPayments([...payments, newPayment]);
        }
        handleClose();
    };

    const handleDelete = (id: number) => {
        setPayments(payments.filter(payment => payment.id !== id));
    };

    const getStatusColor = (status: Payment['status']) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Pagamentos</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Novo Pagamento
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Data</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Método</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                                <TableCell>{payment.description}</TableCell>
                                <TableCell>
                                    {payment.amount.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </TableCell>
                                <TableCell>{payment.paymentMethod.details}</TableCell>
                                <TableCell>
                                    <Typography
                                        color={getStatusColor(payment.status)}
                                        sx={{ textTransform: 'capitalize' }}
                                    >
                                        {payment.status}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpen(payment)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(payment.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedPayment ? 'Editar Pagamento' : 'Novo Pagamento'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descrição"
                                value={formData.description || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Valor"
                                type="number"
                                value={formData.amount || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, amount: Number(e.target.value) })
                                }
                                InputProps={{
                                    startAdornment: 'R$',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Método de Pagamento</InputLabel>
                                <Select
                                    value={formData.paymentMethod?.id || ''}
                                    label="Método de Pagamento"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            paymentMethod: {
                                                id: Number(e.target.value),
                                                userId: 1,
                                                type: 'credit_card',
                                                details: '**** **** **** 1234',
                                                isActive: true,
                                            },
                                        })
                                    }
                                >
                                    <MenuItem value={1}>Cartão de Crédito (**** 1234)</MenuItem>
                                    <MenuItem value={2}>PIX</MenuItem>
                                    <MenuItem value={3}>Boleto</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {selectedPayment && (
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={formData.status || ''}
                                        label="Status"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                status: e.target.value as Payment['status'],
                                            })
                                        }
                                    >
                                        <MenuItem value="pending">Pendente</MenuItem>
                                        <MenuItem value="completed">Concluído</MenuItem>
                                        <MenuItem value="failed">Falhou</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedPayment ? 'Salvar' : 'Criar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Payments; 