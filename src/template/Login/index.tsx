import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, message, Tag } from 'antd';
import {
    UserOutlined,
    LockOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { useAuth } from 'hooks/useAuth';
import { IAuthPayload } from 'interfaces/auth';
import { HealthService } from 'services/health_service';
import { Container, FormCard, Header, Title, Subtitle } from './styles';

export const LoginTemplate: React.FC = () => {
    const { signIn } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [serverStatus, setServerStatus] = useState<
        'checking' | 'online' | 'offline'
    >('checking');

    useEffect(() => {
        const pingServer = async () => {
            setServerStatus('checking');
            let isAwake = await HealthService.wakeUpServer();
            if (isAwake) {
                setServerStatus('online');
            } else {
                setTimeout(async () => {
                    isAwake = await HealthService.wakeUpServer();
                    setServerStatus(isAwake ? 'online' : 'offline');
                }, 5000);
            }
        };

        pingServer();
    }, []);

    const onFinish = async (values: IAuthPayload) => {
        setLoading(true);
        try {
            await signIn(values.email, values.password);
            message.success('Login realizado com sucesso!');
            router.push('/controle');
        } catch (error) {
            message.error('E-mail ou senha incorretos. Tente novamente.');
            console.error('Erro no login:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderServerStatus = () => {
        if (serverStatus === 'checking') {
            return (
                <Tag icon={<SyncOutlined spin />} color="processing">
                    Acordando servidor...
                </Tag>
            );
        }
        if (serverStatus === 'online') {
            return (
                <Tag icon={<CheckCircleOutlined />} color="success">
                    Sistema Online
                </Tag>
            );
        }
        return (
            <Tag icon={<CloseCircleOutlined />} color="error">
                Servidor Offline
            </Tag>
        );
    };

    return (
        <Container>
            <FormCard>
                <Header>
                    <Title>
                        Rental <span>Manager</span>
                    </Title>
                    <Subtitle>Acesse o painel de gestão imobiliária</Subtitle>

                    <div style={{ marginTop: '16px' }}>
                        {renderServerStatus()}
                    </div>
                </Header>

                <Form
                    name="login_form"
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, insira seu e-mail!'
                            },
                            {
                                type: 'email',
                                message: 'Insira um formato de e-mail válido!'
                            }
                        ]}
                    >
                        <Input
                            prefix={
                                <UserOutlined style={{ color: '#adb5bd' }} />
                            }
                            placeholder="E-mail"
                            size="large"
                            autoComplete="email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, insira sua senha!'
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={
                                <LockOutlined style={{ color: '#adb5bd' }} />
                            }
                            placeholder="Senha"
                            size="large"
                            autoComplete="current-password"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            disabled={serverStatus === 'offline'}
                        >
                            Entrar na plataforma
                        </Button>
                    </Form.Item>
                </Form>
            </FormCard>
        </Container>
    );
};

export default LoginTemplate;
