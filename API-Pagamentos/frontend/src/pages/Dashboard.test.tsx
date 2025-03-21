import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Dashboard from './Dashboard';
import { theme } from '../theme';

// Mock do Layout
vi.mock('../components/Layout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock do useAuth
vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: true,
        user: { name: 'Test User' },
        logout: vi.fn(),
    }),
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

describe('Dashboard Component', () => {
    it('renderiza o título do dashboard', () => {
        renderWithProviders(<Dashboard />);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renderiza os cards de estatísticas', () => {
        renderWithProviders(<Dashboard />);

        expect(screen.getByText('Usuários')).toBeInTheDocument();
        expect(screen.getByText('Cartões')).toBeInTheDocument();
        expect(screen.getByText('Pagamentos')).toBeInTheDocument();
    });

    it('renderiza a seção de atividades recentes', () => {
        renderWithProviders(<Dashboard />);

        expect(screen.getByText('Atividades Recentes')).toBeInTheDocument();
        expect(screen.getByText('Nenhuma atividade recente')).toBeInTheDocument();
    });

    it('renderiza os valores iniciais como zero', () => {
        renderWithProviders(<Dashboard />);

        const zeros = screen.getAllByText('0');
        expect(zeros).toHaveLength(3); // Um zero para cada card
    });
}); 