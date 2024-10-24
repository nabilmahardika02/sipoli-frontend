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

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = date.toLocaleDateString("id-ID", options);
  const formattedTime = date.toTimeString().split(" ")[0]; // Get only the time (HH:MM:SS)

  return `${formattedDate} | ${formattedTime}`;
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
