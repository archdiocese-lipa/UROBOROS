import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

const LikeIcon = ({ className = "text-blue" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={cn(className)}
    >
      <g fill="none" fillRule="evenodd">
        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
        <path
          fill="currentColor"
          d="M9.5 2.5c1.356 0 2.294.852 2.895 2.053c.522 1.045.571 2.3.597 3.447h4.834a3 3 0 0 1 2.99 3.25l-.361 4.331A7 7 0 0 1 13.479 22h-1.512a6.96 6.96 0 0 1-4.642-1.762a1.24 1.24 0 0 0-1.009-.298A5.5 5.5 0 0 1 5.5 20c-1.108 0-2.028-.62-2.624-1.608C2.296 17.432 2 16.107 2 14.5s.297-2.931.876-3.891C3.472 9.62 4.392 9 5.5 9c.281 0 .579.05.877.134c.458-1.2.784-2.437.63-3.735C6.835 3.954 8.016 2.5 9.5 2.5"
        />
      </g>
    </svg>
  );
};
LikeIcon.propTypes = {
  className: PropTypes.string,
};

const DeleteIcon = ({ className = " text-accent" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd">
        <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
        <path
          fill="currentColor"
          d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2h-1v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zM17 7H7v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1zm-2.72-3H9.72l-.333 1h5.226z"
        />
      </g>
    </svg>
  );
};
DeleteIcon.propTypes = {
  className: PropTypes.string,
};

const ReplyIcon = ({ className = "text-accent" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M14.502 7.046h-2.5v-.928a2.12 2.12 0 0 0-1.199-1.954a1.83 1.83 0 0 0-1.984.311L3.71 8.965a2.2 2.2 0 0 0 0 3.24L8.82 16.7a1.83 1.83 0 0 0 1.985.31a2.12 2.12 0 0 0 1.199-1.959v-.928h1a2.025 2.025 0 0 1 1.999 2.047V19a1 1 0 0 0 1.275.961a6.59 6.59 0 0 0 4.662-7.22a6.59 6.59 0 0 0-6.437-5.695Z"
      />
    </svg>
  );
};

ReplyIcon.propTypes = {
  className: PropTypes.string,
};

const PersonIcon = ({ className = "text-accent" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={cn(className)}
    >
      <g fill="none">
        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
        <path
          fill="currentColor"
          d="M16 14a5 5 0 0 1 4.995 4.783L21 19v1a2 2 0 0 1-1.85 1.995L19 22H5a2 2 0 0 1-1.995-1.85L3 20v-1a5 5 0 0 1 4.783-4.995L8 14zM12 2a5 5 0 1 1 0 10a5 5 0 0 1 0-10"
        />
      </g>
    </svg>
  );
};

PersonIcon.propTypes = {
  className: PropTypes.string,
};

const DislikeIcon = ({ className = "text-white" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={cn(className)}
    >
      <g fill="none" fillRule="evenodd">
        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
        <path
          fill="currentColor"
          d="M9.5 21.5c1.356 0 2.294-.852 2.895-2.053c.522-1.044.571-2.3.597-3.447h4.834a3 3 0 0 0 2.99-3.25l-.361-4.331A7 7 0 0 0 13.479 2h-1.512A6.94 6.94 0 0 0 6.9 4.179a5.5 5.5 0 0 0-1.4-.18c-1.108 0-2.028.622-2.624 1.61c-.58.96-.876 2.284-.876 3.89s.297 2.932.876 3.892C3.472 14.38 4.392 15 5.5 15c.281 0 .579-.05.877-.134c.458 1.2.784 2.437.63 3.735C6.835 20.046 8.016 21.5 9.5 21.5"
        />
      </g>
    </svg>
  );
};

