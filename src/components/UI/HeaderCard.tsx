
export default function HeaderCard({children, className}:any) {
  return (
    <div className={`bg-white/20 border-2 border-white/80 my-5 py-3 rounded-xl ${className}`}>
      {children}
    </div>
  )
}
