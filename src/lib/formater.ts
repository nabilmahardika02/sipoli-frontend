import { Dayjs } from "dayjs";

export function formatDateOnly(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("id-ID", options);
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Makassar", // Pastikan menggunakan zona waktu lokal Anda
  };

  const formattedDate = date.toLocaleDateString("id-ID", dateOptions);
  const formattedTime = date.toLocaleTimeString("id-ID", timeOptions);

  return `${formattedDate} | ${formattedTime} WITA`;
}

export function getSatuanObat(value: number): string {
  if (value === 0) {
    return "Botol";
  } else if (value === 1) {
    return "Strip";
  } else if (value === 2) {
    return "Tablet";
  } else if (value === 3) {
    return "Kapsul";
  } else if (value === 4) {
    return "Tube";
  } else if (value === 5) {
    return "Patch";
  } else {
    return "";
  }
}

export function getRelative(value: number): string {
  if (value === 0) {
    return "Pegawai";
  } else if (value === 1) {
    return "Suami/Istri";
  } else {
    return "Anak";
  }
}

export function getJenisKelamin(value: boolean) {
  if (value === true) {
    return "Perempuan";
  } else {
    return "Laki-laki";
  }
}

export function calculateAge(dateOfBirth: string): string {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const previousMonthDays = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
    days += previousMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} tahun, ${months} bulan, ${days} hari`;
}

export function getCurrency(value: number): string {
  if (isNaN(value)) {
    throw new Error("Input harus berupa angka.");
  }

  return "Rp " + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatDateDayjs(date: Dayjs): string {
  return date.format("YYYY-MM-DD");
}

export function formatTimeDayjs(date: Dayjs): string {
  return date.format("HH:mm");
}

export function formatToDateInputValue(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}
