"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/context/ThemeContext";
import { useTextSize } from "@/context/TextSizeContext";
import { Moon, Sun } from "lucide-react";

export default function SettingsAppearancePage() {
  const { theme, toggleTheme } = useTheme();
  const { setTextSize } = useTextSize();
  const [selectedSize, setSelectedSize] = useState<"sm" | "md" | "lg">("md");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedSize = localStorage.getItem("textSize");
    if (storedSize === "sm" || storedSize === "md" || storedSize === "lg") {
      setSelectedSize(storedSize);
    }
  }, []);

  const applyTextSize = (size: "sm" | "md" | "lg") => {
    if (!mounted) return;
    setSelectedSize(size);
    setTextSize(size);
  };

  const applyTheme = (newTheme: "light" | "dark") => {
    if (!mounted) return;
    toggleTheme(newTheme);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how PeerPull looks on your device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h3 className="font-medium">Theme</h3>

          <div className="grid grid-cols-2 gap-4 max-w-sm">
            {/* Light Theme Option */}
            <div
              className="flex flex-col items-center space-y-2 cursor-pointer"
              onClick={() => applyTheme("light")}
            >
              <div className={`flex h-20 w-full items-center justify-center rounded-md border-2 ${theme === "light" ? "border-primary" : "border-dark-border"} bg-white`}>
                <Sun className="h-6 w-6 text-gray-800" />
              </div>
              <Label className="text-sm font-normal">Light</Label>
            </div>

            {/* Dark Theme Option */}
            <div
              className="flex flex-col items-center space-y-2 cursor-pointer"
              onClick={() => applyTheme("dark")}
            >
              <div className={`flex h-20 w-full items-center justify-center rounded-md border-2 ${theme === "dark" ? "border-primary" : "border-dark-border"} bg-[#0a0a0b]`}>
                <Moon className="h-6 w-6 text-white" />
              </div>
              <Label className="text-sm font-normal">Dark</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Font Size</h3>

          <div className="grid grid-cols-3 gap-4 max-w-sm">
            <div
              className="flex flex-col items-center space-y-2 cursor-pointer"
              onClick={() => applyTextSize("sm")}
            >
              <div className={`flex h-12 w-full items-center justify-center rounded-md border-2 ${selectedSize === "sm" ? "border-primary" : "border-dark-border"} bg-dark-surface text-sm`}>
                <span>Aa</span>
              </div>
              <Label className="text-sm font-normal">Small</Label>
            </div>

            <div
              className="flex flex-col items-center space-y-2 cursor-pointer"
              onClick={() => applyTextSize("md")}
            >
              <div className={`flex h-12 w-full items-center justify-center rounded-md border-2 ${selectedSize === "md" ? "border-primary" : "border-dark-border"} bg-dark-surface text-base`}>
                <span>Aa</span>
              </div>
              <Label className="text-sm font-normal">Medium</Label>
            </div>

            <div
              className="flex flex-col items-center space-y-2 cursor-pointer"
              onClick={() => applyTextSize("lg")}
            >
              <div className={`flex h-12 w-full items-center justify-center rounded-md border-2 ${selectedSize === "lg" ? "border-primary" : "border-dark-border"} bg-dark-surface text-lg`}>
                <span>Aa</span>
              </div>
              <Label className="text-sm font-normal">Large</Label>
            </div>
          </div>
        </div>

        <Button className="bg-primary hover:bg-primary-muted">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
