export const TableHeader = ({ columns }) => {
  return (
    <div data-table-header className="table-header table-row">
      {columns.map((el, index) => (
        <div key={index} className="row-element">
          {el}
        </div>
      ))}
    </div>
  );
};
