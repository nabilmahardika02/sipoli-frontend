import Typography from "@/components/elements/Typography";
import DataTable from "@/lib/datatable";
import { Obat } from "@/types/entities/obat";
import { getRowIdRestock, restockColumn } from "@/types/table/obatColumn";

const RiwayatRestock = ({ obat }: { obat: Obat }) => {
  return (
    <section className="data-section">
      <Typography
        variant="h6"
        weight="semibold"
        className="text-secondary-2 mb-2"
      >
        Riwayat Restok
      </Typography>
      <div className="w-full mt-3">
        {obat.listRestockObat.length > 0 ? (
          <>
            <DataTable
              columns={restockColumn}
              getRowId={getRowIdRestock}
              rows={obat.listRestockObat}
              flexColumnIndexes={[0, 1, 2, 3]}
              rowClassName={(params) => {
                return params.row.expiredStatus === 1
                  ? "bg-yellow-400"
                  : params.row.expiredStatus === 2
                  ? "bg-red-500 text-white"
                  : "";
              }}
            />
            <Typography
              variant="p2"
              className="italic items-center flex gap-2 text-gray-500 mt-3"
              weight="medium"
            >
              Keterangan:
              <span className="items-center gap-2 flex">
                <div className="w-4 h-4 bg-yellow-400"></div>
                Stok &lt; 3 bulan menuju kadaluarsa
                <div className="w-4 h-4 bg-red-500"></div>
                Stok kadaluarsa
              </span>
            </Typography>
          </>
        ) : (
          <Typography className="text-gray-500 p-4 rounded-lg border border-gray-300 w-full text-center">
            Belum ada riwayat restok
          </Typography>
        )}
      </div>
    </section>
  );
};

export default RiwayatRestock;
