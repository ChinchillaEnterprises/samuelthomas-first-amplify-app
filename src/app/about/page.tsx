"use client";

import Link from "next/link";
import { MapPin, Clock, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b-4 border-orange-400" style={{fontFamily: 'Georgia, serif'}}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-18 py-2">
            <Link href="/" className="text-3xl font-bold text-orange-600" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.1)'}}>
              Dollar World Carmel
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-orange-600 transition font-medium text-lg">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 transition font-medium text-lg">About Us</Link>
              <Link href="/products" className="text-gray-700 hover:text-orange-600 transition font-medium text-lg">Our Aisles</Link>
              <Link href="/new-items" className="text-gray-700 hover:text-orange-600 transition font-medium text-lg">New Arrivals</Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition font-medium text-lg">Visit Us</Link>
            </div>
            <button className="md:hidden">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <section className="bg-gradient-to-b from-yellow-50 to-orange-100 py-16 border-b-4 border-orange-300">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6" style={{fontFamily: 'Georgia, serif'}}>
            Our Story
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            A family business serving our Carmel neighbors with pride and a smile!
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white border-b-4 border-yellow-300">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="bg-orange-50 rounded-lg p-8 border-4 border-orange-200 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center" style={{fontFamily: 'Georgia, serif'}}>
                  Our Heart & Mission
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  We opened Dollar World because we believe every family in Carmel deserves access to 
                  quality everyday items without breaking the bank. This isn't just a business to us - 
                  it's our way of taking care of our neighbors!
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  When times got tough and Putnam County needed face masks, we didn't hesitate. 
                  We became the trusted supplier our community could count on - because that's what 
                  neighbors do for each other.
                </p>
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">What Makes Us Special</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-3 font-bold text-lg">•</span>
                      <span className="text-gray-700">Over a decade serving Carmel families</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-3 font-bold text-lg">•</span>
                      <span className="text-gray-700">Well-organized aisles - easy shopping!</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-3 font-bold text-lg">•</span>
                      <span className="text-gray-700">Personal service with a genuine smile</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-3 font-bold text-lg">•</span>
                      <span className="text-gray-700">Convenient location with free parking</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-8 border-4 border-green-200 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center" style={{fontFamily: 'Georgia, serif'}}>
                  What You'll Find Here
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="text-orange-600 mr-4 font-bold text-2xl">•</div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg mb-2">Party Supplies</h4>
                      <p className="text-gray-700">Everything to make your celebrations special - birthdays, holidays, you name it!</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-orange-600 mr-4 font-bold text-2xl">•</div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg mb-2">Home Essentials</h4>
                      <p className="text-gray-700">Cleaning supplies, kitchen helpers, and all the daily necessities</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-orange-600 mr-4 font-bold text-2xl">•</div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg mb-2">Health & Safety</h4>
                      <p className="text-gray-700">Face masks, hand sanitizer, and personal care items</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-orange-600 mr-4 font-bold text-2xl">•</div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg mb-2">School & Office</h4>
                      <p className="text-gray-700">Notebooks, pens, art supplies, and desk accessories</p>
                    </div>
                  </div>
                  <div className="text-center mt-8 p-4 bg-white rounded-lg border-2 border-green-300">
                    <p className="text-gray-600 font-medium">And so much more across our friendly aisles!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-b from-yellow-50 to-orange-50 border-b-4 border-orange-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Georgia, serif'}}>
              What We Believe In
            </h2>
            <p className="text-xl text-gray-600">These aren't just words to us - they're how we live every day!</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center bg-white p-6 rounded-lg border-3 border-blue-200 shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-2xl">•</span>
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">Community First</h3>
              <p className="text-gray-600">We're not just a business - we're your neighbors supporting local families!</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg border-3 border-pink-200 shadow-lg">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-pink-600 font-bold text-2xl">•</span>
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">Caring Service</h3>
              <p className="text-gray-600">Every customer gets a warm welcome and help finding exactly what they need</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg border-3 border-green-200 shadow-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-2xl">•</span>
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">Quality Promise</h3>
              <p className="text-gray-600">We only sell products we'd be happy to use in our own homes</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg border-3 border-yellow-200 shadow-lg">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-600 font-bold text-2xl">•</span>
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">Fair Prices</h3>
              <p className="text-gray-600">Great value every day - because everyone deserves to save money!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Store Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Georgia, serif'}}>
                Come Visit Us Today!
              </h2>
              <p className="text-xl text-gray-600">We're easy to find and always happy to see you!</p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-12 border-4 border-orange-200 shadow-lg">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 mb-3">Where We Are</h3>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    US RT 6 - 1850 Putnam Plaza<br />
                    Carmel, NY 10512
                  </p>
                  <p className="text-gray-600 text-sm mt-2">Right in Putnam Plaza - easy to spot!</p>
                </div>
                <div>
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 mb-3">When We're Here</h3>
                  <div className="text-gray-700 font-medium">
                    <p className="mb-2"><strong>Monday - Saturday:</strong><br />9:00 AM - 9:00 PM</p>
                    <p><strong>Sunday:</strong><br />9:00 AM - 7:00 PM</p>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">Open every day to serve you!</p>
                </div>
                <div>
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 mb-3">Say Hello!</h3>
                  <p className="text-gray-700 mb-4">Follow us on Facebook for updates and see what's new in the store</p>
                  <Link href="/contact" className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg">
                    Get Directions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-600 text-white py-12 border-t-4 border-orange-700">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-6 text-yellow-200" style={{fontFamily: 'Georgia, serif'}}>
                Dollar World Carmel
              </h3>
              <p className="text-orange-100 leading-relaxed">
                Your friendly neighborhood dollar store! We've been proudly serving families in 
                Carmel, NY with a smile and great prices since we opened our doors.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-orange-100 hover:text-white transition">Home</Link></li>
                <li><Link href="/about" className="text-orange-100 hover:text-white transition">About Us</Link></li>
                <li><Link href="/products" className="text-orange-100 hover:text-white transition">Our Aisles</Link></li>
                <li><Link href="/contact" className="text-orange-100 hover:text-white transition">Visit Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">When We're Open</h4>
              <div className="text-orange-100 space-y-2">
                <p className="font-semibold">Monday - Saturday</p>
                <p>9:00 AM - 9:00 PM</p>
                <p className="font-semibold mt-4">Sunday</p>
                <p>9:00 AM - 7:00 PM</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Come See Us!</h4>
              <div className="text-orange-100 space-y-2">
                <p>US RT 6 - 1850 Putnam Plaza</p>
                <p>Carmel, NY 10512</p>
              </div>
            </div>
          </div>
          <div className="border-t border-orange-500 mt-8 pt-8 text-center">
            <p className="text-orange-100">&copy; 2024 Dollar World Carmel - Made with ❤️ for our community!</p>
          </div>
        </div>
      </footer>
    </div>
  );
}