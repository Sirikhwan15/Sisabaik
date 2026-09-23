import { randomUUID } from "node:crypto"; 
import { Router } from "express"; 
import { penawaran, pesanan } from "../data/store.js"; 
 
const router = Router(); 
const MIN_NAME_LENGTH = 3;
const MIN_QUANTITY = 1;
const HTTP_CREATED_STATUS = 201;
 
router.get("/", (req, res) => { 
  res.status(200).json({ 
    success: true, 
    data: pesanan, 
    meta: { jumlah: pesanan.length } 
  }); 
}); 
 
router.post("/", (req, res) => { 
  const { namaPemesan, items } = req.body; 
  const inputError = validasiInputPesanan(namaPemesan, items);
  if (inputError) return kirimValidasi(res, inputError);

  const hasilDetail = buatDetailPesanan(items);
  if (hasilDetail.error) {
    return kirimValidasi(res, hasilDetail.error.message, hasilDetail.error.status, hasilDetail.error.code);
  }
  const { detail } = hasilDetail;
  kurangiStok(detail);
 
  const pesananBaru = { 
    id: randomUUID(), 
    namaPemesan: namaPemesan.trim(), 
    status: "menunggu-konfirmasi", 
    items: detail, 
    total: detail.reduce((jumlah, baris) => jumlah + baris.subtotal, 0), 
    nilaiStokTerselamatkan: detail.reduce( 
      (jumlah, baris) => jumlah + baris.nilaiStokTerselamatkan, 
      0 
    ), 
    dibuatPada: new Date().toISOString() 
  }; 
 
  pesanan.push(pesananBaru); 
  return res.status(HTTP_CREATED_STATUS).location(`/api/pesanan/${pesananBaru.id}`).json({ 
    success: true,
      data: pesananBaru 
  }); 
}); 

function validasiInputPesanan(namaPemesan, items) {
  if (typeof namaPemesan !== "string" || namaPemesan.trim().length < MIN_NAME_LENGTH) {
    return "namaPemesan minimal terdiri dari 3 karakter.";
  }
  if (!Array.isArray(items) || items.length === 0) {
    return "items harus berupa array yang tidak kosong.";
  }
  return null;
}

function buatDetailPesanan(items) {
  const idUnik = new Set();
  const detail = [];
  for (const baris of items) {
    const error = validasiBaris(baris, idUnik);
    if (error) return { error };
    idUnik.add(baris.penawaranId);
    const item = penawaran.find((penawaranItem) => penawaranItem.id === baris.penawaranId);
    if (!item) return { error: { message: `Penawaran ${baris.penawaranId} tidak ditemukan.`, status: 404, code: "OFFER_NOT_FOUND" } };
    if (baris.kuantitas > item.stok) return { error: { message: `Stok ${item.nama} hanya ${item.stok}.`, status: 409, code: "INSUFFICIENT_STOCK" } };
    detail.push({ penawaranId: item.id, nama: item.nama, kuantitas: baris.kuantitas, hargaSatuan: item.hargaPenawaran, subtotal: item.hargaPenawaran * baris.kuantitas, nilaiStokTerselamatkan: item.hargaNormal * baris.kuantitas });
  }
  return { detail };
}

function validasiBaris(baris, idUnik) {
  if (!Number.isInteger(baris.penawaranId) || !Number.isInteger(baris.kuantitas) || baris.kuantitas < MIN_QUANTITY) {
    return { message: "penawaranId dan kuantitas harus berupa bilangan bulat positif.", status: 400, code: "VALIDATION_ERROR" };
  }
  if (idUnik.has(baris.penawaranId)) return { message: "Satu penawaran tidak boleh muncul lebih dari sekali.", status: 400, code: "VALIDATION_ERROR" };
  return null;
}

function kurangiStok(detail) {
  for (const baris of detail) {
    const item = penawaran.find((penawaranItem) => penawaranItem.id === baris.penawaranId);
    item.stok -= baris.kuantitas;
  }
}
 
router.get("/:id", (req, res) => { 
  const pesananItem = pesanan.find((item) => item.id === req.params.id); 
  if (!pesananItem) { 
    return res.status(404).json({ 
      success: false, 
      error: { code: "ORDER_NOT_FOUND", message: "Pesanan tidak ditemukan." } 
    }); 
  } 
  return res.status(200).json({ success: true, data: pesananItem }); 
}); 
 
function kirimValidasi(res, message, status = 400, code = "VALIDATION_ERROR") { 
  return res.status(status).json({ success: false, error: { code, message } }); 
} 
 
export default router;