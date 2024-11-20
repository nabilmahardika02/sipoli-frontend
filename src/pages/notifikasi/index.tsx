import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import Divider from "@/components/elements/Divider";
import Button from "@/components/elements/Button";
import { FaArrowLeft } from "react-icons/fa";
import router from "next/router";
import { checkRole } from "@/lib/checkRole";
import { IoTrashBin } from "react-icons/io5";
import { useEffect, useState } from "react";
import sendRequest from "@/lib/getApi";

const NotifikasiPage = () => {
    const [notifications, setNotifications] = useState<Notifikasi[]>();
    const notificationIds = notifications?.map((n) => n.id);
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
        [] 
      );

    const handleBack = () => {
      router.back();
    };
  
    if (!checkRole(["DOKTER", "PERAWAT"])) {
      router.push("/403");
    }
  
    useEffect(() => {
      const fetchData = async () => {
        const [responseData, message, isSuccess] = await sendRequest(
          "get",
          "notifikasi/my-notif"
        );
  
        if (isSuccess) {
          setNotifications(responseData as Notifikasi[]);
        }
      };
  
      fetchData();
    }, []);
  
    const handleMarkRead = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        "notifikasi/mark-read",
        notificationIds, // Payload ke API
        true
      );
  
      if (isSuccess) {
        console.log("mark sukses");
        const fetchData = async () => {
            const [responseData, message, isSuccess] = await sendRequest(
              "get",
              "notifikasi/my-notif"
            );
      
            if (isSuccess) {
              setNotifications(responseData as Notifikasi[]);
            }
          };

        fetchData();
      }
    };

    const handleCheckboxChange = (id: string) => {
        setSelectedNotifications((prevSelected) =>
          prevSelected.includes(id)
            ? prevSelected.filter((notificationId) => notificationId !== id)
            : [...prevSelected, id]
        );
      };

    const handleDeleteSelected = async () => {
        const [responseData, message, isSuccess] = await sendRequest(
          "delete",
          "notifikasi/delete-all",
          selectedNotifications,
          true
        );
    
        if (isSuccess) {
          console.log("Notifikasi berhasil dihapus");
          const fetchData = async () => {
            const [responseData, message, isSuccess] = await sendRequest(
              "get",
              "notifikasi/my-notif"
            );
    
            if (isSuccess) {
              setNotifications(responseData as Notifikasi[]);
              setSelectedNotifications([]); 
            }
          };
    
          fetchData();
        }
    };
  
    return (
      <main className="w-full p-8 bg-gray-100 h-screen flex flex-col items-center gap-2">
        <div className="w-[90%] lg:w-[70%]">
          <Button variant="secondary" onClick={handleBack} leftIcon={FaArrowLeft}>
            Kembali
          </Button>
        </div>
        <section className="bg-white shadow-lg p-8 rounded-xl w-[90%] lg:w-[70%]">
          <div className="my-2 flex justify-between">
            <Typography variant="h6" className="text-primary-1 text-left">
              Notifikasi Kunjungan Baru
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="p-2 rounded-full"
                onClick={handleMarkRead}
              >
                Tandai Semua Dibaca
              </Button>
              <Button variant="danger" size="lg" className="p-2 rounded-full" onClick={handleDeleteSelected}>
                <IoTrashBin size={24} />
              </Button>
            </div>
          </div>
          <Divider />
          <div className="space-y-4">

          
          {notifications && notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div
                key={index}
                className={`shadow-md rounded-lg p-4 border w-full shrink-0 ${
                  notification.readStatus < 2
                    ? "bg-green-100 border-green-300"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox di kiri card */}
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleCheckboxChange(notification.id)}
                    className="form-checkbox h-5 w-5 text-primary-1"
                  />
                  <Typography weight="semibold">{notification.message}</Typography>
                </div>
              </div>
            )
        )
          ) : (
            <div className="py-4 flex justify-center">
              <Typography
                variant="p1"
                weight="semibold"
                className="text-secondary-3"
              >
                Belum ada notifikasi kunjungan baru
              </Typography>
            </div>
          )}
          </div>
        </section>
      </main>
    );
  };
  

export default withAuth(NotifikasiPage, "user");
