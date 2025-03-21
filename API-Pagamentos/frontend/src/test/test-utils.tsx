import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../contexts/AuthContext';
import { theme } from '../theme';

function render(ui: React.ReactElement, { route = '/', ...renderOptions } = {}) {
    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <MemoryRouter initialEntries={[route]}>
                <ThemeProvider theme={theme}>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ThemeProvider>
            </MemoryRouter>
        );
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export tudo
export * from '@testing-library/react';
// sobrescreve o método render
export { render }; 