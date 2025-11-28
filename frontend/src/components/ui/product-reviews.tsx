'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Star, ThumbsUp, User, CheckCircle, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
}

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ 
    averageRating: 0, 
    totalReviews: 0, 
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } 
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    rating: 5,
    title: '',
    comment: '',
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://kolaq-project-production.up.railway.app';

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${apiUrl}/reviews/product/${productId}`);
        
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
          setStats(data.stats || { averageRating: 0, totalReviews: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, apiUrl]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.userName.trim() || !formData.userEmail.trim() || !formData.comment.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userName: formData.userName.trim(),
          userEmail: formData.userEmail.trim(),
          rating: formData.rating,
          title: formData.title.trim() || undefined,
          comment: formData.comment.trim(),
        }),
      });

      if (response.ok) {
        toast.success('Thank you! Your review has been submitted and is pending approval.');
        setShowForm(false);
        setFormData({ userName: '', userEmail: '', rating: 5, title: '', comment: '' });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm', interactive = false) => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={interactive ? () => setFormData(prev => ({ ...prev, rating: star })) : undefined}
            className={`${starSize} ${interactive ? 'cursor-pointer' : ''} ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Customer Reviews</h2>
          <div className="flex items-center gap-3 mt-2">
            {renderStars(Math.round(stats.averageRating), 'lg')}
            <span className="text-sm text-slate-600">
              {stats.averageRating.toFixed(1)} out of 5 ({stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
        >
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border-t border-slate-200 pt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Your Name *</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Email *</label>
              <input
                type="email"
                value={formData.userEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Rating *</label>
            <div className="flex items-center gap-2">
              {renderStars(formData.rating, 'lg', true)}
              <span className="text-sm text-slate-600">{formData.rating} star{formData.rating !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Review Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Sum up your review in a few words"
              className="w-full rounded-[16px] border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Your Review *</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              placeholder="Share your experience with this product..."
              className="w-full rounded-[16px] border border-slate-200 px-3 py-2 text-sm"
              required
              minLength={10}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-slate-600">
          <p className="text-sm">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-t border-slate-200 pt-4 first:border-t-0 first:pt-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{review.userName}</p>
                      {review.isVerified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" /> Verified Purchase
                        </span>
                      )}
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                  {review.title && <p className="font-medium text-slate-800">{review.title}</p>}
                  <p className="text-sm text-slate-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
