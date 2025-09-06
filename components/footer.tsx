import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold">PS</span>
              </div>
              <div>
                <div className="font-bold text-xl">Pet</div>
                <div className="font-bold text-xl">Sister</div>
              </div>
            </div>
            <p className="text-blue-200 text-sm">© 2023© 2023 Webtechsolution.in</p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-blue-200 hover:text-white transition-colors">
                  Pet Essentials
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-blue-200 hover:text-white transition-colors">
                  Pet Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-blue-200 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Social Media</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center text-blue-200 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-blue-200 hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-blue-200 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-blue-200 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacts</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-blue-200">
                <Phone className="w-4 h-4 mr-2" />
                <div>
                  <div>SDT</div>
                  <div>SDT</div>
                </div>
              </li>
              <li className="flex items-center text-blue-200">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </li>
              <li className="flex items-center text-blue-200">
                <MapPin className="w-4 h-4 mr-2" />
                Địa chỉ
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-blue-200 text-sm">
            <Link href="/privacy" className="hover:text-white mr-4">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
