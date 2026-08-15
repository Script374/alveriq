import Image from "next/image";
import Link from "next/link";

// NOTE: add these two images to /public/images/home/
// shop-men.jpg and shop-women.jpg (any tall lifestyle photo works)
export default function GenderSplit() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2">

      <Link
        href="/shop"
        className="group relative block aspect-[4/5] overflow-hidden sm:aspect-[3/4]"
      >
        <Image
          src="/images/home/shop-men.jpg"
          alt="Shop Men"
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/35" />

        <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
          <p className="font-display text-sm italic text-white/90">
            Shop
          </p>
          <h3 className="!text-white text-4xl uppercase tracking-tight sm:text-5xl">
            Men
          </h3>
        </div>
      </Link>

      <Link
        href="/shop"
        className="group relative block aspect-[4/5] overflow-hidden sm:aspect-[3/4]"
      >
        <Image
          src="/images/home/shop-women.jpg"
          alt="Shop Women"
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/35" />

        <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
          <p className="font-display text-sm italic text-white/90">
            Shop
          </p>
          <h3 className="!text-white text-4xl uppercase tracking-tight sm:text-5xl">
            Women
          </h3>
        </div>
      </Link>

    </section>
  );
}