DislikeIcon.propTypes = {
  className: PropTypes.string,
};
const LoadingIcon = ({className="text-black"}) => {
  return(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
        opacity="0.5"
      />
      <path
        fill="currentColor"
        d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
      >
        <animateTransform
          attributeName="transform"
          dur="1s"
          from="0 12 12"
          repeatCount="indefinite"
          to="360 12 12"
          type="rotate"
        />
      </path>
    </svg>
  );
};

LoadingIcon.propTypes = {
  className: PropTypes.string,
};


const EventIcon = ({ className = "text-black" }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.25 1.25C11.5815 1.25 11.8995 1.3817 12.1339 1.61612C12.3683 1.85054 12.5 2.16848 12.5 2.5V8.00188C11.7276 7.55568 10.8214 7.39942 9.94422 7.56117C9.06699 7.72291 8.27615 8.19206 7.71368 8.88439C7.15121 9.57672 6.85395 10.4469 6.87527 11.3386C6.89659 12.2304 7.23509 13.0853 7.83 13.75H3.75C3.41848 13.75 3.10054 13.6183 2.86612 13.3839C2.6317 13.1495 2.5 12.8315 2.5 12.5V2.5C2.5 2.16848 2.6317 1.85054 2.86612 1.61612C3.10054 1.3817 3.41848 1.25 3.75 1.25H11.25ZM10.625 8.75C11.288 8.75 11.9239 9.01339 12.3928 9.48223C12.8616 9.95107 13.125 10.587 13.125 11.25C13.125 11.913 12.8616 12.5489 12.3928 13.0178C11.9239 13.4866 11.288 13.75 10.625 13.75C9.96196 13.75 9.32607 13.4866 8.85723 13.0178C8.38839 12.5489 8.125 11.913 8.125 11.25C8.125 10.587 8.38839 9.95107 8.85723 9.48223C9.32607 9.01339 9.96196 8.75 10.625 8.75ZM10.625 9.6875C10.4719 9.68752 10.3242 9.74372 10.2098 9.84545C10.0954 9.94717 10.0223 10.0873 10.0044 10.2394L10 10.3125V11.25C10 11.4031 10.0562 11.5508 10.1579 11.6652C10.2597 11.7796 10.3998 11.8527 10.5519 11.8706L10.625 11.875H11.25C11.4093 11.8748 11.5625 11.8138 11.6784 11.7045C11.7942 11.5951 11.8639 11.4457 11.8732 11.2866C11.8826 11.1276 11.8308 10.971 11.7286 10.8489C11.6263 10.7267 11.4813 10.6482 11.3231 10.6294L11.25 10.625V10.3125C11.25 10.1467 11.1842 9.98777 11.0669 9.87056C10.9497 9.75335 10.7908 9.6875 10.625 9.6875ZM5.625 6.875H5C4.83424 6.875 4.67527 6.94085 4.55806 7.05806C4.44085 7.17527 4.375 7.33424 4.375 7.5C4.375 7.66576 4.44085 7.82473 4.55806 7.94194C4.67527 8.05915 4.83424 8.125 5 8.125H5.625C5.79076 8.125 5.94973 8.05915 6.06694 7.94194C6.18415 7.82473 6.25 7.66576 6.25 7.5C6.25 7.33424 6.18415 7.17527 6.06694 7.05806C5.94973 6.94085 5.79076 6.875 5.625 6.875ZM8.75 4.375H5C4.8407 4.37518 4.68748 4.43617 4.57164 4.54553C4.45581 4.65489 4.3861 4.80435 4.37677 4.96337C4.36743 5.1224 4.41917 5.27899 4.52142 5.40114C4.62366 5.5233 4.76869 5.60181 4.92687 5.62063L5 5.625H8.75C8.9093 5.62482 9.06252 5.56383 9.17836 5.45447C9.29419 5.34511 9.3639 5.19565 9.37323 5.03663C9.38257 4.8776 9.33083 4.72101 9.22858 4.59885C9.12634 4.4767 8.98131 4.39819 8.82312 4.37937L8.75 4.375Z"
      />
    </svg>
  );
};
const EditIcon = ({ className = "text-black" }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"
      />
    </svg>
  );
};
EditIcon.propTypes = {
  className: PropTypes.string,
};

