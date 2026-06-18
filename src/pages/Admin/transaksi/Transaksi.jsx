import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  Camera,
  Printer,
  XCircle,
  Trash2,
  RefreshCw,
  History,
  X,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Check,
  X as XIcon,
  Search,
  Filter,
  TrendingUp,
  Clock,
  ShoppingBag,
  AlertCircle,
  Eye,
  MoreVertical,
  ZoomIn,
  Download,
  ImageOff,
  ShieldAlert,
  Ban,
  AlertTriangle,
  Package,
  User,
  Send,
} from "lucide-react";
import useOrderStore from "../../../stores/useOrderStore";
import usePaymentStore from "../../../stores/usePaymentStore";
import toast from "react-hot-toast";
import ModalAmbilFoto from "./ModalAmbilFoto";

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const ORDER_STATUS_CONFIG = {
  "Selesai":            { color: "#10B981", bg: "#ECFDF5", label: "Selesai",             dot: true },
  "Dikonfirmasi":       { color: "#3B82F6", bg: "#EFF6FF", label: "Dikonfirmasi",         dot: true },
  "Menunggu Konfirmasi":{ color: "#F59E0B", bg: "#FFFBEB", label: "Menunggu Konfirmasi",  dot: true },
  "Dibatalkan":         { color: "#EF4444", bg: "#FEF2F2", label: "Dibatalkan",           dot: true },
};

const PAYMENT_STATUS_CONFIG = {
  completed: { color: "#10B981", bg: "#ECFDF5", label: "Terverifikasi" },
  process:   { color: "#F59E0B", bg: "#FFFBEB", label: "Menunggu Verifikasi" },
  cancelled: { color: "#EF4444", bg: "#FEF2F2", label: "Ditolak" },
  expired:   { color: "#6B7280", bg: "#F9FAFB", label: "Kadaluarsa" },
  pending:   { color: "#F59E0B", bg: "#FFFBEB", label: "Menunggu Verifikasi" },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const formatRupiah = (n) => {
  if (!n) return "Rp 0";
  return "Rp " + Number(n).toLocaleString("id-ID");
};

const formatTanggal = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const mapOrderStatus = (s) =>
  ({ pending: "Menunggu Konfirmasi", process: "Dikonfirmasi", completed: "Selesai", cancelled: "Dibatalkan" }[s] || s);

const mapPaymentStatus = (s) => PAYMENT_STATUS_CONFIG[s]?.label || s;

const mapHistoryStatus = (s) =>
  ({ pending: "Menunggu Konfirmasi", process: "Dikonfirmasi", completed: "Selesai", cancelled: "Dibatalkan" }[s] || s);

// ─── BADGE COMPONENTS ─────────────────────────────────────────────────────────
function StatusBadge({ status, type = "order" }) {
  const cfg = type === "order"
    ? ORDER_STATUS_CONFIG[status]
    : PAYMENT_STATUS_CONFIG[status];
  if (!cfg) return <span>{status}</span>;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, color: cfg.color,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
      {cfg.label || status}
    </span>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "18px 20px",
      display: "flex", alignItems: "center", gap: 14,
      boxShadow: "0 1px 3px rgba(0,0,0,.07)", flex: 1, minWidth: 140,
    }}>
      <div style={{ background: bg, borderRadius: 10, padding: 10, flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── MODAL WRAPPER ────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, maxWidth = 680 }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 50, padding: 16,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth,
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 25px 60px rgba(15,23,42,.25)",
      }}>
        {/* header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid #E2E8F0",
        }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{title}</h2>
          <button onClick={onClose} style={{
            border: "none", background: "#F1F5F9", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", color: "#64748B",
          }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "20px 24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── FOTO THUMBNAIL (clickable) ───────────────────────────────────────────────
function FotoThumb({ src, onClick, size = 44 }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: "relative", width: size, height: size, cursor: "pointer", borderRadius: 8, overflow: "hidden" }}
      title="Klik untuk melihat foto"
    >
      <img src={src} alt="Bukti" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      {hov && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(15,23,42,.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 8,
        }}>
          <ZoomIn size={18} color="#fff" />
        </div>
      )}
    </div>
  );
}

// ─── DETAIL PANEL (shared content for desktop expand row & mobile card) ──────
function TrxDetailPanel({ trx, onLihatFoto }) {
  return (
    <div>
      {/* WBP & pengirim info */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12, marginBottom: 16,
      }}>
        <div style={{
          background: "#EFF6FF", borderRadius: 10, padding: "12px 14px",
          border: "1px solid #DBEAFE", display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <div style={{ background: "#DBEAFE", borderRadius: 8, padding: 7, flexShrink: 0 }}>
            <User size={15} color="#3B82F6" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#3B82F6", textTransform: "uppercase", letterSpacing: .5, fontWeight: 700 }}>
              Penerima Barang (WBP)
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginTop: 3 }}>{trx.nama}</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}>
              Kamar {trx.blok} · Reg {trx.nomorRegister}
            </div>
          </div>
        </div>

        <div style={{
          background: "#F5F3FF", borderRadius: 10, padding: "12px 14px",
          border: "1px solid #E9D5FF", display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <div style={{ background: "#E9D5FF", borderRadius: 8, padding: 7, flexShrink: 0 }}>
            <Send size={15} color="#8B5CF6" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#8B5CF6", textTransform: "uppercase", letterSpacing: .5, fontWeight: 700 }}>
              Dibelikan / Dikirim Oleh
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginTop: 3 }}>
              {trx.namaPengirim || "-"}
            </div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}>
              {trx.paymentMethod === "transfer" ? "Pembayaran via Transfer" : "Pembayaran COD"}
            </div>
          </div>
        </div>
      </div>

      {/* daftar barang */}
      <div style={{ marginBottom: trx.buktiFoto ? 16 : 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
          fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: .5,
        }}>
          <Package size={13} color="#64748B" /> Barang yang Dibeli ({trx.items?.length || 0})
        </div>
        <div style={{ border: "1px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
          {trx.items?.length > 0 ? (
            trx.items.map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px",
                background: i % 2 === 0 ? "#FAFBFF" : "#fff",
                borderBottom: i < trx.items.length - 1 ? "1px solid #F1F5F9" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 22, height: 22, borderRadius: 6, background: "#EFF6FF",
                    color: "#3B82F6", fontSize: 11, fontWeight: 700, flexShrink: 0,
                  }}>{i + 1}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8" }}>
                      {item.qty} × {formatRupiah(item.price)}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                  {formatRupiah(item.price * item.qty)}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: "14px", fontSize: 13, color: "#94A3B8", textAlign: "center" }}>
              Tidak ada data barang.
            </div>
          )}
          <div style={{
            display: "flex", justifyContent: "space-between", padding: "10px 14px",
            background: "#F0FDF4", borderTop: "1px dashed #BBF7D0",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>Total Pembayaran</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#166534" }}>{formatRupiah(trx.total)}</span>
          </div>
        </div>
      </div>

      {/* bukti foto */}
      {trx.buktiFoto && (
        <div>
          <div style={{
            fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8,
            textTransform: "uppercase", letterSpacing: .5,
          }}>
            Foto Bukti Serah Terima
          </div>
          <FotoThumb
            src={trx.buktiFoto}
            size={72}
            onClick={() => onLihatFoto(trx.buktiFoto, `Bukti Serah Terima · ${trx.nama}`)}
          />
        </div>
      )}
    </div>
  );
}

