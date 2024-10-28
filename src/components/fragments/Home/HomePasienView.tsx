import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import HelperText from "@/components/elements/forms/HelperText";
import SelectInput from "@/components/elements/forms/SelectInput";
import { showToast, SUCCESS_TOAST } from "@/components/elements/Toast";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
import { Kunjungan } from "@/types/entities/kunjungan";
import { Profile } from "@/types/entities/profile";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { GoPlus } from "react-icons/go";
import KunjunganCard from "../Card/KunjunganCard";

const HomePasienView = () => {
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setProfile] = useState<Profile>();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelId, setCancelId] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const fetchProfiles = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "profile/all-profile"
      );

      if (isSuccess) {
        const data = responseData as Profile[];
        setProfiles(data);
      }
    };

    fetchProfiles();
  }, []);

  const fetchKunjungan = useCallback(async (id: string) => {
    const [responseData, message, isSuccess] = await sendRequest(
      "get",
      "kunjungan/all?profileId=" + id + "&isActive=true"
    );

    if (isSuccess) {
      const sortedData = (responseData as Kunjungan[]).sort((a, b) => {
        const statusPriority = (status: number | undefined) => {
          switch (status) {
            case 1:
              return 0;
            case 0:
              return 1;
            default:
              return 2;
          }
        };

        return statusPriority(a.status) - statusPriority(b.status);
      });

      setKunjungans(sortedData);
    }
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      fetchKunjungan(selectedProfile.id);
    }
  }, [selectedProfile, fetchKunjungan]);

  const methods = useForm<{ profileId: string }>({
    mode: "onTouched",
  });

  const handleProfile = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProfileId = event.target.value;

    const selectedProfile = profiles.find(
      (profile) => profile.id === selectedProfileId
    );
    setProfile(selectedProfile);
  };

  const cancelKunjungan = async () => {
    const [responseData, message, isSuccess] = await sendRequest(
      "put",
      "kunjungan/cancel?kunjunganId=" + cancelId,
      true
    );

    if (isSuccess) {
      router.push(`/`);
      showToast("Berhasil membatalkan kunjungan", SUCCESS_TOAST);
    }
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h6" className=" text-primary-1">
          Kunjungan Aktif
        </Typography>
        <Link href={"/kunjungan/add"}>
          <Button leftIcon={GoPlus} leftIconClassName="max-md:mr-0">
            <span>Daftar Kunjungan</span>
          </Button>
        </Link>
      </div>
      <div className="justify-between gap-5 md:grid-cols-2">
        <FormProvider {...methods}>
          <SelectInput
            id="profileId"
            onChange={handleProfile}
            placeholder="Pilih Profile"
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </SelectInput>
        </FormProvider>
      </div>

      {selectedProfile ? (
        kunjungans && kunjungans.length > 0 ? (
          <div className="w-full flex gap-5 my-5 justify-center flex-shrink-0 flex-wrap">
            {kunjungans.map((kunjungan) => (
              <KunjunganCard
                key={kunjungan.id}
                kunjungan={kunjungan}
                setCancelId={setCancelId}
                setShowCancelModal={setShowCancelModal}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center text-gray-500 rounded-lg mt-4 py-5 px-4 w-full border-2 border-gray-200">
            <Typography variant="p1" className="text-gray-400" weight="medium">
              Tidak ada kunjungan aktif
            </Typography>
          </div>
        )
      ) : (
        <div className="text-center text-gray-500 mt-2">
          <HelperText helperTextClassName="italic">
            Mohon pilih profil terlebih dahulu
          </HelperText>
        </div>
      )}

      {showCancelModal && (
        <ModalLayout setShowModal={setShowCancelModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[50%] flex flex-col">
            <Typography variant="h6" className="text-primary-1">
              Batalkan Kunjungan
            </Typography>
            <Divider className="my-2" weight="kurus" />
            <Typography
              variant="p2"
              weight="semibold"
              className="text-secondary-4"
            >
              Yakin ingin membatalkan kunjungan ini?
            </Typography>
            <Typography variant="p2" className="text-primary-1 mt-2">
              <ul className="list-disc pl-4">
                <li>
                  Kunjungan yang sudah dibatalkan tidak dapat dibuka kembali.
                </li>
                <li>
                  Anda tidak dapat melihat informasi kunjungan yang telah
                  dibatalkan.
                </li>
              </ul>
            </Typography>
            <div className="flex items-center gap-2 mt-4 self-end">
              <Button
                variant="danger"
                size="sm"
                onClick={() => cancelKunjungan()}
              >
                Batalkan Kunjungan
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowCancelModal(false)}
              >
                Tidak
              </Button>
            </div>
          </div>
        </ModalLayout>
      )}
    </section>
  );
};

export default HomePasienView;
