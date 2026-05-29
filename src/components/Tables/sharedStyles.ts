import styled from 'styled-components';

export const TableContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: ${({ theme }) => theme.space[4]}px;
    box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const Toolbar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.space[4]}px;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.space[3]}px;
`;

export const FiltersArea = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[3]}px;
    flex-wrap: wrap;
`;
