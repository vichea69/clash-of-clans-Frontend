export const BackToTopButton = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <button
      onClick={handleScrollToTop}
      className="fixed bottom-4 right-4 p-3 bg-primary text-primary-foreground rounded-full shadow-lg transition-all duration-300 hover:bg-primary/90 active:scale-95"
      aria-label="Back to top"
      style={{
        opacity: window.scrollY > 300 ? 1 : 0,
        transform: window.scrollY > 300 ? "translateY(0)" : "translateY(10px)",
        pointerEvents: window.scrollY > 300 ? "auto" : "none",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 2.33331L7 11.6666"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.33334 7L7.00001 2.33333L11.6667 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};
