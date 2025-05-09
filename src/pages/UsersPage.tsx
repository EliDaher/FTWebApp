import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User } from "../types/user"

export default function UsersPage() {

    const [searchTerm, setSearchTerm] = useState('')
    const [users, setUsers] = useState<User[]>([])
    const navigate = useNavigate()  

    
    const getALlUsers = async () => {
        try {
            const response = await axios.get('https://ftserver-ym6z.onrender.com/getAllUsers');
            const usersArray = Object.values(response.data.usersData) as User[];
            setUsers(usersArray)
            
        } catch (error: any) {
            alert('حدث خطأ أثناء جلب البرامج التدريبية');
            console.log(error)
        }
    }

    useEffect(() => {
        getALlUsers()
    }, [])  



    const filteredUsers = users.filter(user =>
      user.fullname.includes(searchTerm) ||
      user.username.includes(searchTerm)
    )   
    const handleRowClick = (user: User) => {
      navigate(`/user/${user.username}`, { state: user.workouts })

    }   
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white flex flex-col p-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-center">المستخدمين</h1>
          </div>  
          <input
            type="text"
            placeholder="ابحث عن مستخدم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 mb-6 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />  
          <div className="overflow-x-auto">
            <table className="w-full text-center border border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="py-3 px-4 border-b border-gray-700">الاسم</th>
                  <th className="py-3 px-4 border-b border-gray-700">اسم المستخدم</th>
                  <th className="py-3 px-4 border-b border-gray-700">الوزن</th>
                  <th className="py-3 px-4 border-b border-gray-700">الطول</th>
                  <th className="py-3 px-4 border-b border-gray-700">الوظيفة</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr
                        key={user.username}
                        onClick={() => handleRowClick(user)}
                        className="cursor-pointer hover:bg-gray-800 transition"
                    >   
                        <td className="py-2 px-4 border-b border-gray-700">{user.fullname}</td>
                        <td className="py-2 px-4 border-b border-gray-700">{user.username}</td>
                        <td className="py-2 px-4 border-b border-gray-700">{user.weight}</td>
                        <td className="py-2 px-4 border-b border-gray-700">{user.height}</td>
                        <td className="py-2 px-4 border-b border-gray-700">{user.job}</td>
                    </tr>
                  ))
                ) : (
                    <tr>
                        <td colSpan={5} className="py-4 text-gray-400">لا يوجد نتائج</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    )
}