EventIcon.propTypes = {
  className: PropTypes.string,
};
const GlobeIcon = ({ className = "text-accent bg-accent" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={cn(className)}
    >
      <g fill="none" fillRule="evenodd">
        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m2 11.4l-1.564 1.251a.5.5 0 0 0-.041.744l1.239 1.239a2 2 0 0 1 .508.864l.175.613a1.8 1.8 0 0 0 1.017 1.163a8 8 0 0 0 2.533-1.835l-.234-1.877a2 2 0 0 0-1.09-1.54l-1.47-.736A1 1 0 0 0 14 13.4M12 4a7.99 7.99 0 0 0-6.335 3.114l-.165.221V9.02a3 3 0 0 0 1.945 2.809l.178.06l1.29.395c1.373.42 2.71-.697 2.577-2.096l-.019-.145l-.175-1.049a1 1 0 0 1 .656-1.108l.108-.03l.612-.14a2.667 2.667 0 0 0 1.989-3.263A8 8 0 0 0 12 4"
        />
      </g>
    </svg>
  );
};
GlobeIcon.propTypes = { className: PropTypes.string };

const KebabIcon = ({ className = "text-accent" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={cn(className)}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="3.75"
        d="M12.01 12v.01H12V12zm7 0v.01H19V12zm-14 0v.01H5V12z"
      />
    </svg>
  );
};

KebabIcon.propTypes = {
  className: PropTypes.string,
};

const CloseIcon = ({ className = "text-black" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={cn(className)}
    >
      <g fill="none" fillRule="evenodd">
        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
        <path
          fill="currentColor"
          d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"
        />
      </g>
    </svg>
  );
};

CloseIcon.propTypes = {
  className: PropTypes.string,
};

const Users = ({ className = "text-black" }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M5.9375 7.5C6.68342 7.5 7.39879 7.20368 7.92624 6.67624C8.45368 6.14879 8.75 5.43342 8.75 4.6875C8.75 3.94158 8.45368 3.22621 7.92624 2.69876C7.39879 2.17132 6.68342 1.875 5.9375 1.875C5.19158 1.875 4.47621 2.17132 3.94876 2.69876C3.42132 3.22621 3.125 3.94158 3.125 4.6875C3.125 5.43342 3.42132 6.14879 3.94876 6.67624C4.47621 7.20368 5.19158 7.5 5.9375 7.5ZM13.125 5.625C13.125 6.12228 12.9275 6.59919 12.5758 6.95083C12.2242 7.30246 11.7473 7.5 11.25 7.5C10.7527 7.5 10.2758 7.30246 9.92417 6.95083C9.57254 6.59919 9.375 6.12228 9.375 5.625C9.375 5.12772 9.57254 4.65081 9.92417 4.29917C10.2758 3.94754 10.7527 3.75 11.25 3.75C11.7473 3.75 12.2242 3.94754 12.5758 4.29917C12.9275 4.65081 13.125 5.12772 13.125 5.625ZM5.9375 8.125C7.18313 8.125 8.31563 8.505 9.14813 9.04125C9.565 9.31 9.92188 9.62688 10.1813 9.9725C10.4356 10.3131 10.625 10.7225 10.625 11.1606C10.625 11.6325 10.4062 12.0106 10.085 12.2837C9.78187 12.54 9.38688 12.7063 8.97875 12.8206C8.15812 13.05 7.0725 13.125 5.9375 13.125C4.8025 13.125 3.71688 13.05 2.89688 12.8206C2.48813 12.7063 2.09312 12.54 1.79062 12.2837C1.46813 12.0112 1.25 11.6325 1.25 11.1606C1.25 10.7219 1.43938 10.3131 1.69375 9.97312C1.95312 9.62687 2.31 9.30937 2.72687 9.04187C3.55938 8.50437 4.69187 8.125 5.9375 8.125ZM11.25 8.125C12.075 8.125 12.8237 8.3975 13.375 8.78187C13.8888 9.14 14.375 9.705 14.375 10.3569C14.375 10.7237 14.2169 11.0275 13.9762 11.2481C13.7531 11.4531 13.4706 11.5781 13.1987 11.6606C12.655 11.825 11.955 11.875 11.25 11.875H11.1231C11.2044 11.6575 11.25 11.4187 11.25 11.1606C11.25 10.5419 10.9856 10.0044 10.6812 9.59813C10.3775 9.1925 9.975 8.83563 9.52563 8.54125C10.0594 8.26795 10.6504 8.12529 11.25 8.125Z"
      />
    </svg>
  );
};

