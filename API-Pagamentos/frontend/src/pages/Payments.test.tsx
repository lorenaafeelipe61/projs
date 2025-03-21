import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Payments from './Payments';
import { theme } from '../theme';
import { AuthContext } from '../contexts/AuthContext';

// Mock do Layout
vi.mock('../components/Layout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    cpf: '123.456.789-00',
    phone: '(11) 99999-9999',
};

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <MemoryRouter>
            <AuthContext.Provider value={{
                user: mockUser,
                login: vi.fn(),
                logout: vi.fn(),
                isAuthenticated: true
            }}>
                <ThemeProvider theme={theme}>
                    {ui}
                </ThemeProvider>
            </AuthContext.Provider>
        </MemoryRouter>
    );
};

describe('Payments Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza o título e botão de novo pagamento', () => {
        renderWithProviders(<Payments />);

        expect(screen.getByText('Pagamentos')).toBeInTheDocument();
        expect(screen.getByText('Novo Pagamento')).toBeInTheDocument();
    });

    it('renderiza a tabela com as colunas corretas', () => {
        renderWithProviders(<Payments />);

        expect(screen.getByText('Data')).toBeInTheDocument();
        expect(screen.getByText('Descrição')).toBeInTheDocument();
        expect(screen.getByText('Valor')).toBeInTheDocument();
        expect(screen.getByText('Método')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Ações')).toBeInTheDocument();
    });

    it('exibe os dados do pagamento corretamente', () => {
        renderWithProviders(<Payments />);

        expect(screen.getByText('Compra na loja')).toBeInTheDocument();
        expect(screen.getByText('R$ 150,00')).toBeInTheDocument();
        expect(screen.getByText('**** **** **** 1234')).toBeInTheDocument();
        expect(screen.getByText('completed')).toBeInTheDocument();
    });

    it('abre o diálogo de novo pagamento', async () => {
        renderWithProviders(<Payments />);

        fireEvent.click(screen.getByText('Novo Pagamento'));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Novo Pagamento' })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /descrição/i })).toBeInTheDocument();
            expect(screen.getByRole('spinbutton', { name: /valor/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /método de pagamento/i })).toBeInTheDocument();
        });
    });

    it('cria um novo pagamento', async () => {
        renderWithProviders(<Payments />);

        // Abre o diálogo
        fireEvent.click(screen.getByText('Novo Pagamento'));

        await waitFor(() => {
            // Preenche o formulário
            fireEvent.change(screen.getByRole('textbox', { name: /descrição/i }), { target: { value: 'Nova compra' } });
            fireEvent.change(screen.getByRole('spinbutton', { name: /valor/i }), { target: { value: '200' } });
            fireEvent.mouseDown(screen.getByRole('button', { name: /método de pagamento/i }));
        });

        // Seleciona o método de pagamento
        const listbox = screen.getByRole('listbox');
        fireEvent.click(screen.getByRole('option', { name: /cartão de crédito/i }));

        // Submete o formulário
        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(screen.getByText('Nova compra')).toBeInTheDocument();
            expect(screen.getByText('R$ 200,00')).toBeInTheDocument();
        });
    });

    it('deleta um pagamento', async () => {
        renderWithProviders(<Payments />);

        const initialPaymentText = 'Compra na loja';
        expect(screen.getByText(initialPaymentText)).toBeInTheDocument();

        const deleteButtons = screen.getAllByTestId('DeleteIcon');
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(screen.queryByText(initialPaymentText)).not.toBeInTheDocument();
        });
    });

    it('edita um pagamento existente', async () => {
        renderWithProviders(<Payments />);

        // Abre o diálogo de edição
        const editButtons = screen.getAllByTestId('EditIcon');
        fireEvent.click(editButtons[0]);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Editar Pagamento' })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /descrição/i })).toHaveValue('Compra na loja');
            expect(screen.getByRole('spinbutton', { name: /valor/i })).toHaveValue(150);
        });

        // Modifica os dados
        fireEvent.change(screen.getByRole('textbox', { name: /descrição/i }), { target: { value: 'Compra modificada' } });
        fireEvent.change(screen.getByRole('spinbutton', { name: /valor/i }), { target: { value: '300' } });

        // Salva as alterações
        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(screen.getByText('Compra modificada')).toBeInTheDocument();
            expect(screen.getByText('R$ 300,00')).toBeInTheDocument();
        });
    });
}); 