"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { injectPoints, injectPointsToAll, activateUser, activateAllWaitlisted } from "../actions";
import { toast } from "sonner";

type UserRow = {
  id: string;
  first_name: string;
  last_name: string;
  peer_points_balance: number;
  referral_code: string | null;
  is_admin: boolean;
  status: string;
  created_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [injectAll, setInjectAll] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activating, setActivating] = useState<string | null>(null);

  const loadUsers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, peer_points_balance, referral_code, is_admin, status, created_at")
      .order("created_at", { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleInject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) === 0) return;
    setSubmitting(true);

    let result;
    if (injectAll) {
      result = await injectPointsToAll(Number(amount), reason || "Admin adjustment");
    } else {
      if (!selectedUser) {
        toast.error("Select a user");
        setSubmitting(false);
        return;
      }
      result = await injectPoints(selectedUser, Number(amount), reason || "Admin adjustment");
    }

    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        injectAll
          ? `Injected ${amount} points to all users`
          : `Injected ${amount} points successfully`
      );
      setAmount("");
      setReason("");
      loadUsers();
    }
  };

  if (loading) {
    return <div className="text-dark-text-muted">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inject Points</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInject} className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={injectAll}
                  onChange={(e) => setInjectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-dark-border"
                />
                All users
              </label>
            </div>

            {!injectAll && (
              <div>
                <label className="block text-sm font-medium mb-1">User</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full rounded-md border border-dark-border bg-dark-surface px-3 py-2 text-sm  outline-none"
                >
                  <option value="">Select a user...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name} ({u.peer_points_balance} pts)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5 or -3"
                  className="w-32 rounded-md border border-dark-border bg-dark-surface px-3 py-2 text-sm  outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for adjustment"
                  className="w-full rounded-md border border-dark-border bg-dark-surface px-3 py-2 text-sm  outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary-muted disabled:opacity-50 transition"
            >
              {submitting ? "Injecting..." : "Inject Points"}
            </button>

          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Users ({users.length})</CardTitle>
            {users.some((u) => u.status !== "active") && (
              <button
                onClick={async () => {
                  setActivating("all");
                  const result = await activateAllWaitlisted();
                  setActivating(null);
                  if (result.error) {
                    toast.error(result.error);
                  } else {
                    toast.success("All waitlisted users activated");
                    loadUsers();
                  }
                }}
                disabled={activating !== null}
                className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition"
              >
                {activating === "all" ? "Activating..." : "Activate All Waitlisted"}
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-muted uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-muted uppercase">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-muted uppercase">Referral Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-muted uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-muted uppercase">Admin</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-muted uppercase">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-dark-border/50">
                    <td className="px-4 py-3 font-medium text-dark-text">
                      {u.first_name} {u.last_name}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${u.peer_points_balance > 0 ? "text-green-400" : "text-gray-500"}`}>
                        {u.peer_points_balance}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-dark-surface px-2 py-1 rounded">
                        {u.referral_code || "—"}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs ${
                        u.status === 'active' ? 'text-green-400' : u.status === 'waitlisted' ? 'text-yellow-400' : 'text-blue-400'
                      }`}>
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                          u.status === 'active' ? 'bg-green-400' : u.status === 'waitlisted' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`} />
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.is_admin && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-dark-text-muted">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-dark-text-muted">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {u.status !== 'active' && (
                        <button
                          onClick={async () => {
                            setActivating(u.id);
                            const result = await activateUser(u.id);
                            setActivating(null);
                            if (result.error) {
                              toast.error(result.error);
                            } else {
                              toast.success(`${u.first_name} ${u.last_name} activated`);
                              loadUsers();
                            }
                          }}
                          disabled={activating !== null}
                          className="px-2 py-1 text-xs font-medium bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 disabled:opacity-50 transition"
                        >
                          {activating === u.id ? "..." : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