Users.propTypes = {
  className: PropTypes.string,
};

const Settings = ({ className = "text-black" }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.87063 14.536L7.86375 14.5373L7.81938 14.5592L7.80688 14.5617L7.79813 14.5592L7.75375 14.5373C7.74708 14.5352 7.74208 14.5362 7.73875 14.5404L7.73625 14.5467L7.72563 14.8142L7.72875 14.8267L7.735 14.8348L7.8 14.881L7.80938 14.8835L7.81688 14.881L7.88188 14.8348L7.88938 14.8248L7.89188 14.8142L7.88125 14.5473C7.87958 14.5406 7.87604 14.5369 7.87063 14.536ZM8.03625 14.4654L8.02813 14.4667L7.9125 14.5248L7.90625 14.531L7.90438 14.5379L7.91563 14.8067L7.91875 14.8142L7.92375 14.8185L8.04938 14.8767C8.05729 14.8787 8.06333 14.8771 8.0675 14.8717L8.07 14.8629L8.04875 14.4792C8.04667 14.4717 8.0425 14.4671 8.03625 14.4654ZM7.58938 14.4667C7.58662 14.465 7.58333 14.4644 7.58019 14.4651C7.57704 14.4658 7.57429 14.4677 7.5725 14.4704L7.56875 14.4792L7.5475 14.8629C7.54792 14.8704 7.55146 14.8754 7.55813 14.8779L7.5675 14.8767L7.69313 14.8185L7.69938 14.8135L7.70188 14.8067L7.7125 14.5379L7.71063 14.5304L7.70438 14.5242L7.58938 14.4667Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.3125 7.5C11.0469 7.50001 11.7522 7.78731 12.2776 8.30049C12.803 8.81366 13.1069 9.512 13.1242 10.2462C13.1415 10.9805 12.8709 11.6923 12.3702 12.2297C11.8696 12.7671 11.1786 13.0873 10.445 13.1219L10.3125 13.125H4.6875C3.95306 13.125 3.24777 12.8377 2.72236 12.3245C2.19696 11.8113 1.89313 11.113 1.87583 10.3788C1.85852 9.64454 2.12911 8.93266 2.62976 8.3953C3.1304 7.85794 3.82138 7.53774 4.555 7.50313L4.6875 7.5H10.3125ZM4.375 9.0625C4.04348 9.0625 3.72554 9.1942 3.49112 9.42862C3.2567 9.66304 3.125 9.98098 3.125 10.3125C3.125 10.644 3.2567 10.962 3.49112 11.1964C3.72554 11.4308 4.04348 11.5625 4.375 11.5625C4.70652 11.5625 5.02446 11.4308 5.25888 11.1964C5.4933 10.962 5.625 10.644 5.625 10.3125C5.625 9.98098 5.4933 9.66304 5.25888 9.42862C5.02446 9.1942 4.70652 9.0625 4.375 9.0625ZM10.3125 1.25C11.0469 1.25001 11.7522 1.53731 12.2776 2.05049C12.803 2.56366 13.1069 3.262 13.1242 3.99623C13.1415 4.73046 12.8709 5.44234 12.3702 5.9797C11.8696 6.51706 11.1786 6.83726 10.445 6.87187L10.3125 6.875H4.6875C3.95306 6.87499 3.24777 6.58769 2.72236 6.07451C2.19696 5.56134 1.89313 4.863 1.87583 4.12877C1.85852 3.39454 2.12911 2.68266 2.62976 2.1453C3.1304 1.60794 3.82138 1.28774 4.555 1.25313L4.6875 1.25H10.3125ZM10.625 2.8125C10.2935 2.8125 9.97554 2.9442 9.74112 3.17862C9.5067 3.41304 9.375 3.73098 9.375 4.0625C9.375 4.39402 9.5067 4.71196 9.74112 4.94638C9.97554 5.1808 10.2935 5.3125 10.625 5.3125C10.9565 5.3125 11.2745 5.1808 11.5089 4.94638C11.7433 4.71196 11.875 4.39402 11.875 4.0625C11.875 3.73098 11.7433 3.41304 11.5089 3.17862C11.2745 2.9442 10.9565 2.8125 10.625 2.8125Z"
      />
    </svg>
  );
};

