"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSetting } from "./actions";

type Setting = {
  key: string;
  value: string;
  label: string;
  description: string | null;
  updated_at: string;
};

export default function SettingsEditor({ settings }: { settings: Setting[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(settings.map(s => [s.key, s.value]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (key: string) => {
    setSaving(key);
    setError(null);
    const result = await updateSetting(key, values[key]);
    setSaving(null);
    if (result.error) {
      setError(result.error);
    } else {
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}
      {settings.map((setting) => {
        const original = setting.value;
        const current = values[setting.key];
        const isDirty = current !== original;

        return (
          <Card key={setting.key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{setting.label}</CardTitle>
              {setting.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={current}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [setting.key]: e.target.value }))
                  }
                  className="w-32 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={() => handleSave(setting.key)}
                  disabled={!isDirty || saving === setting.key}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    isDirty
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {saving === setting.key ? "Saving..." : saved === setting.key ? "Saved!" : "Save"}
                </button>
                <span className="text-xs text-gray-400 ml-auto">
                  Key: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{setting.key}</code>
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Last updated: {new Date(setting.updated_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
