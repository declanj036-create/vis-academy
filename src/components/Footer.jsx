import { Mail, Phone, MessageCircle, Video } from 'lucide-react'
import { BRAND } from '../constants/branding'

export default function Footer() {
  return (
    <footer 
      className="bg-black border-t-[5px] py-12 px-4"
      style={{ borderTopColor: BRAND.colors.gold1 }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h4 className="font-bold text-lg mb-4" style={{ 
            fontFamily: BRAND.fonts.heading,
            color: BRAND.colors.gold1 
          }}>
            VIS ACADEMY
          </h4>
          <p className="text-white text-sm mb-4">
            {BRAND.tagline}
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-gray-300">
              <span style={{ color: BRAND.colors.gold1 }}>Founder:</span> {BRAND.founder}
            </p>
            <p className="text-gray-300">
              <span style={{ color: BRAND.colors.gold1 }}>Reach:</span> {BRAND.stats.countries} Countries
            </p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-lg mb-4" style={{ 
            fontFamily: BRAND.fonts.heading,
            color: BRAND.colors.gold1 
          }}>
            Contact
          </h4>
          <div className="space-y-3 text-sm">
            <a href={`mailto:${BRAND.contact.email1}`} className="flex items-center gap-2 text-white hover:text-gold1 transition">
              <Mail size={16} style={{ color: BRAND.colors.gold1 }} />
              {BRAND.contact.email1}
            </a>
            <a href={`tel:${BRAND.contact.phoneUSA}`} className="flex items-center gap-2 text-white hover:text-gold1 transition">
              <Phone size={16} style={{ color: BRAND.colors.gold1 }} />
              {BRAND.contact.phoneUSA}
            </a>
            <a href={BRAND.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-gold1 transition">
              <MessageCircle size={16} style={{ color: BRAND.colors.gold1 }} />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Classrooms */}
        <div>
          <h4 className="font-bold text-lg mb-4" style={{ 
            fontFamily: BRAND.fonts.heading,
            color: BRAND.colors.gold1 
          }}>
            Classrooms
          </h4>
          <div className="space-y-2 text-sm">
            {BRAND.classrooms.slice(0, 3).map((room) => (
              <a
                key={room.code}
                href={room.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gold1 transition block"
              >
                {room.flag} {room.name}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-lg mb-4" style={{ 
            fontFamily: BRAND.fonts.heading,
            color: BRAND.colors.gold1 
          }}>
            Links
          </h4>
          <div className="space-y-2 text-sm">
            <a href="/" className="text-white hover:text-gold1 transition block">Home</a>
            <a href="/courses" className="text-white hover:text-gold1 transition block">Courses</a>
            <a href="/dashboard" className="text-white hover:text-gold1 transition block">Dashboard</a>
            <a href={BRAND.contact.googleMeet} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-gold1 transition">
              <Video size={16} style={{ color: BRAND.colors.gold1 }} />
              Google Meet
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div 
        className="border-t mt-8 pt-8 text-center text-gray-400 text-sm"
        style={{ borderTopColor: BRAND.colors.gold1 }}
      >
        <p>© 2024 VIS ACADEMY. Learn Without Limits - From Enugu to the World.</p>
        <p className="mt-2" style={{ color: BRAND.colors.gold1 }}>
          Trusted by students in {BRAND.stats.countries} countries • {BRAND.stats.students} students • {BRAND.stats.rating}★ rating
        </p>
      </div>
    </footer>
  )
}
