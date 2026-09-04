"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useApiMutation, useApiQuery, queryKeys, queryClient } from "@/lib/query";

type Row = Record<string, any>;
const views = [
  "Payment Dashboard",
  "Collections",
  "Receivables",
  "Client Ledger",
  "Reports & Analytics",
];
const modes = ["UPI/Gpay", "Bank Transfer", "Cash", "Cheque", "Other"];
const types = [
  "Advance",
  "First Shoot",
  "Wedding Day",
  "Final Delivery",
  "Refund",
  "Other",
];
const money = (value: any) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
const date = (value: any) => {
  if (!value) return "—";
  const text = String(value);
  if (!text.includes("T")) return text.slice(0, 10);
  const parsed = new Date(text);
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(parsed);
  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
};
const pdfNamePart = (value: any) =>
  String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "unknown";
const printTimestamp = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};
const printWithFilename = (...parts: any[]) => {
  const previousTitle = document.title;
  document.title = [...parts.map(pdfNamePart), printTimestamp()].join("_");
  const restoreTitle = () => {
    document.title = previousTitle;
  };
  window.addEventListener("afterprint", restoreTitle, { once: true });
  window.print();
};
const ageingCategory = (dueDate: string) => {
  if (!dueDate) return "Not Scheduled";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);
  const days = Math.floor((today.getTime() - due.getTime()) / 86400000);
  if (days <= 0 && days >= -7) return "Due Soon";
  if (days >= 1 && days <= 30) return "Overdue 1–30 Days";
  if (days >= 31 && days <= 60) return "Overdue 31–60 Days";
  if (days > 60) return "Overdue 60+ Days";
  return "Scheduled Later";
};
function plan(total: number, received: number, entries: Row[]) {
  let allocated = 0;
  return [10, 40, 40, 10].map((percent, index) => {
    const amount =
      index === 3 ? total - allocated : Math.round((total * percent) / 100);
    const covered = Math.max(0, Math.min(amount, received - allocated));
    allocated += amount;
    const pendingPayment = entries.find(
      (entry) => entry.payment_type === types[index] && entry.status !== "Paid",
    );
    const dueDate = pendingPayment?.due_date || "";
    const today = new Date().toISOString().slice(0, 10);
    const upcomingLimit = new Date();
    upcomingLimit.setDate(upcomingLimit.getDate() + 7);
    const timing =
      dueDate && dueDate < today
        ? "overdue"
        : dueDate && dueDate <= upcomingLimit.toISOString().slice(0, 10)
          ? "upcoming"
          : "";
    return {
      label: types[index],
      percent,
      remaining: Math.max(0, amount - covered),
      due_date: dueDate,
      timing,
      pendingPayment,
    };
  });
}

