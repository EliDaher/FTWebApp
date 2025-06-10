import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User } from "../types/user"
import ScreenWrapper from "../components/ScreenWrapper"
import HeaderCard from "../components/UI/HeaderCard"
import BodyCard from "../components/UI/BodyCard"
import Input from "../components/UI/Input"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const navigate = useNavigate()

  const getAllUsers = async () => {
    try {
      const response = await axios.get("https://ftserver-ym6z.onrender.com/getAllUsers")
      const usersArray = Object.values(response.data.usersData) as User[]
      setUsers(usersArray)
    } catch (error: any) {
      alert("حدث خطأ أثناء جلب المستخدمين")
      console.log(error)
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.fullname.includes(searchTerm) || user.username.includes(searchTerm)
  )

  const handleRowClick = (user: User) => {
    navigate(`/user/${user.username}`, { state: user.workouts })
  }

  return (
    <ScreenWrapper>
      <div className="">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <HeaderCard>
          {/* العنوان */}
            <h1 className="text-4xl font-bold text-center text-blue-50 font-Orbitron drop-shadow-lg">
              المستخدمين
            </h1>
          </HeaderCard>
          <BodyCard>

            {/* حقل البحث */}
            <div className="mb-4">
              <Input
                name="search"
                label="بحث"
                type="text"
                placeholder="ابحث باسم المستخدم أو الاسم الكامل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* الجدول */}
            <div className="overflow-x-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl">
              <table className="min-w-full text-sm md:text-base text-center">
                <thead className="bg-black/40 backdrop-blur-sm text-white font-bold">
                  <tr>
                    <th className="py-4 px-4 border-b border-white/20">الاسم الكامل</th>
                    <th className="py-4 px-4 border-b border-white/20">اسم المستخدم</th>
                    <th className="py-4 px-4 border-b border-white/20">الوزن</th>
                    <th className="py-4 px-4 border-b border-white/20">الطول</th>
                    <th className="py-4 px-4 border-b border-white/20">الوظيفة</th>
                  </tr>
                </thead>
                <tbody className="text-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.username}
                        onClick={() => handleRowClick(user)}
                        className="hover:bg-blue-500/15 bg-black/20 cursor-pointer transition"
                      >
                        <td className="py-3 px-4 border-b border-white/10">{user.fullname}</td>
                        <td className="py-3 px-4 border-b border-white/10">{user.username}</td>
                        <td className="py-3 px-4 border-b border-white/10">{user.weight}</td>
                        <td className="py-3 px-4 border-b border-white/10">{user.height}</td>
                        <td className="py-3 px-4 border-b border-white/10">{user.job}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-gray-300 font-cairo">لا يوجد نتائج مطابقة</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </BodyCard>
        </div>
      </div>
    </ScreenWrapper>
  )
}
