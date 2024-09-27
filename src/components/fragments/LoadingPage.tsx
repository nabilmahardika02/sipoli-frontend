import Logo from "../elements/Logo";
import Typography from "../elements/Typography";

const LoadingPage = () => {
  return (
    <section className="w-full min-h-[80vh] flex flex-col items-center justify-center animate-pulse">
      <Logo sizeCustom={100} />
      <Typography
        variant="h6"
        className="text-primary-1 text-center"
        font="ubuntu"
      >
        SIPOLI
      </Typography>
      <Typography
        variant="p1"
        className="text-primary-1 text-center"
        weight="medium"
      >
        Balai Diklat PKN Bali
      </Typography>
    </section>
  );
};

export default LoadingPage;
