"use client";

import { MapPin, Clock, Phone, ShoppingBag, Star, Package, Heart, ArrowRight, CheckCircle, Smile } from "lucide-react";
import Link from "next/link";

export default function Home() {
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-yellow-50 to-orange-100 py-16 border-b-4 border-orange-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <span className="text-6xl">🛒</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6" style={{fontFamily: 'Georgia, serif'}}>
              Welcome to Your Neighborhood <br/>
              <span className="text-orange-600">Dollar World!</span>
            </h1>
            <p className="text-xl text-gray-700 mb-4 font-medium">Family-owned and proud to serve Carmel, NY</p>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              For over a decade, we've been your friendly neighbors providing quality products 
              at prices that don't break the bank. Come see why families choose us again and again!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-600 transition text-lg shadow-lg border-2 border-orange-600">
                Browse Our Aisles
              </Link>
              <Link href="/contact" className="bg-white border-3 border-orange-500 text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-orange-50 transition text-lg shadow-md">
                Come Visit Us!
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Store Info Bar */}
      <section className="bg-orange-400 text-white py-6 border-b-4 border-orange-500">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center bg-orange-500 rounded-lg p-4 mx-4">
              <MapPin className="w-8 h-8 mb-2" />
              <h3 className="font-bold text-lg mb-2">Find Us Here!</h3>
              <p className="text-orange-100">US RT 6 - 1850 Putnam Plaza<br />Carmel, NY 10512</p>
            </div>
            <div className="flex flex-col items-center bg-orange-500 rounded-lg p-4 mx-4">
              <Clock className="w-8 h-8 mb-2" />
              <h3 className="font-bold text-lg mb-2">We're Open</h3>
              <p className="text-orange-100">Mon-Sat: 9AM-9PM<br />Sunday: 9AM-7PM</p>
            </div>
            <div className="flex flex-col items-center bg-orange-500 rounded-lg p-4 mx-4">
              <Smile className="w-8 h-8 mb-2" />
              <h3 className="font-bold text-lg mb-2">Friendly Service</h3>
              <p className="text-orange-100">Personal attention<br />from people who care!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-b-4 border-yellow-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Georgia, serif'}}>
              Why Our Neighbors Love Shopping Here
            </h2>
            <p className="text-xl text-gray-600">We're more than a store - we're part of your community!</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200 shadow-md">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="font-bold text-lg text-gray-800 mb-3">Prices You'll Love</h3>
              <p className="text-gray-600">Everything you need without the big store prices - that's our promise!</p>
            </div>
            <div className="text-center bg-green-50 p-6 rounded-lg border-2 border-green-200 shadow-md">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="font-bold text-lg text-gray-800 mb-3">Quality You Trust</h3>
              <p className="text-gray-600">We hand-pick items we'd use in our own homes - only the best for our neighbors!</p>
            </div>
            <div className="text-center bg-blue-50 p-6 rounded-lg border-2 border-blue-200 shadow-md">
              <div className="text-5xl mb-4">🗂️</div>
              <h3 className="font-bold text-lg text-gray-800 mb-3">Easy to Find Everything</h3>
              <p className="text-gray-600">Well-organized aisles - no hunting around huge stores. In and out in minutes!</p>
            </div>
            <div className="text-center bg-pink-50 p-6 rounded-lg border-2 border-pink-200 shadow-md">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="font-bold text-lg text-gray-800 mb-3">Local & Personal</h3>
              <p className="text-gray-600">We know our customers by name and care about our Carmel community!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gradient-to-b from-yellow-50 to-orange-50 border-b-4 border-orange-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Georgia, serif'}}>
              Popular with Our Customers
            </h2>
            <p className="text-xl text-gray-600">Here's what folks are always coming in for!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-3 border-purple-300 hover:shadow-xl transition">
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-8 text-center text-white">
                <div className="text-6xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold">Party Time!</h3>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg text-gray-800 mb-3">Everything for Your Celebrations</h4>
                <ul className="text-gray-600 mb-6 space-y-2">
                  <li className="flex items-center">• Balloons & decorations</li>
                  <li className="flex items-center">• Party favors & gift bags</li>
                  <li className="flex items-center">• Greeting cards for every occasion</li>
                </ul>
                <p className="text-sm text-gray-500 mb-4 font-medium">Find in Aisles 1, 2, and 13</p>
                <Link href="/products" className="text-orange-600 font-bold hover:text-orange-700 inline-flex items-center">
                  Shop Party Supplies →
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-3 border-green-300 hover:shadow-xl transition">
              <div className="bg-gradient-to-br from-green-400 to-blue-400 p-8 text-center text-white">
                <div className="text-6xl mb-3">🏠</div>
                <h3 className="text-2xl font-bold">Home Essentials</h3>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg text-gray-800 mb-3">Daily Necessities</h4>
                <ul className="text-gray-600 mb-6 space-y-2">
                  <li className="flex items-center">• Cleaning supplies</li>
                  <li className="flex items-center">• Kitchen helpers</li>
                  <li className="flex items-center">• Storage solutions</li>
                </ul>
                <p className="text-sm text-gray-500 mb-4 font-medium">Find in Aisles 3-7, 10, 13</p>
                <Link href="/products" className="text-orange-600 font-bold hover:text-orange-700 inline-flex items-center">
                  Shop Home Items →
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-3 border-red-300 hover:shadow-xl transition">
              <div className="bg-gradient-to-br from-red-400 to-orange-400 p-8 text-center text-white">
                <div className="text-6xl mb-3">💄</div>
                <h3 className="text-2xl font-bold">Health & Beauty</h3>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg text-gray-800 mb-3">Personal Care</h4>
                <ul className="text-gray-600 mb-6 space-y-2">
                  <li className="flex items-center">• Face masks & safety</li>
                  <li className="flex items-center">• Beauty essentials</li>
                  <li className="flex items-center">• First aid supplies</li>
                </ul>
                <p className="text-sm text-gray-500 mb-4 font-medium">Find in Aisles 4, 5, 11</p>
                <Link href="/products" className="text-orange-600 font-bold hover:text-orange-700 inline-flex items-center">
                  Shop Health & Beauty →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Message */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-orange-50 rounded-2xl p-12 border-4 border-orange-200 shadow-lg">
            <div className="text-6xl mb-6">😷</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Georgia, serif'}}>
              Your Trusted Mask Supplier During Tough Times
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              When Putnam County needed face masks, we were here for you. We're still your go-to 
              place for quality masks and safety supplies - because taking care of our community 
              is what we do best! 
            </p>
            <div className="flex justify-center">
              <Link href="/products" className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg">
                See Our Safety Products
              </Link>
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
                <div className="mt-6">
                  <a 
                    href="https://www.facebook.com/Dollar-World-107809104332153/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-yellow-200 hover:text-yellow-100 transition inline-flex items-center font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Like us on Facebook!
                  </a>
                </div>
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