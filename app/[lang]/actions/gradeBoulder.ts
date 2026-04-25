"use server";

import { revalidatePath } from "next/cache";
import { withAuthenticatedUser } from "@/lib/container";

export async function gradeBoulderAction(boulderId: string, grade: string) {
  await withAuthenticatedUser((user, { boulderService }) =>
    boulderService.gradeBoulder(boulderId, user.id, grade),
  );
  revalidatePath("/[lang]", "page");
}
