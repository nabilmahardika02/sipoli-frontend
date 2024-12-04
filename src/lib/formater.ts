import { Dayjs } from "dayjs";
import { DateTime } from "luxon";

export const timeZone = "Asia/Makassar";

export function formatDateOnly(dateString: string): string {
  const dt = DateTime.fromISO(dateString, { zone: "utc" }).setZone(timeZone);

  return dt.setLocale("id").toLocaleString({
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDate(isoDate: string): string {
  const [datePart, timePart] = isoDate.split("T");
  const [hour, minute] = timePart.split(":").map((v) => parseInt(v, 10));

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = new Date(datePart).toLocaleDateString("id-ID", options);

  return `${formattedDate} | ${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")} WITA`;
}

export function formatDateWithoutDays(dateInput: string | Date): string {
  const dt =
    typeof dateInput === "string"
      ? DateTime.fromISO(dateInput, { zone: "utc" }).setZone(timeZone)
      : DateTime.fromJSDate(dateInput).setZone(timeZone);

  return dt.setLocale("id").toLocaleString({
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

export function getKewarganegaraan(value: boolean) {
  if (value === true) {
    return "Warga Negara Indonesia";
  } else {
    return "Warga Negara Asing";
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

export function calculateOnlyYearAge(dateOfBirth: string): string {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
  }

  if (months < 0) {
    years--;
  }

  return `${years} tahun`;
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

export function formatToDateInputValue(dateString: string): string | null {
  const dt = DateTime.fromISO(dateString, { zone: "utc" }).setZone(timeZone);
  return dt.toISODate();
}

export function getCurrentDateTime(): string {
  const currentDateTime = DateTime.now().setZone(timeZone);
  return currentDateTime.toISO() || "";
}
