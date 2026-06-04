import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import { useAuth } from 'hooks/useAuth';
import { UserService } from 'services/user_service';
import { IUserUpdatePayload } from 'interfaces/user';

export const MyProfileForm: React.FC = () => {
    const { user, signOut } = useAuth();
    const [form] = Form.useForm<IUserUpdatePayload>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email
            });
        }
    }, [user, form]);

    const handleSubmit = async (values: IUserUpdatePayload) => {
        setLoading(true);
        try {
            // Se a senha estiver vazia, não enviamos no payload para não sobrescrever
            const payload = { ...values };
            if (!payload.password) {
                delete payload.password;
            }

            await UserService.updateMe(payload);
            message.success('Perfil atualizado com sucesso!');

            // Se o e-mail ou a senha mudou, o token antigo pode ser invalidado ou os dados do contexto ficarão velhos.
            // Uma prática segura é pedir para logar novamente.
            if (
                payload.password ||
                (payload.email && payload.email !== user?.email)
            ) {
                message.info(
                    'Suas credenciais foram alteradas. Por favor, faça login novamente.'
                );
                setTimeout(() => signOut(), 2000);
            }
        } catch (error) {
            message.error('Erro ao atualizar o perfil.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ maxWidth: 500, marginTop: 16 }}
        >
            <Form.Item
                label="Nome Completo"
                name="name"
                rules={[{ required: true, message: 'O nome é obrigatório' }]}
            >
                <Input placeholder="Seu nome" />
            </Form.Item>

            <Form.Item
                label="E-mail"
                name="email"
                rules={[
                    { required: true, message: 'O e-mail é obrigatório' },
                    { type: 'email', message: 'Insira um e-mail válido' }
                ]}
            >
                <Input placeholder="seu.email@exemplo.com" />
            </Form.Item>

            <Divider>Alterar Senha</Divider>
            <p style={{ color: '#868e96', fontSize: '12px', marginBottom: 16 }}>
                Deixe em branco se não quiser alterar sua senha atual.
            </p>

            <Form.Item label="Nova Senha" name="password">
                <Input.Password placeholder="Digite a nova senha" />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                >
                    Salvar Alterações
                </Button>
            </Form.Item>
        </Form>
    );
};
