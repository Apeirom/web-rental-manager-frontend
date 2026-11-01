import React, { useState, useEffect } from 'react';
import { CONFIRMATION_COOLDOWN_SECONDS } from 'constants/payment_constants';
import { formatBRL, formatDate } from 'utils/formatters';
import {
    StyledModal,
    ModalBody,
    WarningMessage,
    DetailsCard,
    DetailRow,
    DetailLabel,
    DetailValue,
    FooterContainer,
    ConfirmButton,
    CancelButton
} from './styles';

interface DuplicatePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    paymentDate: string;
    amount: number;
    loading?: boolean;
}

export const DuplicatePaymentModal: React.FC<DuplicatePaymentModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    paymentDate,
    amount,
    loading = false
}) => {
    const [secondsLeft, setSecondsLeft] = useState<number>(
        CONFIRMATION_COOLDOWN_SECONDS
    );

    useEffect(() => {
        if (!isOpen) {
            setSecondsLeft(CONFIRMATION_COOLDOWN_SECONDS);
            return undefined;
        }

        setSecondsLeft(CONFIRMATION_COOLDOWN_SECONDS);

        const interval = window.setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    window.clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            window.clearInterval(interval);
        };
    }, [isOpen]);

    const isCooldownActive = secondsLeft > 0;

    const formattedDate = paymentDate ? formatDate(paymentDate) : '-';
    const formattedAmount =
        typeof amount === 'number' ? formatBRL(amount) : '-';

    return (
        <StyledModal
            title="Aviso de Pagamento Duplicado"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
        >
            <ModalBody>
                <WarningMessage>
                    Já existe um pagamento registrado no sistema com a mesma
                    data e o mesmo valor. Deseja realmente confirmar o
                    lançamento deste pagamento em duplicidade?
                </WarningMessage>

                <DetailsCard>
                    <DetailRow>
                        <DetailLabel>Data do Recebimento:</DetailLabel>
                        <DetailValue>{formattedDate}</DetailValue>
                    </DetailRow>
                    <DetailRow>
                        <DetailLabel>Valor:</DetailLabel>
                        <DetailValue>{formattedAmount}</DetailValue>
                    </DetailRow>
                </DetailsCard>

                <FooterContainer>
                    <CancelButton onClick={onClose} disabled={loading}>
                        Cancelar
                    </CancelButton>
                    <ConfirmButton
                        type="primary"
                        onClick={onConfirm}
                        disabled={isCooldownActive || loading}
                        loading={loading}
                    >
                        {isCooldownActive
                            ? `Confirmar (${secondsLeft}s)`
                            : 'Confirmar duplicidade'}
                    </ConfirmButton>
                </FooterContainer>
            </ModalBody>
        </StyledModal>
    );
};
