"use client";

import { useState } from "react";
import { useOffsetVsCursor } from "@/hooks/useOffsetVsCursor";

export default function CompareBankAccountsPage() {
    const { offsetResult, cursorResult, loading, run } = useOffsetVsCursor(20);
    const [page, setPage] = useState(1);

    const handleNextPage = () => {
        const nextPage = page + 1;
        const lastId = cursorResult?.data.at(-1)?.id;
        setPage(nextPage);
        run(nextPage, lastId);
    };

    return (
        <main>
            <h1>Offset vs Cursor Pagination</h1>
            {loading && <p>Loading...</p>}

            <section>
                <h2>Offset (page {page})</h2>
                <p>เวลา: {offsetResult?.ms.toFixed(2)} ms</p>
                <ul>{offsetResult?.data.map((a) => <li key={a.id}>{a.accountNumber} — {a.bankName}</li>)}</ul>
            </section>

            <section>
                <h2>Cursor</h2>
                <p>เวลา: {cursorResult?.ms.toFixed(2)} ms</p>
                <ul>{cursorResult?.data.map((a) => <li key={a.id}>{a.accountNumber} — {a.bankName}</li>)}</ul>
            </section>

            <button onClick={handleNextPage}>หน้าถัดไป</button>
        </main>
    );
}
