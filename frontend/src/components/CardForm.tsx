import React, { useState } from 'react';
import api from '../api/axiosConfig';

interface Card {
  id: number;
  nickname: string;
  card_benefits: string;
}


interface CardFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  cardToEdit?: Card;

}


const CardForm = ({ onSuccess, onCancel, cardToEdit }: CardFormProps) => {
  const [nickname, setNickname] = useState(cardToEdit?.nickname || '');
  const [benefits, setBenefits] = useState(cardToEdit?.card_benefits || '');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!cardToEdit?.id) {
      try {
        console.log(`Nickname: ${nickname} | Benefits: ${benefits}`)
        await api.post('/api/cards/', {
          nickname: nickname,
          card_benefits: benefits,
        });
        onSuccess();
      } catch (err) {
        console.error('Failed to add card: ', err);
        setError('Could not add the card. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await api.put(`/api/cards/${cardToEdit?.id}/`, {
          nickname: nickname,
          card_benefits: benefits,
        });
        onSuccess()

      } catch (err) {
        console.error('Failed to edit card', err);
        setError("Could not edit the card. Please try again");

      } finally {
        setLoading(false);
      }
    }

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-gray-800 w-full max-w-lg p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-white">{cardToEdit ? "Edit Card" : "Add a new Card"}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-400">
              Card Nickname
            </label>
            <input
              id="nickname"
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md
              focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={cardToEdit ? cardToEdit.nickname : "e.g., Chase Sapphire Preferred"}
            />
          </div>
          <div>
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-400">
              Key Benefits
            </label>
            <textarea
              id="benefits"
              required
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700
              border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500
              focus:border-indigo-500"
              placeholder={cardToEdit ? cardToEdit.card_benefits : "e.g., 5% on groceries, 3x points on dining"}
              rows={3}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 font-bold text-gray-300 bg-gray-600
              rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 font-bold text-white bg-indigo-600
              rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {loading ? 'Saving...' : "Save Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default CardForm;
