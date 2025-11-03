import { useAuth } from '../AuthContext';
import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import CardForm from './CardForm';



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

    try {
      await api.patch(`api/cards/${cardID}/`, {
        "last_used": new Date().toISOString().split('T')[0],
      });
      fetchCards();
    } catch (err) {
      console.error("Failed to ping card: ", err);
      setError("Could not ping card!");

    } finally {
      setLoading(false);
    }

  }
  const handleDelete = async (cardID: number) => {

    if (!window.confirm("Are you sure?"))
      return
    try {

      await api.delete(`/api/cards/${cardID}/`);
      fetchCards();
      console.log("Deleted card: ", cardID);
    } catch (err) {
      console.error("Failed to delete card:", err);
      setError("Could not delete card");


    } finally {
      setLoading(false);
    }


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
                        onClick={() => handleDelete(card.id)}
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
