import { memo, useLayoutEffect, useRef } from "react";

export const TableHeader = memo(({ setHeaderRef, setHeaderHeight }) => {
    const ref = useRef();
    useLayoutEffect(() => {
        if (ref.current) {
            setHeaderHeight(ref.current.offsetHeight);
            setHeaderRef(ref);
        }
    });
    return (
        <div ref={ref} style={{ height: "150px", border: "1px solid" }}>
            Header table
        </div>
    );
});
