"use client";

import { useBenchmark } from "@/hooks/useBenchmark";

export default function BenchmarkPage() {
    const { data, loading, error, refresh } = useBenchmark();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return null;

    const rows = [
        { label: "Offset (page 4000)", ms: data.pagination.offset_page4000 },
        { label: "Cursor (start)", ms: data.pagination.cursor_start },
        { label: "Filter: SELECT *", ms: data.filter.select_star },
        { label: "Filter: SELECT fields", ms: data.filter.select_fields },
        { label: "Aggregation: Prisma ORM", ms: data.aggregation.prisma_orm },
        { label: "Aggregation: Raw SQL", ms: data.aggregation.raw_sql },
    ];

    return (
        <main>
            <h1>Benchmark</h1>
            <button onClick={refresh}>รันใหม่</button>
            <table>
                <thead>
                    <tr><th>วิธี</th><th>เวลา (ms)</th></tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.label}>
                            <td>{r.label}</td>
                            <td>{r.ms.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
