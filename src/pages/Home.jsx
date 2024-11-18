import SaintLaurenceImg from "/SaintLaurence.webp";
import BigCurlyRectangle from "@/assets/svg/BigCurlyRectangle.svg";
import StarIcon from "@/assets/svg/Star.svg";
import UpperCurly from "@/assets/svg/UpperCurly.svg";
import CurlyRectangle from "@/assets/svg/CurlyRectangle.svg";
import ParishionerRegister from "@/components/ParishionerRegister";

const Home = () => {
  return (
    <div className="relative h-screen bg-primary flex items-center justify-center overflow-hidden">
      <div className="absolute top-20">
        <div className="order-2 mx-auto max-w-xl justify-center rounded-2xl bg-white/60 sm:flex sm:space-x-3 md:order-1 md:col-span-2">
          <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-4">
            <button>Login</button>
            <ParishionerRegister />
            <button>Walk - in Register</button>
            <button>Edit Registration</button>
          </div>
        </div>
      </div>
      <div className="flex items-center md:absolute md:bottom-5 lg:left-10 xl:left-30 z-10">
        <img
          src={SaintLaurenceImg}
          alt="Saint Laurence"
          className="w-40 md:w-72 lg:w-96 h-auto object-contain"
          loading="lazy"
        />
        <div className="space-y-1 md:space-y-5 xs:mt-20 md:mt-36 max-w-xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-accent">
            Growing in Faith Together
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-accent font-medium">
            Engaging Children in the Joy of Gospel
          </p>
        </div>
      </div>
      <div className="absolute md:-top-16 md:right-8 -top-10 right-5">
        <img
          src={BigCurlyRectangle}
          alt="Curly Icon"
          className="w-36 md:w-72"
        />
      </div>
      <div className="absolute bottom-0 right-0">
        <img src={StarIcon} alt="Star Icon" className="w-36 lg:w-72" />
      </div>
      <div className="absolute -top-5 lg:-top-16 -left-16 md:left-0">
        <img src={UpperCurly} alt="Curly Rectangle" className="w-36 lg:w-72" />
      </div>
      <div className="absolute bottom-48 -left-7 md:bottom-16 lg:-bottom-64 lg:-left-28 xl:-bottom-52 xl:-left-20">
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