Settings.propTypes = {
  className: PropTypes.string,
};

const Search = ({ className = "text-black" }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        fill="currentColor"
        fillOpacity="0.65"
        // fillRule="evenodd"
        clipRule="evenodd"
        d="M3.74999 7.5C3.74999 6.50544 4.14508 5.55161 4.84834 4.84835C5.5516 4.14509 6.50543 3.75 7.49999 3.75C8.49455 3.75 9.44838 4.14509 10.1516 4.84835C10.8549 5.55161 11.25 6.50544 11.25 7.5C11.25 8.49456 10.8549 9.44839 10.1516 10.1517C9.44838 10.8549 8.49455 11.25 7.49999 11.25C6.50543 11.25 5.5516 10.8549 4.84834 10.1517C4.14508 9.44839 3.74999 8.49456 3.74999 7.5ZM7.49999 2.25C6.66844 2.25 5.84878 2.44753 5.10851 2.82632C4.36824 3.20512 3.72853 3.75434 3.24207 4.42875C2.75561 5.10317 2.43632 5.8835 2.31047 6.70548C2.18462 7.52745 2.25583 8.36757 2.51823 9.15664C2.78063 9.94571 3.22671 10.6612 3.81974 11.2441C4.41277 11.827 5.13579 12.2607 5.92925 12.5095C6.72271 12.7583 7.56393 12.8151 8.38362 12.6751C9.20331 12.5351 9.97803 12.2025 10.644 11.7045L14.469 15.5303C14.6096 15.671 14.8004 15.7501 14.9994 15.7502C15.1983 15.7502 15.3891 15.6713 15.5299 15.5306C15.6706 15.39 15.7497 15.1992 15.7498 15.0003C15.7498 14.8013 15.6709 14.6105 15.5302 14.4697L11.7052 10.6447C12.289 9.86439 12.644 8.93694 12.7306 7.96625C12.8171 6.99556 12.6318 6.01994 12.1953 5.14861C11.7588 4.27728 11.0884 3.54463 10.2592 3.0327C9.42991 2.52077 8.47453 2.24976 7.49999 2.25Z"
      />
    </svg>
  );
};

Search.propTypes = {
  className: PropTypes.string,
};

