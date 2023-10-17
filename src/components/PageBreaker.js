import React, { useLayoutEffect, useRef, useState } from 'react';

const breakTable = (array, table, rows) => {
  const clonedTable = table.cloneNode(true);

  clonedTable.innerHTML = '';
  rows.forEach((el) => {
    clonedTable.innerHTML += el.outerHTML;
  });
  array.at(-1).innerHTML += clonedTable.outerHTML;
};

export const PageBreaker = ({ children, header, footer }) => {
  const pageRef = useRef();

  const [rerender, setRerender] = useState(false);

  useLayoutEffect(() => {
    setRerender(true);
  }, []);

  const listHeight = 1121.5;
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.height = `${listHeight}px`;
  container.style.pageBreakAfter = 'always';
  const breakElements = [container];
  let headerElement;
  let footerElement;
  let occupiedHeight;
  if (rerender) {
    headerElement = pageRef.current.firstChild;
    headerElement.style.position = 'absolute';
    headerElement.style.width = '100vw';
    headerElement.style.top = '0px';
    headerElement.style.left = `${-headerElement.getBoundingClientRect()
      .left}px`;

    footerElement = pageRef.current.lastChild;
    footerElement.style.position = 'absolute';
    footerElement.style.width = '100vw';
    footerElement.style.bottom = '0px';
    footerElement.style.left = `${-footerElement.getBoundingClientRect()
      .left}px`;
    const headerGag = document.createElement('div');
    headerGag.style.height = `${headerElement.offsetHeight}px`;
    breakElements.at(-1).innerHTML += headerGag.outerHTML;
    occupiedHeight = 0 + headerElement.offsetHeight;
  }
  function dfs(array, element) {
    element.childNodes.forEach((el) => {
      if (el.attributes && el.attributes['data-block']) {
        if (
          occupiedHeight + el.offsetHeight + footerElement.offsetHeight <=
          listHeight
        ) {
          array.at(-1).innerHTML += el.outerHTML;
          occupiedHeight += el.offsetHeight;
        } else {
          array.push(container);
          const headerGag = document.createElement('div');
          headerGag.style.height = `${headerElement.offsetHeight}px`;
          array.at(-1).innerHTML += headerGag.outerHTML;
          occupiedHeight = 0 + headerElement.offsetHeight;
          array.at(-1).innerHTML += el.outerHTML;
          occupiedHeight += el.offsetHeight;
        }
      } else if (el.attributes && el.attributes['data-table']) {
        // Частный случай
        if (
          occupiedHeight +
            el.childNodes[0].offsetHeight +
            el.childNodes[1].offsetHeight +
            footerElement.offsetHeight >
          listHeight
        ) {
          const containerCopy = container.cloneNode(true);
          containerCopy.innerHTML = '';
          array.push(containerCopy);
          const headerGag = document.createElement('div');
          headerGag.style.height = `${headerElement.offsetHeight}px`;
          array.at(-1).innerHTML += headerGag.outerHTML;
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
            const containerCopy = container.cloneNode(true);
            containerCopy.innerHTML = '';
            array.push(containerCopy);
            const headerGag = document.createElement('div');
            headerGag.style.height = `${headerElement.offsetHeight}px`;
            array.at(-1).innerHTML += headerGag.outerHTML;
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
    breakElements.forEach((page) => {
      page.innerHTML =
        headerElement.outerHTML + page.innerHTML + footerElement.outerHTML;
      pageRef.current.innerHTML += page.outerHTML;
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
