import styled from 'styled-components';

export const SummaryContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.slate1};
    border: 1px solid ${({ theme }) => theme.colors.slate4};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: ${({ theme }) => theme.space[3]}px;
    margin-bottom: ${({ theme }) => theme.space[4]}px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        color: ${({ theme }) => theme.colors.slate11};
        margin-bottom: 4px;
        display: block;
    }

    .value {
        font-size: ${({ theme }) => theme.fontSizes.md};
        font-weight: ${({ theme }) => theme.fontWeights.bold};
        color: ${({ theme }) => theme.colors.slate12};
    }

    .target-amount {
        color: ${({ theme }) => theme.colors.green9};
        font-size: ${({ theme }) => theme.fontSizes.lg};
    }
`;

export const CandidateCard = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.space[3]}px;
    border: 1px solid ${({ theme }) => theme.colors.slate5};
    border-radius: ${({ theme }) => theme.radii.md};
    margin-bottom: ${({ theme }) => theme.space[3]}px;
    transition: all 0.2s ease-in-out;

    &:hover {
        border-color: ${({ theme }) => theme.colors.blue6};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .date-info {
        display: flex;
        flex-direction: column;

        small {
            color: ${({ theme }) => theme.colors.slate10};
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.5px;
        }

        strong {
            font-size: ${({ theme }) => theme.fontSizes.md};
            color: ${({ theme }) => theme.colors.slate12};
        }
    }

    .amount-info {
        font-size: ${({ theme }) => theme.fontSizes.md};
        font-weight: 600;
        color: ${({ theme }) => theme.colors.slate12};
    }
`;

export const EmptyStateContainer = styled.div`
    text-align: center;
    padding: ${({ theme }) => theme.space[5]}px;
    color: ${({ theme }) => theme.colors.slate10};

    p {
        margin-top: 8px;
        font-size: ${({ theme }) => theme.fontSizes.md};
    }
`;
