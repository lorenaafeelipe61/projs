import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Login from './Login';
import { theme } from '../theme';

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock do useAuth
const mockLogin = vi.fn();
vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin,
        isAuthenticated: false,
        user: null,
        logout: vi.fn(),
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <MemoryRouter>
            <ThemeProvider theme={theme}>
                {ui}
            </ThemeProvider>
        </MemoryRouter>
    );
};

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza o formulário de login corretamente', () => {
        renderWithProviders(<Login />);

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    it('chama a função de login com as credenciais corretas', async () => {
        renderWithProviders(<Login />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/senha/i);
        const submitButton = screen.getByRole('button', { name: /entrar/i });

        fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
        fireEvent.change(passwordInput, { target: { value: 'senha123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'teste@exemplo.com',
                password: 'senha123',
            });
        });
    });

    it('exibe mensagem de erro quando o login falha', async () => {
        mockLogin.mockRejectedValueOnce(new Error('Email ou senha inválidos'));
        renderWithProviders(<Login />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/senha/i);
        const submitButton = screen.getByRole('button', { name: /entrar/i });

        fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
        fireEvent.change(passwordInput, { target: { value: 'senha_errada' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Email ou senha inválidos')).toBeInTheDocument();
        });
    });
}); 