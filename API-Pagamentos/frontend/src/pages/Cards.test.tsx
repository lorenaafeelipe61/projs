import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Cards from './Cards';
import { theme } from '../theme';
import { creditCardService } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

// Mock do Layout
vi.mock('../components/Layout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock do creditCardService
vi.mock('../services/api', () => ({
    creditCardService: {
        getAll: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
    },
}));

const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
};

const mockCards = [
    {
        id: 1,
        number: '4111111111111111',
        holderName: 'John Doe',
        expiryDate: '12/25',
        cvv: '123',
        isActive: true,
        userId: 1,
    },
    {
        id: 2,
        number: '5555555555554444',
        holderName: 'Jane Doe',
        expiryDate: '01/26',
        cvv: '456',
        isActive: false,
        userId: 1,
    },
];

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <MemoryRouter>
            <AuthContext.Provider value={{ user: mockUser, login: vi.fn(), logout: vi.fn() }}>
                <ThemeProvider theme={theme}>
                    {ui}
                </ThemeProvider>
            </AuthContext.Provider>
        </MemoryRouter>
    );
};

describe('Cards Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (creditCardService.getAll as any).mockResolvedValue({ success: true, data: mockCards });
    });

    it('renderiza o título e botão de novo cartão', async () => {
        renderWithProviders(<Cards />);

        expect(screen.getByText('Cartões de Crédito')).toBeInTheDocument();
        expect(screen.getByText('Novo Cartão')).toBeInTheDocument();
    });

    it('carrega e exibe a lista de cartões', async () => {
        renderWithProviders(<Cards />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('4111 1111 1111 1111')).toBeInTheDocument();
            expect(screen.getByText('12/25')).toBeInTheDocument();
            expect(screen.getByText('Ativo')).toBeInTheDocument();
        });
    });

    it('abre o diálogo de novo cartão', async () => {
        renderWithProviders(<Cards />);

        fireEvent.click(screen.getByText('Novo Cartão'));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Novo Cartão' })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /número do cartão/i })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /nome do titular/i })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /data de validade/i })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /cvv/i })).toBeInTheDocument();
        });
    });

    it('cria um novo cartão', async () => {
        (creditCardService.create as any).mockResolvedValue({ success: true });
        renderWithProviders(<Cards />);

        // Abre o diálogo
        fireEvent.click(screen.getByText('Novo Cartão'));

        await waitFor(() => {
            // Preenche o formulário
            fireEvent.change(screen.getByRole('textbox', { name: /número do cartão/i }), { target: { value: '4111111111111111' } });
            fireEvent.change(screen.getByRole('textbox', { name: /nome do titular/i }), { target: { value: 'New Card Holder' } });
            fireEvent.change(screen.getByRole('textbox', { name: /data de validade/i }), { target: { value: '12/25' } });
            fireEvent.change(screen.getByRole('textbox', { name: /cvv/i }), { target: { value: '123' } });
        });

        // Submete o formulário
        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(creditCardService.create).toHaveBeenCalledWith({
                number: '4111111111111111',
                holderName: 'New Card Holder',
                expiryDate: '12/25',
                cvv: '123',
                isActive: true,
                userId: 1,
            });
        });
    });

    it('exibe mensagem de erro quando falha ao carregar cartões', async () => {
        (creditCardService.getAll as any).mockRejectedValue(new Error('Erro ao carregar'));
        renderWithProviders(<Cards />);

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar cartões')).toBeInTheDocument();
        });
    });

    it('deleta um cartão após confirmação', async () => {
        (creditCardService.delete as any).mockResolvedValue({ success: true });
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        renderWithProviders(<Cards />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByTestId('DeleteIcon');
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(creditCardService.delete).toHaveBeenCalledWith(1);
        });
    });
}); 