"use client"

import * as React from "react"
import { 
  PlusCircle, 
  MinusCircle, 
  FileText, 
  Calendar, 
  Wallet, 
  Layers, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  RotateCcw, 
  AlertTriangle, 
  Trash2,
  Pencil,
  Upload,
  Package,
  Check
} from "lucide-react"
import { getSignedUrls } from "@/app/admin/pemasukan/actions"
import { cn, safeDateToIso, toLocalDateInputValue, compareIncomes } from "@/lib/utils"
import { formatRupiah, formatTerbilang } from "@/lib/format"

// Month Names in Indonesian
const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

interface IncomeItem {
  id: string
  donorName: string
  donorAddress: string | null
  donorPhone?: string | null
  amount: number
  date: string
  description: string | null
  type: "CASH" | "TRANSFER"
  receiptUrls: string[]
  donationConfirmationId: string | null
}

interface OutcomeItem {
  id: string
  buyer: string
  amount: number
  date: string
  description: string
  category: "MATERIAL" | "LABOR" | "OPERATIONAL" | "OTHER"
  receiptUrls: string[]
}

interface MaterialItem {
  id: string
  donorName: string
  donorAddress?: string
  donorPhone?: string
  materialName: string
  quantity: string
  date: string
  description: string
  receiptUrls: string[]
}

interface RincianDanaClientProps {
  incomes: IncomeItem[]
  outcomes: OutcomeItem[]
  materials: MaterialItem[]
}

