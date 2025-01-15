import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ParishionerRegister from "@/components/Home/Profile-Registration/ParishionerRegister";
import Login from "@/components/Login";
import WalkInRegistration from "@/components/Home/WalkInRegistration";
import EditRegistration from "@/components/Home/EditRegistration";
import { supabase } from "@/services/supabaseClient";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          // show screen to update user's password
          navigate("/reset-password")
          return
        }
      })


      // Navigate to /announcements if there is an active session
      if (session) {
        navigate("/announcements");
      }
    };

    getSession();
  }, [navigate]);


  return (
    <>
      <div className="relative flex h-[calc(100dvh_-_10rem)] items-center justify-center overflow-hidden bg-[#FFDECE] bg-[url('@/assets/svg/backdrop.svg')] bg-right-bottom bg-no-repeat sm:h-[calc(100dvh_-_1.8rem)] md:bg-bottom lg:bg-cover">
        <div className="rtop-[calc(10rem_+_40dvw)] absolute top-10 z-50">
          <div className="order-2 mx-auto max-w-xl justify-center rounded-[1.8rem] bg-white/60 backdrop-blur-sm sm:flex sm:space-x-3 sm:rounded-full md:order-1 md:col-span-2">
            <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-4">
              <Login />
              <ParishionerRegister />
              <WalkInRegistration />
              <EditRegistration />
            </div>
          </div>
        </div>
        <p className="absolute top-[12rem] w-screen max-w-[80dvw] whitespace-pre text-[9.4dvw] font-black leading-[10dvw] text-accent sm:top-[20dvh] sm:max-w-xl sm:text-[4.4rem] sm:leading-[5.4rem] lg:bottom-[50dvh] lg:top-auto lg:ml-[24dvw] lg:max-w-full lg:text-[8dvh] lg:leading-[9dvh]">
          {"Growing in Faith\nTogether"}
        </p>
        <p className="absolute top-[calc(12rem_+_24dvw)] w-screen max-w-[80dvw] whitespace-pre text-[5.8dvw] font-medium text-accent sm:top-[calc(20dvh_+_12rem)] sm:max-w-xl sm:text-[2.6rem] lg:bottom-[calc(50dvh_-_14dvh)] lg:top-auto lg:ml-[24.2dvw] lg:max-w-full lg:text-[4.6dvh]">
          {"Engaging our Parishioner in the \nJoy of Gospel"}
        </p>
      </div>
      <div className="relative flex h-[10rem] w-full items-end bg-[#663F30] pb-2 pl-4 sm:h-[1.8rem]">
        <p className="font-regular text-[0.8rem] text-[#FBCCC0]/40">
          Developed by{" "}
          <a href="http://a2kgroup.org" className="underline">
            A2K Group Corporation
          </a>
        </p>
      </div>
    </>
  );
};

export default Home;
