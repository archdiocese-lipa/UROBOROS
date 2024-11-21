import SaintLaurenceImg from "/SaintLaurence.webp";
import BigCurlyRectangle from "@/assets/svg/BigCurlyRectangle.svg";
import StarIcon from "@/assets/svg/Star.svg";
import UpperCurly from "@/assets/svg/UpperCurly.svg";
import CurlyRectangle from "@/assets/svg/CurlyRectangle.svg";
import ParishionerRegister from "@/components/Home/Profile-Registration/ParishionerRegister";
import Login from "@/components/Login";
import WalkInRegistration from "@/components/Home/WalkInRegistration";
import EditRegistration from "@/components/Home/EditRegistration";

const Home = () => {
  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-primary">
      <div className="absolute top-20 z-50">
        <div className="order-2 mx-auto max-w-xl justify-center rounded-2xl bg-white/60 sm:flex sm:space-x-3 md:order-1 md:col-span-2">
          <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-4">
            <Login />
            <ParishionerRegister />
            <WalkInRegistration />
            <EditRegistration />
          </div>
        </div>
      </div>
      <div className="xl:left-30 z-10 flex items-center md:absolute md:bottom-5 lg:left-10">
        <img
          src={SaintLaurenceImg}
          alt="Saint Laurence"
          className="h-auto w-40 object-contain md:w-72 lg:w-96"
          loading="lazy"
        />
        <div className="xs:mt-20 max-w-xl space-y-1 md:mt-36 md:space-y-5">
          <h2 className="text-3xl font-black text-accent sm:text-4xl md:text-5xl lg:text-6xl">
            Growing in Faith Together
          </h2>
          <p className="text-xl font-medium text-accent sm:text-2xl md:text-3xl lg:text-5xl">
            Engaging Children in the Joy of Gospel
          </p>
        </div>
      </div>
      <div className="absolute -top-10 right-5 md:-top-16 md:right-8">
        <img
          src={BigCurlyRectangle}
          alt="Curly Icon"
          className="w-36 md:w-72"
        />
      </div>
      <div className="absolute bottom-0 right-0">
        <img src={StarIcon} alt="Star Icon" className="w-36 lg:w-72" />
      </div>
      <div className="absolute -left-16 -top-5 md:left-0 lg:-top-16">
        <img src={UpperCurly} alt="Curly Rectangle" className="w-36 lg:w-72" />
      </div>
      <div className="absolute -left-7 bottom-48 md:bottom-16 lg:-bottom-64 lg:-left-28 xl:-bottom-52 xl:-left-20">
        <img
          src={CurlyRectangle}
          alt="Curly Rectangle"
          className="w-44 md:w-72 lg:w-auto"
        />
      </div>
    </div>
  );
};

export default Home;
