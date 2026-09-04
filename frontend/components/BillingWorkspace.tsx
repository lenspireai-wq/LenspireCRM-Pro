"use client";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useApiMutation } from "@/lib/query";

type QuotationItem = { id?: number; name: string; description?: string; quantity: number; unit_price: string; line_total?: string; position?: number };
type Quotation = {
  id: number;
  quote_code: string;
  title: string;
  package_name?: string;
  event_type?: string;
  event_date?: string | null;
  city?: string;
  status: string;
  issue_date: string;
  valid_until?: string | null;
  subtotal: string;
  discount: string;
  tax_rate: string;
  tax_amount: string;
  total: string;
  notes?: string;
  terms?: string;
  version?: number;
  lead?: number | null;
  customer?: number | null;
  booking?: number | null;
  customer_name?: string;
  lead_name?: string;
  items?: QuotationItem[];
};

type Contract = {
  id: number;
  contract_code: string;
  title: string;
  status: string;
  signed_date?: string | null;
  contract_value: string;
  advance_paid: string;
  balance_due: string;
  counterparty_name?: string;
  counterparty_email?: string;
  counterparty_phone?: string;
  customer_name?: string;
  booking_code?: string;
  quote_code_ref?: string;
  notes?: string;
};

type InvoiceItem = QuotationItem;
type Invoice = {
  id: number;
  invoice_number: string;
  title: string;
  status: string;
  issue_date: string;
  due_date?: string | null;
  subtotal: string;
  discount: string;
  tax_rate: string;
  tax_amount: string;
  total: string;
  amount_paid: string;
  balance_due: string;
  gstin?: string;
  sac_code?: string;
  customer_name?: string;
  booking_code?: string;
  items?: InvoiceItem[];
};

const formatINR = (value: string | number) => {
  const number = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(number)) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(number);
};

const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" }) : "—");

const STATUS_COLORS: Record<string, string> = {
  Draft: "#64748b",
  Sent: "#0ea5e9",
  Accepted: "#22c55e",
  Rejected: "#ef4444",
  Expired: "#f59e0b",
  Signed: "#22c55e",
  "Partially Signed": "#f59e0b",
  Cancelled: "#ef4444",
  Issued: "#0ea5e9",
  "Partially Paid": "#f59e0b",
  Paid: "#22c55e",
  Overdue: "#ef4444",
};

const Badge = ({ status }: { status: string }) => (
  <span className="billStatus" style={{ background: STATUS_COLORS[status] || "#64748b" }}>{status}</span>
);

type Tab = "quotations" | "contracts" | "invoices";
const TABS: { key: Tab; label: string }[] = [
  { key: "quotations", label: "Quotations" },
  { key: "contracts", label: "Contracts" },
  { key: "invoices", label: "Invoices" },
];

export default function BillingWorkspace() {
  const [tab, setTab] = useState<Tab>("quotations");
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Quotation | null>(null);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const load = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const [q, c, i] = await Promise.all([
        api.get<{ results: Quotation[] }>("/quotations/"),
        api.get<{ results: Contract[] }>("/contracts/"),
        api.get<{ results: Invoice[] }>("/invoices/"),
      ]);
      if (signal?.aborted) return;
      setQuotations(q.data.results || (q.data as unknown as Quotation[]) || []);
      setContracts(c.data.results || (c.data as unknown as Contract[]) || []);
      setInvoices(i.data.results || (i.data as unknown as Invoice[]) || []);
    } catch (err: any) {
      if (signal?.aborted) return;
      setError(err?.response?.data?.detail || "Could not load billing records");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, []);

  const filteredQuotations = useMemo(() => filterBy(quotations, search, ["quote_code", "title", "package_name", "customer_name", "lead_name", "city"]), [quotations, search]);
  const filteredContracts = useMemo(() => filterBy(contracts, search, ["contract_code", "title", "counterparty_name", "customer_name", "booking_code"]), [contracts, search]);
  const filteredInvoices = useMemo(() => filterBy(invoices, search, ["invoice_number", "title", "customer_name", "booking_code", "gstin"]), [invoices, search]);

  return (
    <section className="workspace billing">
      <header className="dashHeader">
        <div>
          <h1>Billing</h1>
          <p>Quotations, contracts, and invoices for confirmed work.</p>
        </div>
        <input
          type="search"
          className="dashSearch"
          placeholder="Search by code, name, or city"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <nav className="billTabs" role="tablist">
        {TABS.map((entry) => (
          <button key={entry.key} role="tab" aria-selected={tab === entry.key} className={tab === entry.key ? "active" : ""} onClick={() => setTab(entry.key)}>
            {entry.label}
            <span className="billTabCount">
              {entry.key === "quotations" ? filteredQuotations.length : entry.key === "contracts" ? filteredContracts.length : filteredInvoices.length}
            </span>
          </button>
        ))}
      </nav>

      {error ? <p className="error">{error}</p> : null}

      {loading ? (
        <p>Loading…</p>
      ) : tab === "quotations" ? (
        <QuotationList
          items={filteredQuotations}
          onEdit={setEditing}
          onChanged={() => load()}
        />
      ) : tab === "contracts" ? (
        <ContractList items={filteredContracts} onEdit={setEditingContract} onChanged={() => load()} />
      ) : (
        <InvoiceList items={filteredInvoices} onEdit={setEditingInvoice} onChanged={() => load()} />
      )}

      {editing ? (
        <QuotationEditor quotation={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      ) : null}
      {editingContract ? (
        <ContractEditor contract={editingContract} onClose={() => setEditingContract(null)} onSaved={() => { setEditingContract(null); load(); }} />
      ) : null}
      {editingInvoice ? (
        <InvoiceEditor invoice={editingInvoice} onClose={() => setEditingInvoice(null)} onSaved={() => { setEditingInvoice(null); load(); }} />
      ) : null}
    </section>
  );
}

