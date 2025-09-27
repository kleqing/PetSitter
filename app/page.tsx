import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Star, Heart, Shield, Clock, Award, Users, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-100 to-orange-200 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400 rounded-full opacity-60"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-orange-300 rounded-full opacity-40"></div>
          <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-orange-500 rounded-full opacity-30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-orange-500 text-white">Affordable High-Quality Pet Services & Essentials</Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Affordable High-Quality Pet Services & Essentials
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you're grooming, walking, sitting, or scheduling a ride — our pet service partners are here to
                help. We've built a trusted network of certified providers to make your life easier and your pet's life
                happier.
              </p>
              <Link href="/services">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Book Appointment
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img src="/happy-pets.png" alt="Happy pets" className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Top Rated Services</h2>
            <Link href="/services" className="text-blue-600 hover:text-blue-700 font-medium">
              View All Services
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Pet Sitting",
                description: "Professional pet sitting services in your home",
                icon: "🏠",
                image: "/pet-sitter-dog.png",
              },
              {
                title: "Dog Walking",
                description: "Daily walks to keep your dog healthy and happy",
                icon: "🚶",
                image: "/person-walking-dog.png",
              },
              {
                title: "Pet Grooming",
                description: "Complete grooming services for all pets",
                icon: "✂️",
                image: "/pet-grooming-salon.png",
              },
              {
                title: "Pet Taxi",
                description: "Safe transportation for your pets",
                icon: "🚗",
                image: "/pet-taxi.png",
              },
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why We're The Top Choice */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/veterinarian-examining-pet.png"
                alt="Pet care professional"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Why We're The Top Choice For Pet Services & Product</h2>
              <div className="space-y-4">
                {[
                  "Licensed and Insured Professionals",
                  "24/7 Customer Support",
                  "Satisfaction Guarantee",
                  "Affordable Pricing",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/services">
                <Button className="bg-blue-600 hover:bg-blue-700">Book Appointment</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick and Easy Booking */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Quick and Easy Booking in 3 Simple Steps!</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Select Service & Provider",
                description: "Choose from our verified pet care professionals",
                icon: <Users className="w-12 h-12 text-blue-600" />,
              },
              {
                step: "2",
                title: "Book Your Day",
                description: "Pick a convenient time that works for you",
                icon: <Clock className="w-12 h-12 text-blue-600" />,
              },
              {
                step: "3",
                title: "Pay Safely",
                description: "Secure payment with satisfaction guarantee",
                icon: <Shield className="w-12 h-12 text-blue-600" />,
              },
            ].map((item, index) => (
              <div key={index} className="space-y-4">
                <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <Link href="/services">
            <Button className="mt-8 bg-blue-600 hover:bg-blue-700" size="lg">
              Book Appointment
            </Button>
          </Link>
        </div>
      </section>

      {/* Your Dog's Favorite Daily Adventure */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Your Dog's Favorite Daily Adventure</h2>
              <p className="text-gray-600 leading-relaxed">
                Give your furry friend the exercise and socialization they need with our professional dog walking
                services. Our experienced walkers ensure your pet gets the perfect amount of activity and attention.
              </p>
              <Link href="/services">
                <Button className="bg-orange-500 hover:bg-orange-600">Learn More</Button>
              </Link>
            </div>
            <div>
              <img src="/happy-dog-park-run.png" alt="Dog adventure" className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Peace of Mind Grooming */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/pet-grooming-service.png" alt="Pet grooming" className="w-full h-auto rounded-lg" />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Peace of Mind Grooming: Your Pets are 100% Safe</h2>
              <div className="space-y-4">
                {[
                  { icon: <Award className="w-6 h-6" />, text: "Certified Professional Groomers" },
                  { icon: <Shield className="w-6 h-6" />, text: "Safe and Sanitized Equipment" },
                  { icon: <Heart className="w-6 h-6" />, text: "Gentle Care for All Pet Types" },
                  { icon: <CheckCircle className="w-6 h-6" />, text: "100% Satisfaction Guarantee" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-orange-400">{item.icon}</div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <Link href="/services">
                <Button className="bg-orange-500 hover:bg-orange-600">Book Appointment</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Latest Blog</h2>
            <p className="text-gray-600">Stay updated with the latest pet care tips and insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Top Training Tips for New Puppies",
                image: "/puppy-training.png",
              },
              {
                title: "Best Diet Plans for Senior Dogs",
                image: "/placeholder-g57h7.png",
              },
              {
                title: "How to Keep Your Cat Happy Indoors",
                image: "/happy-indoor-cat.png",
              },
              {
                title: "Essential Pet Care During Winter",
                image: "/pet-winter-care.png",
              },
            ].map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                    <Link href="/blog" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Read More <ArrowRight className="w-4 h-4 inline ml-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/blog">View All Blog</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Satisfaction Stats */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "100%", label: "Satisfaction Rate" },
              { number: "500+", label: "Happy Customers" },
              { number: "24/7", label: "Support Available" },
              { number: "1000+", label: "Services Completed" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Valuable Words From Customers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                text: "Amazing service! My dog Max loves his daily walks with the team. Professional and caring.",
                rating: 5,
                avatar: "/diverse-woman-smiling.png",
              },
              {
                name: "Mike Chen",
                text: "The grooming service is top-notch. My cat has never looked better and the staff is so gentle.",
                rating: 5,
                avatar: "/smiling-man.png",
              },
              {
                name: "Emily Davis",
                text: "Reliable pet sitting service. I can travel worry-free knowing my pets are in good hands.",
                rating: 5,
                avatar: "/happy-woman.png",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "What services do you offer?",
                answer:
                  "We offer comprehensive pet care services including pet sitting, dog walking, grooming, pet taxi, and boarding services.",
              },
              {
                question: "Are your pet sitters insured and bonded?",
                answer:
                  "Yes, all our pet care professionals are fully licensed, insured, and bonded for your peace of mind.",
              },
              {
                question: "How do I book a service?",
                answer:
                  "You can easily book through our website or mobile app. Simply select your service, choose a provider, and schedule your appointment.",
              },
              {
                question: "What if I need to cancel or reschedule?",
                answer:
                  "We offer flexible cancellation and rescheduling options. Please contact us at least 24 hours in advance for changes.",
              },
              {
                question: "Do you provide emergency pet care?",
                answer:
                  "Yes, we offer 24/7 emergency pet care services. Contact our emergency hotline for immediate assistance.",
              },
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-yellow-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Connect Our Newsletter</h2>
          <p className="text-gray-700 mb-8">Stay updated with pet care tips, special offers, and the latest news</p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email" className="flex-1" />
            <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
