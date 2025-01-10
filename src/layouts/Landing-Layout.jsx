import PropTypes from "prop-types";

const LandingLayout = ({ children }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Grid pattern - moved below gradient for better visibility */}
      <div className="fixed inset-0 z-0 opacity-75 [background-image:linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:50px_50px]" />

      {/* Gradient overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 bg-gradient-to-br from-white/80 via-white/90 to-white/80" />

      {/* Content */}
      <div className="relative z-20">{children}</div>

      {/* Footer */}
      <footer className="border-gray-100 fixed bottom-0 z-30 w-full border-t bg-white/80 px-6 py-2 backdrop-blur-sm">
        <p className="text-gray-500 dark:text-gray-400 text-xs font-light">
          Developed by A2K Group Corporation &copy; {currentYear}
        </p>
      </footer>
    </div>
  );
};

LandingLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LandingLayout;
