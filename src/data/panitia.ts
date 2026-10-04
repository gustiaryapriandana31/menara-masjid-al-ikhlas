import panitiaDataRaw from './panitia.json';

export interface PanitiaMember {
  nama: string;
  jabatan: string;
  seksi: string;
  foto: string | null;
}

export interface Seksi {
  id: string;
  namaSeksi: string;
  deskripsi: string;
  icon: string;
  koordinator: { nama: string; jabatan: string; foto: string | null }[];
  anggota: { nama: string; jabatan: string; foto: string | null }[];
}

export interface PanitiaStructure {
  pelindungPenasehat: PanitiaMember[];
  pengurusInti: PanitiaMember[];
  seksiSeksi: Seksi[];
}

export const panitiaData: PanitiaStructure = panitiaDataRaw as PanitiaStructure;

/**
 * Menghasilkan flat list dari seluruh anggota panitia
 * cocok untuk tabel/pencarian data panitia
 */
export function getAllPanitiaFlat(): PanitiaMember[] {
  const list: PanitiaMember[] = [];

  // Pelindung & Penasehat
  panitiaData.pelindungPenasehat.forEach((m) => list.push(m));

  // Pengurus Inti
  panitiaData.pengurusInti.forEach((m) => list.push(m));

  // Seksi-Seksi
  panitiaData.seksiSeksi.forEach((s) => {
    s.koordinator.forEach((k) =>
      list.push({
        nama: k.nama,
        jabatan: "Koordinator",
        seksi: s.namaSeksi,
        foto: k.foto,
      })
    );
    s.anggota.forEach((a) =>
      list.push({
        nama: a.nama,
        jabatan: "Anggota",
        seksi: s.namaSeksi,
        foto: a.foto,
      })
    );
  });

  return list;
}
