import React, { useState, useEffect } from 'react';
import { EXTRACT_CONFIRMATION_COOLDOWN_SECONDS } from 'constants/extract';
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

export interface IDuplicateExtractDetails {
    tenantName?: string;
    propertyName?: string;
    monthRef?: number;
    yearRef?: number;
    duplicateType?: 'database' | 'intra_batch';
    rawMessage?: string;
}

interface DuplicateExtractModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    details?: IDuplicateExtractDetails | null;
    messageText?: string;
    loading?: boolean;
}

const MONTH_NAMES = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
];

export const DuplicateExtractModal: React.FC<DuplicateExtractModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    details,
    messageText,
    loading = false
}) => {
    const [secondsLeft, setSecondsLeft] = useState<number>(
        EXTRACT_CONFIRMATION_COOLDOWN_SECONDS
    );

    useEffect(() => {
        if (!isOpen) {
            setSecondsLeft(EXTRACT_CONFIRMATION_COOLDOWN_SECONDS);
            return undefined;
        }

        setSecondsLeft(EXTRACT_CONFIRMATION_COOLDOWN_SECONDS);

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

    const hasStructuredDetails = Boolean(
        details?.tenantName || details?.propertyName || details?.monthRef
    );

    const getCompetenceDisplay = (): string | null => {
        if (!details?.monthRef || !details?.yearRef) return null;
        const monthNum = String(details.monthRef).padStart(2, '0');
        const monthName = MONTH_NAMES[details.monthRef - 1] || '';
        return `${monthNum}/${details.yearRef}${
            monthName ? ` (${monthName})` : ''
        }`;
    };

    const competenceDisplay = getCompetenceDisplay();

    return (
        <StyledModal
            title="Aviso de Extrato Duplicado"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
        >
            <ModalBody>
                <WarningMessage>
                    Foi detectado que um ou mais extratos deste lote já possuem
                    lançamento para o mesmo contrato na mesma competência.
                    Deseja realmente confirmar este lote em duplicidade?
                </WarningMessage>

                <DetailsCard>
                    {hasStructuredDetails ? (
                        <>
                            {details?.tenantName && (
                                <DetailRow>
                                    <DetailLabel>Inquilino:</DetailLabel>
                                    <DetailValue>
                                        {details.tenantName}
                                    </DetailValue>
                                </DetailRow>
                            )}
                            {details?.propertyName && (
                                <DetailRow>
                                    <DetailLabel>Imóvel / Unidade:</DetailLabel>
                                    <DetailValue>
                                        {details.propertyName}
                                    </DetailValue>
                                </DetailRow>
                            )}
                            {competenceDisplay && (
                                <DetailRow>
                                    <DetailLabel>Competência:</DetailLabel>
                                    <DetailValue>
                                        {competenceDisplay}
                                    </DetailValue>
                                </DetailRow>
                            )}
                            <DetailRow>
                                <DetailLabel>Origem:</DetailLabel>
                                <DetailValue>
                                    {details?.duplicateType === 'intra_batch'
                                        ? 'Extrato duplicado dentro do próprio lote'
                                        : 'Extrato já registrado no sistema'}
                                </DetailValue>
                            </DetailRow>
                        </>
                    ) : (
                        <DetailRow>
                            <DetailLabel>Detalhes:</DetailLabel>
                            <DetailValue>
                                {details?.rawMessage ||
                                    messageText ||
                                    'Lançamento duplicado identificado.'}
                            </DetailValue>
                        </DetailRow>
                    )}
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
