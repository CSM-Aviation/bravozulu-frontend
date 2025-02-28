import ServicesCarousel from '../ServicesCarousel';

const ServicesSection = () => {
  return (
    <section className="container mx-auto px-4 pb-28">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Our Services
      </h2>

      <div className="mb-28 text-center">
        <h3 className="mb-2 text-4xl font-semibold">
          Professional detailing services for your
        </h3>
        <p className="text-4xl font-semibold text-[#3E2EFF]">
          most valued possessions
        </p>
      </div>

      <ServicesCarousel />
    </section>
  );
};

export default ServicesSection;
