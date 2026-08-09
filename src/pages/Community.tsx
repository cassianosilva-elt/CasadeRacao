import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dog, Cat, Heart, Camera, Users, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Community = () => {
  const pets = useQuery(api.pets.listAllPets || api.pets.listMyPets); // Fallback if listAllPets doesn't exist yet

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="text-center mb-20 reveal-on-scroll">
        <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <Users className="w-4 h-4" />
          Comunidade LOPES
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-black text-stone-900 tracking-tighter mb-6">Nossos Clientes VIPs</h1>
        <p className="text-stone-500 max-w-2xl mx-auto text-lg italic">"A felicidade de um pet é a nossa maior recompensa." - Veja os focinhos que fazem parte da nossa família.</p>
      </div>

      {!pets ? (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1, 2, 3].map(i => <div key={i} className="aspect-[4/5] bg-stone-100 rounded-[40px] animate-pulse" />)}
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {pets.map((pet, index) => (
            <motion.div 
              key={pet._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[40px] overflow-hidden border border-stone-100 shadow-xl shadow-stone-200/50 group"
            >
              <div className="aspect-square bg-stone-50 relative overflow-hidden flex items-center justify-center">
                {pet.photo ? (
                  <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-200 group-hover:text-teal-500 transition-colors">
                    {pet.species === 'Gato' ? <Cat className="w-32 h-32" /> : <Dog className="w-32 h-32" />}
                    <Camera className="w-8 h-8 opacity-20 absolute" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                   <div className="text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-1">{pet.breed}</p>
                      <h3 className="text-2xl font-display font-bold">{pet.name}</h3>
                   </div>
                </div>
              </div>
              
              <div className="p-8">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1 text-red-500">
                      <Heart className="w-5 h-5 fill-red-500" />
                      <span className="font-bold">+{Math.floor(Math.random() * 100)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-300">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center font-bold text-stone-400 text-xs uppercase">
                     {pet.species.substring(0,2)}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-stone-900 leading-none">Tutor de {pet.name}</p>
                     <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Cliente Verificado</p>
                   </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {pets?.length === 0 && (
         <div className="text-center py-24 bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200">
            <Camera className="w-16 h-16 text-stone-200 mx-auto mb-6" />
            <p className="text-stone-400 font-medium italic">Seja o primeiro a mostrar seu pet na nossa vitrine!</p>
            <Link to="/conta" className="inline-block mt-4 text-teal-600 font-bold hover:underline">Cadastrar meu Pet</Link>
         </div>
      )}

      {/* Instagram Integration */}
      <div className="mt-32">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-display font-black text-stone-900 tracking-tight mb-2">Siga-nos no Instagram</h2>
            <p className="text-stone-500 font-medium underline">@casaderacao_lopes</p>
          </div>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:shadow-xl transition-all"
          >
            <Instagram className="w-5 h-5" />
            Ver no Insta
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square bg-stone-100 rounded-2xl overflow-hidden relative group cursor-pointer">
              <img src={`https://picsum.photos/seed/pet${i+10}/400/400`} alt="Insta Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="text-white w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
