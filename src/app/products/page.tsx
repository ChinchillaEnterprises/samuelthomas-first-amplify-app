"use client";

import Link from "next/link";
import { Package, Gift, Home, Sparkles, Sun, Heart, ShoppingBag, Tag, Utensils, Shirt, Book, Lightbulb, Baby, ArrowRight, ShieldCheck } from "lucide-react";

export default function ProductsPage() {
  const aisles = [
    {
      number: 1,
      items: ["Christmas decorations", "Kitchen utensils", "Assorted toys"],
      icon: Sparkles,
      color: "bg-red-400",
      lightColor: "bg-red-50"
    },
    {
      number: 2,
      items: ["Christmas/New Year party supplies", "Holiday kitchen items", "Greeting cards"],
      icon: Gift,
      color: "bg-green-400",
      lightColor: "bg-green-50"
    },
    {
      number: 3,
      items: ["Picture frames", "Candles", "Special occasion items"],
      icon: Home,
      color: "bg-purple-400",
      lightColor: "bg-purple-50"
    },
    {
      number: 4,
      items: ["Glassware", "Beauty products", "Kitchen items", "Ceramic figures", "Cards"],
      icon: Heart,
      color: "bg-pink-400",
      lightColor: "bg-pink-50"
    },
    {
      number: 5,
      items: ["Ceramic figures", "Handbags", "Medical supplies", "Cleaning supplies"],
      icon: ShoppingBag,
      color: "bg-indigo-400",
      lightColor: "bg-indigo-50"
    },
    {
      number: 6,
      items: ["Laundry detergent", "Cleaning supplies", "Plastics", "Hangers", "Key chains"],
      icon: Home,
      color: "bg-teal-400",
      lightColor: "bg-teal-50"
    },
    {
      number: 7,
      items: ["Sponges", "Cleaning utensils", "Winter apparel", "Caps", "CDs"],
      icon: Shirt,
      color: "bg-cyan-400",
      lightColor: "bg-cyan-50"
    },
    {
      number: 8,
      items: ["Chips", "Cookies", "Crackers", "Cereal", "Coffee", "Candy"],
      icon: ShoppingBag,
      color: "bg-orange-400",
      lightColor: "bg-orange-50"
    },
    {
      number: 9,
      items: ["Sauces", "Soda", "Herbs", "Spices", "Pasta"],
      icon: Utensils,
      color: "bg-yellow-400",
      lightColor: "bg-yellow-50"
    },
    {
      number: 10,
      items: ["Dish rags", "Doilies", "Placemats", "CDs/DVDs", "Light bulbs", "Hardware", "Razors"],
      icon: Lightbulb,
      color: "bg-gray-400",
      lightColor: "bg-gray-50"
    },
    {
      number: 11,
      items: ["Hair accessories", "Personal care items", "Baby supplies", "Belts", "Scarves", "Socks"],
      icon: Baby,
      color: "bg-rose-400",
      lightColor: "bg-rose-50"
    },
    {
      number: 12,
      items: ["Books", "Pens", "Pencils", "Markers", "Notebooks", "School supplies"],
      icon: Book,
      color: "bg-emerald-400",
      lightColor: "bg-emerald-50"
    },
    {
      number: 13,
      items: ["Party supplies", "Gift items", "Tablecloths", "Curtains", "Pillow shams", "Home textiles"],
      icon: Gift,
      color: "bg-violet-400",
      lightColor: "bg-violet-50"
    }
  ];

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
            Browse Our 13 Aisles
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Everything organized just the way you like it - easy to find, great prices every day!
          </p>
        </div>
      </section>

      {/* Store Layout Info */}
      <section className="bg-orange-400 text-white py-6 border-b-4 border-orange-500">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Tag className="w-8 h-8" />
              <h2 className="text-2xl font-bold">13 Well-Organized Aisles</h2>
            </div>
            <p className="text-xl text-orange-100">
              Use this handy guide to find exactly what you're looking for!
            </p>
          </div>
        </div>
      </section>

      {/* Aisles Layout */}
      <section className="py-16 bg-white border-b-4 border-yellow-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Georgia, serif'}}>
              What's in Each Aisle
            </h2>
            <p className="text-xl text-gray-600">
              No more wandering around - find what you need fast!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {aisles.map((aisle) => {
              const Icon = aisle.icon;
              return (
                <div key={aisle.number} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition border-3 border-gray-200">
                  <div className={`${aisle.lightColor} p-6 rounded-t-lg border-b-3 border-gray-200`}>
                    <div className="flex items-center justify-center mb-4">
                      <div className={`${aisle.color} p-3 rounded-lg mr-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800" style={{fontFamily: 'Georgia, serif'}}>
                        Aisle {aisle.number}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-2">
                      {aisle.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start text-gray-700">
                          <span className="text-orange-600 mr-3 mt-1 font-bold">•</span>
                          <span className="capitalize font-medium text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="py-16 bg-gradient-to-b from-yellow-50 to-orange-50 border-b-4 border-orange-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Georgia, serif'}}>
              Quick Shopping Guide
            </h2>
            <p className="text-xl text-gray-600">Looking for something specific? Here's where to find it!</p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-lg border-3 border-blue-200">
                <div className="bg-blue-100 p-3 rounded-lg w-fit mx-auto mb-6">
                  <Gift className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-6 text-gray-800 text-center" style={{fontFamily: 'Georgia, serif'}}>
                  Holiday & Party Items
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-blue-600 mb-1">Aisle 1</p>
                    <p className="text-gray-700 text-sm">Christmas decorations</p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-600 mb-1">Aisle 2</p>
                    <p className="text-gray-700 text-sm">Party supplies & greeting cards</p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-600 mb-1">Aisle 13</p>
                    <p className="text-gray-700 text-sm">Gift items & home textiles</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg border-3 border-green-200">
                <div className="bg-green-100 p-3 rounded-lg w-fit mx-auto mb-6">
                  <Utensils className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold mb-6 text-gray-800 text-center" style={{fontFamily: 'Georgia, serif'}}>
                  Food & Snacks
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-green-600 mb-1">Aisle 8</p>
                    <p className="text-gray-700 text-sm">Snacks, coffee, candy</p>
                  </div>
                  <div>
                    <p className="font-bold text-green-600 mb-1">Aisle 9</p>
                    <p className="text-gray-700 text-sm">Sauces, soda, spices</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg border-3 border-purple-200">
                <div className="bg-purple-100 p-3 rounded-lg w-fit mx-auto mb-6">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-6 text-gray-800 text-center" style={{fontFamily: 'Georgia, serif'}}>
                  Health & Beauty
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-purple-600 mb-1">Aisle 4</p>
                    <p className="text-gray-700 text-sm">Beauty products</p>
                  </div>
                  <div>
                    <p className="font-bold text-purple-600 mb-1">Aisle 5</p>
                    <p className="text-gray-700 text-sm">Medical supplies</p>
                  </div>
                  <div>
                    <p className="font-bold text-purple-600 mb-1">Aisle 11</p>
                    <p className="text-gray-700 text-sm">Personal care items</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg border-3 border-orange-200">
                <div className="bg-orange-100 p-3 rounded-lg w-fit mx-auto mb-6">
                  <Home className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold mb-6 text-gray-800 text-center" style={{fontFamily: 'Georgia, serif'}}>
                  Household Essentials
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-orange-600 mb-1">Aisles 5-6</p>
                    <p className="text-gray-700 text-sm">Cleaning supplies</p>
                  </div>
                  <div>
                    <p className="font-bold text-orange-600 mb-1">Aisle 10</p>
                    <p className="text-gray-700 text-sm">Light bulbs & hardware</p>
                  </div>
                  <div>
                    <p className="font-bold text-orange-600 mb-1">Aisle 13</p>
                    <p className="text-gray-700 text-sm">Home textiles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Georgia, serif'}}>
              Special Services We Offer
            </h2>
            <p className="text-xl text-gray-600">More than just shopping - we're here to help!</p>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-xl p-8 border-4 border-blue-200 shadow-lg">
              <div className="bg-blue-400 p-4 rounded-lg w-fit mb-6">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800" style={{fontFamily: 'Georgia, serif'}}>
                Face Mask Supplier
              </h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Your trusted local source for quality face masks throughout Putnam County. 
                We carry disposable, reusable, and specialty masks to keep our community safe and healthy.
              </p>
              <p className="text-sm font-medium text-blue-600">Find our safety supplies in Aisles 4, 5, and 11</p>
            </div>
            <div className="bg-green-50 rounded-xl p-8 border-4 border-green-200 shadow-lg">
              <div className="bg-green-400 p-4 rounded-lg w-fit mb-6">
                <Gift className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800" style={{fontFamily: 'Georgia, serif'}}>
                Party Planning Help
              </h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Planning a birthday party or special celebration? Our friendly staff knows where 
                everything is and can help you find all the supplies you need in one trip.
              </p>
              <p className="text-sm font-medium text-green-600">Party supplies in Aisles 1, 2, and 13</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-400 text-white border-t-4 border-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6" style={{fontFamily: 'Georgia, serif'}}>
            Come Shop With Us Today!
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            New items arrive weekly, and our friendly staff is always happy to help you find 
            exactly what you're looking for. Experience the Dollar World difference!
          </p>
          <Link href="/contact" className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-orange-50 transition text-lg shadow-lg inline-flex items-center">
            Get Directions to Our Store
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
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
              <h4 className="font-bold text-lg mb-6">Contact Info</h4>
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