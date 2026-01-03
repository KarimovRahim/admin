import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetUser, DeleteUser } from './api/index.js';

const App = () => {
  const dispatch = useDispatch();
  const {
    users,
    loading,
    error,
    deleteLoading,
    deleteError
  } = useSelector(state => state.users);

  const [openIndex, setOpenIndex] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(GetUser());
  }, [dispatch]);

  const handleDeleteUser = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      setDeletingId(id);
      dispatch(DeleteUser(id))
        .then(() => {
          setDeletingId(null);
        })
        .catch(() => {
          setDeletingId(null);
        });
    }
  };

  const handleRowClick = (index, e) => {
    if (e.target.closest('button.delete-btn')) {
      return;
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex flex-col gap-7">
          <div className="w-full h-10 flex flex-row items-center gap-5 border-b">
            <label className="font-semibold text-[37px]">Loading Users...</label>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex flex-col gap-7">
          <div className="w-full h-10 flex flex-row items-center gap-5 border-b">
            <label className="font-semibold text-[37px] text-red-600">Error: {error}</label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {deleteError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Ошибка удаления: {deleteError}
        </div>
      )}

      <div className="flex flex-col gap-7">
        <div className="w-full h-10 flex flex-row justify-between items-center gap-5 border-b">
          <label className="font-semibold text-[37px]">Admins Table</label>
          <span className="font-semibold text-[20px] text-gray-600">({users.length} users)</span>
        </div>

        <div className="flex flex-col gap-4">
          {users.map((user, index) => (
            <div key={user.id} className="w-full border rounded-lg overflow-hidden shadow-md">
              {/* Вместо button используем div с обработчиком клика */}
              <div
                onClick={(e) => handleRowClick(index, e)}
                className="w-full flex flex-row justify-between items-center px-4 py-3 bg-gray-100 font-semibold text-gray-800 cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {user.login?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span>{user.login || 'Unknown User'}</span>
                  {deletingId === user.id && (
                    <span className="text-sm text-red-600 font-normal">(удаление...)</span>
                  )}
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleDeleteUser(user.id, e)}
                    disabled={deleteLoading && deletingId === user.id}
                    className="delete-btn px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading && deletingId === user.id ? '...' : 'Удалить'}
                  </button>
                  <span className={`transition-transform duration-300 ${openIndex === index ? "rotate-90" : "rotate-0"}`}>
                    ▶
                  </span>
                </div>
              </div>

              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-60 p-4" : "max-h-0 p-0"} bg-gray-50 text-gray-700`}>
                <div className="space-y-2">
                  <div className="flex gap-4">
                    <div className="font-medium text-gray-800">ID:</div>
                    <div className="font-mono">{user.id || 'N/A'}</div>
                  </div>
                  {user.phoneNumber && (
                    <div className="flex gap-4">
                      <div className="font-medium text-gray-800">Phone:</div>
                      <div>{user.phoneNumber}</div>
                    </div>
                  )}
                  {user.createdAt && (
                    <div className="flex gap-4">
                      <div className="font-medium text-gray-800">Created:</div>
                      <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;