export default function RincianDanaClient({ incomes, outcomes, materials }: RincianDanaClientProps) {
  // Active Tab: 'income', 'outcome', 'material'
  const [activeTab, setActiveTab] = React.useState<"income" | "outcome" | "material">("income")

  // --- FILTER STATES ---
  // Income Filters
  const [incomeType, setIncomeType] = React.useState<string>("all")
  const [incomeAmountRange, setIncomeAmountRange] = React.useState<string>("all")
  const [incomeMonth, setIncomeMonth] = React.useState<string>("all")
  const [incomeAddress, setIncomeAddress] = React.useState<string>("all")
  const [incomeSearch, setIncomeSearch] = React.useState<string>("")
  const [incomePage, setIncomePage] = React.useState<number>(1)

  // Outcome Filters
  const [outcomeCategory, setOutcomeCategory] = React.useState<string>("all")
  const [outcomeAmountRange, setOutcomeAmountRange] = React.useState<string>("all")
  const [outcomeMonth, setOutcomeMonth] = React.useState<string>("all")
  const [outcomeSearch, setOutcomeSearch] = React.useState<string>("")
  const [outcomePage, setOutcomePage] = React.useState<number>(1)

  // Material Filters
  const [materialMonth, setMaterialMonth] = React.useState<string>("all")
  const [materialAddress, setMaterialAddress] = React.useState<string>("all")
  const [materialSearch, setMaterialSearch] = React.useState<string>("")
  const [materialPage, setMaterialPage] = React.useState<number>(1)

  // Page Size Constant
  const pageSize = 10

  // Delete Modal State
  const [deleteModal, setDeleteModal] = React.useState<{
    isOpen: boolean
    type: "income" | "outcome" | "material"
    id: string
    name: string
    amount: number
    isDeleting: boolean
    error: string | null
  }>({
    isOpen: false,
    type: "income",
    id: "",
    name: "",
    amount: 0,
    isDeleting: false,
    error: null
  })

  // --- EDIT MODAL STATE ---
  const [editModal, setEditModal] = React.useState<{
    isOpen: boolean
    type: "income" | "outcome" | "material"
    id: string
    donorName: string
    donorAddress: string
    donorPhone: string
    isAnonymous: boolean
    incomeType: "CASH" | "TRANSFER"
    buyer: string
    category: "MATERIAL" | "LABOR" | "OPERATIONAL" | "OTHER"
    amount: number
    amountInput: string
    materialName: string
    quantity: string
    date: string
    description: string
    existingReceiptUrls: string[]
    existingReceiptSignedUrls: string[]
    isLoadingSignedUrls: boolean
    newFiles: { file: File; preview: string }[]
    isSubmitting: boolean
    error: string | null
  }>({
    isOpen: false,
    type: "income",
    id: "",
    donorName: "",
    donorAddress: "",
    donorPhone: "",
    isAnonymous: false,
    incomeType: "CASH",
    buyer: "",
    category: "MATERIAL",
    amount: 0,
    amountInput: "",
    materialName: "",
    quantity: "",
    date: "",
    description: "",
    existingReceiptUrls: [],
    existingReceiptSignedUrls: [],
    isLoadingSignedUrls: false,
    newFiles: [],
    isSubmitting: false,
    error: null
  })

  // --- LIGHTBOX GALLERY STATE ---
  const [lightbox, setLightbox] = React.useState<{
    isOpen: boolean
    urls: string[]
    currentIndex: number
    isLoading: boolean
    error: string | null
  }>({
    isOpen: false,
    urls: [],
    currentIndex: 0,
    isLoading: false,
    error: null
  })

  // --- SUCCESS RESPONSE MODAL STATE ---
  const [successModal, setSuccessModal] = React.useState<{
    isOpen: boolean
    title: string
    message: string
  }>({
    isOpen: false,
    title: "",
    message: ""
  })

  // Pre-generate unique month keys for dropdown filtering
  const uniqueIncomeMonths = React.useMemo(() => {
    return getUniqueMonths(incomes.map(item => item.date))
  }, [incomes])

  const uniqueOutcomeMonths = React.useMemo(() => {
    return getUniqueMonths(outcomes.map(item => item.date))
  }, [outcomes])

  const uniqueMaterialMonths = React.useMemo(() => {
    return getUniqueMonths(materials.map(item => item.date))
  }, [materials])

  // Predefined address filter options
  const PREDEFINED_ADDRESSES = [
    { value: "Meranjat II", label: "Meranjat II" },
    { value: "Meranjat I", label: "Meranjat I" },
    { value: "Meranjat Ilir", label: "Meranjat Ilir" },
    { value: "Palembang", label: "Palembang" },
    { value: "__lainnya__", label: "Lainnya" },
  ]

  // Helper to match address filters flexible & substring-aware
  const matchAddressFilter = React.useCallback((rawAddr: string | null | undefined, selectedFilter: string) => {
    if (selectedFilter === "all") return true
    const addr = (rawAddr || "").trim().toLowerCase()

    const isMeranjatII = addr ? (addr.includes("meranjat ii") || addr.includes("meranjat 2")) : false
    const isMeranjatIlir = addr ? addr.includes("meranjat ilir") : false
    const isMeranjatI = addr ? ((addr.includes("meranjat i") || addr.includes("meranjat 1")) && !isMeranjatII && !isMeranjatIlir) : false
    const isPalembang = addr ? addr.includes("palembang") : false

    if (selectedFilter === "Meranjat II") return isMeranjatII
    if (selectedFilter === "Meranjat I") return isMeranjatI
    if (selectedFilter === "Meranjat Ilir") return isMeranjatIlir
    if (selectedFilter === "Palembang") return isPalembang
    if (selectedFilter === "__lainnya__") {
      return !isMeranjatII && !isMeranjatI && !isMeranjatIlir && !isPalembang
    }
    return addr ? addr.includes(selectedFilter.toLowerCase()) : false
  }, [])

  // --- FILTER LOGIC ---
  const filteredIncomes = React.useMemo(() => {
    return incomes.filter(item => {
      const matchType = incomeType === "all" || item.type === incomeType
      const matchAmount = filterByAmountRange(item.amount, incomeAmountRange)
      const matchMonth = filterByMonth(item.date, incomeMonth)
      const matchAddress = matchAddressFilter(item.donorAddress, incomeAddress)
      
      const s = incomeSearch.toLowerCase().trim()
      const matchSearch = !s || 
        item.donorName.toLowerCase().includes(s) || 
        (item.donorAddress && item.donorAddress.toLowerCase().includes(s)) ||
        (item.description && item.description.toLowerCase().includes(s))

      return matchType && matchAmount && matchMonth && matchAddress && matchSearch
    }).sort(compareIncomes)
  }, [incomes, incomeType, incomeAmountRange, incomeMonth, incomeAddress, incomeSearch, matchAddressFilter])

  const filteredOutcomes = React.useMemo(() => {
    return outcomes.filter(item => {
      const matchCategory = outcomeCategory === "all" || item.category === outcomeCategory
      const matchAmount = filterByAmountRange(item.amount, outcomeAmountRange)
      const matchMonth = filterByMonth(item.date, outcomeMonth)

      const s = outcomeSearch.toLowerCase().trim()
      const matchSearch = !s ||
        item.buyer.toLowerCase().includes(s) ||
        (item.description && item.description.toLowerCase().includes(s))

      return matchCategory && matchAmount && matchMonth && matchSearch
    })
  }, [outcomes, outcomeCategory, outcomeAmountRange, outcomeMonth, outcomeSearch])

  const filteredMaterials = React.useMemo(() => {
    return materials.filter(item => {
      const matchMonth = filterByMonth(item.date, materialMonth)
      const matchAddress = matchAddressFilter(item.donorAddress, materialAddress)

      const s = materialSearch.toLowerCase().trim()
      const matchSearch = !s ||
        item.donorName.toLowerCase().includes(s) ||
        item.materialName.toLowerCase().includes(s) ||
        (item.donorAddress && item.donorAddress.toLowerCase().includes(s)) ||
        (item.description && item.description.toLowerCase().includes(s))

      return matchMonth && matchAddress && matchSearch
    })
  }, [materials, materialMonth, materialAddress, materialSearch, matchAddressFilter])

  // --- PAGINATION SLICE LOGIC ---
  const currentPage = activeTab === "income" ? incomePage : activeTab === "outcome" ? outcomePage : materialPage
  const totalFilteredItems = activeTab === "income" ? filteredIncomes.length : activeTab === "outcome" ? filteredOutcomes.length : filteredMaterials.length
  const totalPages = Math.ceil(totalFilteredItems / pageSize)

  const paginatedIncomes = React.useMemo(() => {
    return filteredIncomes.slice((incomePage - 1) * pageSize, incomePage * pageSize)
  }, [filteredIncomes, incomePage])

  const paginatedOutcomes = React.useMemo(() => {
    return filteredOutcomes.slice((outcomePage - 1) * pageSize, outcomePage * pageSize)
  }, [filteredOutcomes, outcomePage])

  const paginatedMaterials = React.useMemo(() => {
    return filteredMaterials.slice((materialPage - 1) * pageSize, materialPage * pageSize)
  }, [filteredMaterials, materialPage])

  const handlePageChange = (page: number) => {
    if (activeTab === "income") {
      setIncomePage(page)
    } else if (activeTab === "outcome") {
      setOutcomePage(page)
    } else {
      setMaterialPage(page)
    }
  }

  // Reset all filters and search for active tab
  const handleResetFilters = () => {
    if (activeTab === "income") {
      setIncomeType("all")
      setIncomeAmountRange("all")
      setIncomeMonth("all")
      setIncomeAddress("all")
      setIncomeSearch("")
      setIncomePage(1)
    } else if (activeTab === "outcome") {
      setOutcomeCategory("all")
      setOutcomeAmountRange("all")
      setOutcomeMonth("all")
      setOutcomeSearch("")
      setOutcomePage(1)
    } else {
      setMaterialMonth("all")
      setMaterialAddress("all")
      setMaterialSearch("")
      setMaterialPage(1)
    }
  }

  // Handler for Lightbox preview
  const handlePreviewImages = async (imagePaths: string[]) => {
    setLightbox({
      isOpen: true,
      urls: [],
      currentIndex: 0,
      isLoading: true,
      error: null
    })

    try {
      const res = await getSignedUrls(imagePaths)
      if (res.success && res.urls) {
        setLightbox(prev => ({
          ...prev,
          urls: res.urls,
          isLoading: false
        }))
      } else {
        throw new Error(res.error || "Gagal mendapatkan tautan gambar.")
      }
    } catch (e: any) {
      setLightbox(prev => ({
        ...prev,
        isLoading: false,
        error: e instanceof Error ? e.message : "Gagal memuat berkas bukti belanja."
      }))
    }
  }

  // Open Edit Modal
  const handleOpenEditModal = async (type: "income" | "outcome" | "material", item: any) => {
    const isIncome = type === "income"
    const isMaterial = type === "material"
    const formattedDate = item.date ? toLocalDateInputValue(item.date) : ""
    
    setEditModal({
      isOpen: true,
      type,
      id: item.id,
      donorName: (isIncome || isMaterial) ? (item.donorName === "Hamba Allah" ? "" : item.donorName) : "",
      donorAddress: (isIncome || isMaterial) ? (item.donorAddress || "") : "",
      donorPhone: (isIncome || isMaterial) ? (item.donorPhone || "") : "",
      isAnonymous: (isIncome || isMaterial) ? item.donorName === "Hamba Allah" : false,
      incomeType: isIncome ? item.type : "CASH",
      buyer: (!isIncome && !isMaterial) ? item.buyer : "",
      category: (!isIncome && !isMaterial) ? item.category : "MATERIAL",
      amount: item.amount || 0,
      amountInput: item.amount ? formatRupiah(item.amount) : "",
      materialName: isMaterial ? (item.materialName || "") : "",
      quantity: isMaterial ? (item.quantity || "") : "",
      date: formattedDate,
      description: item.description || "",
      existingReceiptUrls: item.receiptUrls || [],
      existingReceiptSignedUrls: [],
      isLoadingSignedUrls: !!(item.receiptUrls && item.receiptUrls.length > 0),
      newFiles: [],
      isSubmitting: false,
      error: null
    })

    // Fetch signed URLs for existing receipts
    if (item.receiptUrls && item.receiptUrls.length > 0) {
      try {
        const res = await getSignedUrls(item.receiptUrls)
        if (res.success && res.urls) {
          setEditModal(prev => ({
            ...prev,
            existingReceiptSignedUrls: res.urls,
            isLoadingSignedUrls: false
          }))
        }
      } catch {
        setEditModal(prev => ({ ...prev, isLoadingSignedUrls: false }))
      }
    }
  }

  // Remove existing receipt image from edit modal
  const handleRemoveExistingReceipt = (index: number) => {
    setEditModal(prev => ({
      ...prev,
      existingReceiptUrls: prev.existingReceiptUrls.filter((_, i) => i !== index),
      existingReceiptSignedUrls: prev.existingReceiptSignedUrls.filter((_, i) => i !== index)
    }))
  }

  // Add new file uploads in edit modal
  const handleAddNewFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const validFiles: { file: File; preview: string }[] = []

      for (const file of filesArray) {
        if (file.size > 10 * 1024 * 1024) {
          setEditModal(prev => ({ ...prev, error: `Berkas "${file.name}" terlalu besar (maksimal 10MB).` }))
          return
        }
        if (!file.type.startsWith("image/")) {
          setEditModal(prev => ({ ...prev, error: `Berkas "${file.name}" harus berupa gambar (JPG/PNG/WebP).` }))
          return
        }
        validFiles.push({
          file,
          preview: URL.createObjectURL(file)
        })
      }

      setEditModal(prev => ({
        ...prev,
        newFiles: [...prev.newFiles, ...validFiles],
        error: null
      }))
    }
  }

  // Remove newly added file preview in edit modal
  const handleRemoveNewFile = (index: number) => {
    setEditModal(prev => {
      const target = prev.newFiles[index]
      if (target) URL.revokeObjectURL(target.preview)
      return {
        ...prev,
        newFiles: prev.newFiles.filter((_, i) => i !== index)
      }
    })
  }

  // Save Edits via Server Actions
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditModal(prev => ({ ...prev, isSubmitting: true, error: null }))

    try {
      const { updateIncomeAction, updateOutcomeAction, updateMaterialAction } = await import("./actions")

      if (editModal.type !== "material" && editModal.amount <= 0) {
        throw new Error("Nominal transaksi harus lebih dari Rp 0.")
      }
      if (!editModal.date) {
        throw new Error("Tanggal transaksi harus diisi.")
      }

      const formData = new FormData()
      formData.append("id", editModal.id)
      if (editModal.type !== "material") {
        formData.append("amount", editModal.amount.toString())
      }
      formData.append("date", editModal.date)
      formData.append("existingReceiptUrls", JSON.stringify(editModal.existingReceiptUrls))

      if (editModal.type === "income") {
        if (!editModal.isAnonymous && !editModal.donorName.trim()) {
          throw new Error("Nama Donatur wajib diisi jika tidak dicentang anonim.")
        }
        formData.append("donorName", editModal.isAnonymous ? "Hamba Allah" : editModal.donorName.trim())
        formData.append("donorAddress", editModal.donorAddress.trim())
        formData.append("donorPhone", editModal.donorPhone.trim())
        formData.append("description", editModal.description.trim())
        formData.append("type", editModal.incomeType)
        formData.append("isAnonymous", editModal.isAnonymous ? "true" : "false")
      } else if (editModal.type === "material") {
        if (!editModal.isAnonymous && !editModal.donorName.trim()) {
          throw new Error("Nama Donatur wajib diisi jika tidak dicentang anonim.")
        }
        if (!editModal.materialName.trim()) {
          throw new Error("Nama material wajib diisi.")
        }
        if (!editModal.quantity.trim()) {
          throw new Error("Jumlah / volume material wajib diisi.")
        }
        formData.append("donorName", editModal.isAnonymous ? "Hamba Allah" : editModal.donorName.trim())
        formData.append("donorAddress", editModal.donorAddress.trim())
        formData.append("donorPhone", editModal.donorPhone.trim())
        formData.append("materialName", editModal.materialName.trim())
        formData.append("quantity", editModal.quantity.trim())
        formData.append("description", editModal.description.trim())
        formData.append("isAnonymous", editModal.isAnonymous ? "true" : "false")
      } else {
        if (!editModal.buyer.trim()) {
          throw new Error("Nama penanggung jawab / pembeli wajib diisi.")
        }
        if (!editModal.description.trim()) {
          throw new Error("Keterangan pengeluaran wajib diisi.")
        }
        formData.append("buyer", editModal.buyer.trim())
        formData.append("category", editModal.category)
        formData.append("description", editModal.description.trim())
      }

      // Append new uploaded files
      editModal.newFiles.forEach(item => {
        formData.append("files", item.file)
      })

      let res
      if (editModal.type === "income") {
        res = await updateIncomeAction(formData)
      } else if (editModal.type === "material") {
        res = await updateMaterialAction(formData)
      } else {
        res = await updateOutcomeAction(formData)
      }

      if (res.success) {
        editModal.newFiles.forEach(f => URL.revokeObjectURL(f.preview))
        const savedTypeLabel = editModal.type === "income" ? "pemasukan" : editModal.type === "material" ? "donasi material" : "pengeluaran"
        setEditModal(prev => ({
          ...prev,
          isOpen: false,
          isSubmitting: false,
          error: null
        }))
        setSuccessModal({
          isOpen: true,
          title: "Berhasil Memperbarui Data",
          message: `Data ${savedTypeLabel} berhasil diperbarui di database.`
        })
      } else {
        throw new Error(res.error || "Gagal memperbarui data transaksi.")
      }
    } catch (err: any) {
      setEditModal(prev => ({
        ...prev,
        isSubmitting: false,
        error: err.message || "Terjadi kesalahan saat memperbarui data."
      }))
    }
  }

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = (type: "income" | "outcome" | "material", item: any) => {
    setDeleteModal({
      isOpen: true,
      type,
      id: item.id,
      name: type === "outcome" ? item.buyer : item.donorName,
      amount: item.amount || 0,
      isDeleting: false,
      error: null
    })
  }

  // Execute Deletion via Server Actions
  const handleConfirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, isDeleting: true, error: null }))
    try {
      const { deleteIncomeAction, deleteOutcomeAction, deleteMaterialAction } = await import("./actions")
      let res
      if (deleteModal.type === "income") {
        res = await deleteIncomeAction(deleteModal.id)
      } else if (deleteModal.type === "material") {
        res = await deleteMaterialAction(deleteModal.id)
      } else {
        res = await deleteOutcomeAction(deleteModal.id)
      }

      if (res.success) {
        const deletedTypeLabel = deleteModal.type === "income" ? "pemasukan" : deleteModal.type === "material" ? "donasi material" : "pengeluaran"
        setDeleteModal({
          isOpen: false,
          type: "income",
          id: "",
          name: "",
          amount: 0,
          isDeleting: false,
          error: null
        })
        setSuccessModal({
          isOpen: true,
          title: "Berhasil Menghapus Data",
          message: `Data ${deletedTypeLabel} berhasil dihapus dari database.`
        })
      } else {
        throw new Error(res.error || "Gagal menghapus data.")
      }
    } catch (err: any) {
      setDeleteModal(prev => ({
        ...prev,
        isDeleting: false,
        error: err.message || "Gagal menghapus data. Silakan coba lagi."
      }))
    }
  }

  const handleDownloadIncomePDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf")
      const { default: autoTable } = await import("jspdf-autotable")
      
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      })

      const today = new Date()
      const day = today.getDate()
      const month = MONTH_NAMES[today.getMonth()]
      const year = today.getFullYear()
      const pageWidth = doc.internal.pageSize.getWidth()

      // Kop/Header Laporan - Centered
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text("Laporan Pemasukan Kas Pembangunan Menara Masjid Al-Ikhlas Meranjat II", pageWidth / 2, 15, { align: "center" })

      // Metadata section - Semibold labels & aligned names
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9.5)
      doc.text("Ketua Pembangunan:", 14, 25)
      doc.text("Sekretaris Pembangunan:", 14, 30)
      doc.text("Bendahara Pembangunan:", 14, 35)
      doc.text("Tanggal Cetak Laporan:", 14, 40)

      doc.setFont("helvetica", "normal")
      doc.text("Zulfikar Ali, S.H.", 60, 25)
      doc.text("Najemi", 60, 30)
      doc.text("Candra Gunawan, S.H.", 60, 35)
      doc.text(`Per Tanggal ${day} ${month} ${year}`, 60, 40)

      // Grouping data by Month-Year descending
      const groups: { [key: string]: IncomeItem[] } = {}
      filteredIncomes.forEach(item => {
        const d = new Date(item.date)
        const monthKey = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`
        if (!groups[monthKey]) {
          groups[monthKey] = []
        }
        groups[monthKey].push(item)
      })

      const sortedMonthKeys = Object.keys(groups).sort().reverse()

      const bodyRows: any[] = []
      let globalIndex = 1
      let grandTotal = 0

      sortedMonthKeys.forEach(monthKey => {
        const [yearStr, monthStr] = monthKey.split("-")
        const y = parseInt(yearStr, 10)
        const mIdx = parseInt(monthStr, 10)
        const monthNameUpper = MONTH_NAMES[mIdx].toUpperCase()
        const groupTitle = `${monthNameUpper} ${y}`

        // 1. Merged month header row
        bodyRows.push([
          {
            content: groupTitle,
            colSpan: 6,
            styles: { halign: "left", fontStyle: "bold", fillColor: [243, 244, 246], textColor: [17, 24, 39] }
          }
        ])

        // 2. Add items
        let monthSum = 0
        const items = groups[monthKey].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        items.forEach(item => {
          monthSum += item.amount
          grandTotal += item.amount
          bodyRows.push([
            globalIndex++,
            formatLocalDate(item.date),
            item.donorName,
            item.donorAddress || "-",
            `Rp ${formatRupiah(item.amount)}`,
            item.description || "-"
          ])
        })

        // 3. Month total row
        bodyRows.push([
          {
            content: `TOTAL PEMASUKAN ${groupTitle}`,
            colSpan: 4,
            styles: { halign: "right", fontStyle: "bold", fillColor: [249, 250, 251], textColor: [0, 0, 0] }
          },
          {
            content: `Rp ${formatRupiah(monthSum)}`,
            styles: { halign: "right", fontStyle: "bold", fillColor: [249, 250, 251], textColor: [0, 0, 0] }
          },
          {
            content: "",
            styles: { fillColor: [249, 250, 251] }
          }
        ])
      })

      // Generate table using jspdf-autotable
      autoTable(doc, {
        startY: 46,
        head: [
          ["No", "Tanggal", "Nama Donatur", "Alamat", "Kas Masuk", "Keterangan"]
        ],
        body: bodyRows,
        foot: [
          [
            {
              content: "TOTAL KAS PEMASUKAN",
              colSpan: 4,
              styles: { halign: "right", fontStyle: "bold", fillColor: [229, 231, 235], textColor: [0, 0, 0] }
            },
            {
              content: `Rp ${formatRupiah(grandTotal)}`,
              styles: { halign: "right", fontStyle: "bold", fillColor: [229, 231, 235], textColor: [0, 0, 0] }
            },
            {
              content: "",
              styles: { fillColor: [229, 231, 235] }
            }
          ]
        ],
        theme: "grid",
        headStyles: {
          fillColor: [17, 24, 39], // Slate-900 / Black
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center"
        },
        styles: {
          font: "helvetica",
          fontSize: 8.5,
          cellPadding: 2.5,
          lineColor: [209, 213, 219] // gray-300 grid borders
        },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: 25, halign: "center" },
          2: { cellWidth: 50 },
          3: { cellWidth: 50 },
          4: { cellWidth: 40, halign: "right" },
          5: { cellWidth: "auto" }
        }
      })


      // =============================================
      // HALAMAN BARU: TABEL DONASI MATERIAL
      // =============================================
      doc.addPage()

      // Header halaman material
      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      doc.text("Daftar Donasi Material Pembangunan Menara Masjid Al-Ikhlas Meranjat II", pageWidth / 2, 15, { align: "center" })

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.text(`(Lampiran Laporan Kas Masuk \u2014 Dicetak Per Tanggal ${day} ${month} ${year})`, pageWidth / 2, 22, { align: "center" })

      // Grouping materials by Month-Year descending
      const matGroups: { [key: string]: MaterialItem[] } = {}
      materials.forEach(matItem => {
        const d = new Date(matItem.date)
        const monthKey = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`
        if (!matGroups[monthKey]) {
          matGroups[monthKey] = []
        }
        matGroups[monthKey].push(matItem)
      })

      const sortedMatKeys = Object.keys(matGroups).sort().reverse()
      const matBodyRows: any[] = []
      let matGlobalIndex = 1

      sortedMatKeys.forEach(matKey => {
        const [matYearStr, matMonthStr] = matKey.split("-")
        const matY = parseInt(matYearStr, 10)
        const matMIdx = parseInt(matMonthStr, 10)
        const matGroupTitle = `${MONTH_NAMES[matMIdx].toUpperCase()} ${matY}`

        // Month header row
        matBodyRows.push([
          {
            content: matGroupTitle,
            colSpan: 6,
            styles: { halign: "left", fontStyle: "bold", fillColor: [254, 243, 199], textColor: [120, 53, 15] }
          }
        ])

        // Items
        let monthCount = 0
        const matItems = matGroups[matKey].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        matItems.forEach(matItem => {
          monthCount++
          matBodyRows.push([
            matGlobalIndex++,
            formatLocalDate(matItem.date),
            matItem.donorName,
            matItem.donorAddress || "-",
            `${matItem.materialName} (${matItem.quantity})`,
            matItem.description || "-"
          ])
        })

        // Month count row
        matBodyRows.push([
          {
            content: `JUMLAH DONASI MATERIAL ${matGroupTitle}`,
            colSpan: 4,
            styles: { halign: "right", fontStyle: "bold", fillColor: [255, 251, 235], textColor: [0, 0, 0] }
          },
          {
            content: `${monthCount} item`,
            styles: { halign: "right", fontStyle: "bold", fillColor: [255, 251, 235], textColor: [0, 0, 0] }
          },
          {
            content: "",
            styles: { fillColor: [255, 251, 235] }
          }
        ])
      })

      autoTable(doc, {
        startY: 28,
        head: [
          ["No", "Tanggal", "Nama Donatur", "Alamat", "Material & Jumlah", "Keterangan"]
        ],
        body: matBodyRows,
        foot: [
          [
            {
              content: "TOTAL DONASI MATERIAL",
              colSpan: 4,
              styles: { halign: "right", fontStyle: "bold", fillColor: [254, 243, 199], textColor: [0, 0, 0] }
            },
            {
              content: `${materials.length} item`,
              styles: { halign: "right", fontStyle: "bold", fillColor: [254, 243, 199], textColor: [0, 0, 0] }
            },
            {
              content: "",
              styles: { fillColor: [254, 243, 199] }
            }
          ]
        ],
        theme: "grid",
        headStyles: {
          fillColor: [120, 53, 15], // Amber-900
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center"
        },
        styles: {
          font: "helvetica",
          fontSize: 8.5,
          cellPadding: 2.5,
          lineColor: [217, 119, 6]
        },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: 25, halign: "center" },
          2: { cellWidth: 50 },
          3: { cellWidth: 50 },
          4: { cellWidth: 55 },
          5: { cellWidth: "auto" }
        }
      })

      doc.save(`Laporan_Pemasukan_Menara_Al_Ikhlas_${day}_${month}_${year}.pdf`)
    } catch (err) {
      console.error("Gagal mengekspor PDF:", err)
      alert("Terjadi kesalahan saat membuat dokumen PDF.")
    }
  }

  const handleDownloadOutcomePDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf")
      const { default: autoTable } = await import("jspdf-autotable")
      
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      })

      const today = new Date()
      const day = today.getDate()
      const month = MONTH_NAMES[today.getMonth()]
      const year = today.getFullYear()
      const pageWidth = doc.internal.pageSize.getWidth()

      // Kop/Header Laporan - Centered
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text("Laporan Pengeluaran Kas Pembangunan Menara Masjid Al-Ikhlas Meranjat II", pageWidth / 2, 15, { align: "center" })

      // Metadata section - Semibold labels & aligned names
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9.5)
      doc.text("Ketua Pembangunan:", 14, 25)
      doc.text("Sekretaris Pembangunan:", 14, 30)
      doc.text("Bendahara Pembangunan:", 14, 35)
      doc.text("Tanggal Cetak Laporan:", 14, 40)

      doc.setFont("helvetica", "normal")
      doc.text("Zulfikar Ali, S.H.", 60, 25)
      doc.text("Najemi", 60, 30)
      doc.text("Candra Gunawan, S.H.", 60, 35)
      doc.text(`Per Tanggal ${day} ${month} ${year}`, 60, 40)

      // Grouping data by Month-Year descending
      const groups: { [key: string]: OutcomeItem[] } = {}
      filteredOutcomes.forEach(item => {
        const d = new Date(item.date)
        const monthKey = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`
        if (!groups[monthKey]) {
          groups[monthKey] = []
        }
        groups[monthKey].push(item)
      })

      const sortedMonthKeys = Object.keys(groups).sort().reverse()

      const bodyRows: any[] = []
      let globalIndex = 1
      let grandTotal = 0

      sortedMonthKeys.forEach(monthKey => {
        const [yearStr, monthStr] = monthKey.split("-")
        const y = parseInt(yearStr, 10)
        const mIdx = parseInt(monthStr, 10)
        const monthNameUpper = MONTH_NAMES[mIdx].toUpperCase()
        const groupTitle = `${monthNameUpper} ${y}`

        // 1. Merged month header row
        bodyRows.push([
          {
            content: groupTitle,
            colSpan: 6,
            styles: { halign: "left", fontStyle: "bold", fillColor: [243, 244, 246], textColor: [17, 24, 39] }
          }
        ])

        // 2. Add items
        let monthSum = 0
        const items = groups[monthKey].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        items.forEach(item => {
          monthSum += item.amount
          grandTotal += item.amount
          bodyRows.push([
            globalIndex++,
            formatLocalDate(item.date),
            item.buyer,
            translateCategory(item.category),
            `Rp ${formatRupiah(item.amount)}`,
            item.description || "-"
          ])
        })

        // 3. Month total row
        bodyRows.push([
          {
            content: `TOTAL PENGELUARAN ${groupTitle}`,
            colSpan: 4,
            styles: { halign: "right", fontStyle: "bold", fillColor: [249, 250, 251], textColor: [0, 0, 0] }
          },
          {
            content: `Rp ${formatRupiah(monthSum)}`,
            styles: { halign: "right", fontStyle: "bold", fillColor: [249, 250, 251], textColor: [0, 0, 0] }
          },
          {
            content: "",
            styles: { fillColor: [249, 250, 251] }
          }
        ])
      })

      // Generate table using jspdf-autotable
      autoTable(doc, {
        startY: 46,
        head: [
          ["No", "Tanggal", "Nama Pembeli", "Kategori", "Kas Keluar", "Keterangan"]
        ],
        body: bodyRows,
        foot: [
          [
            {
              content: "TOTAL KAS PENGELUARAN",
              colSpan: 4,
              styles: { halign: "right", fontStyle: "bold", fillColor: [229, 231, 235], textColor: [0, 0, 0] }
            },
            {
              content: `Rp ${formatRupiah(grandTotal)}`,
              styles: { halign: "right", fontStyle: "bold", fillColor: [229, 231, 235], textColor: [0, 0, 0] }
            },
            {
              content: "",
              styles: { fillColor: [229, 231, 235] }
            }
          ]
        ],
        theme: "grid",
        headStyles: {
          fillColor: [17, 24, 39], // Slate-900 / Black
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center"
        },
        styles: {
          font: "helvetica",
          fontSize: 8.5,
          cellPadding: 2.5,
          lineColor: [209, 213, 219] // gray-300 grid borders
        },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: 25, halign: "center" },
          2: { cellWidth: 50 },
          3: { cellWidth: 50 },
          4: { cellWidth: 40, halign: "right" },
          5: { cellWidth: "auto" }
        }
      })

      doc.save(`Laporan_Pengeluaran_Menara_Al_Ikhlas_${day}_${month}_${year}.pdf`)
    } catch (err) {
      console.error("Gagal mengekspor PDF:", err)
      alert("Terjadi kesalahan saat membuat dokumen PDF.")
    }
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Title & Download Buttons Container */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border-[2px] border-black bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <FileText className="h-5 w-5 text-neutral-800" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tight text-neutral-800">Rincian Dana Pembangunan</h1>
            <p className="text-[10px] text-muted-foreground font-medium">Laporan detail rincian dana yang masuk berasal dari donatur Masjid Al-Ikhlas Meranjat II</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleDownloadIncomePDF}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 border-[2px] border-black bg-emerald-100 text-emerald-900 hover:bg-emerald-200 text-xs font-black uppercase px-3.5 py-2 rounded-[10px] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Unduh Kas Masuk
          </button>
          <button
            onClick={handleDownloadOutcomePDF}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 border-[2px] border-black bg-orange-100 text-orange-900 hover:bg-orange-200 text-xs font-black uppercase px-3.5 py-2 rounded-[10px] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Unduh Kas Keluar
          </button>
        </div>
      </div>

      {/* Tabs - Brutalist Toggle (3 Tabs: Pemasukan, Material, Pengeluaran) */}
      <div className="flex border-[2px] border-black rounded-[14px] bg-white overflow-hidden p-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={() => {
            setActiveTab("income")
            setIncomePage(1)
          }}
          className={cn(
            "flex-1 py-2 text-center text-xs font-black uppercase rounded-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer",
            activeTab === "income"
              ? "bg-blue-100 text-blue-800 border-[1.5px] border-black shadow-[1.5px_1.5px_0px_0px_#000]"
              : "text-neutral-500 hover:text-neutral-800"
          )}
        >
          <PlusCircle className="h-4 w-4 shrink-0" />
          Pemasukan
        </button>
        <button
          onClick={() => {
            setActiveTab("material")
            setMaterialPage(1)
          }}
          className={cn(
            "flex-1 py-2 text-center text-xs font-black uppercase rounded-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer",
            activeTab === "material"
              ? "bg-amber-100 text-amber-800 border-[1.5px] border-black shadow-[1.5px_1.5px_0px_0px_#000]"
              : "text-neutral-500 hover:text-neutral-800"
          )}
        >
          <Package className="h-4 w-4 shrink-0" />
          Material
        </button>
        <button
          onClick={() => {
            setActiveTab("outcome")
            setOutcomePage(1)
          }}
          className={cn(
            "flex-1 py-2 text-center text-xs font-black uppercase rounded-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer",
            activeTab === "outcome"
              ? "bg-red-100 text-red-800 border-[1.5px] border-black shadow-[1.5px_1.5px_0px_0px_#000]"
              : "text-neutral-500 hover:text-neutral-800"
          )}
        >
          <MinusCircle className="h-4 w-4 shrink-0" />
          Pengeluaran
        </button>
      </div>

      {/* --- TABLE CONTENT PANEL --- */}
      <div className="border-[2px] border-black bg-white rounded-[12px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Table Toolbar / Controls (Search & Filters) - Compact Design */}
        <div className="border-b-[2px] border-black bg-neutral-50/50 p-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Left: Compact Search Box */}
          <div className="relative max-w-sm w-full">
            <input
              type="text"
              placeholder={activeTab === "income" ? "Cari nama donatur, alamat..." : activeTab === "outcome" ? "Cari nama pembeli, keperluan..." : "Cari nama donatur, material..."}
              value={activeTab === "income" ? incomeSearch : activeTab === "outcome" ? outcomeSearch : materialSearch}
              onChange={(e) => {
                if (activeTab === "income") {
                  setIncomeSearch(e.target.value)
                  setIncomePage(1)
                } else if (activeTab === "outcome") {
                  setOutcomeSearch(e.target.value)
                  setOutcomePage(1)
                } else {
                  setMaterialSearch(e.target.value)
                  setMaterialPage(1)
                }
              }}
              className="w-full text-[11px] font-bold border-[1.5px] border-black rounded-[6px] py-1.5 pr-2.5 bg-white focus:outline-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              style={{ paddingLeft: "32px" }}
            />
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right: Compact Filter Choices */}
          <div className="flex flex-row items-center gap-2 text-[10px] w-full max-w-md self-end md:self-auto">
            <div className="flex-1 flex flex-row gap-2">
              {activeTab === "income" ? (
                <select
                  value={incomeType}
                  onChange={(e) => {
                    setIncomeType(e.target.value)
                    setIncomePage(1)
                  }}
                  className="flex-1 w-0 text-[10px] font-bold border-[1.5px] border-black rounded-[6px] px-2 py-1.5 bg-white focus:outline-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-center cursor-pointer"
                >
                  <option value="all">Tipe</option>
                  <option value="CASH">Cash</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              ) : activeTab === "outcome" ? (
                <select
                  value={outcomeCategory}
                  onChange={(e) => {
                    setOutcomeCategory(e.target.value)
                    setOutcomePage(1)
                  }}
                  className="flex-1 w-0 text-[10px] font-bold border-[1.5px] border-black rounded-[6px] px-2 py-1.5 bg-white focus:outline-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-center cursor-pointer"
                >
                  <option value="all">Kategori</option>
                  <option value="MATERIAL">Material</option>
                  <option value="LABOR">Pekerja</option>
                  <option value="OPERATIONAL">Operasional</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              ) : null}

              {activeTab !== "material" && (
                <select
                  value={activeTab === "income" ? incomeAmountRange : outcomeAmountRange}
                  onChange={(e) => {
                    if (activeTab === "income") {
                      setIncomeAmountRange(e.target.value)
                      setIncomePage(1)
                    } else if (activeTab === "outcome") {
                      setOutcomeAmountRange(e.target.value)
                      setOutcomePage(1)
                    }
                  }}
                  className="flex-1 w-0 text-[10px] font-bold border-[1.5px] border-black rounded-[6px] px-2 py-1.5 bg-white focus:outline-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-center cursor-pointer"
                >
                  <option value="all">Nominal</option>
                  <option value="under_1m">&lt; Rp 1 Jt</option>
                  <option value="range_1m_10m">Rp 1 - 10 Jt</option>
                  <option value="above_10m">&gt; Rp 10 Jt</option>
                  <option value="above_50m">&gt; Rp 50 Jt</option>
                </select>
              )}

              <select
                value={activeTab === "income" ? incomeMonth : activeTab === "outcome" ? outcomeMonth : materialMonth}
                onChange={(e) => {
                  if (activeTab === "income") {
                    setIncomeMonth(e.target.value)
                    setIncomePage(1)
                  } else if (activeTab === "outcome") {
                    setOutcomeMonth(e.target.value)
                    setOutcomePage(1)
                  } else {
                    setMaterialMonth(e.target.value)
                    setMaterialPage(1)
                  }
                }}
                className="flex-1 w-0 text-[10px] font-bold border-[1.5px] border-black rounded-[6px] px-2 py-1.5 bg-white focus:outline-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-center cursor-pointer"
              >
                <option value="all">Bulan</option>
                {(activeTab === "income" ? uniqueIncomeMonths : activeTab === "outcome" ? uniqueOutcomeMonths : uniqueMaterialMonths).map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>

              {(activeTab === "income" || activeTab === "material") && (
                <select
                  value={activeTab === "income" ? incomeAddress : materialAddress}
                  onChange={(e) => {
                    if (activeTab === "income") {
                      setIncomeAddress(e.target.value)
                      setIncomePage(1)
                    } else {
                      setMaterialAddress(e.target.value)
                      setMaterialPage(1)
                    }
                  }}
                  className="flex-1 w-0 text-[10px] font-bold border-[1.5px] border-black rounded-[6px] px-2 py-1.5 bg-white focus:outline-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-center cursor-pointer truncate"
                  title="Filter Berdasarkan Alamat Donatur"
                >
                  <option value="all">Alamat</option>
                  {PREDEFINED_ADDRESSES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>

            {((activeTab === "income" && (incomeType !== "all" || incomeAmountRange !== "all" || incomeMonth !== "all" || incomeAddress !== "all" || incomeSearch !== "")) ||
              (activeTab === "outcome" && (outcomeCategory !== "all" || outcomeAmountRange !== "all" || outcomeMonth !== "all" || outcomeSearch !== "")) ||
              (activeTab === "material" && (materialMonth !== "all" || materialAddress !== "all" || materialSearch !== ""))) && (
              <button
                onClick={handleResetFilters}
                className="flex-shrink-0 text-[9px] font-black uppercase text-amber-900 hover:text-amber-950 flex items-center gap-1 border-[1.5px] border-black bg-amber-50 px-2 py-1.5 rounded-[6px] shadow-[1px_1px_0px_0px_#000] active:translate-y-px active:shadow-none transition-all cursor-pointer"
              >
                <RotateCcw className="h-2.5 w-2.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Overflow Area for Tables */}
        <div className="overflow-x-auto">
          {activeTab === "income" && (
            // INCOMES TABLE
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-[2px] border-black bg-blue-50/50">
                  <th className="p-3 text-[10px] font-black uppercase text-blue-900 w-[5%] text-center border-r border-blue-200 last:border-r-0">No</th>
                  <th className="p-3 text-[10px] font-black uppercase text-blue-900 w-[22%] border-r border-blue-200 last:border-r-0">Donatur & Alamat</th>
                  <th className="p-3 text-[10px] font-black uppercase text-blue-900 w-[13%] text-right border-r border-blue-200 last:border-r-0">Nominal</th>
                  <th className="p-3 text-[10px] font-black uppercase text-blue-900 w-[9%] text-center border-r border-blue-200 last:border-r-0">Tanggal</th>
                  <th className="p-3 text-[10px] font-black uppercase text-blue-900 w-[8%] text-center border-r border-blue-200 last:border-r-0">Tipe</th>
                  <th className="p-3 text-[10px] font-black uppercase text-blue-900 w-[6%] text-center border-r border-blue-200 last:border-r-0">Bukti</th>
                  <th className="p-3 text-[10px] font-black uppercase text-blue-900 w-[33%] border-r border-blue-200 last:border-r-0">Keterangan</th>
                  <th className="p-3 text-[10px] font-black uppercase text-blue-900 w-[4%] text-center border-r border-blue-200 last:border-r-0">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-neutral-200">
                {paginatedIncomes.length > 0 ? (
                  paginatedIncomes.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-neutral-50/70 border-b border-neutral-200 transition-colors last:border-b-0">
                      {/* No */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center text-[10px] font-bold text-neutral-500 tabular-nums">
                        {(incomePage - 1) * 10 + idx + 1}
                      </td>
                      {/* Name & Address */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 whitespace-normal">
                        <div className="font-black text-neutral-800 text-[11px] uppercase tracking-tight">{item.donorName}</div>
                        {item.donorAddress && (
                          <div className="text-[9px] text-muted-foreground font-semibold leading-tight mt-1 italic">{item.donorAddress}</div>
                        )}
                      </td>
                      {/* Amount */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-right font-black text-[11px] text-emerald-800 tabular-nums">
                        Rp {formatRupiah(item.amount)}
                      </td>
                      {/* Date */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center text-[10px] font-bold text-neutral-600 tabular-nums">
                        {formatLocalDate(item.date)}
                      </td>
                      {/* Type */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center">
                        <span className={cn(
                          "inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-full border shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]",
                          item.type === "TRANSFER"
                            ? "bg-purple-100 text-purple-800 border-purple-400"
                            : "bg-amber-100 text-amber-800 border-amber-400"
                        )}>
                          {item.type === "TRANSFER" ? "Transfer" : "Tunai"}
                        </span>
                      </td>
                      {/* Proof Icon/Button */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center">
                        {item.receiptUrls && item.receiptUrls.length > 0 ? (
                          <button
                            onClick={() => handlePreviewImages(item.receiptUrls)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border-[1.5px] border-black bg-blue-100 hover:bg-blue-200 text-blue-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-px transition-all cursor-pointer"
                            title="Lihat Bukti"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <span className="text-[9px] text-neutral-400 font-semibold italic">-</span>
                        )}
                      </td>
                      {/* Description / Keterangan */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 whitespace-normal">
                        {item.description ? (
                          <div className="text-[10px] text-neutral-700 font-medium break-words leading-relaxed max-w-[240px]">
                            {item.description}
                          </div>
                        ) : (
                          <span className="text-[9px] text-neutral-400 font-semibold italic">-</span>
                        )}
                      </td>
                      {/* Action Buttons - Edit & Delete */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal("income", item)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border-[1.5px] border-black bg-amber-100 hover:bg-amber-200 text-amber-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-px transition-all cursor-pointer"
                            title="Edit Data Pemasukan"
                          >
                            <Pencil className="h-3.5 w-3.5 shrink-0" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal("income", item)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border-[1.5px] border-black bg-red-100 hover:bg-red-200 text-red-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-px transition-all cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5 shrink-0" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-xs text-neutral-400 font-bold italic border-b-0">
                      Tidak ada rincian data pemasukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === "material" && (
            // MATERIAL TABLE
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-[2px] border-black bg-amber-50/50">
                  <th className="p-3 text-[10px] font-black uppercase text-amber-900 w-[5%] text-center border-r border-amber-200 last:border-r-0">No</th>
                  <th className="p-3 text-[10px] font-black uppercase text-amber-900 w-[23%] border-r border-amber-200 last:border-r-0">Donatur &amp; Alamat</th>
                  <th className="p-3 text-[10px] font-black uppercase text-amber-900 w-[18%] border-r border-amber-200 last:border-r-0">Material</th>
                  <th className="p-3 text-[10px] font-black uppercase text-amber-900 w-[13%] text-center border-r border-amber-200 last:border-r-0">Tanggal</th>
                  <th className="p-3 text-[10px] font-black uppercase text-amber-900 w-[7%] text-center border-r border-amber-200 last:border-r-0">Bukti</th>
                  <th className="p-3 text-[10px] font-black uppercase text-amber-900 w-[28%] border-r border-amber-200 last:border-r-0">Keterangan</th>
                  <th className="p-3 text-[10px] font-black uppercase text-amber-900 w-[6%] text-center last:border-r-0">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-neutral-200">
                {paginatedMaterials.length > 0 ? (
                  paginatedMaterials.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-neutral-50/70 border-b border-neutral-200 transition-colors last:border-b-0">
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center text-[10px] font-bold text-neutral-500 tabular-nums">
                        {(materialPage - 1) * 10 + idx + 1}
                      </td>
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 whitespace-normal">
                        <div className="font-black text-neutral-800 text-[11px] uppercase tracking-tight">{item.donorName}</div>
                        {item.donorAddress && (
                          <div className="text-[9px] text-muted-foreground font-semibold leading-tight mt-1 italic">{item.donorAddress}</div>
                        )}
                      </td>
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 whitespace-normal">
                        <div className="font-black text-amber-700 text-[11px]">{item.materialName}</div>
                        <div className="text-[10px] font-semibold text-neutral-500 mt-0.5">{item.quantity}</div>
                      </td>
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center text-[10px] font-bold text-neutral-600 tabular-nums">
                        {formatLocalDate(item.date)}
                      </td>
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center">
                        {item.receiptUrls && item.receiptUrls.length > 0 ? (
                          <button
                            onClick={() => handlePreviewImages(item.receiptUrls)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border-[1.5px] border-black bg-amber-100 hover:bg-amber-200 text-amber-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-px transition-all cursor-pointer"
                            title="Lihat Bukti"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <span className="text-[9px] text-neutral-400 font-semibold italic">-</span>
                        )}
                      </td>
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 whitespace-normal">
                        <div className="text-[10px] text-neutral-700 font-medium break-words leading-relaxed max-w-[240px]">
                          {item.description || "-"}
                        </div>
                      </td>
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal("material", item)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border-[1.5px] border-black bg-amber-100 hover:bg-amber-200 text-amber-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-px transition-all cursor-pointer"
                            title="Edit Data Donasi Material"
                          >
                            <Pencil className="h-3.5 w-3.5 shrink-0" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal("material", item)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border-[1.5px] border-black bg-red-100 hover:bg-red-200 text-red-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-px transition-all cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5 shrink-0" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs text-neutral-400 font-bold italic border-b-0">
                      Tidak ada rincian data material.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === "outcome" && (
            // OUTCOMES TABLE
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-[2px] border-black bg-red-50/50">
                  <th className="p-3 text-[10px] font-black uppercase text-red-900 w-[5%] text-center border-r border-red-200 last:border-r-0">No</th>
                  <th className="p-3 text-[10px] font-black uppercase text-red-900 w-[33%] border-r border-red-200 last:border-r-0">Keperluan</th>
                  <th className="p-3 text-[10px] font-black uppercase text-red-900 w-[18%] border-r border-red-200 last:border-r-0">Pembeli</th>
                  <th className="p-3 text-[10px] font-black uppercase text-red-900 w-[13%] text-right border-r border-red-200 last:border-r-0">Nominal</th>
                  <th className="p-3 text-[10px] font-black uppercase text-red-900 w-[9%] text-center border-r border-red-200 last:border-r-0">Tanggal</th>
                  <th className="p-3 text-[10px] font-black uppercase text-red-900 w-[8%] text-center border-r border-red-200 last:border-r-0">Kategori</th>
                  <th className="p-3 text-[10px] font-black uppercase text-red-900 w-[6%] text-center border-r border-red-200 last:border-r-0">Nota</th>
                  <th className="p-3 text-[10px] font-black uppercase text-red-900 w-[4%] text-center border-r border-red-200 last:border-r-0">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-neutral-200">
                {paginatedOutcomes.length > 0 ? (
                  paginatedOutcomes.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-neutral-50/70 border-b border-neutral-200 transition-colors last:border-b-0">
                      {/* No */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center text-[10px] font-bold text-neutral-500 tabular-nums">
                        {(outcomePage - 1) * 10 + idx + 1}
                      </td>
                      {/* Keperluan / Description - tampil lebih highlight */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 whitespace-normal">
                        <div className="text-[10px] font-bold text-neutral-800 break-words leading-relaxed">
                          {item.description || "-"}
                        </div>
                      </td>
                      {/* Buyer / Pembeli */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 whitespace-normal">
                        <div className="font-semibold text-neutral-600 text-[10px] uppercase tracking-tight">{item.buyer}</div>
                      </td>
                      {/* Amount */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-right font-black text-[11px] text-red-800 tabular-nums">
                        Rp {formatRupiah(item.amount)}
                      </td>
                      {/* Date */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center text-[10px] font-bold text-neutral-600 tabular-nums">
                        {formatLocalDate(item.date)}
                      </td>
                      {/* Category */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center">
                        <span className="inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-neutral-400 bg-neutral-100 text-neutral-800 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                          {translateCategory(item.category)}
                        </span>
                      </td>
                      {/* Receipt Icon/Button */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center">
                        {item.receiptUrls && item.receiptUrls.length > 0 ? (
                          <button
                            onClick={() => handlePreviewImages(item.receiptUrls)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border-[1.5px] border-black bg-red-100 hover:bg-red-200 text-red-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-px transition-all cursor-pointer"
                            title="Lihat Nota"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <span className="text-[9px] text-neutral-400 font-semibold italic">-</span>
                        )}
                      </td>
                      {/* Action Buttons - Edit & Delete */}
                      <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal("outcome", item)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border-[1.5px] border-black bg-amber-100 hover:bg-amber-200 text-amber-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-px transition-all cursor-pointer"
                            title="Edit Data Pengeluaran"
                          >
                            <Pencil className="h-3.5 w-3.5 shrink-0" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal("outcome", item)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border-[1.5px] border-black bg-red-100 hover:bg-red-200 text-red-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-px transition-all cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5 shrink-0" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-xs text-neutral-400 font-bold italic border-b-0">
                      Tidak ada rincian data pengeluaran.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- PAGINATION NAVIGATION CONTROLS - Tighter layout --- */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-[2px] border-black bg-white rounded-[12px] p-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase text-neutral-500">
            Halaman {currentPage} dari {totalPages} ({totalFilteredItems} total data)
          </div>
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-7 px-2 rounded-lg border-[1.5px] border-black bg-neutral-50 text-neutral-800 disabled:opacity-50 hover:bg-neutral-100 flex items-center justify-center shadow-[1px_1px_0px_0px_#000] disabled:shadow-none active:translate-y-px active:shadow-none transition-all disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            
            {/* Page number buttons with ellipsis */}
            {getPageNumbers(currentPage, totalPages).map((p, idx) => {
              if (p === -1) {
                return <span key={`dots-${idx}`} className="px-1.5 text-xs font-bold text-neutral-400">...</span>
              }
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={cn(
                    "h-7 w-7 rounded-lg border-[1.5px] border-black text-xs font-black flex items-center justify-center shadow-[1px_1px_0px_0px_#000] active:translate-y-px active:shadow-none transition-all cursor-pointer",
                    currentPage === p
                      ? "bg-emerald-100 text-emerald-800 font-black border-black"
                      : "bg-white text-neutral-700 hover:bg-neutral-50"
                  )}
                >
                  {p}
                </button>
              )
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-7 px-2 rounded-lg border-[1.5px] border-black bg-neutral-50 text-neutral-800 disabled:opacity-50 hover:bg-neutral-100 flex items-center justify-center shadow-[1px_1px_0px_0px_#000] disabled:shadow-none active:translate-y-px active:shadow-none transition-all disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION DELETE MODAL (CUSTOM NEOBRUTALIST WINDOW overlay) --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-w-sm w-full border-[3px] border-black bg-white rounded-[24px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
            {/* Modal Header */}
            <div className="flex h-12 w-full items-center justify-between border-b-[2.5px] border-black bg-red-50/50 px-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-900 flex items-center gap-1.5">
                ⚠️ Konfirmasi Penghapusan
              </span>
              <button
                onClick={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
                className="h-7 w-7 rounded-full border-[1.5px] border-black bg-white flex items-center justify-center hover:bg-neutral-100 text-neutral-700 shadow-[1px_1px_0px_0px_#000] active:translate-y-px active:shadow-none transition-all cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-[#faf8f5] space-y-4">
              <div className="text-center space-y-2">
                <p className="text-xs font-bold text-neutral-700">
                  Apakah Anda yakin ingin menghapus data {deleteModal.type === "income" ? "pemasukan" : deleteModal.type === "material" ? "donasi material" : "pengeluaran"} ini?
                </p>
                <div className="border-[2px] border-black bg-white rounded-[14px] p-3 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] text-left">
                  <div className="text-[10px] font-black text-neutral-400 uppercase">
                    {deleteModal.type === "outcome" ? "Pembeli" : "Donatur"}
                  </div>
                  <div className="text-xs font-black uppercase text-neutral-800 truncate">
                    {deleteModal.name}
                  </div>
                  {deleteModal.type !== "material" && (
                    <>
                      <div className="text-[10px] font-black text-neutral-400 uppercase mt-1.5">
                        Nominal
                      </div>
                      <div className="text-sm font-black text-red-700 tabular-nums">
                        Rp {formatRupiah(deleteModal.amount)}
                      </div>
                    </>
                  )}
                </div>
                {deleteModal.type === "income" && (
                  <p className="text-[9px] text-amber-700 font-bold leading-normal mt-2 text-left bg-amber-50 border border-amber-200 rounded p-2">
                    💡 *Catatan:* Jika transaksi ini berasal dari Donasi Online, menghapus transaksi akan mengubah status konfirmasi donasi kembali menjadi **PENDING**. Transaksi tersebut akan muncul kembali di halaman validasi.
                  </p>
                )}
              </div>

              {deleteModal.error && (
                <div className="text-[10px] font-black uppercase text-red-600 text-center">
                  ❌ {deleteModal.error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
                  disabled={deleteModal.isDeleting}
                  className="flex-1 py-2 text-center text-xs font-black uppercase rounded-[10px] border-[2px] border-black bg-white hover:bg-neutral-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-none transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteModal.isDeleting}
                  className="flex-1 py-2 text-center text-xs font-black uppercase rounded-[10px] border-[2px] border-black bg-red-100 text-red-900 hover:bg-red-200 disabled:opacity-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  {deleteModal.isDeleting ? (
                    <>
                      <div className="h-3 w-3 rounded-full border-[1.5px] border-red-800 border-t-transparent animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- LIGHTBOX MODAL DIALOG --- */}
      {lightbox.isOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full border-[3px] border-black bg-white rounded-[24px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
            {/* Modal Header */}
            <div className="flex h-12 w-full items-center justify-between border-b-[2.5px] border-black bg-blue-50/50 px-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                🖼️ Pratinjau Bukti / Nota Belanja
              </span>
              <button
                onClick={() => setLightbox(prev => ({ ...prev, isOpen: false }))}
                className="h-7 w-7 rounded-full border-[1.5px] border-black bg-white flex items-center justify-center hover:bg-red-50 text-neutral-700 shadow-[1px_1px_0px_0px_#000] active:translate-y-px active:shadow-none transition-all cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Modal Body / Image Display */}
            <div className="flex flex-col items-center justify-center p-6 bg-[#faf8f5] min-h-[280px]">
              {lightbox.isLoading ? (
                // Loading State
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="h-8 w-8 rounded-full border-[3px] border-neutral-300 border-t-blue-600 animate-spin" />
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Memuat Gambar...</span>
                </div>
              ) : lightbox.error ? (
                // Error State
                <div className="flex flex-col items-center justify-center gap-2 text-center p-4">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center border border-red-400 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="text-[11px] font-bold text-red-900">{lightbox.error}</div>
                  <button
                    onClick={() => lightbox.urls && handlePreviewImages(lightbox.urls)}
                    className="text-[9px] font-black uppercase border-[1.5px] border-black bg-white hover:bg-neutral-50 px-3 py-1 rounded-[8px] shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-px active:shadow-none transition-all cursor-pointer mt-1"
                  >
                    Muat Ulang
                  </button>
                </div>
              ) : (
                // Images Carousel Display
                <div className="w-full space-y-4">
                  {lightbox.urls.length > 0 ? (
                    <div className="relative aspect-[4/3] w-full rounded-[16px] border-[2.5px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">
                      {/* Current Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={lightbox.urls[lightbox.currentIndex]}
                        alt={`Bukti Pembayaran ${lightbox.currentIndex + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />

                      {/* Navigation Prev Button */}
                      {lightbox.urls.length > 1 && (
                        <button
                          onClick={() => setLightbox(prev => ({
                            ...prev,
                            currentIndex: prev.currentIndex === 0 ? prev.urls.length - 1 : prev.currentIndex - 1
                          }))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-[1.5px] border-black bg-white flex items-center justify-center hover:bg-neutral-100 shadow-[1.5px_1.5px_0px_0px_#000] active:scale-95 transition-all cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                      )}

                      {/* Navigation Next Button */}
                      {lightbox.urls.length > 1 && (
                        <button
                          onClick={() => setLightbox(prev => ({
                            ...prev,
                            currentIndex: prev.currentIndex === prev.urls.length - 1 ? 0 : prev.currentIndex + 1
                          }))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-[1.5px] border-black bg-white flex items-center justify-center hover:bg-neutral-100 shadow-[1.5px_1.5px_0px_0px_#000] active:scale-95 transition-all cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-400 font-bold italic text-center py-8">
                      Tidak ada berkas bukti belanja.
                    </div>
                  )}

                  {/* Carousel Indicators / Meta */}
                  {lightbox.urls.length > 1 && (
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-neutral-600 px-1">
                      <span>Pratinjau Bukti Belanja</span>
                      <span className="border-[1.5px] border-black bg-yellow-50 px-2 py-0.5 rounded-full shadow-[1px_1px_0px_0px_#000]">
                        {lightbox.currentIndex + 1} dari {lightbox.urls.length} Berkas
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT TRANSACTION MODAL (CUSTOM NEOBRUTALIST WINDOW overlay) --- */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative max-w-xl w-full border-[3px] border-black bg-white rounded-[24px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-8">
            
            {/* Modal Header */}
            <div className="flex h-12 w-full items-center justify-between border-b-[2.5px] border-black bg-amber-100 px-4">
              <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <Pencil className="h-4 w-4 shrink-0" />
                {editModal.type === "income" ? "Edit Data Pemasukan" : editModal.type === "material" ? "Edit Data Donasi Material" : "Edit Data Pengeluaran"}
              </span>
              <button
                type="button"
                onClick={() => {
                  editModal.newFiles.forEach(f => URL.revokeObjectURL(f.preview))
                  setEditModal(prev => ({ ...prev, isOpen: false }))
                }}
                className="h-7 w-7 rounded-full border-[1.5px] border-black bg-white flex items-center justify-center hover:bg-neutral-100 text-neutral-700 shadow-[1px_1px_0px_0px_#000] active:translate-y-px active:shadow-none transition-all cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveEdit} className="p-6 bg-[#faf8f5] space-y-4 max-h-[80vh] overflow-y-auto">
              {editModal.type === "material" ? (
                <>
                  {/* Donatur Anonim Checkbox */}
                  <div className="flex items-center gap-2 border-[1.5px] border-black bg-amber-50 p-2.5 rounded-[10px] shadow-[1.5px_1.5px_0px_0px_#000]">
                    <input
                      type="checkbox"
                      id="editIsAnonymous"
                      checked={editModal.isAnonymous}
                      onChange={(e) => {
                        const isAnon = e.target.checked
                        setEditModal(prev => ({
                          ...prev,
                          isAnonymous: isAnon,
                          donorName: isAnon ? "Hamba Allah" : (prev.donorName === "Hamba Allah" ? "" : prev.donorName)
                        }))
                      }}
                      className="h-4 w-4 rounded border-black text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="editIsAnonymous" className="text-xs font-bold text-neutral-800 cursor-pointer">
                      Sembunyikan Nama Donatur (Hamba Allah)
                    </label>
                  </div>

                  {/* Nama Donatur */}
                  {!editModal.isAnonymous && (
                    <div>
                      <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                        Nama Donatur <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: H. Ahmad Subardjo"
                        value={editModal.donorName}
                        onChange={(e) => setEditModal(prev => ({ ...prev, donorName: e.target.value }))}
                        className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                      />
                    </div>
                  )}

                  {/* Alamat & Telepon */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                        Alamat Donatur
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Dusun II Meranjat"
                        value={editModal.donorAddress}
                        onChange={(e) => setEditModal(prev => ({ ...prev, donorAddress: e.target.value }))}
                        className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                        No. HP / Whatsapp
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 08123456789"
                        value={editModal.donorPhone}
                        onChange={(e) => setEditModal(prev => ({ ...prev, donorPhone: e.target.value }))}
                        className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                      />
                    </div>
                  </div>

                  {/* Nama Material & Jumlah */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                        Nama Material / Barang <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Semen Holcim"
                        value={editModal.materialName}
                        onChange={(e) => setEditModal(prev => ({ ...prev, materialName: e.target.value }))}
                        className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                        Jumlah / Volume <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 50 Sak"
                        value={editModal.quantity}
                        onChange={(e) => setEditModal(prev => ({ ...prev, quantity: e.target.value }))}
                        className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                      />
                    </div>
                  </div>

                  {/* Tanggal Penerimaan */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                      Tanggal Penerimaan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editModal.date}
                      onChange={(e) => setEditModal(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                    />
                  </div>

                  {/* Keterangan */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                      Keterangan / Catatan
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Catatan tambahan donasi..."
                      value={editModal.description}
                      onChange={(e) => setEditModal(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full text-xs font-medium border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                    />
                  </div>
                </>
              ) : editModal.type === "income" ? (
                <>
                  {/* Donatur Anonim Checkbox */}
                  <div className="flex items-center gap-2 border-[1.5px] border-black bg-amber-50 p-2.5 rounded-[10px] shadow-[1.5px_1.5px_0px_0px_#000]">
                    <input
                      type="checkbox"
                      id="editIsAnonymous"
                      checked={editModal.isAnonymous}
                      onChange={(e) => {
                        const isAnon = e.target.checked
                        setEditModal(prev => ({
                          ...prev,
                          isAnonymous: isAnon,
                          donorName: isAnon ? "Hamba Allah" : (prev.donorName === "Hamba Allah" ? "" : prev.donorName)
                        }))
                      }}
                      className="h-4 w-4 rounded border-black text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="editIsAnonymous" className="text-xs font-bold text-neutral-800 cursor-pointer">
                      Sembunyikan Nama Donatur (Hamba Allah)
                    </label>
                  </div>

                  {/* Nama Donatur */}
                  {!editModal.isAnonymous && (
                    <div>
                      <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                        Nama Donatur <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: H. Ahmad Subardjo"
                        value={editModal.donorName}
                        onChange={(e) => setEditModal(prev => ({ ...prev, donorName: e.target.value }))}
                        className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                      />
                    </div>
                  )}

                  {/* Alamat & Telepon */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                        Alamat Donatur
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Dusun II Meranjat"
                        value={editModal.donorAddress}
                        onChange={(e) => setEditModal(prev => ({ ...prev, donorAddress: e.target.value }))}
                        className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                        No. HP / Whatsapp
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 08123456789"
                        value={editModal.donorPhone}
                        onChange={(e) => setEditModal(prev => ({ ...prev, donorPhone: e.target.value }))}
                        className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                      />
                    </div>
                  </div>

                  {/* Nominal & Tipe Pemasukan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                        Nominal Pemasukan (Rp) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="0"
                        value={editModal.amountInput}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, "")
                          const num = raw ? parseInt(raw, 10) : 0
                          setEditModal(prev => ({
                            ...prev,
                            amount: num,
                            amountInput: raw ? formatRupiah(num) : ""
                          }))
                        }}
                        className="w-full text-xs font-black border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000] tabular-nums"
                      />
                      {editModal.amount > 0 && (
                        <p className="text-[10px] font-semibold text-emerald-800 italic mt-1">
                          {formatTerbilang(editModal.amount)}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                        Tipe Pemasukan <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editModal.incomeType}
                        onChange={(e) => setEditModal(prev => ({ ...prev, incomeType: e.target.value as "CASH" | "TRANSFER" }))}
                        className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer"
                      >
                        <option value="CASH">Tunai / Cash</option>
                        <option value="TRANSFER">Transfer Bank / QRIS</option>
                      </select>
                    </div>
                  </div>

                  {/* Tanggal Penerimaan */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                      Tanggal Penerimaan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editModal.date}
                      onChange={(e) => setEditModal(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                    />
                  </div>

                  {/* Keterangan */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                      Keterangan / Catatan
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Catatan tambahan donasi..."
                      value={editModal.description}
                      onChange={(e) => setEditModal(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full text-xs font-medium border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Nama Pembeli */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                      Nama Pembeli / Penanggung Jawab <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Pak Budi (Tukang)"
                      value={editModal.buyer}
                      onChange={(e) => setEditModal(prev => ({ ...prev, buyer: e.target.value }))}
                      className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                    />
                  </div>

                  {/* Nominal & Kategori */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                        Nominal Pengeluaran (Rp) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="0"
                        value={editModal.amountInput}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, "")
                          const num = raw ? parseInt(raw, 10) : 0
                          setEditModal(prev => ({
                            ...prev,
                            amount: num,
                            amountInput: raw ? formatRupiah(num) : ""
                          }))
                        }}
                        className="w-full text-xs font-black border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000] tabular-nums"
                      />
                      {editModal.amount > 0 && (
                        <p className="text-[10px] font-semibold text-red-800 italic mt-1">
                          {formatTerbilang(editModal.amount)}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                        Kategori Pengeluaran <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editModal.category}
                        onChange={(e) => setEditModal(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer"
                      >
                        <option value="MATERIAL">Material / Bahan Bangunan</option>
                        <option value="LABOR">Pekerja / Upah Tukang</option>
                        <option value="OPERATIONAL">Operasional / Konsumsi</option>
                        <option value="OTHER">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  {/* Tanggal Pengeluaran */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                      Tanggal Pengeluaran <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editModal.date}
                      onChange={(e) => setEditModal(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                    />
                  </div>

                  {/* Keterangan */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                      Keterangan Keperluan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Rincian pembelian material atau keperluan..."
                      value={editModal.description}
                      onChange={(e) => setEditModal(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full text-xs font-medium border-[1.5px] border-black rounded-[8px] p-2 bg-white focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                    />
                  </div>
                </>
              )}

              {/* Existing & New Receipts Attachment Section */}
              <div className="border-[1.5px] border-black bg-white rounded-[12px] p-3 space-y-2.5 shadow-[2px_2px_0px_0px_#000]">
                <label className="block text-[11px] font-black uppercase text-neutral-800">
                  🖼️ Bukti Nota / Kwitansi
                </label>

                {/* Existing Images */}
                {editModal.isLoadingSignedUrls ? (
                  <div className="text-[10px] font-bold text-neutral-400 italic">Memuat gambar bukti tersimpan...</div>
                ) : editModal.existingReceiptSignedUrls.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">Gambar Tersimpan:</span>
                    <div className="flex flex-wrap gap-2">
                      {editModal.existingReceiptSignedUrls.map((sUrl, idx) => (
                        <div key={idx} className="relative h-16 w-16 border-[1.5px] border-black rounded-[8px] overflow-hidden shadow-[1px_1px_0px_0px_#000] bg-neutral-100 group cursor-pointer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sUrl}
                            alt={`Bukti tersimpan ${idx + 1}`}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            onClick={() => setLightbox({ isOpen: true, urls: editModal.existingReceiptSignedUrls, currentIndex: idx, isLoading: false, error: null })}
                          />
                          <button
                            type="button"
                            onClick={() => setLightbox({ isOpen: true, urls: editModal.existingReceiptSignedUrls, currentIndex: idx, isLoading: false, error: null })}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                            title="Klik untuk memperbesar gambar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemoveExistingReceipt(idx); }}
                            className="absolute top-0.5 right-0.5 h-5 w-5 bg-red-600 text-white rounded-full flex items-center justify-center border border-black shadow-sm hover:bg-red-700 transition-colors z-10"
                            title="Hapus gambar ini"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New files previews */}
                {editModal.newFiles.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">Gambar Baru Ditambahkan:</span>
                    <div className="flex flex-wrap gap-2">
                      {editModal.newFiles.map((item, idx) => (
                        <div key={idx} className="relative h-16 w-16 border-[1.5px] border-emerald-600 rounded-[8px] overflow-hidden shadow-[1px_1px_0px_0px_#000] bg-emerald-50 group cursor-pointer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.preview}
                            alt={`Berkas baru ${idx + 1}`}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            onClick={() => setLightbox({ isOpen: true, urls: editModal.newFiles.map(f => f.preview), currentIndex: idx, isLoading: false, error: null })}
                          />
                          <button
                            type="button"
                            onClick={() => setLightbox({ isOpen: true, urls: editModal.newFiles.map(f => f.preview), currentIndex: idx, isLoading: false, error: null })}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                            title="Klik untuk memperbesar gambar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemoveNewFile(idx); }}
                            className="absolute top-0.5 right-0.5 h-5 w-5 bg-red-600 text-white rounded-full flex items-center justify-center border border-black shadow-sm hover:bg-red-700 transition-colors z-10"
                            title="Batalkan gambar ini"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New File Button */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="editFileInput"
                    onChange={handleAddNewFiles}
                    className="hidden"
                  />
                  <label
                    htmlFor="editFileInput"
                    className="inline-flex items-center justify-center gap-1.5 border-[1.5px] border-black bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-black uppercase px-3 py-1.5 rounded-[8px] shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-px active:shadow-none transition-all cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    + Tambah Foto Bukti
                  </label>
                </div>
              </div>

              {/* Error message */}
              {editModal.error && (
                <div className="text-[10px] font-black uppercase text-red-600 text-center bg-red-50 border border-red-200 rounded p-2">
                  ❌ {editModal.error}
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    editModal.newFiles.forEach(f => URL.revokeObjectURL(f.preview))
                    setEditModal(prev => ({ ...prev, isOpen: false }))
                  }}
                  disabled={editModal.isSubmitting}
                  className="flex-1 py-2 text-center text-xs font-black uppercase rounded-[10px] border-[2px] border-black bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-none transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editModal.isSubmitting}
                  className="flex-1 py-2 text-center text-xs font-black uppercase rounded-[10px] border-[2px] border-black bg-amber-300 text-amber-950 hover:bg-amber-400 disabled:opacity-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {editModal.isSubmitting ? (
                    <>
                      <div className="h-3.5 w-3.5 rounded-full border-[2px] border-amber-950 border-t-transparent animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== SUCCESS RESPONSE MODAL ===== */}
      {successModal.isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          onClick={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
        >
          <div
            className="bg-white border-[3px] border-black rounded-[16px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm p-6 flex flex-col items-center gap-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon centang */}
            <div className="h-16 w-16 rounded-full bg-emerald-100 border-[3px] border-emerald-600 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Check className="h-8 w-8 text-emerald-700 stroke-[3]" />
            </div>

            {/* Title */}
            <div>
              <h3 className="text-base font-black uppercase text-neutral-900 leading-tight">
                {successModal.title}
              </h3>
              <p className="mt-1.5 text-[11px] text-neutral-600 font-semibold leading-relaxed">
                {successModal.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
              className="w-full py-2.5 text-sm font-black uppercase rounded-[10px] border-[2px] border-black bg-emerald-400 text-emerald-950 hover:bg-emerald-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-none transition-all cursor-pointer"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

// --- HELPER FUNCTIONS ---

// 1. Get unique month labels from date list
function getUniqueMonths(dates: string[]): { value: string; label: string }[] {
  const monthsMap = new Map<string, { year: number; month: number }>()

  dates.forEach((dStr) => {
    if (!dStr) return
    const d = new Date(dStr)
    if (isNaN(d.getTime())) return
    const m = d.getMonth()
    const y = d.getFullYear()
    const key = `${y}-${String(m).padStart(2, "0")}`
    monthsMap.set(key, { year: y, month: m })
  })

  // Sort descending by date key
  const sortedKeys = Array.from(monthsMap.keys()).sort().reverse()

  return sortedKeys.map((key) => {
    const item = monthsMap.get(key)!
    const label = `${MONTH_NAMES[item.month]} ${item.year}`
    return { value: key, label }
  })
}

// 2. Filter transaction by range
function filterByAmountRange(amount: number, range: string): boolean {
  if (range === "all") return true
  if (range === "under_1m") return amount < 1000000
  if (range === "range_1m_10m") return amount >= 1000000 && amount <= 10000000
  if (range === "above_10m") return amount > 10000000
  if (range === "above_50m") return amount > 50000000
  if (range === "above_1m") return amount >= 1000000
  if (range === "above_5m") return amount >= 5000000
  return true
}

// 3. Filter transaction by Month-Year key
function filterByMonth(dateStr: string, selectedMonthKey: string): boolean {
  if (selectedMonthKey === "all") return true
  if (!dateStr) return false
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return false
  const m = d.getMonth()
  const y = d.getFullYear()
  const key = `${y}-${String(m).padStart(2, "0")}`
  return key === selectedMonthKey
}

// 4. Formatting date into DD/MM/YYYY
function formatLocalDate(isoString: string): string {
  if (!isoString) return "-"
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return "-"
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function translateCategory(cat: string): string {
  if (cat === "MATERIAL") return "Material"
  if (cat === "LABOR") return "Pekerja/Tukang"
  if (cat === "OPERATIONAL") return "Operasional"
  return "Lainnya"
}

// 5. Generate page list for pagination rendering with ellipses
function getPageNumbers(currentPage: number, totalPages: number): number[] {
  const pages: number[] = []
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (currentPage > 3) {
      pages.push(-1) // ellipsis indicator
    }
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) {
      pages.push(-1) // ellipsis indicator
    }
    pages.push(totalPages)
  }
  return pages
}
