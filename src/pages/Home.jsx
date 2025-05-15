import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ParishionerRegister from "@/components/Home/Profile-Registration/ParishionerRegister";
import Login from "@/components/Login";
import { supabase } from "@/services/supabaseClient";
import ArchLipa from "@/assets/images/ArchLipa.png";
import ArchLipaRound from "@/assets/images/ArchLipaRound.png";

const Home = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          // show screen to update user's password
          navigate("/reset-password");
          return;
        }
      });

      // Navigate to /announcements if there is an active session
      if (session) {
        navigate("/announcements");
      }
    };

    getSession();
  }, [navigate]);

  return (
    <>
      <div className="lbg-right-bottom relative flex h-[calc(100dvh_-_calc(10rem_-_20dvw))] items-center justify-center overflow-hidden bg-[#E2F0FF] bg-[url('@/assets/svg/bgLipa.svg')] bg-[100%_101%] bg-no-repeat sm:h-[calc(100dvh_-_1.8rem)] md:bg-bottom lg:bg-cover">
        <div className="absolute top-4 z-50 flex flex-row border-b border-[#2C3562]/10 px-[2rem] pb-[1rem] sm:top-12 sm:border-b-0">
          <img
            src={ArchLipaRound}
            alt=""
            className="h-12 object-contain sm:hidden"
          />
          <div className="flex w-[90dvw] items-center justify-end gap-2 bg-transparent sm:gap-4">
            <ParishionerRegister />
            <Login />
          </div>
        </div>
        {/* <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 lg:left-[27%]">
          <img
            src="/jubilee.png"
            alt="jubilee"
            className="w-[60dvw] lg:w-[35dvw]"
          />
        </div> */}
        <div
          id="logoName"
          className="absolute top-[8rem] flex w-screen max-w-[80dvw] flex-col gap-[0.7rem] sm:top-[20dvh] sm:max-w-xl sm:flex-row sm:gap-[1.2rem] lg:bottom-[50dvh] lg:top-auto lg:ml-[14dvw] lg:max-w-full"
        >
          <img
            src={ArchLipa}
            alt=""
            className="h-[28dvw] object-contain sm:h-[11rem] lg:h-[20.5dvh]"
          />
          <p className="whitespace-pre text-center text-[9.4dvw] font-black leading-[10dvw] text-[#2C3562] sm:text-left sm:text-[4.4rem] sm:leading-[5.4rem] lg:text-[8dvh] lg:leading-[9dvh]">
            {"Archdiocese\nof"}{" "}
            <span className="text-[12dvw] leading-[12dvw] sm:text-[6rem] sm:leading-[6rem] lg:text-[12dvh] lg:leading-[12dvh]">
              Lipa
            </span>
          </p>
        </div>
        <p className="absolute top-[calc(9rem_+_50dvw)] w-screen max-w-[80dvw] whitespace-pre text-center text-[5.8dvw] font-medium text-[#2C3562] sm:top-[calc(20dvh_+_14rem)] sm:max-w-xl sm:text-[2.6rem] lg:bottom-[calc(50dvh_-_18dvh)] lg:top-[auto] lg:ml-[24.2dvw] lg:max-w-full lg:text-left lg:text-[4.6dvh]">
          {"\n "}
        </p>
      </div>
      <div className="relative z-10 flex h-[calc(100dvh_-_calc(100dvh_-_calc(10rem_-_20dvw)))] w-full items-end bg-[#2E4936] pb-2 pl-4 sm:h-[1.8rem]"></div>

      <p className="font-regular absolute bottom-1 left-0 z-10 h-[1.55rem] w-full border-t border-[#607767]/10 pl-4 pt-1 text-[0.8rem] text-[#607767]">
        Developed by{" "}
        <a href="http://a2kgroup.org" target="_blank">
          A2K Group Corporation <span> © {currentYear}</span>
        </a>
      </p>
    </>
  );
};

export default Home;
