import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Upload, message } from 'antd';
import { UploadOutlined, FilePdfOutlined } from '@ant-design/icons';
import { IExtract, IExtractPayload } from 'interfaces/extract';
import { ExtractService } from 'services/extract_service';
import { ContractDropdown } from '../../Dropdowns/ContractDropdown';

// Importando os estilos divididos (iguais aos do contrato)
import { WideModal, SplitLayout, LeftPane, RightPane } from './styles';

interface ExtractModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: IExtract | null;
}

export const ExtractModal: React.FC<ExtractModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData
}) => {
    const [form] = Form.useForm<IExtractPayload>();
    const [loading, setLoading] = useState(false);

    // Controle de PDF
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && initialData) {
            form.setFieldsValue({
                contract_key: initialData.contract.key,
                month_ref: initialData.month_ref,
                year_ref: initialData.year_ref,
                rent_amount: initialData.rent_amount,
                iptu: initialData.iptu,
                water: initialData.water,
                maintenance: initialData.maintenance,
                agreement: initialData.agreement,
                penalty: initialData.penalty,
                interest: initialData.interest,
                other_revenues: initialData.other_revenues,
                bank_fee: initialData.bank_fee
            });
            if (initialData.receipt_path) {
                setPdfPreviewUrl(initialData.receipt_path);
            }
        } else if (isOpen) {
            form.resetFields();
            setSelectedFile(null);
            setPdfPreviewUrl(null);
        }
    }, [isOpen, initialData, form]);

    const handleFileChange = (info: any) => {
        const file = info.file as File;
        if (file) {
            setSelectedFile(file);
            setPdfPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleClose = () => {
        if (selectedFile && pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
        form.resetFields();
        setSelectedFile(null);
        setPdfPreviewUrl(null);
        onClose();
    };

    const handleSubmit = async (values: IExtractPayload) => {
        setLoading(true);
        try {
            let savedExtract: IExtract;

            // Preenchendo valores que vieram vazios com 0 (para garantir consistência financeira)
            const payloadWithDefaults: IExtractPayload = {
                ...values,
                rent_amount: values.rent_amount || 0,
                iptu: values.iptu || 0,
                water: values.water || 0,
                maintenance: values.maintenance || 0,
                agreement: values.agreement || 0,
                penalty: values.penalty || 0,
                interest: values.interest || 0,
                other_revenues: values.other_revenues || 0,
                bank_fee: values.bank_fee || 0
            };

            // 1. Salva ou Atualiza
            if (initialData) {
                savedExtract = await ExtractService.update(
                    initialData.key,
                    payloadWithDefaults
                );
                message.success('Extrato atualizado com sucesso!');
            } else {
                savedExtract = await ExtractService.create(payloadWithDefaults);
                message.success('Extrato gerado com sucesso!');
            }

            // 2. Se houver comprovante NOVO
            if (selectedFile) {
                await ExtractService.uploadReceipt(
                    savedExtract.key,
                    selectedFile
                );
                message.success('Comprovante anexado com sucesso!');
            }

            if (onSuccess) onSuccess();
            handleClose();
        } catch (error) {
            message.error('Erro ao gerar extrato.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <WideModal
            title={
                initialData ? 'Editar Extrato/Repasse' : 'Novo Extrato/Repasse'
            }
            open={isOpen}
            onCancel={handleClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Salvar Extrato"
            cancelText="Cancelar"
            width={1000}
            destroyOnHidden
            centered
        >
            <SplitLayout>
                {/* PAINEL ESQUERDO: Comprovante PDF */}
                <LeftPane>
                    {pdfPreviewUrl ? (
                        <>
                            <iframe
                                src={`${pdfPreviewUrl}#toolbar=0`}
                                title="Comprovante de Repasse"
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 16,
                                    right: 16
                                }}
                            >
                                <Upload
                                    beforeUpload={() => false}
                                    showUploadList={false}
                                    onChange={handleFileChange}
                                >
                                    <Button
                                        icon={<UploadOutlined />}
                                        type="primary"
                                    >
                                        Trocar PDF
                                    </Button>
                                </Upload>
                            </div>
                        </>
                    ) : (
                        <Upload.Dragger
                            beforeUpload={() => false}
                            showUploadList={false}
                            onChange={handleFileChange}
                            accept=".pdf"
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <FilePdfOutlined
                                    style={{ fontSize: 48, color: '#0e90e2' }}
                                />
                            </p>
                            <p className="ant-upload-text">
                                Anexar Comprovante de Repasse
                            </p>
                            <p className="ant-upload-hint">
                                Formatos suportados: .PDF
                            </p>
                        </Upload.Dragger>
                    )}
                </LeftPane>

                {/* PAINEL DIREITO: Formulário Financeiro */}
                <RightPane>
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            name="contract_key"
                            rules={[
                                {
                                    required: true,
                                    message: 'Selecione o contrato'
                                }
                            ]}
                        >
                            <ContractDropdown
                                label="Contrato Vinculado"
                                disabled={!!initialData}
                            />
                        </Form.Item>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Form.Item
                                label="Mês Ref."
                                name="month_ref"
                                rules={[{ required: true }]}
                                style={{ flex: 1 }}
                            >
                                <InputNumber
                                    min={1}
                                    max={12}
                                    style={{ width: '100%' }}
                                    placeholder="Ex: 5"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Ano Ref."
                                name="year_ref"
                                rules={[{ required: true }]}
                                style={{ flex: 1 }}
                            >
                                <InputNumber
                                    min={2020}
                                    style={{ width: '100%' }}
                                    placeholder="Ex: 2026"
                                />
                            </Form.Item>
                        </div>

                        {/* LINHA DIVISÓRIA PARA ORGANIZAR VALORES */}
                        <div
                            style={{
                                borderBottom: '1px solid #e9ecef',
                                margin: '16px 0',
                                paddingBottom: '8px',
                                fontWeight: 600,
                                color: '#343a40'
                            }}
                        >
                            Composição de Receitas
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Form.Item
                                label="Aluguel (R$)"
                                name="rent_amount"
                                style={{ flex: 1 }}
                            >
                                <InputNumber
                                    min={0}
                                    precision={2}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Multa (R$)"
                                name="penalty"
                                style={{ flex: 1 }}
                            >
                                <InputNumber
                                    min={0}
                                    precision={2}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Form.Item
                                label="Juros (R$)"
                                name="interest"
                                style={{ flex: 1 }}
                            >
                                <InputNumber
                                    min={0}
                                    precision={2}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Acordo (R$)"
                                name="agreement"
                                style={{ flex: 1 }}
                            >
                                <InputNumber
                                    min={0}
                                    precision={2}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </div>

                        <div
                            style={{
                                borderBottom: '1px solid #e9ecef',
                                margin: '16px 0',
                                paddingBottom: '8px',
                                fontWeight: 600,
                                color: '#343a40'
                            }}
                        >
                            Custos e Repasses
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Form.Item
                                label="IPTU (R$)"
                                name="iptu"
                                style={{ flex: 1 }}
                            >
                                <InputNumber
                                    min={0}
                                    precision={2}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Água (R$)"
                                name="water"
                                style={{ flex: 1 }}
                            >
                                <InputNumber
                                    min={0}
                                    precision={2}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Form.Item
                                label="Manutenção (R$)"
                                name="maintenance"
                                style={{ flex: 1 }}
                            >
                                <InputNumber
                                    min={0}
                                    precision={2}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Outras Receitas (R$)"
                                name="other_revenues"
                                style={{ flex: 1 }}
                            >
                                <InputNumber
                                    min={0}
                                    precision={2}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            label="Taxa Bancária (TED/PIX/Boleto)"
                            name="bank_fee"
                        >
                            <InputNumber
                                min={0}
                                precision={2}
                                style={{ width: '50%' }}
                            />
                        </Form.Item>
                    </Form>
                </RightPane>
            </SplitLayout>
        </WideModal>
    );
};
