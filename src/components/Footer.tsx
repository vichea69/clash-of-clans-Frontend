const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-center gap-2 text-sm text-gray-400 dark:text-gray-400 mt-8 mb-6">
      <p>
        Built with 💝 From{" "}
        <button className="appearance-none text-pink-500 text-sm px-1 py-0.5 rounded hover:bg-pink-500/10 focus:bg-pink-500/15 transition-colors">
          CHEA
        </button>
      </p>
      <figure
        className="overflow-hidden -collpasable"
        style={{ width: "144px", height: "0px" }}
      >
        {/* Empty figure element */}
      </figure>
    </footer>
  );
};

export default Footer;
