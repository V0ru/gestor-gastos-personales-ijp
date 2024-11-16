import React, { useRef, useState } from "react";
import { Input, Table, Select, Radio, Button } from "antd";
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

  return (
    <div className="search-container">
      <div className="search-options flex gap-4 mb-4">
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
      <Button onClick={exportToCsv} type="primary" className="mt-4">
        Exportar a CSV
      </Button>
    </div>
  );
};

export default TransactionSearch;   