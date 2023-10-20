import React, { useLayoutEffect, useRef, useState } from 'react';
const listHeight = 1120;

const getHeaderOffsetElement = (headerElement) => {
  const headerOffset = document.createElement('div');
  headerOffset.style.height = `${headerElement.offsetHeight}px`;
  return headerOffset;
};

const setUpContainer = () => {
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.height = `${listHeight + 1}px`;
  container.style.pageBreakAfter = 'always';
  return container;
};

const getNewContainer = (container) => {
  const containerCopy = container.cloneNode(true);
  containerCopy.innerHTML = '';
  return containerCopy;
};

const getPrepareElement = (element) => {
  element.style.position = 'absolute';
  element.style.width = '100vw';
  element.style.left = `${-element.getBoundingClientRect().left}px`;
  return element;
};

const breakTable = (array, table, rows) => {
  const clonedTable = table.cloneNode(true);

  clonedTable.innerHTML = '';
  rows.forEach((el) => {
    clonedTable.innerHTML += el.outerHTML;
  });
  array.at(-1).innerHTML += clonedTable.outerHTML;
};

export const PageBreaker = ({ children, header, footer }) => {
  const rootRef = useRef();
  const [rerender, setRerender] = useState(false);
  useLayoutEffect(() => {
    setRerender(true);
  }, []);

  const container = setUpContainer();
  let headerOffset;
  const pages = [container];
  let headerElement = document.createElement('div');
  let footerElement = document.createElement('div');
  let occupiedHeight = 0;
  if (rerender) {
    if (header) {
      headerElement = getPrepareElement(rootRef.current.firstChild);
      headerElement.style.top = '0px';
    }
    if (footer) {
      footerElement = getPrepareElement(rootRef.current.lastChild);
      footerElement.style.bottom = '0px';
    }

    headerOffset = getHeaderOffsetElement(headerElement);
    pages.at(-1).innerHTML += headerOffset.outerHTML;
    occupiedHeight += headerElement.offsetHeight;
  }
  function generatePagesFromGraph(graph, pages) {
    graph.childNodes.forEach((element) => {
      if (element.attributes && element.attributes['data-block']) {
        if (
          occupiedHeight + element.offsetHeight + footerElement.offsetHeight <=
          listHeight
        ) {
          pages.at(-1).innerHTML += element.outerHTML;
          occupiedHeight += element.offsetHeight;
        } else {
          pages.push(getNewContainer(container));
          pages.at(-1).innerHTML += headerOffset.outerHTML;
          occupiedHeight = 0 + headerElement.offsetHeight;
          pages.at(-1).innerHTML += element.outerHTML;
          occupiedHeight += element.offsetHeight;
        }
      } else if (element.attributes && element.attributes['data-table']) {
        if (
          occupiedHeight +
            element.childNodes[0].offsetHeight +
            element.childNodes[1].offsetHeight +
            footerElement.offsetHeight >
          listHeight
        ) {
          occupiedHeight = 0;
          pages.push(getNewContainer(container));
          pages.at(-1).innerHTML += headerOffset.outerHTML;
        }

        let tableElements = [];
        const tableHeader = element.firstChild;

        for (let index = 0; index < element.childNodes.length; index++) {
          const row = element.childNodes[index];
          if (
            occupiedHeight + row.offsetHeight + footerElement.offsetHeight <=
            listHeight
          ) {
            tableElements.push(row);
            occupiedHeight += row.offsetHeight;
          } else {
            breakTable(pages, element, tableElements);
            pages.push(getNewContainer(container));
            pages.at(-1).innerHTML += headerOffset.outerHTML;
            occupiedHeight = 0 + headerElement.offsetHeight;
            tableElements = [];
            tableElements.push(tableHeader);
            occupiedHeight += tableHeader.offsetHeight;
            tableElements.push(row);
            occupiedHeight += row.offsetHeight;
          }
        }
        breakTable(pages, element, tableElements);
      } else {
        generatePagesFromGraph(element, pages);
      }
    });
  }

  rerender && generatePagesFromGraph(rootRef.current, pages);

  if (rootRef.current) {
    rootRef.current.innerHTML = '';
    pages.forEach((page) => {
      page.innerHTML =
        headerElement.outerHTML + page.innerHTML + footerElement.outerHTML;
      rootRef.current.innerHTML += page.outerHTML;
    });
  }

  return (
    <div ref={rootRef}>
      {header}
      {children}
      {footer}
    </div>
  );
};
