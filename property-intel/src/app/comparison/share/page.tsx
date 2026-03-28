import { Suspense } from "react";
import { ShareComparisonClient } from "./share-client";

export default function ShareComparisonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="text-[18px] text-muted">Laden...</p>
      </div>
    }>
      <ShareComparisonClient />
    </Suspense>
  );
}
