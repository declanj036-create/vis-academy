import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Users, Award, Globe } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { BRAND } from '../constants/branding'

export default function HomePage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .limit(8)

      if (error) throw error
      setCourses(data || [])

      // If no courses, use placeholders
      if (!data || data.length === 0) {
        setCourses(BRAND.placeholderCourses.map((course, idx) => ({
          id: `placeholder-${idx}`,
          ...course,
          rating: 4.9,
          students: Math.floor(Math.random() * 500) + 50,
          price: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 100) + 19.99
        })))
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ backgroundColor: BRAND.colors.black }}>
      {/* Hero Section */}
      <section className="px-4 py-20 text-center border-b-[5px]" style={{ borderBottomColor: BRAND.colors.gold1 }}>
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-5xl md:text-6xl font-bold mb-4 text-white"
            style={{ fontFamily: BRAND.fonts.heading }}
          >
            Learn Without Limits
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            From Enugu to the World - Master STEM with Sir Victor
          </p>
          <p 
            className="text-sm font-semibold mb-8"
            style={{ color: BRAND.colors.gold1 }}
          >
            ✓ {BRAND.stats.countries} Countries • {BRAND.stats.students} Students • {BRAND.stats.rating}★ Rating • {BRAND.stats.years} Years
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ color: BRAND.colors.gold1 }}
              size={20}
            />
            <input
              type="text"
              placeholder="What do you want to learn?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-[25px] bg-white text-black focus:outline-none focus:ring-2"
              style={{ 
                border: `3px solid ${BRAND.colors.gold1}`,
                focusRing: BRAND.colors.gold1
              }}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <h2 
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: BRAND.colors.gold1, fontFamily: BRAND.fonts.heading }}
        >
          Explore Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {BRAND.categories.map((category) => (
            <button
              key={category}
              className="py-3 px-4 rounded-[15px] font-semibold text-black transition hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${BRAND.colors.goldDark}, ${BRAND.colors.gold2})`,
                fontFamily: BRAND.fonts.body
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Why VIS Academy */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <h2 
          className="text-3xl font-bold mb-12 text-center"
          style={{ color: BRAND.colors.gold1, fontFamily: BRAND.fonts.heading }}
        >
          Why VIS Academy?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Award, title: 'Expert Instructor', desc: 'Sir Victor - International STEM Tutor' },
            { icon: Globe, title: 'Global Reach', desc: 'Students from 15+ countries' },
            { icon: Star, title: 'Top Rated', desc: '4.9★ Rating from 2000+ students' },
            { icon: Users, title: 'Live Support', desc: 'Direct access via WhatsApp & Meet' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-[20px] text-center"
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                border: `2.5px solid ${BRAND.colors.gold1}`
              }}
            >
              <item.icon 
                className="mx-auto mb-4"
                size={40}
                style={{ color: BRAND.colors.gold1 }}
              />
              <h3 
                className="font-bold mb-2 text-white"
                style={{ fontFamily: BRAND.fonts.heading }}
              >
                {item.title}
              </h3>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <h2 
          className="text-3xl font-bold mb-12 text-center"
          style={{ color: BRAND.colors.gold1, fontFamily: BRAND.fonts.heading }}
        >
          Featured Courses
        </h2>
        
        {loading ? (
          <div className="text-center text-white">Loading courses...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                to={course.id?.toString().startsWith('placeholder') ? '#' : `/course/${course.id}`}
                className="group rounded-[20px] overflow-hidden transition hover:scale-105"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: `2.5px solid ${BRAND.colors.gold1}`
                }}
              >
                {/* Thumbnail */}
                <div className="h-40 bg-gray-700 flex items-center justify-center overflow-hidden">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-2xl font-bold"
                      style={{ 
                        background: `linear-gradient(135deg, ${BRAND.colors.goldDark}, ${BRAND.colors.gold2})`,
                        color: 'black'
                      }}
                    >
                      {course.title[0]}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 
                    className="font-bold text-lg mb-2 text-white"
                    style={{ fontFamily: BRAND.fonts.heading }}
                  >
                    {course.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">{course.instructor || 'Sir Victor'}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          style={{
                            color: i < Math.floor(course.rating || 4.9) ? BRAND.colors.gold1 : '#444',
                            fill: i < Math.floor(course.rating || 4.9) ? BRAND.colors.gold1 : 'none'
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-gray-300 text-xs">{course.students || 0} students</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span 
                      className="font-bold"
                      style={{ color: BRAND.colors.gold1 }}
                    >
                      {course.price === 0 || !course.price ? 'FREE' : `$${course.price}`}
                    </span>
                    <button
                      className="px-3 py-1 rounded-[15px] text-black font-semibold text-sm"
                      style={{
                        background: `linear-gradient(135deg, ${BRAND.colors.goldDark}, ${BRAND.colors.gold2})`
                      }}
                    >
                      Learn
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* International Classrooms */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <h2 
          className="text-3xl font-bold mb-12 text-center"
          style={{ color: BRAND.colors.gold1, fontFamily: BRAND.fonts.heading }}
        >
          Join Our International Classrooms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BRAND.classrooms.map((room) => (
            <a
              key={room.code}
              href={room.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-[20px] text-center group hover:scale-105 transition"
              style={{
                backgroundColor: 'white',
                border: `5px solid ${BRAND.colors.gold1}`
              }}
            >
              <div className="text-5xl mb-3">{room.flag}</div>
              <h3 
                className="text-2xl font-bold text-black mb-2"
                style={{ fontFamily: BRAND.fonts.heading }}
              >
                {room.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">Classroom Code: {room.code}</p>
              <button
                className="px-4 py-2 rounded-[20px] text-white font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.colors.goldDark}, ${BRAND.colors.gold2})`
                }}
              >
                Join Now
              </button>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section 
        className="px-4 py-16 max-w-4xl mx-auto text-center"
        style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: `2.5px solid ${BRAND.colors.gold1}` }}
      >
        <h2 
          className="text-3xl font-bold mb-6"
          style={{ color: BRAND.colors.gold1, fontFamily: BRAND.fonts.heading }}
        >
          Ready to Start Learning?
        </h2>
        <p className="text-white mb-8">Get in touch with us via your preferred channel</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href={`mailto:${BRAND.contact.email1}`}
            className="py-3 px-4 rounded-[20px] font-semibold text-black"
            style={{
              background: `linear-gradient(135deg, ${BRAND.colors.goldDark}, ${BRAND.colors.gold2})`
            }}
          >
            📧 Email Us
          </a>
          <a
            href={BRAND.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-[20px] font-semibold text-black"
            style={{
              background: `linear-gradient(135deg, ${BRAND.colors.goldDark}, ${BRAND.colors.gold2})`
            }}
          >
            💬 WhatsApp
          </a>
          <a
            href={BRAND.contact.googleMeet}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-[20px] font-semibold text-black"
            style={{
              background: `linear-gradient(135deg, ${BRAND.colors.goldDark}, ${BRAND.colors.gold2})`
            }}
          >
            📹 Google Meet
          </a>
        </div>
      </section>
    </div>
  )
}
