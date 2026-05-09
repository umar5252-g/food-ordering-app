const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Have a question or feedback? We'd love to hear from you!
        </p>
        <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm border border-gray-100 text-left max-w-xl mx-auto">
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong className="text-gray-900">Email:</strong><br/>
              info@flavorpoint.com
            </p>
            <p className="text-gray-700">
              <strong className="text-gray-900">Phone:</strong><br/>
              +1 (555) 123-4567
            </p>
            <p className="text-gray-700">
              <strong className="text-gray-900">Address:</strong><br/>
              123 Flavor Street, Culinary City, FL 12345
            </p>
            <p className="text-gray-700 pt-4 border-t border-gray-100">
              <strong className="text-gray-900">Hours:</strong><br/>
              Mon - Fri: 10am - 10pm<br/>
              Sat - Sun: 11am - 11pm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
