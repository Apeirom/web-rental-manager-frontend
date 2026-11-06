import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { UserService } from 'services/user_service';
import { IUser } from 'interfaces/user';
import { notifyApiError } from 'utils/error_handler';
import { StyledModal } from '../sharedStyles';
import { ModalDescription } from './styles';

interface ResetPasswordModalProps {
    isOpen: boolean;
    user: IUser | null;
    onClose: () => void;
    onSuccess?: () => void;
}

interface FormValues {
    newPassword: string;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
    isOpen,
    user,
    onClose,
    onSuccess
}) => {
    const [form] = Form.useForm<FormValues>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: FormValues) => {
        if (!user) return;
        setLoading(true);
        try {
            await UserService.resetPassword(user.key, values.newPassword);
            message.success(`Senha de ${user.name} redefinida com sucesso!`);
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error: unknown) {
            await notifyApiError(
                error,
                'Erro ao redefinir a senha do usuário.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title="Redefinir Senha do Usuário"
            open={isOpen}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Salvar Nova Senha"
            cancelText="Cancelar"
            destroyOnHidden
        >
            <ModalDescription>
                Defina uma nova senha temporária ou de acesso para o usuário{' '}
                <strong>{user?.name}</strong> ({user?.email}).
            </ModalDescription>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Nova Senha"
                    name="newPassword"
                    rules={[
                        {
                            required: true,
                            message: 'A nova senha é obrigatória'
                        },
                        {
                            min: 6,
                            message: 'A senha deve ter pelo menos 6 caracteres'
                        }
                    ]}
                >
                    <Input.Password placeholder="Digite a nova senha para o usuário" />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};
