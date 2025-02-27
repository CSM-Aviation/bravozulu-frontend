export const ImageGallery = ({ images, title }: { images: string[], title: string }) => {
    if (!images || images.length === 0) {
      return null;
    }
  
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-semibold text-blue-800">{title}</h4>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative overflow-hidden rounded-lg shadow-sm border border-gray-200 aspect-square"
              >
                <img
                  src={url}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                  <span className="text-white font-medium">View</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };