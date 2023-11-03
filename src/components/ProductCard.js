import React from 'react';

export const ProductCard = ({ params }) => {
  return (
    <div data-product className="card">
      <div className="card__title">Card Title</div>
      <div className="card__body">
        <div className="card__svg"></div>
        <div className="card__params">
          {params.map((param) => (
            <div>
              <div className="param__title">{param.title}</div>
              {param.rows.map((row) => (
                <div className="param__row">{row}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
