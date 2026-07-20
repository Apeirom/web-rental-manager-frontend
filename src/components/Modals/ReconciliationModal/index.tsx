// src/components/Modals/ReconciliationModal/index.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { message, Button, Spin, Alert } from 'antd';
import {
    ApiOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    FrownOutlined
} from '@ant-design/icons';

// IMPORTAÇÕES ATUALIZADAS
import { IExtractBatch } from 'interfaces/extract';
import { IPayment } from 'interfaces/payment';
import { ExtractBatchService } from 'services/extract_service';
import { PaymentService } from 'services/payment_service';

import { StyledModal } from '../sharedStyles';
import { SummaryContainer, CandidateCard, EmptyStateContainer } from './styles';

// Alterado para receber 'batch' em vez de 'extract'
interface ReconciliationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    batch: IExtractBatch | null;
}

const formatBRL = (val: number): string =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(val);

export const ReconciliationModal: React.FC<ReconciliationModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    batch // NOVO
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [linkingId, setLinkingId] = useState<string | null>(null);
    const [candidates, setCandidates] = useState<IPayment[]>([]);
    const [statusMessage, setStatusMessage] = useState<string>('');

    const [reconStatus, setReconStatus] = useState<
        'pending' | 'success' | 'alreadyLinked'
    >('pending');

    const fetchCandidates = useCallback(async (): Promise<void> => {
        if (!batch?.key) return;

        setLoading(true);
        try {
            // Nova chamada ao Batch Service
            const res = await ExtractBatchService.getReconciliationCandidates(
                batch.key
            );
            setCandidates(res.candidates || []);
            setStatusMessage(res.message);
            setReconStatus(res.status);
        } catch (error) {
            message.error('Erro ao buscar informações de conciliação.');
            setCandidates([]);
        } finally {
            setLoading(false);
        }
    }, [batch?.key]);

    useEffect(() => {
        if (isOpen && batch) {
            fetchCandidates();
        }
    }, [isOpen, batch, fetchCandidates]);

    const handleLinkPayment = async (payment: IPayment): Promise<void> => {
        if (!batch?.key) return;
        setLinkingId(payment.key);

        try {
            await PaymentService.update(payment.key, {
                payment_date: payment.payment_date,
                amount: payment.amount,
                extract_batch_key: batch.key // ATUALIZADO
            });
            message.success('Pagamento conciliado com sucesso!');
            onSuccess();
            onClose();
        } catch (error) {
            message.error('Erro ao vincular o pagamento.');
        } finally {
            setLinkingId(null);
        }
    };

    const handleUnlinkPayment = async (payment: IPayment): Promise<void> => {
        setLinkingId(payment.key);
        try {
            await PaymentService.update(payment.key, {
                payment_date: payment.payment_date,
                amount: payment.amount,
                extract_batch_key: undefined // ATUALIZADO: Passamos undefined ou null para desvincular
            });
            message.success('Vínculo desfeito com sucesso!');
            onSuccess();
            onClose();
        } catch (error) {
            message.error('Erro ao desvincular o pagamento.');
        } finally {
            setLinkingId(null);
        }
    };

    if (!batch) return null;

    // Lógicas visuais de resumo para Lotes
    const isSingleContract = batch.extracts.length === 1;
    const propertyDisplay = isSingleContract
        ? batch.extracts[0].contract.property.property_name
        : `Lote Múltiplo (${batch.extracts.length} contratos)`;

    const refDisplay =
        batch.extracts.length > 0
            ? `${String(batch.extracts[0].month_ref).padStart(2, '0')}/${
                  batch.extracts[0].year_ref
              }`
            : '-';

    return (
        <StyledModal
            title={
                <span>
                    <ApiOutlined style={{ marginRight: 8, color: '#0e90e2' }} />
                    Conciliar Pagamento
                </span>
            }
            open={isOpen}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
            width={600}
        >
            <SummaryContainer>
                <div>
                    <span className="label">Imóvel / Lote</span>
                    <span className="value">{propertyDisplay}</span>
                </div>
                <div>
                    <span className="label">Referência</span>
                    <span className="value">{refDisplay}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className="label">Valor Líquido Buscado</span>
                    <span className="value target-amount">
                        {/* ATUALIZADO: Agora busca a soma total do lote */}
                        {formatBRL(batch.total_net_transfer)}
                    </span>
                </div>
            </SummaryContainer>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" tip="Analisando caixa..." />
                </div>
            ) : (
                <>
                    {candidates.length > 0 ? (
                        <>
                            <Alert
                                message={statusMessage}
                                type={
                                    reconStatus === 'alreadyLinked'
                                        ? 'success'
                                        : 'info'
                                }
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                            {candidates.map((payment) => (
                                <CandidateCard key={payment.key}>
                                    <div className="date-info">
                                        <small>Data que caiu na conta</small>
                                        <strong>
                                            {new Date(
                                                `${payment.payment_date}T12:00:00Z`
                                            ).toLocaleDateString('pt-BR')}
                                        </strong>
                                    </div>
                                    <div className="amount-info">
                                        {formatBRL(payment.amount)}
                                    </div>

                                    {reconStatus === 'alreadyLinked' ? (
                                        <Button
                                            danger
                                            type="primary"
                                            icon={<CloseCircleOutlined />}
                                            loading={linkingId === payment.key}
                                            onClick={() =>
                                                handleUnlinkPayment(payment)
                                            }
                                        >
                                            Desvincular
                                        </Button>
                                    ) : (
                                        <Button
                                            type="primary"
                                            icon={<CheckCircleOutlined />}
                                            loading={linkingId === payment.key}
                                            disabled={
                                                linkingId !== null &&
                                                linkingId !== payment.key
                                            }
                                            onClick={() =>
                                                handleLinkPayment(payment)
                                            }
                                        >
                                            Vincular
                                        </Button>
                                    )}
                                </CandidateCard>
                            ))}
                        </>
                    ) : (
                        <EmptyStateContainer>
                            <FrownOutlined
                                style={{ fontSize: 32, color: '#ffc078' }}
                            />
                            <p>
                                Não encontramos nenhum pagamento{' '}
                                <strong>pendente</strong> no valor exato de{' '}
                                {formatBRL(batch.total_net_transfer)}.
                            </p>
                            <small>
                                Vá até a tela de Pagamentos e registre o
                                recebimento caso ele já tenha caído na conta.
                            </small>
                        </EmptyStateContainer>
                    )}
                </>
            )}
        </StyledModal>
    );
};
