import Divider from "@/components/elements/Divider";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import useAuthStore from "@/store/useAuthStore";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

import sendRequest from "@/lib/getApi";
import Head from "next/head";
import { SetStateAction, useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const user = useAuthStore.useUser();
  const { setTitle } = useDocumentTitle();

  const [kunjunganData, setKunjunganData] = useState<{
    listKunjungan: any[];
    labelChart: string[];
    dataChart: number[];
    totalPasien: number;
    pasienLakiLaki: number;
    pasienPerempuan: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterChartBy, setFilterChartBy] = useState("");
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKunjunganId, setSelectedKunjunganId] = useState(null);

  const fetchKunjungan = async (filter = "") => {
    const [responseData, message, isSuccess] = await sendRequest(
      "get",
      `kunjungan/dashboard?filterChartBy=${filter}`
    );

    if (isSuccess) {
      setKunjunganData(
        responseData as {
          listKunjungan: any[];
          labelChart: string[];
          dataChart: number[];
          totalPasien: number;
          pasienLakiLaki: number;
          pasienPerempuan: number;
        }
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTitle("Dashboard");
    fetchKunjungan(filterChartBy);
  }, [setTitle, filterChartBy]);

  const handleFilterChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setFilterChartBy(e.target.value);
  };

  const handleDeleteClick = (id: SetStateAction<null>) => {
    setSelectedKunjunganId(id);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div>Memuat...</div>;
  }

  const chartData = kunjunganData
    ? {
        labels: kunjunganData.labelChart,
        datasets: [
          {
            label: "Kunjungan Pasien Seiring Waktu",
            data: kunjunganData.dataChart,
            fill: false,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 4,
          },
        ],
      }
    : { labels: [], datasets: [] };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#334155",
        },
      },
      title: {
        display: true,
        text: "Statistik Kunjungan Pasien",
        color: "#1E293B",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          footer: () =>
            `Total Pasien: ${kunjunganData ? kunjunganData.totalPasien : 0}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#475569",
        },
      },
      y: {
        ticks: {
          color: "#475569",
        },
      },
    },
  };

  const pieData = {
    labels: ["Pasien Laki-Laki", "Pasien Perempuan"],
    datasets: [
      {
        data: [
          kunjunganData?.pasienLakiLaki || 0,
          kunjunganData?.pasienPerempuan || 0,
        ],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const getStatusStyle = (status: number) => {
    if (status === 0) return { color: "red", fontWeight: "bold" };
    if (status === 1) return { color: "orange", fontWeight: "bold" };
    if (status === 2) return { color: "green", fontWeight: "bold" };
    return {};
  };

  const filteredKunjungan = kunjunganData?.listKunjungan?.filter(
    (kunjungan: {
      profile: { name: string };
      status: { toString: () => string | string[] };
      tanggal: string | number | Date;
    }) => {
      return (
        kunjungan.profile.name
          .toLowerCase()
          .includes(filterText.toLowerCase()) ||
        kunjungan.status.toString().includes(filterText) ||
        new Date(kunjungan.tanggal).toLocaleDateString().includes(filterText)
      );
    }
  );

  // Menghitung sesi terbanyak
  const sesiValues =
    filteredKunjungan?.map((kunjungan) => kunjungan.antrian?.sesi) || [];
  const modesSession = sesiValues.reduce(
    (acc, val) => ({
      ...acc,
      [val]: (acc[val] || 0) + 1,
    }),
    {}
  );
  return (
    <main className="w-full flex flex-col items-center justify-start min-h-screen bg-gray-50 py-10">
      <Head>
        <title>SIPOLI</title>
      </Head>

      <section className="w-full max-w-4xl mx-auto flex flex-col items-center bg-white rounded-lg shadow-lg p-6 mb-8">
        <Typography variant="h4" className="text-primary-1 mb-4">
          {user?.role === "DOKTER"
            ? "Dashboard Dokter"
            : user?.role === "PERAWAT"
            ? "Dashboard Perawat"
            : "Dashboard Admin"}
        </Typography>
        <Typography variant="p2" className="text-gray-600 text-center">
          {user?.role === "DOKTER"
            ? "Penyembuhan adalah masalah waktu, tetapi kadang juga masalah kesempatan. - Hippocrates"
            : user?.role === "PERAWAT"
            ? "Perawatan adalah esensi dari keperawatan."
            : "Analisis Kunjungan Pasien"}
        </Typography>
      </section>

      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
          <Typography variant="h5" className="text-primary-1 mb-4">
            Distribusi Jenis Kelamin
          </Typography>
          <Pie data={pieData} />
        </div>

        <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
          <Typography variant="h5" className="text-primary-1 mb-4">
            Kunjungan Pasien Seiring Waktu
          </Typography>
          <Divider />
          <div className="w-full">
            <div className="col-span-1 rounded-lg">
              <label
                htmlFor="filterChartBy"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Filter Grafik Berdasarkan:
              </label>
              <select
                id="filterChartBy"
                value={filterChartBy}
                onChange={handleFilterChange}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Pilih Rentang Waktu</option>
                <option value="3 months">3 Bulan Terakhir</option>
                <option value="6 months">6 Bulan Terakhir</option>
                <option value="9 months">9 Bulan Terakhir</option>
                <option value="1 year">1 Tahun Terakhir</option>
                <option value="2 years">2 Tahun Terakhir</option>
              </select>
            </div>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </section>
      <section>
        <div className="mt-4">
          <Typography variant="h6" className="text-primary-1">
            Sesi Terbanyak: 1
          </Typography>
        </div>
      </section>
    </main>
  );
};

export default withAuth(Dashboard, "user");
