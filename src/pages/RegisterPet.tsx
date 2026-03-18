import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dog, Cat, ArrowRight, Loader2 } from 'lucide-react';

export const RegisterPet = () => {
  const [loading, setLoading] = useState(false);
  const addPet = useMutation(api.pets.addPet);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    species: "Cão",
    breed: "",
    age: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addPet(formData);
      navigate('/painel');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm text-center">
        <div className="w-16 h-16 text-orange-500 mx-auto mb-4 bg-orange-50 p-3 rounded-full flex items-center justify-center">
          <Dog className="w-8 h-8" />
        </div>
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Cadastre seu Pet</h1>
        <p className="text-stone-500 mb-8">Conte-nos um pouco sobre seu melhor amigo.</p>
        
        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="petName" className="block text-sm font-medium text-stone-700 mb-1">Nome do Pet</label>
            <input 
              id="petName" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" 
              placeholder="Ex: Rex, Mel..." 
            />
          </div>

          <div>
            <label htmlFor="species" className="block text-sm font-medium text-stone-700 mb-1">Espécie</label>
            <select 
              id="species"
              value={formData.species}
              onChange={(e) => setFormData({...formData, species: e.target.value})}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="Cão">Cão</option>
              <option value="Gato">Gato</option>
              <option value="Pássaro">Pássaro</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="breed" className="block text-sm font-medium text-stone-700 mb-1">Raça</label>
              <input 
                id="breed" 
                required 
                value={formData.breed}
                onChange={(e) => setFormData({...formData, breed: e.target.value})}
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                placeholder="Poodle, SRD..." 
              />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-stone-700 mb-1">Idade</label>
              <input 
                id="age" 
                required 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                placeholder="Ex: 2 anos" 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !formData.name}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Finalizar Cadastro
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
