import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { format, differenceInDays } from 'date-fns';
import type { UserProfile } from '../types';
import toast from 'react-hot-toast';


const ApplicationTracker = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const SAFE_DAYS_THRESHOLD = 90;


  useEffect(() => {
    fetchProfile();
  }, []);


  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get<UserProfile>('/api/profile/');
      console.log(res);
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const pingApplicationDate = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatePromise = async (): Promise<UserProfile> => {
      const response = await api.put<UserProfile>('/api/profile/', {
        last_application_date: today,
      });
      return response.data;
    };

    toast.promise(updatePromise(), {
      loading: 'Updating date...',
      success: (res) => {
        setProfile(res);
        return <b>Date updated successfully!</b>
      },
      error: <b>Could not update the date.</b>,
    });
  };

  const getStatus = () => {
    if (!profile || !profile.last_application_date) {
      return { text: "No date set", daysAgo: null, isSafe: true, color: 'text-gray-500' };
    }

    const lastDate = new Date(`${profile.last_application_date}T00:00:00`);
    const daysAgo = differenceInDays(new Date(), lastDate);
    const isSafe = daysAgo >= SAFE_DAYS_THRESHOLD;

    return {
      text: isSafe ? "Safe to Apply" : `Wait(${SAFE_DAYS_THRESHOLD - daysAgo} days left)`,
      daysAgo: daysAgo,
      isSafe: isSafe,
      color: isSafe ? 'text-green-500' : 'text-yellow-500',
    };
  };


  const status = getStatus();

  if (loading) {
    return <div>Loading Application Status...</div>
  }


  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Application Timing Tracker</h2>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-white">
            Last Application:
            <span className="font-semibold ml-2">
              {profile && profile.last_application_date ?
                `${format(new Date(`${profile.last_application_date}T00:00:00`),
                  'MMMM d, yyyy')} 
              (${status.daysAgo} days ago)` : "Not set"}
            </span>
          </p>
          <p className={`text-lg font-bold mt-1 ${status.color ? status.color : "text-white"}`}>
            Status: {status.text}
          </p>
        </div>
        <button
          onClick={pingApplicationDate}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ping Application Date
        </button>
      </div>
      <p className="text-xs text-white mt-4">
        Clicking the button updates your last application date to
        today. Current safe period is set to {SAFE_DAYS_THRESHOLD} days.
      </p>
    </div>
  );
};






export default ApplicationTracker;
