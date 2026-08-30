export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-6 mt-12">
      <div className="container mx-auto px-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        <p className="text-xs text-gray-400 mt-2">Built with React & Tailwind CSS</p>
      </div>
    </footer>
  );
}
