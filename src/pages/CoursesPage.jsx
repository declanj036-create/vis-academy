import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { BRAND } from '../constants/branding'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceFilter, setPriceFilter] = useState('All')
  const [levelFilter, setLevelFilter] = useState('All')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        setCourses(data)
        setFilteredCourses(data)
      } else {
        // Use placeholders
        const placeholders = BRAND.placeholderCourses.map((course, idx) => ({
          id: `placeholder-${idx}`,
          ...course,
          rating: 4.9,
          students: Math.floor(Math.random() * 500) + 50,
          price: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 100) + 19.99,
          level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
          description: `Master ${course.category} with expert guidance from Sir Victor`
        }))
        setCourses(placeholders)
        setFilteredCourses(placeholders)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = courses

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(c => c.category === selectedCategory)
    }

    // Price filter
    if (priceFilter === 'Free') {
      filtered = filtered.filter(c => !c.price || c.price === 0)
    } else if (priceFilter === 'Paid') {
      filtered = filtered.filter(c => c.price && c.price > 0)
    }

    // Level filter
    if (levelFilter !== 'All') {
      filtered = filtered.filter(c => c.level === levelFilter)
    }

    setFilteredCourses(filtered)
  }, [searchQuery, selectedCategory, priceFilter, levelFilter, courses])

  return (
    <div style={{ backgroundColor: BRAND.colors.black, minHeight: '100vh' }}>
      {/* Header */}
      <section 
        className="px-4 py-12 border-b-[5px]"
        style={{ borderBottomColor: BRAND.colors.gold1 }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 
            className="text-4xl font-bold mb-6 text-white"
            style={{ fontFamily: BRAND.fonts.heading }}
          >
            Explore All Courses
          </h1>

          {/* Search */}
          <div className="relative mb-8">
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ color: BRAND.colors.gold1 }}
              size={20}
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 rounded-[20px] bg-white text-black focus:outline-none"
              style={{ border: `3px solid ${BRAND.colors.gold1}` }}
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-[15px] bg-white text-black"
                style={{ border: `2px solid ${BRAND.colors.gold1}` }}
              >
                <option>All</option>
                {BRAND.categories.map(cat => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Price</label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-[15px] bg-white text-black"
                style={{ border: `2px solid ${BRAND.colors.gold1}` }}
              >
                <option>All</option>
                <option>Free</option>
                <option>Paid</option>
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Level</label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-[15px] bg-white text-black"
                style={{ border: `2px solid ${BRAND.colors.gold1}` }}
              >
                <option>All</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            {/* Results count */}
            <div className="flex items-end">
              <p className="text-white text-sm">
                <span style={{ color: BRAND.colors.gold1 }} className="font-bold">
                  {filteredCourses.length}
                </span>
                {' '}courses found
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="px-4 py-12 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-white text-lg">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Filter size={48} className="mx-auto mb-4 opacity-50" />
            <p>No courses found. Try adjusting your filters.</p>
          </div>
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
                  <span 
                    className="inline-block px-3 py-1 rounded-[10px] text-xs font-bold text-black mb-2"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.colors.goldDark}, ${BRAND.colors.gold2})`
                    }}
                  >
                    {course.level || 'Beginner'}
                  </span>

                  <h3 
                    className="font-bold text-lg mb-2 text-white line-clamp-2"
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
                    <span className="text-gray-300 text-xs">
                      {course.students || 0} students
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span 
                      className="font-bold text-lg"
                      style={{ color: BRAND.colors.gold1 }}
                    >
                      {course.price === 0 || !course.price ? 'FREE' : `$${course.price}`}
                    </span>
                    <button
                      className="px-4 py-2 rounded-[15px] text-black font-semibold text-sm hover:scale-110 transition"
                      style={{
                        background: `linear-gradient(135deg, ${BRAND.colors.goldDark}, ${BRAND.colors.gold2})`
                      }}
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
