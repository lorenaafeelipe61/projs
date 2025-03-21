import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Box,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { CreditCard } from '../types';
import { creditCardService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Cards: React.FC = () => {
    const { user } = useAuth();
    const [cards, setCards] = useState<CreditCard[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
    const [formData, setFormData] = useState({
        number: '',
        holderName: '',
        expiryDate: '',
        cvv: '',
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            loadCards();
        }
    }, [user]);

    const loadCards = async () => {
        if (!user) return;
        try {
            const response = await creditCardService.getAll(user.id);
            if (response.success && response.data) {
                setCards(response.data);
            }
        } catch (err) {
            setError('Erro ao carregar cartões');
        }
    };

    const handleOpen = (card?: CreditCard) => {
        if (card) {
            setSelectedCard(card);
            setFormData({
                number: card.number,
                holderName: card.holderName,
                expiryDate: card.expiryDate,
                cvv: card.cvv,
                isActive: card.isActive,
            });
        } else {
            setSelectedCard(null);
            setFormData({
                number: '',
                holderName: '',
                expiryDate: '',
                cvv: '',
                isActive: true,
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCard(null);
        setFormData({
            number: '',
            holderName: '',
            expiryDate: '',
            cvv: '',
            isActive: true,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError('');

        try {
            const response = await creditCardService.create({
                ...formData,
                userId: user.id,
            });
            if (response.success) {
                handleClose();
                loadCards();
            } else {
                setError(response.error || 'Erro ao criar cartão');
            }
        } catch (err) {
            setError('Erro ao criar cartão');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'isActive' ? checked : value,
        }));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este cartão?')) {
            try {
                const response = await creditCardService.delete(id);
                if (response.success) {
                    loadCards();
                } else {
                    setError(response.error || 'Erro ao deletar cartão');
                }
            } catch (err) {
                setError('Erro ao deletar cartão');
            }
        }
    };

    const formatCardNumber = (number: string) => {
        return number.replace(/(\d{4})/g, '$1 ').trim();
    };

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Cartões de Crédito
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                    >
                        Novo Cartão
                    </Button>
                </Box>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Número</TableCell>
                                <TableCell>Titular</TableCell>
                                <TableCell>Validade</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cards.map((card) => (
                                <TableRow key={card.id}>
                                    <TableCell>{formatCardNumber(card.number)}</TableCell>
                                    <TableCell>{card.holderName}</TableCell>
                                    <TableCell>{card.expiryDate}</TableCell>
                                    <TableCell>
                                        {card.isActive ? 'Ativo' : 'Inativo'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpen(card)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(card.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
                        {selectedCard ? 'Editar Cartão' : 'Novo Cartão'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="number"
                                label="Número do Cartão"
                                fullWidth
                                value={formData.number}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                margin="dense"
                                name="holderName"
                                label="Nome do Titular"
                                fullWidth
                                value={formData.holderName}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                margin="dense"
                                name="expiryDate"
                                label="Data de Validade"
                                fullWidth
                                value={formData.expiryDate}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                margin="dense"
                                name="cvv"
                                label="CVV"
                                fullWidth
                                value={formData.cvv}
                                onChange={handleChange}
                                required
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        name="isActive"
                                    />
                                }
                                label="Ativo"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancelar</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Container>
        </Layout>
    );
};

export default Cards; 