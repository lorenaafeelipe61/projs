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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { User } from '../types';
import { userService } from '../services/api';

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cpf: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await userService.getAll();
            if (response.success && response.data) {
                setUsers(response.data);
            }
        } catch (err) {
            setError('Erro ao carregar usuários');
        }
    };

    const handleOpen = (user?: User) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                phone: user.phone,
            });
        } else {
            setSelectedUser(null);
            setFormData({
                name: '',
                email: '',
                cpf: '',
                phone: '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
        setFormData({
            name: '',
            email: '',
            cpf: '',
            phone: '',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await userService.create(formData);
            if (response.success) {
                handleClose();
                loadUsers();
            } else {
                setError(response.error || 'Erro ao criar usuário');
            }
        } catch (err) {
            setError('Erro ao criar usuário');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                const response = await userService.delete(id);
                if (response.success) {
                    loadUsers();
                } else {
                    setError(response.error || 'Erro ao deletar usuário');
                }
            } catch (err) {
                setError('Erro ao deletar usuário');
            }
        }
    };

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Usuários
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                    >
                        Novo Usuário
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
                                <TableCell>Nome</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>CPF</TableCell>
                                <TableCell>Telefone</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.cpf}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpen(user)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(user.id)}
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
                        {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="name"
                                label="Nome"
                                fullWidth
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                margin="dense"
                                name="email"
                                label="Email"
                                type="email"
                                fullWidth
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                margin="dense"
                                name="cpf"
                                label="CPF"
                                fullWidth
                                value={formData.cpf}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                margin="dense"
                                name="phone"
                                label="Telefone"
                                fullWidth
                                value={formData.phone}
                                onChange={handleChange}
                                required
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

export default Users; 