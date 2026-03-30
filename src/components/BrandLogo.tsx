import ironLogo from "../assets/iron-logo.jpeg";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  showText?: boolean;
};

export default function BrandLogo({
  className = "",
  imageClassName = "",
  showText = true,
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={ironLogo}
        alt="شعار آيرون فيتنس جيم"
        className={`h-12 w-12 rounded-full border border-yellow-300/35 object-contain bg-black ${imageClassName}`}
        loading="eager"
        decoding="async"
      />

      {showText ? (
        <div className="leading-tight">
          <p className="font-Orbitron text-sm font-black tracking-[0.14em] text-yellow-300">IRON FITNESS GYM</p>
          <p className="text-[11px] tracking-[0.14em] text-yellow-100/80">القوة والانضباط</p>
        </div>
      ) : null}
    </div>
  );
}
