"use server";

import { revalidatePath } from "next/cache";
import { withAuthenticatedUser } from "@/lib/container";

export async function rateBoulderAction(boulderId: string, stars: number) {
  await withAuthenticatedUser((user, { boulderService }) =>
    boulderService.rateBoulder(boulderId, user.id, stars),
  );
  revalidatePath("/[lang]", "page");
}
