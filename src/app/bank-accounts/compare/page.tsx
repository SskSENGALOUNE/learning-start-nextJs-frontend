"use client";

import { useState } from "react";
import { useOffsetVsCursor } from "@/hooks/useOffsetVsCursor";
import { Toast } from "@/components/ui/Toast";
import { SkeletonList } from "@/components/ui/Skeleton";

export default function CompareBankAccountsPage() {
    const { offsetResult, cursorResult, loading, error, run } = useOffsetVsCursor(20);
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
            <Toast message={error} />

            <section>
                <h2>Offset (page {page})</h2>
                <p>เวลา: {offsetResult?.ms.toFixed(2)} ms</p>
                {loading ? (
                    <SkeletonList rows={5} />
                ) : (
                    <ul>{offsetResult?.data.map((a) => <li key={a.id}>{a.accountNumber} — {a.bankName}</li>)}</ul>
                )}
            </section>

            <section>
                <h2>Cursor</h2>
                <p>เวลา: {cursorResult?.ms.toFixed(2)} ms</p>
                {loading ? (
                    <SkeletonList rows={5} />
                ) : (
                    <ul>{cursorResult?.data.map((a) => <li key={a.id}>{a.accountNumber} — {a.bankName}</li>)}</ul>
                )}
            </section>

            <button onClick={handleNextPage}>หน้าถัดไป</button>
        </main>
    );
}
