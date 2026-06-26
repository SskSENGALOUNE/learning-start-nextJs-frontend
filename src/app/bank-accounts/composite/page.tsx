"use client";

import { useState } from "react";
import { useCompositeFilter } from "@/hooks/useCompositeFilter";
import { AccountType } from "@/lib/types/bankAccount";
import { SkeletonList } from "@/components/ui/Skeleton";

export default function CompositeFilterPage() {
    const { data, loading, error, run } = useCompositeFilter();
    const [accountType, setAccountType] = useState<AccountType>("SAVINGS");
    const [isActive, setIsActive] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        run(accountType, isActive, 50);
    };

    return (
        <main>
            <h1>Composite Index Filter</h1>
            <form onSubmit={handleSubmit}>
                <select value={accountType} onChange={(e) => setAccountType(e.target.value as AccountType)}>
                    <option value="SAVINGS">SAVINGS</option>
                    <option value="CHECKING">CHECKING</option>
                    <option value="FIXED_DEPOSIT">FIXED_DEPOSIT</option>
                </select>
                <label>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                    />
                    isActive
                </label>
                <button type="submit">Run</button>
            </form>

            {loading && <SkeletonList rows={2} />}
            {error && <p>Error: {error}</p>}
            {data && (
                <table>
                    <thead>
                        <tr><th>วิธี</th><th>count</th><th>ms</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Composite index (accountType+isActive)</td>
                            <td>{data.composite_index.count}</td>
                            <td>{data.composite_index.ms.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>No composite (isActive only)</td>
                            <td>{data.no_composite_index.count}</td>
                            <td>{data.no_composite_index.ms.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            )}
            {data && <p>{data.note}</p>}
        </main>
    );
}