// ─── TRANSACTION ROW (desktop) ────────────────────────────────────────────────
function TrxRow({ trx, index, expanded, onToggle, onKonfirmasi, onVerifikasi, onPrint, onFoto, onHistory, onLihatFoto, onTolak }) {
  const orderCfg  = ORDER_STATUS_CONFIG[trx.status]  || {};
  return (
    <>
      <tr style={{ borderBottom: expanded ? "none" : "1px solid #F1F5F9", transition: "background .15s", background: expanded ? "#FAFBFF" : "transparent" }}
        onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = "#FAFBFF"; }}
        onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = "transparent"; }}>

        {/* indicator bar */}
        <td style={{ padding: "14px 0 14px 12px", width: 4 }}>
          <div style={{ width: 4, height: 40, borderRadius: 4, background: orderCfg.color || "#CBD5E1" }} />
        </td>

        <td style={{ padding: "14px 8px", color: "#94A3B8", fontSize: 13 }}>{index + 1}</td>

        <td style={{ padding: "14px 8px" }}>
          <button
            onClick={onToggle}
            title="Lihat detail barang & WBP"
            style={{
              display: "flex", alignItems: "center", gap: 8, background: "none",
              border: "none", cursor: "pointer", padding: 0, textAlign: "left",
            }}
          >
            <span style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              background: expanded ? "#3B82F6" : "#F1F5F9",
              color: expanded ? "#fff" : "#94A3B8", transition: "all .15s",
            }}>
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
            <span>
              <div style={{ fontWeight: 600, color: "#0F172A", fontSize: 14 }}>{trx.nama}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                Kamar {trx.blok} · Reg {trx.nomorRegister}
              </div>
            </span>
          </button>
        </td>

        <td style={{ padding: "14px 8px", fontSize: 13, color: "#475569" }}>{trx.date}</td>

        <td style={{ padding: "14px 8px" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{formatRupiah(trx.total)}</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
            {trx.paymentMethod === "transfer" ? "Transfer" : "COD"}
          </div>
        </td>

        <td style={{ padding: "14px 8px" }}><StatusBadge status={trx.status} type="order" /></td>

        <td style={{ padding: "14px 8px" }}>
          <StatusBadge status={trx.paymentStatus} type="payment" />
        </td>

        <td style={{ padding: "14px 8px" }}>
          {trx.buktiFoto ? (
            <FotoThumb src={trx.buktiFoto} onClick={() => onLihatFoto(trx.buktiFoto, `Bukti Serah Terima · ${trx.nama}`)} />
          ) : (
            <div style={{
              width: 44, height: 44, background: "#F8FAFC", borderRadius: 8,
              border: "1.5px dashed #CBD5E1", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Camera size={16} color="#CBD5E1" />
            </div>
          )}
        </td>

        <td style={{ padding: "14px 12px 14px 8px" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {trx.verifikasi_pembayaran !== null && trx.orderStatus !== "cancelled" && (
              <ActionBtn icon={CheckCircle} color="#10B981" title="Konfirmasi Order" onClick={() => onKonfirmasi(trx.id)} />
            )}
            {trx.paymentMethod === "transfer" && trx.paymentStatus === "process" && (
              <ActionBtn icon={CreditCard} color="#8B5CF6" title="Verifikasi Pembayaran" onClick={() => onVerifikasi(trx)} />
            )}
            {/* Tolak pembayaran */}
            {trx.paymentMethod === "transfer" && trx.paymentStatus === "process" && (
              <ActionBtn icon={Ban} color="#EF4444" title="Tolak Pembayaran (Fake Transfer)" onClick={() => onTolak(trx)} />
            )}
            {/* Lihat bukti transfer */}
            {trx.paymentMethod === "transfer" && trx.paymentData?.[0]?.proof_of_payment && (
              <ActionBtn icon={Eye} color="#0EA5E9" title="Lihat Bukti Transfer" onClick={() => onLihatFoto(trx.paymentData[0].proof_of_payment, `Bukti Transfer · ${trx.nama}`)} />
            )}
            <ActionBtn icon={Printer} color="#475569" title="Cetak Struk" onClick={() => onPrint(trx)} />
            {(trx.status === "Dikonfirmasi" || trx.status === "Selesai") && (
              <ActionBtn icon={Camera} color="#10B981" title="Ambil Foto Bukti" onClick={() => onFoto(trx)} />
            )}
            {trx.status === "Selesai" && trx.orderHistory?.length > 0 && (
              <ActionBtn icon={History} color="#8B5CF6" title="Riwayat Order" onClick={() => onHistory(trx)} />
            )}
          </div>
        </td>
      </tr>

      {/* ── EXPANDED DETAIL ROW ── */}
      {expanded && (
        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
          <td colSpan={9} style={{ padding: "0 12px 18px 12px", background: "#FAFBFF" }}>
            <div style={{
              background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0",
              padding: "16px 18px", marginTop: 2,
            }}>
              <TrxDetailPanel trx={trx} onLihatFoto={onLihatFoto} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function ActionBtn({ icon: Icon, color, title, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: "none", cursor: "pointer", borderRadius: 8,
        width: 34, height: 34, display: "flex", alignItems: "center",
        justifyContent: "center", transition: "all .15s",
        background: hov ? color + "18" : "transparent",
        color: hov ? color : "#94A3B8",
      }}>
      <Icon size={16} />
    </button>
  );
}

// ─── MOBILE CARD ──────────────────────────────────────────────────────────────
function TrxCard({ trx, expanded, onToggle, onKonfirmasi, onVerifikasi, onPrint, onFoto, onHistory, onLihatFoto, onTolak }) {
  const orderCfg = ORDER_STATUS_CONFIG[trx.status] || {};
  return (
    <div style={{
      background: "#fff", borderRadius: 14, marginBottom: 10,
      boxShadow: "0 1px 4px rgba(0,0,0,.07)",
      overflow: "hidden", borderLeft: `4px solid ${orderCfg.color || "#CBD5E1"}`,
    }}>
      {/* summary row */}
      <button onClick={onToggle} style={{
        width: "100%", background: "none", border: "none", cursor: "pointer",
        padding: "14px 16px", textAlign: "left",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 15 }}>{trx.nama}</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{trx.date} · {formatRupiah(trx.total)}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 7, flexWrap: "wrap" }}>
            <StatusBadge status={trx.status} type="order" />
            <StatusBadge status={trx.paymentStatus} type="payment" />
          </div>
        </div>
        <div style={{ color: "#94A3B8", marginLeft: 10 }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* expanded detail */}
      {expanded && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #F1F5F9" }}>
          <div style={{ marginTop: 14 }}>
            <TrxDetailPanel trx={trx} onLihatFoto={onLihatFoto} />
          </div>

          {/* action buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {trx.verifikasi_pembayaran !== null && trx.orderStatus !== "cancelled" && (
              <MobileActionBtn icon={CheckCircle} label="Konfirmasi" color="#10B981" onClick={() => onKonfirmasi(trx.id)} />
            )}
            {trx.paymentMethod === "transfer" && trx.paymentStatus === "process" && (
              <MobileActionBtn icon={CreditCard} label="Verifikasi" color="#8B5CF6" onClick={() => onVerifikasi(trx)} />
            )}
            {/* Tolak pembayaran */}
            {trx.paymentMethod === "transfer" && trx.paymentStatus === "process" && (
              <MobileActionBtn icon={Ban} label="Tolak" color="#EF4444" onClick={() => onTolak(trx)} />
            )}
            {/* Lihat bukti transfer */}
            {trx.paymentMethod === "transfer" && trx.paymentData?.[0]?.proof_of_payment && (
              <MobileActionBtn icon={Eye} label="Bukti Transfer" color="#0EA5E9" onClick={() => onLihatFoto(trx.paymentData[0].proof_of_payment, `Bukti Transfer · ${trx.nama}`)} />
            )}
            <MobileActionBtn icon={Printer} label="Cetak" color="#475569" onClick={() => onPrint(trx)} />
            {(trx.status === "Dikonfirmasi" || trx.status === "Selesai") && (
              <MobileActionBtn icon={Camera} label="Foto" color="#10B981" onClick={() => onFoto(trx)} />
            )}
            {trx.status === "Selesai" && trx.orderHistory?.length > 0 && (
              <MobileActionBtn icon={History} label="Riwayat" color="#8B5CF6" onClick={() => onHistory(trx)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileActionBtn({ icon: Icon, label, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 5, padding: "7px 12px",
      borderRadius: 8, border: `1.5px solid ${color}20`, background: color + "10",
      color, fontSize: 12, fontWeight: 600, cursor: "pointer",
    }}>
      <Icon size={14} />
      {label}
    </button>
  );
}

// ─── VERIFIKASI MODAL ─────────────────────────────────────────────────────────
function ModalVerifikasi({ open, data, note, onNoteChange, onVerify, onClose }) {
  if (!open || !data) return null;
  const isPending = data.payment_status === "process";
  return (
    <Modal open={open} onClose={onClose} title="Verifikasi Pembayaran" maxWidth={560}>
      {/* order info */}
      <div style={{ background: "linear-gradient(135deg,#EFF6FF,#F0FDF4)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            ["Kode Order", data.orderCode],
            ["Nama WBP", data.nama],
            ["Total", formatRupiah(data.amount || data.total)],
          ].map(([lbl, val]) => (
            <div key={lbl}>
              <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: .5 }}>{lbl}</div>
              <div style={{ fontSize: lbl === "Total" ? 18 : 14, fontWeight: lbl === "Total" ? 700 : 600, color: "#0F172A", marginTop: 3 }}>{val}</div>
            </div>
          ))}
          <div>
            <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: .5 }}>Status Pembayaran</div>
            <div style={{ marginTop: 3 }}><StatusBadge status={data.payment_status} type="payment" /></div>
          </div>
        </div>
      </div>

      {/* payment detail */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 12, textTransform: "uppercase", letterSpacing: .5 }}>Detail Pembayaran</div>
        <div style={{ borderRadius: 10, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          {[
            ["Metode", data.payment_method === "transfer" ? "Transfer Bank" : data.payment_method?.toUpperCase()],
            ["Bank", data.bank_name],
            ["No. Rekening", data.account_number],
            ["Tanggal", data.created_at ? formatTanggal(data.created_at) : null],
            ["Diverifikasi", data.verified_at ? formatTanggal(data.verified_at) : null],
          ].filter(([, v]) => v).map(([lbl, val], i, arr) => (
            <div key={lbl} style={{
              display: "flex", justifyContent: "space-between", padding: "10px 14px",
              background: i % 2 === 0 ? "#FAFBFF" : "#fff",
              borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none",
            }}>
              <span style={{ color: "#64748B", fontSize: 13 }}>{lbl}</span>
              <span style={{ fontWeight: 600, fontSize: 13, color: "#0F172A" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* proof image */}
      {data.proof_of_payment && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 10, textTransform: "uppercase", letterSpacing: .5 }}>Bukti Pembayaran</div>
          <div style={{ textAlign: "center", background: "#F8FAFC", borderRadius: 12, padding: 16, border: "1.5px dashed #CBD5E1" }}>
            <img src={data.proof_of_payment} alt="Bukti" style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,.1)" }} />
          </div>
        </div>
      )}

      {/* action */}
      {isPending && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 10, textTransform: "uppercase", letterSpacing: .5 }}>Tindakan</div>
          <textarea
            value={note} onChange={e => onNoteChange(e.target.value)}
            placeholder="Catatan (wajib jika menolak pembayaran)..."
            rows={3}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 10,
              border: "1.5px solid #E2E8F0", fontSize: 13, resize: "vertical",
              outline: "none", color: "#334155", boxSizing: "border-box", marginBottom: 12,
            }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button onClick={() => onVerify("completed")} style={{
              padding: "12px 0", borderRadius: 10, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff",
              fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8,
            }}>
              <Check size={18} /> Terima
            </button>
            <button onClick={() => onVerify("cancelled")} disabled={!note.trim()} style={{
              padding: "12px 0", borderRadius: 10, border: "none",
              cursor: note.trim() ? "pointer" : "not-allowed",
              background: note.trim() ? "linear-gradient(135deg,#EF4444,#DC2626)" : "#E2E8F0",
              color: note.trim() ? "#fff" : "#94A3B8",
              fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8,
            }}>
              <XIcon size={18} /> Tolak
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── HISTORY MODAL ────────────────────────────────────────────────────────────
function ModalHistory({ open, history, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Riwayat Order" maxWidth={600}>
      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
          <History size={48} style={{ marginBottom: 12, opacity: .5 }} />
          <p>Tidak ada riwayat order</p>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          {/* timeline line */}
          <div style={{ position: "absolute", left: 19, top: 8, bottom: 8, width: 2, background: "#E2E8F0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {history.map((h, i) => {
              const cfg = PAYMENT_STATUS_CONFIG[h.status] || {};
              return (
                <div key={h.id} style={{ display: "flex", gap: 14, position: "relative" }}>
                  {/* dot */}
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: cfg.bg || "#F1F5F9", border: `2px solid ${cfg.color || "#CBD5E1"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: cfg.color || "#64748B",
                    position: "relative", zIndex: 1,
                  }}>
                    {history.length - i}
                  </div>
                  <div style={{ flex: 1, background: "#FAFBFF", borderRadius: 12, padding: "12px 14px", border: "1px solid #F1F5F9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <StatusBadge status={h.status} type="order" />
                      <span style={{ fontSize: 11, color: "#94A3B8", whiteSpace: "nowrap" }}>{formatTanggal(h.created_at)}</span>
                    </div>
                    {h.note && (
                      <div style={{ marginTop: 8, padding: "8px 10px", background: "#fff", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13, color: "#475569" }}>
                        {h.note}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{
          padding: "10px 24px", borderRadius: 10, border: "none",
          background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff",
          fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>Tutup</button>
      </div>
    </Modal>
  );
}

// ─── MODAL TOLAK PEMBAYARAN ───────────────────────────────────────────────────
function ModalTolakPembayaran({ open, data, onConfirm, onClose }) {
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(false);
  const [pilihAlasan, setPilihAlasan] = useState("");

  const ALASAN_CEPAT = [
    "Bukti transfer tidak jelas / buram",
    "Nominal tidak sesuai",
    "Rekening tujuan tidak sesuai",
    "Tanggal transfer tidak sesuai",
    "Diduga bukti transfer palsu (fake)",
    "Bukti transfer sudah pernah digunakan",
  ];

  useEffect(() => {
    if (open) { setAlasan(""); setPilihAlasan(""); setLoading(false); }
  }, [open]);

  const handlePilih = (val) => {
    setPilihAlasan(val);
    setAlasan(val);
  };

  const handleSubmit = async () => {
    if (!alasan.trim()) return;
    setLoading(true);
    await onConfirm(alasan);
    setLoading(false);
  };

  if (!open || !data) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 60, padding: 16,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480,
        boxShadow: "0 25px 60px rgba(15,23,42,.3)",
        overflow: "hidden",
      }}>
        {/* ── header merah ── */}
        <div style={{
          background: "linear-gradient(135deg,#FEF2F2,#FFF1F1)",
          borderBottom: "1px solid #FECACA",
          padding: "20px 24px",
          display: "flex", alignItems: "flex-start", gap: 14,
        }}>
          <div style={{
            background: "#FEE2E2", borderRadius: 12, padding: 10, flexShrink: 0,
          }}>
            <ShieldAlert size={24} color="#EF4444" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#991B1B" }}>
              Tolak Pembayaran
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#DC2626" }}>
              Tindakan ini akan membatalkan pembayaran dan mengembalikan status order.
            </p>
          </div>
          <button onClick={onClose} style={{
            marginLeft: "auto", border: "none", background: "transparent",
            cursor: "pointer", color: "#94A3B8", flexShrink: 0, padding: 4,
          }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* info order */}
          <div style={{
            background: "#F8FAFC", borderRadius: 10, padding: "12px 14px",
            border: "1px solid #E2E8F0", marginBottom: 18,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: .5 }}>Nama WBP</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginTop: 2 }}>{data.nama}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: .5 }}>Total</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#EF4444", marginTop: 2 }}>
                {formatRupiah(data.amount || data.total)}
              </div>
            </div>
          </div>

          {/* pilih alasan cepat */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: .5 }}>
              Pilih Alasan Penolakan
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {ALASAN_CEPAT.map((a) => (
                <button key={a} onClick={() => handlePilih(a)} style={{
                  textAlign: "left", padding: "9px 12px", borderRadius: 8, cursor: "pointer",
                  fontSize: 13, fontWeight: 500, transition: "all .12s",
                  border: `1.5px solid ${pilihAlasan === a ? "#EF4444" : "#E2E8F0"}`,
                  background: pilihAlasan === a ? "#FEF2F2" : "#F8FAFC",
                  color: pilihAlasan === a ? "#DC2626" : "#475569",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${pilihAlasan === a ? "#EF4444" : "#CBD5E1"}`,
                    background: pilihAlasan === a ? "#EF4444" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {pilihAlasan === a && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* textarea alasan custom */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 }}>
              Atau Tulis Alasan Lain
            </div>
            <textarea
              value={alasan}
              onChange={e => { setAlasan(e.target.value); setPilihAlasan(""); }}
              placeholder="Contoh: Nomor rekening tidak sesuai, bukti transfer terlihat diedit..."
              rows={3}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 10,
                border: `1.5px solid ${alasan.trim() ? "#EF4444" : "#E2E8F0"}`,
                fontSize: 13, resize: "vertical", color: "#334155",
                outline: "none", boxSizing: "border-box",
                background: alasan.trim() ? "#FFF5F5" : "#F8FAFC",
                transition: "all .15s",
              }}
            />
            {!alasan.trim() && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5, color: "#F59E0B", fontSize: 12 }}>
                <AlertTriangle size={13} />
                Alasan wajib diisi sebelum menolak
              </div>
            )}
          </div>

          {/* action buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "12px 0", borderRadius: 10,
              border: "1.5px solid #E2E8F0", background: "#fff",
              color: "#64748B", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={!alasan.trim() || loading}
              style={{
                flex: 1, padding: "12px 0", borderRadius: 10, border: "none",
                background: alasan.trim() && !loading
                  ? "linear-gradient(135deg,#EF4444,#DC2626)"
                  : "#E2E8F0",
                color: alasan.trim() && !loading ? "#fff" : "#94A3B8",
                fontWeight: 700, fontSize: 14,
                cursor: alasan.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all .15s",
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)",
                    borderTopColor: "#fff", borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }} />
                  Memproses…
                </>
              ) : (
                <>
                  <Ban size={16} />
                  Tolak Pembayaran
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL LIHAT FOTO (LIGHTBOX) ─────────────────────────────────────────────
function ModalLihatFoto({ open, imageUrl, title, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // reset zoom & pos every time modal opens
  useEffect(() => {
    if (open) { setZoom(1); setPos({ x: 0, y: 0 }); }
  }, [open]);

  if (!open || !imageUrl) return null;

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(z => Math.min(4, Math.max(0.5, z - e.deltaY * 0.001)));
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setDragging(true);
    setStartPos({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPos({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };
  const handleMouseUp = () => setDragging(false);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `bukti-transfer-${Date.now()}.jpg`;
    a.target = "_blank";
    a.click();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        background: "rgba(0,0,0,.92)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}
    >
      {/* ── top bar ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          background: "linear-gradient(to bottom, rgba(0,0,0,.7), transparent)",
        }}
      >
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{title || "Bukti Transfer"}</div>
          <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>
            Scroll untuk zoom · Drag untuk geser
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {/* zoom out */}
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} title="Perkecil" style={toolBtnStyle}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>−</span>
          </button>
          {/* zoom indicator */}
          <div style={{
            ...toolBtnStyle, cursor: "default", background: "rgba(255,255,255,.08)",
            minWidth: 52, fontSize: 12, fontWeight: 700, color: "#fff",
          }}>
            {Math.round(zoom * 100)}%
          </div>
          {/* zoom in */}
          <button onClick={() => setZoom(z => Math.min(4, z + 0.25))} title="Perbesar" style={toolBtnStyle}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
          </button>
          {/* reset */}
          <button onClick={() => { setZoom(1); setPos({ x: 0, y: 0 }); }} title="Reset ukuran" style={toolBtnStyle}>
            <ZoomIn size={16} />
          </button>
          {/* download */}
          <button onClick={handleDownload} title="Unduh gambar" style={{ ...toolBtnStyle, background: "rgba(59,130,246,.25)", borderColor: "rgba(59,130,246,.5)" }}>
            <Download size={16} />
          </button>
          {/* close */}
          <button onClick={onClose} title="Tutup" style={{ ...toolBtnStyle, background: "rgba(239,68,68,.2)", borderColor: "rgba(239,68,68,.4)" }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── image area ── */}
      <div
        onClick={e => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          overflow: "hidden", width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
          userSelect: "none",
        }}
      >
        <img
          src={imageUrl}
          alt="Bukti Transfer"
          draggable={false}
          style={{
            maxWidth: zoom === 1 ? "85vw" : "none",
            maxHeight: zoom === 1 ? "80vh" : "none",
            width: zoom === 1 ? "auto" : undefined,
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: dragging ? "none" : "transform .15s ease",
            borderRadius: zoom === 1 ? 12 : 0,
            boxShadow: "0 8px 40px rgba(0,0,0,.6)",
          }}
        />
      </div>

      {/* ── bottom hint ── */}
      <div style={{
        position: "absolute", bottom: 16,
        color: "#64748B", fontSize: 12, textAlign: "center",
        pointerEvents: "none",
      }}>
        Klik di luar gambar untuk menutup
      </div>
    </div>
  );
}

