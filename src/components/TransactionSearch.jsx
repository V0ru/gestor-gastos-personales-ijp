import React, { useState } from 'react';
import { Table, Input, DatePicker, Select, Space, Tag, Button } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { RangePicker } = DatePicker;
const { Option } = Select;

function TransactionSearch({ transactions, user }) {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [...new Set(transactions.map((t) => t.tag))];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesText = transaction.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesDate = dateRange
      ? moment(transaction.date).isBetween(dateRange[0], dateRange[1], 'day', '[]')
      : true;
    const matchesType = selectedType === 'all' ? true : transaction.type === selectedType;
    const matchesCategory = selectedCategory === 'all' ? true : transaction.tag === selectedCategory;

    return matchesText && matchesDate && matchesType && matchesCategory;
  });

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'ingreso' ? 'green' : 'red'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Categoría',
      dataIndex: 'tag',
      key: 'tag',
      render: (tag) => <Tag color="blue">{tag}</Tag>,
    },
    {
      title: 'Monto',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <span
          style={{
            color: record.type === 'ingreso' ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {record.type === 'ingreso' ? '+' : '-'}€{amount.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
  ];

  // Función para descargar en PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Validar valores de usuario
    //const userName = user?.name || 'No especificado';
    const userEmail = user?.email || 'No especificado';
  
    const tableColumn = ['Fecha', 'Nombre', 'Tipo', 'Categoría', 'Monto'];
    const tableRows = filteredTransactions.map((t) => [
      moment(t.date).format('DD/MM/YYYY'),
      t.name,
      t.type === 'ingreso' ? 'Ingreso' : 'Gasto',
      t.tag,
      `${t.type === 'ingreso' ? '+' : '-'}€${t.amount.toLocaleString()}`,
    ]);
  
    // Información del usuario
    doc.setFontSize(12);
    //doc.text(`Nombre: ${userName}`, 14, 25);
    doc.text(`Correo: ${userEmail}`, 14, 32);
    doc.text(`Fecha de generación: ${moment().format('DD/MM/YYYY HH:mm')}`, 14, 39);
    
    // Generar la tabla
    doc.autoTable({
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      styles: { halign: 'center' },
      headStyles: { fillColor: [0, 122, 204] },
      theme: 'grid',
    });
  
    // Guardar el PDF
    doc.save('Historial_Transacciones.pdf');
  };

  return (
    <div className="p-6">
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <Space direction="vertical" size="middle" className="w-full">
          <h2 className="text-xl font-bold mb-4">Historial de Transacciones</h2>

          <Space wrap>
            <Input
              placeholder="Buscar por nombre"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />

            <RangePicker onChange={(dates) => setDateRange(dates)} format="DD/MM/YYYY" />

            <Select defaultValue="all" style={{ width: 120 }} onChange={setSelectedType}>
              <Option value="all">Todos</Option>
              <Option value="ingreso">Ingresos</Option>
              <Option value="gasto">Gastos</Option>
            </Select>

            <Select defaultValue="all" style={{ width: 120 }} onChange={setSelectedCategory}>
              <Option value="all">Todas</Option>
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Space>

          <Button type="primary" icon={<DownloadOutlined />} onClick={downloadPDF}>
            Descargar PDF
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredTransactions}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} transacciones`,
        }}
        className="bg-white rounded-lg shadow"
      />
    </div>
  );
}

export default TransactionSearch;
