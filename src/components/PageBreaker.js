import React, { useLayoutEffect, useRef, useState } from 'react';

const breakTable = (array, table, rows) => {
  const clonedTable = table.cloneNode(true);

  clonedTable.innerHTML = '';
  rows.forEach((el) => {
    clonedTable.innerHTML += el.outerHTML;
  });
  array.push(clonedTable);
};

export const PageBreaker = ({ children, header, footer }) => {
  const pageRef = useRef();

  const [rerender, setRerender] = useState(false);

  useLayoutEffect(() => {
    setRerender(true);
  }, []);

  const listHeight = 1121;
  const breakElements = [];
  let headerElement;
  let footerElement;
  let occupiedHeight;
  if (rerender) {
    headerElement = pageRef.current.firstChild;
    headerElement.style.pageBreakBefore = 'always';
    footerElement = pageRef.current.lastChild;
    breakElements.push(headerElement);
    occupiedHeight = 0 + headerElement.offsetHeight;
  }
  function dfs(array, element) {
    element.childNodes.forEach((el) => {
      if (el.attributes && el.attributes['data-block']) {
        if (
          occupiedHeight + el.offsetHeight + footerElement.offsetHeight <=
          listHeight
        ) {
          array.push(el);
          occupiedHeight += el.offsetHeight;
        } else {
          array.push(footerElement);

          array.push(headerElement);
          occupiedHeight = 0 + headerElement.offsetHeight;
          array.push(el);
          occupiedHeight += el.offsetHeight;
        }
      } else if (el.attributes && el.attributes['data-table']) {
        if (
          occupiedHeight +
            el.childNodes[0].offsetHeight +
            el.childNodes[1].offsetHeight +
            footerElement.offsetHeight >
          listHeight
        ) {
          array.push(footer);
          array.push(headerElement);
          occupiedHeight = 0 + headerElement.offsetHeight;
          el.style.pageBreakBefore = 'always';
        }

        let tableElements = [];
        const tableHeader = el.firstChild;

        for (let index = 0; index < el.childNodes.length; index++) {
          const row = el.childNodes[index];
          if (
            occupiedHeight + row.offsetHeight + footerElement.offsetHeight <=
            listHeight
          ) {
            tableElements.push(row);
            occupiedHeight += row.offsetHeight;
          } else {
            breakTable(array, el, tableElements);
            array.push(footerElement);

            array.push(headerElement);
            occupiedHeight = 0 + headerElement.offsetHeight;
            tableElements = [];
            tableElements.push(tableHeader);
            occupiedHeight += tableHeader.offsetHeight;
            tableElements.push(row);
            occupiedHeight += row.offsetHeight;
          }
        }
        breakTable(array, el, tableElements);
      } else {
        dfs(array, el);
      }
    });
  }

  rerender && dfs(breakElements, pageRef.current);

  if (pageRef.current) {
    pageRef.current.innerHTML = '';
    breakElements.forEach((el) => {
      pageRef.current.innerHTML += el.outerHTML;
    });
  }

  return (
    <div ref={pageRef}>
      {header}
      {children}
      {footer}
    </div>
  );
};