const ChevronUp = ({ className = "text-black" }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <g clipPath="url(#clip0_218_1192)">
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.41083 6.91098C9.5671 6.75476 9.77903 6.66699 10 6.66699C10.221 6.66699 10.4329 6.75476 10.5892 6.91098L15.3033 11.6251C15.4551 11.7823 15.5391 11.9928 15.5372 12.2113C15.5353 12.4298 15.4477 12.6388 15.2932 12.7933C15.1387 12.9478 14.9297 13.0355 14.7112 13.0374C14.4927 13.0393 14.2822 12.9553 14.125 12.8035L10 8.67848L5.875 12.8035C5.71783 12.9553 5.50733 13.0393 5.28883 13.0374C5.07033 13.0355 4.86132 12.9478 4.70682 12.7933C4.55231 12.6388 4.46467 12.4298 4.46277 12.2113C4.46087 11.9928 4.54487 11.7823 4.69666 11.6251L9.41083 6.91098Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_218_1192">
          <rect width="1em" height="1em" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};

ChevronUp.propTypes = {
  className: PropTypes.string,
};

const DownIcon = ({ className = "text-black" }) => {
  return (
    <svg
      width="0.5em"
      height="0.5em"
      viewBox="0 0 8 5"
      fill="none"
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.4256 4.62465C4.31271 4.7375 4.15962 4.8009 4 4.8009C3.84038 4.8009 3.68729 4.7375 3.5744 4.62465L0.168984 1.21924C0.0593279 1.1057 -0.00134816 0.953638 2.32383e-05 0.7958C0.00139464 0.637963 0.0647048 0.486978 0.176317 0.375366C0.28793 0.263753 0.438915 0.200444 0.596753 0.199072C0.75459 0.1977 0.906651 0.258376 1.02019 0.368033L4 3.34785L6.97981 0.368033C7.09335 0.258377 7.24541 0.197701 7.40325 0.199072C7.56109 0.200444 7.71207 0.263754 7.82368 0.375366C7.9353 0.486979 7.99861 0.637963 7.99998 0.795801C8.00135 0.953639 7.94067 1.1057 7.83102 1.21924L4.4256 4.62465Z"
        fill="currentColor"
      />
    </svg>
  );
};

DownIcon.propTypes = {
  className: PropTypes.string,
};

