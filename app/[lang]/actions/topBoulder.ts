"use server";

import { revalidatePath } from "next/cache";
import { withAuthenticatedUser } from "@/lib/container";

export async function topBoulderAction(boulderId: string, topped: boolean) {
  await withAuthenticatedUser((user, { boulderService }) =>
    topped
      ? boulderService.topBoulder(boulderId, user.id)
      : boulderService.untopBoulder(boulderId, user.id),
  );
  revalidatePath("/[lang]", "page");
}
