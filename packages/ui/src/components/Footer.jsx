export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Cartify</h2>
          <p className="text-sm leading-relaxed">
            Your one-stop destination for smart shopping. Quality products, fast
            delivery, and seamless experience.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Shipping
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-white transition">
              🌐
            </a>
            <a href="#" className="hover:text-white transition">
              📘
            </a>
            <a href="#" className="hover:text-white transition">
              📸
            </a>
            <a href="#" className="hover:text-white transition">
              🐦
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 text-center py-4 text-sm">
        © {new Date().getFullYear()} Cartify. All rights reserved.
      </div>
    </footer>
  );
}
