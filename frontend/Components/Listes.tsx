"use client";
import React from "react";

interface Column<T> {
  label: string;
  key: keyof T;
}

interface ListesProps<T> {
  data: T[];
  columns: Column<T>[];
  renderActions?: (item: T) => React.ReactNode;
  getRowKey?: (item: T) => string | number;
}

function Listes<T>({
  data,
  columns,
  renderActions,
  getRowKey,
}: ListesProps<T>): JSX.Element {
  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-8 max-w-[1000px] mx-auto">
      {data.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Aucun élément trouvé</p>
      ) : (
        <table className="table w-full">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)}>{col.label}</th>
              ))}
              {renderActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(data) ? data : []).map((item, idx) => (
              <tr key={getRowKey ? getRowKey(item) : idx}>
                {columns.map((col) => (
                  <td key={String(col.key)}>{(item[col.key] as React.ReactNode) ?? ""}
</td>
                ))}
                {renderActions && <td>{renderActions(item)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Listes;
