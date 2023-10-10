import { useRef, useState } from "react";
import { TableHeader } from "./TableHeader";
import "./App.css";

function App({ rows }) {
    const listHeight = 297 / 0.27; // делим на немного больший коэффициент для надежности

    const pageRef = useRef(); // реф на корневой див с одномерным массивом строк

    const [headerRef, setHeaderRef] = useState(null); // реф на хедер страницы
    const [headerHeight, setHeaderHeight] = useState(0);

    let occupiedHeight = 0; //
    pageRef?.current?.childNodes.forEach((element) => {
        // проверка на переполнение страницы
        if (occupiedHeight + element.offsetHeight > listHeight) {
            occupiedHeight = 0;
            // Проверка на количество защищает от поломки при лишних рендерах (например, при React.StrictMode)
            if (element.childElementCount < 2) {
                element.style.pageBreakBefore = "always"; // перенос элемента, который не влез
                const tableHeader = headerRef.current.cloneNode(true);
                element.insertBefore(tableHeader, element.lastChild);
                occupiedHeight += headerHeight;
            }
        }
        occupiedHeight += element.offsetHeight; // всегда увеличиваем
    });

    return (
        <div ref={pageRef} className="App">
            <div style={{ height: "300px" }}>Header</div>
            <TableHeader
                setHeaderRef={setHeaderRef}
                setHeaderHeight={setHeaderHeight}
            />
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
