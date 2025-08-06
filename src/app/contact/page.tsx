"use client";

import Link from "next/link";
import { MapPin, Clock, Phone, Mail, Car, ArrowRight, CheckCircle, Smile } from "lucide-react";

export default function ContactPage() {
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
            Come Visit Us!
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We'd love to see you! Here's everything you need to find us and plan your visit.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-white border-b-4 border-yellow-300">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-12" style={{fontFamily: 'Georgia, serif'}}>
                  Store Information
                </h2>
                
                <div className="space-y-8">
                  <div className="bg-orange-50 rounded-lg p-8 border-4 border-orange-200 shadow-lg">
                    <div className="flex items-start">
                      <div className="bg-orange-400 p-4 rounded-lg mr-6">
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl text-gray-800 mb-3" style={{fontFamily: 'Georgia, serif'}}>
                          Where to Find Us
                        </h3>
                        <p className="text-lg text-gray-700 mb-4 font-medium">
                          US RT 6 - 1850 Putnam Plaza<br />
                          Carmel, NY 10512
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          We're right in Putnam Plaza on Route 6 - easy to spot and plenty of 
                          free parking right out front!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-8 border-4 border-blue-200 shadow-lg">
                    <div className="flex items-start">
                      <div className="bg-blue-400 p-4 rounded-lg mr-6">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl text-gray-800 mb-3" style={{fontFamily: 'Georgia, serif'}}>
                          When We're Open
                        </h3>
                        <div className="text-lg text-gray-700 space-y-3 mb-4">
                          <div className="flex justify-between items-center bg-white p-3 rounded border-2 border-blue-100">
                            <span className="font-semibold">Monday - Saturday:</span>
                            <span className="font-bold text-blue-600">9:00 AM - 9:00 PM</span>
                          </div>
                          <div className="flex justify-between items-center bg-white p-3 rounded border-2 border-blue-100">
                            <span className="font-semibold">Sunday:</span>
                            <span className="font-bold text-blue-600">9:00 AM - 7:00 PM</span>
                          </div>
                        </div>
                        <p className="text-gray-600">
                          Open every single day to serve our community!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-8 border-4 border-green-200 shadow-lg">
                    <div className="flex items-start">
                      <div className="bg-green-400 p-4 rounded-lg mr-6">
                        <Car className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl text-gray-800 mb-3" style={{fontFamily: 'Georgia, serif'}}>
                          Easy Parking & Access
                        </h3>
                        <ul className="text-lg text-gray-700 space-y-3">
                          <li className="flex items-center bg-white p-3 rounded border-2 border-green-100">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>Free parking in Putnam Plaza</span>
                          </li>
                          <li className="flex items-center bg-white p-3 rounded border-2 border-green-100">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>Wheelchair accessible entrance</span>
                          </li>
                          <li className="flex items-center bg-white p-3 rounded border-2 border-green-100">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>Close to the main road - easy in, easy out</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-pink-50 rounded-lg p-8 border-4 border-pink-200 shadow-lg">
                    <div className="flex items-start">
                      <div className="bg-pink-400 p-4 rounded-lg mr-6">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl text-gray-800 mb-3" style={{fontFamily: 'Georgia, serif'}}>
                          Stay Connected
                        </h3>
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                          Follow us on Facebook to see what's new in the store, special deals, 
                          and updates about our community events!
                        </p>
                        <a 
                          href="https://www.facebook.com/Dollar-World-107809104332153/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-pink-400 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-500 transition shadow-lg"
                        >
                          Like Us on Facebook
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map and Directions */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-12" style={{fontFamily: 'Georgia, serif'}}>
                  How to Find Us
                </h2>
                
                <div className="bg-white rounded-xl shadow-lg border-4 border-gray-200 overflow-hidden mb-8">
                  <div className="bg-gray-100 h-80 flex items-center justify-center border-b-4 border-gray-300">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-xl font-semibold text-gray-600 mb-4">Interactive Map</p>
                      <p className="text-gray-500 mb-6">
                        Click the button below for turn-by-turn directions
                      </p>
                      <a 
                        href="https://www.google.com/maps/search/?api=1&query=US+RT+6+-+1850+Putnam+Plaza,+Carmel,+NY+10512"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition inline-flex items-center shadow-lg"
                      >
                        Get Directions on Google Maps
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-8 border-4 border-blue-200 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6" style={{fontFamily: 'Georgia, serif'}}>
                    Driving Directions
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border-3 border-blue-100">
                      <h4 className="font-bold text-lg text-gray-800 mb-3">From Route 6:</h4>
                      <p className="text-gray-700 leading-relaxed">
                        We're located directly on US Route 6 in the Putnam Plaza shopping center. 
                        Look for our Dollar World sign in the plaza - we're easy to find with plenty of parking spaces!
                      </p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg border-3 border-blue-100">
                      <h4 className="font-bold text-lg text-gray-800 mb-4">Nearby Landmarks:</h4>
                      <ul className="text-gray-700 space-y-3">
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span>Right in Putnam Plaza Shopping Center</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span>Near other shops and restaurants</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span>Easy highway access from I-84 and Route 52</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span>Just a few minutes from downtown Carmel</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Visit Section */}
      <section className="py-16 bg-gradient-to-b from-yellow-50 to-orange-50 border-b-4 border-orange-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Georgia, serif'}}>
              Why Our Customers Keep Coming Back
            </h2>
            <p className="text-xl text-gray-600">Here's what makes Dollar World special!</p>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center border-4 border-yellow-200">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Georgia, serif'}}>
                Everything You Need
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Well-organized aisles with everything from party supplies to household essentials. 
                No more driving all over town!
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center border-4 border-green-200">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Georgia, serif'}}>
                Prices That Make Sense
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Quality products at dollar store prices that fit every family's budget. 
                Great value every single day!
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center border-4 border-blue-200">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smile className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Georgia, serif'}}>
                Personal Service
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Friendly staff who know the community and are always happy to help you 
                find exactly what you're looking for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-400 text-white border-t-4 border-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6" style={{fontFamily: 'Georgia, serif'}}>
            We Can't Wait to See You!
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Come experience the Dollar World difference - great prices, friendly service, 
            and everything you need right here in the heart of Carmel, NY
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=US+RT+6+-+1850+Putnam+Plaza,+Carmel,+NY+10512"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-orange-50 transition text-lg inline-flex items-center justify-center shadow-lg"
            >
              Get Directions
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <Link href="/products" className="border-3 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition text-lg">
              See What We Have in Stock
            </Link>
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
              <h4 className="font-bold text-lg mb-6">Store Hours</h4>
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