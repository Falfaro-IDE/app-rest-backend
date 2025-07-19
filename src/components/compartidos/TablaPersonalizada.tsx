import { IonIcon } from '@ionic/react';
import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import styled from 'styled-components';
import { closeOutline } from "ionicons/icons";

interface TablaPersonalizadaProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  pagination?: boolean;
  paginationComponentOptions?: any;
  noDataComponent?: React.ReactNode;
  expandableRows?: boolean;
  expandableRowsComponent?: React.ReactNode;
  filterFunction?: (item: T, filterText: string) => boolean;
  showFilter?: boolean;
  filterPlaceholder?: string;
}

const paginationComponentOptionsTabla = {
	rowsPerPageText: 'Filas por página',
	rangeSeparatorText: 'de',
	selectAllRowsItem: true,
	selectAllRowsItemText: 'Todos',
};

const TextField = styled.input`
	height: 32px;
	width: 350px;
	border-radius: 5px 0 0 5px;
	border: 1px solid #e5e5e5;
	padding: 0 32px 0 16px;
`;

const ClearButton = styled.button`
	border: none;
	background-color: #ccc;
	border-radius: 0 5px 5px 0;
	height: 34px;
	width: 50px;
	cursor: pointer;
`;

const customStyles = {
  headCells: {
    style: {
      fontWeight: 'bold',
      fontSize: '14px',
      backgroundColor: '#2626260f',
      color: '#333',
    },
  },
};

const FilterComponent = ({
  filterText,
  onFilter,
  onClear,
  placeholder,
}: {
  filterText: string;
  onFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder: string;
}) => (
  <>
    <TextField
      type="text"
      placeholder={placeholder}
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton onClick={onClear}><IonIcon icon={closeOutline}></IonIcon></ClearButton>
  </>
);

function TablaPersonalizada<T>({
  columns,
  data,
  pagination = true,
  paginationComponentOptions,
  noDataComponent,
  expandableRows = false,
  expandableRowsComponent,
  filterFunction,
  showFilter = false,
  filterPlaceholder = 'Buscar...',
}: TablaPersonalizadaProps<T>) {
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

  const filteredData = React.useMemo(() => {
    if (!filterFunction || !filterText) return data;
    return data.filter(item => filterFunction(item, filterText));
  }, [data, filterFunction, filterText]);

  const subHeaderComponentMemo = React.useMemo(() => {
    if (!showFilter) return null;

    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent
        filterText={filterText}
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        placeholder={filterPlaceholder}
      />
    );
  }, [filterText, resetPaginationToggle, showFilter, filterPlaceholder]);

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      pagination={pagination}
      paginationComponentOptions={paginationComponentOptionsTabla}
      noDataComponent={noDataComponent}
      subHeader={showFilter}
      subHeaderComponent={subHeaderComponentMemo}
      customStyles={customStyles} 
      //expandableRows={expandableRows}
      //expandableRowsComponent={expandableRowsComponent}
    />
  );
}

export default TablaPersonalizada;