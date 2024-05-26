import React, { ReactNode } from 'react';

interface TableProps<T> {
  data: T[];
  headers: ReactNode[];
  generateRow: (item: T) => ReactNode[];
}

const Table = <T,>({ data, headers, generateRow }: TableProps<T>) => {
  return (
    <table>
      <thead>
        {headers.map((header, i) => (
          <th className="border-[2px]" key={`header-${i}`}>
            {header}
          </th>
        ))}
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr className="text-center" key={`row-${i}`}>
            {generateRow(item).map((row, j) => (
              <td className="border" key={`cell-${i}-${j}`}>
                {row}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
