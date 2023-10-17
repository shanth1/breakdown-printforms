import { table1, table2 } from '../model/data';
import { TableHeader } from './TableHeader';

export const Content = () => {
  return (
    <div>
      {/* <div
        data-block
        style={{ height: `${297 / 0.265}px`, backgroundColor: 'red' }}
      ></div> */}
      <div data-block className="heading">
        Таблица 1
      </div>
      {/* <div
        data-block
        style={{ height: `${300}px`, backgroundColor: 'red' }}
      ></div>
      <div
        data-block
        style={{ height: `${700}px`, backgroundColor: 'green' }}
      ></div> */}
      <div data-table className="table">
        <TableHeader
          columns={['Номер', 'Артикул', 'Продукт', 'Описание', 'Цена']}
        />
        {table1.map((el, index) => (
          <div key={index} className="table-row">
            <div className="row-element">{index + 1}</div>
            <div className="row-element">{el.code}</div>
            <div className="row-element">{el.product}</div>
            <div className="row-element">{el.description}</div>
            <div className="row-element">{el.price} $</div>
          </div>
        ))}
      </div>
      <div data-block className="heading">
        Таблица 2
      </div>
      <div data-table className="table">
        <TableHeader
          columns={['Номер', 'Артикул', 'Продукт', 'Описание', 'Цена']}
        />
        {table2.map((el, index) => (
          <div key={index} className="table-row">
            <div className="row-element">{index + 1}</div>
            <div className="row-element">{el.code}</div>
            <div className="row-element">{el.product}</div>
            <div className="row-element">{el.description}</div>
            <div className="row-element">{el.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
