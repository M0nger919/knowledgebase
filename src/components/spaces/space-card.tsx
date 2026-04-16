"use client";

import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import type { Space } from "@/types";

interface SpaceCardProps {
  space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
  return (
    <Link href={`/spaces/${space.id}`}>
      <Card>
        <CardTitle>{space.name}</CardTitle>
        <CardDescription>{space.description || "No description"}</CardDescription>
      </Card>
    </Link>
  );
}
