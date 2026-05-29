import styled from 'styled-components';

export const LayoutContainer = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.slate1};
`;

export const MainContent = styled.main`
    flex: 1;
    overflow-y: auto;
    padding: ${({ theme }) => theme.space[5]}px;

    /* Barra de rolagem customizada */
    &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.colors.slate4};
        border-radius: ${({ theme }) => theme.radii.sm};
    }
`;
