import styled from 'styled-components';

export const BackLink = styled.a`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[2]}px;
    margin-bottom: ${({ theme }) => theme.space[3]}px;
    color: ${({ theme }) => theme.colors.blue7};
    text-decoration: none;

    &:hover {
        color: ${({ theme }) => theme.colors.blue9};
    }
`;

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
    line-height: ${({ theme }) => theme.lineHeights.base};
`;

export const FilterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    align-items: end;
    gap: ${({ theme }) => theme.space[4]}px;

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 560px) {
        grid-template-columns: 1fr;
    }
`;

export const FilterField = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space[1]}px;
`;

export const FilterLabel = styled.label`
    color: ${({ theme }) => theme.colors.slate9};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const FilterHint = styled.p`
    margin: ${({ theme }) => theme.space[3]}px 0 0;
    color: ${({ theme }) => theme.colors.slate8};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    line-height: ${({ theme }) => theme.lineHeights.base};
`;

export const FilterDatePickerContainer = styled.div`
    width: 100%;

    .ant-picker {
        width: 100%;
    }
`;

export const ReportActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.space[3]}px;
    margin-bottom: ${({ theme }) => theme.space[4]}px;

    @media (max-width: 560px) {
        align-items: flex-start;
        flex-direction: column;
    }
`;

export const ReportSectionTitle = styled.h2`
    margin: 0;
    color: ${({ theme }) => theme.colors.slate10};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const ExtractDetails = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${({ theme }) => theme.space[4]}px;

    @media (max-width: 680px) {
        grid-template-columns: 1fr;
    }
`;

export const DetailGroup = styled.section`
    h3 {
        margin: 0 0 ${({ theme }) => theme.space[2]}px;
        color: ${({ theme }) => theme.colors.slate9};
        font-size: ${({ theme }) => theme.fontSizes.md};
    }

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    li {
        display: flex;
        justify-content: space-between;
        gap: ${({ theme }) => theme.space[3]}px;
        padding: ${({ theme }) => theme.space[1]}px 0;
        border-bottom: 1px solid ${({ theme }) => theme.colors.slate3};
        color: ${({ theme }) => theme.colors.slate8};
    }
`;

export const SummaryGrid = styled.section`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${({ theme }) => theme.space[4]}px;
    margin: ${({ theme }) => theme.space[4]}px 0;

    @media (max-width: 680px) {
        grid-template-columns: 1fr;
    }
`;

export const SummaryCard = styled.div`
    padding: ${({ theme }) => theme.space[4]}px;
    border: 1px solid ${({ theme }) => theme.colors.slate4};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.white};
`;

export const SummaryLabel = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.colors.slate8};
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const SummaryValue = styled.p`
    margin: ${({ theme }) => theme.space[2]}px 0 0;
    color: ${({ theme }) => theme.colors.slate10};
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const PeriodNote = styled.p`
    margin: ${({ theme }) => theme.space[4]}px 0;
    color: ${({ theme }) => theme.colors.slate8};
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;
