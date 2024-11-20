import React from 'react';
import { Layout, Typography, Button, Row, Col, Card } from 'antd';
import { CheckCircleOutlined, MoneyCollectOutlined, BarChartOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const GetStarted = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '50px', backgroundColor: '#f0f2f5' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Bienvenido a tu Panel Financiero</Title>
        <Paragraph style={{ textAlign: 'center', fontSize: '18px' }}>
          Esta aplicación te ayudará a gestionar tus finanzas personales de manera efectiva.
        </Paragraph>

        <Row gutter={16} style={{ marginTop: '30px' }}>
          <Col span={6}>
            <Card>
              <CheckCircleOutlined style={{ fontSize: '40px', color: '#52c41a' }} />
              <Title level={4}>Registro de Transacciones</Title>
              <Paragraph>
                Agrega tus ingresos y gastos fácilmente para llevar un control de tus finanzas.
              </Paragraph>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <MoneyCollectOutlined style={{ fontSize: '40px', color: '#faad14' }} />
              <Title level={4}>Visualización de Datos</Title>
              <Paragraph>
                Visualiza tus ingresos y gastos a través de gráficos interactivos.
              </Paragraph>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <BarChartOutlined style={{ fontSize: '40px', color: '#1890ff' }} />
              <Title level={4}>Estadísticas Financieras</Title>
              <Paragraph>
                Obtén un resumen de tu situación financiera con estadísticas claras.
              </Paragraph>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <FileTextOutlined style={{ fontSize: '40px', color: '#eb2f2f' }} />
              <Title level={4}>Descarga de Reportes</Title>
              <Paragraph>
                Descarga tu historial de transacciones en formato PDF o CSV.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Button type="primary" size="large" href="/">
            Comenzar
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default GetStarted; 