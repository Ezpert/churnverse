import { useAuth } from '../AuthContext';
import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import CardForm from './CardForm';
import ApplicationTracker from './ApplicationTracker';
import ConfirmationModal from './ConfirmationModal';
import toast from 'react-hot-toast';





interface Card {
  id: number;
  nickname: string;
  card_benefits: string;
  last_used: string | null;
}

const Dashboard = () => {
  const { logout } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);

  const getBorderClass = (lastUsedDateString: string | null): string => {

    if (lastUsedDateString === null) {
      return "border-2 border-gray-600";
    }

    const today = new Date();
    const lastUsedDate = new Date(lastUsedDateString);

    const todayMilli = today.getTime();
    const lastUsedMilli = lastUsedDate.getTime();

    const daysPassed = (todayMilli - lastUsedMilli) / (1000 * 60 * 60 * 24);

    if (daysPassed <= 90) {
      return "border-2 border-green-500";
    } else if (daysPassed <= 150) {
      return "border-2 border-yellow-500";
    } else {
      return "border-2 border-red-500";
    }
  }


  const fetchCards = async () => {
    try {

      const response = await api.get('/api/cards/');
      setCards(response.data);

    } catch (err) {
      console.error('Failed to fetch cards: ', err);
      setError('Could not load card data.');

    } finally {
      setLoading(false);
    }

  };

  const handlePing = async (cardID: number) => {
    const pingPromise = async (): Promise<void> => {
      await api.patch(`api/cards/${cardID}/`, {
        "last_used": new Date().toISOString().split('T')[0],
      });
      return;
    }
    toast.promise(pingPromise(), {
      loading: "Pinging card...",
      success: () => {
        fetchCards();
        return <b>Card successfully pinged!</b>;
      },
      error: (err) => {
        console.error("Failed to ping card:", err);
        return <b>Could not ping card!</b>;
      },
    });
  }

  const handleDeleteClick = (cardID: number) => {
    setCardToDelete(cardID);
    setIsModalOpen(true);
  };


  const handleConfirmDelete = () => {
    if (cardToDelete === null) return;

    setIsModalOpen(false);

    const promise = api.delete(`/api/cards/${cardToDelete}/`);

    toast.promise(promise.then(() => cardToDelete), {
      loading: 'Deleting card...',
      success: () => {
        fetchCards()
        return <b>Card deleted successfully.</b>;
      },
      error: (err) => {
        console.error("Delete failed:", err);
        return <b>Could not delete card.</b>;
      },
    });

    setCardToDelete(null);
  };

  useEffect(() => {
    setLoading(true);
    fetchCards();
  }, []);


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 font-bold text-white bg-red-600
            rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </nav>
      </header>

      {isAddingCard && (
        <CardForm
          onSuccess={() => {
            setIsAddingCard(false);
            fetchCards();
          }}
          onCancel={() => setIsAddingCard(false)}
        />
      )}
      {cardToEdit && (
        <CardForm
          onSuccess={() => {
            setCardToEdit(null);
            fetchCards();
          }}
          onCancel={() => setCardToEdit(null)}
          cardToEdit={cardToEdit}
        />
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Card"
        message="Are you sure you want to delete this card? This action cannot be undone."
      />



      <main>
        <div className="flex items-center mb-6">
          <h2 className="text-3xl font-bold mb-6">Your Credit Cards</h2>
          <button
            onClick={() => setIsAddingCard(true)}
            className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md
            hover:bg-indigo-700"
          >
            + Add New Card
          </button>
        </div>
        <ApplicationTracker />
        {loading && <p>Loading cards...</p>}
        {error && <p className="text-red-500">{error}</p>}


        {!loading && !error && (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.length > 0 ? (
              cards.map((card) => {
                return (
                  <div key={card.id}
                    className={`bg-gray-800 rounded-lg shadow-md p-6 ${getBorderClass(card.last_used)}`}>
                    <h3 className="text-xl font-bold">{card.nickname}</h3>
                    <p className="text-gray-400 mt-2">{card.card_benefits}</p>
                    <p className="text-gray-400 mt-2">Last Used: {card.last_used ? card.last_used : "N/A"}</p>
                    <div>
                      <button
                        onClick={() => setCardToEdit(card)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(card.id)}
                      >
                        Delete!
                      </button>
                      <button

                        onClick={() => handlePing(card.id)}
                      >
                        Ping Card
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <p>You haven't added any cards yet.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
