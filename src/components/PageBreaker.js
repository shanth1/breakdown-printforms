import React, { useLayoutEffect, useRef, useState } from 'react';

const breakTable = (array, table, rows) => {
  const clonedTable = table.cloneNode(true);

  clonedTable.innerHTML = '';
  rows.forEach((el) => {
    clonedTable.innerHTML += el.outerHTML;
  });

  clonedTable.style.pageBreakAfter = 'always';
  array.push(clonedTable);
};

export const PageBreaker = ({ children }) => {
  const pageRef = useRef();

  const [rerender, setRerender] = useState(false);

  useLayoutEffect(() => {
    setRerender(true);
  }, []);

  const listHeight = 297 / 0.266;
  const breakElements = [];
  let occupiedHeight = 0;
  let isBreakTableFlag = false;
  function dfs(array, element) {
    element.childNodes.forEach((el) => {
      if (el.attributes && el.attributes['data-block']) {
        array.push(el);
        if (occupiedHeight + el.offsetHeight > listHeight) {
          occupiedHeight = 0;
          el.style.pageBreakBefore = 'always';
        }
        occupiedHeight += el.offsetHeight;
      } else if (el.attributes && el.attributes['data-table']) {
        if (
          occupiedHeight +
            el.childNodes[0].offsetHeight +
            el.childNodes[1].offsetHeight >
          listHeight
        ) {
          occupiedHeight = 0;
          el.style.pageBreakBefore = 'always';
        }

        let tableElements = [];

        const tableHeader = el.firstChild.cloneNode(true);

        for (let index = 0; index < el.childNodes.length; index++) {
          const row = el.childNodes[index];
          if (occupiedHeight + row.offsetHeight > listHeight) {
            isBreakTableFlag = true;
            breakTable(breakElements, el, tableElements);
            occupiedHeight = 0;
            tableElements = [];
          } else {
            isBreakTableFlag = false;
            occupiedHeight += row.offsetHeight;
            tableElements.push(row);
          }
          if (isBreakTableFlag) {
            occupiedHeight += tableHeader.offsetHeight;
            tableElements.push(tableHeader);
            tableElements.push(row);
          }
        }
        el.innerHTML = '';
        tableElements.forEach((row) => {
          el.innerHTML += row.outerHTML;
        });
        breakElements.push(el);
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

  return <div ref={pageRef}>{children}</div>;
};
