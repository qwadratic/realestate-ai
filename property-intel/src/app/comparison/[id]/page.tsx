import { ComparisonClient } from "./client";

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ComparisonClient comparisonId={id} />;
}
