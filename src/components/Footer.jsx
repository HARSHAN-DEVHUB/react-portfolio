const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-400 text-center py-6 text-sm">
      <p>© {year} Harshan. All rights reserved.</p>
      <p>
        Hand crafted By <a href="https://github.com/HARSHAN-DEVHUB" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Harshan</a>
      </p>
    </footer>
  );
};

export default Footer;