const ThreeDotsIcon = ({ className = "text-black" }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 26 26"
      fill="none"
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="26" height="26" fill="#1E1E1E" />
      <g id="Schedule">
        <g clipPath="url(#clip0_96_58)">
          <rect
            x="-892"
            y="-247"
            width="1440"
            height="850"
            rx="10"
            fill="white"
          />
          <rect
            id="Rectangle 9"
            x="-892"
            y="-168"
            width="1440"
            height="771"
            fill="#F7F0ED"
          />
          <rect
            id="Rectangle 8"
            x="-594"
            y="-150"
            width="1118"
            height="723"
            rx="20"
            fill="white"
          />
          <g id="Frame 68">
            <g clipPath="url(#clip1_96_58)">
              <mask id="path-5-inside-1_96_58" fill="white">
                <path d="M-508 -28C-508 -36.2843 -501.284 -43 -493 -43H79C87.2842 -43 94 -36.2843 94 -28V526C94 534.284 87.2842 541 79 541H-493C-501.284 541 -508 534.284 -508 526V-28Z" />
              </mask>
              <path
                d="M-508 -28C-508 -36.2843 -501.284 -43 -493 -43H79C87.2842 -43 94 -36.2843 94 -28V526C94 534.284 87.2842 541 79 541H-493C-501.284 541 -508 534.284 -508 526V-28Z"
                fill="#F6F0ED"
              />
              <g id="Group 13">
                <g id="Group 12">
                  <rect
                    id="Rectangle 12"
                    x="-471.5"
                    y="-18.5"
                    width="529"
                    height="356"
                    rx="9.5"
                    fill="white"
                    stroke="#E8DAD3"
                  />
                  <g id="Frame">
                    <g id="Group">
                      <path
                        id="Vector"
                        d="M6.5 11.375C6.93098 11.375 7.3443 11.5462 7.64905 11.851C7.9538 12.1557 8.125 12.569 8.125 13C8.125 13.431 7.9538 13.8443 7.64905 14.149C7.3443 14.4538 6.93098 14.625 6.5 14.625C6.06902 14.625 5.6557 14.4538 5.35095 14.149C5.0462 13.8443 4.875 13.431 4.875 13C4.875 12.569 5.0462 12.1557 5.35095 11.851C5.6557 11.5462 6.06902 11.375 6.5 11.375ZM13 11.375C13.431 11.375 13.8443 11.5462 14.149 11.851C14.4538 12.1557 14.625 12.569 14.625 13C14.625 13.431 14.4538 13.8443 14.149 14.149C13.8443 14.4538 13.431 14.625 13 14.625C12.569 14.625 12.1557 14.4538 11.851 14.149C11.5462 13.8443 11.375 13.431 11.375 13C11.375 12.569 11.5462 12.1557 11.851 11.851C12.1557 11.5462 12.569 11.375 13 11.375ZM19.5 11.375C19.931 11.375 20.3443 11.5462 20.649 11.851C20.9538 12.1557 21.125 12.569 21.125 13C21.125 13.431 20.9538 13.8443 20.649 14.149C20.3443 14.4538 19.931 14.625 19.5 14.625C19.069 14.625 18.6557 14.4538 18.351 14.149C18.0462 13.8443 17.875 13.431 17.875 13C17.875 12.569 18.0462 12.1557 18.351 11.851C18.6557 11.5462 19.069 11.375 19.5 11.375Z"
                        fill="#663F30"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
            <path
              d="M-493 -42H79V-44H-493V-42ZM93 -28V526H95V-28H93ZM79 540H-493V542H79V540ZM-507 526V-28H-509V526H-507ZM-493 540C-500.732 540 -507 533.732 -507 526H-509C-509 534.837 -501.837 542 -493 542V540ZM93 526C93 533.732 86.732 540 79 540V542C87.8365 542 95 534.837 95 526H93ZM79 -42C86.732 -42 93 -35.732 93 -28H95C95 -36.8366 87.8365 -44 79 -44V-42ZM-493 -44C-501.837 -44 -509 -36.8365 -509 -28H-507C-507 -35.732 -500.732 -42 -493 -42V-44Z"
              fill="#E8DAD3"
              mask="url(#path-5-inside-1_96_58)"
            />
          </g>
        </g>
        <rect
          x="-891.5"
          y="-246.5"
          width="1439"
          height="849"
          rx="9.5"
          stroke="#3C3C3C"
        />
      </g>
      <defs>
        <clipPath id="clip0_96_58">
          <rect
            x="-892"
            y="-247"
            width="1440"
            height="850"
            rx="10"
            fill="white"
          />
        </clipPath>
        <clipPath id="clip1_96_58">
          <path
            d="M-508 -28C-508 -36.2843 -501.284 -43 -493 -43H79C87.2842 -43 94 -36.2843 94 -28V526C94 534.284 87.2842 541 79 541H-493C-501.284 541 -508 534.284 -508 526V-28Z"
            fill="currentColor"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

ThreeDotsIcon.propTypes = {
  className: PropTypes.string,
};

const PuzzleIcon = ({ className = "text-black" }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 25 25"
      fill="none"
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 5.5C11.5 4.96957 11.2893 4.46086 10.9142 4.08579C10.5391 3.71071 10.0304 3.5 9.5 3.5H5.5C4.96957 3.5 4.46086 3.71071 4.08579 4.08579C3.71071 4.46086 3.5 4.96957 3.5 5.5V9.5C3.5 10.0304 3.71071 10.5391 4.08579 10.9142C4.46086 11.2893 4.96957 11.5 5.5 11.5H9.5C10.0304 11.5 10.5391 11.2893 10.9142 10.9142C11.2893 10.5391 11.5 10.0304 11.5 9.5V5.5ZM21.5 5.5C21.5 4.96957 21.2893 4.46086 20.9142 4.08579C20.5391 3.71071 20.0304 3.5 19.5 3.5H15.5C14.9696 3.5 14.4609 3.71071 14.0858 4.08579C13.7107 4.46086 13.5 4.96957 13.5 5.5V9.5C13.5 10.0304 13.7107 10.5391 14.0858 10.9142C14.4609 11.2893 14.9696 11.5 15.5 11.5H19.5C20.0304 11.5 20.5391 11.2893 20.9142 10.9142C21.2893 10.5391 21.5 10.0304 21.5 9.5V5.5ZM9.5 13.5C10.0304 13.5 10.5391 13.7107 10.9142 14.0858C11.2893 14.4609 11.5 14.9696 11.5 15.5V19.5C11.5 20.0304 11.2893 20.5391 10.9142 20.9142C10.5391 21.2893 10.0304 21.5 9.5 21.5H5.5C4.96957 21.5 4.46086 21.2893 4.08579 20.9142C3.71071 20.5391 3.5 20.0304 3.5 19.5V15.5C3.5 14.9696 3.71071 14.4609 4.08579 14.0858C4.46086 13.7107 4.96957 13.5 5.5 13.5H9.5ZM13.5 17.5C13.5 17.2348 13.6054 16.9804 13.7929 16.7929C13.9804 16.6054 14.2348 16.5 14.5 16.5H16.5V14.5C16.5 14.2348 16.6054 13.9804 16.7929 13.7929C16.9804 13.6054 17.2348 13.5 17.5 13.5C17.7652 13.5 18.0196 13.6054 18.2071 13.7929C18.3946 13.9804 18.5 14.2348 18.5 14.5V16.5H20.5C20.7652 16.5 21.0196 16.6054 21.2071 16.7929C21.3946 16.9804 21.5 17.2348 21.5 17.5C21.5 17.7652 21.3946 18.0196 21.2071 18.2071C21.0196 18.3946 20.7652 18.5 20.5 18.5H18.5V20.5C18.5 20.7652 18.3946 21.0196 18.2071 21.2071C18.0196 21.3946 17.7652 21.5 17.5 21.5C17.2348 21.5 16.9804 21.3946 16.7929 21.2071C16.6054 21.0196 16.5 20.7652 16.5 20.5V18.5H14.5C14.2348 18.5 13.9804 18.3946 13.7929 18.2071C13.6054 18.0196 13.5 17.7652 13.5 17.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

PuzzleIcon.propTypes = {
  className: PropTypes.string,
};

const NegativeIcon = ({ className = "text-black" }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 18 18"
      fill="none"
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 1.5C13.1423 1.5 16.5 4.85775 16.5 9C16.5 13.1423 13.1423 16.5 9 16.5C4.85775 16.5 1.5 13.1423 1.5 9C1.5 4.85775 4.85775 1.5 9 1.5ZM12 8.25H6C5.80109 8.25 5.61032 8.32902 5.46967 8.46967C5.32902 8.61032 5.25 8.80109 5.25 9C5.25 9.19891 5.32902 9.38968 5.46967 9.53033C5.61032 9.67098 5.80109 9.75 6 9.75H12C12.1989 9.75 12.3897 9.67098 12.5303 9.53033C12.671 9.38968 12.75 9.19891 12.75 9C12.75 8.80109 12.671 8.61032 12.5303 8.46967C12.3897 8.32902 12.1989 8.25 12 8.25Z"
        fill="currentColor"
      />
    </svg>
  );
};

NegativeIcon.propTypes = {
  className: PropTypes.string,
};

export {
  DeleteIcon,
  NegativeIcon,
  PersonIcon,
  DislikeIcon,
  LikeIcon,
  GlobeIcon,
  KebabIcon,
  EventIcon,
  Users,
  Settings,
  Search,
  ChevronUp,
  DownIcon,
  ThreeDotsIcon,
  PuzzleIcon,
  CloseIcon,
  ReplyIcon,
  EditIcon,
  LoadingIcon
};
