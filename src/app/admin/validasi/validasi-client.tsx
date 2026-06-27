"use client"

import * as React from "react"
import { Check, X, Eye, ShieldAlert, Calendar, CreditCard, User, MapPin, Loader2, HeartHandshake } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatRupiah } from "@/lib/format"
import { getSignedUrls } from "@/app/admin/pemasukan/actions"
import { approveDonationAction, rejectDonationAction } from "./actions"

interface SerializedConfirmation {
  id: string
  donorName: string
  donorAddress: string
  isAnonymous: boolean
  amount: number
  transferDate: string
  paymentChannel: string
  proofUrls: string[]
  status: string
  createdAt: string
}

interface ValidasiClientProps {
  initialConfirmations: SerializedConfirmation[]
}

export default function ValidasiClient({ initialConfirmations }: ValidasiClientProps) {
  const [confirmations, setConfirmations] = React.useState(initialConfirmations)
  
  // State Modal & Detail
  const [selectedItem, setSelectedItem] = React.useState<SerializedConfirmation | null>(null)
  const [signedUrls, setSignedUrls] = React.useState<string[]>([])
  const [isImagesLoading, setIsImagesLoading] = React.useState(false)
  
  // State Aksi
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [rejectionReason, setRejectionReason] = React.useState("")
  const [showRejectInput, setShowRejectInput] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  // Ganti bank code jadi label human readable
  const getChannelLabel = (key: string) => {
    switch (key) {
      case "SUMSEL_BABEL_SYARIAH": return "BSB Syariah"
      case "BSI": return "Bank BSI"
      case "MANDIRI": return "Bank Mandiri"
      case "BCA": return "Bank BCA"
      case "BRI": return "Bank BRI"
      case "BNI": return "Bank BNI"
      case "QRIS": return "QRIS (Scan)"
      case "OTHER": return "Lainnya"
      default: return key
    }
  }

  // Buka modal detail & muat URL bukti transfer yang ditandatangani
  const handleOpenDetail = async (item: SerializedConfirmation) => {
    setSelectedItem(item)
    setIsImagesLoading(true)
    setSignedUrls([])
    setShowRejectInput(false)
    setRejectionReason("")
    setErrorMsg(null)
    
    try {
      const res = await getSignedUrls(item.proofUrls)
      if (res.success && res.urls) {
        setSignedUrls(res.urls)
      } else {
        setErrorMsg(res.error || "Gagal memuat file gambar bukti.")
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan memuat gambar.")
    } finally {
      setIsImagesLoading(false)
    }
  }

  // Setujui Donasi (Approve)
  const handleApprove = async () => {
    if (!selectedItem) return
    setIsSubmitting(true)
    setErrorMsg(null)
    
    try {
      const res = await approveDonationAction(selectedItem.id)
      if (res.success) {
        // Hapus item yang berhasil divalidasi dari list lokal
        setConfirmations(prev => prev.filter(c => c.id !== selectedItem.id))
        setSelectedItem(null)
      } else {
        setErrorMsg(res.error || "Gagal menyetujui donasi.")
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Tolak Donasi (Reject)
  const handleReject = async () => {
    if (!selectedItem) return
    if (!showRejectInput) {
      setShowRejectInput(true)
      return
    }
    if (!rejectionReason.trim()) {
      setErrorMsg("Alasan penolakan wajib ditulis.")
      return
    }

    setIsSubmitting(true)
    setErrorMsg(null)
    
    try {
      const res = await rejectDonationAction(selectedItem.id, rejectionReason)
      if (res.success) {
        setConfirmations(prev => prev.filter(c => c.id !== selectedItem.id))
        setSelectedItem(null)
      } else {
        setErrorMsg(res.error || "Gagal menolak donasi.")
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER UTAMA */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border-[2px] border-black bg-blue-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <ShieldAlert className="h-5 w-5 text-blue-600 animate-pulse" />
        </div>
        <div>
          <h1 className="text-sm font-black uppercase tracking-tight text-neutral-800">Validasi Donasi Pending</h1>
          <p className="text-[10px] text-muted-foreground font-medium">Verifikasi data konfirmasi donasi online yang dikirim oleh publik</p>
        </div>
      </div>

      {/* LIST ANTRIAN CONFIRMATION */}
      <div className="grid grid-cols-1 gap-4">
        
        {confirmations.length === 0 ? (
          /* EMPTY STATE CARD */
          <Card className="bg-emerald-50/40 border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
            <div className="h-12 w-12 bg-emerald-100 border-[2px] border-black rounded-full flex items-center justify-center mx-auto mb-3">
              <HeartHandshake className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-emerald-950">Antrean Bersih!</h3>
            <p className="text-[11px] text-neutral-600 max-w-sm mx-auto mt-1 font-medium leading-normal">
              Alhamdulillah, seluruh data donasi transfer dan QRIS dari donatur telah selesai divalidasi dan tercatat bersih pada kas.
            </p>
          </Card>
        ) : (
          /* LIST ITEM */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {confirmations.map((item) => (
              <Card 
                key={item.id} 
                className="bg-white border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all overflow-hidden flex flex-col"
              >
                <CardHeader className="pb-2.5 border-b-[2.5px] border-black bg-neutral-50/50">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 bg-neutral-200 border border-neutral-400 px-2 py-0.5 rounded-full">
                      Pending Approval
                    </span>
                    <span className="text-[9px] text-neutral-400 font-bold tabular-nums">
                      {item.createdAt.slice(0, 10)}
                    </span>
                  </div>
                  <CardTitle className="text-sm font-black text-neutral-900 pt-1.5 truncate">
                    {item.isAnonymous ? "Hamba Allah" : item.donorName}
                  </CardTitle>
                  {item.donorAddress && (
                    <CardDescription className="text-[9px] text-neutral-500 font-semibold flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" /> {item.donorAddress}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pt-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    {/* Nominal Besar */}
                    <div className="text-lg font-black text-emerald-700 tabular-nums">
                      Rp {formatRupiah(item.amount)}
                    </div>
                    {/* Detail Saluran */}
                    <div className="flex gap-4 text-[10px] font-bold text-neutral-600">
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3 text-neutral-400" /> {getChannelLabel(item.paymentChannel)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-neutral-400" /> {item.transferDate}
                      </span>
                    </div>
                  </div>

                  {/* Button Action */}
                  <Button
                    type="button"
                    onClick={() => handleOpenDetail(item)}
                    className="w-full text-[10px] font-black uppercase tracking-wider border-[2.5px] border-black bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-[12px] shadow-[3px_3px_0px_0px_#1e40af] py-4 h-auto cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Eye className="h-4 w-4" />
                    Periksa Bukti & Validasi
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>

      {/* =============================================================
          MODAL DETAIL & VERIFIKASI (CUSTOM NEOBRUTALIST WINDOW overlay)
          ============================================================= */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white border-[3px] border-black rounded-[22px] w-full max-w-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b-[3px] border-black bg-blue-50/50">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-700">Verifikasi Donasi</h3>
                <span className="text-[10px] text-muted-foreground font-semibold">Periksa kecocokan bukti fisik dengan input data</span>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                disabled={isSubmitting}
                className="h-8 w-8 flex items-center justify-center rounded-full border-[2px] border-black bg-neutral-100 hover:bg-neutral-200 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer shrink-0"
              >
                <X className="h-4 w-4 text-black" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Notifikasi Error */}
              {errorMsg && (
                <div className="p-3 border-[2px] border-black bg-red-100 rounded-[12px] text-[10px] font-bold text-red-900">
                  {errorMsg}
                </div>
              )}

              {/* Data Detail Pihak Donatur */}
              <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-neutral-800 bg-[#fafafa] border-[2px] border-black p-3.5 rounded-[16px] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
                
                <div className="space-y-0.5">
                  <span className="text-neutral-400 block text-[9px] uppercase">Nama Donatur</span>
                  <span className="text-neutral-900 flex items-center gap-1">
                    <User className="h-3 w-3 text-neutral-400" /> {selectedItem.isAnonymous ? "Hamba Allah" : selectedItem.donorName}
                  </span>
                </div>
                
                <div className="space-y-0.5">
                  <span className="text-neutral-400 block text-[9px] uppercase">Jumlah Transfer</span>
                  <span className="text-emerald-700 text-xs font-black">
                    Rp {formatRupiah(selectedItem.amount)}
                  </span>
                </div>
                
                <div className="space-y-0.5">
                  <span className="text-neutral-400 block text-[9px] uppercase">Tanggal Transfer</span>
                  <span className="text-neutral-900 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-neutral-400" /> {selectedItem.transferDate}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-neutral-400 block text-[9px] uppercase">Saluran Transaksi</span>
                  <span className="text-neutral-900 flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-neutral-400" /> {getChannelLabel(selectedItem.paymentChannel)}
                  </span>
                </div>

                {selectedItem.donorAddress && (
                  <div className="col-span-2 space-y-0.5 pt-1 border-t border-neutral-200">
                    <span className="text-neutral-400 block text-[9px] uppercase">Alamat</span>
                    <span className="text-neutral-900 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400" /> {selectedItem.donorAddress}
                    </span>
                  </div>
                )}

              </div>

              {/* Preview Gambar Bukti */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-wider">File Bukti Upload:</span>
                
                {isImagesLoading ? (
                  <div className="flex flex-col items-center justify-center p-8 border-[2px] border-black rounded-[16px] bg-neutral-50">
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-600 mb-1" />
                    <span className="text-[9px] text-neutral-400 font-bold">Membuka Bukti...</span>
                  </div>
                ) : signedUrls.length === 0 ? (
                  <div className="p-4 border-[2.5px] border-dashed border-red-400 rounded-[16px] text-center bg-red-50 text-[10px] font-bold text-red-800">
                    Gagal memuat/tidak ada gambar bukti transfer.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {signedUrls.map((url, idx) => (
                      <div key={idx} className="border-[2px] border-black rounded-[14px] p-2 bg-[#fafafa] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block relative group rounded-[8px] overflow-hidden border border-neutral-200"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={url} 
                            alt={`Bukti Transfer ${idx + 1}`} 
                            className="w-full h-auto max-h-[320px] object-contain transition-transform group-hover:scale-102" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[9px] font-black uppercase tracking-wider">
                            Perbesar Gambar di Tab Baru ↗
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Form Penolakan */}
              {showRejectInput && (
                <div className="space-y-2 p-3.5 border-[2px] border-black rounded-[16px] bg-red-50 animate-in slide-in-from-bottom-2 duration-200">
                  <label className="text-[10px] font-black text-red-950 uppercase tracking-wide">
                    Alasan Penolakan Donasi:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Bukti transfer terpotong, nominal tidak tertera pada mutasi bank..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full font-bold text-xs p-2.5 border-[2px] border-black rounded-[10px] focus:outline-none focus:border-red-600 bg-white"
                  />
                </div>
              )}

            </div>

            {/* Modal Footer / Aksi */}
            <div className="p-4 border-t-[3px] border-black bg-neutral-50 flex flex-col sm:flex-row gap-3">
              
              {/* Tombol Tolak */}
              <Button
                type="button"
                onClick={handleReject}
                disabled={isSubmitting || isImagesLoading}
                className="w-full sm:flex-1 text-[10px] font-black uppercase tracking-wider border-[2.5px] border-black bg-red-100 hover:bg-red-200 text-red-800 rounded-[12px] shadow-[3px_3px_0px_0px_#991b1b] py-4 h-auto cursor-pointer flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#991b1b]"
              >
                <X className="h-4 w-4" />
                {showRejectInput ? "Konfirmasi Tolak" : "Tolak Transaksi"}
              </Button>

              {/* Tombol Setujui */}
              <Button
                type="button"
                onClick={handleApprove}
                disabled={isSubmitting || isImagesLoading || showRejectInput}
                className="w-full sm:flex-1 text-[10px] font-black uppercase tracking-wider border-[2.5px] border-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-[12px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] py-4 h-auto cursor-pointer flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-55 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Mendaftarkan...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Setujui & Catat Kas
                  </>
                )}
              </Button>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}
