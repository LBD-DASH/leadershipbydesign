import { useState } from "react";
import { Loader2 } from "lucide-react";

interface LeadCaptureFormProps {
  onSubmit: (data: {
    first_name: string;
    last_name: string;
    email: string;
    organisation: string;
  }) => Promise<void>;
}

export default function LeadCaptureForm({ onSubmit }: LeadCaptureFormProps) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    organisation: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.email) return;
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  const inputStyle = {
    borderColor: "#E5E7EB",
    color: "#0F1F2E",
    backgroundColor: "#FFFFFF",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-4 space-y-2.5 border"
      style={{ backgroundColor: "#F8F6F1", borderColor: "#E5E7EB" }}
    >
      <p className="text-xs font-medium" style={{ color: "#0F1F2E" }}>
        Share your details and Kevin will be in touch:
      </p>
      <div className="grid grid-cols-2 gap-2">
        <input
          placeholder="First name *"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
          className="h-9 rounded-md border px-2.5 text-sm focus:outline-none focus:ring-1"
          style={inputStyle}
        />
        <input
          placeholder="Last name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          className="h-9 rounded-md border px-2.5 text-sm focus:outline-none focus:ring-1"
          style={inputStyle}
        />
      </div>
      <input
        type="email"
        placeholder="Email address *"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        className="w-full h-9 rounded-md border px-2.5 text-sm focus:outline-none focus:ring-1"
        style={inputStyle}
      />
      <input
        placeholder="Organisation"
        value={form.organisation}
        onChange={(e) => setForm({ ...form, organisation: e.target.value })}
        className="w-full h-9 rounded-md border px-2.5 text-sm focus:outline-none focus:ring-1"
        style={inputStyle}
      />
      <button
        type="submit"
        disabled={submitting || !form.first_name || !form.email}
        className="w-full h-9 rounded-md text-sm font-medium text-white flex items-center justify-center transition-opacity disabled:opacity-50"
        style={{ backgroundColor: "#2A7B88" }}
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Book Discovery Call"}
      </button>
    </form>
  );
}
