import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { UserService } from 'services/user_service';
import { IUserCreatePayload } from 'interfaces/user';
import { StyledModal } from '../sharedStyles';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [form] = Form.useForm<IUserCreatePayload>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: IUserCreatePayload) => {
        setLoading(true);
        try {
            await UserService.register(values);
            message.success('Usuário registrado com sucesso!');
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error: any) {
            if (error.response?.data?.detail?.code === 'RM-0016') {
                message.error('Este e-mail já está em uso.');
            } else {
                message.error('Erro ao cadastrar usuário.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title="Cadastrar Novo Usuário"
            open={isOpen}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Cadastrar"
            cancelText="Cancelar"
            destroyOnHidden
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Nome Completo"
                    name="name"
                    rules={[
                        { required: true, message: 'O nome é obrigatório' }
                    ]}
                >
                    <Input placeholder="Ex: Maria Silva" />
                </Form.Item>

                <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[
                        { required: true, message: 'O e-mail é obrigatório' },
                        { type: 'email', message: 'E-mail inválido' }
                    ]}
                >
                    <Input placeholder="exemplo@empresa.com" />
                </Form.Item>

                <Form.Item
                    label="Senha Provisória"
                    name="password"
                    rules={[
                        { required: true, message: 'A senha é obrigatória' }
                    ]}
                >
                    <Input.Password placeholder="Defina uma senha de acesso" />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};