export default function AccountsWorkspace({
  onAddLead,
  readOnly = false,
}: {
  onAddLead: () => void;
  readOnly?: boolean;
}) {
  const customersQuery = useApiQuery<{ results: Row[] } | Row[]>(
    queryKeys.customers(),
    "/customers/?page_size=500",
  );
  const leadsQuery = useApiQuery<{ results: Row[] } | Row[]>(
    queryKeys.leads(),
    "/leads/?page_size=500&ordering=-created_at",
  );
  const paymentsQuery = useApiQuery<{ results: Row[] } | Row[]>(
    queryKeys.payments(),
    "/payments/?page_size=500&ordering=-paid_at",
  );
  const bookingsQuery = useApiQuery<{ results: Row[] } | Row[]>(
    queryKeys.bookings(),
    "/bookings/?page_size=500",
  );
  const remindersQuery = useApiQuery<{ results: Row[] } | Row[]>(
    queryKeys.paymentReminders(),
    "/payment-reminders/?page_size=500",
  );
  const portalAccessMutation = useApiMutation<any, any, Error>({
    mutationFn: async (payload) => (await api.post("/client-portal/access/", payload)).data,
  });
  const portalAccessDeleteMutation = useApiMutation<any, unknown, Error>({
    mutationFn: async (params) => (await api.delete("/client-portal/access/", { params })).data,
  });
  const portalInviteMutation = useApiMutation<any, any, Error>({
    mutationFn: async (payload) => (await api.post("/client-portal/invitations/", payload)).data,
  });
  const portalInvitePatchMutation = useApiMutation<any, any, Error>({
    mutationFn: async (payload) => (await api.patch("/client-portal/invitations/", payload)).data,
  });
  const portalWhatsappMutation = useApiMutation<any, any, Error>({
    mutationFn: async (payload) => (await api.post("/client-portal/whatsapp/", payload)).data,
  });
  const portalInvitePutMutation = useApiMutation<any, unknown, Error>({
    mutationFn: async (payload) => (await api.put("/client-portal/invitations/", payload)).data,
  });
  const savePaymentMutation = useApiMutation<
    { url: string; payload: any },
    unknown,
    Error
  >({
    mutationFn: async ({ url, payload }) =>
      (await (url ? api.patch(url, payload) : api.post("/payments/", payload))).data,
  });
  const deletePaymentMutation = useApiMutation<{ id: number }, unknown, Error>({
    mutationFn: async ({ id }) => (await api.delete(`/payments/${id}/`)).data,
  });
  const [view, setView] = useState(views[0]),
    [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Row | null>(null),
    [ledgerId, setLedgerId] = useState<number | null>(null);
  const [receiptPayment, setReceiptPayment] = useState<Row | null>(null);
  const [portalBooking, setPortalBooking] = useState<Row | null>(null);
  const [portalInfo, setPortalInfo] = useState<Row | null>(null);
  const [portalLink, setPortalLink] = useState("");
  const [inviteResult, setInviteResult] = useState<Row | null>(null);
  const [whatsappResult, setWhatsappResult] = useState<Row | null>(null);
  const [whatsappType, setWhatsappType] = useState("gallery_ready");
  const [reminder, setReminder] = useState<Row | null>(null);
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const [collectionQuery, setCollectionQuery] = useState("");
  const [collectionStatus, setCollectionStatus] = useState("All");
  const [collectionFrom, setCollectionFrom] = useState("");
  const [collectionTo, setCollectionTo] = useState("");
  const [ageingFilter, setAgeingFilter] = useState("All");
  const [month, setMonth] = useState(() =>
    new Date().toISOString().slice(0, 7),
  );
  const customers = (Array.isArray(customersQuery.data)
    ? customersQuery.data
    : customersQuery.data?.results || []) as Row[],
    leads = (Array.isArray(leadsQuery.data)
      ? leadsQuery.data
      : leadsQuery.data?.results || []) as Row[],
    payments = (Array.isArray(paymentsQuery.data)
      ? paymentsQuery.data
      : paymentsQuery.data?.results || []) as Row[],
    paymentReminders = (Array.isArray(remindersQuery.data)
      ? remindersQuery.data
      : remindersQuery.data?.results || []) as Row[];
  const accounts: Row[] = (
    Array.isArray(bookingsQuery.data)
      ? bookingsQuery.data
      : bookingsQuery.data?.results || []
  ).map((booking): Row => {
    const customer = customers.find((c) => c.id === booking.customer);
    const lead = leads.find((l) => l.id === booking.lead);
    const entries = payments.filter((p) => p.booking === booking.id);
    const paid = entries.filter((p) => p.status === "Paid");
    const reminders = paymentReminders
      .filter((reminder) => reminder.booking === booking.id)
      .sort((first, second) =>
        String(second.reminder_date || second.created_at).localeCompare(
          String(first.reminder_date || first.created_at),
        ),
      );
    const advance = paid.some((p) => p.payment_type === "Advance")
      ? 0
      : Number(lead?.advance_received || 0);
    const received = paid.reduce(
      (sum, p) =>
        sum + Number(p.amount) * (p.payment_type === "Refund" ? -1 : 1),
      advance,
    );
    const total = Number(lead?.total_closing ?? booking.quoted_amount ?? 0);
    return {
      ...booking,
      id: Number(booking.id),
      booking_code: String(booking.booking_code),
      customer: Number(booking.customer),
      event_date: booking.event_date,
      client: customer?.name || lead?.name || booking.booking_code,
      couple: lead?.couple_name,
      contact: customer?.phone || lead?.client_mobile || lead?.mobile || "",
      email: customer?.email || lead?.email || "",
      lead,
      unrecordedAdvance: advance,
      total,
      received,
      balance: Math.max(0, total - received),
      entries,
      reminders,
      lastReminder: reminders[0],
      stages: plan(total, received, entries),
    };
  });
  const openPortal = async (booking: Row) => {
    setPortalBooking(booking);
    setPortalLink("");
    setInviteResult(null);
    setWhatsappResult(null);
    setError("");
    try {
      const { data } = await api.get(
        `/client-portal/access/?booking=${booking.id}`,
      );
      setPortalInfo(data);
    } catch (problem: any) {
      setError(
        problem.response?.data?.detail ||
          "Could not load Client Portal access.",
      );
    }
  };
  const generatePortal = async (days: number) => {
    if (!portalBooking) return;
    const data = await portalAccessMutation.mutateAsync({
      booking: portalBooking.id,
      expiry_days: days,
    });
    setPortalLink(data.url);
    setPortalInfo(data);
  };
  const revokePortal = async () => {
    if (!portalBooking || !window.confirm("Revoke this Client Portal link?"))
      return;
    await api.delete("/client-portal/access/", {
      data: { booking: portalBooking.id },
    });
    setPortalLink("");
    await openPortal(portalBooking);
  };
  const inviteClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!portalBooking) return;
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    const data = await portalInviteMutation.mutateAsync({
      booking: portalBooking.id,
      ...payload,
    });
    setInviteResult(data);
    await openPortal(portalBooking);
    setInviteResult(data);
  };
  const changeClientAccess = async (
    user: Row,
    action: "reset" | "disable" | "enable",
  ) => {
    if (
      (action === "disable" || action === "reset") &&
      !window.confirm(
        `${action === "disable" ? "Disable access" : "Reset password"} for ${user.email}?`,
      )
    )
      return;
    const data = await portalInvitePatchMutation.mutateAsync({
      user: user.id,
      action,
    });
    if (data.url) setInviteResult({ url: data.url });
    if (portalBooking) await openPortal(portalBooking);
    if (data.url) setInviteResult({ url: data.url });
  };
  const prepareWhatsApp = async (event = "prepared") => {
    if (!portalBooking) return;
    const data = await portalWhatsappMutation.mutateAsync({
      booking: portalBooking.id,
      message_type: whatsappType,
      event,
    });
    setWhatsappResult(data);
    return data;
  };
  const copyWhatsApp = async () => {
    const data = whatsappResult || (await prepareWhatsApp());
    if (!data) return;
    await navigator.clipboard.writeText(data.message);
    await prepareWhatsApp("copied");
  };
  const copyInvitation = async () => {
    if (!inviteResult?.url || !portalBooking) return;
    await navigator.clipboard.writeText(inviteResult.url);
    await portalInvitePutMutation.mutateAsync({ booking: portalBooking.id });
  };
  const shown = accounts.filter((a) =>
    `${a.client} ${a.couple || ""} ${a.booking_code}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const collectionPayments = payments.filter((payment) => {
    const account = accounts.find((item) => item.id === payment.booking);
    const paymentDate = date(
      payment.paid_at || payment.due_date || payment.created_at,
    );
    const matchesQuery =
      `${account?.client || payment.client_name || ""} ${account?.booking_code || payment.booking_code || ""} ${payment.payment_type || ""} ${payment.payment_mode || ""} ${payment.received_by || ""}`
        .toLowerCase()
        .includes(collectionQuery.trim().toLowerCase());
    return (
      matchesQuery &&
      (collectionStatus === "All" || payment.status === collectionStatus) &&
      (!collectionFrom || paymentDate >= collectionFrom) &&
      (!collectionTo || paymentDate <= collectionTo)
    );
  });
  const ageingRows = accounts.flatMap((account) =>
    account.stages
      .filter((stage: Row) => stage.remaining > 0)
      .map((stage: Row) => ({
        account,
        stage,
        category: ageingCategory(stage.due_date),
      })),
  );
  const ageingAmount = (category: string) =>
    ageingRows
      .filter((row) => row.category === category)
      .reduce((total, row) => total + Number(row.stage.remaining || 0), 0);
  const displayedAccounts = shown.filter(
    (account) =>
      view !== "Receivables" ||
      (account.balance > 0 &&
        (ageingFilter === "All" ||
          account.stages.some(
            (stage: Row) =>
              stage.remaining > 0 &&
              ageingCategory(stage.due_date) === ageingFilter,
          ))),
  );
  const exportAgeing = () => {
    const safe = (value: any) => {
      const text = String(value ?? "");
      const protectedText = /^[=+\-@]/.test(text) ? `'${text}` : text;
      return `"${protectedText.replaceAll('"', '""')}"`;
    };
    const reportRows = [
      [
        "Client",
        "Booking",
        "Contact",
        "Milestone",
        "Due Date",
        "Ageing",
        "Amount Due",
        "Total Outstanding",
      ],
      ...ageingRows.map((row) => [
        row.account.client,
        row.account.booking_code,
        row.account.contact,
        row.stage.label,
        row.stage.due_date || "Not set",
        row.category,
        row.stage.remaining,
        row.account.balance,
      ]),
    ];
    const blob = new Blob(
      [
        `\uFEFF${reportRows.map((row) => row.map(safe).join(",")).join("\r\n")}`,
      ],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receivables-ageing-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const reportPayments = payments.filter((p) =>
    String(p.paid_at || p.created_at).startsWith(month),
  );
  const paid = payments.filter(
    (p) => p.status === "Paid" && p.payment_type !== "Refund",
  );
  const sum = (items: Row[]) =>
    items.reduce((n, p) => n + Number(p.amount || 0), 0);
  const selectedLedger = accounts.find((a) => a.id === ledgerId);
  const ledgerEntries: Row[] = (() => {
    if (!selectedLedger) return [];
    const transactions: Row[] = [
      {
        id: "booking-value",
        date: selectedLedger.created_at || selectedLedger.event_date,
        description: `Booking value · ${selectedLedger.booking_code}`,
        type: "Invoice",
        debit: selectedLedger.total,
        credit: 0,
        mode: "—",
      },
    ];
    if (selectedLedger.unrecordedAdvance > 0) {
      transactions.push({
        id: "lead-advance",
        date:
          selectedLedger.lead?.payment_received_date ||
          selectedLedger.lead?.created_at,
        description: "Advance payment received with lead confirmation",
        type: "Advance",
        debit: 0,
        credit: selectedLedger.unrecordedAdvance,
        mode: selectedLedger.lead?.payment_mode || "—",
        receivedBy: selectedLedger.lead?.received_by || "—",
      });
    }
    selectedLedger.entries
      .filter((entry: Row) => entry.status === "Paid")
      .sort((a: Row, b: Row) =>
        String(a.paid_at || a.created_at).localeCompare(
          String(b.paid_at || b.created_at),
        ),
      )
      .forEach((entry: Row) =>
        transactions.push({
          id: entry.id,
          payment: entry,
          date: entry.paid_at || entry.created_at,
          description:
            entry.notes ||
            (entry.payment_type === "Refund"
              ? "Payment refund"
              : `${entry.payment_type || "Payment"} received`),
          type: entry.payment_type,
          debit: entry.payment_type === "Refund" ? Number(entry.amount) : 0,
          credit: entry.payment_type === "Refund" ? 0 : Number(entry.amount),
          mode: entry.payment_mode || "—",
          receivedBy: entry.received_by || "—",
        }),
      );
    let balance = 0;
    return transactions.map((entry) => {
      balance += Number(entry.debit || 0) - Number(entry.credit || 0);
      return { ...entry, balance: Math.max(0, balance) };
    });
  })();
  const openPayment = (value: Row = {}) => {
    setError("");
    setDraft({
      status: "Paid",
      payment_type: "Advance",
      payment_mode: "UPI/Gpay",
      ...value,
    });
  };
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const booking = accounts.find((a) => a.id === Number(values.booking));
    const payload = {
      ...values,
      booking: booking?.id,
      customer: booking?.customer,
      due_date: values.due_date || null,
      paid_at: values.paid_at
        ? new Date(String(values.paid_at)).toISOString()
        : null,
    };
    try {
      await savePaymentMutation.mutateAsync({
        url: draft?.id ? `/payments/${draft.id}/` : "",
        payload,
      });
      setDraft(null);
    } catch (e: any) {
      setError(JSON.stringify(e.response?.data || "Could not save payment."));
    } finally {
      setBusy(false);
    }
  };
  const remove = async (payment: Row) => {
    if (
      !confirm(
        `Delete this ${money(payment.amount)} payment? The client balance will change.`,
      )
    )
      return;
    try {
      await deletePaymentMutation.mutateAsync({ id: payment.id });
    } catch {
      setError("Could not delete payment.");
    }
  };
  const paymentTable = (items: Row[]) => (
    <div className="table">
      <table className="paymentTable">
        <thead>
          <tr>
            {[
              "Client",
              "Amount",
              "Type",
              "Mode",
              "Status",
              "Date",
              "Received By",
              "Actions",
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>
                {accounts.find((a) => a.id === p.booking)?.client ||
                  p.client_name ||
                  "—"}
              </td>
              <td>{money(p.amount)}</td>
              <td>{p.payment_type}</td>
              <td>{p.payment_mode || "—"}</td>
              <td>{p.status}</td>
              <td>{date(p.paid_at || p.due_date || p.created_at)}</td>
              <td>{p.received_by || "—"}</td>
              <td>
                <div className="rowActions">
                  {p.status === "Paid" && (
                    <button
                      className="receiptAction"
                      title="View receipt"
                      aria-label="View receipt"
                      onClick={() => setReceiptPayment(p)}
                    >
                      ▤
                    </button>
                  )}
                  {!readOnly && (
                    <>
                      <button
                        className="editAction"
                        title="Edit payment"
                        aria-label="Edit payment"
                        onClick={() => openPayment(p)}
                      >
                        ✎
                      </button>
                      <button
                        className="deleteAction"
                        title="Delete payment"
                        aria-label="Delete payment"
                        onClick={() => remove(p)}
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!items.length && <div className="empty">No payments recorded.</div>}
    </div>
  );
  const metrics = (labels: [string, string | number][]) => (
    <section className="accountMetrics">
      {labels.map(([label, value]) => (
        <article key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
    </section>
  );
  const breakdown = (
    title: string,
    keys: string[],
    field: string,
    items: Row[],
  ) => (
    <section className="panel accountBreakdown">
      <h2>{title}</h2>
      {keys.map((key) => (
        <div key={key}>
          <span>{key}</span>
          <b>{money(sum(items.filter((p) => p[field] === key)))}</b>
        </div>
      ))}
    </section>
  );
  return (
    <div className="accountsWorkspace">
      <header className="salesTop">
        <div>
          <small>ACCOUNTS</small>
          <h1>{view}</h1>
          <p>Collections, dues, and client balances.</p>
        </div>
      </header>
      <nav className="operationsTabs">
        {views.map((item) => (
          <button
            key={item}
            className={view === item ? "active" : ""}
            onClick={() => setView(item)}
          >
            {item}
          </button>
        ))}
      </nav>
      {error && !draft && (
        <p role="status" className="formError">
          {error}
        </p>
      )}
      {!accounts.length && (
        <p className="accountHint">
          Enter client details in Sales, choose Confirmed and save to create the
          booking automatically. Then return here to record payments.{" "}
          {!readOnly && (
            <button type="button" className="primary" onClick={onAddLead}>
              ＋ Add Client / Lead
            </button>
          )}
        </p>
      )}
      {view === "Payment Dashboard" && (
        <>
          {metrics([
            ["Collected", money(sum(paid))],
            [
              "Refunded",
              money(
                sum(
                  payments.filter(
                    (p) => p.status === "Paid" && p.payment_type === "Refund",
                  ),
                ),
              ),
            ],
            ["Receivable", money(accounts.reduce((n, a) => n + a.balance, 0))],
            [
              "Advance",
              money(sum(paid.filter((p) => p.payment_type === "Advance"))),
            ],
          ])}
          <section className="panel">
            <div className="panelHead">
              <h2>Recent Payments</h2>
              <button
                className="iconOnlyAction viewAction"
                title="View all payments"
                aria-label="View all payments"
                onClick={() => setView("Collections")}
              >
                ◉
              </button>
            </div>
            {paymentTable(payments.slice(0, 8))}
          </section>
          <div className="accountColumns">
            {breakdown("Payment Modes", modes, "payment_mode", paid)}
            <section className="panel accountBreakdown">
              <h2>Overdue Payments</h2>
              {payments
                .filter(
                  (p) =>
                    p.status !== "Paid" &&
                    p.due_date &&
                    p.due_date < new Date().toISOString().slice(0, 10),
                )
                .map((p) => (
                  <div key={p.id}>
                    <span>
                      {accounts.find((a) => a.id === p.booking)?.client} ·{" "}
                      {date(p.due_date)}
                    </span>
                    <b>{money(p.amount)}</b>
                  </div>
                ))}
            </section>
          </div>
        </>
      )}
      {view === "Collections" && (
        <section className="panel">
          <div className="collectionFilters">
            <input
              aria-label="Search collections"
              placeholder="Search client, booking, type, mode…"
              value={collectionQuery}
              onChange={(event) => setCollectionQuery(event.target.value)}
            />
            <select
              aria-label="Filter collection status"
              value={collectionStatus}
              onChange={(event) => setCollectionStatus(event.target.value)}
            >
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
            <label>
              From
              <input
                type="date"
                value={collectionFrom}
                onChange={(event) => setCollectionFrom(event.target.value)}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={collectionTo}
                onChange={(event) => setCollectionTo(event.target.value)}
              />
            </label>
            <button
              type="button"
              className="iconOnlyAction clearAction"
              title="Clear filters"
              aria-label="Clear filters"
              onClick={() => {
                setCollectionQuery("");
                setCollectionStatus("All");
                setCollectionFrom("");
                setCollectionTo("");
              }}
            >
              ↺
            </button>
          </div>
          {paymentTable(collectionPayments)}
        </section>
      )}
      {(view === "Receivables" || view === "Client Ledger") && (
        <>
          <div className="receivablesTools">
            <input
              className="accountSearch"
              aria-label="Search client accounts"
              placeholder="Search client, couple, or booking…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {view === "Receivables" && (
              <>
                <select
                  aria-label="Filter receivables ageing"
                  value={ageingFilter}
                  onChange={(event) => setAgeingFilter(event.target.value)}
                >
                  <option>All</option>
                  <option>Due Soon</option>
                  <option>Overdue 1–30 Days</option>
                  <option>Overdue 31–60 Days</option>
                  <option>Overdue 60+ Days</option>
                  <option>Scheduled Later</option>
                  <option>Not Scheduled</option>
                </select>
                <button
                  type="button"
                  className="iconOnlyAction exportAction"
                  title="Export receivables ageing"
                  aria-label="Export receivables ageing"
                  onClick={exportAgeing}
                >
                  ⇩
                </button>
              </>
            )}
          </div>
          {view === "Receivables" &&
            metrics([
              ["Due Soon", money(ageingAmount("Due Soon"))],
              ["Overdue 1–30", money(ageingAmount("Overdue 1–30 Days"))],
              ["Overdue 31–60", money(ageingAmount("Overdue 31–60 Days"))],
              ["Overdue 60+", money(ageingAmount("Overdue 60+ Days"))],
            ])}
          {view === "Client Ledger" &&
            metrics([
              ["Client Accounts", shown.length],
              ["Total Closing", money(shown.reduce((n, a) => n + a.total, 0))],
              [
                "Total Received",
                money(shown.reduce((n, a) => n + a.received, 0)),
              ],
              [
                "Total Balance",
                money(shown.reduce((n, a) => n + a.balance, 0)),
              ],
            ])}
          <section className="panel table">
            <table
              className={`accountsScheduleTable ${
                view === "Receivables"
                  ? "receivablesTable"
                  : "clientLedgerTable"
              }`}
            >
              <thead>
                <tr>
                  {[
                    "Event Date",
                    "Client / Couple",
                    "Total Closing",
                    "Received",
                    "Balance",
                    "Payment Schedule",
                    "Last Reminder",
                    "Reminder Count",
                    "Actions",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedAccounts.map((a) => (
                  <tr
                    key={a.id}
                    className={
                      a.lastReminder?.next_followup_date &&
                      a.lastReminder.next_followup_date <=
                        new Date().toISOString().slice(0, 10)
                        ? "followupDueRow"
                        : ""
                    }
                  >
                    <td>{date(a.event_date)}</td>
                    <td>
                      <b>{a.client}</b>
                      <small>{a.couple}</small>
                    </td>
                    <td>{money(a.total)}</td>
                    <td>{money(a.received)}</td>
                    <td>{money(a.balance)}</td>
                    <td>
                      <div className="accountPlan">
                        {a.stages.map((s: Row) => (
                          <span
                            key={s.label}
                            className={`${s.remaining ? "" : "paid"} ${s.timing || ""}`}
                          >
                            <small>
                              {s.label} · {s.percent}%
                            </small>
                            <b>{s.remaining ? money(s.remaining) : "Paid"}</b>
                            {s.remaining > 0 && (
                              <small className="milestoneDue">
                                {s.due_date
                                  ? `${s.timing === "overdue" ? "Overdue" : s.timing === "upcoming" ? "Upcoming" : "Due"} · ${date(s.due_date)}`
                                  : "Due date not set"}
                              </small>
                            )}
                            {view === "Receivables" &&
                              s.remaining > 0 &&
                              !readOnly && (
                                <button
                                  type="button"
                                  className="milestoneDateButton"
                                  onClick={() =>
                                    openPayment(
                                      s.pendingPayment || {
                                        booking: a.id,
                                        amount: s.remaining,
                                        payment_type: s.label,
                                        status: "Pending",
                                        due_date: "",
                                      },
                                    )
                                  }
                                >
                                  {s.due_date
                                    ? "Edit Due Date"
                                    : "Set Due Date"}
                                </button>
                              )}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {a.lastReminder ? (
                        <>
                          <b>{date(a.lastReminder.reminder_date)}</b>
                          <small>{a.lastReminder.payment_type}</small>
                          {a.lastReminder.next_followup_date && (
                            <small
                              className={
                                a.lastReminder.next_followup_date <=
                                new Date().toISOString().slice(0, 10)
                                  ? "followupDueText"
                                  : ""
                              }
                            >
                              Follow-up{" "}
                              {date(a.lastReminder.next_followup_date)}
                            </small>
                          )}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <b>{a.reminders.length}</b>
                    </td>
                    <td>
                      <div className="rowActions receivableActions">
                        {view === "Receivables" && !readOnly && (
                          <button
                            className="reminderAction"
                            title="Payment reminder"
                            aria-label="Payment reminder"
                            onClick={() => {
                              const stage =
                                a.stages.find(
                                  (item: Row) =>
                                    item.remaining > 0 &&
                                    item.timing === "overdue",
                                ) ||
                                a.stages.find(
                                  (item: Row) =>
                                    item.remaining > 0 && item.due_date,
                                ) ||
                                a.stages.find(
                                  (item: Row) => item.remaining > 0,
                                );
                              setReminder({ account: a, stage });
                            }}
                          >
                            ◷
                          </button>
                        )}
                        {!readOnly && (
                          <button
                            className="paymentAction"
                            title="Record payment"
                            aria-label="Record payment"
                            onClick={() =>
                              openPayment(
                                (() => {
                                  const stage = a.stages.find(
                                    (item: Row) => item.remaining > 0,
                                  );
                                  return stage?.pendingPayment
                                    ? {
                                        ...stage.pendingPayment,
                                        status: "Paid",
                                      }
                                    : {
                                        booking: a.id,
                                        amount: stage?.remaining || "",
                                        payment_type: stage?.label || "Other",
                                      };
                                })(),
                              )
                            }
                          >
                            ₹
                          </button>
                        )}
                        <button
                          className="ledgerAction"
                          title="View ledger"
                          aria-label="View ledger"
                          onClick={() => setLedgerId(a.id)}
                        >
                          ≣
                        </button>
                        <button
                          className="portalAction"
                          title="Client Portal"
                          aria-label="Client Portal"
                          onClick={() => void openPortal(a)}
                        >
                          ⌁
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!displayedAccounts.length && (
              <div className="empty">No client accounts found.</div>
            )}
          </section>
        </>
      )}
      {view === "Reports & Analytics" && (
        <>
          <label className="accountReportMonth">
            Report month
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </label>
          {metrics([
            [
              "Collected",
              money(
                sum(
                  reportPayments.filter(
                    (p) => p.status === "Paid" && p.payment_type !== "Refund",
                  ),
                ),
              ),
            ],
            [
              "Refunded",
              money(
                sum(
                  reportPayments.filter(
                    (p) => p.status === "Paid" && p.payment_type === "Refund",
                  ),
                ),
              ),
            ],
            [
              "Pending",
              money(sum(reportPayments.filter((p) => p.status !== "Paid"))),
            ],
            ["Payments", reportPayments.length],
          ])}
          <div className="accountColumns">
            {breakdown(
              "By Payment Mode",
              modes,
              "payment_mode",
              reportPayments.filter(
                (p) => p.status === "Paid" && p.payment_type !== "Refund",
              ),
            )}
            {breakdown(
              "By Payment Milestone",
              types,
              "payment_type",
              reportPayments.filter((p) => p.status === "Paid"),
            )}
          </div>
          <section className="panel">{paymentTable(reportPayments)}</section>
        </>
      )}
      {portalBooking && (
        <div className="modalBackdrop">
          <section className="accountModal clientPortalAccessModal">
            <div className="modalHeader">
              <div>
                <small>CLIENT PORTAL</small>
                <h2>{portalBooking.client}</h2>
                <p>Secure gallery, payment and permanent client access.</p>
              </div>
              <button onClick={() => setPortalBooking(null)}>×</button>
            </div>
            <div className="clientPortalAccessBody">
              <div className="statementMetrics">
                <article>
                  <span>Link Status</span>
                  <b>{portalInfo?.status || "Loading…"}</b>
                </article>
                <article>
                  <span>Expires</span>
                  <b>{date(portalInfo?.expires_at)}</b>
                </article>
                <article>
                  <span>Last Opened</span>
                  <b>{date(portalInfo?.last_accessed_at)}</b>
                </article>
                <article>
                  <span>Opens</span>
                  <b>{portalInfo?.access_count || 0}</b>
                </article>
              </div>
              <section className="clientAccessSection">
                <h3>Quick Secure Link</h3>
                <label>
                  Link validity
                  <select id="portal-days" defaultValue="60">
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                  </select>
                </label>
                {portalLink && (
                  <label>
                    Secure link
                    <input readOnly value={portalLink} />
                  </label>
                )}
                <div className="modalFooter">
                  <button
                    className="primary"
                    onClick={() =>
                      void generatePortal(
                        Number(
                          (
                            document.getElementById(
                              "portal-days",
                            ) as HTMLSelectElement
                          )?.value || 60,
                        ),
                      )
                    }
                  >
                    ↻ Generate
                  </button>
                  <button
                    disabled={!portalLink}
                    onClick={() =>
                      void navigator.clipboard.writeText(portalLink)
                    }
                  >
                    ⧉ Copy
                  </button>
                  <button
                    className="danger"
                    disabled={portalInfo?.status === "Not Generated"}
                    onClick={() => void revokePortal()}
                  >
                    × Revoke
                  </button>
                </div>
              </section>
              <section className="clientAccessSection">
                <h3>WhatsApp Message Center</h3>
                <div className="whatsappComposer">
                  <select
                    value={whatsappType}
                    onChange={(event) => {
                      setWhatsappType(event.target.value);
                      setWhatsappResult(null);
                    }}
                  >
                    <option value="gallery_ready">Gallery Ready</option>
                    <option value="payment_reminder">Payment Reminder</option>
                    <option value="login">Client Portal Login</option>
                    <option value="approval_confirmation">Approval Confirmation</option>
                    <option value="revision_acknowledgement">Revision Acknowledgement</option>
                  </select>
                  <button className="primary" onClick={() => void prepareWhatsApp()}>
                    Generate Message
                  </button>
                </div>
                {whatsappResult && (
                  <>
                    <textarea rows={8} readOnly value={whatsappResult.message} />
                    <div className="clientInviteResult">
                      <button onClick={() => void copyWhatsApp()}>⧉ Copy Message</button>
                      <a href={whatsappResult.whatsapp_url} target="_blank" rel="noopener noreferrer" onClick={() => void prepareWhatsApp("opened")}>
                        ◉ Open WhatsApp
                      </a>
                    </div>
                  </>
                )}
              </section>
              <section className="clientAccessSection">
                <h3>Invite Client</h3>
                <form className="clientInviteForm" onSubmit={inviteClient}>
                  <label>
                    Client Name *
                    <input
                      name="name"
                      required
                      defaultValue={portalBooking.client}
                    />
                  </label>
                  <label>
                    Email *
                    <input
                      name="email"
                      type="email"
                      required
                      defaultValue={portalBooking.email}
                    />
                  </label>
                  <label>
                    Mobile Number *
                    <input
                      name="mobile"
                      required
                      defaultValue={portalBooking.contact}
                    />
                  </label>
                  <button className="primary">✉ Generate Invitation</button>
                </form>
                {inviteResult?.url && (
                  <div className="clientInviteResult">
                    <input readOnly value={inviteResult.url} />
                    <button onClick={() => void copyInvitation()}>
                      ⧉ Copy
                    </button>
                    {inviteResult.whatsapp_url && (
                      <a
                        href={inviteResult.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ◉ WhatsApp
                      </a>
                    )}
                  </div>
                )}
                {(portalInfo?.portal_users || []).map((user: Row) => (
                  <div className="clientUserRow" key={user.id}>
                    <div>
                      <b>{user.name}</b>
                      <span>
                        {user.email} · {user.mobile || "No mobile"}
                      </span>
                      <small>
                        {user.active ? "Active" : "Disabled"}
                        {user.last_login_at
                          ? ` · Last login ${date(user.last_login_at)}`
                          : " · Never logged in"}
                      </small>
                    </div>
                    <div>
                      <button
                        title="Reset password"
                        onClick={() => void changeClientAccess(user, "reset")}
                      >
                        ↻
                      </button>
                      <button
                        title={user.active ? "Disable access" : "Enable access"}
                        onClick={() =>
                          void changeClientAccess(
                            user,
                            user.active ? "disable" : "enable",
                          )
                        }
                      >
                        {user.active ? "×" : "▶"}
                      </button>
                    </div>
                  </div>
                ))}
              </section>
              <section className="clientAccessSection">
                <h3>Recent Access & Invitations</h3>
                {(portalInfo?.activities || []).map(
                  (activity: Row, index: number) => (
                    <div className="clientPortalAudit" key={index}>
                      <b>{activity.action}</b>
                      <span>{activity.detail}</span>
                      <small>{date(activity.created_at)}</small>
                    </div>
                  ),
                )}
              </section>
            </div>
          </section>
        </div>
      )}
      {selectedLedger && (
        <div className="modalBackdrop statementBackdrop">
          <section className="accountModal clientStatementModal">
            <div className="clientStatementPrintArea">
              <div className="modalHeader statementHeader">
                <div>
                  <small>LENSPIRE CRM · CLIENT STATEMENT</small>
                  <h2>{selectedLedger.client}</h2>
                  <p>
                    {selectedLedger.booking_code} · {selectedLedger.event_type}
                    {selectedLedger.event_date
                      ? ` · Event ${date(selectedLedger.event_date)}`
                      : ""}
                  </p>
                </div>
                <button
                  className="statementClose"
                  aria-label="Close ledger"
                  onClick={() => setLedgerId(null)}
                >
                  ×
                </button>
              </div>
              <div className="statementMetrics">
                <article>
                  <span>Total Closing</span>
                  <b>{money(selectedLedger.total)}</b>
                </article>
                <article>
                  <span>Total Received</span>
                  <b>{money(selectedLedger.received)}</b>
                </article>
                <article>
                  <span>Outstanding</span>
                  <b>{money(selectedLedger.balance)}</b>
                </article>
                <article className="overdueMetric">
                  <span>Overdue</span>
                  <b>
                    {money(
                      selectedLedger.stages
                        .filter((stage: Row) => stage.timing === "overdue")
                        .reduce(
                          (total: number, stage: Row) =>
                            total + Number(stage.remaining || 0),
                          0,
                        ),
                    )}
                  </b>
                </article>
              </div>
              <div className="table ledgerTable statementLedgerTable">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Particulars</th>
                      <th>Type</th>
                      <th>Mode</th>
                      <th>Received By</th>
                      <th>Debit (Dr.)</th>
                      <th>Credit (Cr.)</th>
                      <th>Balance</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerEntries.map((entry) => (
                      <tr key={entry.id}>
                        <td>{date(entry.date)}</td>
                        <td>
                          <b>{entry.description}</b>
                        </td>
                        <td>{entry.type}</td>
                        <td>{entry.mode}</td>
                        <td>{entry.receivedBy || "—"}</td>
                        <td className="ledgerDebit">
                          {entry.debit ? money(entry.debit) : "—"}
                        </td>
                        <td className="ledgerCredit">
                          {entry.credit ? money(entry.credit) : "—"}
                        </td>
                        <td>
                          <b>{money(entry.balance)}</b>
                        </td>
                        <td>
                          {entry.payment && !readOnly ? (
                            <button
                              className="dangerButton"
                              title="Delete ledger payment"
                              aria-label="Delete ledger payment"
                              onClick={() => remove(entry.payment)}
                            >
                              ×
                            </button>
                          ) : (
                            <small>Recorded</small>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={5}>Account Total</th>
                      <th>
                        {money(
                          ledgerEntries.reduce(
                            (sum, entry) => sum + Number(entry.debit || 0),
                            0,
                          ),
                        )}
                      </th>
                      <th>
                        {money(
                          ledgerEntries.reduce(
                            (sum, entry) => sum + Number(entry.credit || 0),
                            0,
                          ),
                        )}
                      </th>
                      <th>{money(selectedLedger.balance)}</th>
                      <th></th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <section className="statementSchedule">
                <h3>Payment Schedule</h3>
                <div>
                  {selectedLedger.stages.map((stage: Row) => (
                    <article
                      key={stage.label}
                      className={`${stage.remaining ? "" : "paid"} ${stage.timing || ""}`}
                    >
                      <span>
                        {stage.label} · {stage.percent}%
                      </span>
                      <b>{stage.remaining ? money(stage.remaining) : "Paid"}</b>
                      <small>
                        {stage.remaining
                          ? stage.due_date
                            ? `${stage.timing === "overdue" ? "Overdue" : stage.timing === "upcoming" ? "Upcoming" : "Due"} · ${date(stage.due_date)}`
                            : "Due date not set"
                          : "Completed"}
                      </small>
                    </article>
                  ))}
                </div>
              </section>
              <p className="statementFooterNote">
                Statement generated by Lenspire CRM on{" "}
                {date(new Date().toISOString())}.
              </p>
            </div>
            <div className="modalFooter">
              <button onClick={() => setLedgerId(null)}>Close</button>
              <button
                className="primary"
                onClick={() =>
                  printWithFilename(
                    "Client-Ledger",
                    selectedLedger.client,
                    selectedLedger.booking_code,
                  )
                }
              >
                Print / Save as PDF
              </button>
            </div>
          </section>
        </div>
      )}
      {receiptPayment && (
        <PaymentReceipt
          payment={receiptPayment}
          account={accounts.find(
            (account) => account.id === receiptPayment.booking,
          )}
          close={() => setReceiptPayment(null)}
        />
      )}
      {reminder && (
        <PaymentReminder
          account={reminder.account}
          stage={reminder.stage}
          customerId={reminder.account.customer}
          onLogged={() => queryClient.invalidateQueries({ queryKey: queryKeys.payments() })}
          close={() => setReminder(null)}
        />
      )}
      {draft && (
        <div className="modalBackdrop">
          <form className="accountModal paymentModal" onSubmit={save}>
            <div className="modalHeader">
              <div>
                <small>RECORD PAYMENT</small>
                <h2>{draft.id ? "Edit Payment" : "Add Payment"}</h2>
                <p>Record the client’s payment against their booking.</p>
              </div>
              <button
                type="button"
                aria-label="Close payment form"
                onClick={() => setDraft(null)}
              >
                ×
              </button>
            </div>
            <div className="leadFormGrid">
              <label className="wide">
                Client / Booking
                <select
                  name="booking"
                  required
                  defaultValue={draft.booking || ""}
                >
                  <option value="">Select a booking</option>
                  {accounts.map((a) => (
                    <option value={a.id} key={a.id}>
                      {a.client} · {a.booking_code}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Amount
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  defaultValue={draft.amount || ""}
                />
              </label>
              <label>
                Payment Type
                <select name="payment_type" defaultValue={draft.payment_type}>
                  {types.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label>
                Payment Mode
                <select name="payment_mode" defaultValue={draft.payment_mode}>
                  {modes.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </label>
              <label>
                Status
                <select name="status" defaultValue={draft.status}>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Overdue</option>
                </select>
              </label>
              <label>
                Received By
                <input
                  name="received_by"
                  defaultValue={draft.received_by || ""}
                />
              </label>
              <label>
                Paid At
                <input
                  name="paid_at"
                  type="datetime-local"
                  defaultValue={
                    draft.paid_at
                      ? new Date(
                          new Date(draft.paid_at).getTime() -
                            new Date(draft.paid_at).getTimezoneOffset() * 60000,
                        )
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                />
              </label>
              <label>
                Due Date
                <input
                  name="due_date"
                  type="date"
                  defaultValue={draft.due_date || ""}
                />
              </label>
              <label className="wide">
                Notes
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={draft.notes || ""}
                />
              </label>
            </div>
            {error && (
              <p className="formError" role="alert">
                {error}
              </p>
            )}
            <div className="modalFooter">
              <button
                type="button"
                disabled={busy}
                onClick={() => setDraft(null)}
              >
                Cancel
              </button>
              <button className="primary" disabled={busy}>
                {busy ? "Saving…" : "Save Payment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function PaymentReceipt({
  payment,
  account,
  close,
}: {
  payment: Row;
  account?: Row;
  close: () => void;
}) {
  const isRefund = payment.payment_type === "Refund";
  return (
    <div className="modalBackdrop receiptBackdrop">
      <section className="accountModal receiptModal">
        <div className="receiptPrintArea">
          <div className="receiptHeading">
            <div>
              <small>LENSPIRE CRM</small>
              <h2>{isRefund ? "Refund Receipt" : "Payment Receipt"}</h2>
            </div>
            <b>#{`PAY-${String(payment.id).padStart(5, "0")}`}</b>
          </div>
          <div className="receiptDetails">
            <span>Received from</span>
            <strong>{account?.client || payment.client_name || "—"}</strong>
            <span>Booking</span>
            <strong>
              {account?.booking_code || payment.booking_code || "—"}
            </strong>
            <span>Payment date</span>
            <strong>{date(payment.paid_at || payment.created_at)}</strong>
            <span>Payment type</span>
            <strong>{payment.payment_type || "Payment"}</strong>
            <span>Payment mode</span>
            <strong>{payment.payment_mode || "—"}</strong>
            <span>Received by</span>
            <strong>{payment.received_by || "—"}</strong>
          </div>
          <div className="receiptAmount">
            <span>{isRefund ? "Amount Refunded" : "Amount Received"}</span>
            <strong>{money(payment.amount)}</strong>
          </div>
          {payment.notes && (
            <p className="receiptNotes">
              <b>Notes:</b> {payment.notes}
            </p>
          )}
          <p className="receiptThanks">
            {isRefund
              ? "Refund recorded successfully."
              : "Thank you for your payment."}
          </p>
        </div>
        <div className="modalFooter receiptActions">
          <button type="button" onClick={close}>
            Close
          </button>
          <button
            type="button"
            className="primary"
            onClick={() =>
              printWithFilename(
                isRefund ? "Refund-Receipt" : "Payment-Receipt",
                account?.client || payment.client_name,
                `PAY-${String(payment.id).padStart(5, "0")}`,
              )
            }
          >
            Print Receipt
          </button>
        </div>
      </section>
    </div>
  );
}

function PaymentReminder({
  account,
  stage,
  customerId,
  onLogged,
  close,
}: {
  account: Row;
  stage: Row;
  customerId: number;
  onLogged: () => Promise<void>;
  close: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [logging, setLogging] = useState(false);
  const [logError, setLogError] = useState("");
  const logReminderMutation = useApiMutation<any, any, Error>({
    mutationFn: async (payload) => (await api.post("/payment-reminders/", payload)).data,
  });
  const [nextFollowup, setNextFollowup] = useState(() => {
    const value = new Date();
    value.setDate(value.getDate() + 3);
    return value.toISOString().slice(0, 10);
  });
  const dueText = stage?.due_date ? date(stage.due_date) : "to be confirmed";
  const message = `Hello ${account.client},

This is a friendly payment reminder for your ${account.event_type || "event"} booking.

Booking: ${account.booking_code}
Payment Milestone: ${stage?.label || "Pending Payment"}
Milestone Amount Due: ${money(stage?.remaining || account.balance)}
Due Date: ${dueText}
Total Outstanding Balance: ${money(account.balance)}

Kindly arrange the payment at your earliest convenience. If payment has already been completed, please share the payment details with us.

Regards,
Lenspire CRM`;
  const contactDigits = String(account.contact || "").replace(/\D/g, "");
  const phone =
    contactDigits.length === 10 ? `91${contactDigits}` : contactDigits;
  const logReminder = async (action: string) => {
    setLogging(true);
    setLogError("");
    try {
      await logReminderMutation.mutateAsync({
        booking: account.id,
        customer: customerId,
        payment_type: stage?.label || "Pending Payment",
        milestone_amount: stage?.remaining || account.balance,
        outstanding_amount: account.balance,
        action,
        next_followup_date: nextFollowup || null,
      });
      await onLogged();
    } catch {
      setLogError(
        "The reminder was prepared, but its history could not be recorded.",
      );
    } finally {
      setLogging(false);
    }
  };
  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      const textArea = document.getElementById(
        "payment-reminder-text",
      ) as HTMLTextAreaElement | null;
      textArea?.select();
      document.execCommand("copy");
    }
    await logReminder("Copied");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="modalBackdrop">
      <section className="accountModal reminderModal">
        <div className="modalHeader">
          <div>
            <small>PAYMENT REMINDER</small>
            <h2>WhatsApp Reminder</h2>
            <p>Review the reminder before copying or opening WhatsApp.</p>
          </div>
          <button type="button" aria-label="Close reminder" onClick={close}>
            ×
          </button>
        </div>
        <div className="reminderBody">
          <textarea id="payment-reminder-text" readOnly value={message} />
          <label className="reminderFollowup">
            Next Follow-up Date
            <input
              type="date"
              value={nextFollowup}
              onChange={(event) => setNextFollowup(event.target.value)}
            />
          </label>
          {!phone && (
            <p className="formError">
              This client has no mobile number. You can still copy the message.
            </p>
          )}
          {logError && <p className="formError">{logError}</p>}
        </div>
        <div className="modalFooter reminderActions">
          <button type="button" onClick={close}>
            Close
          </button>
          <button type="button" disabled={logging} onClick={copyMessage}>
            {logging ? "Recording…" : copied ? "Copied ✓" : "Copy Message"}
          </button>
          {phone && (
            <a
              className="primary"
              href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => void logReminder("WhatsApp")}
            >
              Open WhatsApp
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
