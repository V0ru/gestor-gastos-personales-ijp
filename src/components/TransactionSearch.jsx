import React, { useRef, useState } from "react";
import { Input, Table, Select, Radio, Button, Popconfirm } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

const TransactionSearch = ({
  transactions,
  exportToCsv,
  addTransaction,
  fetchTransactions,
  deleteTransaction,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [sortType, setSortType] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchType(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Buscar
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reiniciar
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchType === dataIndex ? (
        <span style={{ fontWeight: "bold" }}>{text}</span>
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Ingreso", value: "ingreso" },
        { text: "Gasto", value: "gasto" },
      ],
      onFilter: (value, record) => record.type.includes(value),
    },
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: "Monto",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Etiqueta",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (text, record) => (
        <Popconfirm
          title="¿Estás seguro de que quieres eliminar esta transacción?"
          onConfirm={() => deleteTransaction(record.id)}
          okText="Sí"
          cancelText="No"
        >
          <Button icon={<DeleteOutlined />} danger>
            Eliminar
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const handleSortTypeChange = (e) => {
    setSortType(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortType === "date") {
      return sortOrder === "asc"
        ? moment(a.date).unix() - moment(b.date).unix()
        : moment(b.date).unix() - moment(a.date).unix();
    } else if (sortType === "amount") {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
    return 0;
  });

  const dataSource = sortedTransactions.map((transaction) => ({
    key: transaction.id,
    ...transaction,
  }));

  return (
    <div className="search-container">
      <div className="search-options">
        <Radio.Group onChange={handleSortTypeChange} value={sortType}>
          <Radio.Button value="date">Fecha</Radio.Button>
          <Radio.Button value="amount">Monto</Radio.Button>
        </Radio.Group>
        <Radio.Group onChange={handleSortOrderChange} value={sortOrder}>
          <Radio.Button value="asc">Ascendente</Radio.Button>
          <Radio.Button value="desc">Descendente</Radio.Button>
        </Radio.Group>
      </div>
      <Table 
        columns={columns} 
        dataSource={dataSource} 
        locale={{
          triggerAsc: 'Ordenar ascendente',
          triggerDesc: 'Ordenar descendente',
          cancelSort: 'Cancelar ordenación'
        }}
      />
      <Button onClick={exportToCsv} type="primary" style={{ marginTop: 16 }}>
        Exportar a CSV
      </Button>
    </div>
  );
};

export default TransactionSearch;   