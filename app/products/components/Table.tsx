export default function Table<
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
>({
  columns = [],
  data = [],
}: {
  columns: { value: string; label: string; size?: string }[]
  data: T[]
}) {
  return (
    <table>
      <thead className="bg-gray-100">
        <tr>
          {columns.map((column) => (
            <th
              key={column.value}
              className="px-4 py-2 text-left"
              style={{ width: column.size }}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="border-b last:border-b-0 border-gray-200"
          >
            {columns.map((column) => (
              <td key={column.value} className="px-4 py-2">
                {row[column.value]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
