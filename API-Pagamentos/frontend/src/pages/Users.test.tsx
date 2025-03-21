import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Users from './Users';
import { theme } from '../theme';
import { userService } from '../services/api';

// Mock do Layout
vi.mock('../components/Layout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock do userService
vi.mock('../services/api', () => ({
    userService: {
        getAll: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
    },
}));

const mockUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-00',
        phone: '(11) 99999-9999',
    },
    {
        id: 2,
        name: 'Jane Doe',
        email: 'jane@example.com',
        cpf: '987.654.321-00',
        phone: '(11) 88888-8888',
    },
];

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <MemoryRouter>
            <ThemeProvider theme={theme}>
                {ui}
            </ThemeProvider>
        </MemoryRouter>
    );
};

describe('Users Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (userService.getAll as any).mockResolvedValue({ success: true, data: mockUsers });
    });

    it('renderiza o título e botão de novo usuário', async () => {
        renderWithProviders(<Users />);

        expect(screen.getByText('Usuários')).toBeInTheDocument();
        expect(screen.getByText('Novo Usuário')).toBeInTheDocument();
    });

    it('carrega e exibe a lista de usuários', async () => {
        renderWithProviders(<Users />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('jane@example.com')).toBeInTheDocument();
        });
    });

    it('abre o diálogo de novo usuário', async () => {
        renderWithProviders(<Users />);

        fireEvent.click(screen.getByText('Novo Usuário'));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Novo Usuário' })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /nome/i })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /cpf/i })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /telefone/i })).toBeInTheDocument();
        });
    });

    it('cria um novo usuário', async () => {
        (userService.create as any).mockResolvedValue({ success: true });
        renderWithProviders(<Users />);

        // Abre o diálogo
        fireEvent.click(screen.getByText('Novo Usuário'));

        await waitFor(() => {
            // Preenche o formulário
            fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), { target: { value: 'New User' } });
            fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'new@example.com' } });
            fireEvent.change(screen.getByRole('textbox', { name: /cpf/i }), { target: { value: '111.222.333-44' } });
            fireEvent.change(screen.getByRole('textbox', { name: /telefone/i }), { target: { value: '(11) 77777-7777' } });
        });

        // Submete o formulário
        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(userService.create).toHaveBeenCalledWith({
                name: 'New User',
                email: 'new@example.com',
                cpf: '111.222.333-44',
                phone: '(11) 77777-7777',
            });
        });
    });

    it('exibe mensagem de erro quando falha ao carregar usuários', async () => {
        (userService.getAll as any).mockRejectedValue(new Error('Erro ao carregar'));
        renderWithProviders(<Users />);

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar usuários')).toBeInTheDocument();
        });
    });

    it('deleta um usuário após confirmação', async () => {
        (userService.delete as any).mockResolvedValue({ success: true });
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        renderWithProviders(<Users />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByTestId('DeleteIcon');
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(userService.delete).toHaveBeenCalledWith(1);
        });
    });
}); 