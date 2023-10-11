import { useLayoutEffect, useRef, useState } from "react";
import { TableHeader } from "./TableHeader";
import "./App.css";

function App({ rows }) {
    const listHeight = 297 / 0.27; // делим на немного больший коэффициент для надежности

    const pageRef = useRef(); // реф на корневой див с одномерным массивом строк

    const [, setRerender] = useState(false);

    useLayoutEffect(() => {
        setRerender(true);
    }, []);

    let tableHeaderElement;
    let occupiedHeight = 0; //
    pageRef?.current?.childNodes.forEach((element) => {
        const isTableHeader = element.attributes["data-table-header"];
        if (isTableHeader) {
            tableHeaderElement = element.cloneNode(true); //
        }
        // проверка на переполнение страницы
        if (occupiedHeight + element.offsetHeight > listHeight) {
            occupiedHeight = 0;
            // Проверка на количество защищает от поломки при лишних рендерах (например, при React.StrictMode)
            if (element.childElementCount < 2) {
                element.style.pageBreakBefore = "always"; // перенос элемента, который не влез
                const tableHeaderCopy = tableHeaderElement.cloneNode(true);
                element.insertBefore(tableHeaderCopy, element.lastChild);
                occupiedHeight += tableHeaderCopy.offsetHeight;
            }
        }
        occupiedHeight += element.offsetHeight;
    });

    return (
        <div ref={pageRef} className="App">
            <div style={{ height: "300px" }}>Header</div>
            <TableHeader />
            {rows.map((el, index) => (
                // Вложенность необходима для вставки компонента заголовка таблицы
                <div key={index}>
                    <div style={{ height: "150px", border: "1px solid" }}>
                        {el}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default App;
