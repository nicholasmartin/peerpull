"use client";

import { useEffect } from "react";
import { FLASH_COOKIE_NAME } from "@/lib/constants";

export type FlashMessage = {
  type: "error" | "success";
  message: string;
} | null;

export function FormMessage({ flash }: { flash: FlashMessage }) {
  useEffect(() => {
    if (flash) {
      document.cookie = `${FLASH_COOKIE_NAME}=; path=/; max-age=0`;
    }
  }, [flash]);

  if (!flash) return null;

  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm mt-4">
      {flash.type === "success" && (
        <div className="bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 px-4 py-3 rounded">
          {flash.message}
        </div>
      )}
      {flash.type === "error" && (
        <div className="bg-red-500/10 text-red-400 border-l-4 border-red-500 px-4 py-3 rounded">
          {flash.message}
        </div>
      )}
    </div>
  );
}
