import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ArrowLeft, Star, Search, Trash2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminReviews = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  
  const reviews = useQuery(api.reviews.listAllReviews);
  const deleteReview = useMutation(api.reviews.deleteReviewAdmin);

  const filteredReviews = reviews?.filter((review: any) => {
    const matchesSearch = review.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === null || review.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 -ml-2 text-stone-500 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="font-display font-black text-xl text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-teal-600" />
                Avaliações
                {reviews && (
                  <span className="text-sm font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full ml-2">
                    {reviews.length}
                  </span>
                )}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setFilterRating(null)}
              className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
                filterRating === null
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              Todas
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1 ${
                  filterRating === rating
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {rating}
                <Star className="w-3 h-3 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {!reviews ? (
          <div className="text-center py-12 text-stone-500">Carregando avaliações...</div>
        ) : filteredReviews?.length === 0 ? (
          <div className="text-center py-12 text-stone-500">Nenhuma avaliação encontrada.</div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredReviews?.map((review: any) => (
                <motion.div
                  key={review._id}
                  variants={itemVariants}
                  layout
                  className="admin-card !p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="font-bold text-stone-900">{review.userName || 'Anônimo'}</h3>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'fill-stone-200 text-stone-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-stone-700 text-sm">{review.text}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-stone-500">
                        <span className="font-mono bg-stone-100 px-2 py-1 rounded">
                          Produto ID: {review.productId}
                        </span>
                        <span>
                          {new Date(review._creationTime).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
                          try {
                            await deleteReview({ reviewId: review._id });
                          } catch (e) {
                            alert('Erro ao excluir avaliação');
                          }
                        }
                      }}
                      className="p-2 shrink-0 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                      title="Excluir Avaliação"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
};
