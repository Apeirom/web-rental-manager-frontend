import styled from 'styled-components';

export const PageHeader = styled.header`
    margin-bottom: ${({ theme }) => theme.space[5]}px;
`;

export const Title = styled.h1`
    margin: 0;
    color: ${({ theme }) => theme.colors.slate10};
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const Description = styled.p`
    margin: ${({ theme }) => theme.space[2]}px 0 0;
    color: ${({ theme }) => theme.colors.slate8};
    font-size: ${({ theme }) => theme.fontSizes.md};
`;

export const ReportList = styled.section`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${({ theme }) => theme.space[4]}px;
`;

export const ReportLink = styled.a`
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space[3]}px;
    padding: ${({ theme }) => theme.space[4]}px;
    border: 1px solid ${({ theme }) => theme.colors.slate4};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.white};
    color: inherit;
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.fast};

    &:hover {
        border-color: ${({ theme }) => theme.colors.blue5};
        box-shadow: ${({ theme }) => theme.shadows.sm};
        color: inherit;
    }

    > span {
        display: flex;
        align-items: center;
        gap: ${({ theme }) => theme.space[2]}px;
        flex-shrink: 0;
        color: ${({ theme }) => theme.colors.blue7};
        font-size: ${({ theme }) => theme.fontSizes.sm};
        font-weight: ${({ theme }) => theme.fontWeights.medium};
    }
`;

export const ReportIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.blue1};
    color: ${({ theme }) => theme.colors.blue7};
    font-size: ${({ theme }) => theme.fontSizes.lg};
`;

export const ReportInfo = styled.div`
    flex: 1;

    h2 {
        margin: 0;
        color: ${({ theme }) => theme.colors.slate10};
        font-size: ${({ theme }) => theme.fontSizes.lg};
    }

    p {
        margin: ${({ theme }) => theme.space[1]}px 0 0;
        color: ${({ theme }) => theme.colors.slate8};
        line-height: ${({ theme }) => theme.lineHeights.base};
    }
`;
