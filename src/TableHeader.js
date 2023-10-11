import { memo } from "react";

export const TableHeader = memo(() => {
    return (
        <div
            data-table-header="header"
            style={{ height: "150px", border: "1px solid" }}
        >
            Header table
        </div>
    );
});
