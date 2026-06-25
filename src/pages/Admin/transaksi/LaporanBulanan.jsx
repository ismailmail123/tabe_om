import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  AlertCircle,
  Package,
  DollarSign,
  BarChart2,
  Printer,
} from "lucide-react";
import useOrderStore from "../../../stores/useOrderStore";
import toast from "react-hot-toast";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const formatRupiah = (n) => {
  if (!n && n !== 0) return "Rp 0";
  return "Rp " + Number(n).toLocaleString("id-ID");
};

const MONTHS = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

const YEAR_OPTIONS = (() => {
  const now = new Date().getFullYear();
  return Array.from({ length: 4 }, (_, i) => now - i);
})();

// ─── STATUS helpers ───────────────────────────────────────────────────────────
const mapOrderStatus = (s) =>
  ({ pending: "Menunggu", process: "Diproses", completed: "Selesai", cancelled: "Dibatalkan" }[s] || s);

const STATUS_COLOR = {
  Selesai:   { color: "#10B981", bg: "#ECFDF5" },
  Diproses:  { color: "#3B82F6", bg: "#EFF6FF" },
  Menunggu:  { color: "#F59E0B", bg: "#FFFBEB" },
  Dibatalkan:{ color: "#EF4444", bg: "#FEF2F2" },
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "18px 20px",
      display: "flex", alignItems: "flex-start", gap: 14,
      boxShadow: "0 1px 4px rgba(0,0,0,.07)", flex: 1, minWidth: 160,
    }}>
      <div style={{ background: bg, borderRadius: 10, padding: 10, flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: color, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── PDF GENERATOR (pure HTML → print window) ────────────────────────────────
function generatePDF({ month, year, stats, rows, topProducts }) {
  const monthName = MONTHS[month];

  const itemsHTML = rows.map((trx, i) => `
    <tr class="${i % 2 === 0 ? "even" : ""}">
      <td>${i + 1}</td>
      <td>${trx.nama}</td>
      <td>${trx.blok}</td>
      <td>${trx.date}</td>
      <td>${formatRupiah(trx.total)}</td>
      <td>${trx.paymentMethod === "transfer" ? "Transfer" : "COD"}</td>
      <td><span class="badge status-${trx.orderStatus}">${mapOrderStatus(trx.orderStatus)}</span></td>
    </tr>
  `).join("");

  const topProductsHTML = topProducts.slice(0, 5).map((p, i) => `
    <tr class="${i % 2 === 0 ? "even" : ""}">
      <td>${i + 1}</td>
      <td>${p.name}</td>
      <td>${p.qty}</td>
      <td>${formatRupiah(p.revenue)}</td>
    </tr>
  `).join("");

  const printWin = window.open("", "_blank", "width=1000,height=700");
  printWin.document.write(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8"/>
      <title>Laporan Bulanan ${monthName} ${year}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @page { size: A4; margin: 15mm 18mm; }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', Arial, sans-serif;
          font-size: 11px; color: #1E293B;
          background: #fff;
        }

        /* ── COVER / HEADER ── */
        .cover {
          background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0e2238 100%);
          color: #fff; padding: 32px 36px 24px;
          border-radius: 0 0 24px 24px;
          margin-bottom: 24px;
          position: relative; overflow: hidden;
        }
        .cover::before {
          content: "";
          position: absolute; top: -30px; right: -30px;
          width: 180px; height: 180px; border-radius: 50%;
          background: rgba(59,130,246,.15);
        }
        .cover::after {
          content: "";
          position: absolute; bottom: -20px; right: 60px;
          width: 100px; height: 100px; border-radius: 50%;
          background: rgba(16,185,129,.1);
        }
        .cover-label {
          font-size: 10px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: #94A3B8; margin-bottom: 6px;
        }
        .cover-title {
          font-size: 26px; font-weight: 800; line-height: 1.1;
          margin-bottom: 4px;
        }
        .cover-sub { font-size: 13px; color: #94A3B8; margin-bottom: 20px; }
        .cover-meta {
          display: flex; gap: 24px; margin-top: 16px;
          padding-top: 16px; border-top: 1px solid rgba(255,255,255,.12);
        }
        .cover-meta-item { font-size: 10px; color: #64748B; }
        .cover-meta-item strong { display: block; font-size: 12px; color: #fff; margin-bottom: 2px; }

        /* ── STATS GRID ── */
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 12px; margin-bottom: 24px;
        }
        .stat-box {
          border: 1px solid #E2E8F0; border-radius: 12px;
          padding: 14px 16px;
        }
        .stat-box .stat-val {
          font-size: 20px; font-weight: 800; color: #0F172A; line-height: 1.1;
        }
        .stat-box .stat-lbl { font-size: 10px; color: #64748B; margin-top: 3px; }
        .stat-box .stat-accent { font-size: 10px; font-weight: 700; margin-top: 4px; }

        /* ── SECTION TITLES ── */
        .section-title {
          font-size: 13px; font-weight: 800; color: #0F172A;
          margin-bottom: 12px; padding-bottom: 8px;
          border-bottom: 2px solid #E2E8F0;
          display: flex; align-items: center; gap: 6px;
        }
        .section-title span {
          display: inline-block; width: 4px; height: 16px;
          background: #3B82F6; border-radius: 2px; margin-right: 2px;
        }

        /* ── TABLE ── */
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        thead tr {
          background: #0F172A; color: #94A3B8;
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: .6px;
        }
        thead th { padding: 9px 10px; text-align: left; }
        tbody tr td { padding: 8px 10px; border-bottom: 1px solid #F1F5F9; font-size: 10.5px; }
        tbody tr.even td { background: #FAFBFF; }

        .badge {
          display: inline-block; padding: 2px 8px; border-radius: 20px;
          font-size: 9px; font-weight: 700;
        }
        .status-completed  { background: #ECFDF5; color: #10B981; }
        .status-process    { background: #EFF6FF; color: #3B82F6; }
        .status-pending    { background: #FFFBEB; color: #F59E0B; }
        .status-cancelled  { background: #FEF2F2; color: #EF4444; }

        /* ── TOTALS ROW ── */
        .total-row td {
          font-weight: 800; font-size: 11px;
          color: #166534; background: #F0FDF4 !important;
          border-top: 2px dashed #BBF7D0;
        }

        /* ── TOP PRODUCTS ── */
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }

        /* ── BREAKDOWN ── */
        .breakdown { border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden; }
        .breakdown-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 9px 14px; font-size: 11px;
          border-bottom: 1px solid #F1F5F9;
        }
        .breakdown-row:last-child { border-bottom: none; }
        .breakdown-row.total-row-bd {
          background: #F0FDF4; font-weight: 800; color: #166534;
          border-top: 1px dashed #BBF7D0;
        }
        .dot {
          display: inline-block; width: 8px; height: 8px;
          border-radius: 50%; margin-right: 6px; vertical-align: middle;
        }

        /* ── SIGNATURE / FOOTER ── */
        .footer-sig {
          display: flex; justify-content: space-between;
          margin-top: 28px; gap: 24px;
        }
        .sig-box { flex: 1; text-align: center; }
        .sig-box .sig-title { font-size: 10px; color: #64748B; margin-bottom: 56px; }
        .sig-box .sig-line { border-top: 1px solid #334155; padding-top: 6px; }
        .sig-box .sig-name { font-size: 11px; font-weight: 700; color: #0F172A; }
        .sig-box .sig-role { font-size: 10px; color: #64748B; }

        .print-footer {
          text-align: center; margin-top: 20px; padding-top: 12px;
          border-top: 1px solid #E2E8F0; font-size: 9px; color: #94A3B8;
        }

        @media print {
          .no-print { display: none; }
          .cover { border-radius: 0 0 16px 16px; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>

      <!-- PRINT BUTTON -->
      <div class="no-print" style="text-align:center;padding:16px;background:#F8FAFC;border-bottom:1px solid #E2E8F0;">
        <button onclick="window.print()" style="
          padding:10px 28px;background:linear-gradient(135deg,#3B82F6,#2563EB);
          color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;
          cursor:pointer;display:inline-flex;align-items:center;gap:8px;
        ">🖨️ &nbsp;Download / Cetak PDF</button>
        <p style="font-size:12px;color:#64748B;margin-top:8px;">
          Tekan <strong>Ctrl+P</strong> (Windows) / <strong>⌘+P</strong> (Mac) → Pilih <em>"Save as PDF"</em>
        </p>
      </div>

      <!-- ── COVER ── -->
      <div class="cover">
        <div class="cover-label">Koperasi Tabeom · Laporan Resmi</div>
        <div class="cover-title">Laporan Transaksi Bulanan</div>
        <div class="cover-sub">${monthName} ${year}</div>
        <div class="cover-meta">
          <div class="cover-meta-item">
            <strong>Periode</strong>${monthName} ${year}
          </div>
          <div class="cover-meta-item">
            <strong>Total Transaksi</strong>${stats.total} transaksi
          </div>
          <div class="cover-meta-item">
            <strong>Total Pendapatan</strong>${formatRupiah(stats.revenue)}
          </div>
          <div class="cover-meta-item">
            <strong>Dicetak</strong>${new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
          </div>
        </div>
      </div>

      <!-- ── STAT CARDS ── -->
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-val">${stats.total}</div>
          <div class="stat-lbl">Total Transaksi</div>
          <div class="stat-accent" style="color:#3B82F6">Semua Status</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">${stats.selesai}</div>
          <div class="stat-lbl">Transaksi Selesai</div>
          <div class="stat-accent" style="color:#10B981">${stats.total ? Math.round(stats.selesai/stats.total*100) : 0}% dari total</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">${stats.dibatalkan}</div>
          <div class="stat-lbl">Transaksi Batal</div>
          <div class="stat-accent" style="color:#EF4444">${stats.total ? Math.round(stats.dibatalkan/stats.total*100) : 0}% dari total</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" style="font-size:15px;">${formatRupiah(stats.revenue)}</div>
          <div class="stat-lbl">Total Pendapatan</div>
          <div class="stat-accent" style="color:#8B5CF6">Hanya transaksi selesai</div>
        </div>
      </div>

      <!-- ── TWO COLUMN: Breakdown + Top Produk ── -->
      <div class="two-col">
        <!-- Status Breakdown -->
        <div>
          <div class="section-title"><span></span>Ringkasan Status</div>
          <div class="breakdown">
            <div class="breakdown-row">
              <span><span class="dot" style="background:#10B981"></span>Selesai</span>
              <strong style="color:#10B981">${stats.selesai} transaksi</strong>
            </div>
            <div class="breakdown-row">
              <span><span class="dot" style="background:#3B82F6"></span>Diproses</span>
              <strong style="color:#3B82F6">${stats.proses} transaksi</strong>
            </div>
            <div class="breakdown-row">
              <span><span class="dot" style="background:#F59E0B"></span>Menunggu</span>
              <strong style="color:#F59E0B">${stats.pending} transaksi</strong>
            </div>
            <div class="breakdown-row">
              <span><span class="dot" style="background:#EF4444"></span>Dibatalkan</span>
              <strong style="color:#EF4444">${stats.dibatalkan} transaksi</strong>
            </div>
            <div class="breakdown-row total-row-bd">
              <span>Total</span>
              <strong>${stats.total} transaksi</strong>
            </div>
          </div>

          <div style="margin-top:16px;">
            <div class="section-title"><span></span>Metode Pembayaran</div>
            <div class="breakdown">
              <div class="breakdown-row">
                <span><span class="dot" style="background:#8B5CF6"></span>Transfer Bank</span>
                <strong style="color:#8B5CF6">${stats.transfer} transaksi</strong>
              </div>
              <div class="breakdown-row">
                <span><span class="dot" style="background:#0EA5E9"></span>COD / Tunai</span>
                <strong style="color:#0EA5E9">${stats.cod} transaksi</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div>
          <div class="section-title"><span></span>5 Produk Terlaris</div>
          <table>
            <thead>
              <tr>
                <th>#</th><th>Nama Produk</th><th>Qty</th><th>Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              ${topProductsHTML || `<tr><td colspan="4" style="text-align:center;color:#94A3B8;padding:16px;">Tidak ada data produk</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── DETAIL TABLE ── -->
      <div class="section-title"><span></span>Detail Seluruh Transaksi (${rows.length})</div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nama WBP</th>
            <th>Kamar</th>
            <th>Tanggal</th>
            <th>Total</th>
            <th>Metode</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML || `<tr><td colspan="7" style="text-align:center;color:#94A3B8;padding:20px;">Tidak ada transaksi pada periode ini</td></tr>`}
          ${rows.length > 0 ? `
          <tr class="total-row">
            <td colspan="4" style="text-align:right;">TOTAL PENDAPATAN (Transaksi Selesai)</td>
            <td colspan="3">${formatRupiah(stats.revenue)}</td>
          </tr>` : ""}
        </tbody>
      </table>

      <!-- ── SIGNATURE ── -->
      <div class="footer-sig">
        <div class="sig-box">
          <div class="sig-title">Dibuat oleh,</div>
          <div class="sig-line">
            <div class="sig-name">Admin Koperasi</div>
            <div class="sig-role">Petugas Koperasi</div>
          </div>
        </div>
        <div class="sig-box">
          <div class="sig-title">Mengetahui,</div>
          <div class="sig-line">
            <div class="sig-name">Kepala Koperasi</div>
            <div class="sig-role">Pimpinan</div>
          </div>
        </div>
      </div>

      <div class="print-footer">
        Laporan ini dicetak secara otomatis oleh sistem Koperasi Tabeom · ${new Date().toLocaleString("id-ID")}
      </div>

    </body>
    </html>
  `);
  printWin.document.close();

  // Auto-trigger print after fonts load
  printWin.onload = () => {
    setTimeout(() => printWin.focus(), 300);
  };
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function LaporanBulanan() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());
  const [transactions,  setTransactions]  = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [generating,    setGenerating]    = useState(false);

  const { fetchOrder } = useOrderStore();

  // ── Load & transform orders ───────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const orders = await fetchOrder();
      if (!Array.isArray(orders)) { setTransactions([]); return; }

      const transformed = orders.map((order) => {
        const od = order.order_data?.[0] || {};
        return {
          id:            order.order_id || order.id,
          nama:          od.wbp_name || order.user?.nama || "-",
          blok:          od.wbp_room || "-",
          nomorRegister: od.wbp_register_number || "-",
          namaPengirim:  od.wbp_sender || "-",
          rawDate:       new Date(order.order_date || order.created_at),
          date:          new Date(order.order_date || order.created_at)
                           .toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric" }),
          total:         Number(order.total || order.total_price || 0),
          orderStatus:   order.status,
          paymentMethod: order.payment_method,
          paymentStatus: order.payment_status,
          items:         order.items?.map((item) => ({
                           name:  item.name || item.product_name,
                           qty:   item.quantity,
                           price: parseFloat(item.price) || 0,
                         })) || [],
        };
      });
      setTransactions(transformed);
    } catch {
      toast.error("Gagal memuat data transaksi");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [fetchOrder]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Filter by selected month + year ──────────────────────────────────────
  const filtered = transactions.filter((t) => {
    return t.rawDate.getMonth() === selectedMonth
        && t.rawDate.getFullYear() === selectedYear;
  });

  // ── Compute stats ─────────────────────────────────────────────────────────
  const stats = {
    total:       filtered.length,
    selesai:     filtered.filter(t => t.orderStatus === "completed").length,
    proses:      filtered.filter(t => t.orderStatus === "process").length,
    pending:     filtered.filter(t => t.orderStatus === "pending").length,
    dibatalkan:  filtered.filter(t => t.orderStatus === "cancelled").length,
    revenue:     filtered.filter(t => t.orderStatus === "completed")
                         .reduce((s, t) => s + t.total, 0),
    transfer:    filtered.filter(t => t.paymentMethod === "transfer").length,
    cod:         filtered.filter(t => t.paymentMethod !== "transfer").length,
  };

  // ── Top products ──────────────────────────────────────────────────────────
  const productMap = {};
  filtered.filter(t => t.orderStatus === "completed").forEach((t) => {
    t.items.forEach((item) => {
      if (!item.name) return;
      if (!productMap[item.name]) productMap[item.name] = { name: item.name, qty: 0, revenue: 0 };
      productMap[item.name].qty     += item.qty;
      productMap[item.name].revenue += item.qty * item.price;
    });
  });
  const topProducts = Object.values(productMap).sort((a, b) => b.qty - a.qty);

  // ── Handle PDF generate ───────────────────────────────────────────────────
  const handleGenerate = () => {
    setGenerating(true);
    try {
      generatePDF({
        month: selectedMonth,
        year:  selectedYear,
        stats,
        rows:  filtered,
        topProducts,
      });
      toast.success("Laporan dibuka di tab baru. Pilih 'Save as PDF' untuk menyimpan.");
    } catch (e) {
      toast.error("Gagal membuat laporan");
    } finally {
      setTimeout(() => setGenerating(false), 1000);
    }
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Inter','Poppins',sans-serif" }}>
      <main style={{ padding: "24px 20px", maxWidth: 1100, margin: "0 auto" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0F172A" }}>Laporan Bulanan</h1>
            <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 14 }}>
              Ringkasan dan detail transaksi per bulan, siap cetak ke PDF
            </p>
          </div>

          {/* Download Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || loading || filtered.length === 0}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 22px", borderRadius: 12, border: "none",
              background: filtered.length === 0
                ? "#E2E8F0"
                : "linear-gradient(135deg,#3B82F6,#2563EB)",
              color: filtered.length === 0 ? "#94A3B8" : "#fff",
              fontWeight: 700, fontSize: 14, cursor: filtered.length === 0 ? "not-allowed" : "pointer",
              boxShadow: filtered.length === 0 ? "none" : "0 4px 14px rgba(59,130,246,.35)",
              transition: "all .2s",
            }}
          >
            {generating ? <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={18} />}
            {generating ? "Membuat PDF…" : "Download PDF"}
          </button>
        </div>

        {/* ── FILTER BAR ── */}
        <div style={{
          background: "#fff", borderRadius: 14, padding: "16px 20px",
          marginBottom: 24, display: "flex", gap: 14, alignItems: "center",
          flexWrap: "wrap", boxShadow: "0 1px 4px rgba(0,0,0,.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748B", fontSize: 13, fontWeight: 600 }}>
            <Calendar size={16} color="#3B82F6" />
            Pilih Periode:
          </div>

          {/* Month select */}
          <div style={{ position: "relative" }}>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              style={{
                appearance: "none", padding: "9px 34px 9px 14px",
                borderRadius: 9, border: "1.5px solid #E2E8F0",
                background: "#F8FAFC", fontSize: 13, color: "#334155",
                fontWeight: 600, cursor: "pointer", outline: "none",
              }}
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} />
          </div>

          {/* Year select */}
          <div style={{ position: "relative" }}>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              style={{
                appearance: "none", padding: "9px 34px 9px 14px",
                borderRadius: 9, border: "1.5px solid #E2E8F0",
                background: "#F8FAFC", fontSize: 13, color: "#334155",
                fontWeight: 600, cursor: "pointer", outline: "none",
              }}
            >
              {YEAR_OPTIONS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} />
          </div>

          <button onClick={loadData} style={{
            padding: "9px 14px", borderRadius: 9, border: "1.5px solid #E2E8F0",
            background: "#fff", color: "#64748B", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5, fontSize: 13,
          }}>
            <RefreshCw size={14} /> Refresh
          </button>

          <div style={{ marginLeft: "auto", fontSize: 12, color: "#94A3B8" }}>
            Menampilkan <strong style={{ color: "#334155" }}>{filtered.length}</strong> transaksi
            pada <strong style={{ color: "#334155" }}>{MONTHS[selectedMonth]} {selectedYear}</strong>
          </div>
        </div>

        {/* ── LOADING ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "3px solid #E2E8F0", borderTopColor: "#3B82F6",
              animation: "spin 1s linear infinite", margin: "0 auto 12px",
            }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color: "#64748B", fontSize: 14 }}>Memuat data…</p>
          </div>
        ) : filtered.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div style={{
            background: "#fff", borderRadius: 14, padding: "60px 24px",
            textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,.06)",
          }}>
            <AlertCircle size={52} style={{ color: "#CBD5E1", marginBottom: 12 }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: "#64748B", margin: "0 0 6px" }}>
              Tidak ada transaksi
            </p>
            <p style={{ fontSize: 13, color: "#94A3B8" }}>
              Belum ada data untuk {MONTHS[selectedMonth]} {selectedYear}
            </p>
          </div>
        ) : (
          <>
            {/* ── STAT CARDS ── */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              <StatCard icon={ShoppingBag}  label="Total Transaksi"  value={stats.total}                color="#3B82F6" bg="#EFF6FF" />
              <StatCard icon={CheckCircle}  label="Selesai"          value={stats.selesai}              color="#10B981" bg="#ECFDF5" sub={`${stats.total ? Math.round(stats.selesai/stats.total*100) : 0}% dari total`} />
              <StatCard icon={XCircle}      label="Dibatalkan"       value={stats.dibatalkan}           color="#EF4444" bg="#FEF2F2" />
              <StatCard icon={TrendingUp}   label="Total Pendapatan" value={formatRupiah(stats.revenue)} color="#8B5CF6" bg="#F5F3FF" />
            </div>

            {/* ── TWO COLUMN: Breakdown + Top Products ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {/* Status Breakdown */}
              <div style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <BarChart2 size={16} color="#3B82F6" /> Ringkasan Status & Metode
                </div>
                {[
                  { label: "Selesai",    val: stats.selesai,    color: "#10B981" },
                  { label: "Diproses",   val: stats.proses,     color: "#3B82F6" },
                  { label: "Menunggu",   val: stats.pending,    color: "#F59E0B" },
                  { label: "Dibatalkan", val: stats.dibatalkan, color: "#EF4444" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "9px 0", borderBottom: "1px solid #F1F5F9",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569" }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                      {label}
                    </div>
                    <span style={{ fontWeight: 700, color, fontSize: 13 }}>{val} transaksi</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed #E2E8F0" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 8, textTransform: "uppercase", letterSpacing: .5 }}>Metode Pembayaran</div>
                  {[
                    { label: "Transfer Bank", val: stats.transfer, color: "#8B5CF6" },
                    { label: "COD / Tunai",   val: stats.cod,      color: "#0EA5E9" },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 0", borderBottom: "1px solid #F1F5F9",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569" }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                        {label}
                      </div>
                      <span style={{ fontWeight: 700, color, fontSize: 13 }}>{val} transaksi</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <Package size={16} color="#10B981" /> 5 Produk Terlaris
                </div>
                {topProducts.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#94A3B8", textAlign: "center", padding: "20px 0" }}>
                    Belum ada produk terjual bulan ini
                  </p>
                ) : topProducts.slice(0, 5).map((p, i) => (
                  <div key={p.name} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "9px 0", borderBottom: i < 4 ? "1px solid #F1F5F9" : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 6, background: "#EFF6FF",
                        color: "#3B82F6", fontSize: 11, fontWeight: 800,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>{i + 1}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>{p.qty} unit terjual</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6" }}>{formatRupiah(p.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── DETAIL TABLE (preview) ── */}
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
              <div style={{
                padding: "16px 20px", borderBottom: "1px solid #F1F5F9",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}>
                  <FileText size={16} color="#3B82F6" /> Preview Detail Transaksi
                </div>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>
                  {filtered.length} transaksi · {MONTHS[selectedMonth]} {selectedYear}
                </span>
              </div>

              {/* Responsive table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#0F172A" }}>
                      {["#","Nama WBP","Kamar","Tanggal","Total","Metode","Status"].map(h => (
                        <th key={h} style={{
                          padding: "12px 14px", textAlign: "left",
                          fontSize: 10, fontWeight: 700, color: "#94A3B8",
                          textTransform: "uppercase", letterSpacing: .6, whiteSpace: "nowrap",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((trx, i) => {
                      const st = mapOrderStatus(trx.orderStatus);
                      const cfg = STATUS_COLOR[st] || {};
                      return (
                        <tr key={trx.id} style={{ background: i % 2 === 0 ? "#FAFBFF" : "#fff", borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "11px 14px", color: "#94A3B8", fontSize: 12 }}>{i + 1}</td>
                          <td style={{ padding: "11px 14px", fontWeight: 600, fontSize: 13, color: "#0F172A" }}>{trx.nama}</td>
                          <td style={{ padding: "11px 14px", fontSize: 12, color: "#64748B" }}>{trx.blok}</td>
                          <td style={{ padding: "11px 14px", fontSize: 12, color: "#64748B", whiteSpace: "nowrap" }}>{trx.date}</td>
                          <td style={{ padding: "11px 14px", fontWeight: 700, fontSize: 13, color: "#0F172A" }}>{formatRupiah(trx.total)}</td>
                          <td style={{ padding: "11px 14px", fontSize: 12, color: "#64748B" }}>
                            {trx.paymentMethod === "transfer" ? "Transfer" : "COD"}
                          </td>
                          <td style={{ padding: "11px 14px" }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 5,
                              background: cfg.bg, color: cfg.color,
                              padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                            }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
                              {st}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Total row */}
                    <tr style={{ background: "#F0FDF4", borderTop: "2px dashed #BBF7D0" }}>
                      <td colSpan={4} style={{ padding: "12px 14px", fontWeight: 700, fontSize: 13, color: "#166534", textAlign: "right" }}>
                        TOTAL PENDAPATAN (Transaksi Selesai)
                      </td>
                      <td colSpan={3} style={{ padding: "12px 14px", fontWeight: 800, fontSize: 14, color: "#166534" }}>
                        {formatRupiah(stats.revenue)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── BOTTOM DOWNLOAD CTA ── */}
            <div style={{
              marginTop: 20, background: "linear-gradient(135deg,#EFF6FF,#F0FDF4)",
              borderRadius: 14, padding: "20px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 16, flexWrap: "wrap",
              border: "1.5px solid #DBEAFE",
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#0F172A", marginBottom: 4 }}>
                  Siap untuk diunduh
                </div>
                <div style={{ fontSize: 13, color: "#64748B" }}>
                  Laporan {MONTHS[selectedMonth]} {selectedYear} · {filtered.length} transaksi · {formatRupiah(stats.revenue)} pendapatan
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "13px 26px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg,#3B82F6,#2563EB)",
                  color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(59,130,246,.35)",
                  flexShrink: 0,
                }}
              >
                {generating
                  ? <><RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Membuat…</>
                  : <><Download size={18} /> Download PDF Laporan</>
                }
              </button>
            </div>
          </>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select:focus { border-color: #3B82F6 !important; outline: none; }
        * { box-sizing: border-box; }
        @media (max-width: 640px) {
          .two-col-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}