function filterBy<T extends Record<string, unknown>>(rows: T[], query: string, keys: (keyof T)[]): T[] {
  if (!query) return rows;
  const needle = query.toLowerCase();
  return rows.filter((row) =>
    keys.some((key) => {
      const value = row[key];
      if (typeof value === "string") return value.toLowerCase().includes(needle);
      if (typeof value === "number") return String(value).includes(needle);
      return false;
    }),
  );
}

const QuotationList = ({ items, onEdit, onChanged }: { items: Quotation[]; onEdit: (q: Quotation) => void; onChanged: () => void }) => {
  const handleAction = async (q: Quotation, action: "send" | "accept" | "reject" | "duplicate") => {
    const url = `/quotations/${q.id}/${action === "duplicate" ? "duplicate/" : action + "/"}`;
    const method = action === "duplicate" ? "POST" : "POST";
    await api.request({ url, method });
    onChanged();
  };
  if (items.length === 0) return <p className="dashEmpty">No quotations yet. Create one to get started.</p>;
  return (
    <div className="billTableWrap">
      <table className="billTable">
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Issue / Valid</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((q) => (
            <tr key={q.id}>
              <td><code>{q.quote_code}</code></td>
              <td>{q.title}<br /><small>{q.package_name} · v{q.version || 1}</small></td>
              <td>{q.customer_name || q.lead_name || "—"}</td>
              <td><Badge status={q.status} /></td>
              <td>{formatDate(q.issue_date)}<br /><small>valid {formatDate(q.valid_until)}</small></td>
              <td>{formatINR(q.total)}</td>
              <td>
                <button className="billBtn" onClick={() => onEdit(q)}>Edit</button>
                {q.status === "Draft" ? <button className="billBtn" onClick={() => handleAction(q, "send")}>Send</button> : null}
                {q.status === "Sent" ? (
                  <>
                    <button className="billBtn primary" onClick={() => handleAction(q, "accept")}>Accept</button>
                    <button className="billBtn danger" onClick={() => handleAction(q, "reject")}>Reject</button>
                  </>
                ) : null}
                <button className="billBtn" onClick={() => handleAction(q, "duplicate")}>Duplicate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ContractList = ({ items, onEdit, onChanged }: { items: Contract[]; onEdit: (c: Contract) => void; onChanged: () => void }) => {
  const signContractMutation = useApiMutation<{ id: number }, unknown, Error>({
    mutationFn: async ({ id }) => (await api.post(`/contracts/${id}/sign/`)).data,
  });
  const sign = async (c: Contract) => {
    await signContractMutation.mutateAsync({ id: c.id });
    onChanged();
  };
  if (items.length === 0) return <p className="dashEmpty">No contracts yet.</p>;
  return (
    <div className="billTableWrap">
      <table className="billTable">
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Counterparty</th>
            <th>Status</th>
            <th>Value</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id}>
              <td><code>{c.contract_code}</code></td>
              <td>{c.title}</td>
              <td>{c.counterparty_name || c.customer_name || "—"}</td>
              <td><Badge status={c.status} /></td>
              <td>{formatINR(c.contract_value)}</td>
              <td>{formatINR(c.balance_due)}</td>
              <td>
                <button className="billBtn" onClick={() => onEdit(c)}>Edit</button>
                {c.status !== "Signed" && c.status !== "Cancelled" ? <button className="billBtn primary" onClick={() => sign(c)}>Mark signed</button> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const InvoiceList = ({ items, onEdit, onChanged }: { items: Invoice[]; onEdit: (i: Invoice) => void; onChanged: () => void }) => {
  if (items.length === 0) return <p className="dashEmpty">No invoices yet.</p>;
  return (
    <div className="billTableWrap">
      <table className="billTable">
        <thead>
          <tr>
            <th>Number</th>
            <th>Title</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Issue / Due</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((inv) => (
            <tr key={inv.id}>
              <td><code>{inv.invoice_number}</code></td>
              <td>{inv.title}</td>
              <td>{inv.customer_name || inv.booking_code || "—"}</td>
              <td><Badge status={inv.status} /></td>
              <td>{formatDate(inv.issue_date)}<br /><small>due {formatDate(inv.due_date)}</small></td>
              <td>{formatINR(inv.total)}</td>
              <td>{formatINR(inv.amount_paid)}</td>
              <td>{formatINR(inv.balance_due)}</td>
              <td>
                <button className="billBtn" onClick={() => onEdit(inv)}>Edit</button>
                {inv.balance_due !== "0.00" ? <RecordPayment invoice={inv} onSaved={onChanged} /> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RecordPayment = ({ invoice, onSaved }: { invoice: Invoice; onSaved: () => void }) => {
  const recordPaymentMutation = useApiMutation<
    { id: number; amount: number },
    unknown,
    Error
  >({
    mutationFn: async ({ id, amount }) =>
      (await api.post(`/invoices/${id}/record_payment/`, { amount })).data,
  });
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submit = async () => {
    setError(null);
    if (!amount || Number(amount) <= 0) {
      setError("Enter a positive amount.");
      return;
    }
    setSubmitting(true);
    try {
      await recordPaymentMutation.mutateAsync({ id: invoice.id, amount: Number(amount) });
      setOpen(false);
      setAmount("");
      onSaved();
    } catch (err: any) {
      setError(err?.response?.data?.amount || "Could not record payment");
    } finally {
      setSubmitting(false);
    }
  };
  if (!open) {
    return <button className="billBtn primary" onClick={() => setOpen(true)}>Record payment</button>;
  }
  return (
    <span className="billInlineForm">
      <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
      <button className="billBtn primary" onClick={submit} disabled={submitting}>{submitting ? "Saving…" : "Save"}</button>
      <button className="billBtn" onClick={() => setOpen(false)}>Cancel</button>
      {error ? <small className="error">{error}</small> : null}
    </span>
  );
};

const QuotationEditor = ({ quotation, onClose, onSaved }: { quotation: Quotation; onClose: () => void; onSaved: () => void }) => {
  const saveQuotationMutation = useApiMutation<
    { id: number; payload: any },
    unknown,
    Error
  >({
    mutationFn: async ({ id, payload }) =>
      (await api.put(`/quotations/${id}/`, payload)).data,
  });
  const [title, setTitle] = useState(quotation.title);
  const [packageName, setPackageName] = useState(quotation.package_name || "");
  const [eventType, setEventType] = useState(quotation.event_type || "");
  const [city, setCity] = useState(quotation.city || "");
  const [issueDate, setIssueDate] = useState(quotation.issue_date);
  const [validUntil, setValidUntil] = useState(quotation.valid_until || "");
  const [discount, setDiscount] = useState(quotation.discount || "0.00");
  const [taxRate, setTaxRate] = useState(quotation.tax_rate || "0.00");
  const [items, setItems] = useState<QuotationItem[]>(quotation.items && quotation.items.length ? quotation.items : [{ name: "", description: "", quantity: 1, unit_price: "0.00" }]);
  const [notes, setNotes] = useState(quotation.notes || "");
  const [terms, setTerms] = useState(quotation.terms || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unit_price), 0);
  const taxAmount = Math.max(0, (subtotal - Number(discount || 0)) * (Number(taxRate || 0) / 100));
  const total = subtotal - Number(discount || 0) + taxAmount;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await saveQuotationMutation.mutateAsync({
        id: quotation.id,
        payload: {
          title, package_name: packageName, event_type: eventType, city,
          issue_date: issueDate, valid_until: validUntil || null,
          discount, tax_rate: taxRate,
          items: items.map((item, index) => ({
            id: item.id, name: item.name, description: item.description || "", quantity: Number(item.quantity), unit_price: String(item.unit_price), position: index,
          })),
          notes, terms,
        },
      });
      onSaved();
    } catch (err: any) {
      setError(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={`Edit ${quotation.quote_code}`} onClose={onClose}>
      <form className="billForm" onSubmit={submit}>
        <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
        <div className="billFormRow">
          <label>Package<input value={packageName} onChange={(e) => setPackageName(e.target.value)} /></label>
          <label>Event type<input value={eventType} onChange={(e) => setEventType(e.target.value)} /></label>
          <label>City<input value={city} onChange={(e) => setCity(e.target.value)} /></label>
        </div>
        <div className="billFormRow">
          <label>Issue date<input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required /></label>
          <label>Valid until<input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} /></label>
          <label>Discount (₹)<input type="number" min="0" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} /></label>
          <label>Tax rate (%)<input type="number" min="0" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} /></label>
        </div>

        <fieldset className="billItems">
          <legend>Line items</legend>
          {items.map((item, index) => (
            <div key={index} className="billItemRow">
              <input placeholder="Item name" value={item.name} onChange={(e) => updateItem(setItems, index, { name: e.target.value })} required />
              <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(setItems, index, { quantity: Number(e.target.value) })} />
              <input type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => updateItem(setItems, index, { unit_price: e.target.value })} />
              <span>{formatINR(Number(item.quantity) * Number(item.unit_price))}</span>
              <button type="button" className="billBtn danger" onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}>Remove</button>
            </div>
          ))}
          <button type="button" className="billBtn" onClick={() => setItems((prev) => [...prev, { name: "", description: "", quantity: 1, unit_price: "0.00" }])}>Add line</button>
        </fieldset>

        <div className="billTotals">
          <div><span>Subtotal</span><strong>{formatINR(subtotal)}</strong></div>
          <div><span>Discount</span><strong>{formatINR(Number(discount))}</strong></div>
          <div><span>Tax</span><strong>{formatINR(taxAmount)}</strong></div>
          <div className="billTotalRow"><span>Total</span><strong>{formatINR(total)}</strong></div>
        </div>

        <label>Notes<textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
        <label>Terms<textarea rows={2} value={terms} onChange={(e) => setTerms(e.target.value)} /></label>

        {error ? <p className="error">{error}</p> : null}
        <div className="billActions">
          <button type="button" className="billBtn" onClick={onClose}>Cancel</button>
          <button type="submit" className="billBtn primary" disabled={submitting}>{submitting ? "Saving…" : "Save quotation"}</button>
        </div>
      </form>
    </Modal>
  );
};

const ContractEditor = ({ contract, onClose, onSaved }: { contract: Contract; onClose: () => void; onSaved: () => void }) => {
  const saveContractMutation = useApiMutation<
    { id: number; payload: any },
    unknown,
    Error
  >({
    mutationFn: async ({ id, payload }) =>
      (await api.put(`/contracts/${id}/`, payload)).data,
  });
  const [title, setTitle] = useState(contract.title);
  const [value, setValue] = useState(contract.contract_value);
  const [advance, setAdvance] = useState(contract.advance_paid);
  const [counterparty, setCounterparty] = useState(contract.counterparty_name || "");
  const [email, setEmail] = useState(contract.counterparty_email || "");
  const [phone, setPhone] = useState(contract.counterparty_phone || "");
  const [notes, setNotes] = useState(contract.notes || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const balance = Math.max(0, Number(value) - Number(advance));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await saveContractMutation.mutateAsync({
        id: contract.id,
        payload: {
          title, contract_value: value, advance_paid: advance,
          counterparty_name: counterparty, counterparty_email: email, counterparty_phone: phone, notes,
        },
      });
      onSaved();
    } catch (err: any) {
      setError(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={`Edit ${contract.contract_code}`} onClose={onClose}>
      <form className="billForm" onSubmit={submit}>
        <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
        <div className="billFormRow">
          <label>Contract value (₹)<input type="number" min="0" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} required /></label>
          <label>Advance paid (₹)<input type="number" min="0" step="0.01" value={advance} onChange={(e) => setAdvance(e.target.value)} /></label>
          <label>Balance<input type="text" value={formatINR(balance)} readOnly /></label>
        </div>
        <div className="billFormRow">
          <label>Counterparty<input value={counterparty} onChange={(e) => setCounterparty(e.target.value)} /></label>
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>Phone<input value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
        </div>
        <label>Notes<textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
        {error ? <p className="error">{error}</p> : null}
        <div className="billActions">
          <button type="button" className="billBtn" onClick={onClose}>Cancel</button>
          <button type="submit" className="billBtn primary" disabled={submitting}>{submitting ? "Saving…" : "Save contract"}</button>
        </div>
      </form>
    </Modal>
  );
};

const InvoiceEditor = ({ invoice, onClose, onSaved }: { invoice: Invoice; onClose: () => void; onSaved: () => void }) => {
  const saveInvoiceMutation = useApiMutation<
    { id: number; payload: any },
    unknown,
    Error
  >({
    mutationFn: async ({ id, payload }) =>
      (await api.put(`/invoices/${id}/`, payload)).data,
  });
  const [title, setTitle] = useState(invoice.title);
  const [issueDate, setIssueDate] = useState(invoice.issue_date);
  const [dueDate, setDueDate] = useState(invoice.due_date || "");
  const [discount, setDiscount] = useState(invoice.discount || "0.00");
  const [taxRate, setTaxRate] = useState(invoice.tax_rate || "0.00");
  const [gstin, setGstin] = useState(invoice.gstin || "");
  const [sac, setSac] = useState(invoice.sac_code || "");
  const [items, setItems] = useState<InvoiceItem[]>(invoice.items && invoice.items.length ? invoice.items : [{ name: "", description: "", quantity: 1, unit_price: "0.00" }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unit_price), 0);
  const taxAmount = Math.max(0, (subtotal - Number(discount || 0)) * (Number(taxRate || 0) / 100));
  const total = subtotal - Number(discount || 0) + taxAmount;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await saveInvoiceMutation.mutateAsync({
        id: invoice.id,
        payload: {
          title, issue_date: issueDate, due_date: dueDate || null,
          discount, tax_rate: taxRate, gstin, sac_code: sac,
          items: items.map((item, index) => ({ id: item.id, name: item.name, description: item.description || "", quantity: Number(item.quantity), unit_price: String(item.unit_price), position: index })),
        },
      });
      onSaved();
    } catch (err: any) {
      setError(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={`Edit ${invoice.invoice_number}`} onClose={onClose}>
      <form className="billForm" onSubmit={submit}>
        <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
        <div className="billFormRow">
          <label>Issue date<input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required /></label>
          <label>Due date<input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></label>
          <label>GSTIN<input value={gstin} onChange={(e) => setGstin(e.target.value)} /></label>
          <label>SAC code<input value={sac} onChange={(e) => setSac(e.target.value)} /></label>
        </div>
        <div className="billFormRow">
          <label>Discount (₹)<input type="number" min="0" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} /></label>
          <label>Tax rate (%)<input type="number" min="0" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} /></label>
        </div>
        <fieldset className="billItems">
          <legend>Line items</legend>
          {items.map((item, index) => (
            <div key={index} className="billItemRow">
              <input placeholder="Item name" value={item.name} onChange={(e) => updateItem(setItems, index, { name: e.target.value })} required />
              <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(setItems, index, { quantity: Number(e.target.value) })} />
              <input type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => updateItem(setItems, index, { unit_price: e.target.value })} />
              <span>{formatINR(Number(item.quantity) * Number(item.unit_price))}</span>
              <button type="button" className="billBtn danger" onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}>Remove</button>
            </div>
          ))}
          <button type="button" className="billBtn" onClick={() => setItems((prev) => [...prev, { name: "", description: "", quantity: 1, unit_price: "0.00" }])}>Add line</button>
        </fieldset>
        <div className="billTotals">
          <div><span>Subtotal</span><strong>{formatINR(subtotal)}</strong></div>
          <div><span>Tax</span><strong>{formatINR(taxAmount)}</strong></div>
          <div className="billTotalRow"><span>Total</span><strong>{formatINR(total)}</strong></div>
          <div><span>Already paid</span><strong>{formatINR(invoice.amount_paid)}</strong></div>
        </div>
        {error ? <p className="error">{error}</p> : null}
        <div className="billActions">
          <button type="button" className="billBtn" onClick={onClose}>Cancel</button>
          <button type="submit" className="billBtn primary" disabled={submitting}>{submitting ? "Saving…" : "Save invoice"}</button>
        </div>
      </form>
    </Modal>
  );
};

const updateItem = <T extends { id?: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number, patch: Partial<T>) => {
  setter((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
};

const formatApiError = (err: any) => {
  const data = err?.response?.data;
  if (!data) return "Could not save";
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  return Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("; ");
};

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="billModalBackdrop" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
    <div className="billModal" onClick={(e) => e.stopPropagation()}>
      <header><h2>{title}</h2><button className="billBtn" onClick={onClose} aria-label="Close">×</button></header>
      {children}
    </div>
  </div>
);
