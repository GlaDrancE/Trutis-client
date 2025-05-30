import { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown, User, Mail, Phone, Search, Star, Users, MessageSquare } from 'lucide-react';
import { useCustomerStore } from '@/store';
import { CustomerData } from 'types';

const ReviewPage = () => {
  const [reviews, setReviews] = useState<CustomerData[]>([]);
  const [filter, setFilter] = useState<'all' | 'liked' | 'disliked'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for popup image
  const { customers, isLoading } = useCustomerStore();

  useEffect(() => {
    // const fetchReviews = async () => {
    //   try {
    //     if (clientId) {
    //       const response = await fetchReviewsFromClientId(clientId);
    //       console.log(response.data);
    //       const data = await response.data;
    //       setReviews(data.customers);
    //     }
    //   } catch (error) {
    //     console.error('Failed to fetch reviews:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchReviews();

    setReviews(customers)

  }, [customers]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.email.toLowerCase().includes(searchTerm.toLowerCase());

    const hasReview = review.Reviews && review.Reviews.length > 0;

    if (filter === 'liked') {
      return matchesSearch && !hasReview;
    } else if (filter === 'disliked') {
      return matchesSearch && hasReview;
    }
    return matchesSearch;
  });

  const stats = {
    total: reviews.length,
    liked: reviews.filter(r => !r.Reviews || r.Reviews.length === 0).length,
    disliked: reviews.filter(r => r.Reviews && r.Reviews.length > 0).length,
  };

  // Handle image click to open popup
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  // Close popup when clicking outside
  const handleClosePopup = () => {
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl shadow-lg p-6 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold dark:bg-gradient-to-r dark:from-blue-400 dark:to-indigo-400 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Customer Feedback Dashboard
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-8 max-sm:gap-1">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                <div className="text-sm text-gray-500 dark:text-white">Total Reviews</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-50">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.liked}</div>
                <div className="text-sm text-gray-500 dark:text-white">Positive</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-50">
                <MessageSquare className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.disliked}</div>
                <div className="text-sm text-gray-500 dark:text-white">Feedback</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 bg-transparent py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'liked', 'disliked'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as typeof filter)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${filter === f
                    ? f === 'liked'
                      ? 'bg-green-600 text-white'
                      : f === 'disliked'
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                    : 'bg-gray-50 dark:bg-gray-700 hover:dark:bg-gray-800 dark:text-white text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-lg font-semibold">
                    {review.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{review.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-300">{formatDate(review.createdAt.toString())}</p>
                  </div>
                  <div className={`p-1.5 rounded-full ${!review.Reviews || review.Reviews.length === 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {!review.Reviews || review.Reviews.length === 0 ? (
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <ThumbsDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-200 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{review.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{review.phone}</span>
                  </div>
                </div>

                {review.Reviews && review.Reviews.length > 0 ? (
                  <div className="bg-red-50 dark:bg-black rounded-lg p-3">
                    <p className="text-sm text-gray-700 dark:text-white italic line-clamp-3">"{review.Reviews[0].review}"</p>
                  </div>
                ) : review.reviewImage && (
                  <div
                    className="relative h-32 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(review.reviewImage)}
                  >
                    <img
                      src={review.reviewImage}
                      alt="Review"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className=" bg-transparent rounded-2xl shadow-lg p-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Reviews Found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No reviews match your search criteria' : 'No reviews have been submitted yet'}
            </p>
          </div>
        )}
      </div>

      {/* Image Popup */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleClosePopup}
        >
          <div
            className="max-w-3xl max-h-[90vh] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
          >
            <img
              src={selectedImage}
              alt="Full Review"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;