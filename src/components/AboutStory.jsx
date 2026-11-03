import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Award, Heart, Sparkles, Star } from "lucide-react";
import storyImage from "../assets/imageone.jpeg";

const values = [
  {
    icon: Sparkles,
    title: "Grace in every detail",
    description: "Thoughtful looks, delicate details and a finish that feels special.",
  },
  {
    icon: Heart,
    title: "Made to feel like you",
    description: "Easy-to-love ethnic styles for the moments that matter to you.",
  },
  {
    icon: Award,
    title: "Tradition, beautifully reimagined",
    description: "A fresh expression of Indian occasion wear with timeless charm.",
  },
];

const AboutStory = () => (
  <main className="about-page overflow-hidden bg-[#fff9f8] text-[#481d27]">
    <section className="about-hero relative isolate min-h-[min(760px,calc(100vh-5rem))] overflow-hidden">
      <div className="about-glow about-glow-one" aria-hidden="true" />
      <div className="about-glow about-glow-two" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[min(760px,calc(100vh-5rem))] max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.92fr] lg:gap-16 lg:px-12 lg:py-20">
        <div className="about-copy relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-900 shadow-sm backdrop-blur">
            <Sparkles size={14} className="text-rose-700" />
            A little story, stitched with love
          </div>

          <h1 className="font-serif text-5xl font-medium leading-[1.08] tracking-tight text-[#481d27] sm:text-6xl lg:text-7xl">
            Indian elegance,
            <span className="mt-2 block italic text-[#a44d60]">made personal.</span>
          </h1>

          <p className="mt-7 max-w-xl text-sm leading-7 text-[#71525a] sm:text-base sm:leading-8">
            Shanaya Collection celebrates the beauty of dressing up and the
            confidence that comes with feeling truly yourself. We bring together
            the spirit of Indian style and a graceful, modern touch—so every
            occasion can feel a little more special.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#71525a] sm:text-base sm:leading-8">
            From festive lehngas and cholis to elegant suits and saris, discover
            looks chosen for your celebrations, your traditions and your
            unforgettable everyday moments.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 rounded-full bg-[#651f31] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(101,31,49,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-[#4c1726] hover:shadow-[0_18px_36px_rgba(101,31,49,0.28)]"
            >
              Explore the collection
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#our-promise"
              className="inline-flex items-center gap-2 px-2 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#754553] transition hover:text-[#a44d60]"
            >
              Our promise <ArrowDown size={14} />
            </a>
          </div>
        </div>

        <div className="about-art relative mx-auto w-full max-w-[500px] [perspective:1200px]">
          <div className="about-orbit about-orbit-one" aria-hidden="true" />
          <div className="about-orbit about-orbit-two" aria-hidden="true" />
          <div className="about-photo-card group relative mx-auto aspect-[0.78] w-[78%] max-w-[360px] rounded-[11rem_11rem_2rem_2rem] border border-white/80 bg-white p-2.5 shadow-[0_35px_80px_rgba(83,38,49,0.2)]">
            <div className="h-full overflow-hidden rounded-[10rem_10rem_1.5rem_1.5rem] bg-[#ead9d8]">
              <img
                src={storyImage}
                alt="A look from the Shanaya Collection"
                className="h-full w-full object-cover object-top transition duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-2.5 rounded-[10rem_10rem_1.5rem_1.5rem] bg-gradient-to-t from-[#38101f]/45 via-transparent to-white/10" />
            </div>
          </div>

          <div className="about-note absolute -left-1 top-[18%] rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-[0_15px_40px_rgba(83,38,49,0.12)] backdrop-blur-md sm:-left-4">
            <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#754553]">
              <Star size={13} className="fill-[#c89462] text-[#c89462]" />
              Your moment. Your style.
            </span>
          </div>
          <div className="about-note about-note-lower absolute -right-1 bottom-[13%] flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-[0_15px_40px_rgba(83,38,49,0.14)] backdrop-blur-md sm:-right-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7e9e9] text-[#8c4054]">
              <Heart size={17} />
            </span>
            <span className="font-serif text-sm italic text-[#633342]">Wear your elegance</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 h-px w-[min(88%,1100px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
    </section>

    <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a44d60]">
            The Shanaya feeling
          </span>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-[#481d27] sm:text-5xl">
            Style that celebrates <span className="italic text-[#a44d60]">you.</span>
          </h2>
          <p className="mt-5 text-sm leading-7 text-[#80636a] sm:text-base">
            We believe what you wear should feel as lovely as the memory you are
            making. That is the thought behind every collection at Shanaya.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }, index) => (
            <article
              key={title}
              className="about-value-card group rounded-3xl border border-rose-100 bg-white/80 p-7 shadow-[0_12px_38px_rgba(83,38,49,0.06)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(83,38,49,0.12)] sm:p-8"
              style={{ "--card-delay": `${index * 120}ms` }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fbefef] text-[#874052] transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
                <Icon size={21} strokeWidth={1.7} />
              </span>
              <h3 className="mt-6 font-serif text-xl text-[#572735]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#80636a]">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section id="our-promise" className="relative overflow-hidden bg-[#531c2d] px-5 py-16 text-center text-white sm:px-8 sm:py-20">
      <div className="about-promise-glow" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-rose-200">
          Our promise to you
        </span>
        <p className="mt-5 font-serif text-3xl leading-snug sm:text-5xl">
          “Wear your elegance.
          <span className="block italic text-rose-200">Own your moment.”</span>
        </p>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-rose-100/80 sm:text-base">
          Thank you for making Shanaya Collection part of your story. We are
          here to help you find something that feels beautiful, meaningful and
          unmistakably yours.
        </p>
        <Link
          to="/shop"
          className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/40 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition duration-300 hover:border-white hover:bg-white hover:text-[#531c2d]"
        >
          Find your favourite
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  </main>
);

export default AboutStory;
