import React, { useState } from 'react';
import { Table, Input, DatePicker, Select, Space, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

function TransactionSearch({ transactions }) {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Obtener categorías únicas de las transacciones
  const categories = [...new Set(transactions.map(t => t.tag))];

  const filteredTransactions = transactions.filter(transaction => {
    // Filtro por texto (nombre)
    const matchesText = transaction.name.toLowerCase().includes(searchText.toLowerCase());

    // Filtro por rango de fechas
    const matchesDate = dateRange ? 
      moment(transaction.date).isBetween(dateRange[0], dateRange[1], 'day', '[]') : true;

    // Filtro por tipo
    const matchesType = selectedType === 'all' ? true : transaction.type === selectedType;

    // Filtro por categoría
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
      render: (tag) => (
        <Tag color="blue">{tag}</Tag>
      ),
    },
    {
      title: 'Monto',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <span style={{ 
          color: record.type === 'ingreso' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {record.type === 'ingreso' ? '+' : '-'}€{amount.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <Space direction="vertical" size="middle" className="w-full">
          <h2 className="text-xl font-bold mb-4">Historial de Transacciones</h2>
          
          <Space wrap>
            {/* Búsqueda por nombre */}
            <Input
              placeholder="Buscar por nombre"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />

            {/* Filtro por fecha */}
            <RangePicker
              onChange={(dates) => setDateRange(dates)}
              format="DD/MM/YYYY"
            />

            {/* Filtro por tipo */}
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={setSelectedType}
            >
              <Option value="all">Todos</Option>
              <Option value="ingreso">Ingresos</Option>
              <Option value="gasto">Gastos</Option>
            </Select>

            {/* Filtro por categoría */}
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={setSelectedCategory}
            >
              <Option value="all">Todas</Option>
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Space>
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