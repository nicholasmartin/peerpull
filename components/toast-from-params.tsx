"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { FLASH_COOKIE_NAME } from "@/lib/constants";

export function FlashToast({ flash }: { flash: { type: "error" | "success"; message: string } | null }) {
  useEffect(() => {
    if (!flash) return;

    document.cookie = `${FLASH_COOKIE_NAME}=; path=/; max-age=0`;

    if (flash.type === "error") {
      toast.error(flash.message, { duration: 8000 });
    } else {
      toast.success(flash.message);
    }
  }, [flash]);

  return null;
}
