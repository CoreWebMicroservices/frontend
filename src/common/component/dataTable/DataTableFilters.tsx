import React from "react";
import { Form } from "react-bootstrap";
import { DataTableFilter } from "./DataTableTypes";

interface DataTableFiltersProps {
  filters: DataTableFilter[];
  values: Record<string, string | number | boolean>;
  onFilter: (key: string, value: string | number | boolean | null) => void;
}

export const DataTableFilters: React.FC<DataTableFiltersProps> = ({
  filters,
  values,
  onFilter
}) => {
  const renderFilter = (filter: DataTableFilter) => {
    const currentValue = values[filter.key];

    switch (filter.type) {
      case 'select':
        return (
          <Form.Select
            key={filter.key}
            value={currentValue?.toString() || ''}
            onChange={(e) => onFilter(filter.key, e.target.value || null)}
          >
            <option value="">{filter.placeholder || `All ${filter.label}`}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );

      case 'text':
        return (
          <Form.Control
            key={filter.key}
            type="text"
            placeholder={filter.placeholder || filter.label}
            value={currentValue?.toString() || ''}
            onChange={(e) => onFilter(filter.key, e.target.value || null)}
          />
        );

      case 'date':
        return (
          <Form.Control
            key={filter.key}
            type="date"
            placeholder={filter.placeholder || filter.label}
            value={currentValue?.toString() || ''}
            onChange={(e) => onFilter(filter.key, e.target.value || null)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {filters.map(renderFilter)}
    </>
  );
};