import ParishionerRegister from "@/components/Home/Profile-Registration/ParishionerRegister";
import Login from "@/components/Login";
import WalkInRegistration from "@/components/Home/WalkInRegistration";
import EditRegistration from "@/components/Home/EditRegistration";

const Home = () => {
  return (
    <>
      <div className="relative h-[calc(100dvh_-_10rem)] sm:h-[calc(100dvh_-_1.8rem)] bg-[#FFDECE] bg-[url('@/assets/svg/backdrop.svg')] bg-no-repeat lg:bg-cover md:bg-bottom bg-right-bottom flex items-center justify-center overflow-hidden">
        <div className="absolute rtop-[calc(10rem_+_40dvw)] top-10 z-50">
          <div className="order-2 mx-auto max-w-xl justify-center rounded-[1.8rem] backdrop-blur-sm sm:rounded-full bg-white/60 sm:flex sm:space-x-3 md:order-1 md:col-span-2">
            <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-4">
              <Login />
              <ParishionerRegister />
              <WalkInRegistration />
              <EditRegistration />
            </div>
          </div>
        </div>
        <p className="absolute top-[12rem] text-[9.4dvw] leading-[10dvw] max-w-[80dvw] sm:max-w-xl sm:text-[4.4rem] sm:leading-[5.4rem] sm:top-[20dvh] lg:max-w-full lg:top-auto lg:ml-[24dvw] lg:bottom-[50dvh] lg:text-[8dvh] lg:leading-[9dvh] font-black text-accent whitespace-pre w-screen">{"Growing in Faith\nTogether"}</p>
        <p className="absolute top-[calc(12rem_+_24dvw)] text-[5.8dvw] max-w-[80dvw] sm:max-w-xl sm:text-[2.6rem] sm:top-[calc(20dvh_+_12rem)] lg:max-w-full lg:top-auto lg:ml-[24.2dvw] lg:bottom-[calc(50dvh_-_14dvh)] lg:text-[4.6dvh] font-medium text-accent whitespace-pre w-screen">{"Engaging Children in the Joy \nof Gospel"}</p>
      </div>
      <div className="relative h-[10rem] sm:h-[1.8rem] bg-[#663F30] w-full flex items-end pb-2 pl-4">
        <p className="text-[0.8rem] text-[#FBCCC0]/40 font-regular">Developed by <a href="http://a2kgroup.org" className="underline">A2K Group Corporation</a></p>
      </div>
    </>
  ); 
};

export default Home;