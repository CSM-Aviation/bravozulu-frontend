import Link from 'next/link'

export default function Hero() {
  return (
    <div className="relative bg-gray-900">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/Hero_image.avif')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gray-900/75" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-30 px-4 sm:py-40 lg:py-60 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Perfection is in the Detail
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-3xl">
          From single engine Cessna&quot;s to Gulfstreams and everything in between, 
          we take care of your aircraft&quot;s detailing needs from start to finish, inside and out.
        </p>
        <div className="mt-10 flex gap-4">
          <Link 
            href="/Quote" 
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700"
          >
            Get a Quote
          </Link>
          <Link 
            href="/services" 
            className="bg-white text-gray-900 px-8 py-3 rounded-md hover:bg-gray-100"
          >
            View Services
          </Link>
        </div>
      </div>
    </div>
  )
}