const toolBtnStyle = {
  border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.1)",
  borderRadius: 8, width: 36, height: 36, display: "flex",
  alignItems: "center", justifyContent: "center",
  cursor: "pointer", color: "#fff",
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Transaksi() {
  const [transactions, setTransactions]           = useState([]);
  const [activeTrx, setActiveTrx]                 = useState(null);
  const [loading, setLoading]                     = useState(true);
  const [expandedRows, setExpandedRows]           = useState(new Set());
  const [search, setSearch]                       = useState("");
  const [filterStatus, setFilterStatus]           = useState("all");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [showModalFoto, setShowModalFoto]                   = useState(false);
  const [selectedTransaction, setSelectedTransaction]       = useState(null);
  const [showModalHistory, setShowModalHistory]             = useState(false);
  const [selectedOrderHistory, setSelectedOrderHistory]     = useState([]);
  const [showModalVerifikasi, setShowModalVerifikasi]       = useState(false);
  const [selectedPaymentData, setSelectedPaymentData]       = useState(null);
  const [verifikasiNote, setVerifikasiNote]                 = useState("");
  const [showModalLihatFoto, setShowModalLihatFoto]         = useState(false);
  const [lihatFotoUrl, setLihatFotoUrl]                     = useState(null);
  const [lihatFotoTitle, setLihatFotoTitle]                 = useState("");
  const [showModalTolak, setShowModalTolak]                 = useState(false);
  const [selectedTolakData, setSelectedTolakData]           = useState(null);

  const { fetchOrder, updateOrderStatus } = useOrderStore();
  const { fetchPaymentByOrderId, verifyPayment } = usePaymentStore();

  useEffect(() => { loadTransactions(); }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const orders = await fetchOrder();
      if (orders && Array.isArray(orders)) {
        const transformed = orders.map((order) => {
          const orderData = order.order_data?.[0] || {};
          return {
            id: order.order_id || order.id,
            nama: orderData.wbp_name || order.user?.nama || "-",
            blok: orderData.wbp_room || "-",
            nomorRegister: orderData.wbp_register_number || "-",
            namaPengirim: orderData.wbp_sender || "-",
            date: new Date(order.order_date || order.created_at).toLocaleDateString("id-ID"),
            total: order.total || order.total_price,
            status: mapOrderStatus(order.status),
            items: order.items?.map((item) => ({
              name: item.product_name || item.name,
              qty: item.quantity,
              price: parseFloat(item.price) || 0,
            })) || [],
            buktiFoto: order.purchase_receipt_photo || null,
            orderHistory: order.order_historie || [],
            orderCode: order.order_code,
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            orderStatus: order.status,
            verifikasi_pembayaran: order.payment?.[0]?.verified_at || null,
            diverifikasi_oleh: order.payment?.[0]?.verified_by || null,
            paymentData: order.payment || null,
          };
        });
        setTransactions(transformed);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      toast.error("Gagal memuat data transaksi");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id) => {
    const s = new Set(expandedRows);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpandedRows(s);
  };

  // modal handlers
  const bukaModalFoto       = (trx) => { setSelectedTransaction(trx); setShowModalFoto(true); };
  const tutupModalFoto      = () => { setShowModalFoto(false); setSelectedTransaction(null); };
  const bukaModalHistory    = (trx) => { setSelectedOrderHistory(trx.orderHistory || []); setShowModalHistory(true); };
  const tutupModalHistory   = () => { setShowModalHistory(false); setSelectedOrderHistory([]); };
  const tutupModalVerifikasi = () => { setShowModalVerifikasi(false); setSelectedPaymentData(null); setVerifikasiNote(""); };

  const bukaLihatFoto = (url, title) => { setLihatFotoUrl(url); setLihatFotoTitle(title); setShowModalLihatFoto(true); };
  const tutupLihatFoto = () => { setShowModalLihatFoto(false); setLihatFotoUrl(null); setLihatFotoTitle(""); };

  const bukaModalTolak = async (trx) => {
    try {
      const paymentData = await fetchPaymentByOrderId(trx.id);
      if (paymentData) {
        setSelectedTolakData({ ...paymentData, orderId: trx.id, orderCode: trx.orderCode, nama: trx.nama, total: trx.total });
        setShowModalTolak(true);
      } else {
        toast.error("Data pembayaran tidak ditemukan");
      }
    } catch {
      toast.error("Gagal memuat data pembayaran");
    }
  };
  const tutupModalTolak = () => { setShowModalTolak(false); setSelectedTolakData(null); };

  const handleTolakPembayaran = async (alasan) => {
    if (!selectedTolakData) return;
    try {
      await verifyPayment({ order_id: selectedTolakData.order_id, status: "cancelled", note: alasan });
      toast.success("Pembayaran berhasil ditolak");
      await loadTransactions();
      tutupModalTolak();
    } catch {
      toast.error("Gagal menolak pembayaran");
    }
  };

  const bukaModalVerifikasi = async (trx) => {
    try {
      const paymentData = await fetchPaymentByOrderId(trx.id);
      if (paymentData) {
        setSelectedPaymentData({ ...paymentData, orderId: trx.id, orderCode: trx.orderCode, nama: trx.nama, total: trx.total });
        setShowModalVerifikasi(true);
      } else {
        toast.error("Data pembayaran tidak ditemukan");
      }
    } catch {
      toast.error("Gagal memuat data pembayaran");
    }
  };

  const handleKonfirmasi = async (id) => {
    try {
      await updateOrderStatus(id, "completed");
      toast.success("Transaksi berhasil dikonfirmasi");
      loadTransactions();
    } catch {
      toast.error("Gagal mengkonfirmasi transaksi");
    }
  };

  const handleVerifikasiPembayaran = async (status) => {
    if (!selectedPaymentData) return;
    try {
      await verifyPayment({ order_id: selectedPaymentData.order_id, status, note: verifikasiNote });
      toast.success(`Pembayaran berhasil ${status === "completed" ? "diverifikasi" : "ditolak"}`);
      await loadTransactions();
      tutupModalVerifikasi();
    } catch {
      toast.error("Gagal memproses verifikasi pembayaran");
    }
  };

  const handlePrint = (trx) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html><head><title>Struk - ${trx.nama}</title>
      <style>
        @media print { @page { size: 80mm auto; margin: 5mm; } }
        body { font-family: 'Courier New', monospace; font-size: 13px; margin: 0; padding: 10px; width: 80mm; }
        .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px; }
        .header h2 { margin: 0; font-size: 16px; }
        .info { line-height: 1.4; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 3px 0; text-align: left; }
        th { border-bottom: 1px dashed #000; }
        .total { border-top: 1px dashed #000; font-weight: bold; text-align: right; padding-top: 3px; }
        .footer { border-top: 1px dashed #000; margin-top: 10px; text-align: center; font-size: 12px; padding-top: 5px; }
      </style></head>
      <body>
        <div class="header"><h2>KOPERASI TABEOM</h2><div>Jl. Mawar No. 9 Kel. Pallantikan Kec. Bantaeng.</div><div>Telp. (0411) 123456</div></div>
        <div class="info">
          <b>Nama WBP:</b> ${trx.nama}<br/>
          <b>Kamar:</b> ${trx.blok}<br/>
          <b>No. Register:</b> ${trx.nomorRegister}<br/>
          <b>Pengirim:</b> ${trx.namaPengirim || "-"}<br/>
          <b>Tanggal:</b> ${trx.date}<br/>
        </div>
        <table>
          <thead><tr><th>No</th><th>Barang</th><th>Qty</th><th style="text-align:right;">Subtotal</th></tr></thead>
          <tbody>
            ${trx.items?.map((item, i) => `
              <tr>
                <td>${i + 1}</td><td>${item.name}</td><td>${item.qty}</td>
                <td style="text-align:right;">${formatRupiah(item.price * item.qty)}</td>
              </tr>`).join("")}
            <tr><td colspan="3" class="total">TOTAL</td><td class="total">${formatRupiah(trx.total)}</td></tr>
          </tbody>
        </table>
        <div class="footer"><p>Struk ini wajib diperlihatkan saat penerimaan barang.</p><p>Terima kasih 🙏</p></div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // camera
  const bukaModalFotoFn = (trx) => bukaModalFoto(trx);

  // ─── filter & search
  const filtered = transactions.filter((t) => {
    const matchSearch = !search || t.nama.toLowerCase().includes(search.toLowerCase()) || t.nomorRegister.includes(search);
    const matchFilter = filterStatus === "all" || t.orderStatus === filterStatus;
    return matchSearch && matchFilter;
  });

  // ─── stats
  const stats = {
    total:     transactions.length,
    selesai:   transactions.filter(t => t.orderStatus === "completed").length,
    proses:    transactions.filter(t => t.orderStatus === "process").length,
    pending:   transactions.filter(t => t.orderStatus === "pending").length,
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", background: "#F8FAFC" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 44, height: 44, border: "3px solid #E2E8F0",
            borderTopColor: "#3B82F6", borderRadius: "50%",
            animation: "spin 1s linear infinite", margin: "0 auto 12px",
          }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ color: "#64748B", fontSize: 14 }}>Memuat data transaksi…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      <main style={{ padding: "24px 20px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0F172A" }}>Transaksi</h1>
          <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 14 }}>Kelola dan pantau semua transaksi pengguna</p>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <StatCard icon={ShoppingBag}  label="Total Transaksi" value={stats.total}   color="#3B82F6" bg="#EFF6FF" />
          <StatCard icon={CheckCircle}  label="Selesai"         value={stats.selesai}  color="#10B981" bg="#ECFDF5" />
          <StatCard icon={RefreshCw}    label="Diproses"        value={stats.proses}   color="#8B5CF6" bg="#F5F3FF" />
          <StatCard icon={Clock}        label="Menunggu"        value={stats.pending}  color="#F59E0B" bg="#FFFBEB" />
        </div>

        {/* ── TOOLBAR ── */}
        <div style={{
          background: "#fff", borderRadius: 14, padding: "14px 16px",
          marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap",
          alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,.06)",
        }}>
          {/* search */}
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <Search size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau no. register…"
              style={{
                width: "100%", padding: "9px 12px 9px 34px", borderRadius: 9,
                border: "1.5px solid #E2E8F0", fontSize: 13, color: "#334155",
                outline: "none", background: "#F8FAFC", boxSizing: "border-box",
              }}
            />
          </div>

          {/* filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[["all","Semua"],["pending","Menunggu"],["process","Diproses"],["completed","Selesai"],["cancelled","Batal"]].map(([val, lbl]) => (
              <button key={val} onClick={() => setFilterStatus(val)} style={{
                padding: "8px 14px", borderRadius: 8, border: "1.5px solid",
                borderColor: filterStatus === val ? "#3B82F6" : "#E2E8F0",
                background: filterStatus === val ? "#EFF6FF" : "#fff",
                color: filterStatus === val ? "#3B82F6" : "#64748B",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>{lbl}</button>
            ))}
          </div>

          <button onClick={loadTransactions} style={{
            padding: "9px 14px", borderRadius: 9, border: "1.5px solid #E2E8F0",
            background: "#fff", color: "#64748B", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5, fontSize: 13,
          }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* ── EMPTY STATE ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
            <AlertCircle size={56} style={{ marginBottom: 14, opacity: .4 }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: "#64748B" }}>
              {transactions.length === 0 ? "Belum ada transaksi" : "Tidak ada hasil yang cocok"}
            </p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          <>
            {/* ── DESKTOP TABLE ── */}
            <div style={{
              background: "#fff", borderRadius: 14, overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,.07)", display: "none",
            }}
              className="desktop-table">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0F172A" }}>
                    {["","#","Nama & Kamar","Tanggal","Total","Status Order","Pembayaran","Foto","Aksi"].map(h => (
                      <th key={h} style={{
                        padding: h === "" ? "14px 0 14px 12px" : "14px 10px",
                        textAlign: "left", fontSize: 11, fontWeight: 700,
                        color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.7,
                        whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((trx, i) => (
                    <TrxRow
                      key={trx.id} trx={trx} index={i}
                      expanded={expandedRows.has(trx.id)}
                      onToggle={() => toggleRow(trx.id)}
                      onKonfirmasi={handleKonfirmasi}
                      onVerifikasi={bukaModalVerifikasi}
                      onPrint={handlePrint}
                      onFoto={bukaModalFoto}
                      onHistory={bukaModalHistory}
                      onLihatFoto={bukaLihatFoto}
                      onTolak={bukaModalTolak}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── MOBILE CARDS ── */}
            <div className="mobile-cards">
              {filtered.map((trx) => (
                <TrxCard
                  key={trx.id} trx={trx}
                  expanded={expandedRows.has(trx.id)}
                  onToggle={() => toggleRow(trx.id)}
                  onKonfirmasi={handleKonfirmasi}
                  onVerifikasi={bukaModalVerifikasi}
                  onPrint={handlePrint}
                  onFoto={bukaModalFoto}
                  onHistory={bukaModalHistory}
                  onLihatFoto={bukaLihatFoto}
                  onTolak={bukaModalTolak}
                />
              ))}
            </div>
          </>
        )}

        {/* count info */}
        {filtered.length > 0 && (
          <div style={{ marginTop: 12, textAlign: "right", fontSize: 12, color: "#94A3B8" }}>
            Menampilkan {filtered.length} dari {transactions.length} transaksi
          </div>
        )}
      </main>

      {/* ── MODALS ── */}
      <ModalVerifikasi
        open={showModalVerifikasi}
        data={selectedPaymentData}
        note={verifikasiNote}
        onNoteChange={setVerifikasiNote}
        onVerify={handleVerifikasiPembayaran}
        onClose={tutupModalVerifikasi}
      />

      <ModalHistory
        open={showModalHistory}
        history={selectedOrderHistory}
        onClose={tutupModalHistory}
      />

      <ModalAmbilFoto
        isOpen={showModalFoto}
        onClose={tutupModalFoto}
        transaction={selectedTransaction}
      />

      <ModalLihatFoto
        open={showModalLihatFoto}
        imageUrl={lihatFotoUrl}
        title={lihatFotoTitle}
        onClose={tutupLihatFoto}
      />

      <ModalTolakPembayaran
        open={showModalTolak}
        data={selectedTolakData}
        onConfirm={handleTolakPembayaran}
        onClose={tutupModalTolak}
      />

      {/* responsive styles */}
      <style>{`
        .desktop-table { display: none !important; }
        .mobile-cards  { display: block !important; }
        @media (min-width: 768px) {
          .desktop-table { display: block !important; }
          .mobile-cards  { display: none !important; }
        }
        * { box-sizing: border-box; }
        input:focus { border-color: #3B82F6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,.12); }
        textarea:focus { border-color: #3B82F6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,.12); outline: none; }
      `}</style>
    </div>
  );
}