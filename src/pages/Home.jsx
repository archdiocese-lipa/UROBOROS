import {  useState ,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ParishionerRegister from "@/components/Home/Profile-Registration/ParishionerRegister";
import Login from "@/components/Login";
import WalkInRegistration from "@/components/Home/WalkInRegistration";
import EditRegistration from "@/components/Home/EditRegistration";
import { supabase } from "@/services/supabaseClient";

const Home = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [showVideo, setShowVideo] = useState(false);

  const toggleVideo = () => {
    if (showVideo) {
      setShowVideo(false);
    } else {
      setShowVideo(true);
    }
  }

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
          {"Engaging our Parishioners in the \nJoy of Gospel"}
        </p>
        {/* <div className="z-99 absolute bottom-0 left-1 h-32 w-64 md:bottom-48 md:left-12 md:h-60 md:w-96 lg:bottom-10 lg:left-72 lg:w-[30rem] lg:h-64">
          <iframe
            className="rounded-lg"
            src="https://www.youtube.com/embed/3pAuz0TTVn0?controls=1"
            title="Creating a Parishioner Account"
            style={{
              border: "1px solid #663F30 ",
              width: "100%",
              height: "100%",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div> */}
      </div>
      <div className="z-10 relative flex h-[10rem] w-full items-end bg-[#663F30] pb-2 pl-4 sm:h-[1.8rem]">
        <p className="font-regular text-[0.8rem] text-[#FBCCC0]/40">
          Developed by{" "}
          <a href="http://a2kgroup.org" className="underline" target="_blank">
            A2K Group Corporation <span> © {currentYear}</span>
          </a>
        </p>
      </div>
      <div className="z-20 sm:z-0 flex flex-col items-center gap-4 text-accent text-[1.05rem] font-medium px-[2rem] py-[0.8rem] rounded-[1rem] bg-[#FBCCC0] h-[11rem] sm:h-[13rem] w-[20rem] transition-all duration-200 fixed bottom-12 sm:bottom-[-8rem] scale-[85%] sm:scale-100 sm:hover:scale-[150%] origin-bottom sm:hover:bottom-[-1.6rem] left-[calc(50%_-_10rem)] shadow-xl sm:shadow-2xl shadow-black/20 sm:shadow-black">
          <p>Need <span className="font-bold">help</span> creating an account?</p>
          <div 
            className="flex p-2 bg-accent/10 border-accent/30 border rounded-md h-[6rem] w-full cursor-pointer hover:bg-accent/20 transition-all"
            onClick={toggleVideo}
          >
            <div className="flex items-end justify-end bg-white/80 h-full w-[6rem] rounded-md p-2 bg-[url('@/assets/images/slide-thumbnail.png')] bg-center bg-contain">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2M8.964 8.65l-.053.5l-.03.333l-.042.6l-.024.46l-.018.505l-.01.549v.578l.01.549l.018.506l.024.46l.042.6l.071.73l.013.102a1.192 1.192 0 0 0 1.651.954l.456-.202l.651-.309l.39-.196l.43-.224l.466-.253l.498-.282l.493-.29l.231-.14l.43-.27l.388-.25l.342-.229l.653-.46l.177-.131a1.192 1.192 0 0 0-.001-1.908l-.406-.297l-.275-.193l-.32-.218l-.565-.368l-.428-.268l-.47-.282l-.499-.288l-.478-.265l-.447-.238l-.41-.21l-.54-.263l-.439-.202l-.23-.102l-.095-.04a1.192 1.192 0 0 0-1.654.952"/></g></svg>
            </div>
            <div className="flex flex-col flex-1 h-full w-full py-[0.4rem] pl-[0.8rem] gap-3">
              <p className="font-bold text-[0.8rem] leading-[0.9rem]">Creating a Parishioner Account</p>
              <div className="flex justify-center bg-accent w-[3.6rem] py-1 px-2 rounded-full">
                <p className="font-normal text-[0.6rem] text-white">Tutorial</p>
              </div>
            </div>
          </div>
      </div>
      <div
      className={`transition-none duration-300 flex gap-4 sm:gap-8 flex-col justify-center items-center bg-black/90 fixed left-0 right-0 z-[99] ${
        showVideo ? 'top-0 bottom-0 opacity-100' : 'top-[100%] bottom-[-100%] opacity-0'
      }`}
    >        <div className="h-[56dvw] sm:h-[80dvh] w-[99dvw] sm:w-[75dvw]">
          <iframe
            className="rounded-2xl"
            src={(showVideo ? "https://www.youtube.com/embed/3pAuz0TTVn0?controls=1&mute=1&autoplay=1" : "")}
            title="Creating a Parishioner Account"
            style={{
              border: "1px solid",
              width: "100%",
              height: "100%",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        <p 
          className="bg-accent rounded-full text-white/80 hover:underline font-medium text-[1rem] sm:text-[1.2rem] cursor-pointer py-3 px-12"
          onClick={toggleVideo}
        >
          Close
        </p>
      </div>
    </>
  );
};

export default Home;
