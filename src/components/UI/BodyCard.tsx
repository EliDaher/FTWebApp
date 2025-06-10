
export default function BodyCard({children, className}:any) {
  return (
    <div className={`bg-white/20 border-2 border-white/80 p-4 rounded-xl backdrop-blur-xl ${className}`}>
      {children}
    </div>
  )
}
